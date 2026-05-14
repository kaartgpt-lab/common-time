import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AboutHero = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax for the background image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  return (
    <section className="relative w-full h-[90vh] md:h-screen bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
      {/* 1. ARCHITECTURAL OVERLAYS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .grain-overlay {
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.03;
          pointer-events: none;
        }
        .aperture-mask {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}} />
      <div className="absolute inset-0 grain-overlay z-40" />

      {/* 2. THE SPLIT APERTURE (Background Image) */}
      <motion.div 
        initial={{ clipPath: "inset(0 50% 0 50%)" }}
        animate={{ clipPath: "inset(0 0% 0 0%)" }}
        transition={{ duration: 2, ease: [0.19, 1, 0.22, 1], delay: 0.5 }}
        className="absolute inset-0 z-0"
      >
        <motion.div style={{ scale: imageScale }} className="w-full h-full">
          <img 
            src="/gallery-marquee/IMG_4545.JPG" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.55]"
            alt="Common Time Architecture"
          />
        </motion.div>
        {/* Subtle radial wash to keep text legible */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#61605e] via-transparent to-black/30 z-10" />
      </motion.div>

      {/* 3. EDITORIAL TYPOGRAPHY */}
      <motion.div 
        style={{ y: textY }}
        className="relative z-30 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 1 }}
          className="flex flex-col items-center"
        >
          {/* Top Identity Label */}
          <span className="font-[Garet_Book] text-[10px] md:text-[12px] uppercase tracking-[0.8em] text-white/70 mb-8 block">
            The Narrative
          </span>

          {/* Main Hero Headline */}
          <h1 className="text-5xl md:text-[5xl] font-light font-[Bai_Jamjuree] text-white leading-[0.9] tracking-tighter mb-10">
            Architecture <br />
            <span className="italic text-white/80">of the Everyday.</span>
          </h1>

          {/* Sub-context */}
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-12 bg-[#8B7355]" />
            <p className="font-[Garet_Book] text-[11px] md:text-[13px] uppercase tracking-[0.4em] text-white font-bold">
              EST. NOV 2025 DELHI
            </p>
            <div className="h-[1px] w-12 bg-[#8B7355]" />
          </div>
        </motion.div>
      </motion.div>

      {/* 4. LINEAR DECOR & COORDINATES */}
      

      {/* Scroll Indicator (Linking to Manifesto) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-12 right-12 md:right-24 z-30 flex flex-col items-center gap-4"
      >
        <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-lr]">
          Scroll to Begin
        </span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-[#8B7355] to-transparent"
        />
      </motion.div>

      {/* Architectural Corner Frames */}
      <div className="absolute top-12 left-12 w-16 h-16 border-t-[1px] border-l-[1px] border-white/10" />
      <div className="absolute bottom-12 right-12 w-16 h-16 border-b-[1px] border-r-[1px] border-white/10" />
    </section>
  );
};

export default AboutHero;