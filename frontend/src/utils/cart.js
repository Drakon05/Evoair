// frontend/src/utils/cart.js
import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

const PRIMARY_CART_KEY = 'evoair_cart';
const LEGACY_CART_KEY = 'evoluir_cart';
const CART_EVENT = 'evoair_cart_updated';

/**
 * Maps frontend shade/accessory data to positive integer PostgreSQL variantId
 */
export const resolveVariantId = (item) => {
  if (item.variantId && Number.isInteger(Number(item.variantId))) {
    return Number(item.variantId);
  }
  if (item.variant_id && Number.isInteger(Number(item.variant_id))) {
    return Number(item.variant_id);
  }
  if (item.id === 'evo-bottles-empty-pack' || item.name?.includes('Evo-Bottles')) {
    return 52;
  }
  if (item.id === 'evofills' || item.name?.includes('Evo-Fills')) {
    return 51;
  }

  const codeMap = {
    '02': 1,
    '03': 2,
    '06': 3,
    '07': 4,
    '10': 5,
    '11': 6,
    '14': 7,
    '15': 8,
    '18': 9,
    '19': 10,
  };
  if (item.shadeCode && codeMap[item.shadeCode]) {
    return codeMap[item.shadeCode];
  }

  const nameMap = {
    halo: 1,
    flare: 2,
    serene: 3,
    astra: 4,
    amber: 5,
    dawn: 6,
    cosmic: 7,
    stardusk: 8,
    galaxy: 9,
    nebula: 10,
  };
  const lower = (item.shadeName || '').toLowerCase().trim();
  if (lower && nameMap[lower]) {
    return nameMap[lower];
  }

  return 1; // Default fallback to Halo
};

export const getCart = () => {
  try {
    let raw = localStorage.getItem(PRIMARY_CART_KEY);
    if (!raw) {
      // Migrate from legacy key if present
      raw = localStorage.getItem(LEGACY_CART_KEY);
      if (raw) {
        localStorage.setItem(PRIMARY_CART_KEY, raw);
        localStorage.removeItem(LEGACY_CART_KEY);
      }
    }
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(PRIMARY_CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
};

export const addToCart = (newItem) => {
  const current = getCart();
  const vId = resolveVariantId(newItem);
  const enrichedItem = { ...newItem, variantId: vId };

  const existingIndex = current.findIndex(
    (item) =>
      resolveVariantId(item) === vId &&
      (item.shadeCode || 'default') === (newItem.shadeCode || 'default')
  );

  let updated;
  if (existingIndex > -1) {
    updated = current.map((item, index) => {
      if (index === existingIndex) {
        return { ...item, quantity: Math.min(10, (item.quantity || 1) + (newItem.quantity || 1)) };
      }
      return item;
    });
  } else {
    updated = [...current, { ...enrichedItem, quantity: Math.min(10, newItem.quantity || 1) }];
  }

  saveCart(updated);
  return updated;
};

export const updateQuantity = (uniqueKey, delta) => {
  const current = getCart();
  const updated = current
    .map((item) => {
      const key = `${item.id || item.variantId}-${item.shadeCode || 'default'}`;
      if (key === uniqueKey) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: Math.min(10, newQty) } : null;
      }
      return item;
    })
    .filter(Boolean);

  saveCart(updated);
  return updated;
};

export const removeFromCart = (uniqueKey) => {
  const current = getCart();
  const updated = current.filter((item) => {
    const key = `${item.id || item.variantId}-${item.shadeCode || 'default'}`;
    return key !== uniqueKey;
  });
  saveCart(updated);
  return updated;
};

export const clearCart = () => {
  saveCart([]);
};

/**
 * Synchronizes local guest items with PostgreSQL server cart upon authentication.
 * On success, clears localStorage cart as server cart becomes source of truth.
 */
export const syncCartWithBackend = async () => {
  const localItems = getCart();
  if (!localItems.length) {
    // No local items, just fetch existing server cart
    const res = await api.get('/api/v1/cart');
    if (res.ok) {
      const data = await res.json();
      return data?.data?.cart || null;
    }
    return null;
  }

  // Deduplicate and format items for POST /api/v1/cart/sync
  const variantMap = new Map();
  for (const item of localItems) {
    const vId = resolveVariantId(item);
    const qty = Math.min(10, Math.max(1, item.quantity || 1));
    const existing = variantMap.get(vId) || 0;
    variantMap.set(vId, Math.min(10, existing + qty));
  }

  const payload = {
    items: Array.from(variantMap.entries()).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    })),
  };

  const res = await api.post('/api/v1/cart/sync', payload);
  if (res.ok) {
    const data = await res.json();
    // Clear guest cart in localStorage now that server holds it
    localStorage.removeItem(PRIMARY_CART_KEY);
    localStorage.removeItem(LEGACY_CART_KEY);
    window.dispatchEvent(new Event(CART_EVENT));
    return data?.data?.cart || null;
  }

  return null;
};

export const useCart = (isAuthenticated = false) => {
  const [items, setItems] = useState(getCart);
  const [serverCart, setServerCart] = useState(null);
  const [isServerCart, setIsServerCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  // Fetch or sync server cart if authenticated
  const loadServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingCart(true);
    try {
      const local = getCart();
      let cartData = null;
      if (local.length > 0) {
        cartData = await syncCartWithBackend();
      } else {
        const res = await api.get('/api/v1/cart');
        if (res.ok) {
          const json = await res.json();
          cartData = json?.data?.cart;
        }
      }

      if (cartData) {
        setServerCart(cartData);
        setIsServerCart(true);
      }
    } catch (e) {
      console.error('Failed to load server cart:', e);
    } finally {
      setLoadingCart(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadServerCart();
    } else {
      setIsServerCart(false);
      setServerCart(null);
      setItems(getCart());
    }
  }, [isAuthenticated, loadServerCart]);

  useEffect(() => {
    const handleUpdate = () => {
      if (!isServerCart) {
        setItems(getCart());
      }
    };

    window.addEventListener(CART_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CART_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [isServerCart]);

  // If serverCart is active, use server items; otherwise use local items
  const activeItems = isServerCart && serverCart?.items ? serverCart.items : items;

  const totalCount = isServerCart
    ? serverCart?.total_count || 0
    : activeItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const subtotalPaise = isServerCart
    ? serverCart?.total_paise || 0
    : activeItems.reduce((sum, item) => sum + (item.numericPrice || 0) * 100 * (item.quantity || 1), 0);

  return {
    items: activeItems,
    serverCart,
    isServerCart,
    loadingCart,
    totalCount,
    subtotal: subtotalPaise / 100,
    subtotalPaise,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    reloadCart: loadServerCart,
  };
};

export default useCart;
