'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Search, Book, MessageCircle, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const faqCategories = [
  {
    title: 'Getting Started',
    icon: Book,
    faqs: [
      {
        question: 'How do I create my first store?',
        answer: 'Click "Start for Free" on the homepage, enter your email and password, choose a store name, and complete the setup wizard. You\'ll be up and running in less than 5 minutes!'
      },
      {
        question: 'Is Koopi really free?',
        answer: 'Yes! Koopi offers unlimited products and all core features completely free. We believe every entrepreneur deserves access to professional e-commerce tools.'
      },
      {
        question: 'Do I need coding skills?',
        answer: 'Not at all! Koopi is designed to be completely no-code. Our intuitive interface lets you build and customize your store with simple clicks and drag-and-drop.'
      }
    ]
  },
  {
    title: 'Products & Inventory',
    icon: Book,
    faqs: [
      {
        question: 'How many products can I add?',
        answer: 'There\'s no limit! Add as many products as you want, with unlimited images, variants, and descriptions.'
      },
      {
        question: 'Can I add product variants?',
        answer: 'Yes! Add variants like size, color, material, and custom options. Each variant can have its own price, inventory, and images.'
      },
      {
        question: 'How does inventory management work?',
        answer: 'Koopi automatically tracks inventory levels. You\'ll receive low-stock alerts via email and in-dashboard notifications when products are running low.'
      }
    ]
  },
  {
    title: 'Orders & Payments',
    icon: Book,
    faqs: [
      {
        question: 'What payment methods are supported?',
        answer: 'Currently, we support Cash on Delivery (COD). Online payment integration with Stripe and PayPal is coming soon!'
      },
      {
        question: 'How do I manage orders?',
        answer: 'Access your Orders dashboard to view, filter, and update order statuses. You can communicate with customers directly through the built-in chat feature.'
      },
      {
        question: 'Can I print invoices?',
        answer: 'Yes! Each order has a "Print Invoice" option that generates a professional PDF invoice for your customers.'
      }
    ]
  },
  {
    title: 'Promotions & Marketing',
    icon: Book,
    faqs: [
      {
        question: 'How do discount codes work?',
        answer: 'Create percentage-based, fixed amount, or free shipping codes. Set conditions like minimum purchase amount, date ranges, and usage limits.'
      },
      {
        question: 'Can I target specific products?',
        answer: 'Yes! Apply promotions to your entire order or select specific products. Perfect for seasonal sales or clearing old inventory.'
      },
      {
        question: 'Do I get marketing analytics?',
        answer: 'Every promotion includes usage tracking so you can see how many times it\'s been used and the total discount given.'
      }
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How can we <span className="text-blue-500">help you?</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers, guides, and resources to get the most out of Koopi
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="/docs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all"
            >
              <Book className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                Documentation
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive guides and API references
              </p>
              <span className="inline-flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                Read docs <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </motion.a>

            <motion.a
              href="/community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all"
            >
              <MessageCircle className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-500 transition-colors">
                Community
              </h3>
              <p className="text-gray-600 mb-4">
                Connect with other sellers and get help
              </p>
              <span className="inline-flex items-center text-purple-500 font-semibold group-hover:gap-2 transition-all">
                Join community <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </motion.a>

            <motion.a
              href="mailto:support@koopi.lk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all"
            >
              <Mail className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-500 transition-colors">
                Contact Support
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized help from our team
              </p>
              <span className="inline-flex items-center text-green-500 font-semibold group-hover:gap-2 transition-all">
                Send email <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="backdrop-blur-xl bg-white/70 rounded-[24px] border border-white/30 shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <category.icon className="w-6 h-6 text-blue-500" />
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const id = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openFaq === id;
                    
                    return (
                      <div key={faqIndex} className="border-b border-gray-200/50 last:border-0 pb-3 last:pb-0">
                        <button
                          onClick={() => toggleFaq(id)}
                          className="w-full flex items-center justify-between text-left py-2 group"
                        >
                          <span className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                            {faq.question}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-gray-600 leading-relaxed"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-[24px] p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Our support team is here to help you succeed
          </p>
          <a
            href="mailto:support@koopi.lk"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
          >
            Contact Support <Mail className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
