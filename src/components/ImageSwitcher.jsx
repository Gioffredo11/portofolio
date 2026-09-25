import React, { useState, useEffect, useRef } from 'react';

const IMG_PETER = 'assets/images/tom holland.jpeg';
const IMG_SPIDER = 'assets/images/character-spiderman-cut.png';
const IMG_CHROMA_FALLBACK = 'assets/images/character-peter.jpg';

export default function ImageSwitcher() {
  const [current, setCurrent] = useState(1); // 1 = Peter Parker, 2 = Spider-Man
  const [isTransforming, setIsTransforming] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [chromaSrc, setChromaSrc] = useState(IMG_PETER);
  const [ghostSrc, setGhostSrc] = useState(IMG_PETER);
  const [isGlitching, setIsGlitching] = useState(false);

  const buttonRef = useRef(null);
  const busyRef = useRef(false);
  const glitchTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  // Preload both character images
  useEffect(() => {
    [IMG_PETER, IMG_SPIDER].forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    });
  }, []);

  // Periodic Glitch
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const rand = (min, max) => min + Math.random() * (max - min);

    const scheduleGlitch = (delay) => {
      glitchTimerRef.current = setTimeout(() => {
        setIsGlitching(true);
        document.dispatchEvent(new CustomEvent('arachne:glitch'));
        setTimeout(() => {
          setIsGlitching(false);
          scheduleGlitch(rand(2600, 6200));
        }, 560);
      }, delay);
    };

    scheduleGlitch(1800);

    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  // Mouse Parallax for Character
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
      tx = ((e.clientX - r.left) / r.width - 0.5) * 16;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 12;
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
    const DURATION = reduceMotion ? 0 : 900;

    const outgoingSrc = current === 1 ? IMG_PETER : IMG_SPIDER;
    const incomingSrc = current === 1 ? IMG_SPIDER : IMG_PETER;
    const nextCurrent = current === 1 ? 2 : 1;

    busyRef.current = true;
    setChromaSrc(outgoingSrc);

    if (!hintDismissed) {
      setHintDismissed(true);
    }

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
    <div className="hero-figure" id="figure" data-depth="0.3">
      <div className="figure-rings" aria-hidden="true">
        <span className="ring ring--1"></span>
        <span className="ring ring--2"></span>
        <span className="ring ring--3"></span>
      </div>

      <div className={`figure-frame ${isGlitching ? 'is-glitch' : ''}`}>
        <button
          ref={buttonRef}
          className={`figure-switch ${isTransforming ? 'is-transforming' : ''}`}
          id="figureSwitch"
          type="button"
          onClick={handleTransform}
          aria-label={`Karakter hero : tampilkan versi ${nextLabel} (klik atau tekan Enter)`}
        >
          {/* IMAGE 1 */}
          <img
            className={`switch-img switch-img--a ${current === 1 ? 'is-active' : ''}`}
            id="switchImgA"
            src={IMG_PETER}
            alt="Pemuda berjaket membawa buku di koridor sekolah"
            width="736"
            height="1308"
            draggable="false"
            decoding="async"
          />

          {/* IMAGE 2 */}
          <img
            className={`switch-img switch-img--b ${current === 2 ? 'is-active' : ''}`}
            id="switchImgB"
            src={IMG_SPIDER}
            alt="Ilustrasi Spider-Man berkostum merah dan hitam"
            width="736"
            height="1308"
            draggable="false"
            decoding="async"
          />

          {/* RGB Chroma Channels */}
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

          {/* Transition Layers */}
          <span className="sw-noise" aria-hidden="true"></span>
          <span className="sw-scan" aria-hidden="true"></span>
          <span className="sw-sweep" aria-hidden="true"></span>
          <span className="sw-flash" aria-hidden="true"></span>
          <span className="sw-shock" aria-hidden="true"></span>
        </button>
      </div>

      <span className="figure-rule" aria-hidden="true"></span>
      <span
        className={`figure-hint ${hintDismissed ? 'is-off' : 'is-on'}`}
        id="figureHint"
        aria-hidden="true"
      >
        TAP OR CLICK TO SHIFT IDENTITY
      </span>
      <span className="sr-only" id="figureStatus" role="status" aria-live="polite">
        Menampilkan versi {nowLabel}
      </span>
    </div>
  );
}
