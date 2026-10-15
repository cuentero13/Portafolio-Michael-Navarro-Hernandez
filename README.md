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
