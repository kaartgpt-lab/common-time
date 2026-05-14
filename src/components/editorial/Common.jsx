import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const BG_IMG = "/locations/IMG_4886.avif";

/* ─── A: full bleed image, text centered, very minimal ─── */
const VariantA = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <motion.img style={{ y }} src={BG_IMG} className="w-full h-[115%] object-cover -mt-[7.5%] brightness-[0.45]" alt="" />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="font-[Bai_Jamjuree] text-2xl md:text-4xl font-light text-white tracking-tight mb-8"
        >
          designed for the moments between
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/about" className="font-[Garet_Book] text-[9px] tracking-[0.45em] text-white/50 hover:text-white transition-colors duration-300">
            founder's note
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.3em] text-white/20 font-[Bai_Jamjuree]">A</div>
    </section>
  );
};

/* ─── B: pure black, huge type, link underneath ─── */
const VariantB = () => (
  <section className="relative w-full bg-[#0d0d0d] flex items-center justify-center py-28 px-6 overflow-hidden">
    <div className="text-center max-w-3xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className="font-[Bai_Jamjuree] text-3xl md:text-5xl font-light text-white tracking-tight leading-tight mb-10"
      >
        designed for the<br />moments between
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
        className="h-px w-12 bg-[#c8a97e]/40 mx-auto mb-10 origin-center"
      />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
        <Link to="/about" className="font-[Garet_Book] text-[9px] tracking-[0.5em] text-[#c8a97e]/60 hover:text-[#c8a97e] transition-colors duration-300">
          founder's note
        </Link>
      </motion.div>
    </div>
    <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.3em] text-white/10 font-[Bai_Jamjuree]">B</div>
  </section>
);

/* ─── C: cream bg, oversized italic type, link as underline ─── */
const VariantC = () => (
  <section className="relative w-full bg-[#F7F4EF] flex items-center justify-center py-24 px-6 overflow-hidden">
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className="font-[Bai_Jamjuree] text-3xl md:text-5xl font-light italic text-[#1a1a1a] tracking-tight leading-tight mb-10"
      >
        designed for the moments between
      </motion.p>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <Link
          to="/about"
          className="font-[Garet_Book] text-[9px] tracking-[0.5em] text-[#8b7355] border-b border-[#8b7355]/40 pb-0.5 hover:border-[#8b7355] transition-colors duration-300"
        >
          founder's note
        </Link>
      </motion.div>
    </div>
    <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.3em] text-black/10 font-[Bai_Jamjuree]">C</div>
  </section>
);

/* ─── D: image left, text right, split ─── */
const VariantD = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative w-full min-h-[60vh] flex overflow-hidden">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <motion.img style={{ y }} src={BG_IMG} className="w-full h-[115%] object-cover -mt-[7.5%] brightness-[0.7]" alt="" />
      </div>
      <div className="w-full md:w-1/2 bg-[#0f0d0b] flex flex-col items-start justify-center px-12 md:px-16 py-20">
        <motion.h2
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="font-[Bai_Jamjuree] text-2xl md:text-4xl font-light text-white tracking-tight leading-snug mb-10"
        >
          designed for the<br />moments between
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-8 bg-[#c8a97e]/30" />
          <Link to="/about" className="font-[Garet_Book] text-[9px] tracking-[0.45em] text-[#c8a97e]/50 hover:text-[#c8a97e] transition-colors duration-300">
            founder's note
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.3em] text-white/15 font-[Bai_Jamjuree]">D</div>
    </section>
  );
};

/* ─── E: full width text, flush left, image as texture behind ─── */
const VariantE = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden py-24 px-8 md:px-20">
      <div className="absolute inset-0">
        <motion.img style={{ y }} src={BG_IMG} className="w-full h-[115%] object-cover -mt-[7.5%] brightness-[0.25] grayscale" alt="" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="font-[Bai_Jamjuree] text-4xl md:text-7xl font-light text-white tracking-tight leading-[1.0] mb-12"
        >
          designed for<br />the moments<br />between
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          <Link
            to="/about"
            className="inline-flex items-center gap-4 font-[Garet_Book] text-[9px] tracking-[0.45em] text-white/40 hover:text-white transition-colors duration-300 group"
          >
            founder's note
            <span className="h-px w-8 bg-white/30 group-hover:w-14 transition-all duration-500 block" />
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.3em] text-white/15 font-[Bai_Jamjuree]">E</div>
    </section>
  );
};

const FounderSection = () => (
  <>
    <VariantA />
    <VariantB />
    <VariantC />
    <VariantD />
    <VariantE />
  </>
);

export default FounderSection;
