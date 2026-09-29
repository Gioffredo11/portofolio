import React, { useEffect, useRef } from 'react';

const STACK_ITEMS = [
  {
    idx: '01',
    name: 'HTML',
    meta: 'SEMANTIC ARCHITECTURE',
    year: 'MARKUP',
    focus: 'Accessible DOM structures, clean heading hierarchy, and WCAG AA standards.',
  },
  {
    idx: '02',
    name: 'CSS',
    meta: 'MODERN LAYOUT & MOTION',
    year: 'STYLING',
    focus: 'Fluid clamp() scales, responsive grid & flexbox systems, and hardware-accelerated transitions.',
  },
  {
    idx: '03',
    name: 'JavaScript',
    meta: 'LOGIC & ASYNC COORDINATION',
    year: 'LANGUAGE',
    focus: 'Modern ES6+ async patterns, state coordination, and GSAP timeline choreography.',
  },
  {
    idx: '04',
    name: 'MySQL',
    meta: 'DATABASE ARCHITECTURE',
    year: 'DATABASE',
    focus: 'Relational data modeling, schema indexing, and structured SQL operations.',
  },
  {
    idx: '05',
    name: 'Flutter',
    meta: 'CROSS-PLATFORM CLIENT',
    year: 'FRAMEWORK',
    focus: 'Declarative component trees, cross-platform mobile UI, and reactive state management.',
  },
];

export default function TechStack() {
  const sectionRef = useRef(null);
  const scrambleRef = useRef(null);

  // Active item highlight on scroll
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

      const limit = window.innerHeight * 0.4;
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

  // Clean developer telemetry ticker
  useEffect(() => {
    const el = scrambleRef.current;
    if (!el) return;

    const lines = [
      'FIELD TELEMETRY // CORE TOOLKIT: HTML5 · MODERN CSS3 · ES6+ JS · MYSQL · FLUTTER',
      'DEVELOPER DISPATCH // CONTINUOUS PRACTICE: BUILDING CLEAN INTERFACES IN PUBLIC',
      'SYSTEM STATUS // ACTIVE & AVAILABLE FOR COLLABORATIVE EXPERIMENTS // JAKARTA (UTC+7)',
    ];

    let index = 0;
    el.textContent = lines[0];

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const interval = setInterval(() => {
      index = (index + 1) % lines.length;
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        el.textContent = lines[index];
        el.style.opacity = '1';
      }, 300);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleWorkWithMeClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('contact');
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="work-container">
        <div className="label">
          <span>04</span>
          <i></i>TECH STACK // TOOLING & SKILLS
        </div>

        <header className="work-head">
          <div className="work-title-wrap">
            <h2 className="work-title">TECH</h2>
            <em className="script work-script">stack</em>
          </div>
          <a
            className="work-all"
            href="#contact"
            data-hover
            aria-label="Work with me, jump to contact section"
            onClick={handleWorkWithMeClick}
          >
            <span>WORK WITH ME</span>
            <img src="/assets/icons/arrow.svg" alt="" width="11" height="11" decoding="async" />
          </a>
        </header>

        <ul className="work-list" id="workList" aria-label="Technical skills breakdown">
          {STACK_ITEMS.map((item) => (
            <li
              className="work-row"
              data-hover
              key={item.idx}
              tabIndex={0}
              aria-label={`${item.name}, ${item.meta}: ${item.focus}`}
            >
              <span className="work-idx">{item.idx}</span>
              <div className="work-main">
                <h3 className="work-name">{item.name}</h3>
                <span className="work-meta">{item.meta}</span>
              </div>
              <p className="work-focus-desc">{item.focus}</p>
              <span className="work-year">{item.year}</span>
            </li>
          ))}
        </ul>

        {/* Bottom telemetry status bar */}
        <div className="transmission" aria-hidden="true">
          <span className="transmission-label">≡ FIELD TELEMETRY</span>
          <span className="transmission-scramble" id="scramble" ref={scrambleRef}></span>
        </div>
      </div>
    </section>
  );
}
