import React from 'react';

export default function Prologue() {
  return (
    <section className="fall" id="fall">
      <div className="sunburst" aria-hidden="true"></div>
      <div className="fall-holeshim" aria-hidden="true"></div>
      <div className="fall-debris" aria-hidden="true"></div>
      <div className="fall-planes" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p className="label">
        <span>01</span>
        <i></i>PROLOGUE
      </p>

      <div className="fall-inner">
        <h2 className="fall-title">
          <span className="fall-line">
            <span>DON'T</span>
          </span>
          <span className="fall-line fall-line--2">
            <span>LOOK</span>
          </span>
          <em className="script fall-script">down</em>
        </h2>

        <figure className="quote-card" data-reveal>
          <blockquote>
            EVERY PROJECT STARTS THE SAME WAY: A CURIOUS IDEA, AN EMPTY FILE, AND NO REAL CLUE HOW LONG IT WILL TAKE.
          </blockquote>
          <figcaption>Field note : learning in public</figcaption>
        </figure>
      </div>
    </section>
  );
}
