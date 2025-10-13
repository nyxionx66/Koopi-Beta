"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import { TrialStatusCard } from '@/components/dashboard/TrialStatusCard';
import { PageLoader } from '@/components/ui/PageLoader';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const DashboardHomePage = () => {
  const { user, loading } = useAuth();
  const [hasProducts, setHasProducts] = useState(false);
  const [hasCustomizedStore, setHasCustomizedStore] = useState(false);

  useEffect(() => {
    if (user) {
      const storeDocRef = doc(db, "stores", user.uid);
      const unsubscribe = onSnapshot(storeDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const storeData = docSnap.data();
          setHasProducts(storeData.hasProducts === true);
          setHasCustomizedStore(storeData.hasCustomizedStore === true);
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
      {/* macOS-style background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <TrialStatusCard />
        <WelcomeCard
          hasProducts={hasProducts}
          hasCustomizedStore={hasCustomizedStore}
          hasPaymentSetup={false} // Assuming payment setup is not yet tracked
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;