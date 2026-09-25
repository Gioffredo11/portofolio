import React, { useEffect, useRef } from 'react';

const STACK_ITEMS = [
  { idx: '01', name: 'HTML', meta: 'SEMANTIC MARKUP', year: 'MARKUP' },
  { idx: '02', name: 'CSS', meta: 'LAYOUT & ANIMATION', year: 'STYLING' },
  { idx: '03', name: 'JavaScript', meta: 'INTERACTIVITY & LOGIC', year: 'LANGUAGE' },
  { idx: '04', name: 'MySQL', meta: 'DATABASE & QUERIES', year: 'DATABASE' },
  { idx: '05', name: 'Flutter', meta: 'CROSS-PLATFORM APPS', year: 'FRAMEWORK' },
];

export default function TechStack() {
  const sectionRef = useRef(null);
  const scrambleRef = useRef(null);

  // Active item highlight based on nearest to center of viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = Array.from(section.querySelectorAll('.work-row'));
    if (!rows.length) return;

    let raf = null;
    let isObserving = false;

    const update = () => {
      raf = null;
      const mid = window.innerHeight / 2;
      let best = null;
      let bestDist = Infinity;

      rows.forEach((row) => {
        const r = row.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = row;
        }
      });

      const limit = window.innerHeight * 0.42;
      rows.forEach((row) => {
        row.classList.toggle('is-active', row === best && bestDist < limit);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isObserving) {
            isObserving = true;
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            update();
          }
        } else {
          if (isObserving) {
            isObserving = false;
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
          }
        }
      },
      { rootMargin: '100px 0px 100px 0px' }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Glitch Scramble Ticker
  useEffect(() => {
    const el = scrambleRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GLYPHS = '▚▞■□░▒▓⣿≡+×◤◢#$%&/\\|<>*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lines = [
      'TECH STACK : HTML · CSS · JAVASCRIPT · MYSQL · FLUTTER',
      'STILL LEARNING, STILL SHIPPING : EVERY PROJECT A LESSON',
      'STUDENT DEVELOPER : OPEN TO COLLABORATIONS',
    ];

    if (reduceMotion) {
      el.textContent = lines[0];
      return;
    }

    let index = 0;
    let timer = null;
    let loopTimer = null;
    let isDisposed = false;

    const scramble = (text) => {
      let frame = 0;
      const total = 46;

      timer = setInterval(() => {
        if (isDisposed) {
          clearInterval(timer);
          return;
        }
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
          loopTimer = setTimeout(() => {
            if (isDisposed) return;
            index = (index + 1) % lines.length;
            scramble(lines[index]);
          }, 3200);
        }
      }, 34);
    };

    scramble(lines[0]);

    return () => {
      isDisposed = true;
      if (timer) clearInterval(timer);
      if (loopTimer) clearTimeout(loopTimer);
    };
  }, []);

  const handleRowClick = () => {
    const target = document.getElementById('contact');
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWorkWithMeClick = (e) => {
    e.preventDefault();
    handleRowClick();
  };

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="sunburst sunburst--work" aria-hidden="true"></div>

      <header className="work-head">
        <span className="work-ch">CH.04</span>
        <h2 className="work-title">TECH</h2>
        <em className="script work-script">stack</em>
        <a
          className="work-all"
          href="#contact"
          data-hover
          aria-label="Work with me, jump to contact section"
          onClick={handleWorkWithMeClick}
        >
          WORK WITH ME{' '}
          <img src="assets/icons/arrow.svg" alt="" width="11" height="11" decoding="async" />
        </a>
      </header>

      <ul className="work-list" id="workList">
        {STACK_ITEMS.map((item) => (
          <li
            className="work-row"
            data-hover
            key={item.idx}
            tabIndex={0}
            role="button"
            aria-label={`${item.name}, ${item.meta}`}
            onClick={handleRowClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRowClick();
              }
            }}
          >
            <span className="work-idx">{item.idx}</span>
            <h3 className="work-name">{item.name}</h3>
            <span className="work-meta">{item.meta}</span>
            <span className="work-year">{item.year}</span>
          </li>
        ))}
      </ul>

      {/* Ticker glitch "TRANSMISSION" di bawah daftar */}
      <div className="transmission" aria-hidden="true">
        <span className="transmission-label">≡ TRANSMISSION</span>
        <span className="transmission-scramble" id="scramble" ref={scrambleRef}></span>
      </div>
    </section>
  );
}
