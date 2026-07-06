import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { formatPrice, slugify } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { BEAN_CONTENT, MERCH_CONTENT } from "../data/productContent";
import toast from "react-hot-toast";

const GRIND_OPTIONS = ["espresso", "filter", "coarse", "medium", "fine"];

/* ── Placeholder when no image ─────────────────────────── */
function ImagePlaceholder({ name }) {
  return (
    <div className="w-full h-full bg-[#F5F2EC] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border border-[#8b7355]/30 rotate-45" />
      <p className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355]/50 font-[Inter] text-center px-4">
        {name}
      </p>
    </div>
  );
}

/* ── Characteristic row ─────────────────────────────────── */
function CharRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-4 py-3 border-b border-black/5 last:border-0">
      <span className="text-[9px] uppercase tracking-[0.35em] text-black/30 font-[Inter] w-20 flex-shrink-0">
        {label}
      </span>
      <span className="text-[12px] text-[#1a1a1a] font-[Inter] leading-snug">
        {value}
      </span>
    </div>
  );
}

/* ── Spec row (merch) ───────────────────────────────────── */
function SpecRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-black/5 last:border-0">
      <span className="text-[9px] uppercase tracking-[0.35em] text-black/30 font-[Inter] w-20 flex-shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-[12px] text-[#1a1a1a] font-[Inter] leading-relaxed">
        {value}
      </span>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState("espresso");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
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
        // Initialise weight selection from static content
        const beanMeta = BEAN_CONTENT[data.slug || slugify(data.name)];
        if (beanMeta) {
          setSelectedWeight(beanMeta.packaging.defaultSize);
        }
        const { data: rel } = await supabase
          .from("products")
          .select(`*, product_images (*)`)
          .eq("is_active", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4);
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

  /* ── Loading skeleton ─────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafaf8] font-[Inter]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-20">
            <div className="aspect-[4/5] bg-[#f0ede8] animate-pulse rounded-sm" />
            <div className="space-y-5 pt-4">
              <div className="h-2 w-16 bg-[#f0ede8] animate-pulse" />
              <div className="h-8 w-2/3 bg-[#f0ede8] animate-pulse" />
              <div className="h-4 w-full bg-[#f0ede8] animate-pulse" />
              <div className="h-4 w-4/5 bg-[#f0ede8] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Not found ────────────────────────────────────────── */
  if (!product) {
    return (
      <main className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-5">
        <div className="w-8 h-8 border border-[#8b7355]/30 rotate-45" />
        <p className="font-[Inter] text-[#1a1a1a]/40 text-sm">product not found.</p>
        <Link to="/shop" className="text-[9px] uppercase tracking-[0.35em] font-[Inter] text-[#8b7355]">
          ← back to shop
        </Link>
      </main>
    );
  }

  const productSlug = product.slug || slugify(product.name);
  const isBean = product.category === "beans";
  const beanMeta = isBean ? BEAN_CONTENT[productSlug] : null;
  const merchMeta = !isBean ? MERCH_CONTENT[productSlug] : null;

  /* Displayed price — updates with weight selection for beans */
  let displayedPrice = product.price; // paise from Supabase
  if (beanMeta && selectedWeight) {
    const staticPrice = beanMeta.packaging.prices[selectedWeight];
    if (staticPrice != null) displayedPrice = staticPrice * 100; // convert ₹ to paise
  }

  /* Images */
  const images =
    product.product_images?.length > 0
      ? [...product.product_images].sort((a, b) => a.position - b.position)
      : product.image_url
      ? [{ image_url: product.image_url }]
      : [];

  const hasImage = images.length > 0;

  /* Tasting notes (beans from static, or from Supabase fallback) */
  const tastingNotes =
    beanMeta?.tastingNotes ||
    (() => {
      const raw = product.tasting_notes || product.notes || product.flavor_notes;
      if (!raw) return [];
      return Array.isArray(raw) ? raw : raw.split(",").map((n) => n.trim());
    })();

  const description = beanMeta?.intro || merchMeta?.description || product.description;

  return (
    <main className="min-h-screen bg-[#fafaf8] font-[Inter]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 md:pt-12">
        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/30 font-[Inter]">
          <Link to="/" className="hover:text-[#8b7355] transition-colors">home</Link>
          <span>·</span>
          <Link to="/shop" className="hover:text-[#8b7355] transition-colors">shop</Link>
          <span>·</span>
          <span className="text-[#1a1a1a]/50">{product.name}</span>
        </nav>
      </div>

      {/* ── Main layout ────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-20 md:pt-10 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 fade-up">

          {/* ═══ LEFT: Image gallery ══════════════════════ */}
          <div>
            {/* Main image */}
            <div className="aspect-[4/5] overflow-hidden bg-[#F5F2EC] relative">
              {hasImage ? (
                <img
                  src={images[activeImage]?.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <ImagePlaceholder name={product.name} />
              )}

              {/* Bean roast badge */}
              {beanMeta?.roast && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5">
                  <span className="text-[8px] uppercase tracking-[0.35em] text-[#8b7355] font-[Inter]">
                    {beanMeta.roast} roast
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      activeImage === i
                        ? "ring-1 ring-[#1a1a1a] opacity-100"
                        : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-16 h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Product info ══════════════════════ */}
          <div className="flex flex-col lg:pt-1">

            {/* Category + subtitle */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[9px] uppercase tracking-[0.45em] text-[#8b7355] font-[Inter]">
                {isBean ? "specialty coffee" : product.category}
              </span>
              {(beanMeta?.subtitle || isBean) && (
                <>
                  <span className="w-4 h-px bg-[#8b7355]/30" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-black/25 font-[Inter]">
                    {beanMeta?.subtitle}
                  </span>
                </>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-[Inter] font-light text-[#1a1a1a] text-3xl md:text-4xl leading-tight tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Origin line (beans) */}
            {beanMeta?.characteristics?.origin && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/30 mb-5 font-[Inter]">
                {beanMeta.characteristics.origin}
              </p>
            )}

            {/* Description */}
            <p className="text-[13px] md:text-[14px] text-[#1a1a1a]/55 leading-relaxed mb-7 font-[Inter]">
              {description || product.description}
            </p>

            {/* ── BEANS: tasting notes + characteristics ── */}
            {beanMeta && (
              <>
                {/* Tasting notes */}
                {tastingNotes.length > 0 && (
                  <div className="mb-7">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-black/25 font-[Inter] mb-3">
                      tasting notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="text-[9px] uppercase tracking-[0.2em] text-[#8b7355] border border-[#8b7355]/25 px-3 py-1.5 font-[Inter] bg-[#8b7355]/5"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Characteristics */}
                <div className="mb-7 border-t border-black/5">
                  <CharRow label="origin" value={beanMeta.characteristics.origin} />
                  <CharRow label="varietal" value={beanMeta.characteristics.varietal} />
                  <CharRow label="process" value={beanMeta.characteristics.process} />
                  <CharRow label="acidity" value={beanMeta.characteristics.acidity} />
                  <CharRow label="body" value={beanMeta.characteristics.body} />
                </div>

                {/* Weight + price */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-black/25 font-[Inter]">
                      package size
                    </p>
                    <p className="font-[Inter] text-xl text-[#1a1a1a] tracking-tight">
                      {displayedPrice ? `₹${Math.round(displayedPrice / 100)}` : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {beanMeta.packaging.sizes.map((w) => {
                      const hasPrice = beanMeta.packaging.prices[w] != null;
                      return (
                        <button
                          key={w}
                          onClick={() => hasPrice && setSelectedWeight(w)}
                          disabled={!hasPrice}
                          className={`text-[10px] uppercase tracking-[0.2em] font-[Inter] px-5 py-2.5 border transition-all duration-200 ${
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
                              coming soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grind */}
                <div className="mb-8">
                  <p className="text-[8px] uppercase tracking-[0.45em] text-black/25 font-[Inter] mb-3">
                    grind
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {beanMeta.grindOptions.concat(["coarse", "medium", "fine"]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrind(g)}
                        className={`text-[9px] uppercase tracking-[0.15em] font-[Inter] px-4 py-2 border transition-all duration-200 ${
                          selectedGrind === g
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-white text-[#1a1a1a]/45 border-black/12 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── MERCH: specs + size ──────────────────── */}
            {merchMeta && (
              <>
                {/* Specs */}
                {merchMeta.specs.length > 0 && (
                  <div className="mb-7 border-t border-black/5">
                    {merchMeta.specs.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                )}

                {/* Size selector (apparel) */}
                {merchMeta.sizeOptions && (
                  <div className="mb-7">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-black/25 font-[Inter] mb-3">
                      size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {merchMeta.sizeOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-11 h-11 text-[10px] uppercase tracking-[0.1em] font-[Inter] border transition-all duration-200 ${
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

                {/* Collaboration credit */}
                {merchMeta.collaboration && (
                  <div className="mb-7 flex items-center gap-3">
                    <div className="w-4 h-px bg-[#8b7355]/40" />
                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#8b7355]/70 font-[Inter]">
                      in collaboration with {merchMeta.collaboration}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="mb-8">
                  <p className="font-[Inter] text-2xl text-[#1a1a1a] tracking-tight">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </>
            )}

            {/* ── Add to cart ─────────────────────────────── */}
            <div className="flex gap-3 mt-auto">
              {/* Quantity */}
              <div className="flex items-center border border-black/12 bg-white flex-shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-base"
                >
                  −
                </button>
                <span className="w-8 text-center text-[12px] font-[Inter] text-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-11 h-12 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-base"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#1a1a1a] text-white text-[9px] uppercase tracking-[0.4em] font-[Inter] hover:bg-[#8b7355] transition-colors duration-300"
              >
                add to cart
              </button>
            </div>

            {/* Shipping note */}
            <p className="text-[9px] text-[#1a1a1a]/25 mt-4 font-[Inter] tracking-[0.1em]">
              free shipping on orders above ₹999 · ships within 2–3 days
            </p>

          </div>
        </div>

        {/* ── Read More (beans) ─────────────────────────── */}
        {beanMeta?.readMore && (
          <div className="mt-20 md:mt-28 border-t border-black/5 pt-14 max-w-2xl">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#8b7355] font-[Inter] mb-6">
              about this coffee
            </p>
            <p className="font-[Inter] font-light text-[#1a1a1a]/60 text-[15px] md:text-base leading-[1.85]">
              {beanMeta.readMore}
            </p>
          </div>
        )}
      </div>

      {/* ── Related products ──────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-white border-t border-black/5 py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#8b7355] font-[Inter] mb-2">
              you may also like
            </p>
            <h2 className="font-[Inter] font-light text-[#1a1a1a] text-2xl mb-10 tracking-tight">
              more from {isBean ? "the beans collection" : "common time goods"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => {
                const pSlug = p.slug || slugify(p.name);
                const relImg = p.product_images?.[0]?.image_url || p.image_url;
                return (
                  <Link key={p.id} to={`/shop/${pSlug}`} className="group block">
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
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a] font-[Inter] leading-snug group-hover:text-[#8b7355] transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/40 font-[Inter] mt-1">
                      {formatPrice(p.price)}
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
