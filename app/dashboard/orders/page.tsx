'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Package, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { InlineLoader } from '@/components/ui/InlineLoader';
import { Order } from '@/types';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeName, setStoreName] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchStoreAndOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchStoreAndOrders = async () => {
    if (!user) return;

    try {
      // Get store name
      const storeDoc = await getDoc(doc(db, 'stores', user.uid));
      if (storeDoc.exists()) {
        const storeData = storeDoc.data();
        setStoreName(storeData.storeName);

        // Fetch orders for this store
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('storeName', '==', storeData.storeName),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.shippingAddress.name.toLowerCase().includes(query) ||
        order.buyerEmail.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

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

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const stats = getOrderStats();

  const filterTabs = [
    { name: 'All', value: 'all', count: stats.total },
    { name: 'Pending', value: 'pending', count: stats.pending },
    { name: 'Processing', value: 'processing', count: stats.processing },
    { name: 'Shipped', value: 'shipped', count: stats.shipped },
    { name: 'Delivered', value: 'delivered', count: stats.delivered },
    { name: 'Cancelled', value: 'cancelled', count: stats.cancelled },
  ];

  return (
    <div className="bg-[#f1f1f1] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              statusFilter === tab.value
                ? 'text-gray-700 bg-gray-100'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search by order #, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Orders Content */}
      {loading ? (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <InlineLoader message="Loading orders..." primaryColor="#000000" size="md" />
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="max-w-2xl mx-auto text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </h2>
              <p className="text-gray-600">
                {orders.length === 0
                  ? 'Orders will appear here when customers make purchases'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b border-gray-200">
                  <th className="p-4">ORDER</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">ITEMS</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.isGuest ? 'Guest' : 'Account'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{order.shippingAddress.name}</p>
                        <p className="text-xs text-gray-500">{order.buyerEmail}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(OrdersPage);