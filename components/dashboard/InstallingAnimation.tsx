'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type InstallingAnimationProps = {};

export function InstallingAnimation({}: InstallingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4 font-medium"
        >
          Installing...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}