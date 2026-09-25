import React from 'react';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="sunburst sunburst--contact" aria-hidden="true"></div>
      <div className="contact-planes" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p className="label">
        <span>03</span>
        <i></i>TRANSMISSION
      </p>

      <div className="contact-inner">
        <h2 className="contact-title">
          <span className="contact-line">
            <span>LET'S MAKE</span>
          </span>
          <em className="script contact-script">a scene</em>
        </h2>
        <a className="contact-cta" href="mailto:hello@gioffredo.dev" data-hover>
          <span>START A PROJECT</span>
          <img src="assets/icons/arrow.svg" alt="" width="14" height="14" decoding="async" />
        </a>
      </div>
    </section>
  );
}
