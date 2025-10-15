'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const systemStatus = {
  overall: 'operational', // operational, degraded, down
  services: [
    { name: 'Web Application', status: 'operational', uptime: '99.99%' },
    { name: 'API Services', status: 'operational', uptime: '99.98%' },
    { name: 'Database (Firebase)', status: 'operational', uptime: '99.99%' },
    { name: 'File Storage', status: 'operational', uptime: '99.97%' },
    { name: 'Authentication', status: 'operational', uptime: '100%' },
    { name: 'Email Notifications', status: 'operational', uptime: '99.95%' },
  ],
};

const incidents = [
  {
    date: 'January 15, 2025',
    title: 'All Systems Operational',
    description: 'All services are running smoothly with no reported issues.',
    status: 'resolved',
    duration: 'N/A',
  },
  {
    date: 'January 10, 2025',
    title: 'Email Notification Delays',
    description: 'Some users experienced delays in receiving order confirmation emails. Issue was resolved within 15 minutes.',
    status: 'resolved',
    duration: '15 minutes',
  },
  {
    date: 'January 5, 2025',
    title: 'Scheduled Maintenance',
    description: 'Routine database optimization and system updates. Zero downtime achieved.',
    status: 'resolved',
    duration: '0 minutes',
  },
];

const upcomingMaintenance = [
  {
    date: 'January 25, 2025',
    time: '02:00 AM - 03:00 AM UTC',
    title: 'Planned Infrastructure Upgrade',
    description: 'We will be upgrading our servers for improved performance. Expected downtime: less than 5 minutes.',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational':
      return {
        icon: CheckCircle,
        text: 'Operational',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-600',
        iconColor: 'text-green-500',
      };
    case 'degraded':
      return {
        icon: AlertCircle,
        text: 'Degraded',
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-600',
        iconColor: 'text-yellow-500',
      };
    case 'down':
      return {
        icon: AlertCircle,
        text: 'Down',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-600',
        iconColor: 'text-red-500',
      };
    default:
      return {
        icon: Clock,
        text: 'Unknown',
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-600',
        iconColor: 'text-gray-500',
      };
  }
};

export default function Status() {
  const overallStatus = getStatusBadge(systemStatus.overall);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 ${overallStatus.bgColor} border border-${overallStatus.iconColor}/20 rounded-full px-4 py-2 mb-6`}>
              <Activity className={`w-4 h-4 ${overallStatus.iconColor}`} />
              <span className={`text-sm font-semibold ${overallStatus.textColor}`}>System Status</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              All Systems <span className="text-green-500">Operational</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real-time status and uptime monitoring for all Koopi services
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Last checked: Just now</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Status</h2>
          <div className="backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl overflow-hidden">
            {systemStatus.services.map((service, index) => {
              const badge = getStatusBadge(service.status);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-6 border-b border-gray-200/50 last:border-0 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <badge.icon className={`w-6 h-6 ${badge.iconColor}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 ${badge.bgColor} ${badge.textColor} rounded-full text-sm font-medium`}>
                    {badge.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Maintenance */}
      {upcomingMaintenance.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Maintenance</h2>
            <div className="space-y-4">
              {upcomingMaintenance.map((maintenance, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-[20px] p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-blue-600">{maintenance.date}</span>
                        <span className="text-sm text-blue-600/70">{maintenance.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{maintenance.title}</h3>
                      <p className="text-gray-700">{maintenance.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Incident History */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/70 rounded-[20px] border border-white/30 shadow-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${incident.status === 'resolved' ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-5 h-5 ${incident.status === 'resolved' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">{incident.date}</span>
                      <span className={`px-3 py-1 ${incident.status === 'resolved' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'} rounded-full text-xs font-medium capitalize`}>
                        {incident.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{incident.title}</h3>
                    <p className="text-gray-600 mb-2">{incident.description}</p>
                    <p className="text-sm text-gray-500">Duration: {incident.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-[24px] p-12 shadow-2xl">
          <Activity className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Get status updates
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Subscribe to receive notifications about incidents and maintenance
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
