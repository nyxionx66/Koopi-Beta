"use client";

import { useState } from 'react';
import withOnboarding from '@/components/withOnboarding';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Store, Globe, Users, Package, Zap, ShoppingCart, Target, Sparkles, Check, ArrowRight } from 'lucide-react';

const sellLocations = [
  { 
    id: 'online-store', 
    title: 'An online store', 
    description: 'Create a fully customizable website',
    icon: Store
  },
  { 
    id: 'retail', 
    title: 'In person at a retail store', 
    description: 'Brick-and-mortar stores',
    icon: ShoppingCart
  },
  { 
    id: 'events', 
    title: 'In person at events', 
    description: 'Markets, fairs, and pop-ups',
    icon: Users
  },
  { 
    id: 'existing-site', 
    title: 'An existing website or blog', 
    description: 'Add a Buy Button to your website',
    icon: Globe
  },
  { 
    id: 'social-media', 
    title: 'Social media', 
    description: 'Reach customers on Facebook, Instagram, TikTok',
    icon: Zap
  },
  { 
    id: 'marketplaces', 
    title: 'Online marketplaces', 
    description: 'List products on Etsy, Amazon, and more',
    icon: Package
  },
];

const businessGoals = [
  { 
    id: 'new-business', 
    title: 'Start a new business', 
    description: 'Launch your entrepreneurial journey',
    icon: Sparkles
  },
  { 
    id: 'grow-existing', 
    title: 'Grow an existing business', 
    description: 'Expand your current operations',
    icon: Target
  },
  { 
    id: 'side-hustle', 
    title: 'Create a side hustle', 
    description: 'Earn extra income alongside your job',
    icon: Zap
  },
  { 
    id: 'replace-income', 
    title: 'Replace my full-time income', 
    description: 'Build a sustainable online business',
    icon: Store
  },
];

const productTypes = [
  { 
    id: 'physical', 
    title: 'Physical products', 
    description: 'Items you ship to customers',
    icon: Package
  },
  { 
    id: 'digital', 
    title: 'Digital products', 
    description: 'Downloads, courses, or subscriptions',
    icon: Zap
  },
  { 
    id: 'services', 
    title: 'Services', 
    description: 'Consulting, coaching, or freelance work',
    icon: Users
  },
  { 
    id: 'mix', 
    title: 'Mix of products and services', 
    description: 'A combination of offerings',
    icon: ShoppingCart
  },
];

const Step1 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [selected, setSelected] = useState<string[]>(['online-store']);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Store className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
            Step 1 of 3
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
          Where would you like to sell?
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          We'll make sure you're set up to sell in these places
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {sellLocations.map((option) => {
          const isSelected = selected.includes(option.id);
          const Icon = option.icon;
          
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSelection(option.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 shadow-lg' 
                  : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white' 
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? 'text-white dark:text-neutral-900' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {option.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white' 
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}>
                  {isSelected && (
                    <Check className="w-4 h-4 text-white dark:text-neutral-900" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={() => onNext({ sellLocations: selected })} 
          className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const Step2 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [selected, setSelected] = useState('new-business');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
            Step 2 of 3
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
          What's your main goal?
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Help us tailor your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {businessGoals.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.icon;
          
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(option.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 shadow-lg' 
                  : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white' 
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? 'text-white dark:text-neutral-900' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {option.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white' 
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-white dark:bg-neutral-900" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={() => onNext({ goal: selected })} 
          className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const Step3 = ({ onFinish }: { onFinish: (data: any) => void }) => {
  const [selected, setSelected] = useState('physical');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Package className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
          <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
            Step 3 of 3
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
          What do you plan to sell?
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          This helps us set up the right features for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {productTypes.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.icon;
          
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(option.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 shadow-lg' 
                  : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white' 
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? 'text-white dark:text-neutral-900' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {option.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white' 
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-white dark:bg-neutral-900" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={() => onFinish({ productType: selected })} 
          className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Complete Setup <Check className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});
  const { user } = useAuth();
  const router = useRouter();

  const handleNext = (data: any) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleFinish = async (data: any) => {
    const finalData = { ...onboardingData, ...data };
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        onboarding: {
          ...finalData,
          isCompleted: true,
        }
      });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-5xl">
        {/* Progress bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-neutral-900 dark:bg-white"
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1 key="step1" onNext={handleNext} />}
            {step === 2 && <Step2 key="step2" onNext={handleNext} />}
            {step === 3 && <Step3 key="step3" onFinish={handleFinish} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default withOnboarding(OnboardingPage);