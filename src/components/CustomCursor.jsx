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

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
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

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      smooth.x = lerp(smooth.x, mouse.x, 0.18);
      smooth.y = lerp(smooth.y, mouse.y, 0.18);
      cursor.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    rafId = requestAnimationFrame(loop);

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
