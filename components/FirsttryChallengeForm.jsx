"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const FirsttryChallengeForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [challengeName, setChallengeName] = useState("");
  const [games, setGames] = useState([
    { name: "", winCount: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddGame = () => {
    setGames([...games, { name: "", winCount: 0 }]);
  };

  const handleRemoveGame = (index) => {
    const updatedGames = [...games];
    updatedGames.splice(index, 1);
    setGames(updatedGames);
  };

  const handleGameChange = (index, field, value) => {
    const updatedGames = [...games];

    if (field === "winCount") {
      value = Math.max(1, parseInt(value) || 1);
    }

    updatedGames[index] = {
      ...updatedGames[index],
      [field]: value
    };

    setGames(updatedGames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!challengeName.trim()) {
      setErrorMessage("Please enter a name for the challenge.");
      return;
    }

    if (games.some(game => game.winCount < 1)) {
      setErrorMessage("The number of wins must be at least 1 for all games.");
      return;
    }

    if (games.some(game => !game.name.trim())) {
      setErrorMessage("Please give all games a name.");
      return;
    }

    if (!session?.user?.id) {
      setErrorMessage("User not found or not logged in. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const challengeData = {
        name: challengeName,
        type: "FirstTry",
        games: games.map(game => ({
          name: game.name,
          winCount: game.winCount
        })),
        creator: session.user.id
      };

      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) {
        const responseData = await response.text();
        let errorMessage = "Error creating the challenge";
        try {
          const errorData = JSON.parse(responseData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Raw server error:", responseData);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const challengeId = responseData.id || responseData._id || responseData.challengeId;

      if (challengeId) {
        setTimeout(() => {
          router.push(`/challenge/${challengeId}`);
        }, 500);
      } else {
        router.push("/");
      }

    } catch (error) {
      console.error("Error creating challenge:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="rounded-lg gold-gradient-border p-8 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#151515' }}
        >
          <h1 className="text-2xl font-bold gold-text mb-4">You are not logged in!</h1>
          <p className="text-gray-300 mb-6">To create a challenge, you must log in.</p>
          <a href="/login" className="gold-gradient-bg px-6 py-3 rounded-md text-black font-bold inline-block gold-pulse">
            SignIn now
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <h1 className="text-4xl font-bold gold-shimmer-text mb-8 text-center">Create a FirstTry Challenge</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full gold-gradient-border rounded-xl p-6"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="mb-6">
          <label htmlFor="challengeName" className="block gold-text text-lg font-medium mb-2">
            Name of Challenge
          </label>
          <input
            type="text"
            id="challengeName"
            value={challengeName}
            onChange={(e) => setChallengeName(e.target.value)}
            placeholder="e.g. Weekend-Challenge"
            className="w-full px-4 py-3 rounded-md bg-[#151515] border border-[#a6916e] text-white focus:outline-none focus:gold-border"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block gold-text text-lg font-medium mb-4">
            Games
          </label>

          {games.map((game, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row gap-4 mb-4 p-4 border border-[#a6916e] rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-grow">
                <label htmlFor={`gameName-${index}`} className="block text-white text-sm mb-1">
                  Game {index + 1}
                </label>
                <input
                  type="text"
                  id={`gameName-${index}`}
                  value={game.name}
                  onChange={(e) => handleGameChange(index, "name", e.target.value)}
                  placeholder="e.g. Fortnite, Fall Guys B2B"
                  className="w-full px-4 py-3 rounded-md bg-[#151515] text-white border border-gray-700 focus:outline-none focus:border-[#a6916e]"
                  required
                />
              </div>

              <div className="w-full md:w-32">
                <label htmlFor={`winCount-${index}`} className="block text-white text-sm mb-1">
                  Number of Wins
                </label>
                <input
                  type="number"
                  id={`winCount-${index}`}
                  value={game.winCount}
                  onChange={(e) => handleGameChange(index, "winCount", e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-md bg-[#151515] text-white border border-gray-700 focus:outline-none focus:border-[#a6916e]"
                  required
                />
              </div>

              {games.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGame(index)}
                  className="self-end md:self-center p-3 text-white hover:text-black rounded-full cursor-pointer hover:gold-gradient-bg border border-[#a6916e] transition-colors"
                >
                  <Trash2 />
                </button>
              )}
            </motion.div>
          ))}

          <button
            type="button"
            onClick={handleAddGame}
            className="w-full py-3 gold-text flex items-center justify-center gap-2 cursor-pointer rounded-md hover:gold-border mt-4"
          >
            <Plus size={20} />
            <span>Add Game</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900 text-white rounded-md border border-red-600">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-md text-black font-bold text-lg ${isSubmitting
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'gold-gradient-bg gold-pulse cursor-pointer'
            }`}
        >
          {isSubmitting ? 'Wird erstellt...' : 'Challenge erstellen'}
        </button>
      </form>
    </motion.div>
  );
};

export default FirsttryChallengeForm;