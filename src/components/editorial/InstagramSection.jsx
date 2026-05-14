import React, { useRef, useState } from 'react';
import Container from '../layout/Container';

const InstagramSection = () => {
  const scrollRef = useRef(null);
  const videoRefs = useRef({});
  const [playingId, setPlayingId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const reels = [
    { id: 1, thumbnail: "/gallery-marquee/IMG_0036.JPG", videoSrc: "/reels-video/reel01.mp4" },
    { id: 2, thumbnail: "/gallery-marquee/IMG_4483.JPG", videoSrc: "/reels-video/Video-942.mp4" },
    { id: 3, thumbnail: "/gallery-marquee/IMG_4598.JPG", videoSrc: "/reels-video/reels03.mp4" },
    { id: 4, thumbnail: "/gallery-marquee/CT-05.jpg", videoSrc: "/reels-video/Video-129.mp4" },
    { id: 5, thumbnail: "/gallery-marquee/IMG_4761.JPG", videoSrc: "/reels-video/Video-769.mp4" },
    { id: 6, thumbnail: "/gallery-marquee/IMG_4885.JPG", videoSrc: "/reels-video/Video-854.mp4" },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId].pause();
      }
      video.play().catch(e => console.log("Playback error:", e));
      setPlayingId(id);
    }
  };

  const ShinyText = ({ children, className = "" }) => {
    return (
      <span className={`shiny-text py-2 inline-block overflow-visible ${className}`}>
        {children}
      </span>
    );
  };

  return (
    <section className="bg-[#fafaf8] pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden border-b border-black/5">
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

      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="flex flex-col items-start">
            <ShinyText className="font-[Garet_Book] text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold italic">
              Social Presence
            </ShinyText>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-black/20 hidden md:block"></div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight font-[Bai_Jamjuree] flex items-baseline gap-3">
                <ShinyText>Digital Narrative</ShinyText> 
                <span className="italic font-normal "></span>
              </h2>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-8 items-center pb-2">
            <button 
              onClick={() => scroll('left')}
              className={`transition-all duration-500 ${!canScrollLeft ? 'opacity-20 cursor-default' : 'opacity-100 hover:text-[#8b7355]'}`}
              disabled={!canScrollLeft}
            >
              <span className="font-[Bai_Jamjuree] text-[10px] uppercase tracking-widest text-black">Prev</span>
            </button>
            <div className="h-[1px] w-12 bg-black/10"></div>
            <button 
              onClick={() => scroll('right')}
              className={`transition-all duration-500 ${!canScrollRight ? 'opacity-20 cursor-default' : 'opacity-100 hover:text-[#8b7355]'}`}
              disabled={!canScrollRight}
            >
              <span className="font-[Bai_Jamjuree] text-[10px] uppercase tracking-widest text-black">Next</span>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative"> 
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPadding: '0 24px' }}
          >
            {reels.map((reel) => (
              <div 
                key={reel.id}
                className="relative flex-none w-[80vw] md:w-[calc(25%-18px)] aspect-[9/16] snap-start group overflow-hidden rounded-sm bg-black/5"
              >
                {/* Thumbnail: grayscale by default, colorful on GROUP hover */}
                <img 
                  src={reel.thumbnail} 
                  alt="Reel Thumbnail" 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out grayscale group-hover:grayscale-0 ${playingId === reel.id ? 'opacity-0 scale-105' : 'opacity-100'}`}
                />

                {/* Video Component */}
                <video 
                  ref={(el) => (videoRefs.current[reel.id] = el)}
                  src={reel.videoSrc}
                  className={`absolute inset-0 w-full h-full object-cover rounded-sm transition-opacity duration-1000 ${playingId === reel.id ? 'opacity-100 scale-105' : 'opacity-0'}`}
                  muted
                  loop
                  playsInline
                />

                {/* Play/Pause Button Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all cursor-pointer"
                  onClick={() => togglePlay(reel.id)}
                >
                   <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform duration-300">
                      {playingId === reel.id ? (
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-4 bg-white"></div>
                          <div className="w-1.5 h-4 bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                      )}
                   </div>
                </div>

                <div className="absolute bottom-8 left-8 pointer-events-none">
                  <p className="font-[Bai_Jamjuree] text-[9px] uppercase tracking-[0.3em] text-white/70 shadow-sm">
                    @commontime.coffee
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Link Section */}
        <div className="mt-10 flex justify-end">
          <a 
            href="https://www.instagram.com/itscommontime/" 
            target="_blank"
            rel="noopener noreferrer"
            className="group font-[Bai_Jamjuree] text-[10px] uppercase tracking-widest text-[#8b7355] hover:text-black transition-all duration-500 flex items-center gap-3"
          >
            <span>View Profile</span>
            <div className="w-6 h-[1px] bg-[#8b7355] group-hover:w-10 transition-all duration-500"></div>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default InstagramSection;