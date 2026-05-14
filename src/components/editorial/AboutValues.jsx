import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutPillars = () => {
  const pillars = [
    {
      label: "Foundation",
      title: "Sourcing",
      description: "Partnering directly with farmers to ensure quality and equity in every single harvest.",
      bgColor: "bg-white", // Pure light
      icon: <SourcingIcon />,
      delay: 0
    },
    {
      label: "Architecture",
      title: "Space",
      description: "Our locations are designed to inspire focus and tranquility through minimal aesthetics.",
      bgColor: "bg-[#F0F0F0]", // Soft stone
      icon: <SpaceIcon />,
      delay: 0.15
    },
    {
      label: "Connection",
      title: "Community",
      description: "Building meaningful connections over every cup, fostering a space for shared rituals.",
      bgColor: "bg-[#EAE3D9]", // Warm vellum
      icon: <CommunityIcon />,
      delay: 0.3
    }
  ];

  return (
    <section className="relative w-full bg-[#FAF7F2] py-32 px-6 md:px-16 overflow-hidden">
      {/* 1. KINETIC TEXTURE (Soft morning grain) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="max-w-7xl mx-auto">
        
        {/* 2. THE BENTO GRID (Equal Height Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch mb-8 md:mb-24">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: pillar.delay }}
              // Interactive 3D tilt effect on hover
              whileHover={{ 
                y: -10,
                rotateX: 2, 
                rotateY: 2,
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              className="relative group h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`relative ${pillar.bgColor} h-full p-10 md:p-14 border border-black/5 rounded-sm shadow-[0_30px_60px_-15px_rgba(139,115,85,0.05)] flex flex-col justify-between overflow-hidden group`}>
                
                {/* Internal Mask for the Icon Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                     style={{ background: 'radial-gradient(circle at 50% -20%, rgba(139,115,85,0.08) 0%, transparent 70%)' }} />

                <div className="relative z-10">
                  {/* Label & Linear detail */}
                  <div className="flex items-center gap-4 mb-10 overflow-hidden">
                    <span className="font-[Garet_Book] text-[10px] uppercase tracking-[0.6em] text-[#8B7355] font-bold italic whitespace-nowrap">
                      {pillar.label}
                    </span>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: pillar.delay + 0.5, duration: 1 }}
                      className="h-px bg-[#8B7355]/20" 
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4 mb-12">
                    <h3 className="text-3xl font-light font-[Bai_Jamjuree] text-[#1A1A1A] tracking-tighter leading-none">
                      {pillar.title}
                    </h3>
                    <p className="font-[Garet_Book] text-[13px] md:text-sm text-gray-500 leading-relaxed max-w-[280px]">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* THE PLAYFUL ICON (Anchored Bottom Right) */}
                <div className="relative z-10 flex justify-end mt-auto origin-bottom-right" style={{ translateZ: 20 }}>
                  <div className="transition-transform duration-700 ease-[0.19,1,0.22,1] group-hover:scale-110">
                    {pillar.icon}
                  </div>
                </div>

                {/* Architectural Corner Brackets (Reveal on hover) */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#8B7355]/0 group-hover:border-[#8B7355]/30 transition-all duration-700" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#8B7355]/0 group-hover:border-[#8B7355]/30 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. THE CALLS TO ACTION */}
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 1.2 }}
  className="relative z-20 w-full flex justify-center md:pt-12 border-t border-black/5"
>
  {/* Horizontal Row: Forced flex-row on all screens */}
  <div className="flex flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-md">
    
    {/* HOME CTA */}
    <Link to="/" className="flex-1">
      <motion.button
        whileHover={{ backgroundColor: "#8B7355" }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#1A1A1A] text-white py-5 px-4 rounded-sm transition-colors duration-500 flex items-center justify-center group"
      >
        <span className="font-[Bai_Jamjuree] text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold">
          Home
        </span>
      </motion.button>
    </Link>

    {/* SHOP CTA */}
    <Link to="/shop" className="flex-1">
      <motion.button
        whileHover={{ backgroundColor: "#8B7355" }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#1A1A1A] text-white py-5 px-4 rounded-sm transition-colors duration-500 flex items-center justify-center group"
      >
        <span className="font-[Bai_Jamjuree] text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold">
          Shop
        </span>
      </motion.button>
    </Link>

  </div>
</motion.div>
      </div>
    </section>
  );
};

// --- MICRO-COMPONENTS ---

// 1. Kinetic Sourcing Icon (Coffee leaf & link)
const SourcingIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 group-hover:opacity-100 transition-opacity">
    <circle cx="30" cy="30" r="29" stroke="#8B7355" strokeWidth="1" strokeDasharray="2 4"/>
    <path className="group-hover:translate-y-[-2px] transition-transform duration-700" d="M30 18C33 22 35 25 35 28C35 32 32.7614 34 30 34C27.2386 34 25 32 25 28C25 25 27 22 30 18Z" fill="#8B7355" fillOpacity="0.2" stroke="#8B7355" strokeWidth="1.5"/>
    <path className="group-hover:translate-y-[2px] transition-transform duration-700" d="M18 38C22 41 25 43 28 43C32 43 34 40.7614 34 38C34 35.2386 32 33 28 33C25 33 22 35 18 38Z" fill="#8B7355" fillOpacity="0.1" stroke="#8B7355" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M38 38L45 45M45 45L42 45M45 45L45 42" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 2. Kinetic Space Icon (Aperture & linear focus)
const SpaceIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 group-hover:opacity-100 transition-opacity">
    <rect x="15" y="15" width="30" height="30" stroke="#1A1A1A" strokeWidth="1" className="group-hover:rotate-90 origin-center transition-transform duration-1000"/>
    <line x1="30" y1="5" x2="30" y2="55" stroke="#8B7355" strokeWidth="1" strokeDasharray="1 5"/>
    <line x1="5" y1="30" x2="55" y2="30" stroke="#8B7355" strokeWidth="1" strokeDasharray="1 5"/>
    <circle cx="30" cy="30" r="8" fill="white" stroke="#1A1A1A" strokeWidth="1.5"/>
  </svg>
);

// 3. Kinetic Community Icon ( intersecting shared ritual)
const CommunityIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 group-hover:opacity-100 transition-opacity">
    <circle cx="22" cy="30" r="12" stroke="#1A1A1A" strokeWidth="1" fill="#1A1A1A" fillOpacity="0.05"/>
    <circle cx="38" cy="30" r="12" stroke="#8B7355" strokeWidth="1" fill="#8B7355" fillOpacity="0.05" className="group-hover:translate-x-[-4px] transition-transform duration-700"/>
    <path d="M26 30C26 27.7909 27.7909 26 30 26V26C32.2091 26 34 27.7909 34 30V30C34 32.2091 32.2091 34 30 34V34C27.7909 34 26 32.2091 26 30V30Z" fill="white" stroke="#8B7355" strokeWidth="1" className="group-hover:scale-125 origin-center transition-transform duration-500"/>
  </svg>
);

// 4. Symmetrical CTA link
const CTALink = ({ to, label }) => (
  <Link to={to} className="group relative flex flex-col items-center">
    <span className="font-[Garet_Book] text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] font-black italic mb-3 transition-colors group-hover:text-[#8B7355]">
      {label}
    </span>
    {/* The Self-Drawing Endless Line */}
    <motion.div 
      variants={{
        rest: { width: "15px" },
        hover: { width: "100px" }
      }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="h-[1.5px] bg-[#8B7355] rounded-full" 
    />
  </Link>
);

export default AboutPillars;