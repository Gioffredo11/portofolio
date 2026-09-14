/* ==========================================================================
   GIOFFREDO HO — Portfolio  ·  image-switcher.js
   IMAGE SWITCHER untuk karakter hero (menggantikan model 3D lama).

   Alur:
     IMAGE 1 (versi Peter Parker)  →  tampilan default saat website dibuka
        ↓ klik / Enter / Spasi
     transisi "character transformation" (glitch, RGB split, blur, scale,
     rotasi, glow, noise, scanline ≈ 900 ms)
        ↓
     IMAGE 2 (Spider-Man)
        ↓ klik / Enter / Spasi
     transisi yang sama  →  kembali ke IMAGE 1

   Struktur komponen:
     ImageSwitcher
     ├── Image 1        #switchImgA   → .switch-img--a
     ├── Image 2        #switchImgB   → .switch-img--b
     ├── Transition Layer  .figure-switch.is-transforming (memicu @keyframes
     │                     charOut / charIn, lihat style.css)
     ├── Glitch Layer   .sw-chroma--r/--b (RGB split), .sw-noise, .sw-scan,
     │                  .sw-sweep, .sw-flash, .sw-shock  + .figure-glitch
     │                  (kedip berkala dari script.js → initGlitch)
     └── Interaction Handler (klik, Enter/Spasi native <button>, parallax mouse)
   ========================================================================== */

(() => {
  'use strict';

  const root = document.getElementById('figureSwitch');
  if (!root) return;

  const imgA = document.getElementById('switchImgA');
  const imgB = document.getElementById('switchImgB');
  const chromaR = document.getElementById('swChromaR');
  const chromaB = document.getElementById('swChromaB');
  const ghost = document.getElementById('swGhost');
  const hint = document.getElementById('figureHint');
  const status = document.getElementById('figureStatus');
  if (!imgA || !imgB) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Durasi transisi (700–1000 ms). Nol kalau pengguna mematikan animasi. */
  const DURATION = reduceMotion ? 0 : 900;

  const LABEL = {
    1: { next: 'Spider-Man', now: 'Peter Parker' },
    2: { next: 'Peter Parker', now: 'Spider-Man' },
  };

  let current = 1;          // currentImage = 1  →  IMAGE 1 tampil lebih dulu
  let busy = false;         // cegah transisi bertumpuk saat masih berjalan
  let hintUsed = false;

  const srcOf = (img) => img.currentSrc || img.getAttribute('src');

  /* ------------------------------------------------------------- PRELOAD */
  /* Kedua gambar di-decode lebih dulu supaya saat diklik tidak ada loading
     atau gambar kosong di tengah transisi. */
  function preload() {
    [srcOf(imgA), srcOf(imgB)].forEach((src) => {
      const im = new Image();
      im.decoding = 'async';
      im.src = src;
      if (im.decode) im.decode().catch(() => {});
    });
  }

  const isReady = (img) => img.complete && img.naturalWidth > 0;

  /* ---------------------------------------------------------- TRANSITION */
  function label() {
    root.setAttribute(
      'aria-label',
      `Karakter hero — tampilkan versi ${LABEL[current].next} (klik, atau tekan Enter atau Spasi)`
    );
  }

  function finish(outgoing, incoming, next) {
    outgoing.classList.remove('is-active');   // IMAGE lama memudar (state akhir charOut)
    incoming.classList.add('is-active');      // IMAGE baru jadi tampilan aktif
    if (ghost) ghost.setAttribute('src', srcOf(incoming));
    root.classList.remove('is-transforming');
    current = next;                           // currentImage = 2  (atau kembali 1)
    busy = false;
    label();
    if (status) status.textContent = `Menampilkan versi ${LABEL[current].now}`;
  }

  function transform() {
    if (busy) return;

    const outgoing = current === 1 ? imgA : imgB;
    const incoming = current === 1 ? imgB : imgA;
    const next = current === 1 ? 2 : 1;

    /* Kalau IMAGE tujuan belum ter-decode (praktis tidak terjadi karena
       di-preload), klik diabaikan supaya tidak muncul gambar kosong. */
    if (!isReady(incoming)) return;

    busy = true;

    /* Lapisan RGB split menampilkan gambar yang sedang tampil (sudah di cache) */
    const src = srcOf(outgoing);
    if (chromaR) chromaR.setAttribute('src', src);
    if (chromaB) chromaB.setAttribute('src', src);

    /* Petunjuk "click to transform" hilang setelah dipakai sekali */
    if (hint && !hintUsed) {
      hintUsed = true;
      hint.classList.replace('is-on', 'is-off');
    }

    if (DURATION === 0) { finish(outgoing, incoming, next); return; }

    /* Kelas ini memicu @keyframes charOut (gambar aktif) & charIn (gambar masuk) */
    root.classList.add('is-transforming');
    window.setTimeout(() => finish(outgoing, incoming, next), DURATION);
  }

  /* ------------------------------------------------- INTERACTION HANDLER */
  /* Klik tikus & sentuh. Enter/Spasi tidak perlu ditangani manual: keduanya
     sudah memicu event click secara native pada <button>. */
  function initPointer() {
    root.addEventListener('click', transform);
  }

  /* Parallax halus mengikuti mouse — hanya perangkat dengan pointer presisi
     (desktop/laptop). Di mobile/touch dilewati sepenuhnya. */
  function initParallax() {
    if (!hasFinePointer || reduceMotion) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      root.style.setProperty('--px', tx.toFixed(2) + 'px');
      root.style.setProperty('--py', ty.toFixed(2) + 'px');
    };
    const queue = () => { if (!raf) raf = window.requestAnimationFrame(apply); };

    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 16;    // maksimal ±8px
      ty = ((e.clientY - r.top) / r.height - 0.5) * 12;    // maksimal ±6px
      queue();
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; queue(); });
  }

  /* ----------------------------------------------------------------- BOOT */
  function init() {
    preload();
    label();
    initPointer();
    initParallax();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
