'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Koopi?',
    answer: 'Koopi is a modern e-commerce platform that allows you to create and manage your own online store with ease. We provide beautiful themes, powerful features, and a simple interface to help you get started.'
  },
  {
    question: 'How much does it cost?',
    answer: 'Koopi is currently free to use with all features included. We will be introducing a premium plan in the future with advanced features, but for now, you can enjoy everything Koopi has to offer at no cost.'
  },
  {
    question: 'What kind of products can I sell?',
    answer: 'You can sell a wide variety of physical and digital products on Koopi. Our platform is flexible and can be adapted to suit your needs, whether you\'re selling clothing, art, or digital downloads.'
  },
  {
    question: 'Do I need any technical skills?',
    answer: 'Not at all! Koopi is designed to be user-friendly and intuitive. You can customize your store, add products, and manage orders without writing a single line of code.'
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">FAQ</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </p>
        </div>
        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200/50 pb-4">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-4"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}