import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * RevealWord handles the individual word "filling" effect.
 */
const RevealWord = ({ children, progress, index, totalWords }) => {
  // Calculate the window of progress for this specific word
  const start = index / totalWords;
  const end = (index + 1) / totalWords;
  
  // Local progress for this specific word (0 to 1)
  const wordProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);

  return (
    <span className="relative inline-block mr-[0.3em] whitespace-nowrap">
      {/* Background layer: The 'Muted' state (White with low opacity) */}
      <span className="text-white/20">
        {children}
      </span>
      {/* Foreground layer: The 'Active' state that reveals horizontally */}
      <span 
        className="absolute top-0 left-0 text-[#fcf7e6] overflow-hidden"
        style={{ 
            width: `${wordProgress * 100}%`, 
            transition: 'width 0.1s linear' // Keeps the "fill" smooth
        }}
      >
        {children}
      </span>
    </span>
  );
};

export default function CenteredRevealSection({
  headline = "WatchHouse is a slow take on instant gratification. Thoughtful pours, rare flavour profiles and paraphernalia for your daily cup.",
  linkText,
  linkHref,
}) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start animation when the section enters the viewport
      // and finish when it's near the top
      const triggerPoint = viewportHeight; 
      const elementTop = rect.top;
      const totalHeight = rect.height + viewportHeight;

      const progress = Math.min(
        Math.max((triggerPoint - elementTop) / (viewportHeight * 1.5), 0),
        1
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allWords = headline.split(" ");

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-50vh flex flex-col items-center justify-center bg-stone-900 px-6 lg:py-32 py-20"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Large Centered Reveal Text */}
        <h2 className="text-5xl md:text-5xl lg:text-5xl font-[Bai_Jamjuree] leading-[1.3] md:leading-[1.4] tracking-tight">
          {allWords.map((word, i) => (
            <RevealWord 
              key={i} 
              index={i} 
              totalWords={allWords.length} 
              progress={scrollProgress}
            >
              {word}
            </RevealWord>
          ))}
        </h2>

        {/* Call to Action */}
        {linkText && linkHref && (
          <div className="mt-16 font-[Garet_Book]">
            <Link
              to={linkHref}
              className="inline-block px-8  py-3 border border-[#fcf7e6] text-[#fcf7e6] text-xs font-[Garet_Book] uppercase tracking-[0.2em] transition-all hover:bg-[#fcf7e6] hover:text-stone-900"
            >
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}