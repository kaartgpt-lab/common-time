import React, { useRef } from 'react';
import Container from '../components/layout/Container';
import { useParams, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import GalleryMarquee from '../components/editorial/GalleryMarquee';
const Locations = () => {
  const { slug } = useParams();

  const locations = [
    {
      slug: "lodhi-colony",
      city: "Lodhi Colony",
      area: "Meherchand Market",
      description: "Our minimalist flagship blending Amsterdam's bakery culture with Japanese precision. A sanctuary of light and linear design in the heart of New Delhi.",
      address: "Shop 2–3, Meherchand Market, New Delhi 110003",
      hours: "08:00 AM — 10:00 PM",
      imageUrl: "/locations/IMG_4886.avif",
      locationLink: "https://maps.google.com/?q=Common+Time+Meherchand+Market+Lodhi+Colony+New+Delhi",
    },
    {
      slug: "vasant-vihar",
      city: "Vasant Vihar",
      area: "Basant Lok",
      description: "A sleek neighborhood retreat serving artisan brews and refined bakes. Designed as a creative hub where community meets curated specialty coffee.",
      address: "Basant Lok Market, Vasant Vihar, New Delhi 110057",
      hours: "08:00 AM — 10:00 PM",
      imageUrl: "/locations/IMG_9504.avif",
      locationLink: "https://maps.app.goo.gl/P7CNpQL1mJG3xS2o9",
    },
    {
  slug: "khan-market",
  city: "Khan Market",
  area: "Rabindra Nagar",
  description: "An elevated perspective in Delhi's premier lifestyle destination. Experience our signature brews and bakes within a minimalist, sun-drenched sanctuary.",
  address: "Second Floor, 34, Above Pure Home Living, Khan Market, New Delhi 110003",
  hours: "08:00 AM — 10:00 PM",
  imageUrl: "/locations/khanmarket.jpg",
  locationLink: "https://maps.app.goo.gl/Pri3Eq6u9y7jmHtA6",
},
  ];

  const loc = locations.find((item) => item.slug === slug);
  const otherLocations = locations.filter((item) => item.slug !== slug);

  if (!loc) {
    return (
      <main className="bg-[#fafaf8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Location not found</h1>
          <Link to="/" className="text-[#8b7355] underline">Back to Home</Link>
        </div>
      </main>
    );
  }

  const ShinyText = ({ children, className = "" }) => (
    <span className={`shiny-text py-2 inline-block overflow-visible ${className}`}>
      {children}
    </span>
  );

  const TiltCard = ({ item }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
    const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);
    const scale = useSpring(1, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(nx);
      y.set(ny);
    };
    const handleMouseEnter = () => scale.set(1.02);
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      scale.set(1);
    };

    return (
      <Link to={`/locations/${item.slug}`} className="block" style={{ perspective: '1000px' }}>
       <motion.div
  ref={cardRef}
  onMouseMove={handleMouseMove}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  style={{ 
    rotateX, 
    rotateY, 
    scale, 
    transformStyle: 'preserve-3d',
    // Dynamic shadow that moves opposite to the tilt for a realistic 3D lift
    boxShadow: useTransform(
      [rotateX, rotateY],
      ([rX, rY]) => {
        return `${-rY / 2}px ${rX / 2}px 50px rgba(0,0,0,0.3)`;
      }
    )
  }}
  className="relative h-[400px] w-full flex flex-col mb-10 md:mb-0 bg-[#1a1a1a] overflow-hidden rounded-sm transition-shadow duration-700 shadow-2xl group-hover:shadow-[0_45px_100px_-15px_rgba(0,0,0,0.6)] cursor-pointer"
>
  {/* Image Section (80%) */}
  <div className="relative h-[80%] w-full overflow-hidden">
    {/* Animated Inset Viewfinder Corners */}
    <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#8b7355]"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#8b7355]"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#8b7355]"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#8b7355]"></div>
    </div>

    <img
      src={item.imageUrl}
      alt={item.city}
      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
    />

    {/* Glare overlay */}
    <motion.div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: useTransform(
          [glareX, glareY],
          ([gx, gy]) =>
            `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)`
        ),
      }}
    />

    {/* Grain Texture Overlay */}
    <div className="absolute inset-0 grain-overlay z-10"></div>
  </div>

  {/* Text Section (20%) */}
  <div className="h-[20%] w-full flex items-center justify-between px-10 relative bg-white z-30 overflow-hidden">
    <div className="flex flex-col">
      <div className="overflow-hidden">
        <motion.span
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          className="text-[9px] font-[Garet_Book] uppercase tracking-[0.6em] text-[#8b7355] mb-2 block font-bold"
        >
          {item.area}
        </motion.span>
      </div>
      <h4 className="text-3xl md:text-4xl font-[Bai_Jamjuree] font-light text-black tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-700">
        {item.city}
      </h4>
    </div>

    <div className="relative flex flex-col items-end gap-2">
      <span className="text-[8px] font-[Garet_Book] uppercase tracking-[0.3em] text-black/80 group-hover:text-black/80 transition-colors duration-500">Enter Space</span>
      <div className="h-[1px] w-8 bg-[#8b7355] group-hover:w-16 transition-all duration-700"></div>
    </div>
  </div>
</motion.div>
      </Link>
    );
  };

  return (
    <main className="bg-[#fafaf8] min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shiny {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shiny-text {
          color: #1a1a1a;
          background: linear-gradient(120deg, rgba(26,26,26,1) 45%, rgba(139,115,85,0.8) 50%, rgba(26,26,26,1) 55%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny 6s linear infinite;
        }
        @keyframes borderBreathe {
          0% { transform: scale(1); opacity: 0.15; border-width: 1px; }
          50% { transform: scale(1.04); opacity: 0.45; border-width: 1.5px; }
          100% { transform: scale(1); opacity: 0.15; border-width: 1px; }
        }
        .animate-breathe {
          animation: borderBreathe 4s ease-in-out infinite;
        }
        .grain-overlay {
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.03;
          pointer-events: none;
        }
      `}} />

      {/* --- MAIN LOCATION DETAIL (UNTOUCHED) --- */}
      <section className="relative py-32 md:py-32">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="relative w-full lg:w-7/12 group">
              <div className="absolute inset-0 z-0 border-black animate-breathe pointer-events-none"></div>
              <div className="relative z-10 overflow-hidden shadow-xl rounded-sm">
                <div className="w-full h-[50vh] lg:h-[65vh] overflow-hidden">
                  <img 
                    src={loc.imageUrl} 
                    alt={loc.city} 
                    className="w-full h-full object-cover grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-105" 
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col items-start">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-[#8b7355]"></div>
                <span className="font-[Garet_Book] text-[10px] uppercase tracking-[0.3em] text-[#8b7355] font-bold">
                  {loc.area}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight font-[Bai_Jamjuree] mb-8">
                <ShinyText>{loc.city}</ShinyText>
              </h2>
              <p className="font-[Garet_Book] text-gray-500 leading-relaxed mb-12 text-lg lg:pr-12">
                {loc.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 w-full border-t border-black/5 pt-10">
                <div className="group">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 mb-2 transition-colors group-hover:text-[#8b7355]">Location</p>
                  <p className="text-sm font-[Garet_Book] text-gray-800 leading-snug">{loc.address}</p>
                </div>
                <div className="group">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 mb-2 transition-colors group-hover:text-[#8b7355]">Availability</p>
                  <p className="text-sm font-[Garet_Book] text-gray-800">{loc.hours}</p>
                </div>
              </div>
              <a href={loc.locationLink} target="_blank" rel="noreferrer" className="mt-12 group flex items-center gap-4 font-[Bai_Jamjuree] text-[10px] uppercase tracking-[0.4em] text-black">
                Get Directions
                <div className="h-[1px] w-6 bg-black group-hover:w-12 transition-all duration-500"></div>
              </a>
            </div>
          </div>
        </Container>
      </section>
        <GalleryMarquee/>
      {/* --- DISCOVER MORE SECTION --- */}
      <section className="pt-32 md:py-32 bg-[#fafaf8]">
        <Container>
          <div className="mb-20 flex items-end justify-between">
            <div className="max-w-md">
              <h3 className="text-[10px] font-[Garet_Book] uppercase tracking-[0.5em] text-[#8b7355] mb-4 font-bold">Indices</h3>
              <h2 className="text-3xl font-[Bai_Jamjuree] font-light tracking-tighter text-black leading-none">
                Other <span className="italic ">Atmospheres.</span>
              </h2>
            </div>
            <div className="hidden md:block h-[1px] flex-1 mx-12 bg-black/5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {otherLocations.map((item) => (
              <TiltCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Locations;