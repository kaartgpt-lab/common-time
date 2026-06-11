import { useState, useRef, useEffect } from "react";
import { menuData as originalData } from "../data/menuData";

const HINDI_MAP = {
  BLACK: "ब्लैक",
  WHITE: "व्हाइट",
  "ICED DRINKS": "आइस्ड ड्रिंक्स",
  "HOT DRINKS": "हॉट ड्रिंक्स",
  "BATCHED BREW": "बैच्ड ब्रू",
  POUROVERS: "पौरओवर",
  MATCHA: "माचा",
  OTHERS: "अदर्स",
  "BAKED GOODS": "बेक्ड गुड्स",
  SANDWICHES: "सैंडविच",
};

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-10 mt-16 first:mt-0 font-[Bai_Jamjuree]">
    <div className="w-[5px] h-8 bg-black"></div>
    <h2 className="text-3xl font-light tracking-tight lowercase">{title}</h2>
  </div>
);

const MenuItem = ({ name, price, desc }) => (
  <div className="mb-12 font-[Bai_Jamjuree]">
    <div className="flex justify-between items-start gap-4">
      <h3 className="text-[24px] font-normal leading-tight lowercase flex-1">
        {name}
      </h3>

      {price && (
        <span className="text-[22px] font-light whitespace-nowrap">
          {price}
        </span>
      )}
    </div>

    {desc && (
      <p className="text-[12px] text-black font-light mt-1 leading-snug max-w-[240px]">
        {desc}
      </p>
    )}

    <div className="mt-6 border-b border-dotted border-gray-300"></div>
  </div>
);

const PageHeader = () => (
  <div className="flex w-full justify-between lg:pr-8 items-center mb-12 font-[Bai_Jamjuree]">
    <div className="lg:w-20 md:w-18 sm:w-16 w-12 lg:h-20 md:h-18 sm:h-16 h-12">
      <img src="/logo.jpg" alt="Logo" />
    </div>

    <h1 className="font-[Bai_Jamjuree] font-medium text-gray-900 tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-[32px]">
      COMMON <span className="font-light">TIME</span>
    </h1>
  </div>
);

const LANGUAGES = [
  { n: "English", c: "en" },
  { n: "हिन्दी", c: "hi" },
  { n: "French", c: "fr" },
  { n: "German", c: "de" },
  { n: "Spanish", c: "es" },
  { n: "Italian", c: "it" },
  { n: "Portuguese", c: "pt" },
  { n: "Russian", c: "ru" },
  { n: "Japanese", c: "ja" },
  { n: "Korean", c: "ko" },
  { n: "Chinese (Simplified)", c: "zh-CN" },
  { n: "Arabic", c: "ar" },
];

export default function Menu() {
  const [showSelector, setShowSelector] = useState(true);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(originalData);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const wheelRef = useRef(null);

  const [headers, setHeaders] = useState({
    black: "black",
    white: "white",
    iced_drinks: "iced drinks",
    hot_drinks: "hot drinks",
    batched_brew: "batched brew",
    pourovers: "pourovers",
    matcha: "matcha",
    others: "others",
    baked_goods: "baked goods",
    sandwiches: "sandwiches",
  });

  useEffect(() => {
    if (showSelector) {
      setActiveIdx(0);
      setScrollProgress(0);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [showSelector]);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const updateScroll = () => {
      window.requestAnimationFrame(() => {
        const idx = Math.round(el.scrollTop / 80);
        setActiveIdx(Math.max(0, Math.min(idx, LANGUAGES.length - 1)));
        setScrollProgress(el.scrollTop / (el.scrollHeight - el.clientHeight));
      });
    };

    el.addEventListener("scroll", updateScroll, { passive: true });
    return () => el.removeEventListener("scroll", updateScroll);
  }, [showSelector]);

  const translateMenu = async (targetLang) => {
    if (targetLang === "en") {
      setMenu(originalData);
      setHeaders({
        black: "black",
        white: "white",
        iced_drinks: "iced drinks",
        hot_drinks: "hot drinks",
        batched_brew: "batched brew",
        pourovers: "pourovers",
        matcha: "matcha",
        others: "others",
        baked_goods: "baked goods",
        sandwiches: "sandwiches",
      });
      setShowSelector(false);
      return;
    }

    setLoading(true);

    const translatedData = JSON.parse(JSON.stringify(originalData));
    const categories = Object.keys(translatedData);

    let stringMap = [
      { id: 0, text: "BLACK", type: "header", key: "black" },
      { id: 1, text: "WHITE", type: "header", key: "white" },
      { id: 2, text: "ICED DRINKS", type: "header", key: "iced_drinks" },
      { id: 3, text: "HOT DRINKS", type: "header", key: "hot_drinks" },
      { id: 4, text: "BATCHED BREW", type: "header", key: "batched_brew" },
      { id: 5, text: "POUROVERS", type: "header", key: "pourovers" },
      { id: 6, text: "MATCHA", type: "header", key: "matcha" },
      { id: 7, text: "OTHERS", type: "header", key: "others" },
      { id: 8, text: "BAKED GOODS", type: "header", key: "baked_goods" },
      { id: 9, text: "SANDWICHES", type: "header", key: "sandwiches" },
    ];

    let currentId = 10;

    categories.forEach((cat) => {
      translatedData[cat].forEach((item, idx) => {
        stringMap.push({
          id: currentId++,
          text: item.name.toUpperCase(),
          type: "name",
          cat,
          itemIdx: idx,
        });

        if (item.desc) {
          stringMap.push({
            id: currentId++,
            text: item.desc,
            type: "desc",
            cat,
            itemIdx: idx,
          });
        }
      });
    });

    const chunkSize = 20;
    let finalResults = {};

    try {
      for (let i = 0; i < stringMap.length; i += chunkSize) {
        const chunk = stringMap.slice(i, i + chunkSize);

        const filteredChunk = chunk.filter((s) => {
          if (targetLang === "hi" && HINDI_MAP[s.text]) {
            finalResults[s.id] = HINDI_MAP[s.text];
            return false;
          }
          return true;
        });

        if (filteredChunk.length > 0) {
          const query = encodeURIComponent(
            filteredChunk.map((s) => `${s.id}: ${s.text}`).join("\n")
          );

          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${query}`;

          const response = await fetch(url);
          const result = await response.json();

          result[0].forEach((segment) => {
            if (!segment[0]) return;

            const lines = segment[0].split("\n");

            lines.forEach((line) => {
              const match = line.match(/^(\d+)\s?:\s?(.+)/);
              if (match) finalResults[match[1]] = match[2].trim();
            });
          });
        }
      }

      const getVal = (id, fallback) => finalResults[id] || fallback;

      setHeaders({
        black: getVal(0, "black").toLowerCase(),
        white: getVal(1, "white").toLowerCase(),
        iced_drinks: getVal(2, "iced drinks").toLowerCase(),
        hot_drinks: getVal(3, "hot drinks").toLowerCase(),
        batched_brew: getVal(4, "batched brew").toLowerCase(),
        pourovers: getVal(5, "pourovers").toLowerCase(),
        matcha: getVal(6, "matcha").toLowerCase(),
        others: getVal(7, "others").toLowerCase(),
        baked_goods: getVal(8, "baked goods").toLowerCase(),
        sandwiches: getVal(9, "sandwiches").toLowerCase(),
      });

      stringMap.slice(10).forEach((s) => {
        const translatedText = finalResults[s.id];

        if (translatedText) {
          if (s.type === "name") {
            translatedData[s.cat][s.itemIdx].name = translatedText;
          }

          if (s.type === "desc") {
            translatedData[s.cat][s.itemIdx].desc = translatedText;
          }
        }
      });

      setMenu(translatedData);
      setShowSelector(false);
    } catch (e) {
      console.error("Critical Mapping Error:", e);
      setShowSelector(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black font-[Garet_Book] pb-32 overflow-x-hidden selection:bg-black selection:text-white">
      {showSelector && (
        <div className="fixed inset-0 top-[70px] md:top-[85px] bg-white z-[40] flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <p className="mt-2 text-2xl tracking-[0.3em] uppercase font-semibold font-[Bai_Jamjuree]">
            Select Language
          </p>

          <div className="max-w-2xl w-full flex flex-col items-center px-6 relative z-10">
            <div className="flex items-center justify-center gap-12 mt-5 w-full h-[400px] relative">
              <div className="flex flex-col items-center h-72 w-10 relative">
                <div className="w-[4px] h-full bg-black/10 rounded-full"></div>

                <div
                  className="absolute w-4 h-4 bg-black rounded-full transition-all duration-150 ease-out left-1/2 -translate-x-1/2 shadow-2xl border-2 border-white"
                  style={{ top: `${scrollProgress * 100}%` }}
                ></div>
              </div>

              <div className="relative w-80 h-full flex flex-col items-center">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-20 border-y border-black/[0.08] pointer-events-none bg-gray-50/30"></div>

                <div
                  ref={wheelRef}
                  className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar mask-fade-edges py-40"
                >
                  {LANGUAGES.map((l, i) => {
                    const dist = Math.abs(i - activeIdx);

                    return (
                      <button
                        key={l.c}
                        onClick={() => translateMenu(l.c)}
                        disabled={loading}
                        className="w-full h-20 flex flex-col items-center justify-center snap-center transition-all duration-150 ease-out"
                        style={{
                          opacity:
                            dist === 0 ? 1 : Math.max(0.12, 1 - dist * 0.45),
                          transform: `scale(${dist === 0 ? 1.18 : 1 - dist * 0.15
                            })`,
                          filter: dist === 0 ? "none" : `blur(${dist * 1.2}px)`,
                          letterSpacing: dist === 0 ? "0.3em" : "0.05em",
                        }}
                      >
                        <span className="text-2xl font-light uppercase font-[Bai_Jamjuree]">
                          {l.n}
                        </span>

                        {dist === 0 && !loading && (
                          <div className="mt-4 flex gap-1 animate-fadeIn">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                            <div className="w-8 h-[1px] bg-black/30 self-center"></div>
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                          </div>
                        )}

                        {dist === 0 && loading && (
                          <div className="mt-4 w-5 h-5 border-[2px] border-black border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`transition-all duration-1000 ease-in-out ${showSelector ? "blur-3xl opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-12 pt-16">
          <PageHeader />

          <SectionHeader title={headers.black} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.black.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.white} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.white.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.iced_drinks} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.iced_drinks.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.hot_drinks} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.hot_drinks.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-8 mt-4 notranslate font-[Bai_Jamjuree]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[5px] h-8 bg-black"></div>
                <span className="text-sm font-bold uppercase tracking-wider">
                  Add:
                </span>
              </div>

              <ul className="text-[13px] space-y-1 text-gray-700">
                <li>Milklab oat / almond / coconut milk +80</li>
                <li>Lactose free milk +0</li>
                <li>Make it decaf +100</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[5px] h-8 bg-black"></div>
                <span className="text-sm font-bold uppercase tracking-wider">
                  Make it:
                </span>
              </div>

              <ul className="text-[13px] space-y-1 text-gray-700">
                <li>Extra hot</li>
                <li>Half espresso shot</li>
                <li>Extra espresso shot +50</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-12 border-t border-gray-100 mt-10 pt-10 font-[Bai_Jamjuree]">
          <PageHeader />

          <SectionHeader title={headers.batched_brew} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.batched_brew.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.pourovers} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.pourovers.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.matcha} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.matcha.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.others} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.others.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-12 border-t border-gray-100 mt-10 pt-10 font-[Bai_Jamjuree]">
          <PageHeader />

          <SectionHeader title={headers.baked_goods} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.baked_goods.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <SectionHeader title={headers.sandwiches} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {menu.sandwiches.map((item, i) => (
              <MenuItem key={i} {...item} />
            ))}
          </div>

          <div className="mt-24 flex justify-between items-end border-t pt-8">
            <div className="text-[11px] text-gray-400 tracking-widest uppercase font-[Bai_Jamjuree]">
              <p className="notranslate">@itscommontime | www.commontime.in</p>
              <p className="mt-2 notranslate">
                lodhi colony | vasant vihar | khan market
              </p>
            </div>
          </div>
        </div>
      </div>

      {!showSelector && (
        <button
          onClick={() => setShowSelector(true)}
          className="fixed bottom-10 right-10 flex items-center gap-4 bg-white/70 backdrop-blur-xl border border-black/10 px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all group z-50"
        >
          <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>

          <span className="text-[11px] uppercase font-bold text-black opacity-70 group-hover:opacity-100 font-[Bai_Jamjuree]">
            Change Language
          </span>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .mask-fade-edges {
          mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}