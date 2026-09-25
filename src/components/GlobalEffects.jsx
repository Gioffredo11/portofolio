import React, { useEffect, useRef } from 'react';

export default function GlobalEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let particles = [];
    let rafId = null;
    let running = true;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const rand = (min, max) => min + Math.random() * (max - min);
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const make = () => ({
      x: rand(0, w || window.innerWidth),
      y: rand(0, h || window.innerHeight),
      r: rand(0.5, 2.1),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.32, -0.05), // upward drift
      a: rand(0.15, 0.6),
      red: Math.random() < 0.22, // partial red embers
      life: rand(0, 1),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const COUNT = window.innerWidth > 1200 ? 90 : 45;
      particles = Array.from({ length: COUNT }, make);
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      if (document.hidden || !running) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.x * dpr;
      const my = mouse.y * dpr;

      for (const p of particles) {
        // Gentle repulsion from cursor
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const f = (1 - d2 / 26000) * 0.6;
          p.x += (dx / Math.sqrt(d2 + 1)) * f * 2.2;
          p.y += (dy / Math.sqrt(d2 + 1)) * f * 2.2;
        }
        p.x += p.vx * dpr;
        p.y += p.vy * dpr;
        p.life += 0.004;

        if (p.y < -20 || p.x < -20 || p.x > w + 20 || p.life > 1.6) {
          Object.assign(p, make(), { y: h + 10, x: rand(0, w) });
        }

        const alpha = p.a * Math.sin(clamp(p.life, 0, 1) * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(255, 70, 60, ${alpha})`
          : `rgba(246, 242, 230, ${alpha * 0.75})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Lapisan tekstur global: film grain + scanline CRT */}
      <div className="fx-grain" aria-hidden="true"></div>
      <div className="fx-scan" aria-hidden="true"></div>

      {/* Partikel debu & bara merah (canvas) */}
      <canvas className="fx-particles" id="particles" ref={canvasRef} aria-hidden="true"></canvas>

      {/* Filter SVG: isolasi kanal warna untuk efek RGB split / chromatic aberration */}
      <svg className="sw-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="sw-chan-r" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="sw-chan-b" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
