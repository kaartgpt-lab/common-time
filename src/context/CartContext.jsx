/**
 * Cart context - localStorage cart with product_id -> quantity
 */
import { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "commontime_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = (productId, quantity = 1) => {
    const id = String(productId);
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + quantity,
    }));
  };

  const updateQuantity = (productId, quantity) => {
    const id = String(productId);
    if (quantity <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setCart((prev) => ({ ...prev, [id]: quantity }));
    }
  };

  const removeItem = (productId) => {
    const id = String(productId);
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((s, q) => s + q, 0);
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => ({
      product_id: productId,
      quantity,
    }));
  };

  const clearCart = () => {
    setCart({});
  };

  const value = {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    getCartCount,
    getCartItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
