/**
 * Static product catalog — primary source of truth for PDP content.
 * Keyed by slug. ProductDetail renders fully from this data even without
 * a matching Supabase row; Supabase adds cart/image capability.
 */

export const PRODUCT_CATALOG = {

  // ─────────────────────────────────────────────────────────────
  // BEANS
  // ─────────────────────────────────────────────────────────────

  "lodhi-espresso-blend": {
    name: "Lodhi Espresso Blend",
    category: "beans",
    subtitle: "everyday espresso",
    intro: "Our everyday espresso blend, inspired by our first location and made for the cups we return to often.",
    roast: "Medium-dark",
    roastLevel: 4,
    tastingNotes: ["dark chocolate", "citrus", "melon sweetness"],
    characteristics: {
      origin: null,
      varietal: null,
      process: null,
      acidity: null,
      body: "Heavy",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": null, "200g": 650 },
      defaultSize: "200g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Lodhi is our everyday blend — the one we built the café around and the one we keep coming back to. Named after our Lodhi Garden location, it carries a heavy body with notes of dark chocolate, a bright citrus edge and a melon sweetness that lingers long after the cup is done. It is made to be reliable. A coffee that works as espresso, as a flat white, as the pull you don't have to think about. This is the blend we'd reach for every morning.",
    howToBrew: {
      method: "Espresso",
      params: [
        { label: "Dose", value: "18g" },
        { label: "Yield", value: "36g" },
        { label: "Time", value: "26–28s" },
        { label: "Temp", value: "93°C" },
      ],
      note: "Dial in tighter for a flat white. For a filter brew, use a coarser grind and 93°C water over 3–4 minutes.",
    },
  },

  "house-pourover": {
    name: "House Pourover",
    category: "beans",
    subtitle: "everyday filter",
    intro: "A medium roast from Sirangalli, made for a balanced everyday pourover.",
    roast: "Medium",
    roastLevel: 3,
    tastingNotes: ["malic sweetness", "red berry", "dark chocolate"],
    characteristics: {
      origin: "Sirangalli, India",
      varietal: null,
      process: "Natural",
      acidity: null,
      body: "Medium",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": null, "200g": 750 },
      defaultSize: "200g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "The House Pourover is our way of bringing Sirangalli home. A medium roast with a natural process, it carries malic sweetness and red berry up front, with a base of dark chocolate that grounds the cup. Familiar enough for every morning, complex enough to stay interesting. Brew it slow, let it bloom, and it rewards you with something that feels both effortless and considered. This is the coffee we recommend to most people who visit the café and ask what to take home.",
    howToBrew: {
      method: "Pourover",
      params: [
        { label: "Coffee", value: "15g" },
        { label: "Water", value: "250ml" },
        { label: "Temp", value: "92–94°C" },
        { label: "Time", value: "3:30–4:00" },
      ],
      note: "Bloom with 30ml for 30 seconds, then pour in steady circles. Best with a Hario V60 or Kalita Wave.",
    },
  },

  "jasmine-blossom": {
    name: "Jasmine Blossom",
    category: "beans",
    subtitle: "floral filter",
    intro: "A washed light-medium roast from Sirangalli Kotebetta, delicate and tea-like.",
    roast: "Light-medium",
    roastLevel: 2,
    tastingNotes: ["jasmine black tea", "raspberry sweetness"],
    characteristics: {
      origin: "Sirangalli Kotebetta, India",
      varietal: null,
      process: "Washed",
      acidity: "Delicate",
      body: "Tea-like",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": null, "200g": 750 },
      defaultSize: "200g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Jasmine Blossom is the quieter, more considered side of Sirangalli. A washed light-medium roast from Kotebetta, it has a tea-like quality that makes it feel closer to a fine tea than a conventional coffee. Jasmine and black tea float up front, followed by a gentle raspberry sweetness that drifts through as the cup cools. For those who prefer their coffee gentle, floral, and unhurried — this is the one.",
    howToBrew: {
      method: "Pourover / Cold Brew",
      params: [
        { label: "Coffee", value: "15g" },
        { label: "Water", value: "250ml" },
        { label: "Temp", value: "89–91°C" },
        { label: "Time", value: "3:00–3:30" },
      ],
      note: "Brew slightly cooler than usual to protect the floral notes. Also excellent as an overnight cold brew — 60g in 1L cold water, 12 hours.",
    },
  },

  "santa-ana-sunset": {
    name: "Santa Ana Sunset",
    category: "beans",
    subtitle: "single origin",
    intro: "A Bourbon natural from San Agustin, El Salvador — round body, delicate acidity.",
    roast: "Light-medium",
    roastLevel: 2,
    tastingNotes: ["fruity grape", "hazelnut", "delicate acidity"],
    characteristics: {
      origin: "San Agustin, El Salvador",
      varietal: "Bourbon",
      process: "Natural",
      acidity: "Delicate",
      body: "Round",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": 1500, "200g": null },
      defaultSize: "100g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Santa Ana Sunset comes from the Bourbon variety grown in San Agustin, El Salvador — a region known for coffees with clarity and warmth. A natural process coffee with a round, full body and a delicate acidity that never overwhelms. The cup opens with fruity grape and settles into a hazelnut warmth, making it feel grounded and effortless in equal measure. An evening coffee, if there is such a thing.",
    howToBrew: {
      method: "Pourover",
      params: [
        { label: "Coffee", value: "15g" },
        { label: "Water", value: "240ml" },
        { label: "Temp", value: "92°C" },
        { label: "Time", value: "3:30–4:00" },
      ],
      note: "A medium-coarse grind works well. Best enjoyed as a straight pourover — let the fruit and body come through cleanly, without milk.",
    },
  },

  "cherry-bomb": {
    name: "Cherry Bomb",
    category: "beans",
    subtitle: "single origin",
    intro: "A vibrant Ethiopian coffee with black cherry, dark chocolate and a full, creamy body.",
    roast: "Medium-light",
    roastLevel: 2,
    tastingNotes: ["black cherry", "dark chocolate", "fruity"],
    characteristics: {
      origin: "Kaffa, Tega & Tula Farm, Ethiopia",
      varietal: "Heirloom",
      process: "Washed",
      acidity: "Vibrant",
      body: "Full and creamy",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": 1500, "200g": null },
      defaultSize: "100g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Cherry Bomb is an expressive, vibrant Ethiopian coffee from the Tega and Tula Farm in Kaffa — one of the original heartlands of coffee. This heirloom washed coffee brings black cherry and dark chocolate to the foreground, with a full, creamy body that carries the fruit all the way through. The acidity is present but never sharp — it gives the cup life and brightness without being difficult. This is a bold cup for those who want their coffee to feel like something. It announces itself and it stays.",
    howToBrew: {
      method: "Pourover / Espresso",
      params: [
        { label: "Coffee", value: "15g" },
        { label: "Water", value: "250ml" },
        { label: "Temp", value: "93–94°C" },
        { label: "Time", value: "3:30–4:00" },
      ],
      note: "Works well as both a pourover and a light espresso pull. As espresso: 18g in, 36g out, 28–30 seconds.",
    },
  },

  "dinner-wine": {
    name: "Dinner Wine",
    category: "beans",
    subtitle: "single origin",
    intro: "A naturally processed Colombian coffee with red grape, peach and a sweet, juicy finish.",
    roast: "Medium-light",
    roastLevel: 2,
    tastingNotes: ["red grape", "peach", "sweet finish"],
    characteristics: {
      origin: "Huila 755, Colombia",
      varietal: "Castillo",
      process: "Natural",
      acidity: "Complex",
      body: "Full and juicy",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": 1500, "200g": null },
      defaultSize: "100g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Dinner Wine is a rich, juicy coffee with a fruit-forward profile and a layered finish. The cup brings together red grape, peach and a gentle sweetness, balanced by complex acidity and a full body. Made for those who enjoy a coffee that feels expressive, rounded, and a little unexpected. From Huila 755 in Colombia, this Castillo natural carries the character of a wine-like fermentation — deep, a little dark, with a finish that stays.",
    howToBrew: {
      method: "Pourover",
      params: [
        { label: "Coffee", value: "15g" },
        { label: "Water", value: "250ml" },
        { label: "Temp", value: "92–93°C" },
        { label: "Time", value: "3:30–4:00" },
      ],
      note: "Let it cool slightly before drinking — the fruit notes open up as the cup loses temperature. Also excellent as an overnight cold brew.",
    },
  },

  aster: {
    name: "Aster",
    category: "beans",
    subtitle: "single origin",
    intro: "A natural Panama Baby Geisha from Finca Hartmann, floral and smooth with a soft nutty sweetness.",
    roast: "Light",
    roastLevel: 1,
    tastingNotes: ["nutty", "floral", "apricot", "hazelnut"],
    characteristics: {
      origin: "Finca Hartmann, Panama",
      varietal: "Baby Geisha",
      process: "Natural",
      acidity: "Low",
      body: "Smooth",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": 1500, "200g": null },
      defaultSize: "100g",
    },
    grindOptions: ["espresso", "filter"],
    readMore:
      "Aster is a gentle, refined coffee with a soft floral character and a smooth body. This natural Panama Baby Geisha from Finca Hartmann carries notes of apricot and hazelnut, with low acidity and a lingering sweetness that stays with you long after the cup is empty. Baby Geisha is a rare variety — smaller in yield, more delicate in character, and more nuanced in flavour than its full-size counterpart. A coffee made for slow mornings, for afternoons that deserve attention.",
    howToBrew: {
      method: "Pourover",
      params: [
        { label: "Coffee", value: "14g" },
        { label: "Water", value: "225ml" },
        { label: "Temp", value: "88–90°C" },
        { label: "Time", value: "3:00–3:30" },
      ],
      note: "Brew at a lower temperature to protect the delicate floral notes. Use a slow, steady pour and avoid boiling water.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // MERCH
  // ─────────────────────────────────────────────────────────────

  "can-you-do-an-iced-pourover-tee": {
    name: "Can You Do An Iced Pourover Tee",
    category: "merch",
    price: 1000,
    description:
      'The "Can You Do An Iced Pourover?" tee is made in black cotton terry with a soft, structured feel. Designed for everyday wear, coffee runs, and warmer hours at Common Time.',
    story:
      "An iced pourover is not the simplest order. But it is one of the better ones — a clean, cold, bright cup that takes a little more attention to get right. This tee is for the people who know that. Black, slightly oversized, 240 GSM cotton terry with a statement that earns its place.",
    specs: [
      { label: "Fabric", value: "Black cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
      { label: "Sizes", value: "S, M, L, XL" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },

  "elevated-rituals-tee": {
    name: "Elevated Rituals Tee",
    category: "merch",
    price: 800,
    description:
      "The Elevated Rituals tee is made in white cotton terry, designed as an easy everyday layer — a soft, minimal t-shirt built around the idea of making daily rituals feel a little more considered.",
    story:
      "Rituals don't need to be complicated. They just need to be intentional. This tee is for the person who makes their bed before their coffee, who grinds fresh instead of scooping, who wears something they actually like even on a slow day. White cotton terry, soft enough for everyday.",
    specs: [
      { label: "Fabric", value: "White cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
      { label: "Sizes", value: "S, M, L, XL" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },

  "coffee-is-a-lifestyle-tee": {
    name: "Coffee Is A Lifestyle Tee",
    category: "merch",
    price: 1000,
    description:
      "The Coffee Is A Lifestyle tee is made in white cotton terry with a clean everyday fit. Designed for people who like coffee to be more than a morning habit — a part of how the day moves.",
    story:
      "Coffee is not just a drink. It is a reason to pause, a reason to meet someone, a ritual that structures the day. If that sounds like you, this one is yours. White cotton terry, relaxed fit, a statement without the noise.",
    specs: [
      { label: "Fabric", value: "White cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
      { label: "Sizes", value: "S, M, L, XL" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },

  "coffee-after-6-pm-scented-candle": {
    name: "Coffee After 6 PM Scented Candle",
    category: "merch",
    price: 1500,
    description:
      "Coffee After 6 PM is a scented candle created for slower evenings and familiar rooms. With notes of dark roast, warm sugar, and a hint of spice, it brings the feeling of coffee after hours into the space.",
    story:
      "There is a particular quality to coffee in the evening — when it is more atmosphere than caffeine, more ritual than necessity. This candle was made to hold that feeling. Created in collaboration with Ishita Gupta, it fills a room with warmth, not urgency. Light it when the day slows down.",
    specs: [
      { label: "Type", value: "Scented candle" },
      { label: "Scent Notes", value: "Dark roast, warm sugar, spice" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },

  "ceramic-dripper-set-for-pourover": {
    name: "Ceramic Dripper Set for Pourover",
    category: "merch",
    price: 2000,
    description:
      "A ceramic dripper set designed for pourover brewing. Precise, clean, and made for the ritual of a slow cup.",
    story:
      "Pourover is a method that rewards attention. The right vessel makes the ritual feel considered — not just functional. This ceramic dripper set is made for those who want their brew setup to be as deliberate as the cup it produces.",
    specs: [
      { label: "Material", value: "Ceramic" },
      { label: "Designed for", value: "Pourover brewing" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "hold-my-coffee-bag": {
    name: "Hold My Coffee Bag",
    category: "merch",
    price: 1200,
    description:
      "The Hold My Coffee Bag is made in vegan leather and designed to carry coffee, small objects and daily essentials. A functional everyday piece created in collaboration with Ishita Gupta.",
    story:
      "Designed to hold a bag of beans, your phone, your keys, and not much else. Everything you need for a coffee run — or an early morning out. Vegan leather, clean lines, made to be used and carried without much thought. Created with Ishita Gupta.",
    specs: [
      { label: "Material", value: "Vegan leather" },
      { label: "Made for", value: "Coffee runs and everyday carry" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },

  "symbol-cap": {
    name: "Symbol Cap",
    category: "merch",
    price: 800,
    description:
      "An everyday cap featuring the Common Time symbol. Made to be worn often, with a simple shape and a quiet brand detail.",
    story:
      "The Common Time symbol, worn simply. Cotton terry, one size, adjustable fit. For days when you want to wear something that says something without having to explain it. Structured but casual, made for all the hours in between.",
    specs: [
      { label: "Material", value: "Cotton terry" },
      { label: "Size", value: "One size" },
      { label: "Fit", value: "Adjustable" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "ritual-bottle": {
    name: "Ritual Bottle",
    category: "merch",
    price: 1100,
    description:
      "An insulated bottle made for hot and cold beverages. Built for daily use — your one vessel for every hour.",
    story:
      "Hot coffee at 7am. Cold brew by 11. Water through the afternoon. One bottle, built for all of it. Insulated, minimal, and designed to hold whatever the day calls for without making a thing of it.",
    specs: [
      { label: "Type", value: "Insulated bottle" },
      { label: "Made for", value: "Hot and cold beverages" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "to-go-tumbler": {
    name: "To-Go Tumbler",
    category: "merch",
    price: 800,
    description:
      "A 350 ml tumbler designed for coffee on the move. Simple, functional, and made to be used often — from the first cup of the day to the one you carry out.",
    story:
      "The tumbler you reach for without thinking. 350ml — enough for a flat white or a filter pour, without being too much to carry. Reusable, clean in design, made for the morning that starts in motion.",
    specs: [
      { label: "Capacity", value: "350 ml" },
      { label: "Type", value: "Reusable tumbler" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "timeless-tray": {
    name: "Timeless Tray",
    category: "merch",
    price: 1800,
    description:
      "The Timeless Tray is a lean, durable tray made for coffee, objects, and everyday rituals. Functional in form and quiet in design, it is built for both serving and display.",
    story:
      "A surface for the things that matter in a day — the cup, the phone, the book, the key. The Timeless Tray holds them without noise, in a form that works on the counter, the table, or wherever the ritual happens to live.",
    specs: [
      { label: "Details", value: "Lean and durable" },
      { label: "Made for", value: "Coffee, tableware, objects" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "functional-cup-for-pourover": {
    name: "Functional Cup for Pourover",
    category: "merch",
    price: 1000,
    description:
      "A 200 ml pourover cup designed to hold warmth for longer. Made for slower cups, daily brews and the quiet rhythm of pourover coffee.",
    story:
      "Pourover is not a quick cup. This vessel was made with that in mind — 200ml, designed to retain warmth as you drink slowly, designed to feel right in the hand for the kind of coffee that doesn't need to be rushed.",
    specs: [
      { label: "Capacity", value: "200 ml" },
      { label: "Designed for", value: "Pourover brewing" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "ritual-cup-and-hourglass-saucer": {
    name: "Ritual Cup & Hourglass Saucer",
    category: "merch",
    price: 1200,
    description:
      "A 200 ml cup and hourglass saucer set designed around the ritual of pourover. The cup holds warmth for longer, while the saucer brings the Common Time hourglass detail to the everyday table.",
    story:
      "The hourglass is the symbol of Common Time — the idea that time slows when you pay attention to it. This saucer carries that detail to the table, paired with a 200ml cup made for pourover. A set designed to make the everyday feel considered.",
    specs: [
      { label: "Capacity", value: "200 ml" },
      { label: "Type", value: "Cup and saucer set" },
      { label: "Saucer", value: "Hourglass-inspired design" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "cortado-and-espresso-cup": {
    name: "Cortado & Espresso Cup",
    category: "merch",
    price: 800,
    description:
      "A 120 ml mini cup designed for cortado, espresso, and sensory tasting. Compact in size and functional in use, it is made for smaller coffee moments with more attention.",
    story:
      "Some cups are for lingering. This one is for precision — 120ml, designed to hold a cortado or an espresso with the right weight and feel. Also excellent for sensory tasting when comparing coffees side by side.",
    specs: [
      { label: "Capacity", value: "120 ml" },
      { label: "Made for", value: "Cortado, espresso, sensory tasting" },
    ],
    sizeOptions: null,
    collaboration: null,
  },

  "set-of-3-pencils": {
    name: "Set of 3 Pencils",
    category: "merch",
    price: 150,
    description:
      "A set of three pencils designed for notes, thoughts, lists, and slower writing. Created in collaboration with Ishita Gupta, with the line: write more, type less.",
    story:
      "Writing by hand changes how you think. Slower, more deliberate, harder to delete. These pencils were made with that in mind — a simple thing for a slower practice. The instruction is on the pencil: write more, type less. Created with Ishita Gupta.",
    specs: [
      { label: "Contents", value: "Set of 3 pencils" },
      { label: "Tagline", value: "write more, type less" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },
};

// Backwards-compatible named exports (consumed only by ProductDetail.jsx, now uses PRODUCT_CATALOG directly)
export const BEAN_CONTENT = Object.fromEntries(
  Object.entries(PRODUCT_CATALOG).filter(([, v]) => v.category === "beans")
);
export const MERCH_CONTENT = Object.fromEntries(
  Object.entries(PRODUCT_CATALOG).filter(([, v]) => v.category === "merch")
);
