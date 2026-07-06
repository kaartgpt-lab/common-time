import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    left: {
      image: "/hero/hero1.jpg",
      alt: "specialty coffee",
      label: "the collection",
      heading: "specialty\ncoffee",
      cta: { text: "shop coffee", href: "/shop?category=coffee" },
    },
    right: {
      image: "/hero/hero1-right.jpg",
      alt: "common time cafe",
      label: "new delhi",
      heading: "find us",
      href: "/locations",
    },
  },
  {
    left: {
      image: "/hero/hero2.jpg",
      alt: "crafted with care",
      label: "the ritual",
      heading: "crafted\nwith care",
      cta: { text: "shop all", href: "/shop" },
    },
    right: {
      image: "/hero/hero2-right.jpg",
      alt: "common time space",
      label: "our spaces",
      heading: "visit us",
      href: "/locations",
    },
  },
];

export default function ProductBanner() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const goTo = (index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 600);
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [current]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    // Only trigger swipe if horizontal movement dominates (not a scroll)
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) dx > 0 ? next() : prev();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className="w-full overflow-hidden relative"
      style={{ height: "clamp(520px, 90svh, 720px)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide track */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * (100 / SLIDES.length)}%)`,
          transition: "transform 0.6s cubic-bezier(0.77,0,0.175,1)",
          width: `${SLIDES.length * 100}%`,
        }}
      >
        {SLIDES.map((s, i) => (
          <div key={i} className="flex h-full" style={{ width: `${100 / SLIDES.length}%` }}>

            {/* Left panel — full width on mobile, 3/5 on desktop */}
            <Link
              to={s.left.cta.href}
              className="relative w-full md:flex-[3] overflow-hidden group"
            >
              <img
                src={s.left.image}
                alt={s.left.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10 w-full">
                <p className="text-[9px] uppercase tracking-[0.45em] text-white/50 font-[Inter] mb-3">
                  {s.left.label}
                </p>
                <h2 className="text-white font-[Inter] font-light text-3xl md:text-4xl leading-tight mb-6 whitespace-pre-line">
                  {s.left.heading}
                </h2>
                <span className="inline-flex items-center gap-2 border border-white/40 text-white/90 px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-[Inter]">
                  {s.left.cta.text}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Divider — desktop only */}
            <div className="hidden md:block w-px bg-white/10 flex-shrink-0" />

            {/* Right panel — desktop only */}
            <Link to={s.right.href} className="hidden md:block relative md:flex-[2] overflow-hidden group">
              <img
                src={s.right.image}
                alt={s.right.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10 z-10">
                <p className="text-[9px] uppercase tracking-[0.45em] text-white/50 font-[Inter] mb-2">
                  {s.right.label}
                </p>
                <h3 className="text-white font-[Inter] font-light text-xl md:text-2xl leading-tight">
                  {s.right.heading}
                </h3>
              </div>
            </Link>

          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "24px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full z-20">
        <div
          key={current}
          className="h-full bg-white/40"
          style={{ animation: "ct-progress 5s linear forwards" }}
        />
      </div>

      <style>{`
        @keyframes ct-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
