'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatTime } from '@/utils/timerUtils.client';
import GameCard from '@components/GameCard';
import NoScrollView from '@/components/NoScrollView';
import { useChallengeController } from '@/hooks/useChallengeController';
import ChallengeHeader from '@/components/ChallengeHeader';

function useHideNavOnNoScroll(isNoScrollView) {
  useEffect(() => {
    const nav = document.querySelector('nav');
    const main = document.querySelector('main');
    if (isNoScrollView) {
      if (nav) nav.style.display = 'none';
      if (main) main.style.paddingTop = '0';
    } else {
      if (nav) nav.style.display = '';
      if (main) main.style.paddingTop = '';
    }
    return () => {
      if (nav) nav.style.display = '';
      if (main) main.style.paddingTop = '';
    };
  }, [isNoScrollView]);
}

export default function ChallengeControlPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: session } = useSession();
  const [isNoScrollView, setIsNoScrollView] = useState(false);

  const {
    challenge,
    loading,
    error,
    isAuthorized,
    isConnected,
    challengeTime,
    gameTimers,
    activeGameIndex,
    pendingGameIndex,
    isSwitchingGame,
    pauseTime,
    isPauseRunning,
    startChallengeTimer,
    pauseChallengeTimer,
    stopChallengeTimer,
    switchToGame,
    increaseWinCount,
    setError,
  } = useChallengeController(id, true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fullscreenParam = urlParams.get('fullscreen');
    if (fullscreenParam === 'true') setIsNoScrollView(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (isNoScrollView) {
      url.searchParams.set('fullscreen', 'true');
    } else {
      url.searchParams.delete('fullscreen');
    }
    window.history.pushState({}, '', url);
  }, [isNoScrollView]);

  useHideNavOnNoScroll(isNoScrollView);

  const toggleView = () => {
    setIsNoScrollView((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 gold-border" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="text-red-500 mb-4 text-center">{error}</div>
        <Link href="/profile" className="px-4 py-2 gold-bg text-black rounded">
          Back to Profile
        </Link>
      </div>
    );
  }
  if (!session?.user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="gold-text mb-4 text-center">
          You must be logged in to control the challenge
        </div>
        <Link
          href={`/login?callbackUrl=/challenge/${id}`}
          className="px-4 py-2 gold-bg text-black rounded"
        >
          Back to Login
        </Link>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="gold-text mb-4 text-center">
          You are not authorized to control this challenge
        </div>
        <div className="gold-text mb-4 text-center">
          The challenge can only be controlled by the creator
        </div>
        <Link href="/profile" className="px-4 py-2 gold-bg text-black rounded">
          Back to Profile
        </Link>
      </div>
    );
  }
  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-screen p-4 gold-shimmer-text text-center">
        Challenge not found
      </div>
    );
  }

  if (isNoScrollView) {
    return (
      <div className="min-h-screen">
        <ChallengeHeader
          title={challenge.name}
          isConnected={isConnected}
          onToggleView={toggleView}
          viewLabel="Standard view"
          publicUrl={`${window.location.origin}/challenge/public/${id}`}
        />

        <NoScrollView
          challenge={challenge}
          challengeTime={challengeTime}
          gameTimers={gameTimers}
          activeGameIndex={activeGameIndex}
          isPauseRunning={isPauseRunning}
          pauseTime={pauseTime}
          startChallengeTimer={startChallengeTimer}
          pauseChallengeTimer={pauseChallengeTimer}
          stopChallengeTimer={stopChallengeTimer}
          switchToGame={switchToGame}
          increaseWinCount={(index, e) => {
            e?.stopPropagation?.();
            increaseWinCount(index);
          }}
          isSwitchingGame={isSwitchingGame}
          pendingGameIndex={pendingGameIndex}
          toggleView={toggleView}
          challengeName={challenge.name}
          isConnected={isConnected}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        <ChallengeHeader
          title={challenge.name}
          isConnected={isConnected}
          onToggleView={toggleView}
          viewLabel="Presentation view"
          publicUrl={`${window.location.origin}/challenge/public/${id}`}
          overlayUrl={`${window.location.origin}/overlay.html?id=${id}`}
          showOverlayButton={true}
        />

        {/* Timer + Pause */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-5xl sm:text-7xl md:text-9xl font-mono font-bold gold-shimmer-text mb-3">
            {formatTime(challengeTime)}
          </div>
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="py-2 px-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold gold-text">Paused Time:</h2>
                <div className="text-lg sm:text-2xl font-mono gold-shimmer-text ml-4">
                  {formatTime(pauseTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center flex-wrap sm:flex-nowrap gap-3 sm:space-x-6 w-full max-w-xl mb-6">
            <button
              onClick={startChallengeTimer}
              disabled={challenge.timer?.isRunning || challenge.completed}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${challenge.timer?.isRunning || challenge.completed
                ? 'bg-gray-800 text-gray-600'
                : 'gold-bg text-black gold-pulse'
                } transition duration-300`}
            >
              Start
            </button>
            <button
              onClick={pauseChallengeTimer}
              disabled={!challenge.timer?.isRunning || challenge.completed}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${!challenge.timer?.isRunning || challenge.completed
                ? 'bg-gray-800 text-gray-600'
                : 'gold-bg text-black'
                } transition duration-300`}
            >
              Pause
            </button>
            <button
              onClick={stopChallengeTimer}
              disabled={challenge.completed || (!challenge.timer?.startTime && !challenge.timer?.isRunning)}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${challenge.completed || (!challenge.timer?.startTime && !challenge.timer?.isRunning)
                ? 'bg-gray-800 text-gray-600'
                : 'bg-red-700 text-white hover:bg-red-800'
                } transition duration-300`}
            >
              Give Up
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center mb-6">
            <span className="font-medium text-base sm:text-lg mr-2 text-gray-400">Status:</span>
            {challenge.forfeited ? (
              <span className="text-red-500 text-base sm:text-lg font-bold">Forfeited</span>
            ) : challenge.completed ? (
              <span className="text-green-500 text-base sm:text-lg font-bold">Finished</span>
            ) : challenge.paused ? (
              <span className="text-yellow-500 text-base sm:text-lg font-bold">Paused</span>
            ) : challenge.timer?.isRunning ? (
              <span className="text-blue-500 text-base sm:text-lg font-bold">Running</span>
            ) : (
              <span className="text-gray-500 text-base sm:text-lg font-bold">Not started</span>
            )}
          </div>
        </div>

        {/* Games */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 sm:p-6 shadow-lg relative">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 gold-shimmer-text border-b border-[#333333] pb-2">
              Games
            </h2>

            {challenge.completed && (
              <div className="absolute top-0 right-0 px-2 py-1 bg-red-800 text-red-300 text-xs rounded-bl">
                Challenge ended
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
              Select a game to start its timer. The active game will be marked with a colored border.
            </p>

            {isSwitchingGame && (
              <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
                <div className="text-center">
                  <div className="gold-shimmer-text text-xl sm:text-2xl font-semibold mb-2">
                    Changing Game
                  </div>
                  <div className="flex justify-center">
                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1" />
                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-200" />
                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-400" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {challenge.games.map((game, index) => (
                <GameCard
                  key={game.id ?? game._id ?? `${game.name}-${index}`}
                  challenge={challenge}
                  game={game}
                  index={index}
                  isSwitchingGame={isSwitchingGame}
                  activeGameIndex={activeGameIndex}
                  pendingGameIndex={pendingGameIndex}
                  switchToGame={switchToGame}
                  increaseWinCount={(i, e) => {
                    e?.stopPropagation?.();
                    increaseWinCount(i);
                  }}
                  formatTime={formatTime}
                  gameTimers={gameTimers}
                  isAuthorized={isAuthorized}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}