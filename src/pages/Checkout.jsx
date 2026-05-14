import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, verifyPayment } from "../services/api";
import { formatPrice } from "../utils/formatters";
import toast from "react-hot-toast";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(window.Razorpay);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getCartItems, clearCart } = useCart();

  const items = getCartItems();
  const productIds = useMemo(() => items.map((i) => i.product_id).join(","), [items]);

  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
      return;
    }
    if (items.length === 0 && user) {
      navigate("/cart", { replace: true });
      return;
    }
    if (items.length === 0) return;

    async function fetchProducts() {
      const ids = items.map((i) => i.product_id);
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .in("id", ids);

      const map = {};
      (data || []).forEach((p) => { map[p.id] = p; });
      setProducts(map);
      setLoading(false);
    }
    fetchProducts();
  }, [user, authLoading, productIds, navigate]);

  const cartRows = items
    .map((item) => ({ ...item, product: products[item.product_id] }))
    .filter((row) => row.product);

  const total = cartRows.reduce((s, row) => s + row.product.price * row.quantity, 0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePay = async () => {
    const required = ["name", "phone", "address_line1", "city", "state", "pincode"];
    for (const k of required) {
      if (!form[k]?.trim()) {
        toast.error(`Please fill ${k.replace("_", " ")}`);
        return;
      }
    }

    setPayLoading(true);
    try {
      const response = await createOrder(items, form);
      
      // Handle Dev Mode / Simulation
      if (response.dev_mode) {
        clearCart();
        toast.success("Order placed successfully (Dev Mode)!");
        navigate("/orders", { replace: true });
        setPayLoading(false);
        return;
      }

      const { razorpay_order_id, amount } = response;
      const Razorpay = await loadRazorpay();
      
      // RESTORED: Missing Razorpay key validation
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Payment not configured. Please set VITE_RAZORPAY_KEY_ID.");
        setPayLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency: "INR",
        order_id: razorpay_order_id,
        name: "Common Time",
        description: "Specialty Coffee Selection",
        handler: async (res) => {
          try {
            await verifyPayment(res.razorpay_order_id, res.razorpay_payment_id, res.razorpay_signature);
            clearCart();
            toast.success("Payment successful!");
            navigate("/orders", { replace: true });
          } catch (err) {
            toast.error("Verification failed. Please contact support.");
          } finally {
            setPayLoading(false);
          }
        },
        modal: { ondismiss: () => setPayLoading(false) },
      };

      const rzp = new Razorpay(options);

      // RESTORED: Payment failure event
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPayLoading(false);
      });

      rzp.open();
    } catch (err) {
      toast.error(err.message || "An error occurred during checkout.");
      setPayLoading(false);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <main className="min-h-screen py-24 flex justify-center items-center bg-[#f7f7f6]">
        <div className="animate-spin h-8 w-8 border-2 border-[#493627] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f6] text-[#493627] font-display antialiased">
      <style>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        input::placeholder { opacity: 0.4; }
      `}</style>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* FORM COLUMN */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-serif text-3xl">Contact Information</h2>
                <p className="text-sm opacity-70">Logged in as {user?.email}</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">Full Name *</label>
                  <input 
                    name="name" value={form.name} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" 
                    placeholder="e.g. John Doe" type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">Phone *</label>
                  <input 
                    name="phone" value={form.phone} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" 
                    placeholder="Mobile number" type="tel"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="font-serif text-3xl">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">Address *</label>
                  <input 
                    name="address_line1" value={form.address_line1} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" 
                    placeholder="Street name and number" type="text"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">Apartment, suite, etc. (optional)</label>
                  <input 
                    name="address_line2" value={form.address_line2} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">City *</label>
                  <input 
                    name="city" value={form.city} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">State *</label>
                  <input 
                    name="state" value={form.state} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" type="text"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">Postal code *</label>
                  <input 
                    name="pincode" value={form.pincode} onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all" type="text"
                  />
                </div>
              </div>
            </section>

            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <Link to="/cart" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-base">chevron_left</span>
                Return to Cart
              </Link>
              <button 
                onClick={handlePay}
                disabled={payLoading}
                className="w-full md:w-auto bg-[#493627] text-[#f7f7f6] px-12 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {payLoading ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </div>

          {/* SUMMARY ASIDE */}
          <aside className="lg:col-span-5 bg-[#493627]/5 p-8 h-fit sticky top-12">
            <h3 className="font-serif text-2xl mb-8">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {cartRows.map((row) => (
                <div key={row.product_id} className="flex gap-4">
                  <div className="relative h-20 w-20 bg-[#493627]/10 flex-shrink-0 rounded-sm overflow-hidden">
                    <img className="h-full w-full object-cover grayscale" src={row.product.image_url} alt={row.product.name} />
                    <span className="absolute -top-1 -right-1 bg-[#493627] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {row.quantity}
                    </span>
                  </div>
                  <div className="flex flex-grow justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{row.product.name}</p>
                      <p className="text-xs opacity-60 mt-1 uppercase tracking-tighter">Specialty Selection</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(row.product.price * row.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#493627]/10">
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-60">Shipping</span>
                <span className="text-[10px] uppercase tracking-tighter italic">Calculated at next step</span>
              </div>
              <div className="flex justify-between pt-6 mt-4 border-t border-[#493627]/10">
                <span className="text-lg font-bold uppercase tracking-widest">Total</span>
                <div className="text-right">
                  <span className="text-xs opacity-50 mr-2 uppercase">INR</span>
                  <span className="text-2xl font-serif">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}