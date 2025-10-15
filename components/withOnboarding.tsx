'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { PageLoader } from './ui/PageLoader';

const withOnboarding = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      if (!loading) {
        checkOnboardingStatus();
      }
    }, [user, loading, router]);

    const checkOnboardingStatus = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Redirect to dashboard only if onboarding is complete AND a logo URL exists.
        if (userData.onboarding?.isCompleted && userData.storeLogoUrl) {
          router.push('/dashboard');
        }
        // Otherwise, the user should be on the onboarding page, so we do nothing.
      }
      // If the doc doesn't exist, the user is new, so they should be on the onboarding page.
      
      setChecking(false);
    };

    if (loading || !user || checking) {
      return <PageLoader message="Loading..." primaryColor="#000000" backgroundColor="#ffffff" />;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withOnboarding;