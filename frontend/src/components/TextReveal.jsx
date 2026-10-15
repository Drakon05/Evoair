import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextReveal = ({ children, className = '', delay = 0, speed = 0.8 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Convert text into staggered spans
    const text = el.innerText.trim();
    // Split into characters, keeping spaces as &nbsp;
    el.innerHTML = text
      .split('')
      .map((char) => {
        if (char === ' ') return `<span class="reveal-char" style="display: inline-block;">&nbsp;</span>`;
        return `<span class="reveal-char" style="display: inline-block; transform: translateY(22px); opacity: 0;">${char}</span>`;
      })
      .join('');

    const chars = el.querySelectorAll('.reveal-char');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(chars, {
              y: 0,
              opacity: 1,
              duration: speed,
              stagger: 0.02,
              ease: 'cubic-bezier(.22,.61,.36,1)',
              delay: delay,
            });
            // Stop observing once animated
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [children, delay, speed]);

  return (
    <span
      ref={containerRef}
      className={`text-reveal ${className}`}
      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
    >
      {children}
    </span>
  );
};

export default TextReveal;
