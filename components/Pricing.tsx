'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free Forever',
    price: 'LKR 0',
    frequency: '/always',
    description: 'All features included, no restrictions!',
    features: [
      'Unlimited products',
      'Full website customization',
      'All themes & templates',
      'Email support',
      'Order management',
      'Real-time analytics',
      'Social media kit',
      'Everything you need!',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Pro',
    price: 'Coming Soon',
    frequency: '',
    description: 'Advanced features launching soon.',
    features: [
      'Everything in Free',
      'Advanced AI features',
      'Multi-currency support',
      'API access',
      'White-label options',
      'Dedicated support',
    ],
    cta: 'Notify Me',
    href: '/signup',
    featured: false,
    comingSoon: true,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Free Forever. No Catch! 🎉
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          All features included. No credit card required. Pro features coming soon!
        </p>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
          {plans.map((plan, planIdx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: planIdx * 0.1 }}
              className={`relative flex flex-col rounded-3xl p-8 shadow-2xl ${
                plan.featured
                  ? 'bg-gray-900 z-10 lg:scale-105'
                  : 'bg-white/70 backdrop-blur-xl lg:scale-95'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    plan.featured ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-4 text-sm leading-6 ${
                    plan.featured ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.featured ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-6 ${
                      plan.featured ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {plan.frequency}
                  </span>
                </p>
                {!plan.comingSoon ? (
                <Link
                  href={plan.href}
                  aria-describedby={plan.name}
                  className={`mt-6 block rounded-full py-2.5 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform active:scale-95 ${
                    plan.featured
                      ? 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'
                      : 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-6 w-full rounded-full py-2.5 px-3 text-center text-sm font-semibold leading-6 bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              )}
              </div>
              <ul
                role="list"
                className={`mt-8 space-y-3 text-sm leading-6 xl:mt-10 ${
                  plan.featured ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${
                        plan.featured ? 'text-white' : 'text-blue-600'
                      }`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};