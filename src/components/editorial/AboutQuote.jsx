import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const FounderManifesto = () => {
  const containerRef = useRef(null);

  // High-precision scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 0.9"], // Line finishes exactly at the end
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const manifestoData = [
    {
      label: "Origin",
      title: "Common Time started with me wanting a place I would go to myself.",
      body: "Back in November 2025, we opened our first space in Lodhi. It was small, unsure of itself, and very much a work in progress.",
    },
    {
      label: "Observation",
      body: "I spent hours watching. Some people rush; some sit for hours. Somewhere in between, I understood what I wanted this to be.",
    },
    {
      label: "Architecture",
      title: "Not a loud space. Not overdesigned.",
      body: "Just a place where time feels different. It was about getting that one room right—the coffee, the light, the music, the ritual.",
    },
    {
      label: "Expansion",
      body: "Today we're at three spaces—Goa being next. Each is different, but they all come from the same place of unhurried precision.",
    },
    {
      label: "The Essence",
      title: "It's about those in-between moments you don't plan for.",
      body: "When you sit a little longer, or when you don't feel the need to check the clock. That's the only thing we've been trying to build.",
      isFinal: true
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full bg-[#FAF7F2] py-20 px-6 overflow-hidden">
      {/* 1. TACTILE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="relative max-w-5xl mx-auto">

        {/* 2. THE DYNAMIC SPINE (Running Line) */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-10">
          <svg width="2" height="100%" className="h-full overflow-visible">
            <motion.line
              x1="1" y1="0" x2="1" y2="100%"
              stroke="#8B7355"
              strokeWidth="2"
              strokeDasharray="1"
              style={{ pathLength, opacity: lineOpacity }}
            />
          </svg>
          {/* Focus Dot */}
          <motion.div
            style={{
              top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              opacity: lineOpacity
            }}
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#8B7355] bg-white shadow-sm"
          >
            <div className="absolute inset-1 rounded-full bg-[#8B7355] animate-pulse" />
          </motion.div>
        </div>

        {/* 3. THE ARCHITECTURAL CARDS */}
        <div className="flex flex-col space-y-12 md:space-y-16">
          {manifestoData.map((item, index) => (
            <ManifestoCard
              key={index}
              item={item}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ManifestoCard = ({ item, index, isLeft }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
      className={`relative w-full md:w-[48%] ${isLeft ? "self-start" : "self-end"} z-20`}
    >
      <div className="group relative bg-white border border-black/5 p-8 md:p-10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] transition-all duration-700 rounded-sm">

        {/* Kinetic Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#8B7355]/40 transition-all duration-700" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#8B7355]/40 transition-all duration-700" />

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-[Inter] text-[8px] uppercase tracking-[0.2em] text-black font-bold italic">
            {item.label}
          </span>
          <div className="h-px w-6 bg-black/5" />
        </div>

        {/* Content Stagger */}
        <div className="space-y-4">
          {item.title && (
            <h3 className="text-xl md:text-2xl font-light font-[Inter] text-[#1A1A1A] tracking-tighter leading-tight">
              {item.title}
            </h3>
          )}
          <p className="font-[Inter] text-[13px] md:text-sm text-gray-500 leading-relaxed">
            {item.body}
          </p>
        </div>

        {item.isFinal && (
          <div className="mt-8 pt-8 border-t border-black/5">
            <p className="font-[Inter] text-[10px] uppercase tracking-[0.4em] text-[#1A1A1A] font-bold">
              — Jaivardhan
            </p>
          </div>
        )}
      </div>

      {/* Horizontal Connector Line (Only Desktop) */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "20px" }}
        className={`hidden md:block absolute top-1/2 h-[1px] bg-[#8B7355]/20 ${isLeft ? "-right-5" : "-left-5"}`}
      />
    </motion.div>
  );
};

export default FounderManifesto;
