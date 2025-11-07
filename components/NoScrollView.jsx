'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { formatTime } from '@/utils/timerUtils.client';
import TimerControlsPanel from './TimerControlsPanel';
import StatusBadge from './StatusBadge';
import GamesGrid from './GamesGrid';

const NoScrollView = ({
    challenge,
    challengeTime,
    gameTimers,
    activeGameIndex,
    isPauseRunning,
    pauseTime,
    startChallengeTimer,
    pauseChallengeTimer,
    stopChallengeTimer,
    switchToGame,
    increaseWinCount,
    isSwitchingGame,
    pendingGameIndex,
}) => {
    const [rotatingGameIndex, setRotatingGameIndex] = useState(0);
    const scrollRef = useRef(null);
    const activeGameRef = useRef(null);

    // Rotation alle 5s
    useEffect(() => {
        if (!challenge?.games?.length) return;
        const interval = setInterval(() => {
            setRotatingGameIndex((prevIndex) => {
                const len = challenge.games.length;
                if (!len) return 0;
                return (prevIndex + 1) % len;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [challenge?.games?.length]);

    // Kappe Rotation wenn sich die Länge ändert
    useEffect(() => {
        const len = challenge?.games?.length ?? 0;
        if (!len) {
            setRotatingGameIndex(0);
            return;
        }
        if (rotatingGameIndex >= len) {
            setRotatingGameIndex(len - 1);
        }
    }, [challenge?.games?.length, rotatingGameIndex]);

    // Zum aktiven Spiel scrollen
    useEffect(() => {
        if (!scrollRef.current) return;
        if (activeGameIndex === null || activeGameIndex === undefined) return;
        const gameItems = scrollRef.current.querySelectorAll('.game-list-item');
        if (gameItems[activeGameIndex]) {
            gameItems[activeGameIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeGameIndex]);

    if (!challenge) return null;

    const activeGame =
        activeGameIndex !== null && activeGameIndex !== undefined
            ? challenge.games[activeGameIndex]
            : null;

    const rotatingGame =
        (challenge.games?.length ?? 0) > 0 ? challenge.games[rotatingGameIndex] : null;

    const canActivateListItem = useCallback(
        (idx) =>
            !isSwitchingGame &&
            !challenge?.paused &&
            !challenge?.completed &&
            !!challenge?.timer?.isRunning &&
            !challenge?.games?.[idx]?.completed,
        [challenge, isSwitchingGame]
    );

    const handleListItemClick = useCallback(
        (index, disabled) => {
            if (disabled) return;
            switchToGame(index);
        },
        [switchToGame]
    );

    const handleWinClick = useCallback(() => {
        if (!activeGame) return;
        if (!challenge?.paused && !challenge?.completed && challenge?.timer?.isRunning) {
            increaseWinCount(activeGameIndex);
        }
    }, [activeGame, challenge, increaseWinCount, activeGameIndex]);

    return (
        <div className="max-h-screen text-white">
            {/* Timer + Controls */}
            <div className="flex flex-col items-center justify-center pt-6 pb-4">
                <TimerControlsPanel
                    challenge={challenge}
                    challengeTime={challengeTime}
                    pauseTime={pauseTime}
                    formatTime={formatTime}
                    onStart={startChallengeTimer}
                    onPause={pauseChallengeTimer}
                    onStop={stopChallengeTimer}
                />

                <div className="flex items-center justify-center mb-4">
                    <span className="font-medium text-lg mr-2 text-gray-400">Status:</span>
                    <StatusBadge challenge={challenge} isPauseRunning={isPauseRunning} />
                </div>
            </div>

            {/* Three columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 h-[calc(100vh-400px)]">
                {/* Left: Scrollable game list (eigene Liste mit Scroll + Activate-Logik) */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 overflow-hidden relative">
                    <h2 className="text-xl font-semibold mb-3 gold-shimmer-text border-b border-[#333333] pb-2">
                        Game List
                    </h2>

                    {isSwitchingGame && (
                        <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                                <div className="gold-shimmer-text text-2xl font-semibold mb-2">Game is changing</div>
                                <div className="flex justify-center">
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1" />
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-200" />
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} className="overflow-y-auto h-[calc(100%-40px)] pr-1 auto-scroll">
                        {(challenge.games ?? []).map((game, index) => {
                            const key = game.id ?? game._id ?? `${game.name ?? 'game'}-${index}`;
                            const isActive = activeGameIndex === index || pendingGameIndex === index;
                            const disabled = game.completed ? true : !canActivateListItem(index);

                            return (
                                <div
                                    key={key}
                                    onClick={() => handleListItemClick(index, disabled)}
                                    className={`game-list-item mb-3 p-3 rounded-lg transition-all duration-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                        } ${game.completed
                                            ? 'bg-[#1a1a1a] border-2 border-green-600'
                                            : isActive
                                                ? 'bg-[#1f1a14] border-2 gold-gradient-border'
                                                : 'bg-[#1a1a1a] border border-[#333333] hover:gold-border'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium gold-text">{game.name}</h3>
                                        {game.completed ? (
                                            <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">✓</span>
                                        ) : activeGameIndex === index ? (
                                            <span className="px-2 py-1 gold-bg text-black text-xs rounded-full flex items-center">
                                                <span className="w-2 h-2 bg-black rounded-full mr-1 animate-pulse" />
                                                Active
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <div className="text-sm gold-text">
                                            {game.currentWins} / {game.winCount}
                                        </div>
                                        <div className="text-sm font-mono">
                                            {formatTime(gameTimers?.[index]?.value || 0)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Middle: Active game */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-5 relative">
                    <h2 className="text-2xl font-semibold mb-4 gold-shimmer-text border-b border-[#333333] pb-2 text-center">
                        Active Game
                    </h2>

                    {isSwitchingGame && (
                        <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                                <div className="gold-shimmer-text text-2xl font-semibold mb-2">Game is changing</div>
                                <div className="flex justify-center">
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1" />
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-200" />
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGame ? (
                        <div ref={activeGameRef} className="flex flex-col h-[calc(100%-48px)]">
                            {/* Centered name and timer */}
                            <div className="flex flex-col items-center justify-center mb-6">
                                <h3 className="text-3xl font-bold gold-shimmer-text mb-2">{activeGame.name}</h3>
                                <div className="text-3xl font-mono gold-shimmer-text mb-2">
                                    {formatTime(gameTimers?.[activeGameIndex]?.value || 0)}
                                </div>
                                <div className="flex items-center">
                                    {activeGame.completed ? (
                                        <span className="px-3 py-1 bg-green-900 text-green-300 text-base rounded-full">
                                            Finished
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 gold-bg text-black text-base rounded-full flex items-center">
                                            <span className="w-3 h-3 bg-black rounded-full mr-2 animate-pulse" />
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats (ohne Progress-Bar, clean) */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <div className="text-base text-gray-400 mb-1">Progress</div>
                                    <div className="text-3xl font-bold gold-text">
                                        {activeGame.currentWins} / {activeGame.winCount}
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <div className="text-base text-gray-400 mb-1">Game percentage</div>
                                    <div className="text-3xl font-bold gold-text">
                                        {Math.round(
                                            (activeGame.currentWins / Math.max(1, activeGame.winCount)) * 100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow" />

                            <button
                                onClick={handleWinClick}
                                disabled={
                                    activeGame.completed ||
                                    isSwitchingGame ||
                                    challenge.paused ||
                                    challenge.completed ||
                                    !challenge?.timer?.isRunning
                                }
                                className={`w-full py-2 px-2 rounded-lg font-medium text-xl ${activeGame.completed ||
                                        isSwitchingGame ||
                                        challenge.paused ||
                                        challenge.completed ||
                                        !challenge?.timer?.isRunning
                                        ? 'bg-gray-800 text-gray-600'
                                        : 'gold-bg text-black gold-pulse'
                                    } transition duration-300`}
                            >
                                Win +1
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[calc(100%-48px)] text-gray-500 text-xl">
                            No active Game
                        </div>
                    )}
                </div>

                {/* Right: Rotating stats */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-4">
                    <div className="flex justify-between items-center border-b border-[#333333] pb-2 mb-3">
                        <h2 className="text-xl font-semibold gold-shimmer-text">Game Stats</h2>
                        <div className="text-xs text-gray-400">Changes every 5 seconds</div>
                    </div>

                    {rotatingGame && (
                        <div className="h-[calc(100%-40px)] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold gold-text">{rotatingGame.name}</h3>
                                {rotatingGame.completed ? (
                                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">
                                        Finished
                                    </span>
                                ) : rotatingGameIndex === activeGameIndex ? (
                                    <span className="px-2 py-1 gold-bg text-black text-xs rounded-full">Active</span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">Progress</div>
                                    <div className="text-3xl font-bold gold-text text-center mt-1">
                                        {rotatingGame.currentWins} / {rotatingGame.winCount}
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">Gametime</div>
                                    <div className="text-3xl font-mono gold-shimmer-text text-center mt-1">
                                        {formatTime(gameTimers?.[rotatingGameIndex]?.value || 0)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">% Completed</div>
                                    <div className="text-3xl font-bold gold-text text-center mt-1">
                                        {Math.round(
                                            (rotatingGame.currentWins / Math.max(1, rotatingGame.winCount)) * 100
                                        )}
                                        %
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow" />

                            <div className="mt-4 text-sm text-center text-gray-400">
                                {rotatingGameIndex === activeGameIndex
                                    ? 'This game is active'
                                    : rotatingGame.completed
                                        ? 'This game is completed'
                                        : 'Click on this game in the list to activate it'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoScrollView;