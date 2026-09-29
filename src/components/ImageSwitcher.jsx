import React, { useState, useEffect, useRef } from 'react';

const IMG_PETER = '/assets/images/tom holland.jpeg';
const IMG_SPIDER = '/assets/images/character-spiderman-cut.png';

export default function ImageSwitcher() {
  const [current, setCurrent] = useState(1); // 1 = Peter Parker, 2 = Spider-Man
  const [isTransforming, setIsTransforming] = useState(false);
  const [chromaSrc, setChromaSrc] = useState(IMG_PETER);
  const [ghostSrc, setGhostSrc] = useState(IMG_PETER);

  const frameRef = useRef(null);
  const buttonRef = useRef(null);
  const busyRef = useRef(false);
  const glitchTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  // Preload character images
  useEffect(() => {
    [IMG_PETER, IMG_SPIDER].forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    });
  }, []);

  // Periodic subtle comic glitch
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const rand = (min, max) => min + Math.random() * (max - min);

    const scheduleGlitch = (delay) => {
      glitchTimerRef.current = setTimeout(() => {
        if (frameRef.current) frameRef.current.classList.add('is-glitch');
        document.dispatchEvent(new CustomEvent('arachne:glitch'));
        setTimeout(() => {
          if (frameRef.current) frameRef.current.classList.remove('is-glitch');
          scheduleGlitch(rand(4500, 9000));
        }, 480);
      }, delay);
    };

    scheduleGlitch(2400);

    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  // Mouse Parallax for Character (desktop only)
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer || reduceMotion) return;

    const hero = document.getElementById('hero');
    const button = buttonRef.current;
    if (!hero || !button) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      button.style.setProperty('--px', tx.toFixed(2) + 'px');
      button.style.setProperty('--py', ty.toFixed(2) + 'px');
    };

    const queue = () => {
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    const onMouseMove = (e) => {
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 8;
      queue();
    };

    const onMouseLeave = () => {
      tx = 0;
      ty = 0;
      queue();
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleTransform = () => {
    if (busyRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = reduceMotion ? 0 : 800;

    const outgoingSrc = current === 1 ? IMG_PETER : IMG_SPIDER;
    const incomingSrc = current === 1 ? IMG_SPIDER : IMG_PETER;
    const nextCurrent = current === 1 ? 2 : 1;

    busyRef.current = true;
    setChromaSrc(outgoingSrc);

    if (DURATION === 0) {
      setCurrent(nextCurrent);
      setGhostSrc(incomingSrc);
      busyRef.current = false;
      return;
    }

    setIsTransforming(true);

    transitionTimerRef.current = setTimeout(() => {
      setCurrent(nextCurrent);
      setGhostSrc(incomingSrc);
      setIsTransforming(false);
      busyRef.current = false;
    }, DURATION);
  };

  const nextLabel = current === 1 ? 'Spider-Man' : 'Peter Parker';
  const nowLabel = current === 1 ? 'Peter Parker' : 'Spider-Man';

  return (
    <div className="hero-figure" id="figure" data-depth="0.18">
      {/* Editorial Comic Frame */}
      <div className="figure-frame" ref={frameRef}>
        <div className="figure-corners" aria-hidden="true">
          <span className="corner corner--tl"></span>
          <span className="corner corner--tr"></span>
          <span className="corner corner--bl"></span>
          <span className="corner corner--br"></span>
        </div>

        <button
          ref={buttonRef}
          className={`figure-switch ${isTransforming ? 'is-transforming' : ''}`}
          id="figureSwitch"
          type="button"
          onClick={handleTransform}
          aria-label={`Hero character portrait: click to switch to ${nextLabel}`}
        >
          {/* IMAGE 1: Peter Parker */}
          <img
            className={`switch-img switch-img--a ${current === 1 ? 'is-active' : ''}`}
            id="switchImgA"
            src={IMG_PETER}
            alt="Peter Parker holding a strawberry in everyday student attire"
            width="736"
            height="1138"
            draggable="false"
            decoding="async"
          />

          {/* IMAGE 2: Spider-Man */}
          <img
            className={`switch-img switch-img--b ${current === 2 ? 'is-active' : ''}`}
            id="switchImgB"
            src={IMG_SPIDER}
            alt="Spider-Man in classic red and black suit"
            width="736"
            height="1138"
            draggable="false"
            decoding="async"
          />

          {/* RGB Chroma Channels for Transformation */}
          <span className="sw-chroma sw-chroma--r" aria-hidden="true">
            <img id="swChromaR" src={chromaSrc} alt="" decoding="async" />
          </span>
          <span className="sw-chroma sw-chroma--b" aria-hidden="true">
            <img id="swChromaB" src={chromaSrc} alt="" decoding="async" />
          </span>

          {/* Glitch Ghost */}
          <img
            className="figure-glitch"
            id="swGhost"
            src={ghostSrc}
            alt=""
            aria-hidden="true"
            decoding="async"
          />

          {/* Transition Texture Layers */}
          <span className="sw-scan" aria-hidden="true"></span>
          <span className="sw-flash" aria-hidden="true"></span>
        </button>

        {/* Editorial Identity Caption Bar */}
        <div className="figure-caption">
          <span className="figure-caption-tag">
            <i className="status-dot" aria-hidden="true"></i>
            {nowLabel}
          </span>
          <span className="figure-caption-action">CLICK TO SHIFT</span>
        </div>
      </div>

      <span className="sr-only" id="figureStatus" role="status" aria-live="polite">
        Showing portrait of {nowLabel}
      </span>
    </div>
  );
}
