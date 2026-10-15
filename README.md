# Portafolio — Michael Navarro Hernández

Sitio estático del portafolio digital unificado: narrador oral · gestor cultural · productor 360°.

## Estructura

```
portafolio-mike/
├── index.html      # Contenido completo (español)
├── styles.css      # Estética oscura inmersiva, responsive
├── main.js         # WebGL + cursor + scroll + animaciones (progresivo)
├── assets/         # Imágenes y recursos propios
└── README.md
```

## Funciones dinámicas (v2+)

- **Buscador** (lupa en el nav, o tecla `/`): busca en todo el contenido del sitio con índice generado desde el HTML. Sin JS no aparece el botón.
- **Formulario de contacto**: envía por [Formspree](https://formspree.io) (gratis, sin backend). Para activarlo: crear un formulario en Formspree y pegar el ID en `main.js` → `const FORMSPREE_ID = "PONER_ID_AQUI"`.
- **Tours 360° en vivo** (sección `#tours-vivo`): 3 iframes con lazy-load. Para activarlos: pegar las URLs públicas de `virtualtour.360essentialtrip.com` en los atributos `data-src` (reemplazar `PONER_URL_TOUR_1_AQUI`, etc.).
- **Blog en vivo** (sección `#blog`): últimos 3 posts de `cuentero13.blogspot.com` vía feed RSS + proxy `api.rss2json.com`. Si el feed falla, se muestra el botón "Visitar el blog".

## Cómo verlo

- **Local:** abrir `index.html` en el navegador (los CDN requieren internet).
- **GitHub Pages:** subir la carpeta a un repo y activar Pages (rama `main`, carpeta raíz). Migrable a dominio propio vía CNAME sin cambios.

## Diseño

Referencia: activetheory.net — nivel Awwwards.
- Fondo WebGL con Three.js (partículas a la deriva + formas wireframe flotantes), como **capa decorativa**.
- El contenido real va en HTML primero: funciona sin JS, sin WebGL y en móviles (fallback con degradado CSS + `prefers-reduced-motion`).
- Scroll cinematográfico: Lenis + GSAP ScrollTrigger (con guards si un CDN falla).
- Cursor personalizado (solo punteros finos), tipografía Archivo + Inter, azul/blanco sobre fondo oscuro.

## Contenido

Todo verificado al 15-oct-2026: 360 Essential Trip (paquetes y casos de éxito con cifras), Festival Internacional Puro Cuento (18 ediciones, Fundación 3006829758, 2027), blog y libros, 7 certificados de IA + constancia de drones IT Puebla, 3 CTAs de contacto.

**Regla:** nada se publica sin revisión de Mike.

## v4 — Espectáculos, color y más interactividad (15-oct-2026)

- **Espectáculos**: sección con 4 shows verificados del dossier oficial de la
  Fundación (precios en colones + IVA): «Los 3 Reyes magos cuentan, cantan y
  encantan» (₡350.000 colegios), «La navidad con Festival Puro Cuento»
  (₡550.000), «Los duendes cuentan la navidad» (₡350.000) y «Un cuento de
  navidad» (₡550.000). Fotos reales del dossier en Drive público.
- **El narrador**: el beat de historia ahora se titula "El narrador".
- **Colores**: dorado/ámbar (`--gold`) para festival, turquesa (`--teal`) para
  360°, sin perder la estética oscura.
- **Interactividad**: lightbox en galerías (clic en fotos), FAQ acordeón con
  `<details>` (funciona sin JS), contadores animados en las cifras
  (`data-count`/`data-prefix`/`data-suffix`), parallax en fotos (GSAP),
  reveals escalonados (`data-reveal-stagger`), tilt 3D sutil en tarjetas.
- **Popup WhatsApp Fundación**: aparece a los 12s, una vez por sesión
  (sessionStorage), se cierra con X o Esc. Número: +506 8725 2809.
- **Mundo Essential Trip**: tarjeta marcada como PENDIENTE — no se encontró
  la URL exacta del enlace en facebook.com/360essentialtrip (requiere acceso
  a la página). Ver comentario "PARA MIKE" en index.html.

Fotos del CV: el CV en Drive («curriculum-obra-transitarte») no contiene
fotos (solo texto); el CV de OneDrive no es accesible desde este entorno.
Se usaron 3 fotos reales del dossier navideño.

## v5 — El Cuentero (15-oct-2026)

Reconstrucción total como scrollytelling inmersivo centrado en Mike.

**Concepto narrativo:** "La historia de un cuentero" — 7 capítulos numerados
(00 Inicio → 01 El cuentero → 02 Territorio 360° → 03 Festival → 04 En escena →
05 Palabra escrita → 06 Contacto), con la historia personal de Mike como
columna vertebral (su libro inédito, su mamá, Heredia 1991, timeline 1991–2026).

**Técnicas aplicadas (referentes Awwwards):**
- Un efecto firma: WebGL que EVOLUCIONA con el scroll (las partículas cambian
  de color por capítulo: brasa/ember en su historia, turquesa en 360°,
  dorado en festival) en vez de fondo decorativo estático.
- Tipografía cinética en el hero ("SOY CUENTERO", letras que se arman).
- Rail lateral de capítulos con progress indicator.
- El show junto al contenido, nunca delante (contenido HTML primero).

**Motivos creativos (ideas de Mike, usadas como inspiración):**
- 🐺 **El lobo guía**: personaje SVG recurrente que aparece en cada capítulo
  con micro-textos ("Seguime. Te voy a contar una historia.", "¿Contamos la tuya?").
- 🛸 **El dron**: SVG animado que sobrevuela el capítulo 360° (hélices girando).
- 🧵 **Caperucita**: "hilo rojo" narrativo — línea roja que recorre el capítulo
  de su historia.

**Contenido personal verificado (nuevo en v5):**
- 5 fotos personales de Mike (Drive "Portafolio web - fotos"): en escenario
  con sombrero, con micrófono, dúo de cuenteros, festival con gorra, comunidad.
- Bio de su portafolio profesional + premios (Impulsarte 2024, MCJ 2020,
  PICE 2021, Iberbibliotecas 2022, Belén 2023, Parque La Libertad 2023).
- Sus tours propios: Monte Albán, Chapultepec, Barco Hundido, Zócalo,
  Hierve el Agua, Casa 1920.
- Cita: "La tecnología es el nuevo fuego alrededor del cual contamos
  nuestras historias."
- Citas de su libro inédito «Biografía de un cuentero tímido que no quería
  aprender a leer» (con atribución).

**Mantiene de v4:** buscador (/), formulario Formspree (placeholder),
1 tour embebido real + 2 placeholders, blog vivo RSS, lightbox, FAQ,
popup WhatsApp (+506 8725 2809), todas las fotos anteriores.

**PENDIENTES para Mike:**
1. ✅ RESUELTO — Títulos de sus espectáculos como narrador (dossier "Michael Navarro (Bc).pdf" del OneDrive).
2. ID de Formspree (formulario).
3. URLs de 2 tours más para embeber.
4. URL "Mundo Essential Trip" del Facebook de 360essentialtrip.

## v6 — Dossier personal (15-oct-2026)

Fuente: dossier "Michael Navarro (Bc).pdf" (OneDrive Fundación, carpeta
"Michael Navarro - Certificaciones"), proporcionado por Mike.

- **Bio del dossier** en el capítulo 01: "Productor y cuentero, pero sobre todo
  amante de las buenas historias (y el chile). Aseguran que está loco, pero
  nadie ha presentado pruebas. Cuenta historias desde que tiene uso de razón
  y viceversa." Timeline 2008 actualizado con el texto del dossier.
- **"Mis espectáculos"** (capítulo 04, PRIMERO — los 4 navideños de la
  Fundación quedaron en la subsección secundaria "Producciones de la
  Fundación"): 6 shows propios con duración, edad recomendada, descripción
  y botón "Cotizar por WhatsApp" con mensaje pre-llenado:
  Historias de Amor con Humor (45–50 min, +12) · La Semilla del Rey
  (50–60 min, +4) · Los Misterios de la Abuela (60 min, +13) ·
  Abuela y la Bendita Gallina (60 min, +13) · Cuentos, Mentiras y
  Exageraciones (50 min, +13) · Crónica de un disparo anunciado (30 min, +16).
- **Descargar mi dossier (PDF)** → enlace OneDrive en la sección de
  espectáculos.
- **Certificados** → tarjeta en Documentos/Credenciales: "Ver mis
  certificados" → carpeta OneDrive (CV, dossier y certificados).
- **Facebook** → actualizado a "@Michael Navarro Cuentero" (nombre del
  dossier, como texto sin URL inventada).
- Buscador indexa los 6 shows nuevos (data-search-keys actualizado).
