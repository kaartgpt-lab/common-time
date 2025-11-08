import { useState, useRef, useEffect } from "react";

export default function Home() {
  return (
    <div className="font-poppins text-gray-900 bg-white leading-relaxed">
      {/* Hero Section */}
      <section className="relative w-screen h-[90vh] min-h-[380px] overflow-hidden">
        <img
          src="/commontimehero.png"
          alt="Common Time"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <p className="font-[Garet_Book] font-black italic text-lg md:text-xl">
            designed for the everyday rituals
          </p>
        </div>
      </section>

      {/* Accordions */}
      <main className="w-screen px-4 md:px-6 lg:px-8 py-6">
        <div className="font-[Bai_Jamjuree] font-light max-w-[1200px] mx-auto">
          <Accordion>
            <Accordion.Item title="Philosophy">
              <p>
                Common Time was created with a simple belief — that coffee can
                be a lens to see the world through. <br /> <br /> It's our way
                of exploring culture, design, people, and places — one cup at a
                time. We started in Lodhi Colony, New Delhi — a neighbourhood
                that reflects who we are: creative, curious, and full of
                character. Here, we're building more than a café. We're building
                a space where ideas meet craft, and everyday rituals become
                experiences worth remembering.
                <br /> <br /> The name Common Time isn't limited to coffee —
                it's an open frame, a rhythm where many things can exist
                together. Art, travel, design, music, conversations — all
                connected by a shared sense of curiosity and taste. Our dream is
                to grow from this corner of the city into a global movement. A
                brand that represents how modern coffee culture can be
                expressive, intentional, and endlessly evolving.
                <br /> <br /> For us, coffee is the beginning — not the
                boundary. Welcome to Common Time — lets travel the world with
                coffee.
                <br /> <br /> — Jaivardhan Bhatia & Sagar Bhatia, Common Time
              </p>
            </Accordion.Item>
            <Accordion.Item title="Location">
              <p>
                2&3 Meharchand market <br /> Lodhi colony <br /> New Delhi
              </p>
            </Accordion.Item>
            <Accordion.Item title="Timings">
              <p>6am to 10pm everyday</p>
            </Accordion.Item>
            <Accordion.Item title="Contact">
              <p>
                +91 9838000017 <br /> hello@commontime.in
              </p>
            </Accordion.Item>
          </Accordion>
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

/* ---------- Partner Logos ---------- */
/* ---------- Partner Logos ---------- */
function PartnerLogos() {
  const brands = [
    {
      name: "Instagram",
      file: "/logos/lbb.jpg",
      url: "https://www.instagram.com/p/DQeUg5qEgLo/?img_index=4&igsh=cHdjaDY1c2ZybDZx",
    },
    {
      name: "Airbnb",
      file: "/logos/foodtalkindia.jpg",
      url: "https://www.instagram.com/p/DQcDapsElc2/?img_index=4&igsh=MXcxN3M5aDIxMDB2bA==",
    },
    {
      name: "Netflix",
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
      name: "Another",
      file: "/logos/restaurantindia.png",
      url: "https://www.instagram.com/p/DQlgM5xjpAQ/",
    },
  ];

  return (
    <section className="w-screen bg-white" aria-label="Partner logos">
      <div className="max-w-[1200px] mx-auto py-6 px-4 md:px-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-400 text-center md:text-left">
          Listen in to what others are saying
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {brands.map((brand, i) => (
            <a
              key={i}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center h-16 sm:h-20 md:h-24 w-full"
            >
              <img
                src={brand.file}
                alt={brand.name}
                className="max-h-8 sm:max-h-12 md:max-h-20 object-contain"
                loading="lazy"
              />
            </a>
          ))}
        </div>
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
