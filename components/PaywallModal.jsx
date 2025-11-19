'use client';
import { CreditCard, Check, X, Crown } from 'lucide-react';

export default function PaywallModal({ onClose }) {
  const handlePurchase = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-lg border border-gray-800 p-6 sm:p-8 max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold gold-shimmer-text mb-2 text-center">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 text-center mb-8">Upgrade now and unlock all features</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Card */}
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6 flex flex-col">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <div className="text-4xl font-bold text-gray-300 mb-1">Free</div>
              <div className="text-gray-500 text-sm">Forever</div>
            </div>

            <div className="space-y-3 flex-grow mb-6">
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Classic Challenge Mode</span>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Up to 10 Challenges per month</span>
              </div>
              <div className="flex items-start">
                <X size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm line-through">FirstTry Challenge</span>
              </div>
              <div className="flex items-start">
                <X size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm line-through">Unlimited Challenges</span>
              </div>
              <div className="flex items-start">
                <X size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm line-through">Streak Tracking</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Card - Highlighted */}
          <div className="bg-[#1a1a1a] rounded-lg gold-gradient-border p-6 flex flex-col relative transform md:scale-105 shadow-2xl">
            {/* Recommended Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="gold-gradient-bg px-4 py-1 rounded-full flex items-center">
                <Crown size={16} className="text-black mr-1" />
                <span className="text-black font-bold text-sm">Recommended</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold gold-shimmer-text mb-2">Premium</h3>
              <div className="text-5xl font-bold gold-text mb-1">€4.99</div>
              <div className="text-gray-400 text-sm">per month - Cancel anytime</div>
            </div>

            <div className="space-y-3 flex-grow mb-6">
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm font-medium">All Basic Features</span>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium text-sm">FirstTry Challenge Mode</div>
                  <div className="text-gray-400 text-xs">Every mistake = Restart</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium text-sm">Unlimited Challenges</div>
                  <div className="text-gray-400 text-xs">No monthly limits</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm font-medium">All future premium features</span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              className="w-full py-3 gold-bg text-black rounded-lg font-bold text-lg flex items-center justify-center hover:opacity-90 transition gold-pulse"
            >
              <CreditCard size={20} className="mr-2" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}