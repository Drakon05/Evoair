/**
 * Navigation & Section History Manager
 * Tracks the user's active page, section, and scroll position across the site
 * so that any Back button restores the exact previous section instead of resetting to hero.
 */

// Section IDs on the main landing page, in document order
const HOME_SECTIONS = ['reveal-intro', 'airflow', 'craftsmanship', 'technology', 'pricing'];

/**
 * Returns the base URL of the deployed application.
 */
export const getAppBase = () => {
  return (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
};

/**
 * Normalizes an internal app path with the current BASE_URL.
 */
export const getAppUrl = (target = '') => {
  const base = getAppBase();
  if (!target || target === '/') {
    return base ? `${base}/` : '/';
  }
  if (target.startsWith('#') || target.startsWith('?')) {
    return `${base ? `${base}/` : '/'}${target}`;
  }
  const cleanTarget = target.replace(/^\/+/, '');
  return base ? `${base}/${cleanTarget}` : `/${cleanTarget}`;
};

/**
 * Detects which section is currently active / visible in the viewport.
 */
export const getActiveSectionId = () => {
  if (typeof window === 'undefined') return 'reveal-intro';

  // If on products page, track active product tab from hash
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase();
  if (
    path.endsWith('/products') ||
    path.endsWith('/products.html') ||
    hash.startsWith('#products') ||
    hash.startsWith('#evofills') ||
    hash.startsWith('#evobottles') ||
    hash.startsWith('#evoair')
  ) {
    if (hash === '#evofills' || hash === '#evobottles' || hash === '#evoair') {
      return hash.replace('#', '');
    }
    return 'products';
  }

  // If on home landing page, determine active section by viewport intersection
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const viewportCenter = scrollY + viewportHeight * 0.45;

  for (let i = HOME_SECTIONS.length - 1; i >= 0; i--) {
    const id = HOME_SECTIONS[i];
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (viewportCenter >= top && viewportCenter <= top + height) {
        return id;
      }
    }
  }

  // Fallback check using getBoundingClientRect
  for (let i = HOME_SECTIONS.length - 1; i >= 0; i--) {
    const id = HOME_SECTIONS[i];
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportHeight * 0.55 && rect.bottom >= viewportHeight * 0.2) {
        return id;
      }
    }
  }

  return 'reveal-intro';
};

/**
 * Saves current navigation state to sessionStorage.
 * Called automatically before navigating away from any section.
 */
export const saveNavigationSource = () => {
  if (typeof window === 'undefined') return;
  try {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const hash = window.location.hash.toLowerCase();
    const isProducts =
      path.endsWith('/products') ||
      path.endsWith('/products.html') ||
      hash.startsWith('#products') ||
      hash.startsWith('#evofills') ||
      hash.startsWith('#evobottles') ||
      hash.startsWith('#evoair');
    const isCart = path.endsWith('/cart') || path.endsWith('/cart.html') || hash === '#cart';
    const isCheckout = hash === '#checkout';

    const sectionId = getActiveSectionId();
    const sourceData = {
      pathname: window.location.pathname,
      hash: window.location.hash,
      sectionId: sectionId,
      scrollY: window.scrollY,
      timestamp: Date.now(),
    };

    // If on home page, save dedicated evo_home_source
    if (!isProducts && !isCart && !isCheckout) {
      sessionStorage.setItem('evo_home_source', JSON.stringify(sourceData));
    }

    // Always keep latest general source if leaving a major route
    sessionStorage.setItem('evo_nav_source', JSON.stringify(sourceData));
  } catch (err) {
    // Ignore storage quota or security errors
  }
};

/**
 * Scrolls smoothly to a target section or pixel offset, integrating with Lenis if active.
 */
export const scrollToTargetSection = (sectionId, fallbackScrollY, behavior = 'smooth') => {
  if (typeof window === 'undefined') return;

  if (sectionId && sectionId !== 'hero' && sectionId !== 'reveal-intro') {
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetEl, { offset: -40, duration: 1.2 });
        return;
      }
      targetEl.scrollIntoView({ behavior, block: 'start' });
      return;
    }
  }

  if (sectionId === 'reveal-intro' || sectionId === 'hero') {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 0.8 });
      return;
    }
    window.scrollTo({ top: 0, behavior });
    return;
  }

  if (fallbackScrollY !== undefined && fallbackScrollY !== null && fallbackScrollY > 50) {
    if (window.__lenis) {
      window.__lenis.scrollTo(fallbackScrollY, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: fallbackScrollY, behavior });
  }
};

/**
 * Intelligent back navigation that takes the user to the previous section
 * of whichever page they were on, instead of defaulting to the hero section.
 */
export const navigateBack = (fallbackUrl = '/') => {
  if (typeof window === 'undefined') return;

  try {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const hash = window.location.hash.toLowerCase();
    const isCurrentProducts =
      path.endsWith('/products') ||
      path.endsWith('/products.html') ||
      hash.startsWith('#products') ||
      hash.startsWith('#evofills') ||
      hash.startsWith('#evobottles') ||
      hash.startsWith('#evoair');
    const isCurrentCart = path.endsWith('/cart') || path.endsWith('/cart.html') || hash === '#cart';

    // Mark intro played so home page loads immediately without blocking overlay
    sessionStorage.setItem('evo_intro_played', 'true');

    // 1. If currently on Products page:
    if (isCurrentProducts) {
      // Check if user came from Cart
      const rawNav = sessionStorage.getItem('evo_nav_source');
      if (rawNav) {
        try {
          const navSource = JSON.parse(rawNav);
          if (navSource && navSource.pathname && (navSource.pathname.includes('/cart') || navSource.hash === '#cart')) {
            window.location.href = getAppUrl('cart');
            return;
          }
        } catch (e) {}
      }

      // Return to Home page at the originating section
      let targetSection = null;
      let targetScrollY = 0;
      const rawHome = sessionStorage.getItem('evo_home_source');
      if (rawHome) {
        try {
          const homeSource = JSON.parse(rawHome);
          if (homeSource && homeSource.sectionId && homeSource.sectionId !== 'hero' && homeSource.sectionId !== 'reveal-intro') {
            targetSection = homeSource.sectionId;
            targetScrollY = homeSource.scrollY || 0;
          }
        } catch (e) {}
      }

      const targetHash = targetSection ? `#${targetSection}` : '';
      const base = getAppBase();
      const isSpaMode = (path === '' || path === '/' || path === '/index.html' || path === base || path === `${base}/index.html`) && hash.length > 0;

      if (isSpaMode) {
        window.location.hash = targetHash || '#home';
        window.dispatchEvent(new Event('hashchange'));
        window.dispatchEvent(new Event('popstate'));
        if (targetSection) {
          setTimeout(() => {
            scrollToTargetSection(targetSection, targetScrollY);
          }, 80);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      window.location.href = getAppUrl(targetHash);
      return;
    }

    // 2. If currently on Cart page:
    if (isCurrentCart) {
      // Check if user came from Products
      const rawNav = sessionStorage.getItem('evo_nav_source');
      if (rawNav) {
        try {
          const navSource = JSON.parse(rawNav);
          if (navSource && navSource.pathname && navSource.pathname.includes('/products')) {
            const targetHash = navSource.hash || (navSource.sectionId && navSource.sectionId !== 'products' ? `#${navSource.sectionId}` : '');
            window.location.href = getAppUrl(`products${targetHash}`);
            return;
          }
        } catch (e) {}
      }

      // Return to Home page at originating section
      let targetSection = null;
      let targetScrollY = 0;
      const rawHome = sessionStorage.getItem('evo_home_source');
      if (rawHome) {
        try {
          const homeSource = JSON.parse(rawHome);
          if (homeSource && homeSource.sectionId && homeSource.sectionId !== 'hero' && homeSource.sectionId !== 'reveal-intro') {
            targetSection = homeSource.sectionId;
            targetScrollY = homeSource.scrollY || 0;
          }
        } catch (e) {}
      }

      const targetHash = targetSection ? `#${targetSection}` : '';
      const base = getAppBase();
      const isSpaMode = (path === '' || path === '/' || path === '/index.html' || path === base || path === `${base}/index.html`) && hash === '#cart';

      if (isSpaMode) {
        window.location.hash = targetHash || '#home';
        window.dispatchEvent(new Event('hashchange'));
        window.dispatchEvent(new Event('popstate'));
        if (targetSection) {
          setTimeout(() => {
            scrollToTargetSection(targetSection, targetScrollY);
          }, 80);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      window.location.href = getAppUrl(targetHash);
      return;
    }

    // 3. General fallback
    const rawNav = sessionStorage.getItem('evo_nav_source');
    if (rawNav) {
      const source = JSON.parse(rawNav);
      if (source && source.pathname && source.pathname !== window.location.pathname) {
        window.location.href = `${source.pathname}${source.hash || ''}`;
        return;
      }
    }
  } catch (err) {
    // Fall back to fallbackUrl
  }

  window.location.href = getAppUrl(fallbackUrl);
};
