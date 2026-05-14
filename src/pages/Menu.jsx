import { useState, useRef, useEffect } from "react";
import { menuData as originalData } from "../data/menuData";
import {motion} from  "framer-motion";
// --- MANUAL TRANSLITERATION MAP FOR HINDI ---
// This overrides the translation engine for specific coffee terms
const HINDI_MAP = {
  "HOT COFFEE": "हॉट कॉफ़ी",
  "ICED COFFEE": "आइस्ड कॉफ़ी",
  "POUROVER": "पौरओवर",
  "MATCHA": "माचा",
  "DRINKING CHOCOLATE": "ड्रिंकिंग चॉकलेट",
  "WELLNESS LOOSE LEAF TEA": "वेलनेस लूज़ लीफ टी",
  "REFRESHERS AND SWEET TREATS": "रिफ्रेशर्स और स्वीट ट्रीट्स",
  "BAKED GOODS": "बेक्ड गुड्स",

  // Hot Coffee
  "ESPRESSO": "एस्प्रेसो",
  "LONG BLACK": "लॉन्ग ब्लैक",
  "FLAT WHITE": "फ्लैट व्हाइट",
  "COMPETITION LATTE": "कॉम्पिटिशन लाटे",
  "CAPPUCCINO": "कैपुचिनो",
  "CORTADO": "कोर्टाडो",
  "MOCHA": "मोचा",
  "EARL GREY FLAT WHITE": "अर्ल ग्रे फ्लैट व्हाइट",
  "NUTMEG LATTE": "नटमेग लाटे",
  "SALTED CARAMEL LATTE": "सॉल्टेड कैरामेल लाटे",
  "SPANISH LATTE": "स्पैनिश लाटे",
  "HONEY CAPPUCCINO": "हनी कैपुचिनो",

  // Iced Coffee
  "UNSWEETENED ICED LATTE": "अनस्वीटन्ड आइस्ड लाटे",
  "COMMON TIME ICED LATTE": "कॉमन टाइम आइस्ड लाटे",
  "STRONG ICED LATTE": "स्ट्रॉन्ग आइस्ड लाटे",
  "ICED LONG BLACK": "आइस्ड लॉन्ग ब्लैक",
  "ICED BON BON": "आइस्ड बॉन बॉन",
  "ICED MOCHA": "आइस्ड मोचा",
  "COLD BLACK": "कोल्ड ब्लैक",
  "COLD BLACK BUMBLE": "कोल्ड ब्लैक बंबल",
  "COCONUT SUGAR COLD BLACK": "कोकोनट शुगर कोल्ड ब्लैक",
  "COCOSPRESSO": "कोकोस्प्रेसो",
  "THE BIG APPLE": "द बिग एप्पल",
  "MONT BLANC": "मोंट ब्लांक",
  "ICED BROWN BUTTER LATTE": "आइस्ड ब्राउन बटर लाटे",
  "COLD COFFEE": "कोल्ड कॉफ़ी",

  // Matcha / Tea
  "CLASSIC MATCHA LATTE": "क्लासिक माचा लाटे",
  "KYOTO FIZZ": "क्योटो फ़िज़",
  "VANILLA MATCHA LATTE": "वेनिला माचा लाटे",
  "CHERRY MATCHA": "चेरी माचा",
  "MONSOON (LEMON TULSI)": "मानसून (लेमन तुलसी)",
  "MOGRA (JASMINE BLOSSOMS)": "मोगरा (जैस्मीन ब्लॉसम्स)",
  "MUMBAI MATE": "मुंबई मेट",

  // Baked Goods
  "BUTTER CROISSANT": "बटर क्रोइसैन्ट",
  "ALMOND CROISSANT": "आलमंड क्रोइसैन्ट",
  "ESPRESSO, KAHLUA & HAZELNUT CROISSANT": "एस्प्रेसो, कहलुआ और हेज़लनट क्रोइसैन्ट",
  "CINNAMON ROLL": "सिनमन रोल",
  "OAT AND ANZAC COOKIE (VEGAN)": "ओट और एंजैक कुकी (शाकाहारी)",
  "CHOCO CHIP AND SEA SALT COOKIE": "चोको चिप और सी सॉल्ट कुकी",
  "LEMON POPPY SEED COCONUT TEA CAKE": "लेमन पॉपी सीड कोकोनट टी केक",
  "TOMATO, OLIVE & RICCOTA CHEESE DANISH": "टोमेटो, ऑलिव और रिकाेटा चीज़ डेनिश",
  "RASPBERRY & WHITE CHOCOLATE COOKIE": "रास्पबेरी और व्हाइट चॉकलेट कुकी",
  "BANANA CHOCOLATE CINNAMON TEA CAKE": "बनाना चॉकलेट सिनमन टी केक",
  "GLUTEN FREE CHOCOLATE CAKE SLICE": "ग्लूटेन फ्री चॉकलेट केक स्लाइस",
  "LAYERED CARROT CAKE": "लेयर्ड कैरेट केक",
  "PESTO, TOMATO AND CHEESE CROISSANT": "पेस्टो, टोमेटो और चीज़ क्रोइसैन्ट",
  "GARLIC CHEESE CROISSANT": "गार्लिक चीज़ क्रोइसैन्ट",
  "CHICKEN SAUSAGE AND RED BEAN CROISSANT": "चिकन सॉसेज और रेड बीन क्रोइसैन्ट",
  "HAM, MUSTARD & CHEESE CROISSANT": "हैम, मस्टर्ड और चीज़ क्रोइसैन्ट",
  "MUSHROOM CROISSANT": "मशरुम क्रोइसैन्ट",
  "CAPRESE PESTO FOCACCIA SANDWICH": "कैप्रेसे पेस्टो फोकैशिया सैंडविच",
  "MUSHROOM, ONION & CHEDDER FOCACCIA SANDWICH": "मशरूम, अनियन और चेडर फोकैशिया सैंडविच",
  "PERI PERI COTTAGE CHEESE CIABBATA SANDWICH": "पेरी पेरी कॉटेज चीज़ सिआबाटा सैंडविच",
  "SMOKED CHIPOTLE CHICKEN FOCACCIA SANDWICH": "स्मोक्ड चिपोटल चिकन फोकैशिया सैंडविच",
  "AVOCADO, CUCUMBER & DILL CREAM CHEESE BAGEL": "एवोकैडो, ककड़ी और डिल क्रीम चीज़ बैगेल",
  "CHICKEN SALAMI & CREAM CHEESE BAGEL": "चिकन सलामी और क्रीम चीज़ बैगेल",
  "MAMA ROSA CHICKEN FOCACCIA SANDWICH": "मामा रोज़ा चिकन फोकैशिया सैंडविच"
};

// --- CUSTOM UI COMPONENTS ---
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-10 mt-16 first:mt-0 font-[Bai_Jamjuree]">
    <div className="w-[5px] h-8 bg-black"></div>
    <h2 className="text-3xl font-light tracking-tight lowercase">{title}</h2>
  </div>
);

const MenuItem = ({ name, price, desc }) => (
  <div className="flex flex-col mb-12 relative font-[Bai_Jamjuree]" >
    <div className="flex items-start gap-2">
      <h3 className={`text-[24px] font-normal leading-tight lowercase`}>
        {name}
      </h3>
    </div>
    {desc && (
      <p className="text-[12px] text-black font-light mt-1 leading-snug max-w-[240px]">
        {desc}
      </p>
    )}
    <span className="text-[18px] font-normal mt-4 block">{price}</span>
    <div className="mt-6 border-b border-dotted border-gray-300 w-2/3"></div>
  </div>
);

const PageHeader = () => (
  <div className="flex w-full justify-between lg:pr-8 items-center mb-12 font-[Bai_Jamjuree]">
    <div className="lg:w-20 md:w-18 sm:w-16 w-12 lg:h-20 md:h-18 sm:h-16 h-12">
        <img src="/logo.jpg" alt="Logo" />
    </div>
    <h1 className="font-[Bai_Jamjuree] font-medium text-gray-900 tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-[32px]">COMMON <span className="font-light ">TIME</span></h1>
  </div>
);

const LANGUAGES = [
  { n: 'English', c: 'en' }, { n: 'हिन्दी', c: 'hi' }, { n: 'Afrikaans', c: 'af' }, { n: 'Albanian', c: 'sq' }, { n: 'Amharic', c: 'am' }, { n: 'Arabic', c: 'ar' }, { n: 'Armenian', c: 'hy' }, { n: 'Azerbaijani', c: 'az' }, { n: 'Basque', c: 'eu' }, { n: 'Belarusian', c: 'be' }, { n: 'Bengali', c: 'bn' }, { n: 'Bosnian', c: 'bs' }, { n: 'Bulgarian', c: 'bg' }, { n: 'Catalan', c: 'ca' }, { n: 'Cebuano', c: 'ceb' }, { n: 'Chinese (Simplified)', c: 'zh-CN' }, { n: 'Chinese (Traditional)', c: 'zh-TW' }, { n: 'Corsican', c: 'co' }, { n: 'Croatian', c: 'hr' }, { n: 'Czech', c: 'cs' }, { n: 'Danish', c: 'da' }, { n: 'Dutch', c: 'nl' }, { n: 'Esperanto', c: 'eo' }, { n: 'Estonian', c: 'et' }, { n: 'Filipino', c: 'tl' }, { n: 'Finnish', c: 'fi' }, { n: 'French', c: 'fr' }, { n: 'Frisian', c: 'fy' }, { n: 'Galician', c: 'gl' }, { n: 'Georgian', c: 'ka' }, { n: 'German', c: 'de' }, { n: 'Greek', c: 'el' }, { n: 'Gujarati', c: 'gu' }, { n: 'Haitian Creole', c: 'ht' }, { n: 'Hausa', c: 'ha' }, { n: 'Hawaiian', c: 'haw' }, { n: 'Hebrew', c: 'he' }, { n: 'Hungarian', c: 'hu' }, { n: 'Icelandic', c: 'is' }, { n: 'Igbo', c: 'ig' }, { n: 'Indonesian', c: 'id' }, { n: 'Irish', c: 'ga' }, { n: 'Italian', c: 'it' }, { n: 'Japanese', c: 'ja' }, { n: 'Javanese', c: 'jw' }, { n: 'Kannada', c: 'kn' }, { n: 'Kazakh', c: 'kk' }, { n: 'Khmer', c: 'km' }, { n: 'Kinyarwanda', c: 'rw' }, { n: 'Korean', c: 'ko' }, { n: 'Kurdish', c: 'ku' }, { n: 'Kyrgyz', c: 'ky' }, { n: 'Lao', c: 'lo' }, { n: 'Latin', c: 'la' }, { n: 'Latvian', c: 'lv' }, { n: 'Lithuanian', c: 'lt' }, { n: 'Luxembourgish', c: 'lb' }, { n: 'Macedonian', c: 'mk' }, { n: 'Malagasy', c: 'mg' }, { n: 'Malay', c: 'ms' }, { n: 'Malayalam', c: 'ml' }, { n: 'Maltese', c: 'mt' }, { n: 'Maori', c: 'mi' }, { n: 'Marathi', c: 'mr' }, { n: 'Mongolian', c: 'mn' }, { n: 'Myanmar (Burmese)', c: 'my' }, { n: 'Nepali', c: 'ne' }, { n: 'Norwegian', c: 'no' }, { n: 'Nyanja', c: 'ny' }, { n: 'Odia', c: 'or' }, { n: 'Pashto', c: 'ps' }, { n: 'Persian', c: 'fa' }, { n: 'Polish', c: 'pl' }, { n: 'Portuguese', c: 'pt' }, { n: 'Punjabi', c: 'pa' }, { n: 'Romanian', c: 'ro' }, { n: 'Russian', c: 'ru' }, { n: 'Samoan', c: 'sm' }, { n: 'Scots Gaelic', c: 'gd' }, { n: 'Serbian', c: 'sr' }, { n: 'Sesotho', c: 'st' }, { n: 'Shona', c: 'sn' }, { n: 'Sindhi', c: 'sd' }, { n: 'Sinhala', c: 'si' }, { n: 'Slovak', c: 'sk' }, { n: 'Slovenian', c: 'sl' }, { n: 'Somali', c: 'so' }, { n: 'Spanish', c: 'es' }, { n: 'Sundanese', c: 'su' }, { n: 'Swahili', c: 'sw' }, { n: 'Swedish', c: 'sv' }, { n: 'Tajik', c: 'tg' }, { n: 'Tamil', c: 'ta' }, { n: 'Tatar', c: 'tt' }, { n: 'Telugu', c: 'te' }, { n: 'Thai', c: 'th' }, { n: 'Turkish', c: 'tr' }, { n: 'Turkmen', c: 'tk' }, { n: 'Ukrainian', c: 'uk' }, { n: 'Urdu', c: 'ur' }, { n: 'Uyghur', c: 'ug' }, { n: 'Uzbek', c: 'uz' }, { n: 'Vietnamese', c: 'vi' }, { n: 'Welsh', c: 'cy' }, { n: 'Xhosa', c: 'xh' }, { n: 'Yiddish', c: 'yi' }, { n: 'Yoruba', c: 'yo' }, { n: 'Zulu', c: 'zu' }
];

export default function Menu() {
  const [showSelector, setShowSelector] = useState(true);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(originalData);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const wheelRef = useRef(null);
  const [headers, setHeaders] = useState({
    hot: "hot coffee", iced: "iced coffee", pour: "pourover", matcha: "matcha",
    choc: "drinking chocolate", tea: "wellness loose leaf tea", refresh: "refreshers and sweet treats",
    bakes: "baked goods"
  });

  useEffect(() => {
    if (showSelector) {
      // --- FIX: RESET SELECTOR STATE WHEN OPENING ---
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
      setHeaders({ hot: "hot coffee", iced: "iced coffee", pour: "pourover", matcha: "matcha", choc: "drinking chocolate", tea: "wellness loose leaf tea", refresh: "refreshers and sweet treats", bakes: "baked goods" });
      setShowSelector(false); return;
    }

    setLoading(true);
    const translatedData = JSON.parse(JSON.stringify(originalData));
    const categories = Object.keys(translatedData);

    let stringMap = [
      { id: 0, text: "HOT COFFEE", type: "header", key: "hot" },
      { id: 1, text: "ICED COFFEE", type: "header", key: "iced" },
      { id: 2, text: "POUROVER", type: "header", key: "pour" },
      { id: 3, text: "MATCHA", type: "header", key: "matcha" },
      { id: 4, text: "DRINKING CHOCOLATE", type: "header", key: "choc" },
      { id: 5, text: "WELLNESS LOOSE LEAF TEA", type: "header", key: "tea" },
      { id: 6, text: "REFRESHERS AND SWEET TREATS", type: "header", key: "refresh" },
      { id: 7, text: "BAKED GOODS", type: "header", key: "bakes" }
    ];

    let currentId = 8;
    categories.forEach(cat => {
      translatedData[cat].forEach((item, idx) => {
        stringMap.push({ id: currentId++, text: item.name.toUpperCase(), type: "name", cat, itemIdx: idx });
        if (item.desc) {
          stringMap.push({ id: currentId++, text: item.desc, type: "desc", cat, itemIdx: idx });
        }
      });
    });

    const chunkSize = 20;
    let finalResults = {};

    try {
      for (let i = 0; i < stringMap.length; i += chunkSize) {
        const chunk = stringMap.slice(i, i + chunkSize);
        
        // --- BYPASS LOGIC FOR HINDI TRANSLITERATION ---
        const filteredChunk = chunk.filter(s => {
          if (targetLang === 'hi' && HINDI_MAP[s.text]) {
            finalResults[s.id] = HINDI_MAP[s.text];
            return false; // Skip API for this specific string
          }
          return true;
        });

        if (filteredChunk.length > 0) {
          const query = encodeURIComponent(filteredChunk.map(s => `${s.id}: ${s.text}`).join("\n"));
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${query}`;
          
          const response = await fetch(url);
          const result = await response.json();
          
          result[0].forEach(segment => {
            if (!segment[0]) return;
            const lines = segment[0].split("\n");
            lines.forEach(line => {
              const match = line.match(/^(\d+)\s?:\s?(.+)/);
              if (match) finalResults[match[1]] = match[2].trim();
            });
          });
        }
      }

      const getVal = (id, fallback) => finalResults[id] || fallback;

      setHeaders({
        hot: getVal(0, "hot coffee").toLowerCase(),
        iced: getVal(1, "iced coffee").toLowerCase(),
        pour: getVal(2, "pourover").toLowerCase(),
        matcha: getVal(3, "matcha").toLowerCase(),
        choc: getVal(4, "drinking chocolate").toLowerCase(),
        tea: getVal(5, "wellness loose leaf tea").toLowerCase(),
        refresh: getVal(6, "refreshers and sweet treats").toLowerCase(),
        bakes: getVal(7, "baked goods").toLowerCase()
      });

      stringMap.slice(8).forEach(s => {
        const translatedText = finalResults[s.id];
        if (translatedText) {
          if (s.type === "name") translatedData[s.cat][s.itemIdx].name = translatedText;
          if (s.type === "desc") translatedData[s.cat][s.itemIdx].desc = translatedText;
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
    <main className="min-h-screen bg-[#FDFDFD] text-black font-sans pb-32 overflow-x-hidden selection:bg-black selection:text-white">
      
      {showSelector && (
        <div className="fixed inset-0 top-[70px] md:top-[85px] bg-white z-[40] flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gray-100 rounded-full blur-[120px] animate-pulse"></div>
            <p className="mt-2 text-2xl tracking-[0.3em] uppercase font-semibold font-[Bai_Jamjuree]">Select Language</p>
          <div className="max-w-2xl w-full flex flex-col items-center px-6 relative z-10 ">
            <div className="flex items-center justify-center gap-12 mt-5 w-full h-[400px] relative">
              <div className="flex flex-col items-center h-72 w-10 relative">
                
                <div className="w-[4px] h-full bg-black/10 rounded-full"></div>
                <div className="absolute w-4 h-4 bg-black rounded-full transition-all duration-150 ease-out left-1/2 -translate-x-1/2 shadow-2xl border-2 border-white" style={{ top: `${scrollProgress * 100}%` }}></div>
              </div>
              
              <div className="relative w-80 h-full flex flex-col items-center">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-20 border-y border-black/[0.08] pointer-events-none bg-gray-50/30"></div>
                
                <div ref={wheelRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar mask-fade-edges py-40">
                  {LANGUAGES.map((l, i) => {
                    const dist = Math.abs(i - activeIdx);
                    return (
                      <button key={l.c} onClick={() => translateMenu(l.c)} disabled={loading} className="w-full h-20 flex flex-col items-center justify-center snap-center transition-all duration-150 ease-out will-change-[transform,opacity,filter]" style={{ opacity: dist === 0 ? 1 : Math.max(0.12, 1 - dist * 0.45), transform: `scale(${dist === 0 ? 1.18 : 1 - dist * 0.15})`, filter: dist === 0 ? 'none' : `blur(${dist * 1.2}px)`, letterSpacing: dist === 0 ? '0.3em' : '0.05em' }}>
                        <span className="text-2xl font-light uppercase font-[Bai_Jamjuree]">{l.n}</span>
                        {dist === 0 && !loading && <div className="mt-4 flex gap-1 animate-fadeIn"><div className="w-1.5 h-1.5 bg-black rounded-full"></div><div className="w-8 h-[1px] bg-black/30 self-center"></div><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>}
                        {dist === 0 && loading && <div className="mt-4 w-5 h-5 border-[2px] border-black border-t-transparent rounded-full animate-spin"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      <div className={`transition-all duration-1000 ease-in-out ${showSelector ? 'blur-3xl opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="max-w-[1400px] mx-auto px-12 pt-16">
          <PageHeader />
          <SectionHeader title={headers.hot} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">{menu.hot_coffee.map((item, i) => <MenuItem key={i} {...item} />)}</div>
          <SectionHeader title={headers.iced} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">{menu.iced_coffee.map((item, i) => <MenuItem key={i} {...item} />)}</div>
          <div className="flex gap-8 mt-4 notranslate font-[Bai_Jamjuree] px-12">
             <div><div className="flex items-center gap-2 mb-4"><div className="w-[5px] h-8 bg-black"></div><span className="text-sm font-bold uppercase tracking-wider">Add:</span></div><ul className="text-[13px] space-y-1 text-gray-700"><li>Milk lab oat/almond/coconut milk +80</li><li>Lactose free milk +0</li><li>Colombian decaf +100</li></ul></div>
             <div><div className="flex items-center gap-2 mb-4"><div className="w-[5px] h-8 bg-black"></div><span className="text-sm font-bold uppercase tracking-wider">Make it:</span></div><ul className="text-[13px] space-y-1 text-gray-700"><li>Extra hot</li><li>Half espresso shot</li><li>Extra espresso shot +30</li></ul></div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-12 border-t border-gray-100 mt-10 pt-10 font-[Bai_Jamjuree]">
          <PageHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24">
            <div>
              <SectionHeader title={headers.pour} /><div className="mb-16"><h3 className="text-[24px] font-normal mb-2 lowercase">hot/iced</h3><p className="text-[12px] text-black font-light leading-snug">exceptional indian and international single origin coffee</p></div>
              <SectionHeader title={headers.matcha} /><div className="grid grid-cols-2 gap-8 lg:gap-0">{menu.matcha.map((item, i) => <MenuItem key={i} {...item} />)}</div>
            </div>
            <div><SectionHeader title={headers.tea} /><div className="grid grid-cols-2 gap-8 lg:gap-0">{menu.tea.map((item, i) => <MenuItem key={i} {...item} />)}</div></div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-12 border-t border-gray-100 mt-10 pt-10 font-[Bai_Jamjuree]">
          <PageHeader />
          <SectionHeader title={headers.bakes} /><div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">{menu.baked_goods.map((item, i) => <MenuItem key={i} {...item} />)}</div>
          <div className="mt-24 flex justify-between items-end border-t pt-8">
            <div className="text-[11px] text-gray-400 tracking-widest uppercase font-[Bai_Jamjuree]">
              <p className="notranslate">@itscommontime | www.commontime.in</p>
              <p className="mt-2 notranslate">lodhi colony | vasant vihar | khan market</p>
            </div>
          </div>
        </div>
      </div>

      {!showSelector && (
        <button onClick={() => setShowSelector(true)} className="fixed bottom-10 right-10 flex items-center gap-4 bg-white/70 backdrop-blur-xl border border-black/10 px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all group z-50">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          <span className="text-[11px] uppercase font-bold text-black opacity-70 group-hover:opacity-100 font-[Bai_Jamjuree]">Change Language</span>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </main>
  );
}