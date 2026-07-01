import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const LuxuryProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial="rest" 
      whileHover="hover" 
      animate="rest"
      className="group relative flex flex-col bg-transparent"
    >
      {/* --- Image Section (Link to Product) --- */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-[#f1f1ef] mb-6 block">
        {/* The Self-Assembling Bronze Frame */}
        <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          <motion.rect
            x="0" y="0" width="100%" height="100%"
            fill="none"
            stroke="#8b7355"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            variants={{
              hover: { pathLength: 1, opacity: 0.4, transition: { duration: 1, ease: "easeInOut" } },
              rest: { pathLength: 0, opacity: 0, transition: { duration: 0.3 } }
            }}
          />
        </svg>

        <motion.img
          src={product.image_url}
          alt={product.name}
          variants={{
            rest: { scale: 1.1 },
            hover: { scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* --- Metadata Section --- */}
      <div className="flex flex-col items-start px-1 mb-6">
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#8b7355] font-bold mb-1">
          {product.category?.replace('-', ' ')}
        </span>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-light tracking-tighter font-[Inter] text-gray-900 group-hover:text-[#8b7355] transition-colors duration-500 mb-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="font-[Inter] text-sm text-gray-400">
          ₹{product.price?.toLocaleString()}
        </p>
      </div>

    </motion.div>
  );
};

export default LuxuryProductCard;