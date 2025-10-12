'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useStore } from '@/contexts/StoreContext';
import { PageLoader } from '@/components/ui/PageLoader';
import { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const storeName = params.storeName as string;
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const { storeData, loading: themeLoading } = useStore();

  // Set page title dynamically
  useEffect(() => {
    if (order && storeData) {
      document.title = `Order Confirmation - ${storeData.storeName}`;
    }
  }, [order, storeData]);

  useEffect(() => {
    fetchOrder();
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
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

  if (loading) {
    const theme = storeData?.website?.theme || { primaryColor: '#000000', backgroundColor: '#f9fafb' };
    return <PageLoader message="Loading order details..." primaryColor={theme.primaryColor} backgroundColor={theme.backgroundColor} />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">This order does not exist</p>
          <Link href={`/store/${storeName}`} className="text-gray-900 font-semibold hover:underline">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const theme = storeData?.website?.theme || {
    primaryColor: '#000000',
    accentColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'inter'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ backgroundColor: theme.primaryColor + '1A' }}>
            <CheckCircle className="w-16 h-16" style={{ color: theme.primaryColor }} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: theme.textColor }}>Order Placed Successfully!</h1>
          <p className="text-xl" style={{ color: theme.textColor, opacity: 0.7 }}>Thank you for your order</p>
          <p className="text-lg mt-3" style={{ color: theme.textColor, opacity: 0.5 }}>Order #{order.orderNumber}</p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border p-6">
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
              <p className="pt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                <p className="text-sm text-gray-600">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
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
            <div className="border-t mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>You will receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>The seller will prepare your order for shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Pay with cash when your order is delivered</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/store/${storeName}`}
              className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}