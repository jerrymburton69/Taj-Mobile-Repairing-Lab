export type RepairStatusType =
  | 'Received'
  | 'Diagnostic'
  | 'Awaiting Approval'
  | 'Approved'
  | 'Repairing'
  | 'Quality Check'
  | 'Ready for Pickup'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatusType = 'Paid' | 'Partial' | 'Unpaid';

export type LeadStatusType =
  | 'New'
  | 'Contacted'
  | 'Scheduled'
  | 'In Progress'
  | 'Converted'
  | 'Not Interested'
  | 'Closed';

export interface RepairNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address?: string;
  totalRepairs?: number;
  totalSpent?: number;
  createdAt: string;
}

export interface Repair {
  id: string;
  customerCode: string; // e.g. TJ-48291
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  deviceBrand: string; // Apple, Samsung, Google, etc.
  deviceModel: string; // iPhone 15 Pro, S24 Ultra, etc.
  deviceColor?: string;
  imeiOrSerial?: string;
  serialImei?: string;
  deviceCondition?: string;
  serviceType: string;
  issueDescription: string;
  status: RepairStatusType;
  paymentStatus?: PaymentStatusType;
  depositAmount?: number;
  estimatedCost: number; // in PKR
  finalCost?: number;
  actualCost?: number;
  currency: string; // PKR
  assignedTechnician: string;
  checkInDate: string;
  estimatedCompletion: string;
  completedDate?: string;
  technicianNotes?: string;
  internalNotes?: string;
  publicNotes?: string;
  passcodeProvided?: boolean;
  isHomeService: boolean;
  notes: RepairNote[];
  history: {
    status: RepairStatusType;
    timestamp: string;
    note?: string;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  device: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  area: string; // e.g. Gulberg, DHA, Model Town
  address: string;
  notes?: string;
  status: LeadStatusType;
  createdAt: string;
  assignedStaff?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  turnaroundTime: string;
  startingPrice: number;
  currency: string;
  commonSymptoms: string[];
  warranty: string;
  isPopular?: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  device: string;
  service: string;
  comment: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Pricing' | 'Warranty' | 'Diagnostics';
}

export interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  referenceId?: string;
}

export type ThemeAppearance = 'system' | 'dark' | 'light';
export type ThemePresetKey = 'taj-default' | 'midnight' | 'minimal' | 'titanium' | 'warm' | 'custom';
export type BorderRadiusOption = 'sharp' | 'subtle' | 'rounded' | 'pill' | 'custom';
export type ButtonStyleOption = 'filled' | 'outline' | 'minimal';
export type CardStyleOption = 'flat' | 'subtle' | 'elevated';
export type SpacingScaleOption = 'compact' | 'balanced' | 'spacious';
export type AnimationIntensityOption = 'off' | 'subtle' | 'balanced' | 'full';

export interface LogoSettings {
  useCustomLogo: boolean;
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  mobileLogoUrl?: string;
  desktopLogoUrl?: string;
  maxWidthDesktop: number; // px, 60-320
  maxHeightDesktop: number; // px, 24-80
  maxWidthMobile: number; // px, 50-200
  maxHeightMobile: number; // px, 20-60
  desktopScale: number; // 0.6 - 1.5
  mobileScale: number; // 0.6 - 1.5
  verticalOffset: number; // -10 to +10 px
  padding: number; // 0 to 16 px
}

export interface ThemeSettings {
  appearance: ThemeAppearance;
  preset: ThemePresetKey;
  // Core HEX colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  elevatedSurfaceColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  linkColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  
  // Geometry & Appearance
  borderRadius: BorderRadiusOption;
  customRadiusPx?: number;
  buttonStyle: ButtonStyleOption;
  cardStyle: CardStyleOption;
  spacingScale: SpacingScaleOption;
  
  // Typography
  headingScale: 'compact' | 'balanced' | 'prominent';
  bodyScale: 'small' | 'standard' | 'large';
  headingWeight: 'semibold' | 'bold' | 'extrabold';
  
  // Animation
  animationIntensity: AnimationIntensityOption;
}

export type SectionKey =
  | 'hero'
  | 'services'
  | 'laboratory'
  | 'oemTrust'
  | 'inquiry'
  | 'trackingCta'
  | 'homeService'
  | 'faqContact';

export interface SectionOrderItem {
  key: SectionKey;
  label: string;
  enabled: boolean;
}

export interface SectionVisibilitySettings {
  hero: boolean;
  services: boolean;
  laboratory: boolean;
  oemTrust: boolean;
  inquiry: boolean;
  trackingCta: boolean;
  homeService: boolean;
  faqContact: boolean;
  whatsappCta: boolean;
  reviews: boolean;
  footer: boolean;
}

export interface LaboratorySettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  quality3D: 'auto' | 'high' | 'medium' | 'low';
  animationIntensity: 'subtle' | 'balanced' | 'full';
  autoRotate: boolean;
  scrollInteraction: boolean;
  lowPowerMode: boolean;
  reducedMotionBehavior: 'static' | 'minimal' | 'smooth';
}

export interface HeroSectionSettings {
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
  alignment: 'center' | 'left';
  heroHeight: 'screen' | 'compact' | 'auto';
  backgroundTreatment: 'glow' | 'grid' | 'minimal';
}

export interface ServicesSectionSettings {
  title: string;
  subtitle: string;
  categories: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
}

export interface WebsiteSettings {
  brandName: string;
  shortBrandName?: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  area: string;
  city: string;
  country: string;
  postalCode: string;
  googleMapsUrl: string;
  googleBusinessUrl?: string;
  websiteUrl?: string;
  facebookUrl: string;
  instagramUrl: string;
  openingHours: string;
  workingHours?: string;
  footerCopyright?: string;
  showContactInfo?: boolean;
  
  // Hero settings
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaBookText: string;
  heroCtaTrackText: string;
  heroSettings?: HeroSectionSettings;
  
  // Trust & OEM positioning
  oemStatement?: string;
  trustStatement?: string;
  
  // Services
  servicesSettings?: ServicesSectionSettings;
  
  // Laboratory
  laboratory?: LaboratorySettings;
  
  // Logo & Branding
  logo?: LogoSettings;
  
  // Theme & Appearance
  theme?: ThemeSettings;
  
  // Section Ordering & Visibility
  sectionOrder?: SectionOrderItem[];
  visibility?: SectionVisibilitySettings;
  
  // SEO & Meta
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  
  // Feature flags
  enable3d: boolean;
  enableHomeService: boolean;
  enableLiveTracking: boolean;
}

export interface NotificationTemplate {
  id: string;
  event: string;
  title: string;
  whatsappTemplate: string;
  emailSubject: string;
  emailBody: string;
  enabled: boolean;
}
