'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, Zap, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiMwMDAiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-full px-5 py-2.5 mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trusted by 2,500+ Entrepreneurs
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight mb-6"
          >
            <span className="block text-gray-900">Build Your Dream</span>
            <span className="block text-blue-600">
              E-Commerce Store
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed"
          >
            Launch your online business in minutes. <span className="font-semibold text-gray-900">Unlimited products</span>, 
            <span className="font-semibold text-gray-900"> zero fees</span>, and everything you need to succeed.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">5-Min Setup</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">No Monthly Fees</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <Star className="w-4 h-4 text-purple-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">4 Pro Themes</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 text-base font-semibold text-white bg-blue-600 rounded-full shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Start for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 text-base font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded-full border border-gray-300 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Watch Demo
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex -space-x-3">
              {[
                'https://randomuser.me/api/portraits/women/79.jpg',
                'https://randomuser.me/api/portraits/men/32.jpg',
                'https://randomuser.me/api/portraits/women/57.jpg',
                'https://randomuser.me/api/portraits/men/45.jpg',
                'https://randomuser.me/api/portraits/women/28.jpg',
              ].map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt="User"
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-white shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">5.0</span> from 1,000+ reviews
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
