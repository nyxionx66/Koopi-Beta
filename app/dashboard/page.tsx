"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import { db } from '@/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { PageLoader } from '@/components/ui/PageLoader';

const DashboardHomePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trialExpanded, setTrialExpanded] = useState(false);
  const [daysLeft, setDaysLeft] = useState(14);
  
  // Achievement tracking - Initialize with explicit false values
  const [hasProducts, setHasProducts] = useState(false);
  const [hasCustomizedStore, setHasCustomizedStore] = useState(false);
  const [hasPaymentSetup, setHasPaymentSetup] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('Setting up Firestore listener for user:', user.uid);
    
    const storeDocRef = doc(db, "stores", user.uid);
    
    // Initial fetch to ensure we have data
    getDoc(storeDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Initial store data:', data);
        setHasProducts(data.hasProducts === true);
        setHasCustomizedStore(data.hasCustomizedStore === true);
        setHasPaymentSetup(data.hasPaymentSetup === true);
      } else {
        console.log('No store document exists yet');
        setHasProducts(false);
        setHasCustomizedStore(false);
        setHasPaymentSetup(false);
      }
      setLoading(false);
    });

    // Set up real-time listener
    const unsubscribe = onSnapshot(storeDocRef, (docSnap) => {
      console.log('Firestore snapshot received');
      
      if (docSnap.exists()) {
        const storeData = docSnap.data();
        console.log('Store data updated:', storeData);
        
        // Update achievement states with explicit boolean conversion
        const newHasProducts = storeData.hasProducts === true;
        const newHasCustomizedStore = storeData.hasCustomizedStore === true;
        const newHasPaymentSetup = storeData.hasPaymentSetup === true;
        
        console.log('Setting achievements:', {
          hasProducts: newHasProducts,
          hasCustomizedStore: newHasCustomizedStore,
          hasPaymentSetup: newHasPaymentSetup
        });
        
        setHasProducts(newHasProducts);
        setHasCustomizedStore(newHasCustomizedStore);
        setHasPaymentSetup(newHasPaymentSetup);
        
        // Calculate trial days
        if (storeData.createdAt) {
          const createdDate = storeData.createdAt.toDate();
          const trialEndDate = new Date(createdDate);
          trialEndDate.setDate(trialEndDate.getDate() + 14);
          const today = new Date();
          const diffTime = trialEndDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(Math.max(0, diffDays));
        }
      } else {
        console.log('Store document does not exist in snapshot');
        setHasProducts(false);
        setHasCustomizedStore(false);
        setHasPaymentSetup(false);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in Firestore listener:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up Firestore listener');
      unsubscribe();
    };
  }, [user]);

  // Debug logging when states change
  useEffect(() => {
    console.log('Dashboard state updated:', {
      hasProducts,
      hasCustomizedStore,
      hasPaymentSetup
    });
  }, [hasProducts, hasCustomizedStore, hasPaymentSetup]);

  if (loading) {
    return (
      <div className="p-8 bg-[#f1f1f1] min-h-screen flex items-center justify-center">
        <PageLoader message="Loading your dashboard..." primaryColor="#000000" backgroundColor="#f1f1f1" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f1f1f1] min-h-screen relative">
      {/* Welcome Card with Current Task */}
      <WelcomeCard 
        hasProducts={hasProducts}
        hasCustomizedStore={hasCustomizedStore}
        hasPaymentSetup={hasPaymentSetup}
      />

      {/* Trial Banner */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-[#1a1a1a] text-white rounded-xl shadow-2xl overflow-hidden max-w-sm">
          <div
            className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#252525] transition-colors"
            onClick={() => setTrialExpanded(!trialExpanded)}
          >
            <span className="text-[13px] font-medium">{daysLeft} days left in your trial</span>
            <svg
              className={`w-4 h-4 transition-transform ${trialExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {trialExpanded && (
            <div className="px-4 pb-4 border-t border-gray-700">
              <p className="text-[13px] text-gray-300 mt-3 mb-1">Your trial ends on October 23</p>
              <p className="text-[12px] text-gray-400 mb-3">Select a plan and get:</p>
              <ul className="text-[12px] text-gray-300 space-y-1 mb-4">
                <li>• First 3 months for $1/month</li>
                <li>• <span className="underline">$20 USD Domain discount</span></li>
              </ul>
              <button className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-[13px] font-medium hover:bg-gray-100 transition-colors">
                Select a plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;