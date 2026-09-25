import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isStuck, setIsStuck] = useState(false);
  const [timeStr, setTimeStr] = useState('JKT : 00:00:00');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navTickRef = useRef(null);

  useEffect(() => {
    // Clock without em dash
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const updateClock = () => {
      setTimeStr(`JKT : ${fmt.format(new Date())}`);
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    // Stuck scroll listener
    const onScroll = () => {
      setIsStuck(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      clearInterval(clockTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Escape key listener and body lock for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const target = document.querySelector(targetId);
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <>
      <header className={`nav ${isStuck ? 'is-stuck' : ''}`} id="nav">
        <a
          className="brand"
          href="#hero"
          aria-label="Gioffredo Ho, kembali ke atas"
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          <span className="brand-word">GIOFFREDO HO</span>
          <span className="brand-dot" aria-hidden="true"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" aria-label="Navigasi utama">
          <a
            href="#archive"
            className="nav-link"
            data-nav="archive"
            onClick={(e) => handleNavClick(e, '#archive')}
          >
            ARCHIVE<sup>01</sup>
          </a>
          <a
            href="#work"
            className="nav-link"
            data-nav="work"
            onClick={(e) => handleNavClick(e, '#work')}
          >
            STACK<sup>02</sup>
          </a>
          <a
            href="#manifesto"
            className="nav-link"
            data-nav="manifesto"
            onClick={(e) => handleNavClick(e, '#manifesto')}
          >
            STUDIO<sup>03</sup>
          </a>
          <a
            href="#contact"
            className="nav-link"
            data-nav="contact"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            CONTACT<sup>04</sup>
          </a>
          <span className="nav-tick" id="navTick" ref={navTickRef} aria-hidden="true"></span>
        </nav>

        <div className="nav-right">
          <span className="nav-clock" id="clock">{timeStr}</span>
          
          {/* Mobile Menu Button with 48x48 tap target */}
          <button
            type="button"
            className={`nav-hamburger ${isMobileOpen ? 'is-active' : ''}`}
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={toggleMobileMenu}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        id="mobile-nav-drawer"
        className={`mobile-drawer ${isMobileOpen ? 'is-open' : ''}`}
        aria-hidden={!isMobileOpen}
      >
        <div className="mobile-drawer-backdrop" onClick={() => setIsMobileOpen(false)}></div>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-tag">NAVIGATION // FIELD MENU</span>
            <span className="mobile-drawer-clock">{timeStr}</span>
          </div>

          <nav className="mobile-drawer-nav" aria-label="Menu navigasi mobile">
            <a
              href="#hero"
              className="mobile-nav-item"
              onClick={(e) => handleNavClick(e, '#hero')}
            >
              <span className="mobile-nav-num">01</span>
              <span className="mobile-nav-text">OVERVIEW</span>
              <span className="mobile-nav-sub">Top of Space</span>
            </a>
            <a
              href="#fall"
              className="mobile-nav-item"
              onClick={(e) => handleNavClick(e, '#fall')}
            >
              <span className="mobile-nav-num">02</span>
              <span className="mobile-nav-text">PROLOGUE</span>
              <span className="mobile-nav-sub">Field Note</span>
            </a>
            <a
              href="#archive"
              className="mobile-nav-item"
              onClick={(e) => handleNavClick(e, '#archive')}
            >
              <span className="mobile-nav-num">03</span>
              <span className="mobile-nav-text">ARCHIVE</span>
              <span className="mobile-nav-sub">Interactive Panels</span>
            </a>
            <a
              href="#work"
              className="mobile-nav-item"
              onClick={(e) => handleNavClick(e, '#work')}
            >
              <span className="mobile-nav-num">04</span>
              <span className="mobile-nav-text">TECH STACK</span>
              <span className="mobile-nav-sub">Tools & Languages</span>
            </a>
            <a
              href="#manifesto"
              className="mobile-nav-item"
              onClick={(e) => handleNavClick(e, '#manifesto')}
            >
              <span className="mobile-nav-num">05</span>
              <span className="mobile-nav-text">STUDIO & MANIFESTO</span>
              <span className="mobile-nav-sub">Process & Growth</span>
            </a>
            <a
              href="#contact"
              className="mobile-nav-item mobile-nav-item--cta"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              <span className="mobile-nav-num">06</span>
              <span className="mobile-nav-text">TRANSMISSION</span>
              <span className="mobile-nav-sub">Get In Touch</span>
            </a>
          </nav>

          <div className="mobile-drawer-footer">
            <p>Gioffredo Ho : Student Developer</p>
            <span>Jakarta, ID</span>
          </div>
        </div>
      </div>
    </>
  );
}
