/* ==========================================================================
   YOUR WORK — the only file you need to edit to change the portfolio.

   Every project here appears:
     • on the Work page (in this order)
     • on the home page, in "Featured work", if  featured: true
     • on its own case study page:  case.html#<slug>

   IMAGES live in  /work/<slug>/  (01.jpg, 02.jpg, …).
     cover        the image used on the home page and Work page (shown 16:9)
     chapters[].rows   the case study gallery. Each row lists 1 or 2 files.
                       Files can be .jpg / .png / .webp or .mp4 (auto-plays, muted).
     hoverVideo   optional .mp4 that plays when someone hovers the cover
   swatch colours tint the small square next to the client name.
   ========================================================================== */

window.PROJECTS = [
  {
    slug: "bakehouse-ny",
    featured: true,
    client: "Bakehouse NY",
    title: "Baked from scratch since 2016",
    year: "2026",
    category: "Bakery",
    summary: "Identity, voice and a full brand book for a New York wholesale bakery that makes over a thousand breads, pastries, cakes, cookies and pies.",
    cover: "01.jpg",
    swatch: { bg: "#211F5C", fg: "#F9F8E8" },
    chapters: [
      { label: "Brief", body: "Bakehouse NY bakes for restaurants, cafés, hotels and caterers across New York, alongside its own neighbourhood café. Most of the business, 75% or more, is wholesale.", rows: [["02.jpg"]] },
      { label: "Positioning", body: "Plenty of wholesale suppliers sound cold and transactional. Bakehouse NY is the warm one: the same bakery, the same founders and the same products made from scratch, whoever it is talking to. One line carries it everywhere: baked from scratch since 2016.", rows: [["03.jpg"], ["04.jpg"]] },
      { label: "Identity", body: "A BH monogram set inside a seal with a double ring, paired with the BAKEHOUSE wordmark. The seal works on its own as a stamp, sticker or profile picture, and the type pairs Caslon Ionic with Satoshi on blue, cream and black.", rows: [["06.jpg", "07.jpg"], ["08.jpg", "09.jpg"]] },
      { label: "Voice", body: "A master baker's voice: confident, warm and expert without pretension. No hype, never snobbish, never corporate. The book shows it line by line, so 'Croissants made from scratch, baked fresh daily' goes out and 'next level croissants you'll crave' never does.", rows: [["05.jpg", "01.jpg"]] }
    ]
  },
  {
    slug: "nu-cosmetics",
    featured: true,
    client: "nü cosmetics",
    title: "Nothing to hide",
    year: "2026",
    category: "Beauty",
    summary: "Strategy, identity and guidelines for a Nepali beauty brand built on one promise: every claim the customer can check.",
    cover: "04.jpg",
    swatch: { bg: "#5C0711", fg: "#D8E9F3" },
    chapters: [
      { label: "Story", body: "The founders spent years selling other people's beauty brands and watched the market hide what went into its products and overcharge for it. nü is the brand they wished existed: luxury grade quality, priced honestly, with every ingredient open to check.", rows: [["01.jpg"], ["07.jpg", "08.jpg"]] },
      { label: "Strategy", body: "Mission: luxury grade manufacturing without the luxury markup. Vision: to become the trust standard in Nepal's beauty market. The rule behind every line: if we can't prove it, we don't say it. 'Contains 5% niacinamide,' never 'miracle glow formula.'", rows: [["09.jpg"], ["10.jpg", "12.jpg"]] },
      { label: "Colour and type", body: "Maroon is the voice and pale blue is the canvas, carrying the two feelings the brand must always land: trust and calm. Tobias sets headlines, Noir Pro in wide caps handles labels, and Noto Sans covers digital and multilingual content, including Devanagari.", rows: [["13.jpg", "19.jpg"]] },
      { label: "Pattern", body: "The pattern is built from the nü mark itself, repeating in an even, offset grid. The flamingo always appears in rose gold and is never recoloured to match its background.", rows: [["03.jpg"], ["11.jpg", "14.jpg"]] },
      { label: "Applications", body: "Packaging, social, mobile and merchandise, all held to the same claim rule: every claim points to proof the customer can access, from a full ingredient list to a batch record.", rows: [["05.jpg"], ["16.jpg", "17.jpg"], ["18.jpg", "20.jpg"]] }
    ]
  },
  {
    slug: "the-second-plate",
    featured: true,
    client: "The Second Plate",
    title: "Some meals bring you back",
    year: "2026",
    category: "Restaurant",
    summary: "A restaurant identity built on one idea: the first plate feeds you, the second plate is the one you come back for.",
    cover: "02.jpg",
    swatch: { bg: "#C62026", fg: "#F3F3F3" },
    chapters: [
      { label: "Idea", body: "The first plate is just the start. The second plate is the commitment: to return, continue and build with belief. The brand is built by young Nepali minds, slowly and patiently, plate by plate. Tagline: Where the Second Plate Begins.", rows: [["01.jpg"], ["09.jpg", "07.jpg"]] },
      { label: "Voice", body: "Calm, confident and optimistic. Copy follows four patterns: cause and effect, contrast, motivation, and short lines like 'One more plate.' Words to use: build, return, continue, grow. Words to avoid: overhype, rush, loud.", rows: [["11.jpg", "16.jpg"], ["17.jpg", "18.jpg"]] },
      { label: "Identity", body: "A bowl shaped mark in one red (#C62026) with black and off white, set in Value Serif Pro. Imagery stays warm and human: food, hands and the motion of serving.", rows: [["03.jpg", "05.jpg"], ["08.jpg", "10.jpg"]] },
      { label: "Applications", body: "Signage, packaging, cups, receipts, aprons and staff tees, each carrying a line from the voice: 'Always ready for your Second Plate.'", rows: [["14.jpg", "15.jpg"], ["19.jpg", "20.jpg"], ["12.jpg", "21.jpg"], ["06.jpg", "13.jpg"]] }
    ]
  },
  {
    slug: "casa-gioia",
    featured: true,
    client: "Casa Gioia",
    title: "Baked for beautiful moments",
    year: "2026",
    category: "Bakery & café",
    summary: "A hand lettered identity for a bakery and café: script wordmark, CG monogram, packaging, cups and pattern in sky blue and orange.",
    cover: "01.jpg",
    swatch: { bg: "#9EDDF7", fg: "#3A1E0C" },
    chapters: [
      { label: "Identity", body: "A hand lettered Casa Gioia script, a CG monogram in an orange oval, and the line 'Baked for beautiful moments' on a sticker that travels across every piece.", rows: [["10.jpg", "09.jpg"]] },
      { label: "Palette and pattern", body: "Chocolate, cream, sky blue and orange, with a CG repeat pattern for wraps and bags.", rows: [["12.jpg", "02.jpg"], ["07.jpg", "11.jpg"]] },
      { label: "Packaging", body: "Bags, cups, cookie boxes, cake boxes and counter signs, including the Dolce Gioia line for sweets.", rows: [["03.jpg", "04.jpg"], ["05.jpg", "06.jpg"], ["08.jpg", "14.jpg"], ["13.jpg", "15.jpg"]] }
    ]
  },
  {
    slug: "ghumgham",
    featured: true,
    client: "Ghumgham.com",
    title: "Nepal's smarter way to travel",
    year: "2026",
    category: "Travel platform",
    summary: "Identity and logo system for a Nepali travel platform, with an English and Devanagari lockup and a monogram built for app icons.",
    cover: "01.jpg",
    swatch: { bg: "#F15A22", fg: "#FFFFFF" },
    chapters: [
      { label: "Identity", body: "A G monogram that reads as a smiling face, locked up with the Ghumgham.com wordmark, plus an equal Devanagari version, घुमघाम.com, for Nepali audiences.", rows: [["04.jpg"], ["11.jpg"], ["03.jpg"]] },
      { label: "Logo system", body: "A full guide: construction grid, protection areas, monochrome and colour reproduction, misuse rules, partner lockups and placement on photography.", rows: [["05.jpg"], ["06.jpg"], ["09.jpg"], ["10.jpg"], ["12.jpg"], ["14.jpg"]] },
      { label: "Applications", body: "Taxi toppers, bags, bottles, luggage tags, caps and launch posts: 'Nepal's smarter way to travel.' 'See more. Feel more.'", rows: [["02.jpg"], ["15.jpg", "16.jpg"], ["18.jpg", "19.jpg"]] }
    ]
  },
  {
    slug: "eggs-and-more",
    featured: true,
    client: "Eggs & More",
    title: "More and more",
    year: "2026",
    category: "Restaurant",
    summary: "Identity for a restaurant built around eggs: a chunky wordmark, egg shaped frames, packaging and menus in sunny yellow.",
    cover: "02.jpg",
    swatch: { bg: "#FFD400", fg: "#141414" },
    chapters: [
      { label: "Identity", body: "A chunky Eggs & More wordmark with an egg sitting in the o, egg shaped photo frames, and a single sunny yellow that makes the food the hero.", rows: [["01.jpg", "03.jpg"], ["04.jpg", "06.jpg"]] },
      { label: "Applications", body: "Aprons, stickers, food containers, menus, loyalty cards and even an egg shaped mirror for the restaurant.", rows: [["05.jpg", "07.jpg"], ["09.jpg", "10.jpg"], ["08.jpg", "11.jpg"]] }
    ]
  },
  {
    slug: "potala-kitchen",
    featured: true,
    client: "Potala Kitchen",
    title: "Nepali street fuel",
    year: "2026",
    category: "Street food",
    summary: "Identity for a Nepali street food kitchen: a cheeky mascot in sunglasses, food truck livery, takeaway packaging and menus.",
    cover: "01.jpg",
    swatch: { bg: "#D6202A", fg: "#FBB415" },
    chapters: [
      { label: "Identity", body: "A playful Potala Kitchen wordmark with a colour block underline, and a mascot in sunglasses who gives the brand its attitude.", rows: [["02.jpg", "10.jpg"]] },
      { label: "Truck and packaging", body: "Food truck livery, bags, boxes, bowls and cups in red, yellow and cream, framed with a key pattern border.", rows: [["04.jpg", "05.jpg"], ["06.jpg", "07.jpg"], ["13.jpg", "14.jpg"]] },
      { label: "Menu and merch", body: "A street fuel menu, cups, aprons, caps and an event tent built from the same parts.", rows: [["03.jpg", "08.jpg"], ["09.jpg", "12.jpg"], ["15.jpg"]] }
    ]
  },
  {
    slug: "ruby-homes",
    client: "Ruby Homes",
    title: "We build home, not house",
    year: "2026",
    category: "Home builder",
    summary: "Identity and launch campaign for a home builder: a gem shaped house mark, a confident magenta palette, signage, uniforms and sales material.",
    cover: "22.jpg",
    swatch: { bg: "#E5156E", fg: "#FFFFFF" },
    chapters: [
      { label: "Identity", body: "A house mark cut like a gem, the Ruby Homes wordmark, and a magenta and plum palette that stands out on a building site.", rows: [["21.jpg", "01.jpg"]] },
      { label: "Campaign", body: "Bold headlines tagged Smarter, Stronger and Iconic: 'Lived better.' 'Brilliance in every Ruby.' 'What sets us apart is built into every home.'", rows: [["04.jpg", "07.jpg"], ["08.jpg", "18.jpg"], ["02.jpg", "10.jpg"]] },
      { label: "Applications", body: "Hard hats, ID cards, uniforms, stationery, brochures, a sales presentation and office interiors.", rows: [["09.jpg", "11.jpg"], ["12.jpg", "13.jpg"], ["14.jpg", "05.jpg"], ["15.jpg", "16.jpg"], ["19.jpg", "20.jpg"]] }
    ]
  },
  {
    slug: "zabardast-biryani",
    client: "Zabardast Biryani",
    title: "Rooted, rich and bold",
    year: "2025",
    category: "Restaurant",
    summary: "An ornamental identity for a Hyderabadi biryani brand, carried through the interior, menus, packaging, uniforms and an illustrated tee line.",
    cover: "01.jpg",
    swatch: { bg: "#6A1B9A", fg: "#FFD31A" },
    chapters: [
      { label: "Concept", body: "The logo draws on traditional South Indian temple and food signage, shaped into a bold, ornamental emblem that reflects biryani's cultural roots.", rows: [["02.jpg"]] },
      { label: "Values", body: "Five values guide the brand: authenticity, quality first, made with passion, value for money and community connection. The vision is to become the most loved Hyderabadi biryani brand.", rows: [["04.jpg"], ["03.jpg"]] },
      { label: "Applications", body: "Menus in English and Devanagari, a menu board for TV screens, packaging, uniforms and an illustrated tee line.", rows: [["12.jpg"], ["06.jpg"], ["08.jpg"], ["09.jpg", "10.jpg"]] }
    ]
  },
  {
    slug: "yak-and-yeti",
    client: "Yak & Yeti",
    title: "Yak gotta do what yak gotta do",
    year: "2026",
    category: "Himalayan kitchen",
    summary: "Identity for a Himalayan kitchen: yak and yeti mascots, menus, takeaway packaging, street banners and merch.",
    cover: "01.jpg",
    swatch: { bg: "#3A55A6", fg: "#F5EFD9" },
    chapters: [
      { label: "Identity", body: "A yak and yeti duo, drawn with Nepali textile detail, in a blue, red and cream palette.", rows: [["05.jpg", "02.jpg"]] },
      { label: "Applications", body: "Menus, takeaway packaging, street banners ('Every sip a little खुशी'), bags and a campaign announcing the opening.", rows: [["04.jpg", "06.jpg"], ["07.jpg", "09.jpg"], ["03.jpg", "08.jpg"]] }
    ]
  },
  {
    slug: "empower-kind",
    client: "Empower Kind",
    title: "It's connection",
    year: "2026",
    category: "Support services",
    summary: "Identity for a disability support service: a looping ribbon that reads as connection, in a bright four colour system.",
    cover: "09.jpg",
    swatch: { bg: "#7B2CBF", fg: "#FFFFFF" },
    chapters: [
      { label: "Identity", body: "A looping ribbon runs through the logo and every layout, standing for the connection at the heart of support.", rows: [["05.jpg"], ["10.jpg"], ["11.jpg"]] },
      { label: "Campaign", body: "Warm, direct lines like 'Our bond is built on trust' and 'Connected to everything around us', each set in one of four colourways: purple, pink, blue and green.", rows: [["01.jpg", "02.jpg"], ["03.jpg", "04.jpg"], ["06.jpg", "07.jpg"]] }
    ]
  },
  {
    slug: "frogging-nook",
    client: "Frogging Nook",
    title: "Connection over competition",
    year: "2026",
    category: "Crochet community",
    summary: "Identity for a crochet platform driven by its community built on the belief that connection is more powerful than competition.",
    cover: "09.jpg",
    swatch: { bg: "#E0318F", fg: "#FFFFFF" },
    chapters: [
      { label: "Idea", body: "Frogging Nook is more than a crochet brand: it is a shared space for creativity, connection and new beginnings.", rows: [["01.jpg", "02.jpg"]] },
      { label: "Identity", body: "Each rounded form in the mark is a maker, a learner or a creator, separate but connected, together making the Nook. The typeface is bold yet gentle, carrying the rhythm of creating, undoing and growing together.", rows: [["04.jpg", "05.jpg"], ["06.jpg", "07.jpg"]] },
      { label: "Applications", body: "Tote bags, yarn bands, swing tags, stickers, woven labels and the Bloom & Stitch workshop poster.", rows: [["03.jpg", "08.jpg"]] }
    ]
  },
  {
    slug: "mr-gole",
    client: "Mr Gole",
    title: "Mr Gole. Approved.",
    year: "2026",
    category: "Creator brand",
    summary: "A personal brand for a food and travel vlogger: a bold wordmark, a yellow and blue palette, a character illustration, stickers and merch.",
    cover: "01.jpg",
    swatch: { bg: "#FCE45B", fg: "#141414" },
    chapters: [
      { label: "Brief", body: "Mr Gole is a food and travel vlogger who brings the flavours, culture and stories of every place he visits to life across YouTube, Instagram and TikTok. The goal: strengthen his identity as a food and travel creator.", rows: [["02.jpg"]] },
      { label: "Identity", body: "A simple, bold Mr Gole. wordmark, with the full stop making the name feel finished and brand ready. Yellow and black give instant contrast, and blue balances it with calm.", rows: [["04.jpg", "05.jpg"]] },
      { label: "Applications", body: "Stickers, takeaway packaging, caps and social templates that mix English and Nepali to reach a wider audience.", rows: [["03.jpg"], ["06.jpg", "05.jpg"]] }
    ]
  },
  {
    slug: "breathless",
    client: "Breathless",
    title: "Live the spirit of the Himalayas",
    year: "2025",
    category: "Trekking",
    summary: "A social campaign for a 14 day Everest Base Camp trek: black and white mountain photography, route maps and red Breathless markers.",
    cover: "05.jpg",
    swatch: { bg: "#141414", fg: "#E2462B" },
    chapters: [
      { label: "Campaign", body: "Black and white Himalayan photography with route maps from Kathmandu to Namche and red markers that pick out each peak and stop.", rows: [["01.jpg", "02.jpg"]] },
      { label: "Posts", body: "Short, physical lines: '14 days. Countless steps. An iconic trip.'", rows: [["03.jpg", "04.jpg"]] }
    ]
  }
];
