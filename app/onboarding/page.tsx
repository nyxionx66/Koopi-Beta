"use client";

import { useState, useRef, ChangeEvent } from 'react';
import withOnboarding from '@/components/withOnboarding';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { Store, Globe, Users, Package, Zap, ShoppingCart, Target, Sparkles, Check, ArrowRight, Image as ImageIcon, Upload } from 'lucide-react';
import Lottie from "lottie-react";
import animationData from "@/public/loading-animation.json";

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
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          key="question1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 sm:gap-4"
        >
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Store className="w-6 h-6 text-gray-600" />
          </div>
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 shadow-md flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-2">Where would you like to sell?</h2>
            <p className="text-gray-600">Select all that apply. This will help us recommend the right features.</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 sm:ml-16 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}
        >
          {sellLocations.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <motion.div
                key={option.id}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.03 }}
                onClick={() => toggleSelection(option.id)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300/50 bg-white/80 hover:border-gray-400/50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="font-semibold text-gray-800">{option.title}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:ml-16"
        >
          <button
            onClick={() => onNext({ sellLocations: selected })}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Step2 = ({ onNext }: { onNext: (data: any) => void }) => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePlaceholder = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea', '#ed64a6'];
    const color = colors[name.length % colors.length];
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" font-family="Arial" font-size="100" fill="white" text-anchor="middle" dy=".3em">${firstLetter}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleContinue = async () => {
    if (!storeName.trim() || !user) return;
    setIsUploading(true);

    let logoUrl = '';
    const storageRef = ref(storage, `logos/${user.uid}/${logoFile ? logoFile.name : 'placeholder.svg'}`);

    try {
      if (logoFile && logoPreview) {
        await uploadString(storageRef, logoPreview, 'data_url');
        logoUrl = await getDownloadURL(storageRef);
      } else {
        const placeholderSvg = generatePlaceholder(storeName);
        await uploadString(storageRef, placeholderSvg, 'data_url');
        logoUrl = await getDownloadURL(storageRef);
      }
      onNext({ storeName, storeLogoUrl: logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
      // Handle error (e.g., show a toast message)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          key="question2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 sm:gap-4"
        >
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 shadow-md flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-2">Set up your store identity</h2>
            <p className="text-gray-600">Add a name and logo for your store. You can change this later.</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 sm:ml-16 space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
            <label htmlFor="storeName" className="font-semibold text-gray-800 mb-2 block">Store Name</label>
            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g., My Awesome Store"
              className="w-full p-4 rounded-xl border-2 border-gray-300/50 bg-white/80 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-400 hover:border-blue-500 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-gray-500" />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/svg+xml"
                className="hidden"
              />
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-all"
              >
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-2">Or a placeholder will be generated.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:ml-16"
        >
          <button
            onClick={handleContinue}
            disabled={!storeName.trim() || isUploading}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Continue'} <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Step3 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [selected, setSelected] = useState('new-business');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          key="question2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 sm:gap-4"
        >
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Target className="w-6 h-6 text-gray-600" />
          </div>
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 shadow-md flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-2">What's your main goal?</h2>
            <p className="text-gray-600">This will help us tailor your experience.</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 sm:ml-16 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}
        >
          {businessGoals.map((option) => {
            const isSelected = selected === option.id;
            return (
              <motion.div
                key={option.id}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelected(option.id)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300/50 bg-white/80 hover:border-gray-400/50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <span className="font-semibold text-gray-800">{option.title}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:ml-16"
        >
          <button
            onClick={() => onNext({ goal: selected })}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Step4 = ({ onFinish }: { onFinish: (data: any) => void }) => {
  const [selected, setSelected] = useState('physical');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          key="question3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 sm:gap-4"
        >
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-600" />
          </div>
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 shadow-md flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-2">What do you plan to sell?</h2>
            <p className="text-gray-600">This helps us set up the right features for you.</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 sm:ml-16 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}
        >
          {productTypes.map((option) => {
            const isSelected = selected === option.id;
            return (
              <motion.div
                key={option.id}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelected(option.id)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300/50 bg-white/80 hover:border-gray-400/50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <span className="font-semibold text-gray-800">{option.title}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:ml-16"
        >
          <button
            onClick={() => onFinish({ productType: selected })}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            Complete Setup <Check className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});
  const { user } = useAuth();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleNext = (data: any) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleFinish = async (data: any) => {
    const finalData = { ...onboardingData, ...data };
    setIsCompleting(true);
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
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6">
      {/* macOS-style background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-5xl">
        {isCompleting ? (
          <motion.div
            key="completing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Lottie animationData={animationData} loop={true} className="w-32 h-32 sm:w-48 sm:h-48 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-3">Finalizing your setup...</h2>
            <p className="text-base sm:text-lg text-gray-600">Get ready to start selling!</p>
          </motion.div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="backdrop-blur-xl bg-white/60 rounded-[24px] border border-white/30 shadow-2xl p-6 sm:p-8 md:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && <Step1 key="step1" onNext={handleNext} />}
                {step === 2 && <Step2 key="step2" onNext={handleNext} />}
                {step === 3 && <Step3 key="step3" onNext={handleNext} />}
                {step === 4 && <Step4 key="step4" onFinish={handleFinish} />}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withOnboarding(OnboardingPage);