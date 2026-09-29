import React from 'react';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="label">
          <span>05</span>
          <i></i>TRANSMISSION // CONTACT
        </div>

        <div className="contact-inner">
          <h2 className="contact-title">
            <span className="contact-line">
              <span>LET'S MAKE</span>
            </span>
            <em className="script contact-script">a scene</em>
          </h2>

          <p className="contact-lead">
            Have a project in mind, an interface to refine, or want to discuss programming and creative development?
            Dispatches are always welcome.
          </p>

          <div className="contact-status-bar">
            <span className="contact-status-dot" aria-hidden="true"></span>
            <span className="contact-status-text">AVAILABLE FOR INTERNSHIPS & COLLABORATIONS // 2026</span>
          </div>

          <div className="contact-actions">
            <a
              className="contact-cta"
              href="mailto:ffredogio19@gmail.com"
              data-hover
              aria-label="Send email to ffredogio19@gmail.com"
            >
              <span>SEND EMAIL DISPATCH</span>
              <img src="/assets/icons/arrow.svg" alt="" width="12" height="12" decoding="async" />
            </a>

            <a
              className="contact-social"
              href="https://github.com/Gioffredo11"
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              aria-label="Visit GitHub profile @Gioffredo11"
            >
              <span>GITHUB // @Gioffredo11</span>
              <img src="/assets/icons/arrow.svg" alt="" width="11" height="11" decoding="async" />
            </a>
          </div>

          <p className="contact-direct">
            Direct email : <a href="mailto:ffredogio19@gmail.com" className="contact-email-link">ffredogio19@gmail.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}
