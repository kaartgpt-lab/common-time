import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice, slugify } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import ProductGrid from "../components/commerce/ProductGrid";
import toast from "react-hot-toast";

const GRIND_OPTIONS = ["whole bean", "coarse", "medium", "fine", "espresso"];
const WEIGHT_OPTIONS = ["250g", "500g"];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [grind, setGrind] = useState("whole bean");
  const [weight, setWeight] = useState("250g");
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);

      const isUuid = /^[0-9a-f-]{36}$/i.test(slug);
      let data = null;

      if (isUuid) {
        const res = await supabase
          .from("products")
          .select(`*, product_images (*)`)
          .eq("id", slug)
          .eq("is_active", true)
          .single();
        data = res.data;
      } else {
        const res = await supabase
          .from("products")
          .select(`*, product_images (*)`)
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (res.data) {
          data = res.data;
        } else {
          const allRes = await supabase
            .from("products")
            .select(`*, product_images (*)`)
            .eq("is_active", true);
          data = (allRes.data || []).find((p) => slugify(p.name) === slug) || null;
        }
      }

      if (!data) {
        setProduct(null);
        setRelated([]);
      } else {
        setProduct(data);
        const { data: rel } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, quantity);
    toast.success("added to cart");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-16 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="aspect-[4/5] bg-[#f5f4f2] animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-3 w-20 bg-[#f5f4f2] animate-pulse" />
              <div className="h-8 w-3/4 bg-[#f5f4f2] animate-pulse" />
              <div className="h-4 w-1/4 bg-[#f5f4f2] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="font-[Inter] text-[#1a1a1a]/50">product not found.</p>
        <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] font-[Inter] text-[#8b7355]">
          ← back to shop
        </Link>
      </main>
    );
  }

  const notes = product.tasting_notes || product.notes || product.flavor_notes;
  const notesArr = Array.isArray(notes)
    ? notes
    : notes
    ? notes.split(",").map((n) => n.trim())
    : [];

  const images =
    product.product_images?.length > 0
      ? [...product.product_images].sort((a, b) => a.position - b.position)
      : product.image_url
      ? [{ image_url: product.image_url }]
      : [];

  const isCoffee = product.category === "coffee";

  return (
    <main className="min-h-screen bg-white font-[Inter]">

      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-10 md:pt-14">
        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/35">
          <Link to="/" className="hover:text-[#1a1a1a]/70 transition-colors">home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#1a1a1a]/70 transition-colors">shop</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]/60">{product.name}</span>
        </nav>
      </div>

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-8 pb-20 md:pt-10 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Images ── */}
          <div>
            {images.length > 0 && (
              <>
                <div className="aspect-[4/5] overflow-hidden bg-[#f5f4f2]">
                  <img
                    src={images[activeImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`overflow-hidden flex-shrink-0 transition-opacity duration-200 ${
                          activeImage === i ? "opacity-100 ring-1 ring-[#1a1a1a]" : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img src={img.image_url} alt="" className="w-16 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col lg:pt-2">

            {/* Category */}
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Inter] mb-4">
              {product.category?.replace("-", " ")}
            </p>

            {/* Name + price */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="font-[Inter] font-light text-[#1a1a1a] text-3xl md:text-4xl leading-tight flex-1">
                {product.name}
              </h1>
              <p className="font-[Inter] text-xl md:text-2xl text-[#1a1a1a] flex-shrink-0 mt-1">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Origin */}
            {product.origin && (
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/40 mb-6">
                {product.origin}
              </p>
            )}

            {/* Divider */}
            <div className="w-8 h-px bg-[#8b7355]/30 mb-6" />

            {/* Description */}
            <p className="text-[14px] text-[#1a1a1a]/60 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Tasting notes */}
            {notesArr.length > 0 && (
              <div className="mb-8">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#1a1a1a]/35 mb-3">tasting notes</p>
                <div className="flex flex-wrap gap-2">
                  {notesArr.map((note) => (
                    <span
                      key={note}
                      className="text-[10px] uppercase tracking-[0.2em] text-[#8b7355] border border-[#8b7355]/30 px-3 py-1 font-[Inter]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Coffee-only toggles */}
            {isCoffee && (
              <>
                {/* Weight */}
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#1a1a1a]/35 mb-3">weight</p>
                  <div className="flex gap-2">
                    {WEIGHT_OPTIONS.map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeight(w)}
                        className={`text-[10px] uppercase tracking-[0.2em] font-[Inter] px-5 py-2.5 border transition-colors duration-200 ${
                          weight === w
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-white text-[#1a1a1a]/50 border-black/15 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grind */}
                <div className="mb-8">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#1a1a1a]/35 mb-3">grind</p>
                  <div className="flex flex-wrap gap-2">
                    {GRIND_OPTIONS.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrind(g)}
                        className={`text-[10px] uppercase tracking-[0.15em] font-[Inter] px-4 py-2 border transition-colors duration-200 ${
                          grind === g
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-white text-[#1a1a1a]/50 border-black/15 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex gap-3 mt-auto">
              {/* Quantity */}
              <div className="flex items-center border border-black/15 flex-shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-[13px] font-[Inter] text-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors text-lg"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.35em] font-[Inter] hover:bg-[#8b7355] transition-colors duration-300"
              >
                add to cart
              </button>
            </div>

            {/* Shipping note */}
            <p className="text-[10px] text-[#1a1a1a]/30 mt-4 font-[Inter]">
              free shipping on orders above ₹999 · ships within 2–3 days
            </p>

          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-[#F9F7F2] py-16 md:py-20 border-t border-black/5">
          <div className="max-w-[1200px] mx-auto px-5 md:px-6">
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Inter] mb-3">
              you may also like
            </p>
            <h2 className="font-[Inter] font-light text-[#1a1a1a] text-2xl mb-10">
              more from {product.category?.replace("-", " ")}
            </h2>
            <ProductGrid products={related} columns={3} />
          </div>
        </section>
      )}

    </main>
  );
}
