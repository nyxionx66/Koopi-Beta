'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import Link from 'next/link';

export const TrialStatusCard = () => {
  const { userProfile } = useAuth();

  if (userProfile?.subscription?.status !== 'trialing' || !userProfile.subscription.trialEndDate) {
    return null;
  }

  const trialEndDate = new Date(userProfile.subscription.trialEndDate.seconds * 1000);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6" />
          <h3 className="font-bold text-lg">Pro Trial Active</h3>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left</span>
        </div>
      </div>
      <p className="mt-3 text-sm opacity-90">
        You are currently on a free trial of the Pro plan. Enjoy all premium features!
      </p>
      <Link href="/dashboard/subscription">
        <button className="mt-4 w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Upgrade to Pro
        </button>
      </Link>
    </motion.div>
  );
};