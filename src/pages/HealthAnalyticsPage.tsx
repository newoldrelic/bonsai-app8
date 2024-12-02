import React, { useState } from 'react';
import { Stethoscope, Crown, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { ImageUpload } from '../components/ImageUpload';
import { FEATURES } from '../config/features';

const feature = FEATURES.find(f => f.id === 'health-analytics')!;

export function HealthAnalyticsPage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        const response = await fetch('/.netlify/functions/analyze-health', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Data
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setAnalysis(data.analysis);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <feature.icon className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">
              {feature.name}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Analyze Your Bonsai's Health
            </h2>
            <ImageUpload onImageCapture={handleImageUpload} />
            
            {!isSubscribed && (
              <div className="mt-4 p-4 bg-bonsai-terra/10 rounded-lg flex items-start space-x-3">
                <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-0 mt-1" />
                <div>
                  <p className="text-bonsai-terra font-medium">Premium Feature</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Upgrade to unlock expert health analysis and treatment recommendations.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="mt-3 text-bonsai-terra hover:text-bonsai-clay transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <span>View Pricing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-bonsai-green">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your bonsai's health...</span>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {analysis && (
              <div className="mt-6 p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Analysis Results
                </h3>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {analysis}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Common Health Issues
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Leaf Problems
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yellowing, browning, or dropping leaves can indicate watering issues or nutrient deficiencies.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Root Health
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Root rot, compacted soil, or poor drainage can affect your tree's overall health.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Pest Infestations
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Spider mites, scale insects, or other pests can damage your bonsai's health.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center space-x-2">
              <Crown className="w-6 h-6 text-bonsai-terra" />
              <span>Premium Features</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Instant identification of health issues and diseases
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Detailed treatment recommendations from expert analysis
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Progress tracking and recovery monitoring
                </p>
              </div>
              
              {!isSubscribed && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full mt-4 btn-primary group relative overflow-hidden px-6 py-3 rounded-full"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Upgrade to Access</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-bonsai-terra to-bonsai-clay transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}