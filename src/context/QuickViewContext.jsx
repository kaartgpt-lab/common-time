import { createContext, useContext, useState, useCallback } from "react";

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);

  const open = useCallback((p) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);

  return (
    <QuickViewContext.Provider value={{ product, open, close }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  return useContext(QuickViewContext);
}
