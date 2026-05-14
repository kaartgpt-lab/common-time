import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  {
    value: "all",
    label: "All Items",
    sublabel: "The Full Edit",
    description: "Every object, every ritual, every detail — curated under one roof.",
  },
  {
    value: "coffee",
    label: "coffee",
    sublabel: "Brewing & Enjoying",
    description: "Focused on the art of brewing and enjoying your first drink of the day.",
  },
  {
    value: "living accent",
    label: "Living Accents",
    sublabel: "Home & Hosting",
    description: "Tactile pieces designed to elevate home spaces and hosting.",
  },
  {
    value: "Personal Notes",
    label: "Personal Notes",
    sublabel: "Style & Senses",
    description: "Sensory finishing touches and individual style elements.",
  },
  {
    value: "merchandise",
    label: "Merchandise",
    sublabel: "Common Time Goods",
    description: "common time branded merchandise and collaborations.",
  },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const activeCategory = CATEGORIES.find((c) => c.value === category);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      let query = supabase
        .from("products")
        .select(`*, product_images (*)`)
        .eq("is_active", true);

      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        const formattedProducts = (data || []).map((product) => {
          const sortedImages =
            product.product_images?.sort((a, b) => a.position - b.position) || [];
          return {
            ...product,
            image_url:
              sortedImages[0]?.image_url || product.image_url || "/newshero.jpg",
            image_url_hover: sortedImages[1]?.image_url || null,
          };
        });
        setProducts(formattedProducts);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  return (
    <main className="bg-[#fafaf8] min-h-screen text-black">

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shiny {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shiny-text {
          background: linear-gradient(
            120deg,
            rgba(26,26,26,1) 45%,
            rgba(139,115,85,0.8) 50%,
            rgba(26,26,26,1) 55%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shiny 6s linear infinite;
          line-height: 1.2;
        }
        @keyframes descFade {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .desc-fade { animation: descFade 0.35s ease forwards; }
        @keyframes skelPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        .ct-skeleton {
          background: #e5e3de;
          animation: skelPulse 1.6s ease infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── Page Header ── */}
      <section className="border-b border-black/5 pt-14 pb-10 md:pt-14 md:pb-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start">
            <span className="shiny-text py-2 inline-block overflow-visible font-[Garet_Book] text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold italic mb-4">
              Curated Selection
            </span>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-black/20 hidden md:block" />
              <h1 className="text-4xl md:text-5xl font-light tracking-tight font-[Bai_Jamjuree]">
                <span className="shiny-text py-2 inline-block overflow-visible">
                  The Shop
                </span>
              </h1>
            </div>
            <p className="mt-4 text-sm text-black/40 font-[Garet_Book] max-w-md leading-relaxed ml-0 md:ml-16">
              Objects, rituals, and finishing touches — for the moments between.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky Category Filter ── */}
      <section className="sticky top-0 z-30 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-0 md:px-8">
          <div className="flex no-scrollbar overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex-shrink-0 px-4 md:px-6 py-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-[Garet_Book] font-semibold border-b-2 whitespace-nowrap transition-colors duration-200 ${
                  category === cat.value
                    ? "border-[#8b7355] text-[#1a1a1a]"
                    : "border-transparent text-black/35 hover:text-black/65"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Description Strip ── */}
      <section className="bg-[#f5f3ef] border-b border-black/5 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div key={category} className="desc-fade flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5">
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#8b7355] font-[Garet_Book] font-semibold flex-shrink-0">
              {activeCategory?.sublabel}
            </span>
            <div className="hidden sm:block h-3 w-px bg-black/15" />
            <p className="text-[11px] text-black/45 font-[Garet_Book] leading-relaxed">
              {activeCategory?.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Product Grid — 2 cols mobile, 3 cols tablet, 4 cols desktop ── */}
      <section className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className="ct-skeleton aspect-[3/4] w-full" />
                  <div className="ct-skeleton h-2 w-1/2 rounded" />
                  <div className="ct-skeleton h-3 w-full rounded" />
                  <div className="ct-skeleton h-3 w-2/3 rounded" />
                  <div className="ct-skeleton h-8 w-full rounded mt-1" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-black/30 text-xs uppercase tracking-[0.3em] font-[Garet_Book]">
                Nothing here yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="mt-14 flex justify-center">
              <span className="text-[10px] uppercase tracking-[0.35em] text-black/20 font-[Garet_Book]">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}