export interface BonsaiTree {
  id: string;
  userEmail: string;
  name: string;
  species: string;
  dateAcquired: string;
  style: BonsaiStyle;
  lastWatered?: string;
  lastFertilized?: string;
  lastPruned?: string;
  images: string[];
  notes: string;
  maintenanceLogs: MaintenanceLog[];
  notifications: NotificationPreferences;
}

export type BonsaiStyle = 
  | 'Chokkan'
  | 'Moyogi'
  | 'Shakan'
  | 'Kengai'
  | 'Han-Kengai'
  | 'Multiple Trunk'
  | 'Forest';

export type MaintenanceType = 
  | 'watering'
  | 'fertilizing'
  | 'pruning'
  | 'wiring'
  | 'repotting'
  | 'other';

export interface MaintenanceLog {
  id: string;
  type: MaintenanceType;
  date: string;
  notes: string;
  images?: string[];
}

export interface NotificationPreferences {
  watering: boolean;
  fertilizing: boolean;
  pruning: boolean;
  wiring: boolean;
  repotting: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'one-time';
  duration?: string;
  features: Array<{
    text: string;
    icon: any;
    premium?: boolean;
  }>;
  stripePriceId: string;
  icon?: any;
}

export interface UserSubscription {
  id: string;
  userEmail: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  planId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}