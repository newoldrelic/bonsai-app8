import { loadStripe } from '@stripe/stripe-js';
import { Leaf, Stethoscope, Book, TreeDeciduous, Bell, Camera, Gift, CreditCard, PhoneCall } from 'lucide-react';
import type { PricingPlan } from '../types';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: 0,
    interval: 'month',
    features: [
      { text: 'Up to 3 bonsai trees in your collection', icon: TreeDeciduous },
      { text: 'Basic care tracking and history', icon: Bell },
      { text: 'Water reminder notifications', icon: Bell },
      { text: 'Style guide access', icon: Leaf },
      { text: 'AI-powered species identification', icon: Camera }
    ],
    stripePriceId: ''
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 9.99,
    interval: 'month',
    features: [
      { text: 'Unlimited bonsai trees in your collection', icon: TreeDeciduous },
      { text: 'Advanced care tracking with detailed analytics', icon: Bell },
      { text: 'Comprehensive maintenance reminders', icon: Bell },
      { text: 'Professional photo timeline and progress tracking', icon: Camera },
      { text: 'Export detailed maintenance logs', icon: Book },
      { text: 'AI-powered species identification', icon: Camera },
      { 
        text: 'AI Health Diagnosis & Treatment Plans',
        icon: Stethoscope,
        premium: true
      },
      { 
        text: 'Monthly Expert Coaching Call & 24/7 Chat',
        icon: PhoneCall,
        premium: true
      }
    ],
    stripePriceId: 'price_1QNa4OFwFmksLDAYodSOvZcS',
    icon: CreditCard
  },
  {
    id: 'premium-1month',
    name: 'Premium Gift (1 Month)',
    price: 9.99,
    interval: 'one-time',
    duration: '1 month',
    features: [
      { text: 'Unlimited bonsai trees in your collection', icon: TreeDeciduous },
      { text: 'Advanced care tracking with detailed analytics', icon: Bell },
      { text: 'Comprehensive maintenance reminders', icon: Bell },
      { text: 'Professional photo timeline and progress tracking', icon: Camera },
      { text: 'Export detailed maintenance logs', icon: Book },
      { text: 'AI-powered species identification', icon: Camera },
      { 
        text: 'AI Health Diagnosis & Treatment Plans',
        icon: Stethoscope,
        premium: true
      },
      { 
        text: 'Monthly Expert Coaching Call & 24/7 Chat',
        icon: PhoneCall,
        premium: true
      }
    ],
    stripePriceId: 'price_1QNa4OFwFmksLDAYrF6dh3hI',
    icon: Gift
  },
  {
    id: 'premium-3months',
    name: 'Premium Gift (3 Months)',
    price: 24.99,
    interval: 'one-time',
    duration: '3 months',
    features: [
      { text: 'Unlimited bonsai trees in your collection', icon: TreeDeciduous },
      { text: 'Advanced care tracking with detailed analytics', icon: Bell },
      { text: 'Comprehensive maintenance reminders', icon: Bell },
      { text: 'Professional photo timeline and progress tracking', icon: Camera },
      { text: 'Export detailed maintenance logs', icon: Book },
      { text: 'AI-powered species identification', icon: Camera },
      { 
        text: 'AI Health Diagnosis & Treatment Plans',
        icon: Stethoscope,
        premium: true
      },
      { 
        text: 'Monthly Expert Coaching Call & 24/7 Chat',
        icon: PhoneCall,
        premium: true
      }
    ],
    stripePriceId: 'price_1QNa4OFwFmksLDAYodSOvZcS',
    icon: Gift
  },
  {
    id: 'premium-6months',
    name: 'Premium Gift (6 Months)',
    price: 44.99,
    interval: 'one-time',
    duration: '6 months',
    features: [
      { text: 'Unlimited bonsai trees in your collection', icon: TreeDeciduous },
      { text: 'Advanced care tracking with detailed analytics', icon: Bell },
      { text: 'Comprehensive maintenance reminders', icon: Bell },
      { text: 'Professional photo timeline and progress tracking', icon: Camera },
      { text: 'Export detailed maintenance logs', icon: Book },
      { text: 'AI-powered species identification', icon: Camera },
      { 
        text: 'AI Health Diagnosis & Treatment Plans',
        icon: Stethoscope,
        premium: true
      },
      { 
        text: 'Monthly Expert Coaching Call & 24/7 Chat',
        icon: PhoneCall,
        premium: true
      }
    ],
    stripePriceId: 'price_1QNa4OFwFmksLDAYrF6dh3hI',
    icon: Gift
  }
];