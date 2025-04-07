"use client";

import { useSession } from "next-auth/react";
import TypeWinCard from "@/components/TypeWinCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.8,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1
    }
  }
};

const CreateChallenge = () => {
  const { data: session, status } = useSession();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isClient || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 gold-border"></div>
      </div>
    );
  }

  return (
    <section className={`w-full ${isSmallScreen ? 'min-h-screen' : 'max-h-screen'} flex flex-col justify-center items-center px-4 py-10 md:py-8`}>
      {session?.user ? (
        <motion.div
          className="w-full max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="mb-6 md:mb-8"
            variants={fadeInUp}
            custom={0}
          >
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-4">
              Choose your type of <span className="gold-shimmer-text">Win-Challenge</span>
            </h1>
            <div className="h-1 w-32 gold-gradient-bg mx-auto my-3 rounded-full"></div>
            <p className="text-gray-300 text-base md:text-xl py-5 max-w-3xl mx-auto">
              Each challenge type offers a unique gaming experience with different rules and challenges
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
            variants={fadeInUp}
            custom={1}
          >
            <TypeWinCard
              type="Classic"
              desc="The Classic Win Challenge. You must win all the selected games."
              link="/create-challenge/classic"
              isAvailable={true}
              isSmallScreen={isSmallScreen}
            />

            <TypeWinCard
              type="Coin Toss"
              desc="After each win, a coin is tossed. A win only counts if heads or tails are correctly guessed."
              link="#"
              isAvailable={false}
              comingSoon={true}
              isSmallScreen={isSmallScreen}
            />

            <TypeWinCard
              type="FirstTry"
              desc="All victories must be won consecutively. Once you lose, you have to start over."
              link="#"
              isAvailable={false}
              comingSoon={true}
              isSmallScreen={isSmallScreen}
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="rounded-lg gold-gradient-border p-8 max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#151515' }}
        >
          <h1 className="text-2xl font-bold gold-text mb-4">You are not logged in!</h1>
          <p className="text-gray-300 mb-6">To create a challenge, you must log in.</p>
          <a href="/login?returnUrl=/create-challenge" className="gold-gradient-bg px-6 py-3 rounded-md text-black font-bold inline-block gold-pulse">
            SignIn now!
          </a>
        </motion.div>
      )}
    </section>
  );
};

export default CreateChallenge;