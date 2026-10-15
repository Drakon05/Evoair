import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import MagneticButton from './MagneticButton';
import BlackHole from './BlackHole';
import newLogo from '../assets/new-logo.png';
import pricingImage from '../assets/product-pricing.png';
import heroCapsules from '../assets/hero-capsules.png';
import { useCart } from '../utils/cart';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

const Cart = () => {
  const { items, totalCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'EVO10') {
      setDiscount(0.10);
      setPromoMessage('10% VIP discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'STARCAST') {
      setDiscount(0.15);
      setPromoMessage('15% Starcast exclusive discount applied!');
    } else {
      setPromoMessage('Invalid or expired promo code.');
    }
  };

  const discountAmount = Math.round(subtotal * discount);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
    }, 1200);
  };

  return (
    <Layout>
      <div className="cart-page">
        {/* Navigation */}
        <nav className="ck-nav">
          <a href="/" className="nav-logo">
            <img src={newLogo} alt="Evoluir" style={{ height: '22px' }} />
            <span className="nav-wordmark">Evoluir</span>
          </a>
          <div className="nav-right">
            <MagneticButton
              href="/products"
              className="btn-secondary"
              style={{ padding: '8px 20px', fontSize: '9px' }}
            >
              Continue Shopping
            </MagneticButton>
          </div>
        </nav>

        {/* Main Cart Body */}
        <main className="cart-main-container">
          <div className="cart-header-wrap">
            <div className="cart-label">STARCAST COLLECTION</div>
            <h1 className="cart-title">Your Cart</h1>
            <p className="cart-item-count-sub">
              {totalCount === 0
                ? 'Your bag is currently empty'
                : `${totalCount} item${totalCount === 1 ? '' : 's'} ready for checkout`}
            </p>
          </div>

          {checkoutComplete ? (
            <div className="cart-empty-state cart-success-state">
              <div className="cart-empty-icon" style={{ borderColor: 'rgba(66, 252, 255, 0.4)', color: '#42fcff' }}>✓</div>
              <h2 className="cart-empty-heading">Order Reserved Successfully</h2>
              <p className="cart-empty-sub">
                Thank you for acquiring Evoluir. A confirmation has been generated and your priority batch is being prepared for dispatch.
              </p>
              <MagneticButton href="/products" className="btn-primary" style={{ marginTop: '28px' }}>
                Explore Products
              </MagneticButton>
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h2 className="cart-empty-heading">Your Bag is Empty</h2>
              <p className="cart-empty-sub">
                Experience next-generation cordless micro-mist skincare and airbrush luxury.
              </p>
              <MagneticButton href="/products" className="btn-primary" style={{ marginTop: '28px' }}>
                Browse Products
              </MagneticButton>
            </div>
          ) : (
            <div className="cart-content-grid">
              {/* Left Column: Items */}
              <div className="cart-items-column">
                <div className="cart-items-list">
                  {items.map((item) => {
                    const uniqueKey = `${item.id}-${item.shadeCode || 'default'}`;
                    return (
                      <div key={uniqueKey} className="cart-item-card">
                        <div className="cart-item-thumb">
                          <img
                            src={item.image || pricingImage}
                            alt={item.name}
                            className="cart-item-img"
                          />
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-title-row">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <button
                              type="button"
                              className="cart-remove-btn"
                              onClick={() => removeFromCart(uniqueKey)}
                              aria-label="Remove item"
                            >
                              ✕
                            </button>
                          </div>

                          {item.formulaName && (
                            <div className="cart-item-spec">
                              {item.shadeSwatch && (
                                <span
                                  className="cart-spec-swatch"
                                  style={{ backgroundColor: item.shadeSwatch }}
                                />
                              )}
                              <span>
                                {item.formulaName} · {item.shadeCode} {item.shadeName}
                              </span>
                            </div>
                          )}

                          {item.subtitle && !item.formulaName && (
                            <div className="cart-item-spec">{item.subtitle}</div>
                          )}

                          <div className="cart-item-bottom-row">
                            <div className="cart-qty-control">
                              <button
                                type="button"
                                className="cart-qty-btn"
                                onClick={() => updateQuantity(uniqueKey, -1)}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="cart-qty-num">{item.quantity}</span>
                              <button
                                type="button"
                                className="cart-qty-btn"
                                onClick={() => updateQuantity(uniqueKey, 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <div className="cart-item-price">
                              {formatCurrency(item.numericPrice * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Complete Your Kit - Cross Sell Section */}
                <div className="cart-kit-section">
                  <div className="cart-kit-kicker">RECOMMENDED ADD-ONS</div>
                  <h2 className="cart-kit-heading">Complete Your Kit</h2>
                  <div className="cart-kit-grid">
                    <div className="cart-kit-card">
                      <div className="cart-kit-card-head">
                        <span className="cart-kit-number">01</span>
                        <span className="cart-kit-name">Evo-Fills Refills</span>
                      </div>
                      <p className="cart-kit-desc">
                        10 Pre-filled sterile formula capsules for zero mess and ultra-pure atomization.
                      </p>
                      <div className="cart-kit-foot">
                        <span className="cart-kit-price">₹2,500</span>
                        <MagneticButton
                          className="btn-secondary cart-kit-add-btn"
                          onClick={() => {
                            addToCart({
                              id: 'evofills-refill',
                              name: 'Evo-Fills Refill Capsules',
                              subtitle: '10 Pre-filled Sterile Capsules · 15ml',
                              price: '₹2,500',
                              numericPrice: 2500,
                              image: heroCapsules,
                            });
                          }}
                        >
                          + Add to Cart
                        </MagneticButton>
                      </div>
                    </div>

                    <div className="cart-kit-card">
                      <div className="cart-kit-card-head">
                        <span className="cart-kit-number">02</span>
                        <span className="cart-kit-name">Evo-Bottles Empty</span>
                      </div>
                      <p className="cart-kit-desc">
                        Pack of 20 empty refillable capsules. Compatible with your own foundation formulas.
                      </p>
                      <div className="cart-kit-foot">
                        <span className="cart-kit-price">₹1,799</span>
                        <MagneticButton
                          className="btn-secondary cart-kit-add-btn"
                          onClick={() => {
                            addToCart({
                              id: 'evobottles-empty',
                              name: 'Evo-Bottles Refill Pack',
                              subtitle: 'Pack of 20 Empty Capsules · Zero-Spill',
                              price: '₹1,799',
                              numericPrice: 1799,
                              image: heroCapsules,
                            });
                          }}
                        >
                          + Add to Cart
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="cart-summary-column">
                <div className="cart-summary-card">
                  <h2 className="cart-summary-title">Order Summary</h2>

                  <div className="cart-summary-rows">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="cart-summary-row" style={{ color: 'var(--accent, #f24c27)' }}>
                        <span>VIP Discount ({(discount * 100).toFixed(0)}%)</span>
                        <span>−{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="cart-summary-row">
                      <span>Shipping</span>
                      <span className="cart-free-badge">Complimentary</span>
                    </div>

                    <div className="cart-summary-row">
                      <span>Customs & Taxes</span>
                      <span>Included</span>
                    </div>

                    <div className="cart-summary-divider" />

                    <div className="cart-summary-row cart-total-row">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="cart-promo-form">
                    <input
                      type="text"
                      className="cart-promo-input"
                      placeholder="Promo code (try EVO10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="cart-promo-btn">
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <div className={`cart-promo-msg ${discount > 0 ? 'is-success' : 'is-error'}`}>
                      {promoMessage}
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <MagneticButton
                    className="btn-primary cart-checkout-btn"
                    onClick={handleCheckout}
                    style={{ width: '100%', marginTop: '24px', padding: '16px' }}
                  >
                    {isCheckingOut ? 'Securing Transaction...' : 'Proceed to Checkout'}
                  </MagneticButton>

                  <div className="cart-guarantee-list">
                    <div className="cart-guarantee-item">
                      <span className="cart-guarantee-dot" />
                      <span>Encrypted 256-Bit SSL Checkout</span>
                    </div>
                    <div className="cart-guarantee-item">
                      <span className="cart-guarantee-dot" />
                      <span>20-Day Return & Flawless Guarantee</span>
                    </div>
                    <div className="cart-guarantee-item">
                      <span className="cart-guarantee-dot" />
                      <span>1-Year Evoluir Hardware Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Full Size Black Hole Footer */}
        <footer
          className="black-hole-footer"
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
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
          <div
            className="footer-content"
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '40px 50px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              pointerEvents: 'none',
            }}
          >
            <div className="footer-copy" style={{ flex: 1, textAlign: 'left', alignSelf: 'center' }}>
              © 2026 Evoluir.<br />All rights reserved.
            </div>
            <div className="footer-logo" style={{ color: '#ffffff', flex: 1, textAlign: 'center', lineHeight: 1 }}>
              Evoluir
            </div>
            <div className="footer-copy" style={{ flex: 1, textAlign: 'right', alignSelf: 'center' }}>
              Evo-Air™<br />Cart
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Cart;
