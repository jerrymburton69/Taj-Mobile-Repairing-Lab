import {
  Customer,
  Repair,
  Lead,
  ServiceItem,
  ReviewItem,
  FaqItem,
  ActivityLogItem,
  WebsiteSettings,
  ThemeSettings,
  LogoSettings,
  LaboratorySettings,
  HeroSectionSettings,
  ServicesSectionSettings,
  SectionVisibilitySettings,
  NotificationTemplate,
  RepairStatusType,
  LeadStatusType
} from '../types';
import { DEFAULT_THEME_CONFIG } from './theme';

// Helper to generate unique alphanumeric code like TJ-48291 or TJ-8F42K
export function generateRepairCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TJ-${randomStr}`;
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  brandName: 'TAJ MOBILE REPAIRING LAB',
  shortBrandName: 'TAJ LAB',
  tagline: 'Precision Mobile Diagnostics & Board-Level Repair',
  phone: '03214810938',
  whatsapp: '+923214810938',
  email: 'contact@tajmobilelab.com',
  address: 'Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III',
  area: 'Gulberg III',
  city: 'Lahore',
  country: 'Pakistan',
  postalCode: '54000',
  googleMapsUrl: 'https://maps.app.goo.gl/qezz1h1sno7cHVAj6',
  googleBusinessUrl: 'https://maps.app.goo.gl/qezz1h1sno7cHVAj6',
  websiteUrl: 'https://tajmobilelab.com',
  facebookUrl: 'https://www.facebook.com/tajmobileofficial?mibextid=LQQJ4d',
  instagramUrl: 'https://instagram.com/tajmobilelab',
  openingHours: 'Mon – Sat: 11:00 AM – 9:30 PM | Sunday Closed',
  workingHours: 'Mon – Sat: 11:00 AM – 9:30 PM | Sunday Closed',
  footerCopyright: '© 2026 TAJ MOBILE REPAIRING LAB. All rights reserved.',
  showContactInfo: true,
  
  heroHeadline: 'Precision repair for the device you depend on.',
  heroSubheadline: 'Professional mobile diagnostics and repair, with transparency at every step.',
  heroCtaBookText: "Tell Us What's Wrong",
  heroCtaTrackText: 'Track My Repair',
  heroSettings: {
    headline: 'Precision repair for the device you depend on.',
    subheadline: 'Professional mobile diagnostics and repair, with transparency at every step.',
    primaryCtaText: "Tell Us What's Wrong",
    secondaryCtaText: 'Track My Repair',
    showPrimaryCta: true,
    showSecondaryCta: true,
    alignment: 'center',
    heroHeight: 'screen',
    backgroundTreatment: 'glow',
  },

  oemStatement: 'Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.',
  trustStatement: 'Every device is treated as mission-critical equipment. We use calibrated ESD-safe workstations, stereomicroscopes, and thermal diagnostic imaging.',
  
  servicesSettings: {
    title: 'Precision Services & Lab Bench Diagnostics',
    subtitle: 'Engineered hardware restoration across all major smartphone manufacturers',
    categories: [
      { id: 'Display', name: 'OLED & Display', enabled: true },
      { id: 'Battery', name: 'Power & Battery', enabled: true },
      { id: 'Board', name: 'Microsoldering & Logic Board', enabled: true },
      { id: 'Camera', name: 'Optics & TrueDepth', enabled: true },
      { id: 'Charging', name: 'Ports & Power Rails', enabled: true },
      { id: 'Chassis', name: 'Titanium Chassis & Glass', enabled: true },
    ],
  },

  laboratory: {
    enabled: true,
    title: 'Inside the Laboratory',
    subtitle: 'A continuous engineering teardown of flagship hardware architecture',
    quality3D: 'auto',
    animationIntensity: 'balanced',
    autoRotate: true,
    scrollInteraction: true,
    lowPowerMode: false,
    reducedMotionBehavior: 'minimal',
  },

  logo: {
    useCustomLogo: false,
    maxWidthDesktop: 190,
    maxHeightDesktop: 48,
    maxWidthMobile: 140,
    maxHeightMobile: 36,
    desktopScale: 1.0,
    mobileScale: 1.0,
    verticalOffset: 0,
    padding: 0,
  },

  theme: DEFAULT_THEME_CONFIG,

  sectionOrder: [
    { key: 'hero', label: 'Hero Section', enabled: true },
    { key: 'services', label: 'Services & Diagnostics', enabled: true },
    { key: 'laboratory', label: 'Inside The Laboratory', enabled: true },
    { key: 'trackingCta', label: 'Track Repair CTA', enabled: true },
    { key: 'oemTrust', label: 'OEM & Trust Positioning', enabled: true },
    { key: 'inquiry', label: 'Repair Booking & Inquiry', enabled: true },
    { key: 'homeService', label: 'Home & Office Service', enabled: true },
    { key: 'faqContact', label: 'FAQ & Lab Location', enabled: true },
  ],

  visibility: {
    hero: true,
    services: true,
    laboratory: true,
    oemTrust: true,
    inquiry: true,
    trackingCta: true,
    homeService: true,
    faqContact: true,
    whatsappCta: true,
    reviews: true,
    footer: true,
  },

  metaTitle: 'Taj Mobile Repairing Lab – Precision Mobile Diagnostics & Repair Lahore',
  metaDescription: 'Professional mobile phone diagnostics and lab-grade repair in Gulberg III, Lahore near Hafeez Center. Screen, battery, charging, and logic board microsoldering with live tracking.',
  keywords: 'mobile repair lahore, hafeez center repair, iphone repair lahore, samsung screen repair, logic board microsoldering, taj mobile',
  
  enable3d: true,
  enableHomeService: true,
  enableLiveTracking: true,
};

const DEFAULT_THEME: ThemeSettings = DEFAULT_THEME_CONFIG;

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Precision OLED & Glass Repair',
    category: 'Display',
    iconName: 'Smartphone',
    description: 'Micron-level lamination, true-tone calibration, and scratch-resistant ceramic assembly replacement.',
    turnaroundTime: '45 – 60 Mins',
    startingPrice: 8500,
    currency: 'PKR',
    commonSymptoms: ['Flickering lines', 'Ghost touch', 'Cracked front glass', 'Black bleed spots'],
    warranty: '180 Days Lab Warranty',
    isPopular: true,
  },
  {
    id: 'srv-2',
    title: 'High-Density Battery Replacement',
    category: 'Power',
    iconName: 'BatteryCharging',
    description: 'Zero-cycle original grade power cells with integrated BMS microcontroller reprogramming for full health metrics.',
    turnaroundTime: '30 – 45 Mins',
    startingPrice: 5500,
    currency: 'PKR',
    commonSymptoms: ['Rapid drain below 30%', 'Swollen back cover', 'Spontaneous reboot', 'Health below 80%'],
    warranty: '180 Days Lab Warranty',
    isPopular: true,
  },
  {
    id: 'srv-3',
    title: 'Board-Level Microsoldering & CPU/NAND',
    category: 'Logic Board',
    iconName: 'Cpu',
    description: 'Stereomicroscope diagnostics, short-circuit clearing, PMIC power IC reballing, and data recovery.',
    turnaroundTime: '24 – 48 Hours',
    startingPrice: 12000,
    currency: 'PKR',
    commonSymptoms: ['No power / dead device', 'Error 4013/9', 'Baseband searching', 'Pencil short drain'],
    warranty: '90 Days Lab Warranty',
    isPopular: true,
  },
  {
    id: 'srv-4',
    title: 'Periscope & Optical Camera Restoration',
    category: 'Optics',
    iconName: 'Camera',
    description: 'Sensor stabilization (OIS) recalibration, prism realignment, lens dust de-contamination in laminar flow chamber.',
    turnaroundTime: '60 – 90 Mins',
    startingPrice: 7000,
    currency: 'PKR',
    commonSymptoms: ['Shaking camera / buzzing', 'Blurry 3x/5x focus', 'Black camera preview', 'Cracked sapphire lens'],
    warranty: '180 Days Lab Warranty',
  },
  {
    id: 'srv-5',
    title: 'USB-C & Lightning Precision Port Service',
    category: 'Charging',
    iconName: 'Zap',
    description: 'De-oxidation ultrasonic cleaning, flex ribbon replacement, and fast-charge protocol load verification.',
    turnaroundTime: '35 Mins',
    startingPrice: 3500,
    currency: 'PKR',
    commonSymptoms: ['Intermittent charging', 'Moisture detected warning', 'Cable falls out easily', 'Slow charge rate'],
    warranty: '180 Days Lab Warranty',
  },
  {
    id: 'srv-6',
    title: 'Ultrasonic Liquid Damage Chemical Wash',
    category: 'Emergency',
    iconName: 'Droplets',
    description: 'Full teardown, 40kHz ultrasonic solvent cleaning, corrosion neutralization, and thermal imaging trace check.',
    turnaroundTime: '12 – 24 Hours',
    startingPrice: 6500,
    currency: 'PKR',
    commonSymptoms: ['Dropped in water/tea', 'Overheating when plugged', 'Dim backlight', 'Unresponsive buttons'],
    warranty: '90 Days Lab Warranty',
    isPopular: true,
  },
  {
    id: 'srv-7',
    title: 'Face ID & TrueDepth Sensor Repair',
    category: 'Sensors',
    iconName: 'ScanFace',
    description: 'Dot projector alignment, flood illuminator micro-jumpering, and biometric security preservation without losing Face ID.',
    turnaroundTime: '2 – 3 Hours',
    startingPrice: 9500,
    currency: 'PKR',
    commonSymptoms: ['"Face ID has been disabled"', 'TrueDepth camera error', 'Cannot focus portraits', 'Move lower/higher loop'],
    warranty: '90 Days Lab Warranty',
  },
  {
    id: 'srv-8',
    title: 'Titanium / Aluminum Housing & Back Glass',
    category: 'Chassis',
    iconName: 'Shield',
    description: 'Laser-assisted rear glass ablation or full structural chassis transplant with water seal gasket re-application.',
    turnaroundTime: '90 – 120 Mins',
    startingPrice: 6000,
    currency: 'PKR',
    commonSymptoms: ['Shattered rear back glass', 'Bent chassis frame', 'Damaged volume rockers', 'Loose magnet ring'],
    warranty: '180 Days Lab Warranty',
  },
  {
    id: 'srv-9',
    title: 'Acoustic Speaker & Noise-Cancelling Mics',
    category: 'Audio',
    iconName: 'Volume2',
    description: 'Ear-speaker mesh ultrasonic cleaning, membrane replacement, and multi-microphone acoustic profiling.',
    turnaroundTime: '40 Mins',
    startingPrice: 3000,
    currency: 'PKR',
    commonSymptoms: ['Low earpiece call volume', 'Muffled voice on speaker', 'Crackling audio', 'No sound recording in video'],
    warranty: '180 Days Lab Warranty',
  },
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Hamza Tariq',
    phone: '03001234567',
    whatsapp: '+923001234567',
    email: 'hamza.tariq@gmail.com',
    address: 'Phase 5, DHA, Lahore',
    createdAt: '2025-05-10T11:20:00Z',
  },
  {
    id: 'cust-2',
    name: 'Ayesha Malik',
    phone: '03228945612',
    whatsapp: '+923228945612',
    email: 'ayesha.m@yahoo.com',
    address: 'Block L, Gulberg III, Lahore',
    createdAt: '2025-05-12T14:45:00Z',
  },
  {
    id: 'cust-3',
    name: 'Bilal Farooq',
    phone: '03334819021',
    whatsapp: '+923334819021',
    email: 'bilal.farooq@techcorp.pk',
    address: 'Model Town, Lahore',
    createdAt: '2025-05-14T09:15:00Z',
  },
  {
    id: 'cust-4',
    name: 'Dr. Usman Qureshi',
    phone: '03157891234',
    whatsapp: '+923157891234',
    email: 'usman.qureshi@shaukatkhanum.org.pk',
    address: 'Johar Town, Lahore',
    createdAt: '2025-05-15T16:30:00Z',
  }
];

const DEFAULT_REPAIRS: Repair[] = [
  {
    id: 'rep-1',
    customerCode: 'TJ-48291',
    customerId: 'cust-1',
    customerName: 'Hamza Tariq',
    customerPhone: '03001234567',
    customerWhatsapp: '+923001234567',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro Max',
    imeiOrSerial: '358921102948291',
    serviceType: 'Display & Ceramic Shield Replacement',
    issueDescription: 'Cracked glass from drop near corner. Touch works partially, vertical green line on left.',
    status: 'Repairing',
    estimatedCost: 38000,
    currency: 'PKR',
    assignedTechnician: 'Master Tech Usman',
    checkInDate: '2025-05-14 11:30',
    estimatedCompletion: 'Today, 5:30 PM',
    technicianNotes: 'OLED panel successfully unsealed. Frame straightened by 0.4mm. TrueTone EEPROM transfer in progress.',
    publicNotes: 'Device under active micro-repair in our ESD safe clean room. Sensor testing stage.',
    isHomeService: false,
    notes: [
      {
        id: 'n-1',
        author: 'Diagnostic Desk',
        content: 'Device checked in with front glass impact. No logic board fractures detected under thermal camera.',
        createdAt: '2025-05-14 11:45',
        isInternal: true,
      }
    ],
    history: [
      { status: 'Received', timestamp: '2025-05-14 11:30', note: 'Intake checklist completed. Initial power draw: 5.1V / 1.8A' },
      { status: 'Diagnostic', timestamp: '2025-05-14 12:15', note: 'Confirmed OLED substrate breach. Frame requires micro-straightening.' },
      { status: 'Approved', timestamp: '2025-05-14 13:00', note: 'Customer approved original grade display replacement via WhatsApp.' },
      { status: 'Repairing', timestamp: '2025-05-14 14:10', note: 'Micro-soldering TrueTone IC transfer and panel bonding underway.' },
    ],
  },
  {
    id: 'rep-2',
    customerCode: 'TJ-8F42K',
    customerId: 'cust-2',
    customerName: 'Ayesha Malik',
    customerPhone: '03228945612',
    customerWhatsapp: '+923228945612',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy S24 Ultra',
    imeiOrSerial: '354891102938472',
    serviceType: 'Board-Level Microsoldering & Power IC',
    issueDescription: 'Device suddenly turned off during gaming. Not charging, draws 0.02A on DC power supply.',
    status: 'Diagnostic',
    estimatedCost: 22000,
    currency: 'PKR',
    assignedTechnician: 'Senior Tech Raza',
    checkInDate: '2025-05-15 10:15',
    estimatedCompletion: 'Tomorrow, 3:00 PM',
    technicianNotes: 'Thermal camera reveals secondary buck regulator VDD_MAIN line capacitor C3402 shorted to ground.',
    publicNotes: 'Thermal scan completed. Technician isolating power management rail.',
    isHomeService: false,
    notes: [],
    history: [
      { status: 'Received', timestamp: '2025-05-15 10:15', note: 'Device checked in dead state.' },
      { status: 'Diagnostic', timestamp: '2025-05-15 11:30', note: 'Thermal imaging identified short circuit near Snapdragon power IC.' }
    ]
  },
  {
    id: 'rep-3',
    customerCode: 'TJ-10492',
    customerId: 'cust-3',
    customerName: 'Bilal Farooq',
    customerPhone: '03334819021',
    customerWhatsapp: '+923334819021',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 13 Pro',
    imeiOrSerial: '359182394019283',
    serviceType: 'High-Density Battery Replacement',
    issueDescription: 'Battery health at 74%. Shuts down in air-conditioned room at 25%.',
    status: 'Ready for Pickup',
    estimatedCost: 7500,
    finalCost: 7500,
    currency: 'PKR',
    assignedTechnician: 'Tech Arslan',
    checkInDate: '2025-05-15 12:00',
    estimatedCompletion: '2025-05-15 13:30',
    completedDate: '2025-05-15 13:15',
    technicianNotes: 'Original cell installed. Tag-on flex programmed to 100% health / 0 cycles. Water seal gasket replaced.',
    publicNotes: 'All 28 quality assurance tests passed. Battery health: 100%. Ready at Fazal Trade Centre counter.',
    isHomeService: false,
    notes: [],
    history: [
      { status: 'Received', timestamp: '2025-05-15 12:00' },
      { status: 'Diagnostic', timestamp: '2025-05-15 12:10' },
      { status: 'Approved', timestamp: '2025-05-15 12:15' },
      { status: 'Repairing', timestamp: '2025-05-15 12:20' },
      { status: 'Quality Check', timestamp: '2025-05-15 13:00' },
      { status: 'Ready for Pickup', timestamp: '2025-05-15 13:15', note: 'Notification dispatched via WhatsApp.' }
    ]
  },
  {
    id: 'rep-4',
    customerCode: 'TML-72A91',
    customerId: 'cust-4',
    customerName: 'Dr. Usman Qureshi',
    customerPhone: '03157891234',
    customerWhatsapp: '+923157891234',
    deviceBrand: 'Google',
    deviceModel: 'Pixel 8 Pro',
    imeiOrSerial: '357281920394812',
    serviceType: 'Camera Optical Stabilization & Glass',
    issueDescription: 'Rear camera glass shattered, 5x telephoto lens rattling and unable to focus.',
    status: 'Quality Check',
    estimatedCost: 14500,
    currency: 'PKR',
    assignedTechnician: 'Master Tech Usman',
    checkInDate: '2025-05-15 14:00',
    estimatedCompletion: 'Today, 6:00 PM',
    technicianNotes: 'Optic module swapped. Optical image stabilization tested on laser alignment target.',
    publicNotes: 'Final photo color calibration and seal pressure testing.',
    isHomeService: true,
    notes: [],
    history: [
      { status: 'Received', timestamp: '2025-05-15 14:00' },
      { status: 'Diagnostic', timestamp: '2025-05-15 14:20' },
      { status: 'Repairing', timestamp: '2025-05-15 14:40' },
      { status: 'Quality Check', timestamp: '2025-05-15 15:30' }
    ]
  }
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Zainab Abbasi',
    phone: '03025556677',
    whatsapp: '+923025556677',
    email: 'zainab.a@live.com',
    device: 'iPhone 14 Pro',
    problem: 'Battery drains in 3 hours, slight screen lifting at the side. Need technician to visit home.',
    preferredDate: '2025-05-17',
    preferredTime: '15:00 - 17:00',
    area: 'Gulberg III, Lahore',
    address: 'House 42, Street 7, Block B, Gulberg III',
    notes: 'Urgent request. Customer has newborn at home, cannot travel to shop.',
    status: 'New',
    createdAt: '2025-05-15T09:30:00Z',
    assignedStaff: 'Master Tech Usman',
  },
  {
    id: 'lead-2',
    name: 'Kamran Siddiqui',
    phone: '03349998811',
    whatsapp: '+923349998811',
    device: 'Samsung Galaxy Z Fold 5',
    problem: 'Inner folding screen has black vertical crease, no touch response on right side.',
    preferredDate: '2025-05-18',
    preferredTime: '11:00 - 13:00',
    area: 'DHA Phase 6, Lahore',
    address: 'Sector C, Street 14, DHA Phase 6',
    notes: 'Called customer, confirmed quote range 65k-75k for hinge + inner screen.',
    status: 'Contacted',
    createdAt: '2025-05-14T17:15:00Z',
    assignedStaff: 'Senior Tech Raza',
  },
];

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Shahid Mahmood',
    rating: 5,
    date: '3 days ago',
    device: 'iPhone 15 Pro Max',
    service: 'Display & Glass Lamination',
    comment: 'Fazal Trade Centre has dozens of repair stalls, but Taj Lab is on another planet. Clean ESD mats, microscope video feed, and my True Tone & 120Hz ProMotion remained 100% intact. Done in 45 minutes.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Dr. Farhan Ali',
    rating: 5,
    date: '1 week ago',
    device: 'Samsung S23 Ultra',
    service: 'Water Damage Ultrasonic Treatment',
    comment: 'Dropped in swimming pool in Murree. Three shops in Hafeez Center told me the motherboard was scrap and all photos lost. Usman at Taj Lab replaced two capacitors under microscope and revived it completely without data loss.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Mahnoor Rizvi',
    rating: 5,
    date: '2 weeks ago',
    device: 'iPhone 14',
    service: 'Home Service Battery Replacement',
    comment: 'The home technician service was seamless. Technician arrived with ESD kit, opened the phone in front of me, reprogrammed the battery microcontroller to 100%, and resealed the water gasket. Absolutely worth every rupee.',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Omer Khalid',
    rating: 5,
    date: '3 weeks ago',
    device: 'Google Pixel 7 Pro',
    service: 'USB-C Charging Flex Replacement',
    comment: 'Live repair tracking is brilliant! I could see when it entered diagnostic, when parts were fitted, and when quality check passed. Real professional engineering mindset.',
    verified: true,
  }
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Diagnostics',
    question: 'How do your lab diagnostics differ from standard roadside repair shops?',
    answer: 'We operate an ISO-standard ESD (electrostatic discharge) safe bench utilizing thermal imaging cameras (FLIR), DC lab power analyzers, and stereo-zoom microscopes. Instead of guessing and swapping expensive assemblies, we isolate the exact faulted diode, trace, or capacitor down to the micron.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'Will my personal data, photos, and messages be erased during repair?',
    answer: 'Strictly zero data wiping unless your repair explicitly involves NAND chip memory failure or operating system re-flash. For screen, battery, camera, and standard board repairs, your personal data remains completely untouched and encrypted.',
  },
  {
    id: 'faq-3',
    category: 'Warranty',
    question: 'What warranty comes with Taj Mobile Repairing Lab services?',
    answer: 'All precision screen and battery replacements carry our 180-Day Lab Warranty against functional touch or cell anomalies. Board-level microsoldering carries 90 days. We provide printed warranty QR tickets with every completed service.',
  },
  {
    id: 'faq-4',
    category: 'Pricing',
    question: 'Are quotes guaranteed before you proceed with the repair?',
    answer: 'Yes. Once intake diagnostics are completed, our technician provides an exact line-item quote via WhatsApp or phone call. We never perform billable work without your explicit customer authorization.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'How does the Home Service / On-Site technician repair work in Lahore?',
    answer: 'For qualifying repairs (batteries, screen replacements, cameras, and charging ports), our certified technician arrives at your home or office in Lahore with a mobile antistatic toolkit. The repair is executed right before your eyes in 30 to 45 minutes.',
  }
];

const DEFAULT_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'notif-1',
    event: 'New Customer Created',
    title: 'Repair Intake Confirmation',
    whatsappTemplate: 'Salam {customer_name}! Your {device} has been safely checked into TAJ MOBILE REPAIRING LAB. Your unique repair tracking code is *{repair_code}*. Track your live progress anytime at https://tajmobilelab.com/track?code={repair_code}',
    emailSubject: 'Taj Mobile Repair Lab - Repair Ticket #{repair_code}',
    emailBody: 'Dear {customer_name},\n\nYour {device} has been received for {service_type}.\n\nRepair Code: {repair_code}\nEstimated Completion: {estimated_completion}\n\nTrack your live diagnostic status at: https://tajmobilelab.com/track?code={repair_code}\n\nShop # M-11, Fazal Trade Centre, Gulberg III, Lahore.',
    enabled: true,
  },
  {
    id: 'notif-2',
    event: 'Diagnostic Completed / Awaiting Approval',
    title: 'Diagnostic & Quote Approval',
    whatsappTemplate: 'Update on Repair *{repair_code}* ({device}): Lab diagnostics are complete. Estimated cost: PKR {estimated_cost}. Findings: {technician_notes}. Please reply YES to approve or call 03214810938.',
    emailSubject: 'Taj Lab - Diagnostic Findings for #{repair_code}',
    emailBody: 'Dear {customer_name},\n\nDiagnostics are complete for your {device}.\n\nFindings: {technician_notes}\nEstimated Cost: PKR {estimated_cost}\n\nPlease reply to authorize repair.',
    enabled: true,
  },
  {
    id: 'notif-3',
    event: 'Ready for Pickup',
    title: 'Repair Completed & Quality Tested',
    whatsappTemplate: 'Good news {customer_name}! Your {device} (Code: *{repair_code}*) has passed all 28 quality assurance tests and is READY for pickup at Shop # M-11, Fazal Trade Centre, near Hafeez Center, Gulberg III. Total: PKR {final_cost}.',
    emailSubject: 'Your {device} is Ready for Pickup! (#{repair_code})',
    emailBody: 'Dear {customer_name},\n\nYour repair #{repair_code} is complete and verified. You may collect your device during our opening hours (11:00 AM - 9:30 PM).\n\nThank you for trusting Taj Mobile Repairing Lab.',
    enabled: true,
  },
  {
    id: 'notif-4',
    event: 'Code Regenerated',
    title: 'Security Code Update',
    whatsappTemplate: 'TAJ LAB Security Alert: The tracking code for your {device} repair has been updated to *{repair_code}*. Previous codes are now deactivated.',
    emailSubject: 'Taj Lab - New Tracking Code #{repair_code}',
    emailBody: 'Dear {customer_name},\n\nYour tracking code has been securely regenerated to: {repair_code}.',
    enabled: true,
  }
];

const DEFAULT_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-1',
    action: 'Repair Created',
    details: 'Created repair TJ-48291 for Hamza Tariq (iPhone 15 Pro Max)',
    user: 'Front Desk Admin',
    timestamp: '2025-05-14 11:30',
    referenceId: 'rep-1'
  },
  {
    id: 'act-2',
    action: 'Status Updated',
    details: 'Changed status of TJ-48291 to Repairing',
    user: 'Master Tech Usman',
    timestamp: '2025-05-14 14:10',
    referenceId: 'rep-1'
  },
  {
    id: 'act-3',
    action: 'Repair Completed',
    details: 'TJ-10492 for Bilal Farooq passed Quality Check -> Ready for Pickup',
    user: 'Tech Arslan',
    timestamp: '2025-05-15 13:15',
    referenceId: 'rep-3'
  },
  {
    id: 'act-4',
    action: 'Lead Received',
    details: 'Home Service request from Zainab Abbasi (iPhone 14 Pro)',
    user: 'Website System',
    timestamp: '2025-05-15 09:30',
    referenceId: 'lead-1'
  }
];

class DataStore {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(`taj_lab_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`taj_lab_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Getters
  getSettings(): WebsiteSettings {
    const raw = this.get<WebsiteSettings>('settings', DEFAULT_SETTINGS);
    return {
      ...DEFAULT_SETTINGS,
      ...raw,
      logo: { ...DEFAULT_SETTINGS.logo, ...(raw.logo || {}) } as LogoSettings,
      theme: { ...DEFAULT_SETTINGS.theme, ...(raw.theme || {}) } as ThemeSettings,
      laboratory: { ...DEFAULT_SETTINGS.laboratory, ...(raw.laboratory || {}) } as LaboratorySettings,
      heroSettings: { ...DEFAULT_SETTINGS.heroSettings, ...(raw.heroSettings || {}) } as HeroSectionSettings,
      servicesSettings: { ...DEFAULT_SETTINGS.servicesSettings, ...(raw.servicesSettings || {}) } as ServicesSectionSettings,
      visibility: { ...DEFAULT_SETTINGS.visibility, ...(raw.visibility || {}) } as SectionVisibilitySettings,
      sectionOrder: raw.sectionOrder && raw.sectionOrder.length ? raw.sectionOrder : DEFAULT_SETTINGS.sectionOrder,
    };
  }

  getTheme(): ThemeSettings {
    const raw = this.get<ThemeSettings>('theme', DEFAULT_THEME);
    return { ...DEFAULT_THEME, ...raw };
  }

  getServices(): ServiceItem[] {
    return this.get<ServiceItem[]>('services', DEFAULT_SERVICES);
  }

  getCustomers(): Customer[] {
    return this.get<Customer[]>('customers', DEFAULT_CUSTOMERS);
  }

  getRepairs(): Repair[] {
    return this.get<Repair[]>('repairs', DEFAULT_REPAIRS);
  }

  getLeads(): Lead[] {
    return this.get<Lead[]>('leads', DEFAULT_LEADS);
  }

  getReviews(): ReviewItem[] {
    return this.get<ReviewItem[]>('reviews', DEFAULT_REVIEWS);
  }

  getFaqs(): FaqItem[] {
    return this.get<FaqItem[]>('faqs', DEFAULT_FAQS);
  }

  getNotificationTemplates(): NotificationTemplate[] {
    return this.get<NotificationTemplate[]>('notif_templates', DEFAULT_NOTIFICATION_TEMPLATES);
  }

  getActivityLogs(): ActivityLogItem[] {
    return this.get<ActivityLogItem[]>('activity_logs', DEFAULT_ACTIVITY_LOGS);
  }

  // Get invalidated codes history
  getInvalidatedCodes(): Record<string, { repairId: string; invalidatedAt: string }> {
    return this.get<Record<string, { repairId: string; invalidatedAt: string }>>('invalidated_codes', {});
  }

  // Query single repair by code (internal admin)
  getRepairByCode(code: string): Repair | null {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    const repairs = this.getRepairs();
    return repairs.find(r => r.customerCode.toUpperCase() === clean) || null;
  }

  // Safe Public Tracking Query (Never leaks customer address, technician private notes, IMEI, or pricing)
  getPublicTrackingData(code: string): {
    found: boolean;
    invalidated?: boolean;
    repair?: {
      customerCode: string;
      deviceBrand: string;
      deviceModel: string;
      serviceType: string;
      status: RepairStatusType;
      checkInDate: string;
      estimatedCompletion: string;
      publicNotes?: string;
      history: { status: RepairStatusType; timestamp: string; note?: string }[];
    };
    error?: string;
  } {
    if (!code) return { found: false, error: 'Please provide a valid tracking code.' };
    const clean = code.trim().toUpperCase();

    // Check if code was invalidated
    const invalidated = this.getInvalidatedCodes();
    if (invalidated[clean]) {
      return {
        found: false,
        invalidated: true,
        error: 'This repair voucher code has been regenerated and is no longer active. Please check with our front desk or use your newest tracking code.'
      };
    }

    const repairs = this.getRepairs();
    const match = repairs.find(r => r.customerCode.toUpperCase() === clean);
    if (!match) {
      return {
        found: false,
        error: `We could not locate active repair records for code '${clean}'. Please verify your voucher or contact our lab.`
      };
    }

    return {
      found: true,
      repair: {
        customerCode: match.customerCode,
        deviceBrand: match.deviceBrand,
        deviceModel: match.deviceModel,
        serviceType: match.serviceType,
        status: match.status,
        checkInDate: match.checkInDate,
        estimatedCompletion: match.estimatedCompletion,
        publicNotes: match.publicNotes || 'Device safely logged in our laboratory.',
        history: match.history || []
      }
    };
  }

  // Mutations
  saveSettings(settings: WebsiteSettings): void {
    this.set('settings', settings);
    this.logActivity('Settings Updated', 'Website branding and configuration updated', 'Admin');
  }

  resetSettings(): void {
    this.set('settings', DEFAULT_SETTINGS);
    this.set('theme', DEFAULT_THEME);
    this.logActivity('Settings Reset', 'Website settings reset to factory defaults', 'Admin');
  }

  saveTheme(theme: ThemeSettings): void {
    this.set('theme', theme);
    this.logActivity('Theme Updated', `Switched theme preset to ${theme.preset}`, 'Admin');
  }

  saveServices(services: ServiceItem[]): void {
    this.set('services', services);
  }

  saveReviews(reviews: ReviewItem[]): void {
    this.set('reviews', reviews);
  }

  saveFaqs(faqs: FaqItem[]): void {
    this.set('faqs', faqs);
  }

  saveNotificationTemplates(templates: NotificationTemplate[]): void {
    this.set('notif_templates', templates);
  }

  // Customer & Repair Creation
  createCustomerAndRepair(data: {
    name: string;
    phone: string;
    whatsapp: string;
    email?: string;
    address?: string;
    deviceBrand: string;
    deviceModel: string;
    imeiOrSerial?: string;
    serviceType: string;
    issueDescription: string;
    estimatedCost: number;
    assignedTechnician: string;
    isHomeService?: boolean;
  }): { customer: Customer; repair: Repair } {
    const customers = this.getCustomers();
    const repairs = this.getRepairs();
    const customerId = `cust-${Date.now()}`;
    const repairId = `rep-${Date.now()}`;
    const customerCode = generateRepairCode();

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newCustomer: Customer = {
      id: customerId,
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      createdAt: nowStr,
    };

    const newRepair: Repair = {
      id: repairId,
      customerCode,
      customerId,
      customerName: data.name,
      customerPhone: data.phone,
      customerWhatsapp: data.whatsapp,
      deviceBrand: data.deviceBrand,
      deviceModel: data.deviceModel,
      imeiOrSerial: data.imeiOrSerial,
      serviceType: data.serviceType,
      issueDescription: data.issueDescription,
      status: 'Received',
      estimatedCost: data.estimatedCost || 5000,
      currency: 'PKR',
      assignedTechnician: data.assignedTechnician || 'Master Tech Usman',
      checkInDate: nowStr,
      estimatedCompletion: 'Within 24 Hours',
      technicianNotes: 'Initial intake complete. Ready for diagnostics.',
      publicNotes: 'Device verified in lab queue.',
      isHomeService: !!data.isHomeService,
      notes: [],
      history: [
        {
          status: 'Received',
          timestamp: nowStr,
          note: 'Checked into Taj Mobile Repairing Lab queue.'
        }
      ]
    };

    this.set('customers', [newCustomer, ...customers]);
    this.set('repairs', [newRepair, ...repairs]);

    this.logActivity(
      'New Customer & Repair',
      `Registered ${newCustomer.name} with code ${customerCode} (${newRepair.deviceBrand} ${newRepair.deviceModel})`,
      'Admin',
      repairId
    );

    return { customer: newCustomer, repair: newRepair };
  }

  // Update Repair Status
  updateRepairStatus(repairId: string, newStatus: RepairStatusType, note?: string): Repair | null {
    const repairs = this.getRepairs();
    const index = repairs.findIndex(r => r.id === repairId);
    if (index === -1) return null;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const repair = { ...repairs[index] };
    const oldStatus = repair.status;
    repair.status = newStatus;

    if (newStatus === 'Ready for Pickup' || newStatus === 'Delivered') {
      repair.completedDate = nowStr;
      if (!repair.finalCost) repair.finalCost = repair.estimatedCost;
    }

    repair.history = [
      ...repair.history,
      {
        status: newStatus,
        timestamp: nowStr,
        note: note || `Status updated from ${oldStatus} to ${newStatus}`
      }
    ];

    repairs[index] = repair;
    this.set('repairs', repairs);

    this.logActivity(
      'Status Changed',
      `Repair ${repair.customerCode} moved from ${oldStatus} to ${newStatus}`,
      'Admin',
      repair.id
    );

    return repair;
  }

  // Regenerate unique code (invalidates previous code permanently)
  regenerateCustomerCode(repairId: string): string | null {
    const repairs = this.getRepairs();
    const index = repairs.findIndex(r => r.id === repairId);
    if (index === -1) return null;

    const oldCode = repairs[index].customerCode;
    const newCode = generateRepairCode();
    repairs[index].customerCode = newCode;
    this.set('repairs', repairs);

    // Save old code to invalidated_codes
    const invalidated = this.getInvalidatedCodes();
    invalidated[oldCode.trim().toUpperCase()] = {
      repairId,
      invalidatedAt: new Date().toISOString()
    };
    this.set('invalidated_codes', invalidated);

    this.logActivity(
      'Code Regenerated',
      `Repair ${repairId} code regenerated from ${oldCode} to ${newCode}. Old code invalidated.`,
      'Admin',
      repairId
    );

    return newCode;
  }

  // Customer creation
  createCustomer(custData: Partial<Customer>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      id: custData.id || `cust-${Date.now()}`,
      name: custData.name || 'New Customer',
      phone: custData.phone || '',
      whatsapp: custData.whatsapp || custData.phone || '',
      email: custData.email || '',
      address: custData.address || '',
      totalRepairs: custData.totalRepairs || 1,
      totalSpent: custData.totalSpent || 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.set('customers', [newCustomer, ...customers]);
    return newCustomer;
  }

  // Standalone repair creation
  createRepair(repairData: Partial<Repair>): Repair {
    const repairs = this.getRepairs();
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const customerCode = repairData.customerCode || generateRepairCode();
    const newRepair: Repair = {
      id: repairData.id || `rep-${Date.now()}`,
      customerCode,
      customerId: repairData.customerId || `cust-${Date.now()}`,
      customerName: repairData.customerName || 'Customer',
      customerPhone: repairData.customerPhone || '',
      customerWhatsapp: repairData.customerWhatsapp || repairData.customerPhone || '',
      deviceBrand: repairData.deviceBrand || 'Apple',
      deviceModel: repairData.deviceModel || 'iPhone',
      deviceColor: repairData.deviceColor,
      serialImei: repairData.serialImei,
      deviceCondition: repairData.deviceCondition,
      serviceType: repairData.serviceType || 'Diagnostic',
      issueDescription: repairData.issueDescription || '',
      status: repairData.status || 'Received',
      paymentStatus: repairData.paymentStatus || 'Unpaid',
      estimatedCost: repairData.estimatedCost || 5000,
      depositAmount: repairData.depositAmount || 0,
      finalCost: repairData.finalCost,
      actualCost: repairData.actualCost,
      currency: 'PKR',
      assignedTechnician: repairData.assignedTechnician || 'Senior Master Tech Taj',
      checkInDate: repairData.checkInDate || nowStr,
      estimatedCompletion: repairData.estimatedCompletion || 'Within 24 Hours',
      technicianNotes: repairData.technicianNotes || repairData.internalNotes,
      internalNotes: repairData.internalNotes || repairData.technicianNotes,
      publicNotes: repairData.publicNotes || 'Intake inspection passed.',
      passcodeProvided: repairData.passcodeProvided,
      isHomeService: !!repairData.isHomeService,
      notes: [],
      history: [
        {
          status: repairData.status || 'Received',
          timestamp: nowStr,
          note: 'Checked into Taj Mobile Repairing Lab queue.'
        }
      ]
    };

    this.set('repairs', [newRepair, ...repairs]);
    this.logActivity(
      'New Repair Created',
      `Registered repair ${customerCode} for ${newRepair.customerName}`,
      'Admin',
      newRepair.id
    );
    return newRepair;
  }

  // Update Repair details (supports both object and (id, partial))
  updateRepair(repairOrId: Repair | string, partial?: Partial<Repair>): void {
    const repairs = this.getRepairs();
    let id: string;
    let patch: Partial<Repair>;

    if (typeof repairOrId === 'string') {
      id = repairOrId;
      patch = partial || {};
    } else {
      id = repairOrId.id;
      patch = repairOrId;
    }

    const index = repairs.findIndex(r => r.id === id);
    if (index !== -1) {
      repairs[index] = { ...repairs[index], ...patch };
      this.set('repairs', repairs);
      this.logActivity('Repair Updated', `Updated details for ${repairs[index].customerCode}`, 'Admin', id);
    }
  }

  // Update Lead
  updateLead(leadId: string, data: Partial<Lead>): void {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...data };
      this.set('leads', leads);
      this.logActivity('Lead Updated', `Updated lead ${leads[index].name}`, 'Admin', leadId);
    }
  }

  // Lead Operations
  createLead(data: Omit<Lead, 'id' | 'status' | 'createdAt'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    this.set('leads', [newLead, ...leads]);
    this.logActivity('Lead Received', `Home service request from ${newLead.name} (${newLead.device})`, 'System', newLead.id);
    return newLead;
  }

  updateLeadStatus(leadId: string, status: LeadStatusType, notes?: string): void {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      leads[index].status = status;
      if (notes) leads[index].notes = notes;
      this.set('leads', leads);
      this.logActivity('Lead Status Changed', `Lead ${leads[index].name} marked as ${status}`, 'Admin', leadId);
    }
  }

  convertLeadToCustomer(leadId: string, estimatedCost: number = 6500): { customer: Customer; repair: Repair } | null {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return null;

    const result = this.createCustomerAndRepair({
      name: lead.name,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      address: `${lead.address}, ${lead.area}`,
      deviceBrand: lead.device.split(' ')[0] || 'Smartphone',
      deviceModel: lead.device,
      serviceType: 'Home Service Repair',
      issueDescription: lead.problem,
      estimatedCost,
      assignedTechnician: lead.assignedStaff || 'Master Tech Usman',
      isHomeService: true,
    });

    this.updateLeadStatus(leadId, 'Converted', `Converted into repair ${result.repair.customerCode}`);
    return result;
  }

  convertLeadToRepair(leadId: string, estimatedCost: number = 6500): Repair | null {
    const res = this.convertLeadToCustomer(leadId, estimatedCost);
    return res ? res.repair : null;
  }

  // Activity Log
  logActivity(action: string, details: string, user: string = 'Admin', referenceId?: string): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      action,
      details,
      user,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      referenceId,
    };
    this.set('activity_logs', [newLog, ...logs.slice(0, 99)]);
  }

  // Global Content Find & Replace
  globalFindAndReplace(findText: string, replaceText: string): { replacementsCount: number } {
    if (!findText) return { replacementsCount: 0 };
    let count = 0;

    // Search in settings
    const settings = this.getSettings();
    let settingsModified = false;
    (Object.keys(settings) as (keyof WebsiteSettings)[]).forEach(k => {
      if (typeof settings[k] === 'string' && (settings[k] as string).includes(findText)) {
        settings[k] = (settings[k] as string).replaceAll(findText, replaceText) as never;
        count++;
        settingsModified = true;
      }
    });
    if (settingsModified) this.set('settings', settings);

    // Search in services
    const services = this.getServices();
    let srvModified = false;
    services.forEach(s => {
      if (s.title.includes(findText)) {
        s.title = s.title.replaceAll(findText, replaceText);
        count++;
        srvModified = true;
      }
      if (s.description.includes(findText)) {
        s.description = s.description.replaceAll(findText, replaceText);
        count++;
        srvModified = true;
      }
    });
    if (srvModified) this.set('services', services);

    // Search in FAQs
    const faqs = this.getFaqs();
    let faqModified = false;
    faqs.forEach(f => {
      if (f.question.includes(findText)) {
        f.question = f.question.replaceAll(findText, replaceText);
        count++;
        faqModified = true;
      }
      if (f.answer.includes(findText)) {
        f.answer = f.answer.replaceAll(findText, replaceText);
        count++;
        faqModified = true;
      }
    });
    if (faqModified) this.set('faqs', faqs);

    this.logActivity('Global Find & Replace', `Replaced "${findText}" with "${replaceText}" (${count} occurrences)`, 'Admin');
    return { replacementsCount: count };
  }

  // Reset to original factory demo data
  resetAllData(): void {
    this.set('settings', DEFAULT_SETTINGS);
    this.set('theme', DEFAULT_THEME);
    this.set('services', DEFAULT_SERVICES);
    this.set('customers', DEFAULT_CUSTOMERS);
    this.set('repairs', DEFAULT_REPAIRS);
    this.set('leads', DEFAULT_LEADS);
    this.set('reviews', DEFAULT_REVIEWS);
    this.set('faqs', DEFAULT_FAQS);
    this.set('notif_templates', DEFAULT_NOTIFICATION_TEMPLATES);
    this.set('activity_logs', DEFAULT_ACTIVITY_LOGS);
  }
}

export const store = new DataStore();
