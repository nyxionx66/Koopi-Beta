'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { ArrowLeft, Package, MapPin, Send, MessageCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/PageLoader';
import { ButtonLoader } from '@/components/ui/ButtonLoader';
import { OrderTimeline } from '@/components/buyer/OrderTimeline';
import { Order } from '@/types';

type Message = {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  message: string;
  createdAt: any;
};

export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { buyer, buyerProfile, loading: authLoading } = useBuyerAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'classic' | 'modern' | 'minimalist' | 'bold'>('modern');

  useEffect(() => {
    if (order) {
      document.title = `Track Order #${order.orderNumber} - Koopi`;
    }
  }, [order]);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('orderId', '==', orderId), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !buyer || !buyerProfile) return;

    setSendingMessage(true);
    try {
      await addDoc(collection(db, 'messages'), {
        orderId,
        senderId: buyer.uid,
        senderType: 'buyer',
        senderName: buyerProfile.name,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getThemeStyles = (theme: string) => {
    const styles = {
      classic: {
        bg: 'bg-gradient-to-br from-amber-50 via-white to-gray-50',
        header: 'bg-white border-b-2 border-gray-200',
        card: 'bg-white border-2 border-gray-200 rounded-lg',
        title: 'font-serif text-2xl font-bold text-gray-800',
        subtitle: 'font-serif text-gray-600',
        text: 'text-gray-700',
        button: 'px-5 py-2.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-serif',
        input: 'border-2 border-gray-300 rounded-md focus:border-gray-800 focus:ring-0',
        messageMyBg: 'bg-amber-100 border border-amber-200',
        messageTheirBg: 'bg-gray-100 border border-gray-200',
      },
      modern: {
        bg: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        header: 'bg-white shadow-sm',
        card: 'bg-white rounded-2xl shadow-lg',
        title: 'text-3xl font-bold text-gray-900',
        subtitle: 'text-gray-600 font-medium',
        text: 'text-gray-700',
        button: 'px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg',
        input: 'border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        messageMyBg: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
        messageTheirBg: 'bg-gray-100',
      },
      minimalist: {
        bg: 'bg-white',
        header: 'bg-white border-b border-gray-300',
        card: 'bg-white border border-gray-300',
        title: 'text-2xl font-semibold text-black tracking-wide',
        subtitle: 'text-gray-700',
        text: 'text-gray-800',
        button: 'px-5 py-2.5 border-2 border-black text-black hover:bg-black hover:text-white transition-all',
        input: 'border border-gray-400 focus:border-black focus:ring-0',
        messageMyBg: 'bg-black text-white',
        messageTheirBg: 'bg-gray-200',
      },
      bold: {
        bg: 'bg-black',
        header: 'bg-black border-b-4 border-yellow-400',
        card: 'bg-gray-900 border-4 border-yellow-400',
        title: 'text-3xl font-black text-yellow-400 uppercase tracking-wider',
        subtitle: 'text-gray-400 font-mono uppercase',
        text: 'text-gray-300 font-mono',
        button: 'px-6 py-3 bg-yellow-400 text-black rounded-md hover:bg-cyan-400 transition-all font-black uppercase',
        input: 'bg-gray-800 border-2 border-yellow-400 text-white focus:border-cyan-400 focus:ring-0',
        messageMyBg: 'bg-yellow-400 text-black font-bold',
        messageTheirBg: 'bg-gray-800 text-white border-2 border-gray-700',
      },
    };
    return styles[theme as keyof typeof styles] || styles.modern;
  };

  if (loading) {
    return <PageLoader message="Loading order details..." primaryColor="#000000" backgroundColor="#f9fafb" />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">This order does not exist</p>
          <Link href="/buyer/orders" className="text-gray-900 font-semibold hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const themeStyles = getThemeStyles(selectedTheme);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Header */}
      <header className={`${themeStyles.header} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/buyer/orders" 
            className={`flex items-center gap-2 ${selectedTheme === 'bold' ? 'text-yellow-400' : selectedTheme === 'minimalist' ? 'text-black' : 'text-gray-600'} hover:opacity-70 transition-opacity`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Orders</span>
          </Link>

          {/* Theme Switcher */}
          <div className="flex gap-2">
            {(['classic', 'modern', 'minimalist', 'bold'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all capitalize ${
                  selectedTheme === theme
                    ? 'bg-blue-600 text-white font-semibold'
                    : selectedTheme === 'bold' 
                    ? 'bg-gray-800 text-gray-400 hover:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Order Header */}
        <div className={`${themeStyles.card} p-6 sm:p-8 mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={themeStyles.title}>Order #{order.orderNumber}</h1>
              <p className={themeStyles.subtitle}>
                Placed on {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              </p>
              <p className={themeStyles.subtitle}>Store: {order.storeName}</p>
            </div>
            {isCancelled && (
              <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase ${
                selectedTheme === 'bold' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'
              }`}>
                <XCircle className="w-5 h-5" />
                Cancelled
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {!isCancelled && <OrderTimeline currentStatus={order.status} theme={selectedTheme} />}

            {/* Order Items */}
            <div className={`${themeStyles.card} p-6 sm:p-8`}>
              <h2 className={`text-xl font-bold mb-6 ${selectedTheme === 'bold' ? 'text-yellow-400 uppercase' : selectedTheme === 'minimalist' ? 'text-black' : 'text-gray-900'}`}>
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className={`flex gap-4 pb-4 ${index !== order.items.length - 1 ? 'border-b' : ''} ${selectedTheme === 'bold' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`w-20 h-20 flex-shrink-0 rounded-lg ${selectedTheme === 'bold' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className={`w-8 h-8 ${selectedTheme === 'bold' ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${selectedTheme === 'bold' ? 'text-white' : selectedTheme === 'classic' ? 'font-serif text-gray-800' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className={`text-sm ${selectedTheme === 'bold' ? 'text-gray-500 font-mono' : 'text-gray-500'}`}>
                          {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                        </p>
                      )}
                      <p className={`text-sm ${selectedTheme === 'bold' ? 'text-gray-400 font-mono' : 'text-gray-600'}`}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className={`font-semibold ${selectedTheme === 'bold' ? 'text-yellow-400 font-mono' : selectedTheme === 'classic' ? 'font-serif text-gray-800' : 'text-gray-900'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className={`mt-6 pt-6 border-t ${selectedTheme === 'bold' ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
                <div className={`flex justify-between ${themeStyles.text}`}>
                  <span>Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.text}`}>
                  <span>Shipping</span>
                  <span className="font-medium">${order.shipping.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.text}`}>
                  <span>Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between pt-2 border-t text-lg font-bold ${selectedTheme === 'bold' ? 'text-yellow-400 border-gray-700 font-mono' : selectedTheme === 'classic' ? 'text-gray-900 font-serif border-gray-200' : 'text-gray-900 border-gray-200'}`}>
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className={`${themeStyles.card} p-6`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${selectedTheme === 'bold' ? 'text-yellow-400 uppercase' : selectedTheme === 'minimalist' ? 'text-black' : 'text-gray-900'}`}>
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className={`space-y-1 ${themeStyles.text} ${selectedTheme === 'bold' ? 'font-mono' : ''}`}>
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Messages */}
            <div className={`${themeStyles.card} p-6`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${selectedTheme === 'bold' ? 'text-yellow-400 uppercase' : selectedTheme === 'minimalist' ? 'text-black' : 'text-gray-900'}`}>
                <MessageCircle className="w-5 h-5" />
                Messages
              </h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className={`text-sm ${selectedTheme === 'bold' ? 'text-gray-400 font-mono' : 'text-gray-500'}`}>
                    No messages yet. Start a conversation with the seller.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.senderType === 'buyer' ? themeStyles.messageMyBg : themeStyles.messageTheirBg
                      }`}
                    >
                      <p className={`text-xs font-semibold mb-1 ${msg.senderType === 'buyer' && selectedTheme === 'modern' ? 'text-blue-100' : 'opacity-70'}`}>
                        {msg.senderName}
                      </p>
                      <p className={`text-sm ${selectedTheme === 'bold' ? 'font-mono' : ''}`}>{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 px-3 py-2 ${themeStyles.input}`}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className={`px-4 py-2 ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {sendingMessage ? <ButtonLoader color={selectedTheme === 'bold' ? '#000' : '#fff'} /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}