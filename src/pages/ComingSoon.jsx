import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <section className="relative w-full h-screen bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
      {/* BRAND ARCHITECTURAL STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shiny {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shiny-text {
          background: linear-gradient(
            120deg, 
            rgba(26, 26, 26, 1) 45%, 
            rgba(139, 115, 85, 0.7) 50%, 
            rgba(26, 26, 26, 1) 55%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny 8s linear infinite;
        }
        .grain-overlay {
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.03;
          pointer-events: none;
        }
      `}} />
      
      {/* Tactile Texture Layer */}
      <div className="absolute inset-0 grain-overlay z-40 pointer-events-none" />

      {/* BACKGROUND ATMOSPHERE: The Viewfinder Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#FAF7F2]/90 z-10" />
        <img 
          src="/locations/IMG_4886.avif" 
          className="w-full h-full object-cover grayscale brightness-110 opacity-30 scale-110 blur-sm"
          alt="Atmospheric Background"
        />
      </div>

      {/* CONTENT: THE CURATED INTERVAL */}
      <div className="relative z-50 text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center"
        >
          {/* Top Brand Label */}
          <span className="font-[Garet_Book] text-[10px] md:text-[12px] uppercase tracking-[0.6em] text-[#8B7355] font-bold mb-8 block italic">
            Common Time
          </span>

          {/* Main Shimmer Heading */}
          <h1 className="text-5xl md:text-8xl font-light font-[Bai_Jamjuree] tracking-tighter leading-[0.9] text-[#1A1A1A] mb-10">
            Coming <br />
            <span className="shiny-text">Soon.</span>
          </h1>

          {/* Narrative / Context */}
          <div className="max-w-md mx-auto space-y-6 mb-16">
            <p className="font-[Garet_Book] text-sm md:text-base text-gray-500 leading-relaxed italic">
              "We are currently refining the architecture of this space. 
              A new perspective on the Common Time experience is arriving soon."
            </p>
            
            {/* Minimalist Separator */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-black/10" />
              
              <div className="h-[1px] w-8 bg-black/10" />
            </div>
          </div>

          {/* Return Action */}
          <Link to="/">
            <motion.div 
              whileHover="hover"
              initial="rest"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span className="font-[Garet_Book] text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] font-black italic mb-3 transition-colors group-hover:text-[#8B7355]">
                Return to Homepage.
              </span>
              <motion.div 
                variants={{
                  rest: { width: "20px" },
                  hover: { width: "60px" }
                }}
                className="h-[1px] bg-[#8B7355] transition-all duration-500" 
              />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Architectural Corner Frames */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-black/5 hidden md:block" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-black/5 hidden md:block" />
    </section>
  );
};

export default ComingSoon;