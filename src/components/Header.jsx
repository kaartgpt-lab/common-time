import { useState } from "react";
import { FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import CartIcon from "./CartIcon";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for the tabbed navigation (matches desktop categories)
  const [activeMobileTab, setActiveMobileTab] = useState('SHOP');

  // --- STITCH DESIGN TOKENS ---
  const headerStyles = "bg-white border-t-4 border-[#333333] shadow-sm";
  const navBlockStyles = "bg-white/40 px-6 h-11 flex items-center space-x-8 relative"; 
  const stitchNavLink = "text-[16px] tracking-[0.05em] font-[Bai_Jamjuree] text-black uppercase hover:opacity-70 transition-opacity";

  // --- CONTENT MAPPING (Synced with Desktop) ---
  const mobileMenuData = {
    SHOP: {
      links: [
        { name: "My Orders", path: "/orders" },
        { name: "Profile", path: "/profile" },
        { name: "Order Online", path: "/shop" }
      ],
      image: "header-dropdown/IMG_6027.avif"
    },
    LOCATIONS: {
      links: [
        { name: "Lodhi Colony", path: "/locations/lodhi-colony" },
        { name: "Vasant Vihar", path: "/locations/vasant-vihar" },
        { name: "Khan Market", path: "/locations/khan-market" }
      ],
      image: "header-dropdown/IMG_5713.avif"
    },
    MENU: {
      links: [{name: "Order Online", path: "/shop"} ],
    },
    ORDER: {
      links: [{name: "Order Online", path: "/shop"} ],
    }
  };

  return (
    <header className={`relative z-50 ${headerStyles} h-[70px] lg:h-18 w-full flex items-center justify-between px-6 lg:px-16`}>
      <style>{`
        .nav-link-custom { position: relative; }
        .nav-link-custom::after {
          content: ''; position: absolute; width: 0; height: 1px;
          bottom: -4px; left: 0; background-color: currentColor;
          transition: width 0.3s ease;
        }
        .group:hover .nav-link-custom::after { width: 100%; }

        .dropdown-panel {
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .group:hover .dropdown-panel { opacity: 1; visibility: visible; pointer-events: auto; }
        
        .dropdown-link {
          font-size: 25px; font-weight: 900; color: #71717a;
          text-transform: uppercase; letter-spacing: 0.05em;
          transition: color 0.3s ease; line-height: 1.1;
        }
        .dropdown-link:hover { color: #1A1A1A; }
      `}</style>

      {/* 1. MOBILE MENU TOGGLE (Uses main FaBars/FaTimes only) */}
      <div className="flex lg:hidden items-center">
        <button 
          className="text-[#1A1A1A] z-[70]" 
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            setActiveMobileTab('SHOP');
          }}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* 2. LEFT DESKTOP NAVIGATION (Untouched) */}
      <div className="hidden lg:flex flex-1 items-center h-full ml-6">
        <nav className={navBlockStyles}>
          <div className="group h-full flex items-center">
            <Link to="/shop" className={`${stitchNavLink} nav-link-custom`}>SHOP</Link>
            <div className="dropdown-panel absolute top-full left-0 mt-0 w-[350px] h-44 bg-white px-4 pt-15 pb-2 flex justify-between items-end shadow-sm z-50">
              <div className="flex flex-col space-y-1 font-[Garet_Book]">
                <Link to="/orders" className="dropdown-link">My Orders</Link>
                <Link to="/profile" className="dropdown-link">Profile</Link>
                <Link to="/shop" className="dropdown-link">Order Online</Link>
              </div>
              {/* <div className="w-32 h-44 overflow-hidden">
                <img src="header-dropdown/IMG_6027.avif" alt="Shop" className="w-full h-full object-cover" />
              </div> */}
            </div>
          </div>

          <div className="group h-full flex items-center">
            <Link to="/locations/lodhi-colony" className={`${stitchNavLink} nav-link-custom`}>LOCATIONS</Link>
            <div className="dropdown-panel absolute top-full left-0 mt-0 w-[350px] h-44 bg-white px-4 pt-15 pb-2 flex justify-between items-end shadow-sm z-50">
              <div className="flex flex-col space-y-1 font-light font-[Garet_Book]">
                <Link to="/locations/lodhi-colony" className="dropdown-link">Lodhi Colony</Link>
                <Link to="/locations/vasant-vihar" className="dropdown-link">Vasant vihar</Link>
                <Link to="/locations/khan-market" className="dropdown-link">Khan market</Link>
              </div>
              {/* <div className="w-32 h-44 overflow-hidden">
                <img src="header-dropdown/IMG_5713.avif" alt="Locations" className="w-full h-full object-cover" />
              </div> */}
            </div>
          </div>
        </nav>
      </div>

      {/* 3. CENTER LOGO */}
      
        <Link to="/" className="flex items-center ">
        <img src="/logos/newlogo.png" alt="Common Time Logo" className="object-contain md:scale-70 " />
       
      </Link>
    
      

      {/* 4. RIGHT NAVIGATION & UTILITIES (Untouched) */}
      <div className="flex flex-1 items-center justify-end h-full">
        <nav className={`hidden lg:flex ${navBlockStyles} mr-6`}>
          <div className="group h-full flex items-center">
            <Link to="/menu" className={`${stitchNavLink} nav-link-custom`}>MENU</Link>
            
          </div>
          <div className="group h-full flex items-center">
            <Link to="/coming-soon" className={`${stitchNavLink} nav-link-custom`}>ORDER</Link>
            
          </div>
          {/* <div className="flex items-center h-full">
            {user ? (
              <button onClick={() => signOut()} className={`${stitchNavLink} nav-link-custom`}>LOGOUT</button>
            ) : (
              <Link to="/login" className={`${stitchNavLink} nav-link-custom`}>LOGIN</Link>
            )}
          </div> */}
        </nav>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <a href="https://www.instagram.com/itscommontime" target="_blank" rel="noreferrer" className="text-[#1A1A1A] hover:opacity-70 transition-opacity">
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
      
      {/* 5. SEAMLESS MOBILE MENU OVERLAY (Attaches below Navbar) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#FAF7F3] z-[65] shadow-2xl overflow-hidden border-b border-gray-300"
          >
            <div className="flex flex-col w-full " >
              
              {/* Tab Selector - Using Bai Jamjuree for Structure */}
              <div className="flex justify-between px-8 py-2 border-b border-gray-300">
                {['SHOP', 'LOCATIONS'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveMobileTab(tab)}
                    className={`text-[12px] font-[Bai_Jamjuree] tracking-[0.2em] font-bold pb-2 transition-all ${activeMobileTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                  >
                    {tab}
                  </button>
                ))}
                <Link to="/menu">
                <button 
                    className={`text-[12px] font-[Bai_Jamjuree] tracking-[0.2em] font-bold pb-2 transition-all text-gray-400 hover:text-black`}
                  >
                   MENU
                  </button>
                </Link>
                
              </div>
              {/* Dynamic Content Display - Using Garet Book for Links */}
              <div className="flex justify-between items-end  px-4 pt-6 pb-2 min-h-[160px] ">
                <div className="flex flex-col space-y-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMobileTab}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col space-y-2"
                    >
                      {mobileMenuData[activeMobileTab].links.map((link, idx) => (
                        <Link 
                          key={idx} 
                          to={link.path} 
                          className="text-[24px] font-[Garet_Book] font-black uppercase tracking-tighter text-[#1A1A1A] leading-none hover:text-[#8b7355] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Tab Image Reveal */}
                {/* <div className="w-40 h-50 overflow-hidden shadow-xl border border-white/50 bg-gray-200 ">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeMobileTab}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      src={mobileMenuData[activeMobileTab].image}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div> */}
              </div>

              {/* Bottom Utility Grid - Bai Jamjuree Labels */}
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="border-r border-gray-300 p-6 text-center bg-white/40">
                  {user ? (
                    <button 
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }} 
                      className="text-[11px] font-[Bai_Jamjuree] font-bold tracking-[0.25em] uppercase text-black"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      className="text-[11px] font-[Bai_Jamjuree] font-bold tracking-[0.25em] uppercase text-black" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
                <div className="p-6 text-center bg-white/40">
                  <Link 
                    to="/" 
                    className="text-[11px] font-[Bai_Jamjuree] font-bold tracking-[0.25em] uppercase text-black" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ORDER
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}