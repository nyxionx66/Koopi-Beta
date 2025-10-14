"use client";

import { useState, useEffect } from 'react';
import { Share2, Sparkles, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialMediaKit from './SocialMediaKit';

type SocialMediaKitCardProps = {
  storeName: string;
  storeUrl: string;
  onDismiss: () => void;
};

export default function SocialMediaKitCard({ storeName, storeUrl, onDismiss }: SocialMediaKitCardProps) {
  const [showKit, setShowKit] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Generate random particles for animation
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
  }, []);

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative backdrop-blur-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-[24px] border border-purple-200/50 shadow-2xl p-8 overflow-hidden"
      >
        {/* Animated background particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">NEW FEATURE</span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                🎉
              </motion.div>
            </motion.div>

            {/* Title */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Your Store is Live! 🚀
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg"
              >
                Tell the world about it with our <span className="font-semibold text-purple-600">Social Media Launch Kit</span>
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {[
                { icon: "🎨", text: "6 stunning pre-designed templates" },
                { icon: "⚡", text: "Instant download, ready to post" },
                { icon: "📱", text: "Perfect for Instagram, Facebook & more" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowKit(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.1 }}
              />
              <span className="relative flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Create Launch Post
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </div>

          {/* Right side - Animated preview mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative mx-auto w-64 h-[480px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Animated template preview */}
                  <motion.div
                    animate={{
                      backgroundImage: [
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="w-full h-full flex items-center justify-center p-6"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-5xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white text-2xl font-bold"
                      >
                        {storeName}
                      </motion.div>
                      <div className="text-white/90 text-sm mt-2">is now LIVE!</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
              >
                ⚡
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-2 -right-2 w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center text-xl shadow-lg"
              >
                ❤️
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-lg shadow-lg"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.4), transparent)",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Social Media Kit Modal */}
      <AnimatePresence>
        {showKit && (
          <SocialMediaKit
            storeName={storeName}
            storeUrl={storeUrl}
            onClose={() => setShowKit(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
