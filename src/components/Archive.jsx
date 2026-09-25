import React, { useState, useEffect, useRef } from 'react';

const PANELS = [
  {
    idx: 'PANEL 01 / GIT',
    tag: 'VERSION CONTROL',
    img: '/assets/images/panel-1.svg',
    alt: 'Panel komik Git: branching dan roll back',
    desc: 'Version control with a safety net: branch, break it, roll back, repeat.',
  },
  {
    idx: 'PANEL 02 / FIGMA',
    tag: 'UI & WIREFRAME',
    img: '/assets/images/panel-2.svg',
    alt: 'Panel komik Figma: perancangan antarmuka',
    desc: 'Interface drafts and wireframes get tested here before they become code.',
  },
  {
    idx: 'PANEL 03 / NODE.JS',
    tag: 'BACKEND RUNTIME',
    img: '/assets/images/panel-3.svg',
    alt: 'Panel komik Node.js: runtime server-side',
    desc: 'Server-side JavaScript for APIs, background tasks, and lightweight services.',
  },
  {
    idx: 'PANEL 04 / PYTHON',
    tag: 'SCRIPTING & DATA',
    img: '/assets/images/panel-4.svg',
    alt: 'Panel komik Python: automasi dan eksplorasi data',
    desc: 'Automation, data exploration, and experimental problem solving.',
  },
];

export default function Archive() {
  const desktopSectionRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Mobile scroll handler to update indicator active state
  const handleMobileScroll = (e) => {
    const track = e.currentTarget;
    if (!track) return;
    const card = track.querySelector('.mobile-panel');
    const cardWidth = card ? card.offsetWidth : 280;
    const gap = 16;
    const scrollPos = track.scrollLeft;
    const index = Math.round(scrollPos / (cardWidth + gap));
    setActiveMobileIdx(Math.min(Math.max(0, index), PANELS.length - 1));
  };

  // 3D Parallax Tilt for Desktop Layout
  useEffect(() => {
    const desktopSection = desktopSectionRef.current;
    if (!desktopSection) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduceMotion || !hasFinePointer) return;

    const panels = Array.from(desktopSection.querySelectorAll('.desktop-panel'));
    if (!panels.length) return;

    const T = {
      hoverRy: 7,
      hoverRx: 5,
      rowRy: 3.5,
      rowRx: 2.5,
      lift: 20,
      card: 14,
      art: 3,
    };

    const items = panels.map((el) => ({
      el,
      art: el.querySelector('img'),
      card: el.querySelector('.desktop-panel-card'),
      tilted: false,
      cur: { ry: 0, rx: 0, z: 0, ax: 0, ay: 0, cz: 0 },
      aim: { ry: 0, rx: 0, z: 0, ax: 0, ay: 0, cz: 0 },
    }));

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const ptr = { x: window.innerWidth / 2, y: window.innerHeight / 2, inside: false };
    let inView = false,
      dirty = true,
      raf = 0,
      last = performance.now();

    const measure = () => {
      const gx = ptr.inside ? clamp(ptr.x / window.innerWidth - 0.5, -0.5, 0.5) : 0;
      const gy = ptr.inside ? clamp(ptr.y / window.innerHeight - 0.5, -0.5, 0.5) : 0;
      items.forEach((it) => {
        const r = it.el.getBoundingClientRect();
        const nx = clamp((ptr.x - (r.left + r.width / 2)) / Math.max(r.width / 2, 1), -2, 2);
        const ny = clamp((ptr.y - (r.top + r.height / 2)) / Math.max(r.height / 2, 1), -2, 2);
        const w = ptr.inside ? clamp(1 - Math.max(Math.abs(nx) - 1, 0) / 1.4, 0, 1) : 0;
        it.aim.ry = T.rowRy * gx * 2 + -nx * T.hoverRy * w;
        it.aim.rx = T.rowRx * gy * 2 + ny * T.hoverRx * w;
        it.aim.z = T.lift * w;
        it.aim.ax = -nx * T.art * w;
        it.aim.ay = -ny * T.art * 0.7 * w;
        it.aim.cz = T.card * w;
        const tilted = w > 0.35;
        if (tilted !== it.tilted) {
          it.tilted = tilted;
          it.el.classList.toggle('is-tilted', tilted);
        }
      });
    };

    const write = () => {
      items.forEach((it) => {
        const c = it.cur;
        it.el.style.transform = `translate3d(0, 0, ${c.z.toFixed(2)}px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
        if (it.art) it.art.style.transform = `translate3d(${c.ax.toFixed(2)}px, ${c.ay.toFixed(2)}px, 0)`;
        if (it.card) it.card.style.transform = `translateZ(${c.cz.toFixed(2)}px)`;
      });
    };

    const step = () => {
      raf = 0;
      if (!inView || document.hidden) return;
      if (dirty) {
        measure();
        dirty = false;
      }

      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt * 8);

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
        items.forEach((it) => Object.assign(it.cur, it.aim));
        write();
      }
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.inside = true;
      dirty = true;
      start();
    };

    const release = () => {
      ptr.inside = false;
      dirty = true;
      start();
    };

    const onScroll = () => {
      if (ptr.inside) {
        dirty = true;
        start();
      }
    };

    desktopSection.addEventListener('pointermove', onPointerMove, { passive: true });
    desktopSection.addEventListener('pointerleave', release);
    document.addEventListener('mouseleave', release);
    window.addEventListener('scroll', onScroll, { passive: true });

    let observer = null;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && ptr.inside) {
          dirty = true;
          start();
        }
      });
      observer.observe(desktopSection);
    } else {
      inView = true;
    }

    return () => {
      desktopSection.removeEventListener('pointermove', onPointerMove);
      desktopSection.removeEventListener('pointerleave', release);
      document.removeEventListener('mouseleave', release);
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="archive-section archive" id="archive">
      {/* ========================================================
          1. DESKTOP LAYOUT (Screen > 960px)
          Horizontal pinned scrub, 3D tilt, full-visibility viewport
          ======================================================== */}
      <div className="archive-desktop" ref={desktopSectionRef}>
        <div className="archive-desktop-header">
          <p className="label">
            <span>01.1</span>
            <i></i>ARCHIVE
          </p>
          <div className="archive-desktop-meta">
            <span className="archive-desktop-hint">SCROLL TO REVEAL PANELS</span>
            <div className="archive-desktop-progress-track">
              <div className="archive-desktop-progress-bar" id="archiveProgressDesktop"></div>
            </div>
          </div>
        </div>

        <div className="archive-desktop-viewport">
          <div className="archive-desktop-track" id="archiveTrackDesktop">
            {PANELS.map((panel, idx) => (
              <article className="desktop-panel" data-hover key={idx}>
                <div className="desktop-panel-header">
                  <span className="desktop-panel-badge">{panel.idx}</span>
                  <span className="desktop-panel-tag">{panel.tag}</span>
                </div>
                <div className="desktop-panel-art panel-art">
                  <img src={panel.img} alt={panel.alt} loading="lazy" decoding="async" />
                </div>
                <div className="desktop-panel-card">
                  <p>{panel.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE LAYOUT (Screen <= 960px)
          Touch horizontal snap carousel with indicator dots
          ======================================================== */}
      <div className="archive-mobile">
        <div className="archive-mobile-header">
          <p className="label">
            <span>01.1</span>
            <i></i>ARCHIVE
          </p>
          <span className="archive-mobile-hint">
            SWIPE TO EXPLORE ({activeMobileIdx + 1}/{PANELS.length}) →
          </span>
        </div>

        <div
          className="archive-mobile-track"
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          tabIndex={0}
          aria-label="Koleksi panel komik toolkit"
        >
          {PANELS.map((panel, idx) => (
            <article
              className={`mobile-panel ${activeMobileIdx === idx ? 'is-active' : ''}`}
              key={idx}
            >
              <div className="mobile-panel-top">
                <span className="mobile-panel-badge">{panel.idx}</span>
                <span className="mobile-panel-tag">{panel.tag}</span>
              </div>
              <div className="mobile-panel-art">
                <img src={panel.img} alt={panel.alt} loading="lazy" decoding="async" />
              </div>
              <div className="mobile-panel-card">
                <p>{panel.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile pagination indicator dots */}
        <div className="archive-mobile-dots" aria-hidden="true">
          {PANELS.map((_, idx) => (
            <span
              key={idx}
              className={`archive-dot ${activeMobileIdx === idx ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
