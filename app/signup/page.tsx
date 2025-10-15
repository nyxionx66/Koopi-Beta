'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { SignupBanner } from '@/components/SignupBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mail, Lock, Store, Package, Sparkles, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/navigation';
import Lottie from "lottie-react";
import animationData from "../../public/loading-animation.json";
import withoutAuth from '@/components/withoutAuth';

const steps = [
  { id: 1, title: 'Create Account', icon: Mail, description: 'Set up your login credentials' },
  { id: 2, title: 'Store Details', icon: Store, description: 'Name and customize your store' },
  { id: 3, title: 'Store Info', icon: ShoppingBag, description: 'Tell us about your business' },
];

function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    storeCategory: '',
  });
  const [error, setError] = useState('');
  const [storeNameStatus, setStoreNameStatus] = useState<'checking' | 'available' | 'unavailable' | 'idle'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentStep !== 2 || formData.storeName.length <= 2) {
      setStoreNameStatus('idle');
      return;
    }

    setStoreNameStatus('checking');
    const debounceCheck = setTimeout(async () => {
      try {
        const storeNameDoc = await getDoc(doc(db, 'storeNames', formData.storeName));
        setStoreNameStatus(storeNameDoc.exists() ? 'unavailable' : 'available');
      } catch (error) {
        console.error('Error checking store name:', error);
        setStoreNameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(debounceCheck);
  }, [formData.storeName, currentStep]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setError('');
    }
    
    if (currentStep === 2) {
      if (!formData.storeName) {
        setError('Please enter a store name');
        return;
      }
      if (storeNameStatus !== 'available') {
        setError('Please choose an available store name');
        return;
      }
      setError('');
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep < steps.length) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check promo availability and claim spot atomically
      let isPro = false;
      const promoRef = doc(db, 'promoConfig', 'earlyAccess');
      
      try {
        await runTransaction(db, async (transaction) => {
          const promoDoc = await transaction.get(promoRef);
          
          if (!promoDoc.exists()) {
            // Initialize promo config if it doesn't exist
            transaction.set(promoRef, {
              totalSpots: 100,
              usedSpots: 1,
              isActive: true,
              createdAt: new Date(),
            });
            isPro = true;
          } else {
            const data = promoDoc.data();
            const spotsLeft = (data.totalSpots || 100) - (data.usedSpots || 0);
            
            if (data.isActive && spotsLeft > 0) {
              // Claim a spot
              transaction.update(promoRef, {
                usedSpots: increment(1),
              });
              isPro = true;
            }
          }
        });
      } catch (error) {
        console.error('Error checking promo:', error);
        // Continue with free plan if promo check fails
      }

      // Create user document with appropriate plan
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        subscription: {
         plan: isPro ? 'pro' : 'free',
         status: 'active',
         productCount: 0,
         productLimit: Infinity, // Unlimited - everything is free!
         ...(isPro ? {
           promoUser: true,
           promoExpiry: null,
         } : {}),
       },
        userType: 'seller',
        onboarding: {
          addedFirstProduct: false,
          customizedStore: false,
        },
      });

      await setDoc(doc(db, 'stores', user.uid), {
        ownerId: user.uid,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        storeCategory: formData.storeCategory,
        createdAt: new Date(),
      });
      
      await setDoc(doc(db, 'storeNames', formData.storeName), {
        ownerId: user.uid,
      });

      // Mark that user saw the promo popup (so it doesn't show again if they visit homepage)
      localStorage.setItem('proOfferSeen', 'true');

      router.push('/onboarding');
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  const isStepValid = () => {
    if (currentStep === 2) {
      return storeNameStatus === 'available';
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      <Header />
      {/* macOS-style background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <main className="relative z-10 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isSubmitting ? (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10 sm:py-20"
            >
              <Lottie animationData={animationData} loop={true} className="w-32 h-32 sm:w-48 sm:h-48 mx-auto" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3">Creating your store...</h2>
              <p className="text-base sm:text-lg text-gray-600">This will only take a moment</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop: Banner on left, form on right */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Side - Banner (hidden on mobile) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hidden lg:block lg:sticky lg:top-20"
                >
                  <SignupBanner />
                </motion.div>

                {/* Right Side - Form */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center lg:text-left mb-6 sm:mb-8"
                  >
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Start Your Journey
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Create Your Store
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                      Join thousands of entrepreneurs building their dream business
                    </p>
                  </motion.div>
                <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-6 sm:p-8 md:p-10">
                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5 sm:space-y-6"
                        >
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                              Create your account
                            </h2>
                            <p className="text-gray-600">
                              Start with your email and a secure password
                            </p>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="At least 6 characters"
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter your password"
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                              Name your store
                            </h2>
                            <p className="text-gray-600">
                              Choose a unique name for your online store
                            </p>
                          </div>

                          <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                              Store name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Store className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                id="storeName"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                                placeholder="My Awesome Store"
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                            
                            {formData.storeName && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 p-3 bg-white/50 rounded-lg border border-gray-200/50"
                              >
                                <p className="text-sm text-gray-600">
                                  Your store URL: <span className="font-semibold text-gray-900">{formData.storeName}.koopi.lk</span>
                                </p>
                              </motion.div>
                            )}

                            {storeNameStatus === 'checking' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Checking availability...
                              </div>
                            )}
                            {storeNameStatus === 'available' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Great! This name is available
                              </div>
                            )}
                            {storeNameStatus === 'unavailable' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                This name is already taken
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                              Tell us about your store
                            </h2>
                            <p className="text-gray-600">
                              Help customers understand what you offer
                            </p>
                          </div>

                          <div>
                            <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-2">
                              Store description <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                              id="storeDescription"
                              name="storeDescription"
                              rows={4}
                              value={formData.storeDescription}
                              onChange={handleChange}
                              placeholder="Tell customers what makes your store special..."
                              className="w-full px-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400 resize-none shadow-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="storeCategory" className="block text-sm font-medium text-gray-700 mb-2">
                              What will you sell? <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                              <select
                                id="storeCategory"
                                name="storeCategory"
                                value={formData.storeCategory}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer shadow-sm"
                              >
                                <option value="">Select a category</option>
                                <option value="fashion">Fashion & Apparel</option>
                                <option value="electronics">Electronics & Gadgets</option>
                                <option value="home">Home & Garden</option>
                                <option value="art">Art & Crafts</option>
                                <option value="digital">Digital Products</option>
                                <option value="services">Services</option>
                                <option value="other">Other</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mt-6"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-4 mt-8">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-gray-700 bg-white/80 border border-gray-300 rounded-full hover:bg-white transition-all active:scale-95 shadow-sm"
                        >
                          <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!isStepValid()}
                        className="flex-1 flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {currentStep === steps.length ? 'Create Store' : 'Continue'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>

                  <p className="text-center lg:text-left text-sm text-gray-600 mt-8">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default withoutAuth(SignUpPage);