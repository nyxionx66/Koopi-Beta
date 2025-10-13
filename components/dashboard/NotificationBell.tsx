'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { motion, AnimatePresence } from 'framer-motion';

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: any;
  link: string;
  type: 'new_message' | 'new_order';
};

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellRef.current && !bellRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = () => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.top - 8}px`,
        left: `${rect.left + rect.width + 16}px`,
      });
    }
    setIsOpen(prev => !prev);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
    setIsOpen(false);
  };

  return (
    <div>
      <button ref={bellRef} onClick={handleToggle} className="relative p-2 rounded-full hover:bg-gray-200/50 transition-colors">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && isMounted && createPortal(
          <motion.div
            ref={dropdownRef}
            style={dropdownStyle}
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="w-80 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200/50">
              <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="font-medium">No new notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <Link
                    key={notif.id}
                    href={notif.link}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`flex items-start gap-4 p-4 transition-colors border-b border-gray-200/50 ${
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
          </motion.div>,
          document.getElementById('portal-root')!
        )}
      </AnimatePresence>
    </div>
  );
};