"use client";

import { Plus, ListOrdered } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickActionsWidget = () => {
  const router = useRouter();

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-[24px] p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="flex items-center gap-3 p-4 bg-white/80 rounded-xl border border-gray-200/80 hover:bg-white hover:border-gray-300/80 transition-all shadow-sm"
        >
          <ListOrdered className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">View All Orders</h3>
            <p className="text-sm text-gray-500">See your recent sales</p>
          </div>
        </button>
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="flex items-center gap-3 p-4 bg-white/80 rounded-xl border border-gray-200/80 hover:bg-white hover:border-gray-300/80 transition-all shadow-sm"
        >
          <Plus className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-500">Create a new listing</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsWidget;