'use client';

import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/components/withAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const SubscriptionPage = () => {
  const { user, userProfile, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUpgrade = async () => {
    if (!user || !userProfile) return;

    setIsRedirecting(true);
    try {
      const response = await fetch('/api/payhere/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          name: userProfile.name || user.email?.split('@')[0],
        }),
      });

      const checkoutData = await response.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';
      
      for (const key in checkoutData) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = checkoutData[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error redirecting to PayHere checkout:', error);
      alert('Failed to start the upgrade process. Please try again.');
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading your subscription details..." />;
  }

  if (!user || !userProfile) {
    return null;
  }

  const { subscription } = userProfile;
  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Your Subscription
        </h1>
        <p className="text-lg text-gray-600">
          Manage your plan and billing details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Plan</h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className={`text-3xl font-extrabold capitalize ${isPro ? 'text-purple-600' : 'text-blue-600'}`}>
              {subscription?.plan}
            </span>
            <span className="text-gray-500">Plan</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>{isPro ? 'Unlimited' : subscription?.productLimit}</strong> Product Listings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>{isPro ? 'Full' : 'Basic'}</strong> Website Customization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>{isPro ? 'Priority' : 'Standard'}</strong> Support
              </p>
            </div>
            {isPro && (
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>No</strong> Koopi Branding
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-2xl bg-gradient-to-br from-purple-500 to-blue-600 rounded-[24px] border border-white/30 shadow-2xl p-8 text-white"
        >
          <Star className="w-8 h-8 mb-4 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="mb-6 opacity-90">
            Unlock unlimited products, full customization, and priority support for just LKR 500/month.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={isPro || isRedirecting}
            className="w-full py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPro ? 'You are already on Pro' : isRedirecting ? 'Redirecting...' : 'Upgrade Now'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default withAuth(SubscriptionPage);