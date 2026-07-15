import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice, slugify } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { PRODUCT_CATALOG } from "../data/productContent";
import toast from "react-hot-toast";

/* ── Roast level visual indicator ─────────────────────── */
function RoastDots({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full transition-all ${
            i <= level ? "bg-[#8b7355]" : "bg-[#8b7355]/15"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Diamond placeholder ───────────────────────────────── */
function ImagePlaceholder({ name }) {
  return (
    <div className="w-full h-full bg-[#F5F2EC] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border border-[#8b7355]/20 rotate-45" />
      <p className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355]/40 font-[Inter] text-center px-6 leading-relaxed">
        {name}
      </p>
    </div>
  );
}

/* ── Characteristics row ────────────────────────────────── */
function CharRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-3 border-b border-black/5 last:border-0">
      <span className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-[Inter] w-20 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[12px] text-[#1a1a1a] font-[Inter] leading-snug flex-1">
        {value}
      </span>
    </div>
  );
}

/* ── Spec row (merch) ───────────────────────────────────── */
function SpecRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-black/5 last:border-0">
      <span className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-[Inter] w-24 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[12px] text-[#1a1a1a] font-[Inter] leading-relaxed flex-1">
        {value}
      </span>
    </div>
  );
}

/* ── Section label ──────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span className="text-[8px] uppercase tracking-[0.55em] text-[#8b7355] font-[Inter] font-medium">
      {children}
    </span>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const staticData = PRODUCT_CATALOG[slug] ?? null;

  const [sbProduct, setSbProduct] = useState(null);      // Supabase product or false
  const [sbLoading, setSbLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState("espresso");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(
    staticData?.packaging?.defaultSize ?? null
  );
  const { addItem } = useCart();

  const isBean = staticData?.category === "beans";

  useEffect(() => {
    if (!slug) return;
    setSbLoading(true);
    setActiveImage(0);

    async function fetchFromSupabase() {
      const { data } = await supabase
        .from("products")
        .select("*, product_images (*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (data) {
        setSbProduct(data);
        // Fetch related products
        const { data: rel } = await supabase
          .from("products")
          .select("*, product_images (*)")
          .eq("is_active", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4);
        setRelated(rel || []);
      } else {
        setSbProduct(false);
        // Related from static catalog
        const staticRelated = Object.entries(PRODUCT_CATALOG)
          .filter(([s, p]) => p.category === staticData?.category && s !== slug)
          .slice(0, 4)
          .map(([s, p]) => ({ slug: s, name: p.name, price: p.price ?? 0, category: p.category, _static: true }));
        setRelated(staticRelated);
      }
      setSbLoading(false);
    }

    fetchFromSupabase();
  }, [slug]);

  /* ── Not found ──────────────────────────────────────────── */
  if (!staticData) {
    return (
      <main className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-5 font-[Inter]">
        <div className="w-8 h-8 border border-[#8b7355]/30 rotate-45" />
        <p className="text-[#1a1a1a]/40 text-sm">product not found.</p>
        <Link to="/shop" className="text-[9px] uppercase tracking-[0.35em] text-[#8b7355]">
          ← back to shop
        </Link>
      </main>
    );
  }

  /* ── Derived values ─────────────────────────────────────── */
  const hasSupabase = !!sbProduct;
  const canAddToCart = hasSupabase;

  /* Images — prefer Supabase product_images, then image_url, then static placeholder */
  const images =
    sbProduct?.product_images?.length > 0
      ? [...sbProduct.product_images].sort((a, b) => a.position - b.position)
      : sbProduct?.image_url
      ? [{ image_url: sbProduct.image_url }]
      : [];

  /* Price */
  let displayedPrice = null;
  if (isBean && selectedWeight) {
    const staticPrice = staticData.packaging.prices[selectedWeight];
    if (staticPrice != null) displayedPrice = staticPrice; // already in ₹
    else if (sbProduct?.price) displayedPrice = Math.round(sbProduct.price / 100);
  } else if (!isBean) {
    displayedPrice = sbProduct?.price
      ? Math.round(sbProduct.price / 100)
      : staticData.price;
  }

  const handleAddToCart = () => {
    if (!sbProduct) return;
    addItem(sbProduct.id, quantity);
    toast.success("added to cart");
  };

  return (
    <main className="min-h-screen bg-[#fafaf8] font-[Inter]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 md:pt-12">
        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/30">
          <Link to="/" className="hover:text-[#8b7355] transition-colors">home</Link>
          <span>·</span>
          <Link to="/shop" className="hover:text-[#8b7355] transition-colors">shop</Link>
          <span>·</span>
          <span className="text-[#1a1a1a]/50">{staticData.name}</span>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO (image + product info)
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[54%_46%] gap-10 lg:gap-16 fade-up">

          {/* ─── Left: Image gallery ─────────────────────── */}
          <div>
            <div className="aspect-[4/5] overflow-hidden bg-[#F5F2EC] relative">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]?.image_url}
                  alt={staticData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder name={staticData.name} />
              )}
              {/* Roast badge */}
              {isBean && staticData.roast && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2">
                  <span className="text-[8px] uppercase tracking-[0.4em] text-[#8b7355]">
                    {staticData.roast} roast
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      activeImage === i
                        ? "ring-1 ring-[#1a1a1a] opacity-100"
                        : "opacity-35 hover:opacity-65"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-16 h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Product info ──────────────────────── */}
          <div className="flex flex-col lg:pt-1 lg:pr-10 xl:pr-16">

            {/* Category + subtitle */}
            <div className="flex items-center gap-3 mb-5">
              <SectionLabel>{isBean ? "specialty coffee" : staticData.category}</SectionLabel>
              {staticData.subtitle && (
                <>
                  <span className="w-5 h-px bg-[#8b7355]/25" />
                  <span className="text-[9px] uppercase tracking-[0.25em] text-black/25">
                    {staticData.subtitle}
                  </span>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="font-[Inter] font-light text-[#1a1a1a] text-[28px] md:text-[36px] leading-tight tracking-tight mb-3">
              {staticData.name}
            </h1>

            {/* Origin line */}
            {isBean && staticData.characteristics?.origin && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/30 mb-5">
                {staticData.characteristics.origin}
              </p>
            )}

            {/* Intro / Description */}
            <p className="text-[13px] md:text-[14px] text-[#1a1a1a]/55 leading-relaxed mb-8">
              {isBean ? staticData.intro : staticData.description}
            </p>

            {/* ─── BEANS content ──────────────────────────── */}
            {isBean && (
              <>
                {/* Tasting notes pills */}
                {staticData.tastingNotes?.length > 0 && (
                  <div className="mb-7">
                    <p className="text-[8px] uppercase tracking-[0.5em] text-black/25 mb-3">
                      tasting notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {staticData.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="text-[9px] uppercase tracking-[0.2em] text-[#8b7355] border border-[#8b7355]/20 px-3 py-1.5 bg-[#8b7355]/5"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Characteristics */}
                <div className="mb-7 border-t border-black/5">
                  <CharRow label="origin" value={staticData.characteristics.origin} />
                  <CharRow label="varietal" value={staticData.characteristics.varietal} />
                  <CharRow label="process" value={staticData.characteristics.process} />
                  <CharRow label="acidity" value={staticData.characteristics.acidity} />
                  <CharRow label="body" value={staticData.characteristics.body} />
                </div>

                {/* Weight selector + price */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[8px] uppercase tracking-[0.5em] text-black/25">
                      package size
                    </p>
                    <p className="font-[Inter] text-xl text-[#1a1a1a] tracking-tight">
                      {displayedPrice != null ? `₹${displayedPrice}` : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {staticData.packaging.sizes.map((w) => {
                      const hasPrice = staticData.packaging.prices[w] != null;
                      return (
                        <button
                          key={w}
                          onClick={() => hasPrice && setSelectedWeight(w)}
                          disabled={!hasPrice}
                          className={`text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 border transition-all duration-200 ${
                            selectedWeight === w
                              ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                              : hasPrice
                              ? "bg-white text-[#1a1a1a]/50 border-black/15 hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                              : "bg-white text-black/15 border-black/8 cursor-not-allowed"
                          }`}
                        >
                          {w}
                          {!hasPrice && (
                            <span className="ml-1.5 text-[7px] normal-case tracking-normal opacity-60">
                              soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </>
            )}

            {/* ─── MERCH content ──────────────────────────── */}
            {!isBean && (
              <>
                {/* Specs */}
                {staticData.specs?.length > 0 && (
                  <div className="mb-7 border-t border-black/5">
                    {staticData.specs.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                )}

                {/* Size selector */}
                {staticData.sizeOptions && (
                  <div className="mb-7">
                    <p className="text-[8px] uppercase tracking-[0.5em] text-black/25 mb-3">
                      size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {staticData.sizeOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-11 h-11 text-[10px] uppercase tracking-[0.1em] border transition-all duration-200 ${
                            selectedSize === s
                              ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                              : "bg-white text-[#1a1a1a]/50 border-black/15 hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaboration */}
                {staticData.collaboration && (
                  <div className="mb-7 flex items-center gap-3">
                    <div className="w-4 h-px bg-[#8b7355]/40" />
                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#8b7355]/70">
                      in collaboration with {staticData.collaboration}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="mb-8">
                  <p className="font-[Inter] text-2xl text-[#1a1a1a] tracking-tight">
                    {displayedPrice != null ? `₹${displayedPrice}` : "—"}
                  </p>
                </div>
              </>
            )}

            {/* ─── Add to cart ─────────────────────────────── */}
            <div className="flex gap-3 mt-auto">
              <div className="flex items-center border border-black/12 bg-white flex-shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-base"
                >
                  −
                </button>
                <span className="w-8 text-center text-[12px] text-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-base"
                >
                  +
                </button>
              </div>

              {canAddToCart ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#1a1a1a] text-white text-[9px] uppercase tracking-[0.4em] hover:bg-[#8b7355] transition-colors duration-300"
                >
                  add to cart
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 h-12 bg-[#f0ede8] text-[#1a1a1a]/30 text-[9px] uppercase tracking-[0.4em] cursor-not-allowed"
                >
                  {sbLoading ? "loading…" : "coming soon"}
                </button>
              )}
            </div>

            <p className="text-[9px] text-[#1a1a1a]/25 mt-4 tracking-[0.1em]">
              free shipping on orders above ₹999 · ships within 2–3 days
            </p>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — TASTING PROFILE (beans only)
      ═══════════════════════════════════════════════════════ */}
      {isBean && staticData.tastingNotes?.length > 0 && (
        <section className="bg-[#F5F2EC] border-y border-black/5 py-14 md:py-20 overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-20">

              {/* Left: label + notes */}
              <div className="flex-1">
                <SectionLabel>tasting profile</SectionLabel>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {staticData.tastingNotes.map((note, i) => (
                    <span
                      key={note}
                      className="font-[Inter] font-light text-[#1a1a1a] leading-none"
                      style={{ fontSize: `${28 - i * 3}px` }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: roast level */}
              <div className="flex-shrink-0">
                <p className="text-[8px] uppercase tracking-[0.5em] text-black/30 mb-4">
                  roast level
                </p>
                <RoastDots level={staticData.roastLevel ?? 2} />
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b7355] mt-2.5">
                  {staticData.roast}
                </p>
                <p className="text-[8px] uppercase tracking-[0.5em] text-black/30 mt-6 mb-1.5">
                  grind options
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]">
                  Moka Pot
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — THE STORY / ABOUT THIS COFFEE
      ═══════════════════════════════════════════════════════ */}
      {isBean && staticData.readMore && (
        <section className="bg-white border-b border-black/5 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="max-w-3xl">
              <SectionLabel>about this coffee</SectionLabel>
              <p className="mt-6 font-[Inter] font-light text-[#1a1a1a]/65 text-[15px] md:text-[16px] leading-[1.9] tracking-[0.01em]">
                {staticData.readMore}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Product story (merch) */}
      {!isBean && staticData.story && (
        <section className="bg-[#F5F2EC] border-y border-black/5 py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="max-w-2xl">
              <SectionLabel>the idea</SectionLabel>
              <p className="mt-6 font-[Inter] font-light text-[#1a1a1a]/60 text-[15px] md:text-[16px] leading-[1.9]">
                {staticData.story}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — HOW TO BREW (beans only)
      ═══════════════════════════════════════════════════════ */}
      {isBean && staticData.howToBrew && (
        <section className="bg-[#fafaf8] border-b border-black/5 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <SectionLabel>how to brew</SectionLabel>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-black/30">
              recommended for {staticData.howToBrew.method}
            </p>

            {/* Parameter cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-8">
              {staticData.howToBrew.params.map((p) => (
                <div
                  key={p.label}
                  className="bg-white border border-black/5 px-5 py-5"
                >
                  <p className="text-[22px] md:text-[26px] font-light text-[#1a1a1a] tracking-tight leading-none mb-2">
                    {p.value}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.45em] text-black/30">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Brew note */}
            <p className="text-[13px] text-[#1a1a1a]/50 leading-relaxed max-w-xl">
              {staticData.howToBrew.note}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — COLLABORATION (merch, if applicable)
      ═══════════════════════════════════════════════════════ */}
      {!isBean && staticData.collaboration && (
        <section className="bg-white border-b border-black/5 py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex items-start gap-8 md:gap-16">
              {/* Diamond mark */}
              <div className="w-10 h-10 border border-[#8b7355]/20 rotate-45 flex-shrink-0 mt-1 hidden md:block" />
              <div>
                <SectionLabel>collaboration</SectionLabel>
                <h3 className="mt-3 font-[Inter] font-light text-[#1a1a1a] text-2xl md:text-3xl tracking-tight mb-3">
                  {staticData.collaboration}
                </h3>
                <p className="text-[13px] text-[#1a1a1a]/45 leading-relaxed max-w-lg">
                  Made in collaboration with {staticData.collaboration} — a creative partnership around
                  objects and ideas that belong in a considered everyday.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — RELATED PRODUCTS
      ═══════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="bg-white border-t border-black/5 py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <SectionLabel>you may also like</SectionLabel>
            <h2 className="mt-3 font-[Inter] font-light text-[#1a1a1a] text-2xl md:text-3xl tracking-tight mb-10">
              more from {isBean ? "the beans collection" : "common time goods"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => {
                const pSlug = p.slug || slugify(p.name);
                const relImg = p._static
                  ? null
                  : p.product_images?.[0]?.image_url || p.image_url || null;
                // _static prices are already in ₹; Supabase prices are in paise (formatPrice divides by 100)
                const relPrice = p._static ? p.price : (p.price || 0);
                return (
                  <Link key={pSlug} to={`/shop/${pSlug}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-[#F5F2EC] mb-3 relative">
                      {relImg ? (
                        <img
                          src={relImg}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ImagePlaceholder name={p.name} />
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] leading-snug group-hover:text-[#8b7355] transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/40 mt-1">
                      {p._static ? `₹${relPrice}` : formatPrice(relPrice)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
