import React from 'react';
import { useCart } from '../utils/cart';
import { saveNavigationSource } from '../utils/navigation';

export const CartNavButton = ({ className = '', style = {} }) => {
  const { totalCount } = useCart();

  const handleClick = (e) => {
    saveNavigationSource();

    // If already on cart, do nothing
    if (window.location.pathname === '/cart' || window.location.pathname.endsWith('/cart.html') || window.location.hash === '#cart') {
      e.preventDefault();
      return;
    }
    // If on landing page (App.jsx), set hash for immediate 0ms transition
    if (window.location.pathname === '/' || window.location.pathname === '/index.html' || !window.location.pathname.includes('/products')) {
      e.preventDefault();
      window.location.hash = '#cart';
    }
  };

  return (
    <a
      href="/cart"
      onClick={handleClick}
      className={`cart-nav-link ${className}`}
      aria-label={`Shopping cart with ${totalCount} items`}
      style={style}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cart-nav-icon"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {totalCount > 0 && (
        <span className="cart-badge-count">
          {totalCount}
        </span>
      )}
    </a>
  );
};

export default CartNavButton;
