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
