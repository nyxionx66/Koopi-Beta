"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import { PageLoader } from '@/components/ui/PageLoader';
import SocialMediaKitCard from '@/components/dashboard/SocialMediaKitCard';
import { db } from '@/firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

const DashboardHomePage = () => {
  const { user, loading } = useAuth();
  const [hasProducts, setHasProducts] = useState(false);
  const [hasCustomizedStore, setHasCustomizedStore] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [showSocialMediaKit, setShowSocialMediaKit] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user) {
      const storeDocRef = doc(db, "stores", user.uid);
      const unsubscribe = onSnapshot(storeDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const storeData = docSnap.data();
          setHasProducts(storeData.hasProducts === true);
          setHasCustomizedStore(storeData.hasCustomizedStore === true);
          setStoreName(storeData.storeName || '');
          
          // Build store URL
          if (storeData.storeName) {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            setStoreUrl(`${baseUrl}/store/${storeData.storeName}`);
          }
          
          // Check if user has dismissed the social media kit
          const hasDismissedKit = storeData.hasDismissedSocialKit === true;
          
          // Check if user is new (account created within last 7 days)
          const createdAt = storeData.createdAt?.toDate();
          const now = new Date();
          const daysSinceCreation = createdAt ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) : 999;
          
          // Show kit if: new user (< 7 days), has website enabled, and hasn't dismissed
          const shouldShow = daysSinceCreation < 7 && 
                            storeData.website?.enabled === true && 
                            !hasDismissedKit;
          
          setIsNewUser(daysSinceCreation < 7);
          setShowSocialMediaKit(shouldShow);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleDismissSocialKit = async () => {
    if (!user) return;
    
    try {
      const storeDocRef = doc(db, "stores", user.uid);
      await updateDoc(storeDocRef, {
        hasDismissedSocialKit: true
      });
      setShowSocialMediaKit(false);
    } catch (error) {
      console.error('Error dismissing social kit:', error);
    }
  };

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
        {/* Social Media Kit - Only for new users */}
        {showSocialMediaKit && storeName && (
          <SocialMediaKitCard
            storeName={storeName}
            storeUrl={storeUrl}
            onDismiss={handleDismissSocialKit}
          />
        )}
        
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