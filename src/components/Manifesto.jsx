import React from 'react';

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="sunburst sunburst--manifesto" aria-hidden="true"></div>
      <div className="manifesto-planes" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p className="label">
        <span>02</span>
        <i></i>MANIFESTO
      </p>

      <p className="statement" id="statement">
        I'm a student, but I don't wait for a syllabus to tell me what to build: every idea
        worth wondering about becomes a <em className="script">project</em>, and every project
        hands me a skill I didn't have before. This is that learning made{' '}
        <em className="script">visible</em>.
      </p>

      <div className="manifesto-aside">
        <p data-reveal>
          Based in Indonesia, I spend my time around programming, technology, and digital
          development, turning ideas that start as notes into interfaces and software experiments
          that actually run.
        </p>
        <p data-reveal>
          I'm in no rush to look finished. I'd rather show the process: what I'm learning, what I
          break along the way, and how each experiment pushes the next build a little further.
        </p>
      </div>

      <dl className="stats">
        <div className="stat" data-reveal>
          <div className="stat-bar" style={{ '--bar': '#ff3b30' }}></div>
          <dd className="stat-num" data-count="4" data-plus="">04</dd>
          <dt>YEARS EXPLORING CODE</dt>
        </div>
        <div className="stat" data-reveal>
          <div className="stat-bar" style={{ '--bar': '#86dfd2' }}></div>
          <dd className="stat-num" data-count="10" data-plus="+">10+</dd>
          <dt>LAB BUILDS & EXPERIMENTS</dt>
        </div>
        <div className="stat" data-reveal>
          <div className="stat-bar" style={{ '--bar': '#7c6bff' }}></div>
          <dd className="stat-num" data-count="5" data-plus="">05</dd>
          <dt>CORE TECH FOUNDATIONS</dt>
        </div>
      </dl>
    </section>
  );
}
