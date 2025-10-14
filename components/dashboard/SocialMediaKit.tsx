"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Download, Sparkles, Instagram, Facebook, Twitter, Share2, Zap, Check, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

type SocialMediaKitProps = {
  storeName: string;
  storeUrl: string;
  onClose: () => void;
};

const templates = [
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl font-black text-white mb-4">🎉</div>
          <h1 className="text-4xl font-black text-white mb-2">{storeName}</h1>
          <p className="text-xl text-white/90 font-semibold">is now LIVE!</p>
          <div className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
            <p className="text-white font-medium">Shop Now Online</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-white flex items-center justify-center p-8">
        <div className="text-center border-4 border-black p-12">
          <div className="text-2xl font-light text-gray-600 mb-4">INTRODUCING</div>
          <h1 className="text-5xl font-black text-black mb-4">{storeName}</h1>
          <div className="w-20 h-1 bg-black mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Now Available Online</p>
          <p className="text-sm text-gray-500 mt-4">Shop Our Collection</p>
        </div>
      </div>
    )
  },
  {
    id: 'neon-dark',
    name: 'Neon Glow',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-5xl font-black text-white mb-2" style={{ textShadow: '0 0 20px #00ff88, 0 0 40px #00ff88' }}>
            {storeName}
          </h1>
          <p className="text-2xl font-bold mb-6" style={{ color: '#00ff88', textShadow: '0 0 10px #00ff88' }}>
            JUST LAUNCHED
          </p>
          <div className="px-8 py-3 border-2 border-white rounded-full">
            <p className="text-white font-semibold">SHOP THE COLLECTION</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'pastel-soft',
    name: 'Pastel Dreams',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-8">
        <div className="text-center bg-white/60 backdrop-blur-md p-12 rounded-3xl shadow-xl">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">{storeName}</h1>
          <div className="text-lg text-gray-600 mb-2">We're Live!</div>
          <p className="text-sm text-gray-500">Explore our new online store</p>
          <div className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-medium">
            Visit Now
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-yellow-400 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-black text-yellow-400 text-7xl font-black py-6 px-12 mb-6 transform -rotate-2">
            NEW!
          </div>
          <h1 className="text-5xl font-black text-black mb-4">{storeName}</h1>
          <div className="bg-black text-white px-8 py-4 inline-block transform rotate-1">
            <p className="text-2xl font-bold">NOW ONLINE</p>
          </div>
          <p className="text-xl font-bold text-black mt-6">Start Shopping Today!</p>
        </div>
      </div>
    )
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    preview: (storeName: string) => (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
        <div className="text-center border-2 border-yellow-500 p-12">
          <div className="text-yellow-500 text-xl mb-3 font-serif">Presenting</div>
          <h1 className="text-5xl font-serif font-bold text-yellow-500 mb-4">{storeName}</h1>
          <div className="w-24 h-0.5 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300 font-serif">Grand Opening</p>
          <p className="text-sm text-gray-400 mt-4 font-sans">Discover Premium Quality Online</p>
        </div>
      </div>
    )
  }
];

const tutorialSteps = [
  {
    icon: ImageIcon,
    title: "Choose Your Template",
    description: "Pick from our stunning pre-designed templates"
  },
  {
    icon: Sparkles,
    title: "Customize",
    description: "Your store name is automatically added"
  },
  {
    icon: Download,
    title: "Download & Share",
    description: "Download and post on your social media"
  }
];

export default function SocialMediaKit({ storeName, storeUrl, onClose }: SocialMediaKitProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % tutorialSteps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1080
      });
      
      const link = document.createElement('a');
      link.download = `${storeName.replace(/\s+/g, '-')}-launch-announcement.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Social Media Launch Kit</h2>
              <p className="text-white/90 text-sm">Announce your store to the world! 🎉</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Side - Preview & Download */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Your Launch Card Preview
              </h3>
              
              {/* Animated Preview Card */}
              <motion.div
                key={selectedTemplate.id}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div 
                  ref={cardRef}
                  className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200"
                  style={{ width: '540px', height: '540px' }}
                >
                  {selectedTemplate.preview(storeName)}
                </div>
                
                {/* Floating animation sparkles */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
                    ✨
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Download Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3 hover:shadow-xl transition-shadow disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Image (1080x1080)
                </>
              )}
            </motion.button>

            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="text-sm text-gray-500">Perfect for:</div>
              <Instagram className="w-6 h-6 text-pink-600" />
              <Facebook className="w-6 h-6 text-blue-600" />
              <Twitter className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          {/* Right Side - Templates & Tutorial */}
          <div className="space-y-6">
            {/* Animated Tutorial */}
            {showTutorial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Guide</h3>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {tutorialSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === index;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          x: isActive ? 10 : 0
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive ? 'bg-white shadow-lg' : 'bg-white/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-purple-600' : 'bg-purple-200'
                        }`}>
                          <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Zap className="w-5 h-5 text-yellow-500" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Template Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Style</h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-purple-600 shadow-lg ring-4 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full scale-[0.3] origin-top-left" style={{ width: '333%', height: '333%' }}>
                      {template.preview(storeName)}
                    </div>
                    
                    {selectedTemplate.id === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs font-medium text-white text-center">{template.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
