import React, { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let current = 0;
    const rand = (min, max) => min + Math.random() * (max - min);

    const tick = () => {
      current = Math.min(100, current + rand(6, 18));
      setProgress(Math.round(current));

      if (current < 100) {
        timerRef.current = setTimeout(tick, rand(50, 130));
      } else {
        timerRef.current = setTimeout(() => {
          setIsDone(true);
          document.body.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('arachne:ready'));
        }, 220);
      }
    };

    timerRef.current = setTimeout(tick, 180);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`loader ${isDone ? 'is-done' : ''}`} id="loader" aria-hidden="true">
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
