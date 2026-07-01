import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickView } from "../../context/QuickViewContext";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatters";
import toast from "react-hot-toast";

function slugify(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function QuickViewPanel() {
  const { product, close } = useQuickView();
  const { addItem } = useCart();

  // Lock body scroll while open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  function handleAddToCart() {
    if (!product) return;
    addItem({ ...product, quantity: 1 });
    toast.success("added to cart");
    close();
  }

  const slug = product ? (product.slug || slugify(product.name) || product.id) : "";

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />

          {/* Panel — slides from right on md+, slides from bottom on mobile */}
          <motion.div
            key="panel"
            className="fixed z-50 bg-white flex flex-col
              bottom-0 left-0 right-0 rounded-t-2xl max-h-[88svh]
              md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[440px] md:rounded-none md:max-h-none"
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            /* On md+ override to slide from right */
            style={{}}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            {/* md+ slide-from-right override via a nested motion */}
            <MdPanel product={product} slug={slug} close={close} handleAddToCart={handleAddToCart} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Inner panel that handles the responsive animation properly */
function MdPanel({ product, slug, close, handleAddToCart }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Product image */}
      <div className="w-full aspect-[4/3] md:aspect-[4/3.2] flex-shrink-0 bg-[#f5f4f2] overflow-hidden">
        <img
          src={product.image_url || "/hot.avif"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 pt-6 pb-8 md:px-8 md:pt-7 md:pb-10">
        {/* Category */}
        {product.category && (
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-[Inter] mb-3">
            {product.category.replace("-", " ")}
          </p>
        )}

        {/* Name + price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-[Inter] font-light text-[#1a1a1a] text-xl md:text-2xl leading-tight flex-1">
            {product.name}
          </h2>
          <p className="font-[Inter] text-lg text-[#1a1a1a] flex-shrink-0 mt-0.5">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-[#8b7355]/30 mb-5" />

        {/* Description */}
        {product.description && (
          <p className="font-[Inter] text-[13px] md:text-[14px] text-[#1a1a1a]/60 leading-relaxed mb-6 flex-1">
            {product.description}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.3em] font-[Inter] py-4 hover:bg-[#8b7355] transition-colors duration-300"
          >
            add to cart
          </button>
          <Link
            to={`/shop/${slug}`}
            onClick={close}
            className="w-full border border-black/15 text-[#1a1a1a]/60 text-[10px] uppercase tracking-[0.3em] font-[Inter] py-3.5 text-center hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors duration-300"
          >
            view full details
          </Link>
        </div>
      </div>
    </div>
  );
}
