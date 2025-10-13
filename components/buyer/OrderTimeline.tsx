'use client';

import React from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

type OrderTimelineProps = {
  currentStatus: string;
};

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(currentStatus);

  const statusSteps = [
    { label: 'Order Placed', status: 'pending', icon: Package, completed: currentIndex >= 0 },
    { label: 'Processing', status: 'processing', icon: Clock, completed: currentIndex >= 1 },
    { label: 'Shipped', status: 'shipped', icon: Truck, completed: currentIndex >= 2 },
    { label: 'Delivered', status: 'delivered', icon: CheckCircle, completed: currentIndex >= 3 },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/30">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Status</h2>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-white/50 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(statusSteps.filter(s => s.completed).length - 1) * 33.33}%` }}
          />
        </div>

        {/* Status Steps */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    step.completed ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg' : 'bg-white/80 text-gray-400 border border-gray-200/50'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`text-xs sm:text-sm text-center font-medium transition-colors ${
                  step.completed ? 'text-gray-900 font-semibold' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.completed && (
                  <p className="text-xs text-gray-400 mt-1 hidden sm:block">Completed</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
