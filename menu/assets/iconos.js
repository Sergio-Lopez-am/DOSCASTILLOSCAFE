/* Ilustraciones de línea para productos sin foto (trazo dorado sobre fondo oscuro). */
(function () {
  const vapor = '<path d="M27 8c-2 3 2 5 0 8M33 6c-2 3 2 5 0 8M39 8c-2 3 2 5 0 8"/>';
  const s = (inner) => '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  window.ICONOS = {
    taza: s(vapor.replace(/M39[^"]+/, "") + '<path d="M20 26h22v7a11 11 0 0 1-22 0z"/><path d="M42 28h3a4 4 0 0 1 0 8h-4"/><path d="M13 48h36"/><path d="M18 48c2 3 6 4 13 4s11-1 13-4"/>'),
    mug: s(vapor + '<path d="M18 22h26v20a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z"/><path d="M44 27h3a6 6 0 0 1 0 12h-3"/><path d="M18 28h26"/>'),
    latte: s(vapor + '<path d="M12 28h36c0 11-7 19-18 19s-18-8-18-19z"/><path d="M48 31h2a4 4 0 0 1 0 8h-4"/><path d="M10 53h40"/><path d="M30 38c-4-3-5-6-2-7 1 0 2 1 2 2 0-1 1-2 2-2 3 1 2 4-2 7z"/>'),
    te: s('<path d="M12 30h34c0 10-7 17-17 17s-17-7-17-17z"/><path d="M46 33h2a4 4 0 0 1 0 8h-4"/><path d="M10 53h38"/><path d="M34 30 40 14"/><path d="M38 9h7v7h-7z"/><path d="M22 22c3-2 6-2 8 0-2 2-5 2-8 0z"/>'),
    vaso: s('<path d="M19 12h26l-4 42H23z"/><path d="M38 4l-4 26"/><path d="M25 26l6 1-1 6-6-1z"/><path d="M33 34l6 1-1 6-6-1z"/><path d="M24 40l5 1-1 5-5-1z"/><path d="M21 20h22"/>'),
    jugo: s('<path d="M20 20h22l-3 34H23z"/><circle cx="43" cy="18" r="8"/><path d="M43 10v16M35 18h16M37.5 12.5l11 11M48.5 12.5l-11 11"/><path d="M21.5 30h19"/>'),
    copa: s('<path d="M16 12h30c0 15-6 23-15 23S16 27 16 12z"/><path d="M31 35v15"/><path d="M22 52h18"/><circle cx="26" cy="20" r="1.6"/><circle cx="33" cy="24" r="1.2"/><circle cx="37" cy="17" r="1.4"/><path d="M17 17h28"/>'),
    prensa: s('<circle cx="31" cy="6" r="2.2"/><path d="M31 8v12"/><path d="M18 20h26"/><path d="M20 20v28a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V20"/><path d="M20 32h22"/><path d="M42 24h5v20h-5"/><path d="M16 55h30"/>'),
    sifon: s('<path d="M26 6h12v6c5 2 7 6 7 10a13 13 0 0 1-26 0c0-4 2-8 7-10z"/><path d="M32 35v5"/><circle cx="32" cy="46" r="8"/><path d="M26 58h12"/><path d="M14 6v52"/><path d="M14 20h6"/>'),
    gotero: s('<path d="M16 14h32l-11 18H27z"/><path d="M22 14l8 18M42 14l-8 18"/><path d="M20 36h24v12a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5z"/><path d="M44 40h3a4 4 0 0 1 0 8h-3"/><path d="M50 4c-4 0-8 3-10 8"/>'),
    chemex: s('<path d="M20 8h24l-9 22 9 20a4 4 0 0 1-4 5H24a4 4 0 0 1-4-5l9-20z"/><path d="M27 25h10v10H27z"/><path d="M32 35l2 6"/><path d="M23 46h18"/>')
  };
})();
