import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CustomCursor from './components/CustomCursor';
import GlobalEffects from './components/GlobalEffects';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import EdgeProgress from './components/EdgeProgress';
import Hero from './components/Hero';
import Prologue from './components/Prologue';
import Archive from './components/Archive';
import Manifesto from './components/Manifesto';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // 1. Lenis Smooth Scroll
    let lenis = null;
    let rafId = null;
    if (!reduceMotion) {
      lenis = new Lenis({
        duration: 1.15,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
      });
      window.__lenis = lenis;

      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      const onRaf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(onRaf);
      };
      rafId = requestAnimationFrame(onRaf);
    }

    // 2. GSAP Animations in a gsap.context for clean lifecycle
    const ctx = gsap.context(() => {
      // Elemen [data-reveal] disembunyikan CSS
      gsap.set('[data-reveal]', { opacity: 1, y: 0, filter: 'none' });

      // Entrance hero (dijalankan setelah preloader selesai)
      const entranceTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      entranceTl
        .from('.hero-title .line--1 > span', { yPercent: 118, duration: 1.1 }, 0)
        .from('.hero-title .line--2 .script', { yPercent: 90, opacity: 0, rotate: -14, duration: 0.9 }, 0.18)
        .from('.hero-intro', { y: 30, opacity: 0, duration: 0.8 }, 0.45)
        .from('.hero-figure', { y: 90, opacity: 0, scale: 0.94, duration: 1.3 }, 0.1)
        .from('.ribbon', { yPercent: 140, rotate: 4, opacity: 0, duration: 1.1 }, 0.5)
        .from('.nav, .edge', { opacity: 0, duration: 0.8 }, 0.6)
        .from('.hero-web', { opacity: 0, scale: 1.1, duration: 1.6 }, 0);

      const onReady = () => entranceTl.play();
      document.addEventListener('arachne:ready', onReady, { once: true });
      const fallbackTimer = setTimeout(() => entranceTl.play(), 2500);

      // Parallax saat hero keluar layar (Desktop vs Mobile via matchMedia)
      ScrollTrigger.matchMedia({
        '(min-width: 961px)': function () {
          gsap.to('.hero-type', {
            yPercent: -26,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero-meta', {
            yPercent: -60,
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
          });
          gsap.to('.hero-figure', {
            yPercent: 6,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.ribbon', {
            yPercent: -220,
            rotate: -6,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero-bg', {
            scale: 1.08,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        },
        '(max-width: 960px)': function () {
          gsap.set('.hero-type, .hero-meta, .hero-figure, .ribbon, .hero-bg', { clearProps: 'transform,opacity' });
        },
      });

      // Layer [data-depth]
      const depthElements = document.querySelectorAll('[data-depth]');
      depthElements.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '0.2');
        gsap.to(el, {
          yPercent: depth * -90,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        if (hasFinePointer) {
          const quick = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' });
          const onMouseMove = (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * depth * 90;
            quick(nx);
          };
          window.addEventListener('mousemove', onMouseMove, { passive: true });
        }
      });

      // PROLOGUE
      gsap.from('.fall-line > span', {
        yPercent: 118,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fall-title', start: 'top 82%' },
      });
      gsap.from('.fall-script', {
        opacity: 0,
        y: 40,
        rotate: -12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fall-title', start: 'top 70%' },
      });
      gsap.to('.fall .sunburst', {
        rotate: 18,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: '.fall', start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.to('.fall-holeshim', {
        scale: 1.25,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: { trigger: '.fall', start: 'top center', end: 'bottom top', scrub: true },
      });

      // ARCHIVE: horizontal scroll track with matchMedia
      const track = document.getElementById('archiveTrack');
      if (track) {
        ScrollTrigger.matchMedia({
          '(min-width: 961px)': function () {
            const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
            gsap.to(track, {
              x: () => -getDistance(),
              ease: 'none',
              scrollTrigger: {
                trigger: '.archive',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            });

            const panelArts = document.querySelectorAll('.panel-art');
            panelArts.forEach((art, i) => {
              gsap.fromTo(
                art,
                { rotate: i % 2 ? 3 : -3, scale: 0.94 },
                {
                  rotate: 0,
                  scale: 1,
                  ease: 'none',
                  scrollTrigger: { trigger: '.archive', start: 'top bottom', end: 'top top', scrub: true },
                }
              );
            });
          },
          '(max-width: 960px)': function () {
            gsap.set(track, { clearProps: 'all' });
            gsap.set('.panel-art', { clearProps: 'all' });
          },
        });
      }

      // MANIFESTO
      gsap.from('.statement', {
        opacity: 0,
        y: 60,
        filter: 'blur(12px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.statement', start: 'top 82%' },
      });
      gsap.to('.manifesto-planes span', {
        rotate: '+=10',
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // Statistik counter
      const stats = document.querySelectorAll('.stat');
      stats.forEach((stat) => {
        const num = stat.querySelector('.stat-num');
        const target = parseInt(num?.dataset.count || num?.textContent || '0', 10);
        if (!num) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.stats', start: 'top 88%' },
          onUpdate: () => {
            num.textContent = String(Math.round(obj.v)).padStart(2, '0');
          },
        });
      });

      // TECH STACK (WORK)
      gsap.from('.work-title', {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-head', start: 'top 85%' },
      });
      gsap.from('.work-script', {
        opacity: 0,
        y: 40,
        rotate: -14,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-head', start: 'top 78%' },
      });
      gsap.from('.work-row', {
        opacity: 0,
        y: 46,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-list', start: 'top 85%' },
      });
      gsap.to('.work .sunburst', {
        rotate: -22,
        ease: 'none',
        scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // CONTACT
      gsap.from('.contact-line > span, .contact-script, .contact-cta', {
        yPercent: 60,
        opacity: 0,
        duration: 1.05,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-inner', start: 'top 85%' },
      });
      gsap.to('.contact .sunburst', {
        rotate: 20,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true },
      });

      // Generic [data-reveal]
      const revealElements = document.querySelectorAll('[data-reveal]');
      revealElements.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 34,
          filter: 'blur(8px)',
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });

      // Navbar Active Link Tick
      const navTick = document.getElementById('navTick');
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const sections = links
        .map((a) => ({ link: a, el: document.getElementById(a.dataset.nav) }))
        .filter((s) => s.el);

      const moveTick = (link) => {
        if (!navTick || !link) return;
        const linkRect = link.getBoundingClientRect();
        const navRect = link.parentElement.getBoundingClientRect();
        navTick.style.transform = `translateX(${linkRect.left - navRect.left + linkRect.width / 2}px)`;
      };

      sections.forEach(({ link, el }) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) {
              links.forEach((l) => l.classList.remove('is-active'));
              link.classList.add('is-active');
              moveTick(link);
            }
          },
        });
      });

      // Progress bar strip kanan
      gsap.to('#edgeProgress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      // Refresh ScrollTrigger when images load
      window.addEventListener('load', () => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 1000);
    });

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        window.__lenis = null;
      }
    };
  }, []);

  return (
    <>
      {/* Kursor kustom */}
      <CustomCursor />

      {/* Lapisan tekstur & partikel canvas global */}
      <GlobalEffects />

      {/* Preloader */}
      <Preloader />

      {/* Navbar */}
      <Navbar />

      {/* Strip vertikal kanan */}
      <EdgeProgress />

      {/* Main Content */}
      <main>
        <Hero />
        <Prologue />
        <Archive />
        <Manifesto />
        <TechStack />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
