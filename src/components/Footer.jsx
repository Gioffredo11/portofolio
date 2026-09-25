import React from 'react';

export default function Footer() {
  const handleBackToTop = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo('#hero', { offset: 0, duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <span>© 2026 GIOFFREDO HO</span>
      <span className="footer-mid">DESIGNED &amp; CODED BY GIOFFREDO HO : BUILT WITH REACT &amp; VITE.</span>
      <a href="#hero" data-hover aria-label="Kembali ke bagian atas halaman" onClick={handleBackToTop}>
        BACK TO TOP ↑
      </a>
    </footer>
  );
}
