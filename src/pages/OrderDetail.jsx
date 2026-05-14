import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true, state: { from: `/orders/${id}` } });
      return;
    }
    if (!user) return;

    async function fetchOrderDetail() {
      // 1. Fetch the specific order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (orderError || !orderData) {
        setLoading(false);
        return;
      }

      // 2. Fetch items for this order
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("id, product_id, quantity, price_at_purchase")
        .eq("order_id", id);

      // 3. Fetch product details for the items
      const productIds = (itemsData || []).map((i) => i.product_id);
      const { data: prods } = await supabase
        .from("products")
        .select("id, name, image_url")
        .in("id", productIds);

      const prodMap = {};
      (prods || []).forEach((p) => (prodMap[p.id] = p));

      setOrder({
        ...orderData,
        items: (itemsData || []).map((i) => ({
          ...i,
          product: prodMap[i.product_id],
        })),
      });
      setLoading(false);
    }

    fetchOrderDetail();
  }, [id, user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#493627] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Order not found</h1>
        <Link to="/orders" className="text-sm underline uppercase tracking-widest">Back to Orders</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 font-display text-slate-900 antialiased font-[Bai_Jamjuree] ">
      <style>{`
        .tracking-widest-extra { letter-spacing: 0.15em; }
      `}</style>

      {/* Header */}
      <div className="mb-16">
        <h1 className="font-[Bai_Jamjuree] text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tight ">
          Order Details
        </h1>
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-[#493627]/10 font-[Garet_Book]">
          <div>
            <p className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-1">Order Number</p>
            <p className="text-sm font-medium uppercase">#{order.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-1">Date</p>
            <p className="text-sm font-medium">
              {new Date(order.created_at).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className={`size-1.5 rounded-full ${order.status === 'paid' ? 'bg-green-500' : 'bg-[#493627]'}`}></span>
              <p className="text-sm font-medium capitalize">{order.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <section className="mb-20">
        <h2 className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-6">Items</h2>
        <div className="space-y-0">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-6 border-b border-[#493627]/10">
              <div className="flex items-center gap-6">
                <div className="size-24 bg-[#493627]/5 flex-shrink-0">
                  <img 
                    src={item.product?.image_url || "/newshero.jpg"} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest-extra uppercase mb-1">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-[#493627]/60 tracking-normal">Specialty Selection</p>
                  <p className="text-xs text-[#493627]/60 mt-1 uppercase tracking-widest-extra">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price_at_purchase * item.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        {/* Left Side: Shipping Address */}
        <div className="space-y-12">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-4">Shipping Address</h3>
            <address className="not-italic text-sm leading-relaxed text-[#493627]/80">
              {order.address_line1}<br />
              {order.address_line2 && <>{order.address_line2}<br /></>}
              {order.city}, {order.state} {order.pincode}
            </address>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest-extra text-[#493627]/60 mb-4">Payment Method</h3>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#493627]/40 text-base">credit_card</span>
              <p className="text-sm text-[#493627]/80 tracking-widest-extra uppercase">Razorpay Secure</p>
            </div>
          </div>
        </div>

        {/* Right Side: Totals */}
        <div className="bg-[#493627]/5 p-8 h-fit">
          <div className="space-y-4">
            <div className="flex justify-between text-xs tracking-widest-extra uppercase">
              <span>Subtotal</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-xs tracking-widest-extra uppercase">
              <span>Shipping</span>
              <span className="italic">Free</span>
            </div>
            <div className="pt-4 border-t border-[#493627]/10 flex justify-between font-bold text-sm tracking-widest-extra uppercase">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="flex flex-col items-center pt-12 border-t border-[#493627]/10">
        <p className="text-xs text-[#493627]/60 mb-6 text-center italic">Questions about your order?</p>
        <button className="px-12 py-4 border border-[#493627] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#493627] hover:text-white transition-all duration-300">
          Need Help?
        </button>
      </div>
    </main>
  );
}