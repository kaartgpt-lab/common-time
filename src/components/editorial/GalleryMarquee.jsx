import React, { useRef } from 'react';
import Container from '../layout/Container';

const GalleryMarquee = () => {
  const galleryImages = [
    "/gallery-marquee/CT-05.jpg",
    "/gallery-marquee/IMG_0036.JPG",
    "/gallery-marquee/IMG_4483.JPG",
    "/gallery-marquee/IMG_4598.JPG",
    "/gallery-marquee/IMG_4761.JPG",
    "/gallery-marquee/IMG_4885.JPG",
    "/gallery-marquee/IMG_5022.JPG",
    "/gallery-marquee/IMG_5080.JPG",
    "/gallery-marquee/IMG_5853.JPG",
  ];

  const ShinyText = ({ children, className = "" }) => {
    return (
      <span className={`shiny-text py-2 inline-block overflow-visible ${className}`}>
        {children}
      </span>
    );
  };

  return (
    <section className="bg-[#fafaf8]   overflow-hidden w-full border-y border-black/5">
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-luxury {
          display: flex;
          width: fit-content;
          animation: marquee 65s linear infinite;
        }
        .animate-marquee-luxury:hover {
          animation-play-state: paused;
        }
      `}} />

      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          {/* <div className="flex flex-col items-start">
            <ShinyText className="font-[Garet_Book] text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold italic">
              Spatial Experience
            </ShinyText>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-black/20 hidden md:block"></div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight font-[Bai_Jamjuree] flex items-baseline gap-3">
                <ShinyText>A Glimpse Inside</ShinyText>
              </h2>
            </div>
          </div> */}
        </div>
      </Container>

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fafaf8] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fafaf8] to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee-luxury">
          {/* Main Set */}
          <div className="flex gap-6 px-3">
            {galleryImages.map((src, index) => (
              <div key={`wrapper-1-${index}`} className="relative group">
                <img
                  src={src}
                  alt={`Common Time Interior ${index + 1}`}
                  className="h-[280px] md:h-[400px] w-auto min-w-[320px] md:min-w-[500px] object-cover rounded-none transition-all duration-1000 ease-in-out"
                />
              </div>
            ))}
          </div>

          {/* Loop Set */}
          <div className="flex gap-6 px-3" aria-hidden="true">
            {galleryImages.map((src, index) => (
              <div key={`wrapper-2-${index}`} className="relative group">
                <img
                  src={src}
                  alt=""
                  className="h-[280px] md:h-[400px] w-auto min-w-[320px] md:min-w-[500px] object-cover rounded-none grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryMarquee;