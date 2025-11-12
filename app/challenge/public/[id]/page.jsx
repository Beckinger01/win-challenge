'use client';

import { use } from 'react';
import { User, Clock, Pause } from 'lucide-react';
import { formatTime } from '@/utils/timerUtils.client';
import { useChallengeController } from '@/hooks/useChallengeController';
import StatusBadge from '@/components/StatusBadge';
import GamesGrid from '@/components/GamesGrid';
import { checkCustomRoutes } from '@node_modules/next/dist/lib/load-custom-routes';

export default function ChallengePublicPage({ params }) {
  const resolved = use(params);
  const { id } = resolved;

  const {
    challenge,
    loading,
    error,
    challengeTime,
    gameTimers,
    activeGameIndex,
    pauseTime,
    isPauseRunning,
  } = useChallengeController(id, false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a6916e]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="gold-gradient-border p-8 rounded-lg text-center bg-[#1a1a1a]">
          <h2 className="text-2xl font-bold gold-text mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="gold-gradient-border p-8 rounded-lg text-center bg-[#1a1a1a]">
          <h2 className="text-2xl font-bold gold-text mb-4">Not Found</h2>
          <p className="text-gray-300">Challenge not found</p>
        </div>
      </div>
    );
  }

  const completedGames = challenge.games.filter((g) => g.completed).length;
  const totalGames = Math.max(1, challenge.games.length);
  const progressPercentage = Math.round((completedGames / totalGames) * 100);
  const activeGame =
    activeGameIndex !== null && activeGameIndex !== undefined
      ? challenge.games[activeGameIndex]
      : null;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold gold-shimmer-text pb-4">
          {challenge.name}
        </h1>

        {/* Optional: Creator-Info, falls vorhanden */}
        {challenge.creatorName && (
          <div className="flex items-center justify-center mb-2">
            <User size={16} className="text-[#a6916e] mr-1" />
            <span className="text-[#a6916e]">Created by {challenge.creatorName}</span>
          </div>
        )}

        <p className="text-gray-300">{challenge.type} Challenge</p>
      </div>

      {/* Drei Kacheln: Timer / Overall Progress / Active Game */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Challenge Timer */}
        <div className="gold-gradient-border rounded-lg p-6 bg-[#1a1a1a]">
          <h2 className="text-xl font-semibold mb-4 gold-text">
            <Clock size={20} className="inline mr-2 text-[#a6916e]" />
            Challenge Timer
          </h2>

          <div className="text-5xl font-mono text-center mb-4 gold-shimmer-text">
            {formatTime(challengeTime)}
          </div>

          {/* Pause Timer */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-gray-300">
              <Pause size={18} className="inline mr-1 text-[#a6916e]" />
              <span>Pause Time:</span>
            </div>
            <div className="font-mono gold-text">{formatTime(pauseTime)}</div>
          </div>

          <div className="flex items-center justify-center">
            <StatusBadge challenge={challenge} isPauseRunning={isPauseRunning} />
          </div>
        </div>

        {/* Overall Progress */}
        {challenge?.type === 'Classic' && (
          <div className="gold-gradient-border rounded-lg p-6 bg-[#1a1a1a]">
            <h2 className="text-xl font-semibold mb-4 gold-text">Overall Progress</h2>
            <div className="text-5xl font-bold text-center mb-4 gold-shimmer-text">
              {progressPercentage}%
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-4 mb-4 overflow-hidden">
              <div
                className={`${challenge.forfeited ? 'bg-red-600' : 'gold-gradient-bg'
                  } h-4 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center text-gray-300">
              <span className="font-medium gold-text">{completedGames}</span> of{' '}
              <span className="font-medium gold-text">{totalGames}</span> games completed
              {challenge.forfeited && (
                <div className="text-red-400 mt-2">Challenge was forfeited</div>
              )}
            </div>
          </div>
        )}

        {challenge?.type === 'FirstTry' && (
          <div className="gold-gradient-border rounded-lg p-6 bg-[#1a1a1a]">
            <h2 className="text-xl font-semibold mb-4 gold-text">Lost Streaks</h2>
            <div className="text-5xl font-bold text-center mb-4 gold-shimmer-text">
              {challenge.streaksBroken}
            </div>
            <h2 className="text-l font-semibold mb-4 gold-text">Overall Progress</h2>
            <div className="text-center text-gray-300">
              <span className="font-medium gold-text">{completedGames}</span> of{' '}
              <span className="font-medium gold-text">{totalGames}</span> games completed
              {challenge.forfeited && (
                <div className="text-red-400 mt-2">Challenge was forfeited</div>
              )}
            </div>
          </div>
        )}

        {/* Active Game */}
        <div className="gold-gradient-border rounded-lg p-6 bg-[#1a1a1a]">
          <h2 className="text-xl font-semibold mb-4 gold-text">Active Game</h2>
          {activeGame ? (
            <>
              <div className="text-2xl font-bold text-center mb-4 gold-shimmer-text">
                {activeGame.name}
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-xl font-semibold gold-text">
                    {activeGame.currentWins} / {activeGame.winCount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Timer</div>
                  <div className="text-xl font-mono gold-text">
                    {formatTime(gameTimers?.[activeGameIndex]?.value || 0)}
                  </div>
                </div>
              </div>
              <div className="w-full bg-[#2a2a2a] rounded-full h-4 overflow-hidden">
                <div
                  className="gold-gradient-bg h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (activeGame.currentWins / Math.max(1, activeGame.winCount)) * 100
                    )}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              {challenge.forfeited
                ? 'Challenge was forfeited'
                : challenge.completed
                  ? 'All games completed'
                  : 'No active game'}
            </div>
          )}
        </div>
      </div>

      {/* All Games */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 gold-text">All Games</h2>

        <GamesGrid
          challenge={challenge}
          activeGameIndex={activeGameIndex}
          formatTime={formatTime}
          gameTimers={gameTimers}
          isAuthorized={false}
        />

      </div>
    </div>
  );
}