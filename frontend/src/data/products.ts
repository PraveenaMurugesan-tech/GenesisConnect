// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Master Product Catalogue Data
// ==============================================================================

import { Product } from "../types";

export interface CatalogueProduct extends Product {
  short_description: string;
  tagline?: string;
  applications?: string[];
  key_highlights?: string[];
}

export const PRODUCT_CATEGORIES = [
  "All Categories",
  "Uninterruptible Power Supplies (UPS)",
  "Voltage Stabilizers",
  "Medical & Healthcare Power",
  "Power Conversion & Conditioning",
  "Specialized Systems",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const PRODUCTS: CatalogueProduct[] = [
  {
    id: 1,
    name: "UPS for Small Office",
    slug: "ups-for-small-office",
    category: "Uninterruptible Power Supplies (UPS)",
    tagline: "Compact, dependable power protection for commercial workstations & server closets",
    short_description: "High-efficiency online double-conversion UPS engineered for small offices, workstations, branch networking racks, and point-of-sale systems.",
    description: "The Genesis Small Office UPS series provides clean, regulated, uninterruptible sine wave power designed specifically to safeguard sensitive IT equipment, workstations, network switches, and critical office peripherals against voltage spikes, surges, sags, and blackout conditions.",
    features: [
      "True online double-conversion topology with pure sine wave output",
      "Wide input voltage and frequency tolerance for erratic grid environments",
      "Compact footprint suited for office server closets and workspace deployments",
      "Microprocessor control for enhanced system reliability and power management",
      "Built-in battery management with intelligent multi-stage charging",
      "Automatic and manual bypass protection for maintenance continuity"
    ],
    specifications: {
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Topology": "True Online Double Conversion",
      "Input Phase": "1-Phase / 3-Phase options as per site requirements",
      "Output Voltage": "220V / 230V / 240V AC pure sine wave",
      "Frequency": "50 Hz ± 0.5%",
      "Battery Chemistry": "SMF VRLA / Lithium options on request",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Pure Sine Wave Output",
      "Intelligent Battery Management",
      "Overload & Short Circuit Protection"
    ],
    applications: [
      "Corporate & SME branch offices",
      "Network routing and communication racks",
      "Critical point-of-sale (POS) systems",
      "Precision lab equipment and monitoring stations"
    ],
    image_url: "/images/products/ups-small-office.svg",
    datasheet_url: "#datasheet-ups-small-office",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Industrial UPS",
    slug: "industrial-ups",
    category: "Uninterruptible Power Supplies (UPS)",
    tagline: "Heavy-duty power protection for harsh manufacturing & continuous industrial operations",
    short_description: "Ruggedized industrial grade online double-conversion UPS built to withstand harsh electrical environments, harmonic distortion, and demanding industrial plant loads.",
    description: "Engineered specifically for continuous industrial duty, the Genesis Industrial UPS series delivers uncompromising power quality to motor drives, automated production lines, process control systems, and industrial PLCs. Built with heavy-duty components and galvanic isolation capability, it delivers high operational uptime even under severe electrical noise and load fluctuations.",
    features: [
      "Heavy-duty industrial grade power electronics for continuous 24/7 duty",
      "Galvanic isolation transformer architecture for supreme electrical noise immunity",
      "High short-circuit and overload withstand capability for motor and inductive loads",
      "Industrial enclosure designed for harsh environments and ambient temperature swings",
      "Comprehensive diagnostic LCD panel with event logging and remote telemetry options",
      "Redundant cooling fans and modular subsystem layout for swift on-site maintenance"
    ],
    specifications: {
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Input Topology": "3-Phase, 415V AC (4-wire)",
      "Output Topology": "3-Phase, 415V AC (4-wire) / 1-Phase options",
      "Operating Duty": "Continuous Industrial Duty",
      "Isolation": "Built-in / Optional Galvanic Isolation Transformer",
      "Harmonic Mitigation": "Industrial input filtering compliant with power quality standards",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Galvanic Isolation Protection",
      "High Inrush Load Capability",
      "Rugged Industrial Enclosure"
    ],
    applications: [
      "Automated manufacturing & assembly facilities",
      "Process control plants (chemical, pharmaceutical, textile)",
      "Robotics, CNC machinery, and industrial automation",
      "Continuous process operations and clean rooms"
    ],
    image_url: "/images/products/industrial-ups.svg",
    datasheet_url: "#datasheet-industrial-ups",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "CT Scanner UPS",
    slug: "ct-scanner-ups",
    category: "Medical & Healthcare Power",
    tagline: "Mission-critical clean power with high peak-pulse capability for CT imaging equipment",
    short_description: "Specialized high-capacity medical imaging UPS engineered to absorb severe momentary pulsed loads and deliver uninterrupted power to CT scan systems.",
    description: "Computed Tomography (CT) scanners demand instant, peak electrical current during high-energy X-ray tube rotation and image acquisition cycles without suffering voltage dips. The Genesis CT Scanner UPS incorporates specialized DC bus sizing, low output impedance, and ultra-fast dynamic transient response to guarantee flawless imaging quality, scan completion, and patient safety.",
    features: [
      "Ultra-low dynamic impedance engineered to handle severe pulsed imaging loads",
      "Sub-millisecond transient response to prevent scan abortion and image artifacts",
      "Dedicated medical galvanic isolation to eliminate common-mode electrical noise",
      "Synchronized automatic static bypass designed for critical healthcare environments",
      "High reliability architecture ensuring zero-interruption scan continuation during power transfers",
      "Compatible with major global CT imaging manufacturers and equipment specs"
    ],
    specifications: {
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Peak Inrush Capacity": "Engineered for high instantaneous pulsed current requirements",
      "Output Waveform": "Pure Sine Wave with minimal total harmonic distortion (THD)",
      "Isolation": "Medical grade galvanic isolation",
      "Application Class": "Diagnostic Imaging (Computed Tomography)",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Instantaneous Pulse Absorption",
      "Zero Scan Artifact Power Delivery",
      "Medical Grade Electrical Isolation"
    ],
    applications: [
      "Hospital radiology departments",
      "Independent diagnostic and imaging centers",
      "Emergency trauma care units",
      "Multi-slice diagnostic CT installations"
    ],
    image_url: "/images/products/ct-scanner-ups.svg",
    datasheet_url: "#datasheet-ct-scanner-ups",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "EMI Filter for Ultrasound Scanners",
    slug: "emi-filter-ultrasound",
    category: "Medical & Healthcare Power",
    tagline: "Precision electromagnetic interference attenuation for crystal-clear diagnostic imaging",
    short_description: "Specialized medical grade electromagnetic interference (EMI/RFI) filter designed to eliminate high-frequency mains noise and distortion from ultrasound imaging.",
    description: "High-frequency electrical line disturbances, harmonic noise from hospital elevator drives, and nearby RF emitters can cause severe image degradation, banding, and acoustic noise in sensitive ultrasound scanners. Genesis EMI Filters are purpose-built to deliver broad-band attenuation of both differential-mode and common-mode interference, ensuring diagnostic precision and clinical clarity.",
    features: [
      "Multi-stage high-attenuation low-pass LC filter network for common & differential modes",
      "Ultra-low earth leakage current design strictly adhering to medical safety requirements",
      "Compact metal-shielded enclosure to prevent radiated interference coupling",
      "Plug-and-play inline integration for mobile or cart-based ultrasound equipment",
      "Transient voltage surge suppression (TVSS) incorporated for comprehensive line protection",
      "High reliability passive components ensuring continuous, silent, maintenance-free operation"
    ],
    specifications: {
      "Frequency Band": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Leakage Current": "Strictly limited for patient-connected medical equipment standards",
      "Attenuation Performance": "Broadband attenuation across low, mid, and high radio frequencies",
      "Operating Voltage": "Standard 230V AC Single Phase 50 Hz",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Ultrasound Image Banding Elimination",
      "Ultra-Low Medical Leakage Current",
      "Passive Maintenance-Free Design"
    ],
    applications: [
      "Obstetric & gynecological ultrasound departments",
      "Cardiology echocardiography suites",
      "Radiology & vascular doppler imaging rooms",
      "Point-of-care mobile ultrasound carts"
    ],
    image_url: "/images/products/emi-filter-ultrasound.svg",
    datasheet_url: "#datasheet-emi-filter-ultrasound",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "IGBT Static Voltage Stabilizers",
    slug: "igbt-static-voltage-stabilizers",
    category: "Voltage Stabilizers",
    tagline: "Solid-state voltage regulation with sub-cycle correction speed and zero moving parts",
    short_description: "State-of-the-art solid-state static voltage stabilizer utilizing Insulated Gate Bipolar Transistor (IGBT) PWM technology for microsecond-fast voltage correction.",
    description: "Unlike traditional servo-controlled electromechanical stabilizers that rely on motor-driven carbon brushes, Genesis IGBT Static Voltage Stabilizers operate with zero moving parts. Using high-frequency PWM switching, the system regulates incoming voltage deviations within milliseconds, delivering unwavering voltage accuracy, silent operation, and virtually indefinite operational life without mechanical wear.",
    features: [
      "Solid-state IGBT PWM switching technology with zero mechanical contact wear",
      "Ultra-fast sub-cycle correction time (less than 20 milliseconds)",
      "High efficiency (up to 98%) resulting in substantial long-term energy savings",
      "Silent operation with no mechanical motor hum or carbon brush arcing",
      "Digital signal processing (DSP) control providing precise voltage balancing across phases",
      "Inbuilt electronic protection against over-voltage, under-voltage, overload, and short circuits"
    ],
    specifications: {
      "Technology": "IGBT based PWM Solid State Voltage Regulation",
      "Correction Speed": "Sub-cycle / within 20 milliseconds",
      "Moving Parts": "Zero (Solid State)",
      "Output Regulation": "± 1% nominal output voltage stability",
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Input Voltage Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Sub-Cycle Correction Speed",
      "Zero Moving Parts / No Wear",
      "High Energy Efficiency (>98%)"
    ],
    applications: [
      "High-precision CNC machine tools & robotic cells",
      "Critical medical diagnostic instrumentation",
      "Data centers, telecom towers, and broadcasting facilities",
      "Pharmaceutical production and scientific research labs"
    ],
    image_url: "/images/products/igbt-stabilizer.svg",
    datasheet_url: "#datasheet-igbt-stabilizer",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Servo Stabilizers",
    slug: "servo-stabilizers",
    category: "Voltage Stabilizers",
    tagline: "Proven, cost-effective electromechanical voltage stabilization for high-capacity plant loads",
    short_description: "Heavy-duty servo motor-controlled automatic voltage stabilizers delivering reliable line conditioning for industrial plants, factories, and commercial buildings.",
    description: "Genesis Servo Stabilizers are engineered for robust, high-capacity voltage conditioning where utility supply is subject to severe chronic fluctuations. Built around precision toroidal variable autotransformers and heavy-duty buck-boost transformers, they offer high overload tolerance, smooth continuous voltage regulation, and durable performance across challenging Indian grid conditions.",
    features: [
      "Precision closed-loop servo motor control with high torque and low overshoot",
      "Heavy-duty copper wound buck-boost transformers for maximum thermal durability",
      "Independent phase correction models available for unbalanced 3-phase industrial supplies",
      "High short-term overload withstand capability suitable for heavy motor starts",
      "Digital voltmeter and ammeter displays for real-time phase monitoring",
      "Comprehensive protection system including phase reversal, phase fail, and trip mechanisms"
    ],
    specifications: {
      "Operating Class": "Continuous Duty Electromechanical Servo Stabilizer",
      "Winding Material": "High-grade electrolytic copper conductors",
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Correction Rate": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Cooling Type": "Air Cooled / Oil Cooled options depending on capacity rating",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "100% Electrolytic Copper Wound",
      "High Overload Withstand Capacity",
      "Air & Oil Cooled Configurations"
    ],
    applications: [
      "Textile, packaging, and plastic manufacturing machinery",
      "Cold storage facilities and commercial refrigeration",
      "Commercial buildings, retail malls, and educational campuses",
      "Printing presses and mechanical fabrication workshops"
    ],
    image_url: "/images/products/servo-stabilizer.svg",
    datasheet_url: "#datasheet-servo-stabilizer",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 7,
    name: "CVCF Systems",
    slug: "cvcf-systems",
    category: "Power Conversion & Conditioning",
    tagline: "Constant Voltage Constant Frequency power conversion for aerospace, marine & testing labs",
    short_description: "Precision Constant Voltage Constant Frequency (CVCF) static frequency converters delivering stable 50Hz, 60Hz, or 400Hz clean sinusoidal power.",
    description: "Genesis CVCF Systems are engineered to solve power compatibility challenges between utility grid supplies and specialized equipment manufactured to international electrical standards. Whether converting 50 Hz utility power to 60 Hz for exported machinery testing, or generating 400 Hz power for aviation systems, Genesis CVCF units deliver locked voltage and frequency stability under all dynamic load conditions.",
    features: [
      "Dual-conversion power stage decoupling output voltage and frequency from input anomalies",
      "Selectable and precision-locked frequency outputs (e.g., 50 Hz, 60 Hz, 400 Hz)",
      "Pure sinusoidal output with ultra-low harmonic distortion across linear and non-linear loads",
      "Galvanic isolation between input utility grid and output load circuits",
      "Comprehensive diagnostic metering of voltage, current, frequency, and active/reactive power",
      "Rugged industrial construction suited for factory quality assurance and R&D test benches"
    ],
    specifications: {
      "Input Frequency": "47 Hz – 53 Hz / 57 Hz – 63 Hz standard utility supply",
      "Output Frequency": "50 Hz / 60 Hz / 400 Hz (Quartz-crystal stabilized ± 0.05%)",
      "Voltage Regulation": "± 1% steady-state regulation",
      "Waveform": "Pure Sinusoidal (< 3% THD under linear loads)",
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "50 Hz / 60 Hz / 400 Hz Frequency Options",
      "Crystal-Locked Frequency Stability",
      "Testing & Export Equipment Compatibility"
    ],
    applications: [
      "Equipment testing laboratories for international export products (60 Hz)",
      "Aviation ground support equipment and avionics testing (400 Hz)",
      "Marine dockside power and shipboard system simulation",
      "Defence and radar electronics test setups"
    ],
    image_url: "/images/products/cvcf-systems.svg",
    datasheet_url: "#datasheet-cvcf-systems",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 8,
    name: "Cath Laboratory UPS",
    slug: "cath-laboratory-ups",
    category: "Medical & Healthcare Power",
    tagline: "Life-critical uninterruptible power protection for cardiovascular catheterization suites",
    short_description: "Ultra-high reliability medical UPS system specifically tailored for hospital Cath Labs, digital angiography, and fluoroscopic imaging suites.",
    description: "Cardiac Catheterization Laboratories represent one of the most critical healthcare environments, where even a momentary power interruption during coronary angioplasty or stent deployment can be life-threatening. The Genesis Cath Laboratory UPS is designed with dual-feed architecture, extreme transient load support, medical isolation, and battery backup redundancy to provide total continuity for cardiovascular interventional procedures.",
    features: [
      "Designed specifically for high-power interventional X-ray and angiographic pulsed loads",
      "Redundant system configuration support (N+1 / dual bus parallel architectures)",
      "Galvanic isolation transformer integrated to safeguard patients and diagnostic sensors",
      "Zero transfer time to battery during utility mains dropouts, brownouts, or surges",
      "Intelligent continuous battery monitoring to ensure instantaneous emergency autonomy",
      "Remote healthcare facility management interface and audible status alarm integration"
    ],
    specifications: {
      "Application Category": "Interventional Cardiology & Cath Lab Suites",
      "Transfer Time": "Zero millisecond (True Online Double Conversion)",
      "Galvanic Isolation": "Built-in medical isolation transformer",
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Overload Capacity": "High momentary overload capability tailored for angiographic bursts",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Zero Transfer Time Under Pulsed Loads",
      "Life-Critical Healthcare Reliability",
      "Dual Bus & N+1 Redundancy Options"
    ],
    applications: [
      "Hospital cardiac catheterization laboratories",
      "Interventional radiology suites",
      "Hybrid operating theaters",
      "Digital subtraction angiography (DSA) installations"
    ],
    image_url: "/images/products/cath-lab-ups.svg",
    datasheet_url: "#datasheet-cath-lab-ups",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 9,
    name: "Custom & Specialized Power Systems",
    slug: "custom-specialized-power-systems",
    category: "Specialized Systems",
    tagline: "Bespoke power conditioning, custom enclosures, and tailored engineering solutions",
    short_description: "Custom-engineered power distribution, bespoke battery backup racks, outdoor weatherized enclosures, and specialized power conditioning solutions.",
    description: "Every facility has unique electrical and operational constraints. Genesis Power Equipments Pvt. Ltd. consults, designs, and manufactures bespoke power solutions tailored to custom voltage inputs, unconventional physical enclosures, marine environments, non-standard battery chemistries, and automated power management requirements.",
    features: [
      "Tailored electrical engineering design adapted to client equipment specifications",
      "Custom enclosure fabrication (IP rated, stainless steel, outdoor acoustic housings)",
      "Support for specialized battery chemistries including LiFePO4, Gel, and tubular VRLA",
      "Custom switchgear, bypass panels, and automatic synchronization integration",
      "Comprehensive factory acceptance testing (FAT) before site dispatch",
      "Direct technical consultation with Genesis application engineers from design to commissioning"
    ],
    specifications: {
      "Engineering Scope": "Custom electrical and mechanical specifications per project requirement",
      "Enclosure Options": "Standard indoor / IP54, IP55, IP65 outdoor / stainless steel",
      "Voltage / Frequency": "Customizable based on application site or export requirements",
      "Capacity Range": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd.",
      "Detailed Specifications": "Specifications will be provided by Genesis Power Equipments Pvt. Ltd."
    },
    key_highlights: [
      "Engineered to Exact Client Scope",
      "Specialized Enclosure Fabrication",
      "Custom Voltage & Frequency Ratings"
    ],
    applications: [
      "Specialized defence & aerospace test stands",
      "Offshore, coastal, and chemical corrosive environments",
      "Custom captive power generation & synchronization projects",
      "Heavy infrastructure and railway signaling systems"
    ],
    image_url: "/images/products/custom-power-systems.svg",
    datasheet_url: "#datasheet-custom-power",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  }
];

// Helper Functions
export const getAllProducts = (): CatalogueProduct[] => {
  return PRODUCTS.filter((p) => p.is_active);
};

export const getFeaturedProducts = (): CatalogueProduct[] => {
  // Highlight top 4 industrial / medical solutions for home showcase
  const featuredSlugs = [
    "industrial-ups",
    "ct-scanner-ups",
    "igbt-static-voltage-stabilizers",
    "servo-stabilizers",
  ];
  return PRODUCTS.filter((p) => featuredSlugs.includes(p.slug));
};

export const getProductBySlug = (slug?: string): CatalogueProduct | undefined => {
  if (!slug) return undefined;
  return PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase() && p.is_active);
};

export const getProductsByCategory = (category: string): CatalogueProduct[] => {
  if (category === "All Categories") return getAllProducts();
  return PRODUCTS.filter((p) => p.category === category && p.is_active);
};
