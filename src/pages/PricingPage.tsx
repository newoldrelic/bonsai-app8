import React, { useEffect } from 'react';
import { Check, AlertCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS } from '../config/stripe';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { CurrencySelector } from '../components/CurrencySelector';
import { useCurrencyStore, formatPrice } from '../utils/currency';

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    createCheckoutSession, 
    getCurrentPlan, 
    loading,
    error,
    clearError
  } = useSubscriptionStore();
  const { current: currency } = useCurrencyStore();

  const currentPlan = getCurrentPlan();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubscribe = async (stripePriceId: string) => {
    if (!stripePriceId) return; // Free plan
    if (!user) {
      navigate('/', { state: { showAuth: true } });
      return;
    }
    await createCheckoutSession(stripePriceId);
  };

  const PlanIcon = ({ plan }: { plan: typeof PRICING_PLANS[0] }) => {
    const Icon = plan.icon;
    return Icon ? <Icon className="w-6 h-6 text-bonsai-green" /> : null;
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-bonsai-bark dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-6">
            Select the perfect plan for your bonsai journey. Upgrade or downgrade anytime.
          </p>
          <CurrencySelector />
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-7 gap-8 max-w-7xl mx-auto">
          {/* Hobby Plan - 2 columns */}
          <div className="md:col-span-2">
            <div className={`card p-8 h-full ${
              currentPlan.id === 'hobby' ? 'ring-2 ring-bonsai-green relative' : ''
            }`}>
              <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
                {PRICING_PLANS[0].name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                  {formatPrice(PRICING_PLANS[0].price, currency)}
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS[0].features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600 dark:text-stone-300 text-sm">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 px-4 rounded-lg font-medium bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-default"
              >
                Free Plan
              </button>
            </div>
          </div>

          {/* Premium Monthly & Annual - 2 columns each */}
          <div className="md:col-span-2">
            <div className={`card p-8 h-full ${
              currentPlan.id === 'premium-monthly' ? 'ring-2 ring-bonsai-green relative' : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white">
                  Premium Monthly
                </h3>
                <PlanIcon plan={PRICING_PLANS[1]} />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                  {formatPrice(9.99, currency)}
                </span>
                <span className="text-stone-600 dark:text-stone-300">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS[1].features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                      {feature.premium && <Crown className="w-4 h-4 text-bonsai-terra" />}
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('price_premium_monthly')}
                disabled={loading || currentPlan.id === 'premium-monthly'}
                className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe Monthly'}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className={`card p-8 h-full ${
              currentPlan.id === 'premium-annual' ? 'ring-2 ring-bonsai-green relative' : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white">
                  Premium Annual
                </h3>
                <PlanIcon plan={PRICING_PLANS[1]} />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                  {formatPrice(99.99, currency)}
                </span>
                <span className="text-stone-600 dark:text-stone-300">/year</span>
                <div className="text-sm text-bonsai-terra mt-1">
                  Save {formatPrice(19.89, currency)}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_PLANS[1].features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                    <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                      {feature.premium && <Crown className="w-4 h-4 text-bonsai-terra" />}
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('price_premium_annual')}
                disabled={loading || currentPlan.id === 'premium-annual'}
                className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe Annually'}
              </button>
            </div>
          </div>

          {/* Gift Options - 1 column */}
          <div className="md:col-span-1">
            {PRICING_PLANS.slice(2).map((plan) => {
              const GiftIcon = plan.icon;
              return (
                <div key={plan.id} className="card p-6 mb-4 last:mb-0">
                  <div className="text-center mb-4">
                    {GiftIcon && <GiftIcon className="w-8 h-8 text-bonsai-terra mx-auto mb-2" />}
                    <h3 className="text-xl font-bold text-bonsai-bark dark:text-white">
                      Premium Gift
                    </h3>
                    <div className="text-lg font-medium text-bonsai-terra">
                      {plan.duration}
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-bonsai-bark dark:text-white">
                      {formatPrice(plan.price, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSubscribe(plan.stripePriceId)}
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-lg font-medium bg-bonsai-terra text-white hover:bg-bonsai-clay transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Gift Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>
            All plans include a 14-day money-back guarantee. Cancel anytime.
            <br />
            Questions? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}