"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ChallengeOverlay() {
  const params = useParams();
  const challengeId = params.id;
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!challengeId) return;

    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenge/${challengeId}`);
        
        if (!response.ok) {
          throw new Error(`Challenge not found (${response.status})`);
        }
        
        const data = await response.json();
        setChallenge(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();

    // Poll every 2 seconds for updates
    const interval = setInterval(() => {
      if (challenge && !challenge.completed) {
        fetchChallenge();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [challengeId, challenge?.completed]);

  // Update timers every second
  useEffect(() => {
    if (!challenge) return;

    const timer = setInterval(() => {
      if (challenge.timer.isRunning || challenge.games?.some(g => g.timer.isRunning)) {
        setChallenge({ ...challenge }); // Force re-render
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  const formatTime = (ms) => {
    if (!ms) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const calculateElapsed = (timer) => {
    if (!timer.startTime || !timer.isRunning) return timer.duration || 0;
    const now = new Date();
    const runningTime = now - new Date(timer.startTime);
    return Math.max(0, runningTime - (timer.pausedTime || 0));
  };

  const getCurrentTime = (timer) => {
    if (timer.isRunning) {
      return calculateElapsed(timer);
    }
    return timer.duration || 0;
  };

  const getStatus = () => {
    if (!challenge) return "loading";
    if (challenge.forfeited) return "forfeited";
    if (challenge.completed) return "completed";
    if (challenge.paused) return "paused";
    if (challenge.timer.isRunning) return "running";
    return "ready";
  };

  const getStatusLabel = (status) => {
    const labels = {
      running: "● LIVE",
      paused: "⏸ PAUSED",
      completed: "✓ COMPLETED",
      forfeited: "✗ FORFEITED",
      ready: "⏱ READY",
      loading: "...",
    };
    return labels[status] || status.toUpperCase();
  };

  if (loading) {
    return (
      <div className="w-[400px] h-[600px] bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-[#a6916e] rounded-2xl p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#a6916e]/20 border-t-[#a6916e] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a6916e]">Loading Challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[400px] h-[600px] bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-[#a6916e] rounded-2xl p-5 flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  const status = getStatus();
  const currentTime = getCurrentTime(challenge.timer);
  const games = challenge.games || [];

  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-[#a6916e] rounded-2xl p-5 shadow-[0_8px_32px_rgba(166,145,110,0.3)] backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="text-center mb-4 pb-4 border-b-2 border-[#a6916e]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d4af37] via-[#f4e5b8] to-[#d4af37] bg-clip-text text-transparent mb-2 truncate">
          {challenge.name}
        </h1>
        <div className="text-[32px] font-bold text-[#d4af37] tracking-wider drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
          {formatTime(currentTime)}
        </div>
        <div
          className={`inline-block px-4 py-1 rounded-full text-xs font-bold mt-2 ${
            status === "running"
              ? "bg-green-500/20 border border-green-500 text-green-500 animate-pulse"
              : status === "paused"
              ? "bg-yellow-500/20 border border-yellow-500 text-yellow-500"
              : status === "completed"
              ? "bg-blue-500/20 border border-blue-500 text-blue-500"
              : status === "forfeited"
              ? "bg-red-500/20 border border-red-500 text-red-500"
              : "bg-gray-500/20 border border-gray-500 text-gray-500"
          }`}
        >
          {getStatusLabel(status)}
        </div>
      </div>

      {/* Games */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`space-y-3 ${
            challenge.completed || challenge.paused ? "" : "animate-scroll"
          }`}
        >
          {/* Duplicate games for seamless scroll */}
          {[...games, ...games].map((game, index) => {
            const progress = (game.currentWins / game.winCount) * 100;
            const gameTime = getCurrentTime(game.timer);
            const isCompleted = game.completed;
            const isRunning = game.timer.isRunning;

            return (
              <div
                key={`${game.name}-${index}`}
                className={`bg-gradient-to-br ${
                  isCompleted
                    ? "from-green-500/15 to-green-500/5 border-green-500/50"
                    : "from-[#a6916e]/10 to-[#a6916e]/5 border-[#a6916e]/30"
                } border rounded-lg p-4 transition-all`}
              >
                {/* Game Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold text-[#d4af37] flex items-center gap-2">
                    {isCompleted && <span className="text-green-500">✓</span>}
                    <span className="truncate">{game.name}</span>
                  </div>
                  <div
                    className={`text-base font-bold ${
                      isCompleted ? "text-green-500" : "text-white"
                    }`}
                  >
                    {game.currentWins}/{game.winCount}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gradient-to-r from-[#d4af37] to-[#f4e5b8]"
                    } shadow-[0_0_10px_rgba(212,175,55,0.5)]`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Game Timer */}
                <div
                  className={`text-xl font-bold text-center font-mono ${
                    isRunning ? "text-green-500 animate-pulse" : "text-[#a6916e]"
                  }`}
                >
                  {formatTime(gameTime)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  );
}