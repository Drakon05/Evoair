import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Global Layout component that provides Lenis smooth scrolling across all pages.
 */
const Layout = ({ children, disabled = false }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    lenisRef.current = lenis;

    let animId;
    const raf = (time) => {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    };
    animId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (e.scroll > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  return <>{children}</>;
};

export default Layout;
