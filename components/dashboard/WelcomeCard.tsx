"use client";

import { Circle, CheckCircle, Package, Palette, CreditCard, ArrowRight, Globe, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

type WelcomeCardProps = {
  hasProducts: boolean;
  hasCustomizedStore: boolean;
  hasPaymentSetup: boolean;
};

const WelcomeCard = ({ hasProducts, hasCustomizedStore, hasPaymentSetup }: WelcomeCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [websiteEnabled, setWebsiteEnabled] = useState(false);
  const [storeName, setStoreName] = useState('');
  
  useEffect(() => {
    setMounted(true);
    console.log('WelcomeCard mounted with:', { hasProducts, hasCustomizedStore, hasPaymentSetup });
  }, []);

  useEffect(() => {
    console.log('WelcomeCard state changed:', { hasProducts, hasCustomizedStore, hasPaymentSetup });
  }, [hasProducts, hasCustomizedStore, hasPaymentSetup]);

  useEffect(() => {
    if (!user) return;

    const storeRef = doc(db, 'stores', user.uid);
    const unsubscribe = onSnapshot(storeRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWebsiteEnabled(data.website?.enabled || false);
        setStoreName(data.storeName || '');
      }
    });

    return () => unsubscribe();
  }, [user]);
  
  // Calculate progress
  const completedTasks = [hasProducts, hasCustomizedStore, hasPaymentSetup].filter(Boolean).length;
  const totalTasks = 3;
  const allTasksComplete = completedTasks === totalTasks;

  // Determine current task based on what's completed
  let currentTask = {
    title: 'Add your first product',
    description: 'Start by adding a product and a few key details.',
    buttonText: 'Get started',
    icon: Package,
    step: 1,
    action: () => {
      console.log('Navigating to add product');
      router.push('/dashboard/products/new?from=dashboard');
    }
  };

  if (hasProducts && !hasCustomizedStore) {
    currentTask = {
      title: 'Customize your website',
      description: 'Design your store website with custom hero section, colors, and branding.',
      buttonText: 'Customize website',
      icon: Palette,
      step: 2,
      action: () => {
        console.log('Customize website clicked');
        router.push('/dashboard/website');
      }
    };
  } else if (hasProducts && hasCustomizedStore && !hasPaymentSetup) {
    currentTask = {
      title: 'Set up payment provider',
      description: 'Connect a payment provider to start accepting payments from customers.',
      buttonText: 'Setup payments',
      icon: CreditCard,
      step: 3,
      action: () => {
        console.log('Setup payment clicked');
        alert('Payment setup coming soon!');
      }
    };
  }

  const TaskIcon = currentTask.icon;

  if (!mounted) {
    return null;
  }

  if (allTasksComplete) {
    return (
      <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-600">
                All tasks complete!
              </h2>
            </div>
            
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Your store is ready to launch
            </h1>
            <p className="text-gray-600 text-base mb-4">
              Great job! You've completed all the setup tasks. Your digital product business is ready to go.
            </p>

            {websiteEnabled && storeName && (
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-gray-200/50">
                <Globe className="w-5 h-5 text-gray-700" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Your Store Website</p>
                  <Link
                    href={`/store/${storeName}`}
                    target="_blank"
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1"
                  >
                    {typeof window !== 'undefined' ? window.location.origin : ''}/store/{storeName}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden lg:block ml-8 flex-shrink-0">
            <div className="w-40 h-40 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-24 h-24 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8 mb-8">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 border border-gray-200/50">
                <Circle className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-base font-medium text-gray-500">
                {completedTasks} of {totalTasks} tasks complete
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set up your digital product business
            </h1>
            <p className="text-gray-600 text-base">
              Follow these tasks to quickly set up, manage, and successfully sell your digital products.
            </p>
          </div>

          {/* Current Active Task - Prominent Display */}
          <div className="bg-white/50 rounded-xl p-6 border-2 border-blue-200/50 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
                <TaskIcon className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {currentTask.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentTask.description}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200 flex-shrink-0">
                    Step {currentTask.step}
                  </span>
                </div>
                <button
                  onClick={currentTask.action}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors shadow-md active:scale-95"
                >
                  {currentTask.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-6">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              {hasProducts ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              )}
              <span className={`text-sm font-medium ${hasProducts ? 'text-green-600' : 'text-gray-500'}`}>
                Add product
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-gray-300"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              {hasCustomizedStore ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              )}
              <span className={`text-sm font-medium ${hasCustomizedStore ? 'text-green-600' : 'text-gray-500'}`}>
                Customize
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-gray-300"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              {hasPaymentSetup ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              )}
              <span className={`text-sm font-medium ${hasPaymentSetup ? 'text-green-600' : 'text-gray-500'}`}>
                Payments
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Side Illustration */}
        <div className="hidden lg:block flex-shrink-0">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
            <img
              src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/digital-product-C3y7g_9j.svg"
              alt="Digital business"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;