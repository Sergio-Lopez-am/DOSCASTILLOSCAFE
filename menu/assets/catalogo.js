/* ============================================================
   DOS CASTILLOS CAFÉ · Catálogo del menú digital
   Fuente: "Menú maestro" (Excel). Precios en COP con impoconsumo (8%) incluido.

   Cómo editar:
   - Cambiar un precio: edita "precio".
   - Agotar un producto por hoy: pon  disponible: false  (se muestra "Agotado").
   - Agregar un producto: copia una línea y cambia código, nombre, precio y categoría.
   - La foto es opcional (carpeta assets/img). Sin foto se usa una ilustración ("icono").
   ============================================================ */
window.CATALOGO = {
  grupos: [
    { id: "bebidas", nombre: "Café y bebidas", acento: "para tomar", foto: "hero-bebidas.jpg" },
    { id: "comida", nombre: "Comida y alimentos", acento: "para comer", foto: "hero-metodos.jpg", pronto: true }
  ],

  categorias: [
    { id: "calientes-cafe", grupo: "bebidas", nombre: "Calientes", acento: "con café" },
    { id: "calientes-sin", grupo: "bebidas", nombre: "Calientes", acento: "sin café" },
    { id: "metodos", grupo: "bebidas", nombre: "Métodos", acento: "de filtrado" },
    { id: "frias-cafe", grupo: "bebidas", nombre: "Frías", acento: "con café" },
    { id: "frias-sin", grupo: "bebidas", nombre: "Frías", acento: "sin café" },
    { id: "especiales", grupo: "bebidas", nombre: "Especiales", acento: "de la casa" }
    // Comida: agrega aquí categorías con grupo: "comida" cuando tengas los precios
    // (Waffle de pandebono, Bowl de yogurt con frutas y granola, Croissant...).
  ],

  productos: [
    { codigo: "BC-CF-01", nombre: "Espresso", categoria: "calientes-cafe", precio: 6400, foto: "espresso.jpg", icono: "taza",
      desc: "Extracción corta e intensa de nuestro café de origen." },
    { codigo: "BC-CF-02", nombre: "Espresso Doble", categoria: "calientes-cafe", precio: 6900, icono: "taza",
      desc: "Doble carga de espresso: más cuerpo, más aroma." },
    { codigo: "BC-CF-03", nombre: "Americano", categoria: "calientes-cafe", precio: 7500, foto: "americano.jpg", icono: "mug",
      desc: "Espresso alargado con agua caliente. Suave y limpio." },
    { codigo: "BC-CF-04", nombre: "Macchiato", categoria: "calientes-cafe", precio: 7800, icono: "taza",
      desc: "Espresso manchado con un toque de espuma de leche." },
    { codigo: "BC-CF-05", nombre: "Café Latte", categoria: "calientes-cafe", precio: 9800, foto: "latte.jpg", icono: "latte",
      desc: "Espresso con abundante leche texturizada." },
    { codigo: "BC-CF-06", nombre: "Cappuccino", categoria: "calientes-cafe", precio: 9800, icono: "latte",
      desc: "Espresso, leche vaporizada y una capa generosa de espuma." },
    { codigo: "BC-CF-07", nombre: "Mocaccino", categoria: "calientes-cafe", precio: 11700, icono: "latte",
      desc: "Espresso, chocolate y leche vaporizada." },

    { codigo: "BC-SC-01", nombre: "Aromática", categoria: "calientes-sin", precio: 8200, icono: "te",
      desc: "Infusión caliente de hierbas y frutas." },
    { codigo: "BC-SC-02", nombre: "Matcha Latte", categoria: "calientes-sin", precio: 11800, icono: "latte",
      desc: "Té verde matcha batido con leche caliente." },
    { codigo: "BC-SC-03", nombre: "Chocolate", categoria: "calientes-sin", precio: 11500, icono: "mug",
      desc: "Chocolate caliente y cremoso preparado en leche." },

    { codigo: "BC-MT-01", nombre: "Prensa Francesa", categoria: "metodos", precio: 9200, icono: "prensa",
      desc: "Café recién molido en inmersión. Taza de cuerpo pleno." },
    { codigo: "BC-MT-02", nombre: "Syphon", categoria: "metodos", precio: 27500, icono: "sifon",
      desc: "Extracción al vacío en sifón de vidrio. Taza limpia y muy aromática." },
    { codigo: "BC-MT-03", nombre: "V60", categoria: "metodos", precio: 9200, foto: "v60.jpg", icono: "gotero",
      desc: "Filtrado manual que resalta las notas de almendra y panela." },
    { codigo: "BC-MT-04", nombre: "Chemex", categoria: "metodos", precio: 17500, foto: "chemex.jpg", icono: "chemex",
      desc: "Filtrado lento en Chemex. Taza brillante, notas de avellana y caramelo." },

    { codigo: "BF-CF-01", nombre: "Cold Brew", categoria: "frias-cafe", precio: 11000, icono: "vaso",
      desc: "Café infusionado en frío durante horas. Suave y refrescante." },
    { codigo: "BF-CF-02", nombre: "Iced Americano", categoria: "frias-cafe", precio: 9800, icono: "vaso",
      desc: "Espresso sobre hielo y agua fría." },
    { codigo: "BF-CF-03", nombre: "Iced Latte", categoria: "frias-cafe", precio: 12300, foto: "iced-latte.jpg", icono: "vaso",
      desc: "Espresso, leche fría y hielo." },

    { codigo: "BF-SC-01", nombre: "Iced Matcha", categoria: "frias-sin", precio: 13700, icono: "vaso",
      desc: "Matcha con leche fría y hielo." },
    { codigo: "BF-SC-02", nombre: "Chai Frappé", categoria: "frias-sin", precio: 14600, icono: "vaso",
      desc: "Té chai especiado, granizado con leche." },
    { codigo: "BF-SC-03", nombre: "Iced Chai", categoria: "frias-sin", precio: 12500, icono: "vaso",
      desc: "Té chai especiado con leche fría y hielo." },
    { codigo: "BF-SC-10", nombre: "Jugo de Naranja", categoria: "frias-sin", precio: 7900, icono: "jugo",
      desc: "Jugo natural de naranja." },

    { codigo: "BF-ES-04", nombre: "Soda Orange Cold Brew", categoria: "especiales", precio: 17200, foto: "soda-orange.jpg", icono: "copa",
      desc: "Soda de naranja con cold brew, servida en capas.", opciones: ["Con café", "Sin café"] },
    { codigo: "BF-ES-05", nombre: "Soda Lulada Cold Brew", categoria: "especiales", precio: 17200, icono: "copa",
      desc: "Soda de lulada con cold brew.", opciones: ["Con café", "Sin café"] },
    { codigo: "BF-ES-06", nombre: "Soda Café", categoria: "especiales", precio: 17200, icono: "copa",
      desc: "Soda burbujeante con café.", opciones: ["Con café", "Sin café"] }
  ],

  // Adiciones: aplican a todos los productos del grupo "bebidas" (columna "Permite adiciones")
  adiciones: [
    { codigo: "AD-BE-01", nombre: "Leche de almendras", precio: 4200 },
    { codigo: "AD-BE-02", nombre: "Caramelo", precio: 3700 },
    { codigo: "AD-BE-03", nombre: "Vainilla", precio: 3700 }
  ]
};
