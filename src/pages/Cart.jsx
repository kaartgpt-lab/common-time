import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice } from "../utils/formatters";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeItem, getCartItems } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const items = getCartItems();

  useEffect(() => {
    if (items.length === 0) {
      setProducts({});
      setLoading(false);
      return;
    }
    async function fetchProducts() {
      const ids = items.map((i) => i.product_id);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, stock_quantity")
        .in("id", ids);

      if (!error && data) {
        const map = {};
        data.forEach((p) => (map[p.id] = p));
        setProducts(map);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [cart]);

  const cartRows = items
    .map((item) => ({
      ...item,
      product: products[item.product_id],
    }))
    .filter((row) => row.product);

  const total = cartRows.reduce(
    (s, row) => s + row.product.price * row.quantity,
    0
  );

  // EMPTY STATE
  if (items.length === 0 && !loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#493627]/10 uppercase select-none">Empty</h2>
        <div className="-mt-8 md:-mt-12 mb-10">
          <span className="text-2xl font-light tracking-tight italic">Your cart is waiting</span>
        </div>
        <Link
          to="/shop"
          className="bg-[#493627] text-[#F9F7F2] px-10 py-4 text-xs font-bold uppercase tracking-[0.3em] rounded hover:opacity-90 transition-all"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 font-display text-[#493627] antialiased">
      {/* HEADER SECTION */}
      <div className="mb-16 font-[Bai_Jamjuree]">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#493627]/10 uppercase select-none">
          Cart
        </h2>
        <div className="-mt-8 md:-mt-12">
          <span className="text-2xl font-light tracking-tight italic">Your selection</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* LEFT SIDE: ITEM LIST */}
        <div className="flex-grow space-y-12">
          {loading ? (
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-10 animate-pulse">
                  <div className="w-32 h-40 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-6 bg-gray-200 w-1/3" />
                    <div className="h-4 bg-gray-200 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            cartRows.map((row) => (
              <div 
                key={row.product_id} 
                className="flex items-start justify-between pb-8 border-b border-[#493627]/5"
              >
                <div className="flex gap-6 md:gap-10">
                  {/* PRODUCT IMAGE */}
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-[#493627]/5 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      className="w-full h-full object-cover hover:grayscale-0 transition-all duration-500" 
                      src={row.product.image_url || "/placeholder.jpg"} 
                      alt={row.product.name}
                    />
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-lg md:text-xl font-medium tracking-tight font-[Bai_Jamjuree]">
                        {row.product.name}
                      </h3>
                      <p className="text-[#493627]/60 text-sm mt-1 uppercase tracking-widest  font-[Garet_Book]">
                        Specialty Grade / Selection
                      </p>
                    </div>

                    {/* QUANTITY & REMOVE */}
                    <div className="flex items-center gap-6 mt-6 font-[Bai_Jamjuree]">
                      <div className="flex items-center border border-[#493627]/10 rounded overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(row.product_id, Math.max(1, row.quantity - 1))}
                          className="px-3 py-1 hover:bg-[#493627]/5 transition-colors"
                        >
                          <span className="text-sm font-bold">−</span>
                        </button>
                        <span className="px-4 text-sm font-medium">{row.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(row.product_id, Math.min(row.product.stock_quantity || 99, row.quantity + 1))}
                          className="px-3 py-1 hover:bg-[#493627]/5 transition-colors"
                        >
                          <span className="text-sm font-bold">+</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(row.product_id)}
                        className="text-xs uppercase tracking-widest text-[#493627]/40 hover:text-[#493627] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* ITEM TOTAL */}
                <div className="text-right py-1 font-[Bai_Jamjuree]">
                  <span className="text-lg font-medium">{formatPrice(row.product.price * row.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE: SUMMARY BOX */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-[#493627]/5 p-8 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 font-[Bai_Jamjuree]">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#493627]/60  font-[Garet_Book]">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#493627]/60 font-[Garet_Book]">Shipping</span>
                <span className="italic text-xs  font-[Garet_Book]">Calculated at next step</span>
              </div>
              
              <div className="pt-6 mt-6 border-t border-[#493627]/10 flex justify-between items-end font-[Bai_Jamjuree]">
                <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold tracking-tighter text-[#493627]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full mt-10 bg-[#493627] text-[#F9F7F2] py-5 text-center text-xs font-bold uppercase tracking-[0.3em] rounded hover:opacity-90 transition-all font-[Bai_Jamjuree]"
            >
              Checkout
            </Link>

            <p className="mt-6 text-[10px] text-center text-[#493627]/40 uppercase tracking-widest leading-loose px-4 font-[Garet_Book] ">
              Taxes and shipping fees will be applied during the final stage of your purchase.
            </p>
          </div>

          <div className="mt-8 px-2  font-[Garet_Book]">
            <div className="flex items-center gap-3 text-[#493627]/60">
              <span className="text-xs">🔒</span>
              <span className="text-[10px] uppercase tracking-widest font-medium">
                Secure encrypted checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}