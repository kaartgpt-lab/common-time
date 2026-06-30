import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    left: {
      image: "/hot.avif",
      alt: "specialty coffee",
      label: "the collection",
      heading: "specialty\ncoffee",
      cta: { text: "shop coffee", href: "/shop?category=coffee" },
    },
    right: {
      image: "/gallery-marquee/CT-02.jpg",
      alt: "common time cafe",
      label: "new delhi",
      heading: "find us",
      href: "/locations",
    },
  },
  {
    left: {
      image: "/nutmeg latte.avif",
      alt: "nutmeg latte",
      label: "the ritual",
      heading: "crafted\nwith care",
      cta: { text: "shop all", href: "/shop" },
    },
    right: {
      image: "/locations/lodhi.jpg",
      alt: "common time lodhi colony",
      label: "lodhi colony",
      heading: "visit us",
      href: "/locations/lodhi-colony",
    },
  },
];

export default function ProductBanner() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const goTo = (index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 600);
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  // Auto-advance every 5s
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  // Swipe support
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slide = SLIDES[current];

  return (
    <section
      className="w-full overflow-hidden relative"
      style={{ height: "clamp(400px, 65vw, 720px)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
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

            {/* Left panel */}
            <Link to={s.left.cta.href} className="relative flex-[3] overflow-hidden group">
              <img
                src={s.left.image}
                alt={s.left.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10 z-10">
                <p className="text-[9px] uppercase tracking-[0.45em] text-white/50 font-[Garet_Book] mb-3">
                  {s.left.label}
                </p>
                <h2 className="text-white font-[Bai_Jamjuree] font-light text-2xl md:text-4xl leading-tight mb-5 whitespace-pre-line">
                  {s.left.heading}
                </h2>
                <span className="inline-flex items-center gap-2 border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all duration-300 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-[Garet_Book]">
                  {s.left.cta.text}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px bg-white/10 flex-shrink-0" />

            {/* Right panel */}
            <Link to={s.right.href} className="relative flex-[2] overflow-hidden group">
              <img
                src={s.right.image}
                alt={s.right.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10 z-10">
                <p className="text-[9px] uppercase tracking-[0.45em] text-white/50 font-[Garet_Book] mb-2">
                  {s.right.label}
                </p>
                <h3 className="text-white font-[Bai_Jamjuree] font-light text-xl md:text-2xl leading-tight">
                  {s.right.heading}
                </h3>
              </div>
            </Link>

          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
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
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/15 w-full z-20">
        <div
          key={current}
          className="h-full bg-white/50"
          style={{ animation: "progress 5s linear forwards" }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
