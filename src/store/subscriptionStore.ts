import { create } from 'zustand';
import { auth } from '../config/firebase';
import type { UserSubscription, PricingPlan } from '../types';
import { PRICING_PLANS } from '../config/stripe';

interface SubscriptionState {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  checkoutSession: string | null;
  createCheckoutSession: (priceId: string) => Promise<void>;
  getCurrentPlan: () => PricingPlan;
  cancelSubscription: () => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  loading: false,
  error: null,
  checkoutSession: null,
  clearError: () => set({ error: null }),

  createCheckoutSession: async (priceId: string) => {
    const user = auth.currentUser;
    if (!user?.email) {
      set({ error: 'Please sign in to subscribe' });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userEmail: user.email,
          returnUrl: window.location.origin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (!data.url) {
        throw new Error('No checkout URL received');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      set({ 
        error: error.message || 'Failed to start checkout process. Please try again.',
        loading: false 
      });
    }
  },

  getCurrentPlan: () => {
    const { subscription } = get();
    if (!subscription) {
      return PRICING_PLANS[0]; // Free plan
    }
    return PRICING_PLANS.find(plan => plan.id === subscription.planId) || PRICING_PLANS[0];
  },

  cancelSubscription: async () => {
    const user = auth.currentUser;
    if (!user?.email) {
      set({ error: 'Please sign in to manage subscription' });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      set(state => ({
        subscription: state.subscription ? {
          ...state.subscription,
          cancelAtPeriodEnd: true
        } : null,
        loading: false
      }));
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      set({ 
        error: 'Failed to cancel subscription. Please try again.',
        loading: false 
      });
    }
  }
}));