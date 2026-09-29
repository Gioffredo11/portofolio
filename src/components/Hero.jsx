import React from 'react';
import ImageSwitcher from './ImageSwitcher';

const RIBBON_WORDS = ['COMMITS', 'INTERFACES', 'BUGS FIXED', 'CSS WARS', 'SHIP IT', 'LEARNING'];

export default function Hero() {
  const renderRibbonContent = () => {
    const items = [];
    for (let round = 0; round < 3; round++) {
      RIBBON_WORDS.forEach((word, i) => {
        items.push(
          <React.Fragment key={`${round}-${i}`}>
            <span className={`ribbon-item${i % 2 ? ' is-alt' : ''}`}>{word}</span>
            <span className="ribbon-sep"></span>
          </React.Fragment>
        );
      });
    }
    return items;
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" id="hero">
      {/* Restrained background layer with subtle watermark */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid-lines"></div>
        <img className="hero-web hero-web--tl" src="/assets/images/web.svg" alt="" decoding="async" />
        <img className="hero-web hero-web--r" src="/assets/images/web.svg" alt="" decoding="async" />
      </div>

      {/* Main hero typography & personal introduction */}
      <div className="hero-type">
        <h1 className="hero-title">
          <span className="line line--1" data-line="1">
            <span>GIOFFREDO</span>
          </span>
          <span className="line line--2" data-line="2">
            <em className="script">builds.</em>
          </span>
        </h1>

        <div className="hero-meta">
          <div className="hero-intro">
            <span className="hero-intro-kicker">FIELD DISPATCH // 2026</span>
            <p className="hero-intro-tag">
              Student developer exploring interface architecture, creative frontend, and software craft.
            </p>
            <p className="hero-intro-body">
              Building responsive web applications, turning experimental ideas into functional code, and documenting the learning process in public.
            </p>

            <div className="hero-actions">
              <a
                href="#archive"
                className="hero-btn hero-btn--primary"
                onClick={(e) => handleScrollTo(e, '#archive')}
                aria-label="Explore archive section"
              >
                <span>EXPLORE ARCHIVE</span>
                <img src="/assets/icons/arrow.svg" alt="" width="11" height="11" decoding="async" />
              </a>
              <a
                href="#contact"
                className="hero-btn hero-btn--ghost"
                onClick={(e) => handleScrollTo(e, '#contact')}
                aria-label="Jump to contact section"
              >
                <span>GET IN TOUCH</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive character portrait switcher */}
      <ImageSwitcher />

      {/* Red caution tape marquee */}
      <div className="ribbon" id="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          <span className="ribbon-row" data-row="a">
            {renderRibbonContent()}
          </span>
          <span className="ribbon-row" data-row="b">
            {renderRibbonContent()}
          </span>
        </div>
      </div>
    </section>
  );
}
