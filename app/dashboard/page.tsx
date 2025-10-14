"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SocialMediaKitCard from '@/components/dashboard/SocialMediaKitCard';
import QuickLookWidget from '@/components/dashboard/QuickLookWidget';
import { PageLoader } from '@/components/ui/PageLoader';

const DashboardHomePage = () => {
  const { user, loading } = useAuth();
  const [hasProducts, setHasProducts] = useState(false);
  const [hasCustomizedStore, setHasCustomizedStore] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [showSocialMediaKit, setShowSocialMediaKit] = useState(false);

  useEffect(() => {
    if (user) {
      const storeDocRef = doc(db, "stores", user.uid);
      const unsubscribe = onSnapshot(storeDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const storeData = docSnap.data();
          setHasProducts(storeData.hasProducts === true);
          setHasCustomizedStore(storeData.hasCustomizedStore === true);
          setStoreName(storeData.storeName || '');
          if (storeData.storeName) {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            setStoreUrl(`${baseUrl}/store/${storeData.storeName}`);
          }
          setShowSocialMediaKit(!!storeData.storeName);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <QuickLookWidget />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <WelcomeCard
              hasProducts={hasProducts}
              hasCustomizedStore={hasCustomizedStore}
              hasPaymentSetup={false}
            />
          </div>
          {showSocialMediaKit && storeName && (
            <div className="lg:col-span-2">
              <SocialMediaKitCard
                storeName={storeName}
                storeUrl={storeUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;