import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Import custom components
import Noise from './components/Noise';
import Iridescence from './components/Iridescence';
import TextReveal from './components/TextReveal';
import MagneticButton from './components/MagneticButton';
import AirflowMist from './components/AirflowMist'; // Unused

import Plasma from './components/Plasma'; // Unused
import ModelViewer from './components/ModelViewer';
import Masonry from './components/Masonry';
import MagicRings from './components/MagicRings';
import BlackHole from './components/BlackHole';
import newLogo from './assets/new-logo.png';
import pricingImage from './assets/product-pricing.png';
import girlDither from './assets/girl dither.jpg';
import ShinyText from './components/ShinyText';
import revealVideo from './assets/reveal-video.mp4';
import CardSwap, { Card } from './components/CardSwap';
import Products from './components/Products';
import Cart from './components/Cart';
import CartNavButton from './components/CartIcon';
import EvoFills from './components/EvoFills';
import EvoBottles from './components/EvoBottles';
import Checkout from './components/Checkout';
import { AuthProvider } from './context/AuthContext';
import { AuthNavButton } from './components/AuthModal';
import { saveNavigationSource, scrollToTargetSection, navigateBack } from './utils/navigation';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const resolveCurrentRoute = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  if (path === '/cart' || path.endsWith('/cart.html') || hash === '#cart') {
    return 'cart';
  }
  if (hash === '#checkout') {
    return 'checkout';
  }
  if (
    path === '/products' ||
    path.endsWith('/products.html') ||
    hash === '#products' ||
    hash === '#evofills' ||
    hash === '#evobottles'
  ) {
    return 'products';
  }
  return 'home';
};

const MainApp = () => {
  const [currentRoute, setCurrentRoute] = useState(resolveCurrentRoute);
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    const route = resolveCurrentRoute();
    if (route !== 'home') return false;
    // If returning via hash to a specific section or if intro already played, skip intro loader
    const hash = window.location.hash.toLowerCase();
    if (hash && hash !== '#hero' && hash !== '#home') return false;
    if (sessionStorage.getItem('evo_intro_played') === 'true') return false;
    return true;
  });
  const [percent, setPercent] = useState(0);
  const [hasRevealPlayed, setHasRevealPlayed] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (resolveCurrentRoute() !== 'home') return true;
    if (sessionStorage.getItem('evo_intro_played') === 'true') return true;
    const hash = window.location.hash.toLowerCase();
    if (hash && hash !== '#hero' && hash !== '#home') return true;
    return false;
  });

  const iridescenceRef = useRef(null);

  // 1. Simulate GLTF model load completes (only on home landing page)
  useEffect(() => {
    if (currentRoute !== 'home' || !loading) return;
    let currentPercent = 0;
    const interval = setInterval(() => {
      // Linear load progress simulation
      currentPercent += Math.floor(Math.random() * 15) + 5;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        
        // Wait 300ms after load finishes before initiating the reveal timeline
        setTimeout(() => {
          setLoading(false);
          setHasRevealPlayed(true);
          sessionStorage.setItem('evo_intro_played', 'true');
          startRevealTimeline();
        }, 300);
      }
      setPercent(currentPercent);
    }, 120);

    return () => clearInterval(interval);
  }, [currentRoute, loading]);

  // 2. Setup Lenis Smooth Scroll, Mouse Listeners & ScrollTrigger Integration
  useEffect(() => {
    if (loading) return;

    // Smooth Scroll Integration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    window.__lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Sticky glass navbar effect on scroll and continuously track active section
    let scrollDebounce;
    lenis.on('scroll', (e) => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (e.scroll > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        saveNavigationSource();
      }, 150);
    });

    // Handle initial restoration to target section if returning via hash or saved state
    const targetHash = window.location.hash.replace('#', '').toLowerCase();
    if (targetHash && targetHash !== 'hero' && targetHash !== 'home' && targetHash !== 'cart') {
      setTimeout(() => {
        scrollToTargetSection(targetHash);
      }, 150);
    } else {
      try {
        const raw = sessionStorage.getItem('evo_nav_source');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.sectionId && parsed.sectionId !== 'hero' && !parsed.pathname.includes('/products')) {
            setTimeout(() => {
              scrollToTargetSection(parsed.sectionId, parsed.scrollY);
            }, 150);
          }
        }
      } catch (err) {}
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && hash !== 'hero' && hash !== 'home' && hash !== 'cart' && hash !== 'checkout') {
        scrollToTargetSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [loading]);

  // 3. Orchestrate the Master GSAP Reveal Timeline
  const startRevealTimeline = () => {
    // Master timeline
    const tl = gsap.timeline();

    // 0.2 sec: Iridescence fades in
    tl.to(iridescenceRef.current, {
      opacity: 0.08,
      duration: 1.5,
      ease: 'power2.out',
    }, 0.2);

    // 0.5 sec: Reveal Intro Elements stagger-in on landing video overlay
    const labelEl = document.querySelector('.reveal-intro-label');
    const titleEl = document.querySelector('.reveal-intro-title');
    const subEl = document.querySelector('.reveal-intro-subtitle');
    const hintEl = document.getElementById('scroll-hint');

    tl.to(labelEl, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
    }, 0.5);

    tl.to(titleEl, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, 0.7);

    tl.to(subEl, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
    }, 1.1);

    tl.to(hintEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 1.5);

    // 1.8 sec: Navigation fades in
    tl.to('nav', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 1.8);
  };

  // 4. Scroll Reveal Animations (ScrollTrigger)
  useEffect(() => {
    if (loading || currentRoute !== 'home') return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Scroll reveal for general content blocks
        const revealElements = document.querySelectorAll('.scroll-reveal-el');
        revealElements.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none', // animate once
              }
            }
          );
        });

        // Scroll reveal for text items like craftsmanship grid cells
        const staggeredGrids = document.querySelectorAll('.craft-details');
        staggeredGrids.forEach((grid) => {
          const items = grid.querySelectorAll('.craft-card-wrapper');
          gsap.fromTo(items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: grid,
                start: 'top 80%',
              }
            }
          );
        });

        // Philosophy line reveal trigger
        const philSection = document.getElementById('philosophy');
        const philLines = document.querySelectorAll('.philosophy-line');
        if (philSection && philLines.length) {
          gsap.timeline({
            scrollTrigger: {
              trigger: philSection,
              start: 'top 60%',
            }
          }).to(philLines, {
            opacity: 1,
            stagger: 0.25,
            duration: 0.8,
            ease: 'power2.out',
          });
        }

        // Technology stats reveal trigger
        const techSection = document.getElementById('technology');
        const stats = document.querySelectorAll('.tech-stat');
        if (techSection && stats.length) {
          gsap.fromTo(stats,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: techSection,
                start: 'top 75%',
              }
            }
          );
        }

        // Pricing block reveal trigger
        const pricingSection = document.getElementById('pricing');
        const priceDisplay = document.getElementById('price-display');
        if (pricingSection && priceDisplay) {
          gsap.fromTo(priceDisplay,
            { scale: 0.93, opacity: 0, y: 50, rotate: -45 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: -45,
              duration: 2.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: pricingSection,
                start: 'top 75%',
              }
            }
          );
        }

        // Airflow editorial section — staggered reveal
        const airflowSection = document.getElementById('airflow');
        const afRevealEls = document.querySelectorAll('.af-reveal');
        if (airflowSection && afRevealEls.length) {
          gsap.fromTo(afRevealEls,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.18,
              duration: 1.0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: airflowSection,
                start: 'top 70%',
              }
            }
          );
        }
      });

      ScrollTrigger.refresh();

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, currentRoute]);

  useEffect(() => {
    const handleRouteChange = () => {
      const nextRoute = resolveCurrentRoute();
      setCurrentRoute(nextRoute);
      if (nextRoute !== 'home') {
        setLoading(false);
      }
    };
    
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (currentRoute === 'cart') {
    return <Cart />;
  }
  if (currentRoute === 'checkout') {
    return <Checkout />;
  }
  if (currentRoute === 'products' || currentRoute === 'evofills' || currentRoute === 'evobottles') {
    return <Products />;
  }



  return (
    <>
      {/* Noise Texture layer */}
      <Noise opacity={0.03} />

      {/* Loading Overlay */}
      {loading && (
        <div id="loading-overlay">
          <img src={newLogo} alt="Evoluir Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '10px', opacity: 0, transform: 'scale(0.95)', animation: 'loadLogoFade 1s ease forwards 0.2s' }} />
          <div className="loading-logo">Evoluir</div>
          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div id="page" style={{ opacity: loading ? 0 : 1, transition: 'opacity 1s ease' }}>
        
        {/* Fixed Iridescence Background */}
        <div
          ref={iridescenceRef}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0,
          }}
        >
          <Iridescence />
        </div>

        {/* Navigation */}
        <nav
          className="luxury-nav"
          style={hasRevealPlayed ? {} : { opacity: 0, transform: 'translateY(-10px)' }}
        >
          <a className="nav-logo" href="#" aria-label="Evoluir Home">
            <img
              src={newLogo}
              alt="Evoluir Butterfly Logo"
              className="nav-logo-img"
            />
          </a>

          <div className="nav-actions-cluster">
            <MagneticButton
              href="/products"
              className="nav-btn-browse"
              onClick={() => saveNavigationSource()}
            >
              Shop
            </MagneticButton>
            <CartNavButton />
            <AuthNavButton />
          </div>
        </nav>

        {/* Reveal Video Intro Section (New Hero Landing) */}
        <section id="reveal-intro">
          <div className="reveal-intro-container">
            <video
              src={revealVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                opacity: 0.45,
              }}
            />
            {/* Soft overlay gradient to blend with the nearly black site theme */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, #050505 0%, transparent 15%, transparent 85%, #050505 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            <div className="reveal-intro-content" style={{ zIndex: 3 }}>
              <div className="reveal-intro-label" style={hasRevealPlayed ? {} : { opacity: 0, transform: 'translateY(20px)' }}>
                <ShinyText text="introducing" speed={2.5} color="#88888b" shineColor="#ffffff" spread={90} />
              </div>
              <h2 className="reveal-intro-title" style={hasRevealPlayed ? {} : { opacity: 0, transform: 'translateY(20px)' }}>
                <ShinyText text="EVOAIR" speed={3} color="#99999c" shineColor="#ffffff" spread={120} />
              </h2>
              <div className="reveal-intro-subtitle" style={hasRevealPlayed ? {} : { opacity: 0, transform: 'translateY(20px)' }}>
                DEBUT OF THE STARCAST COLLECTION
              </div>
            </div>
            <div id="scroll-hint" style={{ opacity: 0 }}>
              <div className="scroll-hint-text">Discover</div>
              <div className="scroll-line" />
            </div>
          </div>
        </section>

        {/* Airflow Section — Editorial Luxury Layout */}
        <section id="airflow">
          <div className="container af-container-split" style={{ display: 'flex', flexDirection: 'row', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left: Image */}
            <div className="af-col-image" style={{ flex: '0 0 40%', maxWidth: '440px' }}>
              <img 
                src={girlDither} 
                alt="Evo Air Experience" 
                style={{ 
                  width: '100%', 
                  borderRadius: '16px', 
                  opacity: 0.85,
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
                  display: 'block'
                }} 
                className="scroll-reveal-el" 
              />
            </div>

            {/* Right: Editorial Typography */}
            <div className="af-col-text" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 4vh, 44px)', minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 className="af-headline-primary af-reveal" style={{ margin: 0 }}>
                  <span><TextReveal>Designed for</TextReveal></span>
                  <span className="af-tajawal"><TextReveal>Skin.</TextReveal></span>
                </h2>

                <h2 className="af-headline-secondary af-reveal" style={{ margin: 0 }}>
                  <span><TextReveal>Perfected by</TextReveal></span>
                  <span className="af-tajawal"><TextReveal>Air.</TextReveal></span>
                </h2>
              </div>

              <p className="af-body af-reveal" style={{ textAlign: 'left', margin: 0, maxWidth: '460px', lineHeight: 1.8 }}>
                Precision-controlled micro-mist delivers foundation at the exact pressure your skin requires.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section Removed */}

        {/* Craftsmanship Section */}
        <section id="craftsmanship">
          <div className="container">
            <div className="craft-grid">
              <div>
                <h2 className="craft-headline scroll-reveal-el">
                  <TextReveal>Every decision</TextReveal><br />
                  <TextReveal>earns its</TextReveal><br />
                  <TextReveal><em>place.</em></TextReveal>
                </h2>
              </div>
              <div className="craft-details" style={{ position: 'relative', height: '380px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-20px' }}>
                <CardSwap
                  cardDistance={35}
                  verticalDistance={45}
                  delay={4000}
                  pauseOnHover={true}
                  skewAmount={4}
                  width={420}
                  height={280}
                >
                  <Card customClass="craft-item-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px' }}>
                    <div className="craft-item-label">Air pressure system</div>
                    <div className="craft-item-text">Mist, perfected.</div>
                    <div className="craft-item-accent">→ Micron-level delivery</div>
                  </Card>
                  <Card customClass="craft-item-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px' }}>
                    <div className="craft-item-label">Power architecture</div>
                    <div className="craft-item-text">Power that disappears into the experience.</div>
                    <div className="craft-item-accent">→ 4hr continuous autonomy</div>
                  </Card>
                  <Card customClass="craft-item-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px' }}>
                    <div className="craft-item-label">Dual-flow system</div>
                    <div className="craft-item-text">Foundation and air, dialed.</div>
                    <div className="craft-item-accent">→ DualFlow™ precision controller</div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology">
          <div className="container">
            <div className="tech-header">
              <h2 className="tech-headline scroll-reveal-el">
                <TextReveal>Engineered to</TextReveal><br />
                <TextReveal><em>disappear.</em></TextReveal>
              </h2>
            </div>
            <Masonry columns={3} gap={24}>
              <div className="tech-stat">
                <div className="tech-stat-value">38<span className="tech-stat-unit">dB</span></div>
                <div className="tech-stat-label">Near-silent operation</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value">0.1<span className="tech-stat-unit">mm</span></div>
                <div className="tech-stat-label">Mist particle precision</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value">4<span className="tech-stat-unit">hr</span></div>
                <div className="tech-stat-label">Full charge autonomy</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value">Dual<span className="tech-stat-unit">Flow™</span></div>
                <div className="tech-stat-label">Air & formula precision controller</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value">3<span className="tech-stat-unit">sec</span></div>
                <div className="tech-stat-label">To flawless finish</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value">IP<span className="tech-stat-unit">54</span></div>
                <div className="tech-stat-label">Water & dust sealed</div>
              </div>
            </Masonry>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing">
          <div className="container scroll-reveal-el">
            <div className="pricing-headline">
              The experience luxury brands<br />were always meant to deliver.
            </div>
            <div className="pricing-sub-copy">
              Designed in India. Built for the world.<br />
              Delivered to your door.
            </div>

            <div className="pricing-visual-centered">
              <MagicRings 
                color="#fc42ff" 
                colorTwo="#42fcff" 
                ringCount={6}
                followMouse={true}
                hoverScale={1.2}
                clickBurst={true}
              >
                <ModelViewer src={`${import.meta.env.BASE_URL}HEER_AS-10-1000010.glb`} alt="Evo Air Device 3D Model" />
              </MagicRings>
            </div>

            <div className="pricing-bottom-actions">
              <div className="pricing-actions">
                <MagneticButton
                  href="/products"
                  className="btn-primary"
                  onClick={() => saveNavigationSource()}
                >
                  Browse Products
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* Full Size Black Hole Footer */}
        <footer
          className="black-hole-footer"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(520px, 72vh, 800px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            padding: 0,
            background: 'transparent',
            borderTop: 'none',
          }}
        >
          <div
            className="black-hole-stage"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
          >
            <BlackHole />
          </div>
          {/* Seamless gradient and blur fade transition from the 3D model section */}
          <div className="black-hole-top-fade" aria-hidden="true" />
          <div className="footer-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 50px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
            <div className="footer-copy">© 2026 Evoluir. All rights reserved.</div>
            <div className="footer-logo" style={{ color: '#ffffff' }}>Evoluir</div>
            <div className="footer-copy">Starcast Collection</div>
          </div>
        </footer>

      </div>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
