"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';

type TimeFilter = 'today' | 'last7days' | 'last30days';

const QuickLookWidget = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
  });
  const [timeFilter, setTimeFilter] = useState({ name: 'Today' });

  const timeOptions = [
    { name: 'Today' },
    { name: 'Last 7 Days' },
    { name: 'Last 30 Days' },
  ];

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, timeFilter]);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const now = new Date();
      let startDate: Date;

      switch (timeFilter.name) {
        case 'Today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'Last 7 Days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      }

      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('storeId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      );

      const querySnapshot = await getDocs(q);
      let revenue = 0;
      let orders = 0;
      let pendingOrders = 0;

      querySnapshot.forEach((doc) => {
        const order = doc.data();
        revenue += order.total;
        orders++;
        if (order.status === 'pending') {
          pendingOrders++;
        }
      });

      setStats({ revenue, orders, pendingOrders });
    } catch (error) {
      console.error("Error fetching stats: ", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, isLoading }: { icon: React.ElementType, title: string, value: string | number, isLoading: boolean }) => (
    <div className="bg-white/70 border border-white/30 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        {isLoading ? (
          <div className="h-7 w-28 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Look</h3>
        <CustomDropdown
          options={timeOptions}
          selected={timeFilter}
          setSelected={setTimeFilter}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`LKR ${stats.revenue.toFixed(2)}`}
          isLoading={loading}
        />
        <StatCard
          icon={ShoppingCart}
          title="Orders"
          value={stats.orders}
          isLoading={loading}
        />
        <StatCard
          icon={Package}
          title="Pending Orders"
          value={stats.pendingOrders}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default QuickLookWidget;