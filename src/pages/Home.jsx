import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import HeroSection from "../components/editorial/HeroSection";
import CenteredRevealSection from "../components/editorial/SplitSection";
import {LuxuryLocationCard} from "../components/editorial/CitySection";
import ProductGrid from "../components/commerce/ProductGrid";
import Container from "../components/layout/Container";
import GalleryMarquee from "../components/editorial/GalleryMarquee";
import InstagramSection from "../components/editorial/InstagramSection";
import Common from "../components/editorial/Common";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);
      setProducts(data || []);
    }
    fetchProducts();
  }, []);

  const featuredCoffee = products.filter((p) => p.category === "coffee").slice(0, 4);
  const featuredObjects = products.filter((p) => p.category === "merchandise").slice(0, 4);
 const locations = [
  {
    name: "Lodhi Colony",
    area: "Meherchand Market",
    slug: "lodhi-colony",
    description:
      "Our minimalist flagship blending Amsterdam’s bakery culture with Japanese precision. A sanctuary of light and linear design in the heart of New Delhi.",
    address: "Shop 2–3, Meherchand Market, New Delhi 110003",
    hours: "08:00 AM — 10:00 PM",
    imageUrl: "/locations/lodhi.jpg",
    locationLink:
      "https://maps.google.com/?q=Common+Time+Meherchand+Market+Lodhi+Colony+New+Delhi",
  },
  {
    name: "Vasant Vihar",
    area: "Basant Lok",
    slug: "vasant-vihar",
    description:
      "A sleek neighborhood retreat serving artisan brews and refined bakes. Designed as a creative hub where community meets curated specialty coffee.",
    address: "Basant Lok Market, Vasant Vihar, New Delhi 110057",
    hours: "08:00 AM — 10:00 PM",
    imageUrl: "/locations/vasant.avif",
    locationLink: "https://maps.app.goo.gl/P7CNpQL1mJG3xS2o9",
  },
  {
    name: "Khan Market",
    area: "Rabindra Nagar",
    slug: "khan-market",
    description:
      "An elevated perspective in Delhi’s premier lifestyle destination. Experience our signature brews and bakes within a minimalist, sun-drenched sanctuary.",
    address: "Second floor, 34, Above Pure Home Living, Khan Market, New Delhi 110003",
    hours: "08:00 AM — 10:00 PM",
    imageUrl: "/locations/khan.jpg",
    locationLink: "https://maps.app.goo.gl/Pri3Eq6u9y7jmHtA6",
  },
];
  return (
    <div className="bg-white">
      {/* CSS for the Shimmer Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shiny {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shiny-text {
          color: #1a1a1a;
          background: linear-gradient(
            120deg, 
            rgba(26, 26, 26, 1) 45%, 
            rgba(139, 115, 85, 0.8) 50%, 
            rgba(26, 26, 26, 1) 55%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny 6s linear infinite;
          line-height: 1.2;
        }
      `}} />

      <HeroSection
        headline="Elevated rituals"
        subtext=""
        ctaText="Discover"
        ctaHref="/shop"
      />
      <Common />
      {/* <CenteredRevealSection
        headline="Coffee, conversation, and small moments that make the day better."
        linkText="Visit Us"
        linkHref="/locations"
      /> */}

      {/* <GalleryMarquee /> */}
         
      {/* --- Objects & Equipment Section with Shimmer --- */}
      <section className="bg-[#fafaf8] mt-12 md:mt-0 pb-12 md:py-12 border-b border-black/5">
        <Container>
          <div className="flex flex-col items-start mb-10 md:mb-15">
            {/* Sub-label with Shimmer */}
            <span className="shiny-text py-2 inline-block overflow-visible font-[Garet_Book] text-xs uppercase tracking-[0.2em] font-semibold italic mb-1">
              Curated Selection
            </span>
            
            {/* Main Heading with Shimmer - & remains unchanged */}
            <div className="flex items-center gap-4">
             
              <h2 className="text-2xl md:text-3xl font-light tracking-tight font-[Bai_Jamjuree] flex items-baseline gap-3">
                <span className="shiny-text py-2 inline-block overflow-visible">Objects & Equipment</span> 
              </h2>
            </div>
          </div>
          <ProductGrid products={featuredObjects} columns={4} />
          
          {/* <div className="mt-20 flex justify-end">
            <div className="h-[1px] w-24 bg-black/5"></div>
          </div> */}
        </Container>
      </section>

      
      {/* <InstagramSection /> */}
      <main className="bg-[#fafaf8] min-h-screen py-12 md:py-12">
      <Container>
        {/* Header - Consistent with your homepage style */}
        <div className="mb-10 md:mb-15 flex flex-col items-start">
          <span className="shiny-text py-2 inline-block overflow-visible font-[Garet_Book] text-xs uppercase tracking-[0.2em] font-semibold italic mb-1">
            Physical Presence
          </span>
          <div className="flex items-center gap-4">
           
           <h2 className="text-2xl md:text-3xl font-light tracking-tight font-[Bai_Jamjuree] flex items-baseline gap-3">
                <span className="shiny-text py-2 inline-block overflow-visible">Our Spaces</span> 
              </h2>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {locations.map((loc) => (
            <LuxuryLocationCard key={loc.slug} {...loc} />
          ))}
        </div>
      </Container>
    </main>
        <PartnerLogos />
     <section className="py-10 flex flex-col items-center justify-center font-[Garet_Book] w-full bg-[#fafaf8]">
  {/* A very thin, short divider */}
  <div className="w-12 h-px bg-gray-200 mb-8 mx-auto" />
  
  <p className="text-xs  uppercase tracking-[0.1em] font-light text-center px-6 leading-relaxed">
    A concept by <span className="text-gray-900">Bhatia Hospitality Group</span>
  </p>
</section>
    </div>
  );
}

/* ---------- Partner Logos (Fixed Marquee) ---------- */
function PartnerLogos() {
  const brands = [
    {
      name: "Vogue",
      file: "/logos/vogue.png",
      url: "https://www.vogue.in/content/new-restaurants-in-india-you-should-grab-a-meal-at-this-february-2026",
    },
    {
      name: "Elle Gourmet",
      file: "/logos/ellegourmet.png",
      url: "https://ellegourmet.in/food/freshly-served/24-hot-chocolate-spots-to-bookmark-this-season-10917333",
    },
    {
      name: "Cosmopolitan",
      file: "/logos/cosmopolitan.png",
      url: "https://www.cosmopolitan.in/life/features/story/the-coolest-restaurants-across-india-that-deserve-to-be-on-your-foodie-ra",
    },
    {
      name: "Food Talk India",
      file: "/logos/foodtalkindia.jpg",
      url: "https://www.instagram.com/p/DQcDapsElc2/?img_index=4&igsh=MXcxN3M5aDIxMDB2bA==",
    },
    {
      name: "The Lab Mag",
      file: "/logos/labmag.png",
      url: "https://www.thelabmagofficial.com/just-opened-delhi-ncrs-best-new-restaurants-bars/",
    },
    {
      name: "LBB",
      file: "/logos/lbb.jpg",
      url: "https://www.instagram.com/p/DQeUg5qEgLo/?img_index=4&igsh=cHdjaDY1c2ZybDZx",
    },
    {
      name: "ET Hospitality",
      file: "/logos/ethospitality.svg",
      url: "https://hospitality.economictimes.indiatimes.com/news/restaurants/common-time-debuts-in-lodhi-colony-new-delhi/125049847",
    },
  ];

  return (
    <section className="bg-white" aria-label="Partner logos">
      <div className="max-w-[1200px] mx-auto py-10 px-4 md:px-6 overflow-hidden">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400 text-center md:text-left font-[Bai_Jamjuree]">
          Listen in to what others are saying
        </p>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, i) => (
              <a
                key={i}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-36 sm:w-44 md:w-52 flex justify-center items-center px-6"
              >
                <img
                  src={brand.file}
                  alt={brand.name}
                  className="max-h-10 sm:max-h-12 md:max-h-16 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: 200%;
            animation: marquee 25s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}