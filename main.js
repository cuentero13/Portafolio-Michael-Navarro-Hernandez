/* ============ Portafolio — main.js ============
   Contenido primero: todo funciona sin JS de animación.
   WebGL, cursor, Lenis y GSAP son capas progresivas con guards.
*/
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
     CONFIGURACIÓN — PARA MIKE
     ─────────────────────────────────────────────────────────────────
     1. FORMSPREE_ID: creá un formulario gratis en https://formspree.io
        y pegá acá el ID que te da (algo como "xqkrblabla").
        Sin ID, el formulario de contacto muestra un aviso y no envía.
     2. BLOG_FEED: feed del blog vía proxy público (ya configurado,
        no tocar salvo que cambie la URL del blog).
     ═══════════════════════════════════════════════════════════════════ */
  var FORMSPREE_ID = "PONER_ID_AQUI";
  var BLOG_FEED_URL = "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent("https://cuentero13.blogspot.com/feeds/posts/default?alt=rss") +
    "&count=3";

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

    /* ---------- 6. Buscador del sitio ---------- */
  (function initSearch() {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    function norm(s) {
      return (s || '').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    // Índice generado desde el contenido real del index.html
    var index = [];
    document.querySelectorAll('main section[id]').forEach(function (sec) {
      var title = sec.getAttribute('data-search-title');
      if (!title) {
        var h = sec.querySelector('h1, h2');
        title = h ? h.textContent.replace(/\s+/g, ' ').trim() : sec.id;
      }
      index.push({
        id: sec.id,
        title: title,
        keys: norm(sec.getAttribute('data-search-keys') || ''),
        text: norm(sec.textContent.replace(/\s+/g, ' ').trim().slice(0, 800))
      });
    });

    // Los posts del blog se agregan al índice cuando cargan (ver initBlog)
    function addToIndex(entry) { index.push(entry); }

    // UI: botón en el nav (mejora progresiva: sin JS no existe)
    var toggle = document.createElement('button');
    toggle.className = 'search-toggle';
    toggle.setAttribute('aria-label', 'Buscar en el sitio');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>';
    navLinks.insertBefore(toggle, navLinks.firstChild);

    var overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="search-panel" role="dialog" aria-modal="true" aria-label="Buscar en el sitio">' +
        '<div class="search-bar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>' +
          '<input type="search" id="site-search-input" placeholder="Buscar tours, festival, precios…" autocomplete="off">' +
          '<button class="search-close" aria-label="Cerrar búsqueda">×</button>' +
        '</div>' +
        '<div class="search-results" id="site-search-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('#site-search-input');
    var results = overlay.querySelector('#site-search-results');
    var isOpen = false;

    function snippetFor(entry, tokens) {
      var words = entry.text.split(' ');
      var pos = -1;
      for (var i = 0; i < words.length; i++) {
        for (var t = 0; t < tokens.length; t++) {
          if (words[i].indexOf(tokens[t]) !== -1) { pos = i; break; }
        }
        if (pos !== -1) break;
      }
      if (pos === -1) return entry.text.split(' ').slice(0, 24).join(' ') + '…';
      var start = Math.max(0, pos - 8);
      return '…' + words.slice(start, start + 26).join(' ') + '…';
    }

    function render(q) {
      var nq = norm(q).trim();
      if (nq.length < 2) {
        results.innerHTML = '<p class="search-hint">Escribí al menos 2 letras. Tip: presioná <kbd>/</kbd> para buscar.</p>';
        return;
      }
      var tokens = nq.split(/\s+/);
      var scored = [];
      index.forEach(function (entry) {
        var score = 0;
        var nTitle = norm(entry.title);
        tokens.forEach(function (tok) {
          if (nTitle.indexOf(tok) !== -1) score += 3;
          if (entry.keys.indexOf(tok) !== -1) score += 2;
          if (entry.text.indexOf(tok) !== -1) score += 1;
        });
        if (score > 0) scored.push({ entry: entry, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      scored = scored.slice(0, 8);

      if (!scored.length) {
        results.innerHTML = '<p class="search-empty">Sin resultados para “' + q.replace(/</g, '&lt;') + '”. Probá con “tours”, “festival”, “precios” o “contacto”.</p>';
        return;
      }
      var html = '';
      scored.forEach(function (s) {
        var snip = snippetFor(s.entry, tokens);
        var title = s.entry.title.replace(/</g, '&lt;');
        tokens.forEach(function (tok) {
          var re = new RegExp('(' + tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
          title = title.replace(re, '<mark>$1</mark>');
        });
        html += '<button class="search-item" data-target="' + s.entry.id + '">' +
          '<span class="search-item-title">' + title + '</span>' +
          '<span class="search-item-snippet">' + snip.replace(/</g, '&lt;') + '</span>' +
        '</button>';
      });
      results.innerHTML = html;
    }

    function open() {
      isOpen = true;
      overlay.hidden = false;
      render('');
      setTimeout(function () { input.focus(); }, 30);
      document.body.style.overflow = 'hidden';
    }
    function close() {
      isOpen = false;
      overlay.hidden = true;
      input.value = '';
      document.body.style.overflow = '';
      toggle.focus();
    }
    function goTo(id) {
      close();
      var target = document.getElementById(id);
      if (!target) return;
      setTimeout(function () {
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(target, { offset: -70, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }

    toggle.addEventListener('click', open);
    overlay.querySelector('.search-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function () { render(input.value); });
    results.addEventListener('click', function (e) {
      var btn = e.target.closest('.search-item');
      if (btn) goTo(btn.getAttribute('data-target'));
    });
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === '/' && !isOpen && !typing) { e.preventDefault(); open(); }
      if (e.key === 'Escape' && isOpen) close();
    });

    // Exponer para que initBlog agregue los posts al índice
    window.__siteSearchAdd = addToIndex;
    window.__siteSearchNorm = norm;
  })();

  /* ---------- 7. Formulario de contacto (Formspree) ---------- */
  (function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var btn = form.querySelector('button[type="submit"]');

    function say(msg, ok) {
      status.textContent = msg;
      status.className = 'form-status ' + (ok ? 'is-ok' : 'is-error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre.value.trim();
      var email = form.email.value.trim();
      var tipo = form.tipo.value;
      var mensaje = form.mensaje.value.trim();
      var valid = true;

      [form.nombre, form.email, form.tipo, form.mensaje].forEach(function (f) {
        f.classList.remove('field-error');
      });

      if (nombre.length < 2) { form.nombre.classList.add('field-error'); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { form.email.classList.add('field-error'); valid = false; }
      if (!tipo) { form.tipo.classList.add('field-error'); valid = false; }
      if (mensaje.length < 5) { form.mensaje.classList.add('field-error'); valid = false; }

      if (!valid) {
        say('Revisá los campos marcados: nombre, un email válido, tipo de proyecto y mensaje.', false);
        return;
      }

      if (!FORMSPREE_ID || FORMSPREE_ID === 'PONER_ID_AQUI') {
        say('El formulario aún no está configurado. Escribime por WhatsApp al +506 8725 2809 o a info@360essentialtrip.com.', false);
        return;
      }

      btn.disabled = true;
      say('Enviando…', true);

      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nombre: nombre, email: email, tipo: tipo, mensaje: mensaje })
      }).then(function (res) {
        if (res.ok) {
          say('¡Mensaje enviado! Te respondo a la brevedad. Gracias por escribir.', true);
          form.reset();
        } else {
          say('Hubo un problema al enviar. Probá por WhatsApp al +506 8725 2809.', false);
        }
      }).catch(function () {
        say('No se pudo conectar. Probá por WhatsApp al +506 8725 2809 o a info@360essentialtrip.com.', false);
      }).finally(function () {
        btn.disabled = false;
      });
    });
  })();

  /* ---------- 8. Blog en vivo (RSS de Blogger vía proxy) ---------- */
  (function initBlog() {
    var wrap = document.getElementById('blog-posts');
    if (!wrap || typeof BLOG_FEED_URL === 'undefined') return;

    function strip(html) {
      var d = document.createElement('div');
      d.innerHTML = html || '';
      return d.textContent.replace(/\s+/g, ' ').trim();
    }
    function excerpt(html, n) {
      var t = strip(html);
      return t.length > n ? t.slice(0, n).trim() + '…' : t;
    }
    function fecha(iso) {
      try {
        return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) { return ''; }
    }

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 12000);

    fetch(BLOG_FEED_URL, { signal: ctrl.signal })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        clearTimeout(timer);
        var items = (data && data.items) || [];
        if (!items.length) return; // se mantiene el fallback del HTML
        var html = '';
        items.slice(0, 3).forEach(function (it) {
          html += '<a class="blog-card" href="' + it.link + '" target="_blank" rel="noopener">' +
            '<span class="blog-date">' + fecha(it.pubDate) + '</span>' +
            '<h3>' + strip(it.title) + '</h3>' +
            '<p>' + excerpt(it.description || it.content || '', 150).replace(/</g, '&lt;') + '</p>' +
            '<span class="blog-more">Leer en el blog →</span>' +
          '</a>';
        });
        html += '<div class="blog-fallback"><a class="btn btn-ghost" href="https://cuentero13.blogspot.com/" target="_blank" rel="noopener">Ver todos los textos</a></div>';
        wrap.innerHTML = html;

        // Agregar los posts al índice del buscador
        if (window.__siteSearchAdd && window.__siteSearchNorm) {
          items.slice(0, 5).forEach(function (it) {
            window.__siteSearchAdd({
              id: 'blog',
              title: 'Blog: ' + strip(it.title),
              keys: window.__siteSearchNorm('blog texto poema cuento ' + strip(it.title)),
              text: window.__siteSearchNorm(excerpt(it.description || '', 300))
            });
          });
        }
      })
      .catch(function () {
        clearTimeout(timer);
        // Sin conexión al feed: queda el fallback "Visitar el blog" del HTML.
      });
  })();

  /* ---------- 9. Tours 360° embebidos (lazy-load) ---------- */
  (function initTours() {
    var slots = document.querySelectorAll('.tour-slot iframe[data-src]');
    if (!slots.length) return;

    function isRealUrl(u) { return /^https?:\/\//i.test(u || ''); }

    if (!('IntersectionObserver' in window)) {
      // Sin IntersectionObserver: cargar de una vez las URLs reales
      slots.forEach(function (f) {
        if (isRealUrl(f.getAttribute('data-src'))) {
          f.src = f.getAttribute('data-src');
          f.closest('.tour-slot').classList.add('is-live');
        }
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var frame = en.target.querySelector('iframe');
        var url = frame.getAttribute('data-src');
        if (isRealUrl(url)) {
          frame.src = url;
          en.target.classList.add('is-live');
        }
        io.unobserve(en.target);
      });
    }, { rootMargin: '300px' });

    document.querySelectorAll('.tour-slot').forEach(function (slot) { io.observe(slot); });
  })();
})();
