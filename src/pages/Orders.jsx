import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true, state: { from: "/orders" } });
      return;
    }
    if (!user) return;

    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const orderIds = (data || []).map((o) => o.id);
      const { data: items } = await supabase
        .from("order_items")
        .select("id, order_id, product_id, quantity, price_at_purchase")
        .in("order_id", orderIds);
      const productIds = [...new Set((items || []).map((i) => i.product_id))];
      const { data: prods } = await supabase
        .from("products")
        .select("id, name, image_url")
        .in("id", productIds);
      const prodMap = {};
      (prods || []).forEach((p) => (prodMap[p.id] = p));
      setOrders(
        (data || []).map((o) => ({
          ...o,
          items: (items || [])
            .filter((i) => i.order_id === o.id)
            .map((i) => ({ ...i, product: prodMap[i.product_id] })),
        }))
      );
      setLoading(false);
    }
    fetchOrders();
  }, [user?.id, authLoading, navigate]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen py-16 px-4 max-w-4xl mx-auto font-display font-[Bai_Jamjuree]">
      <h1 className="text-2xl font-bold mb-8 uppercase tracking-tight font-[Bai_Jamjuree]">Orders</h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 font-[Garet_Book]">No orders yet.</p>
      ) : (
        <div className="space-y-4 ">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="font-mono text-sm text-gray-500">
                    #{order.id.slice(0, 8)}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <span className="font-semibold text-[#493627]">
                  {formatPrice(order.total_amount)}
                </span>
                <span className="text-sm text-gray-500 ">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
                <span className="text-gray-400">
                  {expanded[order.id] ? "−" : "+"}
                </span>
              </button>

              {expanded[order.id] && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-white">
                  <div className="divide-y divide-gray-100">
                    {order.items.map((oi) => (
                      <div key={oi.id} className="flex gap-4 py-4 items-center">
                        <img
                          src={oi.product?.image_url || "/newshero.jpg"}
                          alt={oi.product?.name}
                          className="w-16 h-16 object-cover rounded-sm"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{oi.product?.name}</p>
                          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                            Qty: {oi.quantity} × {formatPrice(oi.price_at_purchase)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* VIEW DETAILS BUTTON */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold border border-[#493627] text-[#493627] px-6 py-2.5 hover:bg-[#493627] hover:text-white transition-all duration-300"
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}