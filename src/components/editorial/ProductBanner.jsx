import { Link } from "react-router-dom";

export default function ProductBanner({ products = [] }) {
  if (!products.length) return null;

  // Pick first 3 products that have an image
  const panels = products.filter((p) => p.image_url).slice(0, 3);
  if (!panels.length) return null;

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row w-full" style={{ height: "clamp(320px, 60vw, 680px)" }}>
        {panels.map((product, i) => (
          <Link
            key={product.id}
            to={`/shop/${product.slug}`}
            className="relative flex-1 overflow-hidden group"
            style={{ minWidth: 0 }}
          >
            {/* Image */}
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Thin divider between panels (not on last) */}
            {i < panels.length - 1 && (
              <div className="hidden md:block absolute top-0 right-0 w-px h-full bg-white/15 z-10" />
            )}

            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 p-5 md:p-7 z-10">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-[Garet_Book] mb-1.5">
                {product.category}
              </p>
              <h3 className="text-white font-[Bai_Jamjuree] font-light text-lg md:text-xl leading-tight">
                {product.name}
              </h3>
              <span className="inline-flex items-center gap-1.5 mt-3 text-[9px] uppercase tracking-[0.3em] text-white/60 font-[Garet_Book] group-hover:text-white/90 transition-colors duration-300">
                view
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
