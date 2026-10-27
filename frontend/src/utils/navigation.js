/**
 * Navigation & Section History Manager
 * Tracks the user's active page, section, and scroll position across the site
 * so that any Back button restores the exact previous section instead of resetting to hero.
 */

// Section IDs on the main landing page, in document order
const HOME_SECTIONS = ['hero', 'reveal-intro', 'airflow', 'craftsmanship', 'technology', 'pricing'];

/**
 * Detects which section is currently active / visible in the viewport.
 */
export const getActiveSectionId = () => {
  if (typeof window === 'undefined') return 'hero';

  // If on products page, track active product tab from hash
  if (window.location.pathname.includes('/products')) {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'evofills' || hash === 'evobottles' || hash === 'evoair') {
      return hash;
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

  return 'hero';
};

/**
 * Saves current navigation state to sessionStorage.
 * Called automatically before navigating away from any section.
 */
export const saveNavigationSource = () => {
  if (typeof window === 'undefined') return;
  try {
    const sectionId = getActiveSectionId();
    const sourceData = {
      pathname: window.location.pathname,
      hash: window.location.hash,
      sectionId: sectionId,
      scrollY: window.scrollY,
      timestamp: Date.now(),
    };
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

  if (sectionId && sectionId !== 'hero') {
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
    const raw = sessionStorage.getItem('evo_nav_source');
    if (raw) {
      const source = JSON.parse(raw);
      if (source && source.sectionId) {
        const isTargetHome =
          source.pathname === '/' ||
          source.pathname === '/index.html' ||
          source.pathname.endsWith('/index.html') ||
          (!source.pathname.includes('/products') && !source.pathname.includes('/cart'));

        const isCurrentHome =
          window.location.pathname === '/' ||
          window.location.pathname === '/index.html' ||
          (!window.location.pathname.includes('/products') && !window.location.pathname.includes('/cart'));

        // Returning to home landing page
        if (isTargetHome) {
          const targetSection = source.sectionId !== 'hero' ? source.sectionId : null;
          const targetHash = targetSection ? `#${targetSection}` : '';

          if (isCurrentHome) {
            // Already on home in SPA mode (e.g. hash was #cart)
            if (targetHash) {
              window.location.hash = targetHash;
            } else {
              history.pushState('', document.title, window.location.pathname + window.location.search);
              window.dispatchEvent(new Event('hashchange'));
            }

            // Immediately scroll back to the previous section
            setTimeout(() => {
              scrollToTargetSection(targetSection, source.scrollY);
            }, 60);
            return;
          } else {
            // Navigating from /products or /cart.html to home
            window.location.href = `/${targetHash}`;
            return;
          }
        }

        // Returning to products page
        if (source.pathname.includes('/products')) {
          const targetHash = source.hash || (source.sectionId && source.sectionId !== 'products' ? `#${source.sectionId}` : '');
          window.location.href = `/products${targetHash}`;
          return;
        }
      }
    }
  } catch (err) {
    // Fall back to history
  }

  // Browser history fallback
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = fallbackUrl;
  }
};
