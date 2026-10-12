import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'evoluir_cart';
const CART_EVENT = 'evoluir_cart_updated';

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
};

export const addToCart = (newItem) => {
  const current = getCart();
  const existingIndex = current.findIndex(item => item.id === newItem.id && item.shadeCode === newItem.shadeCode);

  let updated;
  if (existingIndex > -1) {
    updated = current.map((item, index) => {
      if (index === existingIndex) {
        return { ...item, quantity: item.quantity + (newItem.quantity || 1) };
      }
      return item;
    });
  } else {
    updated = [...current, { ...newItem, quantity: newItem.quantity || 1 }];
  }

  saveCart(updated);
  return updated;
};

export const updateQuantity = (uniqueKey, delta) => {
  const current = getCart();
  const updated = current
    .map(item => {
      const key = `${item.id}-${item.shadeCode || 'default'}`;
      if (key === uniqueKey) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean);

  saveCart(updated);
  return updated;
};

export const removeFromCart = (uniqueKey) => {
  const current = getCart();
  const updated = current.filter(item => {
    const key = `${item.id}-${item.shadeCode || 'default'}`;
    return key !== uniqueKey;
  });
  saveCart(updated);
  return updated;
};

export const clearCart = () => {
  saveCart([]);
};

export const useCart = () => {
  const [items, setItems] = useState(getCart);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener(CART_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CART_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.numericPrice * (item.quantity || 1)), 0);

  return {
    items,
    totalCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
