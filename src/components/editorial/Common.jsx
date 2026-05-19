import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FounderSection = () => (
  <section className="relative w-full bg-[#F7F4EF] flex items-center justify-center py-12 px-6 overflow-hidden">
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className="font-[Bai_Jamjuree] text-lg md:text-2xl font-light italic text-[#1a1a1a] tracking-tight leading-tight mb-6"
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
  </section>
);

export default FounderSection;
