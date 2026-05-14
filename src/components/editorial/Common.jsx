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
        .shiny-text-glass {
          background: linear-gradient(120deg, #ffffff 40%, #c8a97e 50%, #ffffff 60%);
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
        className="relative z-30 max-w-lg w-full rounded-sm text-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          padding: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        <div style={{ transform: "translateZ(50px)" }}>
          {/* Label */}
          <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.3em] font-bold mb-8 block italic text-white/50">
            Interval & Artifact
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-light font-[Bai_Jamjuree] text-white leading-tight tracking-tighter mb-8">
            "Just a place where{" "}
            <span className="shiny-text-glass uppercase font-bold italic">
              time
            </span>{" "}
            feels different once you’re inside."
          </h2>

          <div className="h-px w-10 bg-white/20 mx-auto mb-8" />

          {/* Signature + CTA */}
          <div className="flex flex-col items-center gap-6">
            <p className="font-[Bai_Jamjuree] text-[10px] uppercase tracking-[0.4em] text-white/60 font-bold">
              — Jaivardhan
            </p>

            <Link to="/about" className="group flex flex-col items-center">
              <span className="font-[Garet_Book] text-[9px] uppercase tracking-[0.5em] text-white/70 font-black italic mb-2 group-hover:text-white transition-colors">
                Learn More
              </span>
              <motion.div
                className="h-[1px] bg-white/40"
                initial={{ width: "15px" }}
                whileInView={{ width: "60px" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </Link>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-white/20" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b border-r border-white/20" />
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