import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * REFINED MINIMAL LOCATION CARD
 * Layout Update: Symmetrical footer placement for Availability and Visit Space.
 */

export const LuxuryLocationCard = ({ name, area, address, hours, imageUrl, locationLink, id }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      whileInView={isMobile ? "hover" : undefined}
      viewport={{ 
        once: false,
        amount: 0.5, 
        margin: "-20% 0px -20% 0px" 
      }}
      className="relative w-full h-[550px] flex flex-col bg-[#F9F7F2] group cursor-pointer overflow-hidden border border-black/5 rounded-sm"
    >
      {/* 1. ARCHITECTURAL IMAGE SECTION */}
      <motion.div
        variants={{
          rest: { height: "80%" },
          hover: { height: "55%" }
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden bg-gray-100"
      >
        <motion.img
          src={imageUrl}
          alt={name}
          variants={{
            rest: { filter: "grayscale(0%)", scale: 1.05 },
            hover: { filter: "grayscale(0%)", scale: 1, transition: { duration: 1.2 }}
          }}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-6 right-6 z-20">
          <p className="text-[10px] font-[Bai_Jamjuree] text-black/20 tracking-[0.4em] font-bold">
            {id}
          </p>
        </div>
      </motion.div>

      {/* 2. MINIMAL INFO SECTION */}
      <motion.div
        variants={{
          rest: { height: "20%" },
          hover: { height: "45%" }
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full bg-white px-8 pt-8 pb-10 flex flex-col border-t border-black/5"
      >
        {/* Header Block */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-black/80 block font-[Garet_Book] ">
              {area}
            </span>
            <div className="h-[1px] w-6 bg-black/10" />
          </div>
          <h3 className="text-2xl md:text-2xl font-light text-[#1A1A1A] tracking-tighter font-[Bai_Jamjuree] leading-none">
            {name}
          </h3>
        </div>

        {/* Revealed Content with Symmetrical Footer */}
        <motion.div
          variants={{
            rest: { opacity: 0, y: 20 },
            hover: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }
          }}
          className="flex flex-col flex-grow justify-between"
        >
          {/* Address Block */}
          <p className="text-[11px] text-gray-500 font-[Garet_Book] uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
            {address}
          </p>

          {/* Symmetrical Interaction Row */}
          <div className="flex items-end justify-between w-full border-t border-black/5 pt-6">
            {/* Availability - Left Side */}
            <div className="flex flex-col gap-1 border-l border-black/5 ">
              <span className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-bold">Availability</span>
              <p className="text-[11px] text-black/80 font-[Garet_Book] tracking-tight">{hours}</p>
            </div>

            {/* Visit Space - Right Side */}
            <a 
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-end group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-black font-bold italic mb-2 group-hover/link:text-gray-400 transition-colors">
                Visit Space
              </span>
              <motion.div 
                variants={{
                  rest: { width: "15px" },
                  hover: { width: "100%" }
                }}
                className="h-[1.5px] bg-black" 
              />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};