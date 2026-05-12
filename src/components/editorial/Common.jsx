import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";

const FounderSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 1. Smooth Perspective Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // 2. Parallax and Floating Effects
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  // 3. Magnetic Cursor Tracking
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothCursorX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // For 3D Tilt
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);

    // For Custom Cursor
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#FAF7F2] overflow-hidden flex items-center justify-center py-24 px-6 cursor-none"
    >
      {/* BRAND STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes steam {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-150px) translateX(20px) scale(2); opacity: 0; }
        }
        .steam-wisp { animation: steam 12s infinite linear; filter: blur(20px); }
        .shiny-text {
          background: linear-gradient(120deg, #1A1A1A 45%, #8B7355 50%, #1A1A1A 55%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny 10s linear infinite;
        }
      `}} />

      {/* --- CUSTOM MAGNETIC CURSOR --- */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-[#8B7355] rounded-full pointer-events-none z-[100] flex items-center justify-center"
        style={{ x: smoothCursorX, y: smoothCursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ 
          scale: isHovering ? 1.5 : 0.4, 
          opacity: isHovering ? 1 : 0.3,
          borderWidth: isHovering ? "1px" : "4px"
        }}
      >
        <motion.div 
          animate={{ scale: isHovering ? 0.5 : 0 }}
          className="w-1 h-1 bg-[#8B7355] rounded-full" 
        />
      </motion.div>

      {/* 1. BACKGROUND LAYER (Deep Parallax) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
          <img 
            src="/locations/IMG_4886.avif" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.8]"
            alt="The Origin"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      {/* 2. ATMOSPHERIC STEAM (Cafe Touch) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="steam-wisp absolute bg-white/40 rounded-full"
            style={{
              width: `${Math.random() * 120 + 60}px`,
              height: `${Math.random() * 120 + 60}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 3. THE REFINED GALLERY BLOCK (With 3D Tilt) */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-30 max-w-xl w-full bg-white/60 backdrop-blur-xl p-10 md:p-16 border border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-sm text-center"
      >
        <div style={{ transform: "translateZ(50px)" }}>
          {/* Label */}
          <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.3em]  font-bold mb-10 block italic">
            Interval & Artifact
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-light font-[Bai_Jamjuree] text-[#1A1A1A] leading-tight tracking-tighter mb-8">
            "Just a place where <span className="shiny-text uppercase font-bold italic">time</span> feels different once you’re inside."
          </h2>
          
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="h-px w-10 bg-[#8B7355]/30" />
            <p className="font-[Garet_Book] text-[13px] md:text-sm text-gray-500 leading-relaxed italic max-w-sm mx-auto">
              It’s about those in-between moments you don’t plan for — when you sit a little longer, or when you don’t feel the need to check the clock.
            </p>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-center">
            <p className="font-[Bai_Jamjuree] text-[10px] uppercase tracking-[0.4em] text-[#1A1A1A] font-bold mb-8">
              — Jaivardhan
            </p>

            <Link to="/about" className="group flex flex-col items-center cursor-none">
              <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.5em] text-[#1A1A1A] font-black italic mb-2 group-hover:text-[#8B7355] transition-colors">
                Learn More
              </span>
              <motion.div 
                className="h-[1px] bg-[#8B7355]"
                initial={{ width: "15px" }}
                whileInView={{ width: "60px" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </Link>
          </div>
        </div>

        {/* Brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-black/10" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-black/10" />
      </motion.div>

      {/* Architectural Labeling */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <p className="text-[9px] text-black/20 uppercase tracking-[0.5em] font-[Bai_Jamjuree]">
          Common Time // Flagship Lodhi // 2026
        </p>
      </div>
    </section>
  );
};

export default FounderSection;