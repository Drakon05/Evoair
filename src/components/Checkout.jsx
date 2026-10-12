import React, { useEffect, useState } from 'react';
import MagneticButton from './MagneticButton';
import BlackHole from './BlackHole';
import newLogo from '../assets/new-logo.png';
import pricingImage from '../assets/product-pricing.png';
import texture1 from '../assets/texture1.png';
import portrait1 from '../assets/portrait1.png';
import spray1 from '../assets/spray1.png';
import texture2 from '../assets/texture2.png';
import { defaultShadeByFormula, fillFormulas } from '../data/productOptions';

const Checkout = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(fillFormulas[0].id);
  const selectedFormula = fillFormulas.find(formula => formula.id === selectedFormulaId);
  const [selectedShadeByFormula, setSelectedShadeByFormula] = useState(defaultShadeByFormula);
  const selectedShade = selectedShadeByFormula[selectedFormulaId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="ck-page">
      <nav className="ck-nav">
        <a href="#home" className="nav-logo">
          <img src={newLogo} alt="Evoluir" style={{ height: '22px' }} />
          <span className="nav-wordmark">Evoluir</span>
        </a>
        <div className="nav-right">
          <MagneticButton className="btn-secondary" style={{ padding: '8px 20px', fontSize: '9px' }}
            onClick={() => window.location.hash = '#home'}>
            Back
          </MagneticButton>
        </div>
      </nav>

      <section className="ck-hero">
        <div className="ck-hero-left">
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
            <MagneticButton className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                alert(`Redirecting to secure payment gateway for Evo-Air with ${selectedFormula.name} ${selectedShade.code} ${selectedShade.name}.`);
              }}>
              Complete Purchase
            </MagneticButton>
            <MagneticButton className="btn-secondary" href="#evofills">
              Browse Evo-Fills
            </MagneticButton>
          </div>
        </div>
        <div className="ck-hero-right">
          <img src={pricingImage} alt="Evo-Air Product" className="ck-product-img" />
        </div>
      </section>

      <section className="ck-includes">
        <div className="ck-includes-header ck-detail-intro">
          <div className="ck-section-headline">The Smart Beauty Advantage</div>
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

        <div className="ck-includes-header ck-feature-intro">
          <div className="ck-section-headline ck-feature-headline">Designed for Perfection</div>
          <p className="ck-section-desc">
            Engineered from premium materials to deliver a consistent, ultra-fine mist that sits flawlessly on top of your skin rather than settling into pores or fine lines.
          </p>
        </div>

        <div className="ck-feature-tags">
          {['Cordless', 'USB-C', '3-Speeds', 'Ultra-Light', 'Travel-Ready', 'Easy-Clean', 'Zero-Touch', 'Pro-Grade', 'Precision Nozzle', 'Long Battery Life'].map(tag => (
            <div key={tag} className="ck-tag">{tag}</div>
          ))}
        </div>
        
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

        {/* ── Accordions ── */}
        <div className="ck-accordion-container">
          <div className="ck-accordion-item">
            <button 
              className="ck-accordion-header" 
              onClick={() => toggleAccordion(0)}
              aria-expanded={openAccordion === 0}
            >
              <span>What's in the Box</span>
              <span className="ck-accordion-icon">+</span>
            </button>
            <div className="ck-accordion-content" aria-hidden={openAccordion !== 0}>
              Your Evo-Air purchase includes:<br/>
              • 1x Evo-Air Cordless Airbrush Device<br/>
              • 1x Braided USB-C Fast Charging Cable<br/>
              • 1x Premium Protective Travel Case<br/>
              • 1x Comprehensive User Manual & Quick Start Guide<br/><br/>
              <em>Note: Evo-Fills and Evo-Bottles are sold separately. Check out the accessories below.</em>
            </div>
          </div>
          
          <div className="ck-accordion-item">
            <button 
              className="ck-accordion-header" 
              onClick={() => toggleAccordion(1)}
              aria-expanded={openAccordion === 1}
            >
              <span>Specifications</span>
              <span className="ck-accordion-icon">+</span>
            </button>
            <div className="ck-accordion-content" aria-hidden={openAccordion !== 1}>
              <strong>Battery Life:</strong> Up to 45 minutes of continuous use<br/>
              <strong>Charging Time:</strong> 90 minutes to full charge<br/>
              <strong>Weight:</strong> Ultra-light 250g design<br/>
              <strong>Speed Settings:</strong> 3 adjustable airflow levels<br/>
              <strong>Warranty:</strong> 1-Year Limited Hardware Warranty<br/><br/>
              Innovation backed by a <strong>20-Day Return Guarantee</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accessories ── */}
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

      {/* ── BlackHole Footer ── */}
      <footer className="black-hole-footer" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: 0, background: 'transparent', borderTop: 'none' }}>
        <div className="black-hole-stage" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <BlackHole />
        </div>
        <div className="footer-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '40px 50px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'left', alignSelf: 'center' }}>© 2026 Evoluir.<br/>All rights reserved.</div>
          <div className="footer-logo" style={{ color: '#ffffff', flex: 1, textAlign: 'center', lineHeight: 1 }}>Evoluir</div>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'right', alignSelf: 'center' }}>Secure Checkout<br/>SSL Encrypted</div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
