"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui/PageLoader';
import { BarChart, TrendingUp, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = 'Analytics - Koopi Dashboard';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <PageLoader message="Loading analytics..." primaryColor="#000000" backgroundColor="#f1f1f1" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your store performance and insights</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Analytics Dashboard Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              We're building powerful analytics features to help you understand your business better.
            </p>
            
            {/* Feature Preview */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Sales Trends</p>
                <p className="text-xs text-gray-500 mt-1">Track revenue over time</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Product Performance</p>
                <p className="text-xs text-gray-500 mt-1">Best sellers & insights</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Customer Behavior</p>
                <p className="text-xs text-gray-500 mt-1">Shopping patterns</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Revenue Reports</p>
                <p className="text-xs text-gray-500 mt-1">Detailed breakdowns</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Status:</strong> High priority feature - Coming in Q3 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
