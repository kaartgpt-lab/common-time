import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductGrid({ products, columns = 4 }) {
  const { addItem } = useCart();
  const scrollRef = useRef(null);

  if (!products?.length) return null;

  const gridCols = 
    columns === 4 ? "lg:grid-cols-4" : 
    columns === 2 ? "lg:grid-cols-2" : 
    "lg:grid-cols-3";

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const moveBy = clientWidth * 0.85; 
      const scrollTo = direction === 'left' ? scrollLeft - moveBy : scrollLeft + moveBy;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .group:hover .flip-card-inner { transform: rotateY(180deg); }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.25rem;
        }
        .flip-card-back { transform: rotateY(180deg); }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Mobile Nav Buttons */}
      <div className="flex sm:hidden absolute top-1/2 -translate-y-1/2 w-full justify-between px-2 z-20 pointer-events-none">
        <button onClick={() => scroll('left')} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-black/5 active:scale-90 transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button onClick={() => scroll('right')} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-black/5 active:scale-90 transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className={`
          flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth
          sm:grid sm:grid-cols-2 ${gridCols} 
          gap-6 md:gap-8 pb-4
          /* Added horizontal padding for mobile carousel breathing room */
          px-6 sm:px-0 
        `}
        /* scroll-padding-inline ensures the snap-center respects our side padding */
        style={{ scrollPaddingInline: '24px' }}
      >
        {products.map((product) => {
          const slug = product.slug || slugify(product.name) || product.id;

          return (
            <div 
              key={product.id} 
              className="group flex-none w-[80vw] sm:w-full snap-center perspective-1000 h-[380px]"
            >
              <div className="flip-card-inner">
                {/* FRONT SIDE */}
                <div className="flip-card-front bg-gray-100 overflow-hidden">
                  <img src={product.image_url || "/hot.jpg"} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 font-[Bai_Jamjuree]">
                      {product.name}
                    </p>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="flip-card-back bg-[#F9F7F2] p-6 flex flex-col justify-center items-start border border-gray-100 shadow-2xl">
                  <h3 className="text-xl font-light text-gray-900 mb-1.5 uppercase tracking-tight leading-tight font-[Bai_Jamjuree]">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-600 mb-3 leading-relaxed font-light font-[Garet_Book]">
                    {product.description?.slice(0, 90)}...
                  </p>
                  <p className="text-lg font-medium text-gray-900 mb-6 font-[Bai_Jamjuree]">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex flex-col gap-3 w-full mt-auto">
                    <button onClick={(e) => { e.preventDefault(); addItem(product.id, 1); toast.success(`${product.name} added to cart`); }}
                      className="w-full py-2.5 bg-[#493627] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors duration-300 font-[Garet_Book]">
                      Add to Cart
                    </button>
                    <Link to={`/shop/${slug}`} className="text-center text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-transparent hover:border-gray-400 pb-0.5 transition-all font-[Garet_Book]">
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Invisible spacer div to allow the last card to snap to the center/leave the edge */}
        <div className="flex-none w-1 sm:hidden" aria-hidden="true" />
      </div>
    </div>
  );
}