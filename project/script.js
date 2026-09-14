/* ==========================================================================
   GIOFFREDO HO — Portfolio  ·  script.js
   Isi:
   01. Util & state        05. Pita marquee merah
   02. Preloader           06. Animasi scroll (GSAP + fallback)
   03. Kursor kustom       07. Work list + scramble "TRANSMISSION"
   04. Partikel canvas     08. Jam Jakarta, nav, progress, init
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------- 01. UTIL */
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const rand = (min, max) => min + Math.random() * (max - min);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const state = {
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },   // posisi asli
    smooth: { x: window.innerWidth / 2, y: window.innerHeight / 2 },  // posisi kursor yang di-lerp
    scroll: 0,
  };

  /* ---------------------------------------------------------- 02. PRELOADER */
  function initLoader() {
    const loader = $('#loader');
    const bar = $('#loaderBar');
    const pct = $('#loaderPct');
    if (!loader) return;

    let progress = 0;
    const tick = () => {
      // Naik cepat lalu melambat, berhenti di 100 (maksimal ~900ms)
      progress = Math.min(100, progress + rand(6, 18));
      bar.style.width = progress + '%';
      pct.textContent = String(Math.round(progress)).padStart(2, '0');
      if (progress < 100) setTimeout(tick, rand(50, 130));
      else setTimeout(() => {
        loader.classList.add('is-done');
        document.body.classList.add('is-loaded');
        document.dispatchEvent(new CustomEvent('arachne:ready'));
      }, 220);
    };
    setTimeout(tick, 180);
  }

  /* ---------------------------------------------------------- 03. KURSOR KUSTOM */
  function initCursor() {
    const cursor = $('#cursor');
    if (!cursor || !hasFinePointer) return;

    document.addEventListener('mousemove', (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    });

    // Cincin membesar saat hover elemen interaktif
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [data-hover], .work-row, .figure-switch')) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, [data-hover], .work-row, .figure-switch')) cursor.classList.remove('is-hover');
    });

    const loop = () => {
      state.smooth.x = lerp(state.smooth.x, state.mouse.x, 0.18);
      state.smooth.y = lerp(state.smooth.y, state.mouse.y, 0.18);
      cursor.style.transform = `translate3d(${state.smooth.x}px, ${state.smooth.y}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------------------------------------------------------- 04. PARTIKEL */
  function initParticles() {
    const canvas = $('#particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles = [];

    const COUNT = window.innerWidth > 1200 ? 90 : 45;

    const make = () => ({
      x: rand(0, w), y: rand(0, h),
      r: rand(0.5, 2.1),
      vx: rand(-0.12, 0.12), vy: rand(-0.32, -0.05),      // naik perlahan
      a: rand(0.15, 0.6),
      red: Math.random() < 0.22,                          // sebagian bara merah
      life: rand(0, 1),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      particles = Array.from({ length: COUNT }, make);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = state.mouse.x * dpr, my = state.mouse.y * dpr;
      for (const p of particles) {
        // Dorongan halus menjauh dari kursor
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const f = (1 - d2 / 26000) * 0.6;
          p.x += (dx / Math.sqrt(d2 + 1)) * f * 2.2;
          p.y += (dy / Math.sqrt(d2 + 1)) * f * 2.2;
        }
        p.x += p.vx * dpr;
        p.y += p.vy * dpr;
        p.life += 0.004;
        if (p.y < -20 || p.x < -20 || p.x > w + 20 || p.life > 1.6) Object.assign(p, make(), { y: h + 10, x: rand(0, w) });

        const alpha = p.a * Math.sin(clamp(p.life, 0, 1) * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(255, 70, 60, ${alpha})`
          : `rgba(246, 242, 230, ${alpha * 0.75})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) draw();
  }

  /* ---------------------------------------------------------- 05. PITA MARQUEE */
  function initRibbon() {
    const rows = $$('.ribbon-row');
    if (!rows.length) return;
    const words = ['IDENTITY', 'CRAFT', 'DESIGN', 'CODE', 'MOTION', 'STORY'];

    const html = words.map((word, i) => `
      <span class="ribbon-item${i % 2 ? ' is-alt' : ''}">${word}</span>
      <span class="ribbon-sep"></span>`).join('');

    // Dua baris identik: animasi translateX(-50%) jadi mulus tanpa lompatan
    rows.forEach((row) => { row.innerHTML = html + html + html; });
  }

  /* ---------------------------------------------------------- 06. ANIMASI SCROLL */
  function initScrollAnimations() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const hasGsap = Boolean(gsap && ScrollTrigger);
    if (hasGsap) gsap.registerPlugin(ScrollTrigger);

    /* --- Fallback tanpa GSAP: reveal berbasis IntersectionObserver + parallax manual --- */
    if (!hasGsap) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      $$('[data-reveal]').forEach((el) => io.observe(el));

      // Parallax ringan untuk layer hero
      const layers = $$('[data-depth]');
      const onScroll = () => {
        const y = window.scrollY;
        layers.forEach((el) => {
          const depth = parseFloat(el.dataset.depth || '0.2');
          el.style.transform = `translate3d(0, ${(y * depth).toFixed(2)}px, 0)`;
        });
        updateArchiveFallback();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return;
    }

    /* --- Dengan GSAP + ScrollTrigger --- */
    // Elemen [data-reveal] disembunyikan CSS. Jangan pakai class .is-in di sini:
    // transisi CSS-nya membuat GSAP membaca nilai akhir yang masih 0. Set inline dulu
    // (instan, karena belum ada transisi), baru GSAP menganimasikan dari kondisi tersembunyi.
    gsap.set('[data-reveal]', { opacity: 1, y: 0, filter: 'none' });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    // Entrance hero (dijalankan setelah preloader selesai)
    tl.from('.hero-title .line--1 > span', { yPercent: 118, duration: 1.1 }, 0)
      .from('.hero-title .line--2 .script', { yPercent: 90, opacity: 0, rotate: -14, duration: 0.9 }, 0.18)
      .from('.hero-intro', { y: 30, opacity: 0, duration: 0.8 }, 0.45)
      .from('.hero-figure', { y: 90, opacity: 0, scale: 0.94, duration: 1.3 }, 0.1)
      .from('.ribbon', { yPercent: 140, rotate: 4, opacity: 0, duration: 1.1 }, 0.5)
      .from('.nav, .edge', { opacity: 0, duration: 0.8 }, 0.6)
      .from('.hero-web', { opacity: 0, scale: 1.1, duration: 1.6 }, 0);

    document.addEventListener('arachne:ready', () => tl.play(), { once: true });
    // Kalau preloader tidak jalan (misal JS dimatikan sebagian), pastikan hero tetap tampil
    setTimeout(() => tl.play(), 2500);

    // Parallax saat hero keluar layar: teks naik lebih cepat dari karakter
    gsap.to('.hero-type', {
      yPercent: -26, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-meta', {
      yPercent: -60, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('.hero-figure', {
      yPercent: 6, scale: 1.06, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.ribbon', {
      yPercent: -220, rotate: -6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-bg', {
      scale: 1.08, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Layer berkedalaman (hero bg, burst) mengikuti scroll + mouse
    $$('[data-depth]').forEach((el) => {
      const depth = parseFloat(el.dataset.depth || '0.2');
      gsap.to(el, {
        yPercent: depth * -90, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      // Reaksi halus terhadap gerakan mouse
      if (hasFinePointer) {
        const quick = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' });
        window.addEventListener('mousemove', (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * depth * 90;
          quick(nx);
        });
      }
    });

    // PROLOGUE: judul naik, kartu kutipan muncul, sunburst berputar pelan
    gsap.from('.fall-line > span', {
      yPercent: 118, duration: 1.1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.fall-title', start: 'top 82%' },
    });
    gsap.from('.fall-script', {
      opacity: 0, y: 40, rotate: -12, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.fall-title', start: 'top 70%' },
    });
    gsap.to('.fall .sunburst', {
      rotate: 18, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.fall', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.to('.fall-holeshim', {
      scale: 1.25, opacity: 0.55, ease: 'none',
      scrollTrigger: { trigger: '.fall', start: 'top center', end: 'bottom top', scrub: true },
    });

    // ARCHIVE: geser horizontal dikunci selama 300vh
    const track = $('#archiveTrack');
    if (track) {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.archive',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      // Panel sedikit miring & membesar mengikuti progres
      $$('.panel-art').forEach((art, i) => {
        gsap.fromTo(art, { rotate: i % 2 ? 3 : -3, scale: 0.94 }, {
          rotate: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.archive', start: 'top bottom', end: 'top top', scrub: true },
        });
      });
    }

    // MANIFESTO
    gsap.from('.statement', {
      opacity: 0, y: 60, filter: 'blur(12px)', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.statement', start: 'top 82%' },
    });
    gsap.to('.manifesto-planes span', {
      rotate: '+=10', yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // Statistik: reveal + angka naik dari 0
    $$('.stat').forEach((stat) => {
      const num = $('.stat-num', stat);
      const target = parseInt(num?.dataset.count || num?.textContent || '0', 10);
      if (!num) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.stats', start: 'top 88%' },
        onUpdate: () => { num.textContent = String(Math.round(obj.v)).padStart(2, '0'); },
      });
    });

    // WORK
    gsap.from('.work-title', {
      yPercent: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-head', start: 'top 85%' },
    });
    gsap.from('.work-script', {
      opacity: 0, y: 40, rotate: -14, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-head', start: 'top 78%' },
    });
    gsap.from('.work-row', {
      opacity: 0, y: 46, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-list', start: 'top 85%' },
    });
    gsap.to('.work .sunburst', {
      rotate: -22, ease: 'none',
      scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // CONTACT
    gsap.from('.contact-line > span, .contact-script, .contact-cta', {
      yPercent: 60, opacity: 0, duration: 1.05, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-inner', start: 'top 85%' },
    });
    gsap.to('.contact .sunburst', {
      rotate: 20, scale: 1.1, ease: 'none',
      scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });

    // Reveal generik untuk elemen ber-atribut [data-reveal]
    // (satu-satunya tween untuk elemen ini, supaya tidak saling menimpa)
    $$('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 34, filter: 'blur(8px)', duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });

    // Navbar: aktifkan link sesuai section yang sedang dilihat
    const navTick = $('#navTick');
    const links = $$('.nav-link');
    const sections = links
      .map((a) => ({ link: a, el: document.getElementById(a.dataset.nav) }))
      .filter((s) => s.el);

    const moveTick = (link) => {
      if (!navTick || !link) return;
      const linkRect = link.getBoundingClientRect();
      const navRect = link.parentElement.getBoundingClientRect();
      navTick.style.transform = `translateX(${linkRect.left - navRect.left + linkRect.width / 2}px)`;
    };

    sections.forEach(({ link, el }) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) {
            links.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
            moveTick(link);
          }
        },
      });
    });

    // Progress bar di strip kanan
    gsap.to('#edgeProgress', {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });

    // ScrollTrigger perlu di-refresh setelah semua font/gambar selesai dimuat
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // Fallback horizontal-scroll untuk ARCHIVE tanpa GSAP
  function updateArchiveFallback() {
    const track = $('#archiveTrack');
    const section = $('.archive');
    if (!track || !section || window.gsap) return;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / (total || 1), 0, 1);
    const distance = Math.max(0, track.scrollWidth - window.innerWidth + 80);
    track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
  }

  /* ---------------------------------------------------------- 06.5 PANEL 3D (ARCHIVE) */
  // Panel komik di ARCHIVE jadi lempeng 3D yang miring mengikuti gerakan mouse:
  // seluruh baris ikut berputar sedikit, panel yang paling dekat kursor paling kuat
  // (menoleh ke arah kursor), artwork-nya bergeser sedikit di dalam bingkai, dan
  // kartu kutipannya maju ke depan. Semuanya transform → tetap murah di compositor.
  function initPanelTilt() {
    const section = $('#archive');
    const panels = $$('.panel');
    if (!section || !panels.length || reduceMotion || !hasFinePointer) return;

    const T = {
      hoverRy: 10, hoverRx: 8,     // derajat: panel yang disorot menoleh ke kursor
      rowRy: 5, rowRx: 3.5,        // derajat: reaksi seluruh baris terhadap posisi kursor
      lift: 34, card: 30,          // px: panel & kartu kutipan maju ke depan
      art: 4,                      // px: artwork bergeser di dalam bingkai (parallax)
    };

    const items = panels.map((el) => ({
      el,
      art: $('img', el),
      card: $('.panel-card', el),
      tilted: false,
      cur: { ry: 0, rx: 0, z: 0, ax: 0, ay: 0, cz: 0 },
      aim: { ry: 0, rx: 0, z: 0, ax: 0, ay: 0, cz: 0 },
    }));

    const ptr = { x: window.innerWidth / 2, y: window.innerHeight / 2, inside: false };
    let inView = false, dirty = true, raf = 0, last = performance.now();

    // Hitung sudut tujuan: jarak kursor ke pusat tiap panel (posisi panel dibaca ulang
    // karena track terus bergeser saat scroll).
    const measure = () => {
      const gx = ptr.inside ? clamp(ptr.x / window.innerWidth - 0.5, -0.5, 0.5) : 0;
      const gy = ptr.inside ? clamp(ptr.y / window.innerHeight - 0.5, -0.5, 0.5) : 0;
      items.forEach((it) => {
        const r = it.el.getBoundingClientRect();
        const nx = clamp((ptr.x - (r.left + r.width / 2)) / Math.max(r.width / 2, 1), -2, 2);
        const ny = clamp((ptr.y - (r.top + r.height / 2)) / Math.max(r.height / 2, 1), -2, 2);
        // bobot: 1 saat kursor di dalam panel, meluruh sampai 0 sekitar 1,4 panel lagi
        const w = ptr.inside ? clamp(1 - Math.max(Math.abs(nx) - 1, 0) / 1.4, 0, 1) : 0;
        it.aim.ry = T.rowRy * gx * 2 + -nx * T.hoverRy * w;
        it.aim.rx = T.rowRx * gy * 2 + ny * T.hoverRx * w;
        it.aim.z = T.lift * w;
        it.aim.ax = -nx * T.art * w;
        it.aim.ay = -ny * T.art * 0.7 * w;
        it.aim.cz = T.card * w;
        const tilted = w > 0.35;
        if (tilted !== it.tilted) { it.tilted = tilted; it.el.classList.toggle('is-tilted', tilted); }
      });
    };

    const write = () => {
      items.forEach((it) => {
        const c = it.cur;
        it.el.style.transform =
          `translate3d(0, 0, ${c.z.toFixed(2)}px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
        // Hanya digeser (tanpa scale) supaya bingkai di dalam artwork tetap utuh.
        if (it.art) it.art.style.transform = `translate3d(${c.ax.toFixed(2)}px, ${c.ay.toFixed(2)}px, 0)`;
        if (it.card) it.card.style.transform = `translateZ(${c.cz.toFixed(2)}px)`;
      });
    };

    const step = () => {
      raf = 0;
      if (!inView || document.hidden) return;
      if (dirty) { measure(); dirty = false; }

      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt * 8);            // pegas halus, stabil di fps berapa pun

      let moving = false;
      items.forEach((it) => {
        for (const key in it.cur) {
          const d = it.aim[key] - it.cur[key];
          if (d > 0.004 || d < -0.004) moving = true;
          it.cur[key] += d * k;
        }
      });
      if (moving) {
        write();
        raf = requestAnimationFrame(step);
      } else {
        items.forEach((it) => Object.assign(it.cur, it.aim));   // berhenti tepat di tujuan
        write();                                                // lalu tidur (tidak ada rAF idle)
      }
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    section.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.inside = true;
      dirty = true;
      start();
    }, { passive: true });

    const release = () => { ptr.inside = false; dirty = true; start(); };
    section.addEventListener('pointerleave', release);
    document.addEventListener('mouseleave', release);
    // Track bergeser saat scroll → sudut dihitung ulang terhadap posisi panel terbaru
    window.addEventListener('scroll', () => { if (ptr.inside) { dirty = true; start(); } }, { passive: true });

    if (window.IntersectionObserver) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && ptr.inside) { dirty = true; start(); }
      }).observe(section);
    } else {
      inView = true;
    }
  }

  /* ---------------------------------------------------------- 07. WORK LIST + SCRAMBLE */
  function initWorkList() {
    const rows = $$('.work-row');
    if (!rows.length) return;

    // Hanya SATU baris yang menyala: yang paling dekat dengan titik tengah viewport
    // (di video sorotan merah "berjalan" mengikuti scroll, bukan menyala semua).
    let raf = null;
    const update = () => {
      raf = null;
      const mid = window.innerHeight / 2;
      let best = null, bestDist = Infinity;
      rows.forEach((row) => {
        const r = row.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = row; }
      });
      const limit = window.innerHeight * 0.42;
      rows.forEach((row) => row.classList.toggle('is-active', row === best && bestDist < limit));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // Klik baris -> gulir ke bagian kontak (ajak kerja sama seputar tech tsb.)
    rows.forEach((row) => {
      row.addEventListener('click', () => {
        const target = document.getElementById('contact');
        if (!target) return;
        if (window.__lenis) window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initScramble() {
    const el = $('#scramble');
    if (!el) return;

    const GLYPHS = '▚▞■□░▒▓⣿≡+×◤◢#$%&/\\|<>*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lines = [
      'TECH STACK — HTML · CSS · JAVASCRIPT · MYSQL · FLUTTER',
      'STILL LEARNING, STILL SHIPPING — EVERY PROJECT A LESSON',
      'STUDENT DEVELOPER — OPEN TO COLLABORATIONS',
    ];
    let index = 0;

    const scramble = (text) => {
      let frame = 0;
      const total = 46;
      const timer = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / total) * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          out += i < revealed ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (frame > total) {
          clearInterval(timer);
          el.textContent = text;
          setTimeout(() => {
            index = (index + 1) % lines.length;
            scramble(lines[index]);
          }, 3200);
        }
      }, 34);
    };

    if (reduceMotion) { el.textContent = lines[0]; return; }
    scramble(lines[0]);
  }

  /* ---------------------------------------------------------- 08. JAM, NAV, INIT */
  function initClock() {
    const el = $('#clock');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const tick = () => { el.textContent = `JKT — ${fmt.format(new Date())}`; };
    tick();
    setInterval(tick, 1000);
  }

  function initNav() {
    const nav = $('#nav');

    // Nav jadi solid setelah sedikit scroll
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Anchor diklik -> scroll halus (Lenis bila ada, kalau tidak pakai CSS smooth)
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (window.__lenis) window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initGlitch() {
    const frame = $('.figure-frame');
    if (!frame || reduceMotion) return;
    const fire = () => {
      frame.classList.add('is-glitch');
      // Event ini dipakai lapisan efek hero untuk menyinkronkan kedipannya
      document.dispatchEvent(new CustomEvent('arachne:glitch'));
      setTimeout(() => frame.classList.remove('is-glitch'), 560);
      setTimeout(fire, rand(2600, 6200));
    };
    setTimeout(fire, 1800);
  }

  function initSmoothScroll() {
    // Lenis (opsional): scroll halus dengan easing seperti di video
    if (!window.Lenis || reduceMotion) return;
    const lenis = new window.Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    window.__lenis = lenis;
    lenis.on('scroll', () => {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------------------------------------------------------- BOOT */
  function init() {
    initLoader();
    initCursor();
    initParticles();
    initRibbon();
    initClock();
    initNav();
    initWorkList();
    initScramble();
    initGlitch();
    initSmoothScroll();
    initScrollAnimations();
    initPanelTilt();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
