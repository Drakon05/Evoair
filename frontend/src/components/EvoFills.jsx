import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import MagneticButton from './MagneticButton';
import BlackHole from './BlackHole';
import newLogo from '../assets/new-logo.png';
import heroCapsules from '../assets/hero-capsules.png';
import texture1 from '../assets/texture1.png';
import portrait1 from '../assets/portrait1.png';
import spray1 from '../assets/spray1.png';
import texture2 from '../assets/texture2.png';
import { defaultShadeByFormula, fillFormulas } from '../data/productOptions';

const EvoFills = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(fillFormulas[1].id);
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
    <Layout>
      <div className="ck-page">
      <nav className="ck-nav">
        <a href="#home" className="nav-logo" aria-label="Evoluir Home">
          <img src={newLogo} alt="Evoluir Butterfly Logo" className="nav-logo-img" />
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
            <MagneticButton className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                alert(`Redirecting to secure payment gateway for ${selectedFormula.name} ${selectedShade.code} ${selectedShade.name}.`);
              }}>
              Buy Now
            </MagneticButton>
            <MagneticButton className="btn-secondary" href="#checkout">
              Get The Device
            </MagneticButton>
          </div>
        </div>
        <div className="ck-hero-right">
          <img src={heroCapsules} alt="Evo-Fills Capsules" className="ck-product-img" />
        </div>
      </section>

      {/* ── Details Section ── */}
      <section className="ck-includes">
        <div className="ck-includes-header ck-detail-intro">
          <div className="ck-section-headline">The Smart Beauty Advantage</div>
          <p className="ck-section-desc">
            Buildable, long-wearing, and designed for flawless precision, it transforms everyday blush application into a smarter beauty experience.
          </p>
        </div>

        <div className="ck-advantage-list">
          <div className="ck-advantage-item">Precision-controlled color delivery</div>
          <div className="ck-advantage-item">Airbrush-inspired application</div>
          <div className="ck-advantage-item">Even, streak-free blending</div>
          <div className="ck-advantage-item">Buildable intensity with effortless control</div>
          <div className="ck-advantage-item">Long-lasting fresh flush</div>
          <div className="ck-advantage-item">Lightweight, skin-comfort formula</div>
          <div className="ck-advantage-item">Available in 15 ml</div>
        </div>

        <div className="ck-includes-header ck-feature-intro">
          <div className="ck-section-headline ck-feature-headline">Designed for Every Skin Tone</div>
          <p className="ck-section-desc">
            Expertly curated blush shades created to complement a wide range of complexions, delivering a naturally flattering flush for every look.
          </p>
        </div>

        <div className="ck-feature-tags">
          {['Lightweight', 'Buildable', 'Blendable', 'Oil-Free', 'Paraben-Free', 'Sulfate-Free', 'Fragrance-Free', 'Alcohol-Free', 'Non-Comedogenic', 'Cruelty-Free', 'Vegan', 'Dermatologically Tested', 'Suitable for All Skin Types'].map(tag => (
            <div key={tag} className="ck-tag">{tag}</div>
          ))}
        </div>
        
        <div className="ck-includes-header ck-process-intro">
          <div className="ck-section-headline">Seamless Color. Flawless Finish.</div>
        </div>

        <div className="bento-grid">
          {/* Box 1: Left tall */}
          <div className="bento-box bento-tall">
            <div className="bento-content">
              <div className="ck-include-number">01</div>
              <div className="ck-include-name">Insert & Power</div>
              <p className="bento-p">Insert the pre-filled blush Evofill. Switch on your airbrush device.</p>
            </div>
            <img src={portrait1} alt="Application" className="bento-img bento-img-tall" />
          </div>

          {/* Box 2: Top Right wide */}
          <div className="bento-box bento-wide" style={{ backgroundImage: `url(${texture1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">02</div>
              <div className="ck-include-name">Spray & Blend</div>
              <p className="bento-p">Hold 4–6 inches away and spray using slow, continuous motions onto the apples of the cheeks, blending outward toward the temples.</p>
            </div>
          </div>

          {/* Box 3: Bottom middle square */}
          <div className="bento-box bento-square" style={{ backgroundImage: `url(${spray1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">03</div>
              <div className="ck-include-name">Layer</div>
              <p className="bento-p">Layer as desired to achieve your preferred intensity and flush.</p>
            </div>
          </div>

          {/* Box 4: Bottom right square - Color Guide */}
          <div className="bento-box bento-square" style={{ backgroundImage: `url(${texture2})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
            <div className="bento-content" style={{ position: 'relative', zIndex: 2 }}>
              <div className="ck-include-number">Guide</div>
              <div className="ck-include-name">Intensity</div>
              <p className="bento-p" style={{ margin: '4px 0' }}><strong>Soft Flush:</strong> 1–2 passes</p>
              <p className="bento-p" style={{ margin: '4px 0' }}><strong>Natural Bloom:</strong> 2–3 passes</p>
              <p className="bento-p" style={{ margin: '4px 0' }}><strong>Seamless Color:</strong> 3–4 passes</p>
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
              <span>Ingredients</span>
              <span className="ck-accordion-icon">+</span>
            </button>
            <div className="ck-accordion-content" aria-hidden={openAccordion !== 0}>
              Cyclopentasiloxane, Water (Aqua), Alcohol Denat., Dimethicone, Trimethylsiloxysilicate, Lactobacillus Ferment, PEG/PPG-18/18 Dimethicone, Ethyl Trisiloxane, Butylene Glycol, Lactobacillus, Silica, Sorbitan Sesquioleate, Polyethylene, Disteardimonium Hectorite, Propylene Carbonate, Cocos Nucifera (Coconut) Fruit Extract, Triethoxycaprylylsilane, Tocopheryl Acetate.<br/><br/>
              <strong>May Contain (+/-):</strong> Titanium Dioxide (CI 77891), Iron Oxides (CI 77491, CI 77492, CI 77499), Red 7 Lake (CI 15850), Red 6 Lake (CI 15850), Red 28 Lake (CI 45410), Yellow 5 Lake (CI 19140), Manganese Violet (CI 77742).
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
              <strong>Country of Origin:</strong> India<br/>
              <strong>MFG By:</strong> Alpsrey Innovations Pvt. Ltd.<br/>
              <strong>Address:</strong> 809, 810, 811, Pehel Lakeview, Vaishnodevi Circle, Ahmedabad<br/>
              <strong>Shelf Life:</strong> 36 Months<br/><br/>
              ➡️ Innovation backed by a <strong>20-Day Return Guarantee</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── BlackHole Footer ── */}
      <footer className="black-hole-footer" style={{ position: 'relative', width: '100%', height: 'clamp(520px, 70vh, 760px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: 0, background: 'transparent', borderTop: 'none' }}>
        <div className="black-hole-stage" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <BlackHole />
        </div>
        <div className="footer-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '40px 50px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'left', alignSelf: 'center' }}>© 2026 Evoluir.<br/>All rights reserved.</div>
          <div className="footer-logo" style={{ color: '#ffffff', flex: 1, textAlign: 'center', lineHeight: 1 }}>Evoluir</div>
          <div className="footer-copy" style={{ flex: 1, textAlign: 'right', alignSelf: 'center' }}>Evo-Fills<br/>Liquid Blush</div>
        </div>
      </footer>
      </div>
    </Layout>
  );
};

export default EvoFills;
