import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";

const FounderSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Perspective Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FAF7F2] overflow-hidden flex items-center justify-center py-24 px-6"
    >
      {/* BRAND STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      {/* BACKGROUND */}
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

      {/* STEAM */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="steam-wisp absolute bg-white/40 rounded-full"
            style={{
              width: `${Math.random() * 120 + 60}px`,
              height: `${Math.random() * 120 + 60}px`,
              left: `${Math.random() * 100}%`,
              bottom: "-5%",
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN BLOCK */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-30 max-w-xl w-full bg-white/60 backdrop-blur-xl p-10 md:p-16 border border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-sm text-center"
      >
        <div style={{ transform: "translateZ(50px)" }}>
          {/* Label */}
          <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.3em] font-bold mb-10 block italic">
            Interval & Artifact
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-light font-[Bai_Jamjuree] text-[#1A1A1A] leading-tight tracking-tighter mb-8">
            "Just a place where{" "}
            <span className="shiny-text uppercase font-bold italic">
              time
            </span>{" "}
            feels different once you’re inside."
          </h2>

          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="h-px w-10 bg-[#8B7355]/30" />
            <p className="font-[Garet_Book] text-[13px] md:text-sm text-gray-500 leading-relaxed italic max-w-sm mx-auto">
              It’s about those in-between moments you don’t plan for — when you
              sit a little longer, or when you don’t feel the need to check the
              clock.
            </p>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-center">
            <p className="font-[Bai_Jamjuree] text-[10px] uppercase tracking-[0.4em] text-[#1A1A1A] font-bold mb-8">
              — Jaivardhan
            </p>

            <Link to="/about" className="group flex flex-col items-center">
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

      {/* Footer Label */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <p className="text-[9px] text-black/20 uppercase tracking-[0.5em] font-[Bai_Jamjuree]">
          Common Time // Flagship Lodhi // 2026
        </p>
      </div>
    </section>
  );
};

export default FounderSection;