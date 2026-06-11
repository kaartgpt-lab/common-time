import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { supabase } from "../services/supabase";
import { createOrder, verifyPayment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error("Razorpay checkout is unavailable."));
        }
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Razorpay checkout."));
      });

      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error("Razorpay checkout is unavailable."));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Razorpay checkout."));
    };

    document.body.appendChild(script);
  });
}

const REQUIRED_FIELDS = [
  { key: "name", label: "full name" },
  { key: "phone", label: "phone number" },
  { key: "address_line1", label: "address" },
  { key: "city", label: "city" },
  { key: "state", label: "state" },
  { key: "pincode", label: "postal code" },
];

export default function Checkout() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  const { getCartItems, clearCart } = useCart();

  const items = getCartItems();

  const productIds = useMemo(() => {
    return items.map((item) => item.product_id).join(",");
  }, [items]);

  const cartItemCount = items.length;

  const [products, setProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
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
    if (authLoading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: "/checkout" },
      });
      return;
    }

    if (cartItemCount === 0) {
      navigate("/cart", { replace: true });
    }
  }, [authLoading, user, cartItemCount, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      if (!productIds) {
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);

        const ids = productIds.split(",").filter(Boolean);

        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_url")
          .in("id", ids);

        if (error) {
          throw error;
        }

        const productMap = {};

        (data || []).forEach((product) => {
          productMap[product.id] = product;
        });

        if (isMounted) {
          setProducts(productMap);
        }
      } catch (error) {
        toast.error("Could not load checkout products.");
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [productIds]);

  const cartRows = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        product: products[item.product_id],
      }))
      .filter((row) => row.product);
  }, [items, products]);

  const total = useMemo(() => {
    return cartRows.reduce((sum, row) => {
      return sum + row.product.price * row.quantity;
    }, 0);
  }, [cartRows]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCheckoutForm = () => {
    for (const field of REQUIRED_FIELDS) {
      if (!form[field.key]?.trim()) {
        toast.error(`Please fill ${field.label}.`);
        return false;
      }
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart", { replace: true });
      return false;
    }

    if (cartRows.length === 0) {
      toast.error("Cart products could not be loaded.");
      return false;
    }

    return true;
  };

  const handlePay = async () => {
    if (!validateCheckoutForm()) return;

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
      toast.error("Payment is not configured.");
      return;
    }

    setPayLoading(true);

    try {
      const orderResponse = await createOrder(items, form);

      const {
        razorpay_order_id: razorpayOrderId,
        amount,
        currency = "INR",
      } = orderResponse;

      if (!razorpayOrderId || !razorpayOrderId.startsWith("order_")) {
        throw new Error("Invalid Razorpay order id received from backend.");
      }

      if (!amount || Number(amount) < 100) {
        throw new Error("Invalid Razorpay amount received from backend.");
      }

      const Razorpay = await loadRazorpayScript();

      const razorpayOptions = {
        key: razorpayKeyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Common Time",
        description: "Specialty Coffee Selection",

        prefill: {
          name: form.name.trim(),
          email: user?.email || "",
          contact: form.phone.trim(),
        },

        notes: {
          address: [
            form.address_line1,
            form.address_line2,
            form.city,
            form.state,
            form.pincode,
          ]
            .filter(Boolean)
            .join(", "),
        },

        handler: async (paymentResponse) => {
          try {
            await verifyPayment(
              paymentResponse.razorpay_order_id,
              paymentResponse.razorpay_payment_id,
              paymentResponse.razorpay_signature
            );

            clearCart();
            toast.success("Payment successful!");
            navigate("/orders", { replace: true });
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setPayLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setPayLoading(false);
          },
        },
      };

      const razorpay = new Razorpay(razorpayOptions);

      razorpay.on("payment.failed", (response) => {
        toast.error(
          `Payment failed: ${response.error?.description || "Please try again."
          }`
        );

        setPayLoading(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(error.message || "An error occurred during checkout.");
      setPayLoading(false);
    }
  };

  if (authLoading || (user && loadingProducts)) {
    return (
      <main className="min-h-screen py-24 flex justify-center items-center bg-[#f7f7f6]">
        <div className="animate-spin h-8 w-8 border-2 border-[#493627] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f6] text-[#493627] font-[Garet_Book] antialiased">
      <style>{`
        input::placeholder {
          opacity: 0.4;
        }
      `}</style>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-[Bai_Jamjuree] text-2xl font-light tracking-tight">
                  Contact Information
                </h2>

                <p className="text-sm opacity-70">
                  Logged in as {user?.email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    Full Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    placeholder="e.g. John Doe"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    Phone *
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    placeholder="Mobile number"
                    type="tel"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="font-[Bai_Jamjuree] text-2xl font-light tracking-tight">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    Address *
                  </label>

                  <input
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    placeholder="Street name and number"
                    type="text"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    Apartment, suite, etc. (optional)
                  </label>

                  <input
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    City *
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    State *
                  </label>

                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    type="text"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-medium opacity-70">
                    Postal code *
                  </label>

                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-[#493627]/20 p-4 focus:ring-1 focus:ring-[#493627] outline-none transition-all"
                    type="text"
                  />
                </div>
              </div>
            </section>

            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-base">
                  chevron_left
                </span>
                Return to Cart
              </Link>

              <button
                onClick={handlePay}
                disabled={payLoading}
                className="w-full md:w-auto bg-[#493627] text-[#f7f7f6] px-12 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {payLoading ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </div>

          <aside className="lg:col-span-5 bg-[#493627]/5 p-8 h-fit sticky top-12">
            <h3 className="font-[Bai_Jamjuree] text-xl font-light tracking-tight mb-8">
              Order Summary
            </h3>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {cartRows.map((row) => (
                <div key={row.product_id} className="flex gap-4">
                  <div className="relative h-20 w-20 bg-[#493627]/10 flex-shrink-0 rounded-sm overflow-hidden">
                    <img
                      className="h-full w-full object-cover grayscale"
                      src={row.product.image_url}
                      alt={row.product.name}
                    />

                    <span className="absolute -top-1 -right-1 bg-[#493627] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {row.quantity}
                    </span>
                  </div>

                  <div className="flex flex-grow justify-between items-start gap-4">
                    <div>
                      <p className="font-medium text-sm">
                        {row.product.name}
                      </p>

                      <p className="text-xs opacity-60 mt-1 uppercase tracking-tighter">
                        Specialty Selection
                      </p>
                    </div>

                    <p className="text-sm whitespace-nowrap">
                      {formatPrice(row.product.price * row.quantity)}
                    </p>
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
                <span className="text-[10px] uppercase tracking-tighter italic">
                  Calculated separately
                </span>
              </div>

              <div className="flex justify-between text-lg pt-4 border-t border-[#493627]/10">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}