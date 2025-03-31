import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TypeWinCard = ({ type, desc, link, isAvailable = true, comingSoon = false }) => {
  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.05 } : { scale: 1.02 }}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
      className="h-full"
    >
      <Link
        href={isAvailable ? link : "#"}
        className={`flex flex-col h-full p-4 md:p-8 rounded-lg text-center transition-all duration-300 ${isAvailable
          ? 'gold-gradient-border gold-pulse'
          : 'border border-gray-800'
          }`}
        onClick={(e) => !isAvailable && e.preventDefault()}
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Header section - fixed at top */}
        <div>
          <h2 className={`font-bold text-2xl md:text-3xl mb-3 ${isAvailable ? 'gold-shimmer-text' : 'gold-text'}`}>
            {type}
          </h2>

          {comingSoon && (
            <div className="text-yellow-400 text-xs md:text-sm py-1 px-2 md:px-3 rounded-full inline-block mb-3" style={{ backgroundColor: '#332211' }}>
              Coming Soon
            </div>
          )}
        </div>

        {/* Middle section - flexible space */}
        <div className="flex-grow flex items-center justify-center my-3 md:my-4">
          <p className="text-gray-300 text-base md:text-lg">{desc}</p>
        </div>

        {/* Footer section - fixed at bottom */}
        <div className="mt-auto pt-3 md:pt-4">
          {isAvailable ? (
            <div className="gold-gradient-bg text-black font-medium py-2 md:py-3 px-4 md:px-6 rounded-md inline-block text-sm md:text-base">
              Choose
            </div>
          ) : (
            <div className="bg-gray-800 text-gray-500 font-medium py-2 md:py-3 px-4 md:px-6 rounded-md inline-block text-sm md:text-base">
              Not available
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default TypeWinCard;