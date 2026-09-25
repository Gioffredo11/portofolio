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

  return (
    <section className="hero" id="hero">
      {/* Layer background */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow hero-glow--red"></div>
        <div className="hero-glow hero-glow--teal"></div>
        <div className="hero-rays" data-depth="0.08"></div>
        <img className="hero-web hero-web--tl" src="assets/images/web.svg" alt="" decoding="async" />
        <img className="hero-web hero-web--r" src="assets/images/web.svg" alt="" decoding="async" />
        <div className="hero-planes" data-depth="0.14">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-scan"></div>
      </div>

      {/* Ledakan garis cahaya teal di belakang kata script "builds." */}
      <div className="hero-burst" aria-hidden="true" data-depth="0.2">
        <i></i>
        <i></i>
        <i></i>
      </div>

      {/* Karakter hero */}
      <ImageSwitcher />

      {/* Judul besar + perkenalan singkat */}
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
            <span className="hero-intro-kicker">FIELD DISPATCH : 2026</span>
            <span className="hero-intro-name">Gioffredo Ho</span>

            <p className="hero-intro-tag">Student developer exploring interfaces, code architectures, and digital craft.</p>

            <p>
              Hello, I am Gioffredo Ho. A student focused on programming, software fundamentals,
              and interactive digital development.
            </p>

            <p>
              I spend my time testing ideas, building responsive applications, and turning
              experimental concepts into functional software.
            </p>

            <p>
              This portfolio documents my progress: a collection of codebases, tools,
              experiments, and daily learning.
            </p>

            <p>Every project is an opportunity to break assumptions, understand the stack, and ship better code.</p>
          </div>
        </div>
      </div>

      {/* Pita marquee merah (caution tape) */}
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
