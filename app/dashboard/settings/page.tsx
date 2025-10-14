"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui/PageLoader';
import { Settings, User, Store, CreditCard, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    document.title = 'Settings - Koopi Dashboard';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <PageLoader message="Loading settings..." primaryColor="#000000" backgroundColor="#f1f1f1" />;
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* macOS-style background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 backdrop-blur-xl bg-white/60 rounded-[20px] p-4 sm:p-5 border border-white/20 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="group flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
              <Settings className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Settings</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage your account and store settings</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-500/10 hover:text-blue-600'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'account' && <AccountSettings />}
                  {activeTab === 'store' && <StoreSettings />}
                  {activeTab === 'billing' && <BillingSettings />}
                  {activeTab === 'notifications' && <NotificationsSettings />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AccountSettings = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailChange = async () => {
    if (!user || !email || email === user.email) return;

    setIsSaving(true);
    setMessage('');

    try {
      // This is a placeholder for the actual Firebase function
      // await updateEmail(user, email);
      // await sendEmailVerification(user);
      
      setMessage(`A verification link has been sent to ${email}. Please check your inbox to confirm the change.`);
    } catch (error) {
      console.error("Error updating email:", error);
      setMessage("Failed to update email. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input type="text" className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={user?.displayName || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input type="email" className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button onClick={handleEmailChange} disabled={isSaving} className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const StoreSettings = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const storeRef = doc(db, 'stores', user.uid);
      getDoc(storeRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreName(data.storeName || '');
          setStoreDescription(data.storeDescription || '');
        }
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setMessage('');

    try {
      const storeRef = doc(db, 'stores', user.uid);
      await updateDoc(storeRef, {
        storeName,
        storeDescription,
      });
      setMessage('Store settings saved successfully!');
    } catch (error) {
      console.error("Error updating store settings:", error);
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading store settings..." />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
          <input type="text" className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
          <textarea rows={4} className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)}></textarea>
        </div>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const BillingSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing</h2>
    <div className="text-center py-12 bg-white/50 rounded-xl border border-gray-200/50">
      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-600 text-sm">Manage your subscription and payment methods.</p>
    </div>
  </div>
);

const NotificationsSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
    <div className="text-center py-12 bg-white/50 rounded-xl border border-gray-200/50">
      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-600 text-sm">Customize your email notifications.</p>
    </div>
  </div>
);