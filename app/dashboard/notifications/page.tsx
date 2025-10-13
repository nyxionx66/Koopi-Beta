'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch, getDocs } from 'firebase/firestore';
import { Bell, MessageSquare, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { PageLoader } from '@/components/ui/PageLoader';
import withAuth from '@/components/withAuth';

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: any;
  link: string;
  type: 'new_message' | 'new_order';
};

const NotificationsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  };
  
  if (authLoading || loading) {
    return <PageLoader message="Loading notifications..." />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-gray-300 rounded-full hover:bg-white transition-colors shadow-md active:scale-95 text-sm font-medium"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-lg">No new notifications</p>
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <Link
              key={notif.id}
              href={notif.link}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`flex items-start gap-4 p-6 transition-colors border-b border-gray-200/50 ${
                !notif.isRead ? 'bg-blue-500/10' : 'hover:bg-gray-500/10'
              }`}
            >
              <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center mt-1 ${
                !notif.isRead ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-gray-200 text-gray-600'
              }`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  <TimeAgo date={notif.createdAt?.toDate()} />
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center shadow-md shadow-blue-500/50 animate-pulse"></div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default withAuth(NotificationsPage);