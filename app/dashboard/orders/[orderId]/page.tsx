'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, Truck, CheckCircle, XCircle, Send, MessageCircle, Printer } from 'lucide-react';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { InlineLoader } from '@/components/ui/InlineLoader';
import { ButtonLoader } from '@/components/ui/ButtonLoader';
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

function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [storeName, setStoreName] = useState('');

  // Set page title dynamically
  useEffect(() => {
    if (order) {
      document.title = `Order #${order.orderNumber} - Koopi Dashboard`;
    }
  }, [order]);

  useEffect(() => {
    if (user) {
      fetchStoreAndOrder();
    }
  }, [orderId, user]);

  useEffect(() => {
    if (!orderId) return;

    // Real-time messages listener
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

  const fetchStoreAndOrder = async () => {
    if (!user) return;

    try {
      // Get store name
      const storeDoc = await getDoc(doc(db, 'stores', user.uid));
      if (storeDoc.exists()) {
        const storeData = storeDoc.data();
        setStoreName(storeData.storeName);

        // Fetch order
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
          
          // Verify this order belongs to this store
          if (orderData.storeName === storeData.storeName) {
            setOrder(orderData);
          } else {
            alert('This order does not belong to your store');
            router.push('/dashboard/orders');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order || updating) return;

    const confirmed = window.confirm(`Are you sure you want to update the order status to "${newStatus}"?`);
    if (!confirmed) return;

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      
      setOrder({ ...order, status: newStatus });
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !storeName) return;

    setSendingMessage(true);
    try {
      await addDoc(collection(db, 'messages'), {
        orderId,
        senderId: user.uid,
        senderType: 'seller',
        senderName: storeName,
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        
        <div className="flex-1 ml-64 flex items-center justify-center">
          <InlineLoader message="Loading order details..." primaryColor="#000000" size="md" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
            <Link href="/dashboard/orders" className="text-gray-900 font-semibold hover:underline">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between print:hidden">
            <div>
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Orders</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600">Placed on {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl border p-6 print:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <StatusIcon className="w-5 h-5" />
                    Order Status
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-2 print:hidden">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      disabled={updating || order.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        order.status === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl border p-6 print:border-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 print:w-16 print:h-16">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.variant && (
                          <p className="text-sm text-gray-500 mt-1">
                            {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Messaging Section */}
              <div className="bg-white rounded-xl border p-6 print:hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Customer Messages
                </h2>

                {/* Messages */}
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No messages yet.</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderType === 'seller' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderType === 'seller'
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-xs font-medium mb-1 opacity-70">{msg.senderName}</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-60">
                            {msg.createdAt?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Reply to customer..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sendingMessage ? (
                      <>
                        <ButtonLoader color="#ffffff" size="sm" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl border p-6 print:border-0">
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{order.buyerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Account Type</p>
                    <p className="font-medium text-gray-900">{order.isGuest ? 'Guest' : 'Registered'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border p-6 print:border-0">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border p-6 print:border-0">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h3>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Package className="w-5 h-5 text-green-700" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-600">Payment pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OrderDetailPage);
