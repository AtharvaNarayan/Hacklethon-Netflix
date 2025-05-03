import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsNew = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const features = [
    {
      title: "Watch Together",
      description: "Watch movies in sync with friends! Create rooms, chat in real-time, and enjoy together.",
      icon: "👥",
      details: [
        "Real-time video synchronization",
        "Live chat with room members",
        "Emoji reactions during playback",
        "Theater mode for optimal viewing"
      ]
    },
    {
      title: "Movie Shopping",
      description: "Purchase your favorite movies in various formats with our new shopping feature!",
      icon: "🛍️",
      details: [
        "Multiple format options",
        "Easy checkout process",
        "Stock availability tracking",
        "Shopping cart management"
      ]
    },
    {
      title: "Preview on Hover",
      description: "Hover over movies to see dynamic previews before watching!",
      icon: "🎬",
      details: [
        "3-second video previews",
        "Themed preview clips",
        "Smooth transitions",
        "High-quality snippets"
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 right-8 z-50 w-96 bg-gradient-to-br from-black/95 to-gray-900/95 
                 rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            What's New? 🎉
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </motion.button>
        </div>

        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeatureIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute inset-0"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{features[currentFeatureIndex].icon}</span>
                <h3 className="text-xl font-semibold text-white">
                  {features[currentFeatureIndex].title}
                </h3>
              </div>
              
              <p className="text-gray-400 mb-4">
                {features[currentFeatureIndex].description}
              </p>

              <ul className="space-y-2">
                {features[currentFeatureIndex].details.map((detail, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {features.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setCurrentFeatureIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentFeatureIndex === index ? 'bg-white' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WhatsNew; 