import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import MagneticButton from './MagneticButton';
import CartNavButton from './CartIcon';
import { AuthNavButton } from './AuthModal';
import BlackHole from './BlackHole';
import newLogo from '../assets/new-logo.png';
import pricingImage from '../assets/product-pricing.png';
import heroCapsules from '../assets/hero-capsules.png';
import { addToCart } from '../utils/cart';
import texture1 from '../assets/texture1.png';
import portrait1 from '../assets/portrait1.png';
import spray1 from '../assets/spray1.png';
import texture2 from '../assets/texture2.png';
import { defaultShadeByFormula, fillFormulas } from '../data/productOptions';

// Preserved for cart and accessory flows as requested
export const CompleteYourKit = () => (
  <section className="ck-accessories">
    <div className="ck-section-headline">Complete Your Kit</div>
    <div className="ck-acc-grid">
      <div className="ck-acc-card">
        <div className="ck-acc-number">01</div>
        <div className="ck-acc-name">Evo-Fills</div>
        <p className="ck-acc-desc">
          Pre-filled, zero-contamination foundation capsules designed for your Evo-Air. Just click and spray.
        </p>
        <div className="ck-acc-price">₹2,500</div>
        <MagneticButton className="btn-secondary" style={{ marginTop: '20px' }} href="#evofills">
          View
        </MagneticButton>
      </div>

      <div className="ck-acc-card">
        <div className="ck-acc-number">02</div>
        <div className="ck-acc-name">Evo-Bottles</div>
        <p className="ck-acc-desc">
          Want to use your own foundation? Buy our empty, refillable capsules. Pack of 20.
        </p>
        <div className="ck-acc-price">₹1,799</div>
        <MagneticButton className="btn-secondary" style={{ marginTop: '20px' }} href="#evobottles">
          View
        </MagneticButton>
      </div>
    </div>
  </section>
);

const Products = () => {
  const getActiveProductFromHash = () => {
    if (typeof window === 'undefined') return 'evoair';
    const hash = window.location.hash.toLowerCase();
    if (hash === '#evofills') return 'evofills';
    if (hash === '#evobottles') return 'evobottles';
    return 'evoair';
  };

  const [activeProduct, setActiveProduct] = useState(getActiveProductFromHash);
  const [selectedFormulaId, setSelectedFormulaId] = useState(fillFormulas[0].id);
  const selectedFormula = fillFormulas.find(formula => formula.id === selectedFormulaId);
  const [selectedShadeByFormula, setSelectedShadeByFormula] = useState(defaultShadeByFormula);
  const selectedShade = selectedShadeByFormula[selectedFormulaId];

  useEffect(() => {
    const handleHash = () => {
      const prod = getActiveProductFromHash();
      setActiveProduct(prod);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const switchProduct = (prod) => {
    setActiveProduct(prod);
    if (prod === 'evofills') {
      window.location.hash = '#evofills';
    } else if (prod === 'evobottles') {
      window.location.hash = '#evobottles';
    } else {
      window.location.hash = '#evoair';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Layout>
      <div className="ck-page">
      <nav className="ck-nav">
        <a href="/" className="nav-logo">
          <img src={newLogo} alt="Evoluir" style={{ height: '22px' }} />
          <span className="nav-wordmark">Evoluir</span>
        </a>
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CartNavButton />
          <AuthNavButton />
          <MagneticButton
            href="/"
            className="btn-secondary"
            style={{ padding: '8px 20px', fontSize: '9px' }}
          >
            Back
          </MagneticButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="ck-hero">
        <div className="ck-hero-left">
          {/* Product Switcher Tabs */}
          <div className="ck-product-switch-tabs">
            <button
              type="button"
              className={`ck-product-tab-btn ${activeProduct === 'evoair' ? 'is-active' : ''}`}
              onClick={() => switchProduct('evoair')}
            >
              Evo-Air Device
            </button>
            <button
              type="button"
              className={`ck-product-tab-btn ${activeProduct === 'evofills' ? 'is-active' : ''}`}
              onClick={() => switchProduct('evofills')}
            >
              Evo-Fills Refills
            </button>
            <button
              type="button"
              className={`ck-product-tab-btn ${activeProduct === 'evobottles' ? 'is-active' : ''}`}
              onClick={() => switchProduct('evobottles')}
            >
              Evo-Bottles Empty
            </button>
          </div>

          {activeProduct === 'evofills' ? (
            <>
              <div className="ck-title">Evo-Fills</div>
              <div className="ck-subtitle-line">Blush Beyond Beauty</div>
              <p className="ck-desc">
                Powered by precision beauty technology, this next-generation liquid blush delivers controlled, even color with every application. Its advanced lightweight formula blends effortlessly into the skin, creating a seamless, airbrushed flush that looks naturally diffused.
              </p>
              <div className="ck-price-block">
                <span className="ck-price">{selectedFormula.price}</span>
                <span className="ck-price-note">{selectedFormula.note} · Free shipping</span>
              </div>
              <div className="ck-option-panel ck-fill-selector">
                <div className="ck-option-kicker">Choose Formula</div>
                <div className="ck-segment-row">
                  {fillFormulas.map(formula => (
                    <button
                      key={formula.id}
                      type="button"
                      className={`ck-segment-choice${selectedFormulaId === formula.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedFormulaId(formula.id)}
                      aria-pressed={selectedFormulaId === formula.id}
                    >
                      {formula.name}
                    </button>
                  ))}
                </div>
                <div className="ck-option-kicker">Choose Shade</div>
                <div className="ck-shade-grid">
                  {selectedFormula.shades.map(shade => (
                    <button
                      key={shade.code}
                      type="button"
                      className={`ck-shade-choice${selectedShade.code === shade.code ? ' is-selected' : ''}`}
                      onClick={() => setSelectedShadeByFormula(prev => ({ ...prev, [selectedFormulaId]: shade }))}
                      aria-pressed={selectedShade.code === shade.code}
                    >
                      <span className="ck-shade-swatch" style={{ '--swatch': shade.color }} />
                      <span className="ck-shade-copy">
                        <span className="ck-shade-code">{shade.code}</span>
                        <span className="ck-shade-name">{shade.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="ck-selection-summary">
                  Selected: {selectedFormula.name} · {selectedShade.code} {selectedShade.name}
                </div>
              </div>
              <div className="ck-hero-actions">
                <MagneticButton
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    const numPrice = parseInt(selectedFormula.price.replace(/[^\d]/g, ''), 10) || 2500;
                    addToCart({
                      id: `evofills-${selectedFormula.id}-${selectedShade.code}`,
                      name: `Evo-Fills Refill (${selectedFormula.name})`,
                      subtitle: `Shade: ${selectedShade.code} ${selectedShade.name} · 10 Pre-filled Capsules`,
                      formulaId: selectedFormula.id,
                      formulaName: selectedFormula.name,
                      shadeCode: selectedShade.code,
                      shadeName: selectedShade.name,
                      shadeSwatch: selectedShade.color,
                      price: selectedFormula.price,
                      numericPrice: numPrice,
                      image: heroCapsules,
                    });
                    window.location.href = '/cart';
                  }}
                >
                  Add to Cart
                </MagneticButton>
                <MagneticButton
                  className="btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    switchProduct('evoair');
                  }}
                >
                  View Device (Evo-Air)
                </MagneticButton>
              </div>
            </>
          ) : activeProduct === 'evobottles' ? (
            <>
              <div className="ck-title">Evo-Bottles</div>
              <div className="ck-subtitle-line">Your Signature Blend. Perfected.</div>
              <p className="ck-desc">
                Professional-grade, empty, and reusable refill capsules for your Evo-Air device. Mix your own foundations, serums, or sunscreens and transform them into a micro-fine airbrush mist for a flawless finish.
              </p>
              <div className="ck-price-block">
                <span className="ck-price">₹1,799</span>
                <span className="ck-price-note">Pack of 20 · Free shipping</span>
              </div>
              <div className="ck-option-panel ck-fill-selector">
                <div className="ck-selection-summary" style={{ marginTop: 0 }}>
                  Pack of 20 empty capsules · Compatible with all liquid foundations & formulas
                </div>
              </div>
              <div className="ck-hero-actions">
                <MagneticButton
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({
                      id: 'evo-bottles-empty-pack',
                      name: 'Evo-Bottles Refill Capsules',
                      subtitle: 'Pack of 20 empty refillable capsules',
                      price: '₹1,799',
                      numericPrice: 1799,
                      image: heroCapsules,
                    });
                    window.location.href = '/cart';
                  }}
                >
                  Add to Cart
                </MagneticButton>
                <MagneticButton
                  className="btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    switchProduct('evoair');
                  }}
                >
                  View Device (Evo-Air)
                </MagneticButton>
              </div>
            </>
          ) : (
            <>
              <div className="ck-title">Evo-Air</div>
              <div className="ck-subtitle-line">The Future of Flawless Skin.</div>
              <p className="ck-desc">
                Our flagship cordless airbrush device. Using patented micro-mist technology, Evo-Air atomizes makeup into a weightless, flawless finish that looks like natural skin. No brushes, no sponges, no contamination.
              </p>
              <div className="ck-price-block">
                <span className="ck-price">₹14,999</span>
                <span className="ck-price-note">Includes Device, Charging Cable & Case · Free shipping</span>
              </div>
              <div className="ck-option-panel ck-fill-selector">
                <div className="ck-option-kicker">Choose Starter Fill</div>
                <div className="ck-segment-row">
                  {fillFormulas.map(formula => (
                    <button
                      key={formula.id}
                      type="button"
                      className={`ck-segment-choice${selectedFormulaId === formula.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedFormulaId(formula.id)}
                      aria-pressed={selectedFormulaId === formula.id}
                    >
                      {formula.name}
                    </button>
                  ))}
                </div>
                <div className="ck-option-kicker">Choose Shade</div>
                <div className="ck-shade-grid">
                  {selectedFormula.shades.map(shade => (
                    <button
                      key={shade.code}
                      type="button"
                      className={`ck-shade-choice${selectedShade.code === shade.code ? ' is-selected' : ''}`}
                      onClick={() => setSelectedShadeByFormula(prev => ({ ...prev, [selectedFormulaId]: shade }))}
                      aria-pressed={selectedShade.code === shade.code}
                    >
                      <span className="ck-shade-swatch" style={{ '--swatch': shade.color }} />
                      <span className="ck-shade-copy">
                        <span className="ck-shade-code">{shade.code}</span>
                        <span className="ck-shade-name">{shade.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="ck-selection-summary">
                  Starter fill: {selectedFormula.name} · {selectedShade.code} {selectedShade.name}
                </div>
              </div>
              <div className="ck-hero-actions">
                <MagneticButton
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({
                      id: 'evo-air-device',
                      name: 'Evo-Air Cordless Device',
                      subtitle: `Starter Fill: ${selectedFormula.name} · ${selectedShade.code} ${selectedShade.name}`,
                      formulaId: selectedFormula.id,
                      formulaName: selectedFormula.name,
                      shadeCode: selectedShade.code,
                      shadeName: selectedShade.name,
                      shadeSwatch: selectedShade.color,
                      price: '₹14,999',
                      numericPrice: 14999,
                      image: pricingImage,
                    });
                    window.location.href = '/cart';
                  }}
                >
                  Add to Cart
                </MagneticButton>
                <MagneticButton
                  className="btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    switchProduct('evofills');
                  }}
                >
                  Browse Evo-Fills
                </MagneticButton>
              </div>
            </>
          )}
        </div>
        <div className="ck-hero-right">
          <img
            src={activeProduct === 'evoair' ? pricingImage : heroCapsules}
            alt={activeProduct === 'evoair' ? 'Evo-Air Product' : 'Evo-Fills Capsules'}
            className="ck-product-img"
          />
        </div>
      </section>

      {/* 4-Step Bento Grid & Smart Beauty Advantage */}
      <section className="ck-includes">
        <div className="ck-includes-header ck-process-intro">
          <div className="ck-section-headline">Seamless Application. Flawless Finish.</div>
        </div>

        <div className="bento-grid">
          <div className="bento-box bento-tall">
            <div className="bento-content">
              <div className="ck-include-number">01</div>
              <div className="ck-include-name">Charge & Click</div>
              <p className="bento-p">Ensure your device is charged via USB-C. Snap in an Evo-Fill blush capsule or your custom-filled Evo-Bottle.</p>
            </div>
            <img src={portrait1} alt="Application" className="bento-img bento-img-tall" />
          </div>

          <div className="bento-box bento-wide" style={{ backgroundImage: `url(${texture1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">02</div>
              <div className="ck-include-name">Select Speed</div>
              <p className="bento-p">Choose from 3 airflow speeds (Light, Medium, Full Coverage) to tailor your application intensity.</p>
            </div>
          </div>

          <div className="bento-box bento-square" style={{ backgroundImage: `url(${spray1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">03</div>
              <div className="ck-include-name">Airbrush</div>
              <p className="bento-p">Hold 4-6 inches away and sweep in slow circles for a flawless, studio-grade finish in seconds.</p>
            </div>
          </div>

          <div className="bento-box bento-square" style={{ backgroundImage: `url(${texture2})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">04</div>
              <div className="ck-include-name">Clean</div>
              <p className="bento-p">Pop out the capsule and wipe the nozzle. Your device is immediately ready for your next application.</p>
            </div>
          </div>
        </div>

        {/* The Smart Beauty Advantage */}
        <div className="ck-includes-header ck-detail-intro">
          <div className="ck-section-headline">The Smart Beauty<br />Advantage</div>
          <p className="ck-section-desc">
            Elevate your everyday makeup routine with professional-grade technology. The Evo-Air device gives you absolute control over your coverage, delivering a radiant, even complexion in seconds.
          </p>
        </div>

        <div className="ck-advantage-list">
          <div className="ck-advantage-item">3-Speed customizable airflow control</div>
          <div className="ck-advantage-item">Whisper-quiet motor technology</div>
          <div className="ck-advantage-item">USB-C Fast Charging</div>
          <div className="ck-advantage-item">Ergonomic, lightweight design</div>
          <div className="ck-advantage-item">Zero-touch hygienic application</div>
          <div className="ck-advantage-item">Dermatologist recommended technique</div>
        </div>
      </section>

      {/* Full Size Black Hole Footer */}
      <footer className="black-hole-footer" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: 0, background: 'transparent', borderTop: 'none' }}>
        <div className="black-hole-stage" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <BlackHole />
        </div>
        <div className="footer-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '40px 50px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'left', alignSelf: 'center' }}>© 2026 Evoluir.<br/>All rights reserved.</div>
          <div className="footer-logo" style={{ color: '#ffffff', flex: 1, textAlign: 'center', lineHeight: 1 }}>Evoluir</div>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'right', alignSelf: 'center' }}>Evo-Air™<br/>Products</div>
        </div>
      </footer>
      </div>
    </Layout>
  );
};

export default Products;
