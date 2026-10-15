import React, { useRef, useEffect } from 'react';

/**
 * AirflowMist — Ultra-subtle canvas-based micro-mist renderer.
 * Renders large, extremely soft radial-gradient blobs drifting right-to-left
 * across 3 depth layers. The canvas itself has a CSS blur filter applied
 * for an additional layer of softness.
 */
const AirflowMist = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const blobsRef = useRef([]);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, dpr;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createBlobs();
    };

    const createBlobs = () => {
      const blobs = [];

      // Layer 1: Deep background atmospheric haze — very large, very faint
      for (let i = 0; i < 5; i++) {
        blobs.push({
          x: Math.random() * w * 1.3,
          y: h * (0.15 + Math.random() * 0.7),
          r: 200 + Math.random() * 250,
          speed: 0.08 + Math.random() * 0.06,
          opacity: 0.008 + Math.random() * 0.006,
          yDrift: (Math.random() - 0.5) * 0.02,
        });
      }

      // Layer 2: Mid-ground soft mist
      for (let i = 0; i < 6; i++) {
        blobs.push({
          x: Math.random() * w * 1.3,
          y: h * (0.2 + Math.random() * 0.6),
          r: 100 + Math.random() * 160,
          speed: 0.18 + Math.random() * 0.12,
          opacity: 0.012 + Math.random() * 0.008,
          yDrift: (Math.random() - 0.5) * 0.04,
        });
      }

      // Layer 3: Foreground dense core — smaller, slightly more visible
      for (let i = 0; i < 5; i++) {
        blobs.push({
          x: Math.random() * w * 1.3,
          y: h * (0.3 + Math.random() * 0.4),
          r: 60 + Math.random() * 100,
          speed: 0.3 + Math.random() * 0.15,
          opacity: 0.018 + Math.random() * 0.012,
          yDrift: (Math.random() - 0.5) * 0.05,
        });
      }

      blobsRef.current = blobs;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!isVisibleRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      blobsRef.current.forEach((blob) => {
        blob.x -= blob.speed;
        blob.y += blob.yDrift;

        // Seamless recycle — re-enter from right
        if (blob.x + blob.r < -100) {
          blob.x = w + blob.r + Math.random() * 150;
          blob.y = h * (0.2 + Math.random() * 0.6);
        }

        // Gentle y-boundary bounce
        if (blob.y < h * 0.05 || blob.y > h * 0.95) {
          blob.yDrift *= -1;
        }

        // Soft radial gradient — warm white to transparent
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.r
        );
        gradient.addColorStop(0, `rgba(255, 250, 245, ${blob.opacity})`);
        gradient.addColorStop(0.3, `rgba(250, 245, 240, ${blob.opacity * 0.5})`);
        gradient.addColorStop(0.6, `rgba(240, 235, 230, ${blob.opacity * 0.15})`);
        gradient.addColorStop(1, 'rgba(230, 225, 220, 0)');

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        filter: 'blur(40px)',
      }}
    />
  );
};

export default AirflowMist;
