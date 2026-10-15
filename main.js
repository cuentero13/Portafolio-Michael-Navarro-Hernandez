/* ============ Portafolio — main.js ============
   Contenido primero: todo funciona sin JS de animación.
   WebGL, cursor, Lenis y GSAP son capas progresivas con guards.
*/
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. Fondo WebGL (Three.js) ---------- */
  (function initWebGL() {
    var canvas = document.getElementById('webgl');
    if (!canvas) return;

    var hasGL = false;
    try {
      hasGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) { hasGL = false; }

    if (!hasGL || typeof THREE === 'undefined') {
      document.body.classList.add('no-webgl');
      return;
    }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      document.body.classList.add('no-webgl');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 14;

    // Partículas a la deriva
    var COUNT = 700;
    var positions = new Float32Array(COUNT * 3);
    var speeds = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = 0.15 + Math.random() * 0.5;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({
      color: 0x4d8dff,
      size: 0.09,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    // Formas flotantes sutiles (wireframe)
    var shapes = [];
    var shapeGeo1 = new THREE.IcosahedronGeometry(2.2, 1);
    var shapeGeo2 = new THREE.OctahedronGeometry(1.4, 0);
    var wireMat = new THREE.MeshBasicMaterial({
      color: 0x2f7bff, wireframe: true, transparent: true, opacity: 0.22
    });
    var s1 = new THREE.Mesh(shapeGeo1, wireMat);
    s1.position.set(-7, 2, -4);
    var s2 = new THREE.Mesh(shapeGeo2, wireMat.clone());
    s2.material.opacity = 0.16;
    s2.position.set(7.5, -2.5, -6);
    scene.add(s1); scene.add(s2);
    shapes.push(s1, s2);

    var running = true;
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && !reduceMotion) requestAnimationFrame(tick);
    });

    var start = performance.now();
    var scrollY = 0;
    window.addEventListener('scroll', function () {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    function tick(now) {
      if (!running) return;
      var t = (now - start) / 1000;

      var pos = geo.attributes.position.array;
      for (var j = 0; j < COUNT; j++) {
        pos[j * 3 + 1] += speeds[j] * 0.008;           // deriva hacia arriba
        pos[j * 3] += Math.sin(t * 0.3 + j) * 0.003;    // oscilación lateral
        if (pos[j * 3 + 1] > 13) pos[j * 3 + 1] = -13;  // recicla
      }
      geo.attributes.position.needsUpdate = true;

      s1.rotation.x = t * 0.08; s1.rotation.y = t * 0.12;
      s2.rotation.x = -t * 0.06; s2.rotation.y = t * 0.1;
      s1.position.y = 2 + Math.sin(t * 0.4) * 0.6;
      s2.position.y = -2.5 + Math.cos(t * 0.33) * 0.6;

      // Parallax sutil con el scroll
      var targetY = -(scrollY / window.innerHeight) * 2.2;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, camera.position.y, 0);

      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(tick);
  })();

  /* ---------- 2. Cursor personalizado ---------- */
  (function initCursor() {
    if (!finePointer || reduceMotion) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    });
    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      var half = ring.classList.contains('is-hover') ? 32 : 19;
      ring.style.transform = 'translate(' + (rx - half) + 'px,' + (ry - half) + 'px)';
      requestAnimationFrame(follow);
    })();

    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
  })();

  /* ---------- 3. Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    try {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    } catch (e) { lenis = null; }
  }

  /* ---------- 4. Animaciones de aparición (GSAP) ---------- */
  var hasGsap = (typeof gsap !== 'undefined') &&
                (typeof ScrollTrigger !== 'undefined') && !reduceMotion;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Revelado por secciones (progresivo: si GSAP falla, todo queda visible)
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    // Entrada del hero
    gsap.fromTo('.hero .line',
      { y: 90, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
    );
  } else if (lenis) {
    // Lenis sin GSAP: loop propio
    var rafLenis = function (time) {
      lenis.raf(time);
      requestAnimationFrame(rafLenis);
    };
    requestAnimationFrame(rafLenis);
  }

  /* ---------- 5. Anclas suaves ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
