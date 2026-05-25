import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, slugify } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [rippling, setRippling] = useState(false);

  const imageUrl = product.image_url || product.image || "/newshero.jpg";
  const hoverImageUrl = product.image_url_hover || null;
  const hasSecondImage = !!hoverImageUrl;
  const slug = product.slug || slugify(product.name) || product.id;

  const delay = `${(index % 8) * 60}ms`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
    toast.success("Added to cart");
    // trigger micro-animations
    setRippling(true);
    setAdded(true);
    setTimeout(() => setRippling(false), 500);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <style>{`
        /* ── Card entrance ── */
        @keyframes ct-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ct-card-wrap {
          opacity: 0;
          animation: ct-fadeUp 0.48s ease forwards;
        }

        /* ── Card container ── */
        .ct-card {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          transition: transform 0.36s cubic-bezier(0.25,0.46,0.45,0.94),
                      box-shadow 0.36s ease;
        }
        .ct-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 56px rgba(0,0,0,0.09);
        }

        /* ── Image wrapper ── */
        .ct-img-wrap {
          position: relative;
          overflow: hidden;
          background: #efefed;
          flex-shrink: 0;
        }
        .ct-img-primary,
        .ct-img-secondary {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.52s ease;
        }
        .ct-img-secondary { opacity: 0; }

        /* Crossfade only when second image exists */
        .has-two-images:hover .ct-img-primary  { opacity: 0; }
        .has-two-images:hover .ct-img-secondary { opacity: 1; }

        /* Subtle zoom for single-image cards */
        .ct-img-primary {
          transition: opacity 0.52s ease, transform 0.55s ease;
        }
        .ct-card:hover .ct-img-primary { transform: scale(1.03); }
        .has-two-images:hover .ct-img-primary { transform: scale(1); }

        /* Gold sweep at bottom of image */
        .ct-gold-line {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #8b7355;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94);
          z-index: 5;
        }
        .ct-card:hover .ct-gold-line { transform: scaleX(1); }

        /* ── ATC button — always visible ── */
        .ct-atc-btn {
          position: relative;
          overflow: hidden;
          width: 100%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 12px;
          background: #1a1a1a;
          transition: background 0.25s ease;
          outline: none;
          flex-shrink: 0;
        }
        .ct-atc-btn:hover  { background: #8b7355; }
        .ct-atc-btn.is-added { background: #2d2420; }
        .ct-atc-btn:focus-visible { outline: 2px solid #8b7355; outline-offset: -2px; }

        /* Click ripple */
        @keyframes ct-ripple {
          0%   { transform: scale(0); opacity: 0.35; }
          100% { transform: scale(4); opacity: 0; }
        }
        .ct-ripple {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(139,115,85,0.5);
          pointer-events: none;
          animation: ct-ripple 0.5s ease-out forwards;
        }

        /* Button icon + label bounce on click */
        @keyframes ct-bounce {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.82); }
          65%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .ct-atc-inner {
          display: flex;
          align-items: center;
          gap: 7px;
          transition: transform 0.1s ease;
        }
        .ct-atc-btn.is-rippling .ct-atc-inner {
          animation: ct-bounce 0.42s cubic-bezier(0.36,0.07,0.19,0.97) forwards;
        }

        /* Checkmark draw-on */
        @keyframes ct-draw {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0; }
        }
        .ct-check {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: ct-draw 0.35s ease 0.05s forwards;
        }
      `}</style>

      <div className="ct-card-wrap" style={{ animationDelay: delay }}>
        <div className="ct-card">

          {/* ── Image ── */}
          <Link to={`/shop/${slug}`} className="block">
            <div className={`ct-img-wrap aspect-[3/4] w-full ${hasSecondImage ? "has-two-images" : ""}`}>
              <img
                src={imageUrl}
                alt={product.name}
                className="ct-img-primary"
                loading="lazy"
              />
              {hasSecondImage && (
                <img
                  src={hoverImageUrl}
                  alt={product.name}
                  className="ct-img-secondary"
                  loading="lazy"
                />
              )}
              <div className="ct-gold-line" />
              {product.tag && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-[8px] uppercase tracking-[0.25em] text-black/55 px-2 py-1 font-[Garet_Book]">
                    {product.tag}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* ── Info block ── */}
          <Link to={`/shop/${slug}`} className="block px-2.5 pt-3 pb-3 flex-1">
            {product.category && (
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#8b7355] font-[Garet_Book] font-semibold mb-1">
                {product.category.replace(/_/g, " ")}
              </span>
            )}
            <h3 className="text-[13px] font-light font-[Bai_Jamjuree] text-black/85 leading-snug line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-end pt-2 border-t border-black/5">
              <span className="text-[#8b7355] text-[11px] leading-none">→</span>
            </div>
          </Link>


        </div>
      </div>
    </>
  );
}