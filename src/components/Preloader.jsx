import React, { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let current = 0;
    const rand = (min, max) => min + Math.random() * (max - min);

    const tick = () => {
      current = Math.min(100, current + rand(8, 20));
      setProgress(Math.round(current));

      if (current < 100) {
        timerRef.current = setTimeout(tick, rand(40, 90));
      } else {
        timerRef.current = setTimeout(() => {
          setIsDone(true);
          document.body.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('arachne:ready'));
          setTimeout(() => setIsMounted(false), 450);
        }, 150);
      }
    };

    timerRef.current = setTimeout(tick, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`loader ${isDone ? 'is-done' : ''}`}
      id="loader"
      aria-hidden="true"
      style={isDone ? { opacity: 0, visibility: 'hidden', display: 'none', pointerEvents: 'none' } : undefined}
    >
      <div className="loader-mark">
        <span className="loader-word">GIOFFREDO HO</span>
        <span className="loader-dot"></span>
      </div>
      <div className="loader-bar">
        <i id="loaderBar" style={{ width: `${progress}%` }}></i>
      </div>
      <span className="loader-pct" id="loaderPct">
        {String(progress).padStart(2, '0')}
      </span>
    </div>
  );
}
