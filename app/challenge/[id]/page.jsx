'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatTime } from '@/utils/timerUtils.client';
import GamesGrid from '@components/GamesGrid';
import NoScrollView from '@/components/NoScrollView';
import { useChallengeController } from '@/hooks/useChallengeController';
import ChallengeHeader from '@/components/ChallengeHeader';
import TimerControlsPanel from '@components/TimerControlsPanel';
import StatusBadge from '@components/StatusBadge';

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

        <TimerControlsPanel
          challenge={challenge}
          challengeTime={challengeTime}
          pauseTime={pauseTime}
          formatTime={formatTime}
          onStart={startChallengeTimer}
          onPause={pauseChallengeTimer}
          onStop={stopChallengeTimer}
        />

        {/* Status */}
        <div className="flex items-center justify-center mb-6">
          <span className="font-medium text-base sm:text-lg mr-2 text-gray-400">Status:</span>
          <div className="flex items-center justify-center">
            <StatusBadge challenge={challenge} isPauseRunning={isPauseRunning} />
          </div>
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

          {challenge?.type === 'FirstTry' && (
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 gold-shimmer-text border-b border-[#333333] pb-2">
              Lost Streaks: {challenge.streaksBroken}
            </h3>
          )}

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

          <GamesGrid
            challenge={challenge}
            isSwitchingGame={isSwitchingGame}
            activeGameIndex={activeGameIndex}
            pendingGameIndex={pendingGameIndex}
            switchToGame={switchToGame}
            increaseWinCount={(i) => increaseWinCount(i)}
            formatTime={formatTime}
            gameTimers={gameTimers}
            isAuthorized={isAuthorized}
          />
        </div>
      </div>
    </div>
  );
}