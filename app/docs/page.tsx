'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Book, Code, Zap, Shield, Palette, ShoppingCart, Package, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const docSections = [
  {
    title: 'Getting Started',
    icon: Zap,
    color: 'blue',
    guides: [
      { title: 'Quick Start Guide', description: 'Get your store up and running in 5 minutes', time: '5 min read' },
      { title: 'Creating Your First Product', description: 'Add products with images, variants, and pricing', time: '8 min read' },
      { title: 'Store Setup Checklist', description: 'Everything you need to launch successfully', time: '10 min read' },
      { title: 'Understanding the Dashboard', description: 'Navigate your control panel like a pro', time: '7 min read' },
    ]
  },
  {
    title: 'Store Customization',
    icon: Palette,
    color: 'purple',
    guides: [
      { title: 'Choosing a Theme', description: 'Select from 4 professional designs', time: '5 min read' },
      { title: 'Customizing Colors & Fonts', description: 'Match your brand identity perfectly', time: '6 min read' },
      { title: 'Adding Your Logo', description: 'Upload and position your brand logo', time: '3 min read' },
      { title: 'Hero Section Setup', description: 'Create an eye-catching homepage banner', time: '8 min read' },
    ]
  },
  {
    title: 'Product Management',
    icon: Package,
    color: 'green',
    guides: [
      { title: 'Product Variants Guide', description: 'Size, color, and custom options explained', time: '10 min read' },
      { title: 'Inventory Management', description: 'Track stock levels and get low-stock alerts', time: '7 min read' },
      { title: 'Product Categories', description: 'Organize your catalog efficiently', time: '5 min read' },
      { title: 'Image Optimization', description: 'Best practices for product photos', time: '6 min read' },
    ]
  },
  {
    title: 'Orders & Fulfillment',
    icon: ShoppingCart,
    color: 'amber',
    guides: [
      { title: 'Processing Orders', description: 'Step-by-step order management workflow', time: '9 min read' },
      { title: 'Order Status Updates', description: 'Keep customers informed automatically', time: '5 min read' },
      { title: 'Printing Invoices', description: 'Generate professional order receipts', time: '4 min read' },
      { title: 'Buyer-Seller Chat', description: 'Communicate directly with customers', time: '6 min read' },
    ]
  },
  {
    title: 'Marketing & Promotions',
    icon: CreditCard,
    color: 'pink',
    guides: [
      { title: 'Creating Discount Codes', description: 'Set up percentage, fixed, and free shipping codes', time: '8 min read' },
      { title: 'Promotion Conditions', description: 'Min purchase, date ranges, and usage limits', time: '7 min read' },
      { title: 'Product-Specific Promotions', description: 'Target specific items for special offers', time: '6 min read' },
      { title: 'Tracking Promotion Performance', description: 'Analyze usage and revenue impact', time: '5 min read' },
    ]
  },
  {
    title: 'Advanced Features',
    icon: Code,
    color: 'indigo',
    guides: [
      { title: 'Email Notifications Setup', description: 'Configure SendGrid for automated emails', time: '12 min read' },
      { title: 'Low Stock Alerts', description: 'Set up inventory warning thresholds', time: '5 min read' },
      { title: 'Customer Reviews', description: 'Enable and manage product reviews', time: '7 min read' },
      { title: 'Analytics Dashboard', description: 'Understanding your store metrics (Coming Soon)', time: '10 min read' },
    ]
  },
  {
    title: 'Security & Compliance',
    icon: Shield,
    color: 'red',
    guides: [
      { title: 'Account Security', description: 'Best practices for protecting your store', time: '6 min read' },
      { title: 'Data Privacy', description: 'How we protect customer information', time: '8 min read' },
      { title: 'Terms of Service', description: 'Understanding platform policies', time: '12 min read' },
      { title: 'GDPR Compliance', description: 'Meeting data protection standards', time: '10 min read' },
    ]
  },
  {
    title: 'API Reference',
    icon: Book,
    color: 'cyan',
    guides: [
      { title: 'Firebase Integration', description: 'Working with Firestore and Auth', time: '15 min read' },
      { title: 'Product API', description: 'Programmatically manage your catalog', time: '20 min read' },
      { title: 'Order API', description: 'Integrate with external systems', time: '18 min read' },
      { title: 'Webhooks Guide', description: 'Real-time event notifications (Coming Soon)', time: '12 min read' },
    ]
  },
];

const getColorClasses = (color: string) => {
  const colors: { [key: string]: { bg: string; text: string; border: string } } = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/20' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
  };
  return colors[color] || colors.blue;
};

export default function Documentation() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Book className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything you need to know about <span className="text-blue-500">Koopi</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive guides, tutorials, and references to help you build, launch, and grow your e-commerce store.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {docSections.map((section, index) => {
            const colors = getColorClasses(section.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.guides.map((guide, guideIndex) => (
                    <Link
                      key={guideIndex}
                      href="#"
                      className="group p-4 rounded-xl bg-white/50 border border-gray-200/50 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-500 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                      <span className="text-xs text-gray-500">{guide.time}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-[24px] p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build your store?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start creating your dream e-commerce business today
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
