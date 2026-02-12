import { useState, useRef, useEffect } from "react";

export default function Home() {
  return (
    <div className="font-poppins text-gray-900 bg-white leading-relaxed">
      {/* Hero Section */}
      <section className="relative w-screen h-[90vh] min-h-[380px] overflow-hidden">
        <img
          src="/herobg.jpg"
          alt="Common Time"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <p className="font-[Garet_Book] font-black italic text-lg md:text-xl">
            Designed for the moments between
          </p>
        </div>
      </section>

      {/* Accordions */}
      <main className="w-screen px-4 md:px-6 lg:px-8 py-6">
        <div className="font-[Bai_Jamjuree] font-light max-w-[1200px] mx-auto">
          {/* <Accordion>
            <Accordion.Item title="Philosophy">
              <p>
                <span className="text-2xl">Hi, welcome to Common Time.</span>{" "}
                <br /> <br />
                We've always dreamt of building a brand that imagines coffee as
                a lifestyle. Everything you see, taste, and feel here has been
                thoughtfully created to offer an experience that feels universal
                – yet always remains rooted in great products. <br /> We imagine
                coffee for both purists and tourists. While we spend time
                perfecting the details – from the beans to the milk to the exact
                steaming temperature – we don't believe in overwhelming you. The
                best coffee, after all, is the one you enjoy most. <br /> Common
                Time is made for the moments between – intentionally serving
                only bakes and coffee to create that gentle pause between your
                meals, and to quietly become part of your daily ritual. <br />{" "}
                Our bakes will keep evolving – always well done, balanced, and
                never too sweet.
                <br /> <br /> <span className="text-2xl">Why Lodhi?</span>{" "}
                <br /> <br />
                Because the neighbourhood mirrors who we are – creative,
                curious, ever-evolving, and imperfect in the best way. <br />{" "}
                This is just the beginning. The idea is to take Common Time
                global, and to see the world through coffee. <br /> We hope you
                have a great time.
              </p>
            </Accordion.Item>
            <Accordion.Item title="Location">
              <p>
                2&3 Meharchand market <br /> Lodhi Colony | Vasant Vihar | Khan Market <br /> New Delhi
              </p>
            </Accordion.Item>
            <Accordion.Item title="Timings">
              <p>8am to 11pm everyday</p>
            </Accordion.Item>
            <Accordion.Item title="Contact">
              <p>
                +91 9838000017 <br /> hello@commontime.in
              </p>
            </Accordion.Item>
          </Accordion> */}
        </div>

        {/* Partner Logos */}
        <PartnerLogos />
      </main>

      {/* Footer Text */}
      <div className="py-6 text-center text-gray-500 text-sm">
        a concept by bhatia hospitality group
      </div>
    </div>
  );
}

/* ---------- Partner Logos (Fixed Marquee) ---------- */
function PartnerLogos() {
  const brands = [
    {
      name: "LBB",
      file: "/logos/lbb.jpg",
      url: "https://www.instagram.com/p/DQeUg5qEgLo/?img_index=4&igsh=cHdjaDY1c2ZybDZx",
    },
    {
      name: "Food Talk India",
      file: "/logos/foodtalkindia.jpg",
      url: "https://www.instagram.com/p/DQcDapsElc2/?img_index=4&igsh=MXcxN3M5aDIxMDB2bA==",
    },
    {
      name: "ET Hospitality",
      file: "/logos/ethospitality.svg",
      url: "https://hospitality.economictimes.indiatimes.com/news/restaurants/common-time-debuts-in-lodhi-colony-new-delhi/125049847",
    },
    {
      name: "Restaurant India",
      file: "/logos/restaurantindia.png",
      url: "https://www.restaurantindia.in/news/restaurant-india-news-common-time-debuts-in-lodhi-colony-at-new-delhi.n14295",
    },
    {
      name: "StyleWire",
      file: "/logos/thestylewire.png",
      url: "https://thestylewire.in/2025/11/04/where-to-eat-stay-and-indulge-fresh-openings-across-india/",
    },
    {
      name: "Restaurant India",
      file: "/logos/restaurantindia.png",
      url: "https://www.instagram.com/p/DQlgM5xjpAQ/",
    },
  ];

  return (
    <section className="bg-white" aria-label="Partner logos">
      <div className="max-w-[1200px] mx-auto py-10 px-4 md:px-6 overflow-hidden">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400 text-center md:text-left">
          Listen in to what others are saying
        </p>

        {/* Marquee container */}
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

        {/* Scoped animation styles */}
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

/* ---------- Accordion ---------- */
function Accordion({ children }) {
  return (
    <div className="mt-2 mb-7 rounded-lg border border-white bg-white">
      {children}
    </div>
  );
}

Accordion.Item = function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const innerRef = useRef(null);
  const id = useRef(`panel-${Math.random().toString(36).slice(2, 8)}`).current;

  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open, children]);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex justify-between items-center px-5 py-4 font-semibold text-lg text-gray-900 bg-white transition-colors"
      >
        <span>{title}</span>
        <span className="inline-block w-6 text-center text-2xl">
          {open ? "–" : "+"}
        </span>
      </button>
      <div
        id={id}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
      >
        <div ref={innerRef} className="px-5 pb-4 flex justify-center">
          <p className="max-w-xl text-left">{children.props.children}</p>
        </div>
      </div>
    </div>
  );
};
