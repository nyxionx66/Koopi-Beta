'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Order } from '@/types';

type OrderCardProps = {
  order: Order;
};

const getStatusConfig = (status: string) => {
  const configs = {
    pending: 'bg-yellow-100 text-yellow-900',
    processing: 'bg-blue-100 text-blue-900',
    shipped: 'bg-indigo-100 text-indigo-900',
    delivered: 'bg-green-100 text-green-900',
    cancelled: 'bg-red-100 text-red-900',
  };

  return configs[status as keyof typeof configs] || configs.pending;
};

export function OrderCard({ order }: OrderCardProps) {
  const statusClass = getStatusConfig(order.status);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-blue-600 mt-1 font-semibold">{order.storeName}</p>
            <p className="text-xs text-gray-500 mt-1">
              {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) || 'Recent'}
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusClass}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex gap-3 px-6 py-4">
        {order.items.slice(0, 4).map((item, idx) => (
          <div key={idx} className="w-24 h-24 bg-white/50 rounded-xl border-2 border-white/30">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {order.items.length > 4 && (
          <div className="w-24 h-24 bg-white/50 rounded-xl border-2 border-white/30 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              +{order.items.length - 4}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-5 bg-white/50 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">Total</p>
          <p className="text-3xl font-bold text-gray-900">LKR {order.total.toFixed(2)}</p>
        </div>
        <Link href={`/buyer/track-order/${order.id}`} className="px-6 py-3 bg-blue-500 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md">
          Track Order
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}