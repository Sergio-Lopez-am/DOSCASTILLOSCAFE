/* Dos Castillos · utilidades compartidas entre el menú y el panel de cocina.
   Transporte en vivo: ntfy.sh (sin servidor propio). Los datos del cliente viajan cifrados:
   el menú cifra con la llave pública de cocina y solo el panel (con la clave de cocina) los abre. */
(function () {
  const C = window.CONFIG, CAT = window.CATALOGO;
  const enc = new TextEncoder(), dec = new TextDecoder();

  const b64u = {
    to(buf) {
      const b = new Uint8Array(buf); let s = "";
      for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    },
    from(str) {
      const s = str.replace(/-/g, "+").replace(/_/g, "/");
      const bin = atob(s + "===".slice((s.length + 3) % 4));
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
  };

  const money = (n) => "$" + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

  // Índices del catálogo
  const prod = {}, adic = {};
  CAT.productos.forEach((p) => (prod[p.codigo] = p));
  CAT.adiciones.forEach((a) => (adic[a.codigo] = a));
  const catOf = (p) => CAT.categorias.find((c) => c.id === p.categoria);
  const permiteAdiciones = (p) => { const c = catOf(p); return !!c && c.grupo === "bebidas"; };

  // Precio de una línea calculado SIEMPRE desde el catálogo (la cocina no confía en el total del cliente)
  function lineaPrecio(l) {
    const p = prod[l.c]; if (!p) return null;
    const extras = (l.a || []).reduce((s, code) => s + (adic[code] ? adic[code].precio : 0), 0);
    return (p.precio + extras) * l.q;
  }
  function totalPedido(items) {
    let t = 0;
    for (const l of items) { const v = lineaPrecio(l); if (v == null) return null; t += v; }
    return t;
  }

  // ---------- Cifrado (ECDH P-256 + AES-GCM) ----------
  async function cifrarPedido(obj) {
    const pub = await crypto.subtle.importKey("jwk", C.llavePublica, { name: "ECDH", namedCurve: "P-256" }, false, []);
    const eph = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({ name: "ECDH", public: pub }, eph.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
    const ephRaw = await crypto.subtle.exportKey("raw", eph.publicKey);
    return ["v1", b64u.to(ephRaw), b64u.to(iv), b64u.to(ct)].join(".");
  }

  async function abrirLlaveCocina(clave) {
    const k = C.llaveCocina;
    const base = await crypto.subtle.importKey("raw", enc.encode(clave.trim()), "PBKDF2", false, ["deriveKey"]);
    const aes = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64u.from(k.sal), iterations: k.iter, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64u.from(k.iv) }, aes, b64u.from(k.datos)); // lanza si la clave es incorrecta
    const j = JSON.parse(dec.decode(plain));
    const priv = await crypto.subtle.importKey("pkcs8", b64u.from(j.d), { name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey"]);
    const mac = await crypto.subtle.importKey("raw", b64u.from(j.m), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
    return { priv, mac };
  }

  async function descifrarPedido(texto, llaves) {
    const [v, ephS, ivS, ctS] = String(texto).split(".");
    if (v !== "v1" || !ctS) throw new Error("formato");
    const eph = await crypto.subtle.importKey("raw", b64u.from(ephS), { name: "ECDH", namedCurve: "P-256" }, false, []);
    const key = await crypto.subtle.deriveKey({ name: "ECDH", public: eph }, llaves.priv, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64u.from(ivS) }, key, b64u.from(ctS));
    return JSON.parse(dec.decode(pt));
  }

  // Estados firmados por cocina (el cliente los lee; el panel ignora los que no tengan firma válida)
  const firmaTexto = (e) => e.i + "|" + e.s + "|" + e.t;
  async function firmarEstado(e, llaves) {
    const sig = await crypto.subtle.sign("HMAC", llaves.mac, enc.encode(firmaTexto(e)));
    return Object.assign({}, e, { h: b64u.to(sig).slice(0, 22) });
  }
  async function verificarEstado(e, llaves) {
    if (!e || !e.h) return false;
    const sig = await crypto.subtle.sign("HMAC", llaves.mac, enc.encode(firmaTexto(e)));
    return b64u.to(sig).slice(0, 22) === e.h;
  }

  // ---------- ntfy ----------
  const NTFY = "https://ntfy.sh/";
  async function publicar(topic, cuerpo, titulo, prioridad) {
    const headers = {};
    if (titulo) headers["Title"] = titulo.replace(/[^\x20-\x7E -ÿ]/g, "");
    if (prioridad) headers["Priority"] = prioridad;
    headers["Tags"] = "coffee";
    const r = await fetch(NTFY + topic, { method: "POST", body: cuerpo, headers });
    if (!r.ok) {
      const err = new Error("ntfy " + r.status); err.status = r.status; throw err;
    }
    return r.json();
  }

  // Suscripción SSE con reconexión y deduplicación por id de mensaje
  function suscribir(topics, desde, onMsg, onEstado) {
    let es, cerrado = false, ultimo = desde, espera = 1000;
    const vistos = new Set();
    function conectar() {
      if (cerrado) return;
      es = new EventSource(NTFY + topics.join(",") + "/sse?since=" + ultimo);
      es.onopen = () => { espera = 1000; onEstado && onEstado("vivo"); };
      es.onmessage = (ev) => {
        let d; try { d = JSON.parse(ev.data); } catch (_) { return; }
        if (d.event !== "message" || vistos.has(d.id)) return;
        vistos.add(d.id); ultimo = Math.max(0, d.time - 1);
        onMsg(d);
      };
      es.onerror = () => {
        onEstado && onEstado("reconectando");
        es.close();
        setTimeout(conectar, espera); espera = Math.min(espera * 2, 30000);
      };
    }
    conectar();
    return { cerrar() { cerrado = true; es && es.close(); } };
  }

  // Código corto de pedido, legible en voz alta (sin 0/O, 1/I)
  function nuevoCodigo() {
    const A = "ACDEFGHJKLMNPRTUVWXY34679", r = crypto.getRandomValues(new Uint8Array(4));
    return "DC-" + Array.from(r, (x) => A[x % A.length]).join("");
  }

  const ESTADOS = {
    nuevo: { txt: "Recibido" },
    prep: { txt: "En preparación" },
    listo: { txt: "Listo" },
    entregado: { txt: "Entregado" },
    cancelado: { txt: "Cancelado" }
  };
  const MODOS = { mesa: "En la mesa", recoger: "Para recoger", domicilio: "A domicilio" };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  window.DC = { b64u, money, prod, adic, catOf, permiteAdiciones, lineaPrecio, totalPedido,
    cifrarPedido, abrirLlaveCocina, descifrarPedido, firmarEstado, verificarEstado,
    publicar, suscribir, nuevoCodigo, ESTADOS, MODOS, esc, NTFY };
})();
