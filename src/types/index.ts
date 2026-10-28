export type StationType = 'pc' | 'ps5' | 'racing' | 'vip';

export interface GamingStation {
  id: string;
  type: StationType;
  title: string;
  tagline: string;
  description: string;
  hourlyRate: number;
  featured: boolean;
  image: string;
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  totalUnits: number;
  availableUnits: number;
  popularGames: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  stationId: string;
  stationTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  discordTag?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationHours: number;
  totalPrice: number;
  isDemo: boolean;
  status: BookingStatus;
  specialRequests?: string;
  selectedPackage?: string;
  snackAddons?: string[];
  createdAt: string;
}

export interface PricePackage {
  id: string;
  name: string;
  description: string;
  durationLabel: string;
  hours: number;
  stationType: StationType | 'all';
  regularPrice: number;
  discountPrice?: number;
  savingsBadge?: string;
  features: string[];
  isPopular?: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: 'silver' | 'gold' | 'pro';
  monthlyFee: number;
  allocatedHours: number;
  discounts: string;
  perks: string[];
  popular?: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  format: string; // e.g., '5v5 Single Elimination'
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  maxTeams: number;
  registeredCount: number;
  status: 'open' | 'filling' | 'live' | 'completed';
  bannerBg: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  address: string;
  mapsUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
  socials: {
    instagram: string;
    discord: string;
    youtube: string;
    twitch: string;
  };
}
