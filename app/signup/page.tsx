'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mail, Lock, Store, Package, Sparkles, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        subscription: {
          status: 'free_trial',
          plan: 'basic',
          trialEndDate: new Date(new Date().setDate(new Date().getDate() + 14)),
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

      setTimeout(() => {
        router.push('/onboarding');
      }, 2000);
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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      <main className="pt-20 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {isSubmitting ? (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <Lottie animationData={animationData} loop={true} className="w-48 h-48 mx-auto" />
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mt-8 mb-3">Creating your store...</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">This will only take a moment</p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Start Your Journey
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  Create Your Store
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs building their dream business with Koopi
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center w-full">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          currentStep > step.id 
                            ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white' 
                            : currentStep === step.id 
                            ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white' 
                            : 'bg-transparent border-neutral-300 dark:border-neutral-700'
                        }`}>
                          {currentStep > step.id ? (
                            <svg className="w-6 h-6 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <step.icon className={`w-6 h-6 ${
                              currentStep === step.id 
                                ? 'text-white dark:text-neutral-900' 
                                : 'text-neutral-400'
                            }`} />
                          )}
                        </div>
                        <div className="mt-3 text-center hidden md:block">
                          <p className={`text-sm font-semibold ${
                            currentStep >= step.id 
                              ? 'text-neutral-900 dark:text-white' 
                              : 'text-neutral-400'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 transition-all ${
                          currentStep > step.id 
                            ? 'bg-neutral-900 dark:bg-white' 
                            : 'bg-neutral-300 dark:bg-neutral-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 md:p-10 shadow-xl">
                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                              Create your account
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              Start with your email and a secure password
                            </p>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              Email address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="h-5 w-5 text-neutral-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white placeholder-neutral-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-neutral-400" />
                              </div>
                              <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="At least 6 characters"
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white placeholder-neutral-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              Confirm password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-neutral-400" />
                              </div>
                              <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter your password"
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white placeholder-neutral-400"
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
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                              Name your store
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              Choose a unique name for your online store
                            </p>
                          </div>

                          <div>
                            <label htmlFor="storeName" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              Store name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Store className="h-5 w-5 text-neutral-400" />
                              </div>
                              <input
                                type="text"
                                id="storeName"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                                placeholder="My Awesome Store"
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white placeholder-neutral-400"
                              />
                            </div>
                            
                            {formData.storeName && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                              >
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Your store URL: <span className="font-semibold text-neutral-900 dark:text-white">{formData.storeName}.koopi.lk</span>
                                </p>
                              </motion.div>
                            )}

                            {storeNameStatus === 'checking' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Checking availability...
                              </div>
                            )}
                            {storeNameStatus === 'available' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-neutral-900 dark:text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Great! This name is available
                              </div>
                            )}
                            {storeNameStatus === 'unavailable' && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-red-600 dark:text-red-400">
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
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                              Tell us about your store
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              Help customers understand what you offer
                            </p>
                          </div>

                          <div>
                            <label htmlFor="storeDescription" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              Store description <span className="text-neutral-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                              id="storeDescription"
                              name="storeDescription"
                              rows={4}
                              value={formData.storeDescription}
                              onChange={handleChange}
                              placeholder="Tell customers what makes your store special..."
                              className="w-full px-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white placeholder-neutral-400 resize-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="storeCategory" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                              What will you sell? <span className="text-neutral-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Package className="h-5 w-5 text-neutral-400" />
                              </div>
                              <select
                                id="storeCategory"
                                name="storeCategory"
                                value={formData.storeCategory}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all text-neutral-900 dark:text-white appearance-none cursor-pointer"
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
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mt-6"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-4 mt-8">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-neutral-900 dark:text-white bg-transparent border-2 border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!isStepValid()}
                        className="flex-1 flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                      >
                        {currentStep === steps.length ? 'Create Store' : 'Continue'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>

                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-8">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-semibold text-neutral-900 dark:text-white hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default withoutAuth(SignUpPage);