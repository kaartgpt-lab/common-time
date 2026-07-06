/**
 * Rich product content — sourced from the product page copy doc.
 * Keyed by product slug. Merged with Supabase data in ProductDetail.
 */

export const BEAN_CONTENT = {
  "lodhi-espresso-blend": {
    subtitle: "everyday espresso",
    intro:
      "Our everyday espresso blend, inspired by our first location and made for the cups we return to often.",
    roast: "Medium-dark",
    tastingNotes: ["dark chocolate", "citrus", "melon sweetness"],
    characteristics: {
      body: "Heavy",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": null, "200g": 650 },
      defaultSize: "200g",
    },
    grindOptions: ["espresso", "filter"],
    readMore: null,
  },
  "house-pourover": {
    subtitle: "everyday filter",
    intro:
      "A medium roast from Sirangalli, made for a balanced everyday pourover.",
    roast: "Medium",
    tastingNotes: ["malic sweetness", "red berry", "dark chocolate"],
    characteristics: {
      origin: "Sirangalli, India",
      process: "Natural",
      body: "Medium",
    },
    packaging: {
      sizes: ["100g", "200g"],
      prices: { "100g": null, "200g": 750 },
      defaultSize: "200g",
    },
    grindOptions: ["espresso", "filter"],
    readMore: null,
  },
  "jasmine-blossom": {
    subtitle: "floral filter",
    intro:
      "A washed light-medium roast from Sirangalli Kotebetta, delicate and tea-like.",
    roast: "Light-medium",
    tastingNotes: ["jasmine black tea", "raspberry sweetness"],
    characteristics: {
      origin: "Sirangalli Kotebetta, India",
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
    readMore: null,
  },
  "santa-ana-sunset": {
    subtitle: "single origin",
    intro:
      "A Bourbon natural from San Agustin, El Salvador — round body, delicate acidity.",
    roast: "Light-medium",
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
    readMore: null,
  },
  "cherry-bomb": {
    subtitle: "single origin",
    intro:
      "A vibrant Ethiopian coffee with black cherry, dark chocolate and a full, creamy body.",
    roast: "Medium-light",
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
    readMore: null,
  },
  "dinner-wine": {
    subtitle: "single origin",
    intro:
      "A naturally processed Colombian coffee with red grape, peach and a sweet, juicy finish.",
    roast: "Medium-light",
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
      "Dinner Wine is a rich, juicy coffee with a fruit-forward profile and a layered finish. The cup brings together red grape, peach and a gentle sweetness, balanced by complex acidity and a full body. Made for those who enjoy a coffee that feels expressive, rounded, and a little unexpected.",
  },
  aster: {
    subtitle: "single origin",
    intro:
      "A natural Panama Baby Geisha from Finca Hartmann, floral and smooth with a soft nutty sweetness.",
    roast: "Light",
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
      "Aster is a gentle, refined coffee with a soft floral character and a smooth body. This natural Panama Baby Geisha carries notes of apricot and hazelnut, with low acidity and a lingering sweetness that stays with you long after the cup is empty.",
  },
};

export const MERCH_CONTENT = {
  "can-you-do-an-iced-pourover-tee": {
    description:
      'The "Can You Do An Iced Pourover?" tee is made in black cotton terry with a soft, structured feel. Designed for everyday wear, coffee runs, and warmer hours at Common Time.',
    specs: [
      { label: "Fabric", value: "Black cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },
  "elevated-rituals-tee": {
    description:
      "The Elevated Rituals tee is made in white cotton terry, designed as an easy everyday layer — a soft, minimal t-shirt built around the idea of making daily rituals feel a little more considered.",
    specs: [
      { label: "Fabric", value: "White cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },
  "coffee-is-a-lifestyle-tee": {
    description:
      "The Coffee Is A Lifestyle tee is made in white cotton terry with a clean everyday fit. Designed for people who like coffee to be more than a morning habit — a part of how the day moves.",
    specs: [
      { label: "Fabric", value: "White cotton terry" },
      { label: "Weight", value: "240 GSM" },
      { label: "Fit", value: "Relaxed everyday" },
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    collaboration: null,
  },
  "coffee-after-6-pm-scented-candle": {
    description:
      "Coffee After 6 PM is a scented candle created for slower evenings and familiar rooms. With notes of dark roast, warm sugar, and a hint of spice, it brings the feeling of coffee after hours into the space.",
    specs: [
      { label: "Type", value: "Scented candle" },
      { label: "Scent Notes", value: "Dark roast, warm sugar, spice" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },
  "ceramic-dripper-set-for-pourover": {
    description:
      "A ceramic dripper set designed for pourover brewing. Precise, clean, and made for the ritual of a slow cup.",
    specs: [
      { label: "Material", value: "Ceramic" },
      { label: "Designed for", value: "Pourover brewing" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "hold-my-coffee-bag": {
    description:
      "The Hold My Coffee Bag is made in vegan leather and designed to carry coffee, small objects and daily essentials. A functional everyday piece created in collaboration with Ishita Gupta.",
    specs: [
      { label: "Material", value: "Vegan leather" },
      { label: "Made for", value: "Coffee runs and everyday carry" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },
  "symbol-cap": {
    description:
      "An everyday cap featuring the Common Time symbol. Made to be worn often, with a simple shape and a quiet brand detail.",
    specs: [
      { label: "Material", value: "Cotton terry" },
      { label: "Size", value: "One size" },
      { label: "Fit", value: "Adjustable" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "ritual-bottle": {
    description:
      "An insulated bottle made for hot and cold beverages. Built for daily use — your one vessel for every hour.",
    specs: [
      { label: "Type", value: "Insulated bottle" },
      { label: "Made for", value: "Hot and cold beverages" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "to-go-tumbler": {
    description:
      "A 350 ml tumbler designed for coffee on the move. Simple, functional, and made to be used often — from the first cup of the day to the one you carry out.",
    specs: [
      { label: "Capacity", value: "350 ml" },
      { label: "Type", value: "Reusable tumbler" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "timeless-tray": {
    description:
      "The Timeless Tray is a lean, durable tray made for coffee, objects, and everyday rituals. Functional in form and quiet in design, it is built for both serving and display.",
    specs: [
      { label: "Details", value: "Lean and durable" },
      { label: "Made for", value: "Coffee, tableware, objects" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "functional-cup-for-pourover": {
    description:
      "A 200 ml pourover cup designed to hold warmth for longer. Made for slower cups, daily brews and the quiet rhythm of pourover coffee.",
    specs: [
      { label: "Capacity", value: "200 ml" },
      { label: "Designed for", value: "Pourover brewing" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "ritual-cup-and-hourglass-saucer": {
    description:
      "A 200 ml cup and hourglass saucer set designed around the ritual of pourover. The cup holds warmth for longer, while the saucer brings the Common Time hourglass detail to the everyday table.",
    specs: [
      { label: "Capacity", value: "200 ml" },
      { label: "Type", value: "Cup and saucer set" },
      { label: "Designed for", value: "Pourover" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "cortado-and-espresso-cup": {
    description:
      "A 120 ml mini cup designed for cortado, espresso, and sensory tasting. Compact in size and functional in use, it is made for smaller coffee moments with more attention.",
    specs: [
      { label: "Capacity", value: "120 ml" },
      { label: "Made for", value: "Cortado, espresso, sensory tasting" },
    ],
    sizeOptions: null,
    collaboration: null,
  },
  "set-of-3-pencils": {
    description:
      "A set of three pencils designed for notes, thoughts, lists, and slower writing. Created in collaboration with Ishita Gupta, with the line: write more, type less.",
    specs: [
      { label: "Contents", value: "Set of 3 pencils" },
      { label: "Tagline", value: "write more, type less" },
    ],
    sizeOptions: null,
    collaboration: "Ishita Gupta",
  },
};
