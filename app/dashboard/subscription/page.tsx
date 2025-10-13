'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/components/withAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { Check, Star, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionPage = () => {
  const { user, userProfile, loading } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-12-13T00:00:00Z');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <PageLoader message="Loading your subscription details..." />;
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Your Subscription
        </h1>
        <p className="text-lg text-gray-600">
          Currently enjoying free unlimited access to all features
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Current Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
              <span className="text-3xl font-extrabold text-green-600">Free</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            You're currently enjoying full access to all features at no cost!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Unlimited</strong> Product Listings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Full</strong> Website Customization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Complete</strong> Store Management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>All</strong> Analytics & Insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Unlimited</strong> Orders & Customers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[24px] border border-white/10 shadow-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center items-center"
        >
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-3 text-yellow-400 tracking-wider uppercase">Coming Soon</h2>
            <p className="text-lg mb-6 opacity-90">
              Paid plans are launching soon with powerful new features!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center my-8">
            <div>
              <div className="text-5xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-sm uppercase opacity-70">Days</div>
            </div>
            <div>
              <div className="text-5xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm uppercase opacity-70">Hours</div>
            </div>
            <div>
              <div className="text-5xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm uppercase opacity-70">Minutes</div>
            </div>
            <div>
              <div className="text-5xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm uppercase opacity-70">Seconds</div>
            </div>
          </div>

          <p className="text-xs text-white/70 mt-4 text-center">
            Launching on December 13, 2025
          </p>
        </motion.div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 backdrop-blur-2xl bg-gradient-to-r from-blue-50 to-purple-50 rounded-[24px] border border-blue-200/50 shadow-lg p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Enjoy Everything Free, For Now!
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We're committed to helping you build your business. All features are currently free with no restrictions. 
              When we launch premium plans, you'll get advance notice and existing users will receive special benefits. 
              Focus on growing your store - we've got your back!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default withAuth(SubscriptionPage);