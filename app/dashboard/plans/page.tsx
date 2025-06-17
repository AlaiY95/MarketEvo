// app/dashboard/plans/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserUsage } from '@/lib/usage';
import { shouldHidePricing } from '@/lib/utm';
import { loadStripe } from '@stripe/stripe-js';
import { CheckIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  yearlyEquivalent?: string;
  savings?: string;
  description: string;
  popular?: boolean;
  stripePlan: 'monthly' | 'annual';
  features: string[];
  badge?: string;
  badgeColor?: string;
}

export default function PlansPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userUsage, setUserUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [hidePricing, setHidePricing] = useState(false);

  // Check if we should redirect based on UTM parameters
  useEffect(() => {
    const shouldHide = shouldHidePricing();
    setHidePricing(shouldHide);
    
    if (shouldHide) {
      router.push('/dashboard?message=community_edition');
    }
  }, [router]);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserUsage();
    }
  }, [session?.user?.id]);

  const loadUserUsage = async () => {
    if (!session?.user?.id) return;
    
    try {
      const usage = await getUserUsage(session.user.id);
      setUserUsage(usage);
    } catch (error) {
      console.error('Error loading user usage:', error);
    }
    setLoading(false);
  };

  const handleUpgrade = async (planType: 'monthly' | 'annual') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (userUsage?.isPremium) {
      return; // Already premium
    }

    setCheckoutLoading(planType);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planType,
          successUrl: `${window.location.origin}/dashboard/success`,
          cancelUrl: `${window.location.origin}/dashboard/plans`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else if (sessionId) {
        const stripe = await stripePromise;
        
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          console.error('Stripe error:', error);
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start subscription. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Don't render anything if hiding pricing
  if (hidePricing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      stripePlan: 'monthly',
      features: [
        '3 chart analyses per day',
        'Basic trading insights',
        'Swing & scalp trading tools',
        'Trade history access',
        'Email support'
      ]
    },
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 29,
      period: 'month',
      description: 'Full access for active traders',
      stripePlan: 'monthly',
      features: [
        'Unlimited chart analyses',
        'Advanced AI insights',
        'Priority analysis processing',
        'Advanced pattern recognition',
        'Risk management tools',
        'Export analysis reports',
        'Priority email support',
        'Early access to new features'
      ]
    },
    {
      id: 'annual',
      name: 'Premium Annual',
      price: 199,
      period: 'year',
      yearlyEquivalent: '$16.58/month',
      savings: 'Save $149 (43% off)',
      description: 'Best value for serious traders',
      popular: true,
      stripePlan: 'annual',
      badge: 'Best Value',
      badgeColor: 'green',
      features: [
        'Everything in Monthly plan',
        'Unlimited chart analyses',
        'Advanced AI insights',
        'Priority analysis processing',
        'Advanced pattern recognition',
        'Risk management tools',
        'Export analysis reports',
        'Priority email support',
        'Early access to new features'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Trading Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock the full potential of AI-powered trading analysis. 
          Start with our free plan or upgrade for unlimited access.
        </p>
      </div>

      {/* Social Proof Stats */}
      <div className="flex justify-center space-x-16 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">10,000+</div>
          <div className="text-gray-600 text-sm">Active Traders</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">500K+</div>
          <div className="text-gray-600 text-sm">AI Analyses</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">94%</div>
          <div className="text-gray-600 text-sm">Satisfaction Rate</div>
        </div>
      </div>

      {/* Current Usage Status */}
      {userUsage && (
        <div className={`rounded-lg p-4 max-w-2xl mx-auto ${
          userUsage.isPremium 
            ? 'bg-green-50 border-green-200 border' 
            : 'bg-blue-50 border-blue-200 border'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              {userUsage.isPremium ? (
                <>
                  <h4 className="font-medium text-green-800">✓ Premium Account Active</h4>
                  <p className="text-green-700 text-sm">
                    Enjoying unlimited analyses and all premium features
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-blue-800">Free Account</h4>
                  <p className="text-blue-700 text-sm">
                    {userUsage.remainingAnalyses} of {userUsage.maxAnalyses} daily analyses remaining
                  </p>
                </>
              )}
            </div>
            {!userUsage.isPremium && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {userUsage.remainingAnalyses}/{userUsage.maxAnalyses}
                </div>
                <div className="text-xs text-blue-600">remaining today</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plans Grid - Side by Side */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
              plan.popular 
                ? 'border-green-500 ring-2 ring-green-200 transform scale-105' 
                : plan.id === 'free' 
                  ? 'border-gray-200'
                  : 'border-blue-200'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                  <StarIcon className="w-4 h-4 mr-1" />
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">
                    /{plan.period}
                  </span>
                </div>

                {/* Annual Plan Extras */}
                {plan.yearlyEquivalent && (
                  <div className="mb-2">
                    <p className="text-lg text-green-600 font-medium">
                      {plan.yearlyEquivalent}
                    </p>
                  </div>
                )}

                {plan.savings && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                    {plan.savings}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (plan.id === 'free') return;
                  handleUpgrade(plan.stripePlan);
                }}
                disabled={
                  (plan.id !== 'free' && userUsage?.isPremium) || 
                  (plan.id === 'free' && !userUsage?.isPremium) ||
                  checkoutLoading !== null
                }
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.id === 'free'
                    ? userUsage?.isPremium
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                    : plan.popular
                      ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 shadow-lg'
                      : userUsage?.isPremium
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {checkoutLoading === plan.stripePlan ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : plan.id === 'free' ? (
                  userUsage?.isPremium ? 'Downgrade to Free' : 'Current Plan'
                ) : userUsage?.isPremium ? (
                  'Current Plan'
                ) : (
                  `Get ${plan.name}`
                )}
              </button>

              {/* Value Proposition for Annual */}
              {plan.id === 'annual' && !userUsage?.isPremium && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Cancel anytime • No hidden fees
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="max-w-4xl mx-auto pt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Why Choose Premium?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced algorithms analyze market patterns and provide actionable insights for better trading decisions.
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Access</h3>
            <p className="text-gray-600">
              No daily limits on chart analysis. Upload and analyze as many trading charts as you need, whenever you need.
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
            <p className="text-gray-600">
              Join thousands of successful traders using our platform to improve their trading performance and profitability.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto pt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I switch between plans?</h3>
            <p className="text-gray-600">
              Yes! You can upgrade from monthly to annual anytime to start saving. 
              We'll prorate the difference automatically.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">
              Absolutely. You can cancel your subscription at any time. You'll continue 
              to have access to premium features until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards (Visa, MasterCard, American Express) 
              through Stripe's secure payment processing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial for premium?</h3>
            <p className="text-gray-600">
              Our free plan gives you 3 analyses per day to test our AI. Once you see 
              the value, you can upgrade to premium for unlimited access.
            </p>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="max-w-2xl mx-auto pt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-bold text-blue-900 mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-blue-800 text-sm">
            Not satisfied with premium features? Contact us within 30 days for a full refund. 
            No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}