export const categories = [
  {
    id: "aluminium",
    name: "Aluminium Ladders",
    description: "Lightweight, corrosion-resistant ladders ideal for home, trade, and industrial tasks.",
    icon: "Layers",
    count: 4,
    badge: "Most Popular"
  },
  {
    id: "folding",
    name: "Folding Ladders",
    description: "Multi-position articulated joint ladders that convert into scaffolding, A-frame, or leaning positions.",
    icon: "Maximize2",
    count: 3,
    badge: "Versatile"
  },
  {
    id: "step",
    name: "Step Ladders",
    description: "Self-supporting A-frame step ladders with wide non-slip platforms and top tool trays.",
    icon: "ChevronUp",
    count: 4,
    badge: "Essential"
  },
  {
    id: "extension",
    name: "Extension Ladders",
    description: "Heavy-duty 2-section & 3-section rope/pulley extended ladders reaching up to 36 feet.",
    icon: "ArrowUpRight",
    count: 3,
    badge: "High Reach"
  },
  {
    id: "telescopic",
    name: "Telescopic Ladders",
    description: "Ultra-compact collapsible ladders with smart lock technology for effortless storage & mobility.",
    icon: "MoveVertical",
    count: 2,
    badge: "Compact"
  },
  {
    id: "industrial",
    name: "Industrial Ladders",
    description: "Heavy-duty fiberglass and reinforced alloy ladders engineered for factories & power plants.",
    icon: "ShieldAlert",
    count: 3,
    badge: "Heavy Duty"
  },
  {
    id: "platform",
    name: "Platform Ladders",
    description: "Mobile podium platform ladders with safety handrails and brake casters for warehouse assembly.",
    icon: "Box",
    count: 2,
    badge: "Safe Podium"
  },
  {
    id: "customized",
    name: "Customized Ladders",
    description: "Tailor-made industrial scaffolding, tank ladders, and architectural access structures.",
    icon: "Wrench",
    count: 2,
    badge: "Tailored"
  }
];

export const products = [
  {
    id: "al-pro-step-6",
    name: "Akash Pro-Glide 6-Step Aluminium Ladder",
    category: "Step Ladders",
    categoryId: "step",
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewsCount: 142,
    stock: "In Stock",
    featured: true,
    isNew: false,
    material: "Aluminium Alloy (6063-T6)",
    height: "6 ft (1.8m)",
    steps: 6,
    weightCapacity: "150 kg",
    productWeight: "6.2 kg",
    foldable: true,
    usage: "Domestic & Commercial",
    warranty: "5 Years Manufacturer Warranty",
    certification: "EN131 European Safety Standard",
    images: [
      "/images/aluminium_step.jpg",
      "/images/hero_ladder.jpg"
    ],
    description: "Engineered for maximum stability and ease of movement, the Akash Pro-Glide 6-Step Step Ladder is manufactured from high-grade 6063-T6 aircraft aluminium alloy. Featuring wide 4-inch deep anti-skid steps and a built-in top tool tray for holding paint buckets and tools.",
    features: [
      "Heavy-duty aircraft-grade alloy construction",
      "Wide non-slip ribbed steps with safety rubber caps",
      "Integrated top tool tray with magnetic screw holder",
      "Reinforced heavy-duty side hinges and locking spreaders",
      "Scratch-free rubber foot pads protecting floor surfaces"
    ],
    safetyInfo: [
      "Inspect rungs and hinges prior to every usage",
      "Ensure all 4 feet sit firmly on flat, dry ground",
      "Do not stand above the top safe platform level",
      "Always maintain 3-point contact while climbing"
    ]
  },
  {
    id: "tele-smart-12",
    name: "Akash FlexiLock 12.5ft Telescopic Ladder",
    category: "Telescopic Ladders",
    categoryId: "telescopic",
    price: 6499,
    originalPrice: 7999,
    rating: 4.8,
    reviewsCount: 98,
    stock: "In Stock",
    featured: true,
    isNew: true,
    material: "Anodized Aluminium Alloy",
    height: "12.5 ft (3.8m)",
    steps: 12,
    weightCapacity: "150 kg",
    productWeight: "10.5 kg",
    foldable: true,
    usage: "Domestic & Commercial",
    warranty: "3 Years Manufacturer Warranty",
    certification: "EN131-6 Certified Smart Lock",
    images: [
      "/images/telescopic_ladder.jpg",
      "/images/hero_ladder.jpg"
    ],
    description: "The Akash FlexiLock Telescopic Ladder is the ultimate compact access tool. Extends step-by-step up to 12.5 feet and collapses down to just 2.8 feet for effortless trunk storage and single-person portability. Features soft-close air dampening mechanism to prevent thumb pinching.",
    features: [
      "One-button soft-close retraction mechanism prevents pinching",
      "Independent rung locking indicators (Green/Red)",
      "Collapses to 85cm for compact storage in car boots",
      "Heavy-duty bottom stabilizer bar with anti-slip rubber shoes",
      "Heavy nylon securing strap for convenient transport"
    ],
    safetyInfo: [
      "Verify all rung locking pins are fully engaged (Green indicator)",
      "Never extend ladder from top down; extend from bottom upwards",
      "Keep hands clear between rungs during retraction"
    ]
  },
  {
    id: "fg-ind-ext-24",
    name: "Akash ElectroSafe 24ft Fiberglass Extension Ladder",
    category: "Industrial Ladders",
    categoryId: "industrial",
    price: 14999,
    originalPrice: 17500,
    rating: 4.95,
    reviewsCount: 64,
    stock: "In Stock",
    featured: true,
    isNew: false,
    material: "Fiberglass (FRP Non-Conductive)",
    height: "24 ft (7.3m)",
    steps: 24,
    weightCapacity: "250 kg (Heavy Duty Class IA)",
    productWeight: "21.0 kg",
    foldable: false,
    usage: "Industrial & Electrical",
    warranty: "7 Years Industrial Warranty",
    certification: "ANSI A14.5 Electrical Safety Compliant",
    images: [
      "/images/fiberglass_extension.jpg",
      "/images/hero_ladder.jpg"
    ],
    description: "Designed specifically for electricians, utility contractors, and industrial plants, the Akash ElectroSafe 24ft extension ladder features non-conductive yellow fiberglass rails rated up to 37.5kV. Heavy-duty aluminum D-rungs provide comfortable flat standing surface.",
    features: [
      "High dielectric non-conductive FRP composite side rails",
      "Slip-resistant D-shaped aluminum rungs crimped into rails",
      "Smooth double-pulley rope hoist mechanism with heavy-duty rung locks",
      "Swivel safety shoes with rubber pads and ice-pick spurs",
      "Impact-resistant end caps protect walls and roof eaves"
    ],
    safetyInfo: [
      "Mandatory for all high-voltage electrical installations",
      "Set up at correct 4:1 slope angle (75 degrees)",
      "Inspect fiberglass rails for cracks or resin degradation"
    ]
  },
  {
    id: "multi-fold-16",
    name: "Akash MasterFold 16ft 4x4 Multi-Purpose Ladder",
    category: "Folding Ladders",
    categoryId: "folding",
    price: 7899,
    originalPrice: 9499,
    rating: 4.85,
    reviewsCount: 112,
    stock: "In Stock",
    featured: true,
    isNew: false,
    material: "Reinforced Heavy Steel & Aluminium Alloy",
    height: "16 ft (4.7m)",
    steps: 16,
    weightCapacity: "180 kg",
    productWeight: "14.2 kg",
    foldable: true,
    usage: "Commercial & Industrial",
    warranty: "5 Years Manufacturer Warranty",
    certification: "EN131 Heavy Duty Certified",
    images: [
      "/images/multipurpose_folding.jpg",
      "/images/hero_ladder.jpg"
    ],
    description: "Replaces 5 separate ladders! The Akash MasterFold multi-purpose ladder features 4 sections connected by heavy-duty 360-degree automatic locking click hinges. Easily transforms into A-frame ladder, extended straight ladder, work platform scaffold, or staircase ladder.",
    features: [
      "4-section 4-rung configuration with 6 automatic safety lock joints",
      "Includes 2 steel platform plates for scaffold work bench setup",
      "Dual stabilizer bars with wide rubber feet for lateral stability",
      "Rust-proof anodized industrial coating",
      "Holds up to 180 kg load capacity"
    ],
    safetyInfo: [
      "Always click locking levers completely before applying weight",
      "Do not use platform setup without installing the steel deck plates",
      "Keep hinge mechanism lubricated and free of grit"
    ]
  },
  {
    id: "al-ext-32",
    name: "Akash TitanReach 32ft Double Extension Ladder",
    category: "Extension Ladders",
    categoryId: "extension",
    price: 12499,
    originalPrice: 14999,
    rating: 4.9,
    reviewsCount: 81,
    stock: "Only 4 Left",
    featured: false,
    isNew: true,
    material: "Aluminium Alloy (6061-T6)",
    height: "32 ft (9.7m)",
    steps: 32,
    weightCapacity: "200 kg",
    productWeight: "24.5 kg",
    foldable: false,
    usage: "Industrial & Construction",
    warranty: "5 Years Manufacturer Warranty",
    certification: "ISO 9001:2015 Approved",
    images: [
      "/images/hero_ladder.jpg",
      "/images/aluminium_step.jpg"
    ],
    description: "Built for exterior building maintenance, painters, and roofing contractors. The TitanReach 32ft extension ladder features heavy-duty box section stiles, heavy rope pulley system, and gravity-latch automatic rung locks.",
    features: [
      "Seamless extruded box alloy stiles for zero flex at full extension",
      "Spring-loaded gravity rung locks engage instantly",
      "Rope and pulley assembly for smooth one-person elevation",
      "Heavy duty wall wheels prevent scuffing building facades",
      "Deeply serrated anti-slip round rungs"
    ],
    safetyInfo: [
      "Tie off top of ladder when working at height exceeding 20ft",
      "Clear overhead power lines before elevating",
      "Never overreach; keep buckle centered between stiles"
    ]
  },
  {
    id: "plat-podium-8",
    name: "Akash SafetyPodium 8ft Industrial Platform Ladder",
    category: "Platform Ladders",
    categoryId: "platform",
    price: 18999,
    originalPrice: 22000,
    rating: 4.95,
    reviewsCount: 45,
    stock: "In Stock",
    featured: false,
    isNew: true,
    material: "Heavy Duty Aluminium & Steel Mesh",
    height: "8 ft Platform Height (12ft Reach)",
    steps: 8,
    weightCapacity: "300 kg (Industrial Heavy Duty)",
    productWeight: "32.0 kg",
    foldable: true,
    usage: "Warehouse & Assembly Plants",
    warranty: "10 Years Structural Warranty",
    certification: "OSHA & EN131-7 Warehouse Podium Compliant",
    images: [
      "/images/aluminium_step.jpg",
      "/images/hero_ladder.jpg"
    ],
    description: "Designed for long-duration warehouse picking and factory maintenance. Features a full 360-degree enclosed guardrail waist platform, deep 600x500mm non-slip tread plate, and auto-braking spring casters that lock automatically when stepped on.",
    features: [
      "Spacious 600x500mm diamond pattern aluminium work platform",
      "360-degree waist height safety guardrail with safety chain gate",
      "4 heavy-duty 4-inch swivel casters with spring lock brake action",
      "Folds flat for compact side wall storage",
      "Tool shelf and bucket hook integrated into top railing"
    ],
    safetyInfo: [
      "Engage manual wheel brakes when working on inclined surfaces",
      "Do not lean outside the guardrail perimeter",
      "Ensure gate safety latch is secured before commencing task"
    ]
  },
  {
    id: "al-home-4",
    name: "Akash HandyStep 4-Step Home Aluminium Ladder",
    category: "Step Ladders",
    categoryId: "step",
    price: 2499,
    originalPrice: 2999,
    rating: 4.75,
    reviewsCount: 230,
    stock: "In Stock",
    featured: false,
    isNew: false,
    material: "Lightweight Aluminium",
    height: "4 ft (1.2m)",
    steps: 4,
    weightCapacity: "120 kg",
    productWeight: "4.1 kg",
    foldable: true,
    usage: "Domestic & Household",
    warranty: "3 Years Manufacturer Warranty",
    certification: "EN131 Light Duty",
    images: [
      "/images/aluminium_step.jpg",
      "/images/telescopic_ladder.jpg"
    ],
    description: "The perfect household assistant for kitchen cabinets, light bulb replacement, and curtain fitting. Featherlight at just 4.1kg, yet sturdy with anti-skid step grooves and slim 5cm folded profile.",
    features: [
      "Ultra-lightweight 4.1kg frame easy for anyone to carry",
      "Folds to ultra-slim 5cm thickness to slide behind doors or under beds",
      "Non-marring floor feet protect marble and hardwood flooring",
      "Comfort foam handgrip for stability"
    ],
    safetyInfo: [
      "Designed for domestic indoor dry use only",
      "Ensure ladder is fully opened until side brackets lock"
    ]
  },
  {
    id: "cust-scaff-tank",
    name: "Akash Custom Industrial Tank & Vessel Ladder",
    category: "Customized Ladders",
    categoryId: "customized",
    price: 3000,
    originalPrice: 59999,
    rating: 5.0,
    reviewsCount: 18,
    stock: "Made to Order",
    featured: true,
    isNew: true,
    material: "Stainless Steel 316 / Heavy FRP",
    height: "Customized (Up to 50ft)",
    steps: 40,
    weightCapacity: "350 kg",
    productWeight: "Varies",
    foldable: false,
    usage: "Chemical Plants & Refineries",
    warranty: "10 Years Heavy Duty Warranty",
    certification: "ISO 9001 & ASME Boiler Code Compliant",
    images: [
      "/images/hero_ladder.jpg",
      "/images/fiberglass_extension.jpg"
    ],
    description: "Tailor-engineered access ladders for storage tanks, silos, chemical vessels, and factory roofs. Includes safety cages, rest platforms, fall arrest rails, and chemical-resistant coatings.",
    features: [
      "Custom engineered to client drawings & site measurements",
      "Integrated 3/4 round fall protection safety cage",
      "316 Marine Grade Stainless Steel or FRP options for corrosive environments",
      "On-site installation support by Akash certified engineers"
    ],
    safetyInfo: [
      "Requires professional site inspection and structural anchoring",
      "Complies with OSHA fixed ladder safety standards"
    ]
  }
];

export const companyStats = [
  { label: "Years of Excellence", value: "28+", icon: "Award" },
  { label: "Ladders Delivered", value: "500,000+", icon: "Truck" },
  { label: "Corporate Clients", value: "1,200+", icon: "Building2" },
  { label: "Safety Rating", value: "99.9%", icon: "ShieldCheck" }
];

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "Site Operations Manager, Larsen & Toubro",
    content: "We have been sourcing industrial extension ladders and fiberglass step ladders from Akash Ladders for over 8 years. Their EN131 safety compliance and sturdy builds have zeroed our site safety incidents.",
    rating: 5,
    city: "Mumbai"
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Interior Architect, Studio Form",
    content: "The FlexiLock Telescopic Ladder is a masterpiece for our site visit teams. Compact enough for sedan boot space, but rock solid when extended on client sites.",
    rating: 5,
    city: "Bengaluru"
  },
  {
    id: 3,
    name: "Amitabh Verma",
    role: "Facility Head, D-Mart Warehousing",
    content: "Akash SafetyPodium platform ladders dramatically increased our warehouse stock picking efficiency. The auto-braking casters are a huge safety benefit for our staff.",
    rating: 5,
    city: "Pune"
  }
];

export const safetyCertifications = [
  {
    title: "EN131 European Standard",
    description: "Rigorous testing for load capacity, side rail deflection, and twist resistance.",
    icon: "ShieldCheck"
  },
  {
    title: "ISO 9001:2015 Certified",
    description: "Certified quality management system across raw material testing & manufacturing.",
    icon: "CheckCircle2"
  },
  {
    title: "100% Factory Load Tested",
    description: "Every batch is proof-tested up to 350kg static weight to guarantee safety margins.",
    icon: "Scale"
  },
  {
    title: "Heavy-Duty Aircraft Alloy",
    description: "Constructed using prime 6063-T6 structural aluminium for high strength-to-weight ratio.",
    icon: "Sparkles"
  }
];
