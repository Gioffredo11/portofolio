import React from 'react';

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto-container">
        <div className="label">
          <span>03</span>
          <i></i>MANIFESTO // PHILOSOPHY
        </div>

        <div className="manifesto-header">
          <h2 className="manifesto-headline">BUILDING BEYOND THE SYLLABUS.</h2>
          <blockquote className="statement" id="statement">
            “I don't wait for a syllabus to tell me what to build: every idea
            worth wondering about becomes a <em className="script">project</em>, and every project
            hands me a skill I didn't have before. This is that learning made{' '}
            <em className="script">visible</em>.”
          </blockquote>
        </div>

        <div className="manifesto-aside">
          <p data-reveal>
            Based in Indonesia, I spend my time exploring programming, interface architecture, and digital
            craft, turning ideas that start as rough sketches into software experiments
            that actually run in production.
          </p>
          <p data-reveal>
            I'm in no rush to look finished. I'd rather show the process: what I'm learning, what breaks
            along the way, and how each experiment pushes the next build a little further.
          </p>
        </div>

        <dl className="stats">
          <div className="stat" data-reveal>
            <dd className="stat-num" data-count="4" data-plus="">04</dd>
            <dt>YEARS EXPLORING CODE</dt>
            <span className="stat-sub">Self-directed experimentation</span>
          </div>
          <div className="stat" data-reveal>
            <dd className="stat-num" data-count="10" data-plus="+">10+</dd>
            <dt>LAB BUILDS & EXPERIMENTS</dt>
            <span className="stat-sub">Interactive web & mobile tools</span>
          </div>
          <div className="stat" data-reveal>
            <dd className="stat-num" data-count="5" data-plus="">05</dd>
            <dt>CORE TECH FOUNDATIONS</dt>
            <span className="stat-sub">HTML, CSS, JS, SQL, Flutter</span>
          </div>
        </dl>
      </div>
    </section>
  );
}
