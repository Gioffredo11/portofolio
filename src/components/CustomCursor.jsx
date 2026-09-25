import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!cursor || !hasFinePointer) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rafId = null;
    let isTicking = false;

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      smooth.x = lerp(smooth.x, mouse.x, 0.22);
      smooth.y = lerp(smooth.y, mouse.y, 0.22);
      cursor.style.transform = `translate3d(${smooth.x.toFixed(1)}px, ${smooth.y.toFixed(1)}px, 0)`;

      const dx = Math.abs(mouse.x - smooth.x);
      const dy = Math.abs(mouse.y - smooth.y);
      if (dx < 0.15 && dy < 0.15) {
        isTicking = false;
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      wake();
    };

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [data-hover], .work-row, .figure-switch')) {
        cursor.classList.add('is-hover');
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [data-hover], .work-row, .figure-switch')) {
        cursor.classList.remove('is-hover');
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    wake();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cursor" id="cursor" ref={cursorRef} aria-hidden="true">
      <span className="cursor-ring"></span>
      <span className="cursor-dot"></span>
    </div>
  );
}
