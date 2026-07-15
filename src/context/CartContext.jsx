/**
 * Cart context — localStorage cart of variant-aware line items.
 * Each line is keyed by product_id + weight + grind so the same product in a
 * different grind/size is a separate line. Shape:
 *   { [lineKey]: { product_id, quantity, weight, grind } }
 */
import { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "commontime_cart";

const lineKey = (productId, weight, grind) =>
  `${productId}::${weight || ""}::${grind || ""}`;

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    // Migrate old format { product_id: quantity } -> line-item format
    const next = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number") {
        next[lineKey(k, "", "")] = { product_id: k, quantity: v, weight: null, grind: null };
      } else if (v && typeof v === "object" && v.product_id) {
        next[k] = { product_id: v.product_id, quantity: v.quantity || 1, weight: v.weight ?? null, grind: v.grind ?? null };
      }
    }
    return next;
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

  const addItem = (productId, quantity = 1, options = {}) => {
    const id = String(productId);
    const weight = options.weight ?? null;
    const grind = options.grind ?? null;
    const key = lineKey(id, weight, grind);
    setCart((prev) => ({
      ...prev,
      [key]: {
        product_id: id,
        weight,
        grind,
        quantity: (prev[key]?.quantity || 0) + quantity,
      },
    }));
  };

  const updateQuantity = (key, quantity) => {
    setCart((prev) => {
      if (!prev[key]) return prev;
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { ...prev[key], quantity } };
    });
  };

  const removeItem = (key) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const getCartCount = () =>
    Object.values(cart).reduce((s, line) => s + (line.quantity || 0), 0);

  const getCartItems = () =>
    Object.entries(cart).map(([key, line]) => ({
      key,
      product_id: line.product_id,
      quantity: line.quantity,
      weight: line.weight,
      grind: line.grind,
    }));

  const clearCart = () => setCart({});

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
