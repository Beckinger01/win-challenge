"use client";

import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CookieBanner from '@components/CookieBanner';

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
      delayChildren: 0.3
    }
  }
};

const Home = () => {
  const { data: session} = useSession();
  const router = useRouter();

  const handleCreateChallenge = () => {
    if (session?.user) {
      router.push('/create-challenge');
    }else {
      router.push('/login');
    }
  };

  const handleCallToAction = () => {
    if (session?.user) {
      router.push('/create-challenge');
    } else {
      router.push('/login');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-6xl font-pop font-bold text-center text-white sm:text-9xl mb-2"
            variants={fadeInUp}
            custom={0}
          >
            <span className="gold-shimmer-text">Win</span>-Challenge
          </motion.h1>

          <motion.div
            className="h-1 w-24 gold-gradient-bg mx-auto my-6 rounded-full"
            variants={fadeInUp}
            custom={1}
          ></motion.div>

          <motion.p
            className="text-center text-gray-200 sm:text-2xl text-xl max-w-3xl mx-auto"
            variants={fadeInUp}
            custom={2}
          >
            Create your own challenge or watch others live
          </motion.p>
        </motion.div>

        <motion.div
          className="text-center mt-10 text-gray-300 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.p
            className="mb-6 text-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            This Win-Challenge Webapp offers you a place, where you can define and track challenges.
          </motion.p>

          <motion.p
            className="text-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            Choose between Classic, Coin Toss or First Try challenges - each with customizable timers and special features for streamers.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center mt-12 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {session?.user ? ( 
            <button onClick={handleCreateChallenge} className="gold-gradient-bg px-8 py-4 rounded-md text-black font-bold text-lg shadow-lg inline-block">
              Create Challenge
            </button>
            ) : (
              <button onClick={handleCreateChallenge} className="gold-gradient-bg px-8 py-4 rounded-md text-black font-bold text-lg shadow-lg inline-block">
                Sign In
              </button>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/search-challenge" className="bg-transparent border-2 border-white px-8 py-4 rounded-md text-white font-bold text-lg inline-block">
              Watch Live
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold pb-4 gold-shimmer-text">
              Why Win-Challenge?
            </h2>
            <div className="h-1 w-16 gold-gradient-bg rounded-full"></div>
          </motion.div>

          <div className="max-w-7xl mx-auto flex flex-col gap-24">
            {/* Feature 1 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-full md:w-1/3 h-64 relative overflow-hidden rounded-lg shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="images/800x500.svg"
                  alt="Choose Your Challenge Type"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="w-full md:w-2/3">
                <motion.h3
                  className="text-3xl font-bold mb-6 gold-shimmer-text"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  Multiple Challenge Types
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-4 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  Choose between three exciting challenge formats to match your goals and style.
                </motion.p>
                <motion.p
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                  <span className="font-bold">Classic Challenge:</span> Just win the games and complete the challenge.<br />
                  <span className="font-bold">Coin Toss Challenge:</span> Throw a coin and spice up your challenge.<br />
                  <span className="font-bold">First Try Challenge:</span> One shot, one opportunity - complete alle games in a row.
                </motion.p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-full md:w-1/3 h-64 relative overflow-hidden rounded-lg shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="images/800x500.svg"
                  alt="Live Streaming"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="w-full md:w-2/3">
                <motion.h3
                  className="text-3xl font-bold mb-6 gold-shimmer-text"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  Stream Integration
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-4 text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  Win-Challenge is built with streamers in mind, offering seamless integration with your streaming setup.
                </motion.p>
                <motion.p
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                  Our integrated streaming system lets you share your progress live. Share a link to your views to watch live or use a browser scource for OBS. You can add your twitch link, so even viewers can join your stream, wich are browsing throw the challenges.
                </motion.p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-full md:w-1/3 h-64 relative overflow-hidden rounded-lg shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="images/800x500.svg"
                  alt="Customizable Timers"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="w-full md:w-2/3">
                <motion.h3
                  className="text-3xl font-bold mb-6 gold-shimmer-text"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  Live View
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-4 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  Watch challenges live.
                </motion.p>
                <motion.p
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                   Watch your the challenge of your favorite streamer or frined live and at realtime. See all standings and timers of challenge and Games.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-center py-16 px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Ready for your <span className="gold-shimmer-text">Challenge</span>?
          </motion.h2>
          <motion.p
            className="text-gray-200 text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            Start now and achieve your goals
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <button onClick={handleCallToAction} className="inline-block gold-gradient-bg px-10 py-4 rounded-md text-black font-bold text-lg shadow-xl">
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-gray-800 bg-gradient-to-br from-[#1f1a14] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-10 md:mb-0">
              <motion.h2
                className="text-2xl font-bold gold-shimmer-text mb-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Win-Challenge
              </motion.h2>
              <motion.p
                className="text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                Achieve your goals, together.
              </motion.p>
              <motion.div
                className="flex mt-6 space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </motion.div>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-4 text-center md:text-right"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/data-policy" className="text-gray-300 hover:text-white transition-colors">
                Data Policy
              </Link>
              <Link href="/refund" className="text-gray-300 hover:text-white transition-colors">
                Refund Policy
              </Link>
              <Link href="/impressum" className="text-gray-300 hover:text-white transition-colors">
                Impressum
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
};

export default Home;