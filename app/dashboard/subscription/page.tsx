"use client";

import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/components/withAuth';
import { PageLoader } from '@/components/ui/PageLoader';
import { Check, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const SubscriptionPage = () => {
  const { userProfile, loading } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date("2025-12-14T00:00:00") - +new Date();
      let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <PageLoader message="Loading your subscription details..." />;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Free Pro Plan
          </h1>
          <p className="text-lg text-gray-600">
            You're on a free Pro plan until December 14th. Enjoy all features, on us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              Free Pro Plan Ends In
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-4xl font-bold text-gray-900">{timeLeft.days}</p>
              <p className="text-sm text-gray-600">Days</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{timeLeft.hours}</p>
              <p className="text-sm text-gray-600">Hours</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{timeLeft.minutes}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{timeLeft.seconds}</p>
              <p className="text-sm text-gray-600">Seconds</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Plan</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-extrabold text-green-600">
                Free Pro
              </span>
            </div>

            <div className="space-y-4">
              <FeatureItem>Unlimited Product Listings</FeatureItem>
              <FeatureItem>Full Website Customization</FeatureItem>
              <FeatureItem>All Themes & Templates</FeatureItem>
              <FeatureItem>Full Order Management</FeatureItem>
              <FeatureItem>Email Support</FeatureItem>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-2xl bg-gradient-to-br from-purple-500 to-blue-600 rounded-[24px] border border-white/30 shadow-2xl p-8 text-white"
          >
            <Star className="w-8 h-8 mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">Future of Pro</h2>
            <p className="mb-6 opacity-90">
              After December 14th, you can subscribe to keep your Pro features, including AI-powered tools, advanced analytics, and more.
            </p>
            <button
              disabled
              className="w-full py-3 bg-white/20 text-white rounded-full font-semibold cursor-not-allowed opacity-75"
            >
              Subscription Options Coming Soon
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
    <p className="text-gray-700">{children}</p>
  </div>
);

export default withAuth(SubscriptionPage);