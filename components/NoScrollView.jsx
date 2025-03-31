'use client';

import { useState, useEffect, useRef } from 'react';
import { formatTime } from '@/utils/timerUtils.client';

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
    pendingGameIndex
}) => {
    const [rotatingGameIndex, setRotatingGameIndex] = useState(0);
    const scrollRef = useRef(null);
    const activeGameRef = useRef(null);

    // Auto-rotate the right stats panel
    useEffect(() => {
        if (!challenge) return;

        const interval = setInterval(() => {
            setRotatingGameIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % challenge.games.length;
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [challenge]);

    // Auto-scroll the game list if needed
    useEffect(() => {
        if (scrollRef.current && activeGameIndex !== null) {
            const gameItems = scrollRef.current.querySelectorAll('.game-list-item');
            if (gameItems[activeGameIndex]) {
                gameItems[activeGameIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeGameIndex]);

    if (!challenge) return null;

    const activeGame = activeGameIndex !== null ? challenge.games[activeGameIndex] : null;
    const rotatingGame = challenge.games[rotatingGameIndex];

    return (
        <div className="max-h-screen text-white">
            {/* Timer section - stays the same */}
            <div className="flex flex-col items-center justify-center pt-6 pb-4">
                <div className="text-9xl font-mono font-bold gold-shimmer-text">{formatTime(challengeTime)}</div>
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold gold-text">Pausierte Zeit:</h2>
                        <div className="text-2xl font-mono gold-shimmer-text ml-4">{formatTime(pauseTime)}</div>
                    </div>
                </div>

                <div className="flex justify-center space-x-6 w-full max-w-xl mb-4">
                    <button
                        onClick={startChallengeTimer}
                        disabled={challenge.timer.isRunning || challenge.completed}
                        className={`flex-1 px-6 py-3 rounded-md text-xl font-medium ${challenge.timer.isRunning || challenge.completed ? 'bg-gray-800 text-gray-600' : 'gold-bg text-black gold-pulse'} transition duration-300`}
                    >
                        Start
                    </button>
                    <button
                        onClick={pauseChallengeTimer}
                        disabled={!challenge.timer.isRunning || challenge.completed}
                        className={`flex-1 px-6 py-3 rounded-md text-xl font-medium ${!challenge.timer.isRunning || challenge.completed ? 'bg-gray-800 text-gray-600' : 'gold-bg text-black'} transition duration-300`}
                    >
                        Pause
                    </button>
                    <button
                        onClick={stopChallengeTimer}
                        disabled={challenge.completed || (!challenge.timer.startTime && !challenge.timer.isRunning)}
                        className={`flex-1 px-6 py-3 rounded-md text-xl font-medium ${challenge.completed || (!challenge.timer.startTime && !challenge.timer.isRunning) ? 'bg-gray-800 text-gray-600' : 'bg-red-700 text-white hover:bg-red-800'} transition duration-300`}
                    >
                        Aufgeben
                    </button>
                </div>

                <div className="flex items-center justify-center mb-4">
                    <span className="font-medium text-lg mr-2 text-gray-400">Status:</span>
                    {challenge.forfeited ? (
                        <span className="text-red-500 text-lg font-bold">Aufgegeben</span>
                    ) : challenge.completed ? (
                        <span className="text-green-500 text-lg font-bold">Abgeschlossen</span>
                    ) : challenge.paused ? (
                        <span className="text-yellow-500 text-lg font-bold">Pausiert</span>
                    ) : challenge.timer.isRunning ? (
                        <span className="text-blue-500 text-lg font-bold">Läuft</span>
                    ) : (
                        <span className="text-gray-500 text-lg font-bold">Nicht gestartet</span>
                    )}
                </div>
            </div>

            {/* Three columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 h-[calc(100vh-400px)]">
                {/* Left column - Scrollable game list */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 overflow-hidden relative">
                    <h2 className="text-xl font-semibold mb-3 gold-shimmer-text border-b border-[#333333] pb-2">Spiele Liste</h2>

                    {/* Füge das Overlay hinzu, identisch zur mittleren Spalte */}
                    {isSwitchingGame && (
                        <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                                <div className="gold-shimmer-text text-2xl font-semibold mb-2">Spiel wird gewechselt</div>
                                <div className="flex justify-center">
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1"></div>
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-200"></div>
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-400"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} className="overflow-y-auto h-[calc(100%-40px)] pr-1 auto-scroll">
                        {challenge.games.map((game, index) => (
                            <div
                                key={index}
                                onClick={() => !isSwitchingGame && !challenge.paused && !challenge.completed && challenge.timer.isRunning && switchToGame(index)}
                                className={`game-list-item mb-3 p-3 rounded-lg transition-all duration-300 cursor-pointer
                  ${game.completed
                                        ? 'bg-[#1a1a1a] border-2 border-green-600'
                                        : (activeGameIndex === index || pendingGameIndex === index)
                                            ? 'bg-[#1f1a14] border-2 gold-gradient-border'
                                            : 'bg-[#1a1a1a] border border-[#333333] hover:gold-border'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium gold-text">{game.name}</h3>
                                    {game.completed && (
                                        <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">✓</span>
                                    )}
                                    {!game.completed && activeGameIndex === index && (
                                        <span className="px-2 py-1 gold-bg text-black text-xs rounded-full flex items-center">
                                            <span className="w-2 h-2 bg-black rounded-full mr-1 animate-pulse"></span>
                                            Aktiv
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div className="text-sm gold-text">{game.currentWins} / {game.winCount}</div>
                                    <div className="text-sm font-mono">{formatTime(gameTimers[index]?.value || 0)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle column - Active game with all stats */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-5 relative">
                    <h2 className="text-2xl font-semibold mb-4 gold-shimmer-text border-b border-[#333333] pb-2 text-center">Aktives Spiel</h2>

                    {isSwitchingGame && (
                        <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                                <div className="gold-shimmer-text text-2xl font-semibold mb-2">Spiel wird gewechselt</div>
                                <div className="flex justify-center">
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1"></div>
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-200"></div>
                                    <div className="w-2 h-2 gold-bg rounded-full animate-pulse mx-1 animation-delay-400"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGame ? (
                        <div ref={activeGameRef} className="flex flex-col h-[calc(100%-48px)]">
                            {/* Centered game name and timer */}
                            <div className="flex flex-col items-center justify-center mb-6">
                                <h3 className="text-3xl font-bold gold-shimmer-text mb-2">{activeGame.name}</h3>
                                <div className="text-3xl font-mono gold-shimmer-text mb-2">
                                    {formatTime(gameTimers[activeGameIndex]?.value || 0)}
                                </div>
                                <div className="flex items-center">
                                    {activeGame.completed ? (
                                        <span className="px-3 py-1 bg-green-900 text-green-300 text-base rounded-full">Abgeschlossen</span>
                                    ) : (
                                        <span className="px-3 py-1 gold-bg text-black text-base rounded-full flex items-center">
                                            <span className="w-3 h-3 bg-black rounded-full mr-2 animate-pulse"></span>
                                            Aktiv
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Progress bar - larger */}
                            <div className="w-full bg-[#2a2a2a] h-6 rounded-full mb-8 overflow-hidden">
                                <div
                                    className="h-full gold-progress-bar rounded-full transition-all duration-500"
                                    style={{ width: `${(activeGame.currentWins / activeGame.winCount) * 100}%` }}
                                ></div>
                            </div>

                            {/* Stats section with larger text */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <div className="text-base text-gray-400 mb-1">Fortschritt</div>
                                    <div className="text-3xl font-bold gold-text">
                                        {activeGame.currentWins} / {activeGame.winCount}
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                                    <div className="text-base text-gray-400 mb-1">Spiel-Prozent</div>
                                    <div className="text-3xl font-bold gold-text">
                                        {Math.round((activeGame.currentWins / activeGame.winCount) * 100)}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow"></div>

                            {/* Larger button */}
                            <button
                                onClick={(e) => {
                                    if (!challenge.paused && !challenge.completed && challenge.timer.isRunning) {
                                        increaseWinCount(activeGameIndex, e);
                                    }
                                }}
                                disabled={activeGame.completed || isSwitchingGame || challenge.paused || challenge.completed || !challenge.timer.isRunning}
                                className={`w-full py-2 px-2 rounded-lg font-medium text-xl
                  ${activeGame.completed || isSwitchingGame || challenge.paused || challenge.completed || !challenge.timer.isRunning
                                        ? 'bg-gray-800 text-gray-600'
                                        : 'gold-bg text-black gold-pulse'
                                    } transition duration-300`}
                            >
                                Sieg +1
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[calc(100%-48px)] text-gray-500 text-xl">
                            Kein aktives Spiel
                        </div>
                    )}
                </div>

                {/* Right column - Rotating stats */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-4">
                    <div className="flex justify-between items-center border-b border-[#333333] pb-2 mb-3">
                        <h2 className="text-xl font-semibold gold-shimmer-text">Spiel Stats</h2>
                        <div className="text-xs text-gray-400">Wechselt alle 5 Sek.</div>
                    </div>

                    {rotatingGame && (
                        <div className="h-[calc(100%-40px)] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold gold-text">{rotatingGame.name}</h3>
                                {rotatingGame.completed ? (
                                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Abgeschlossen</span>
                                ) : rotatingGameIndex === activeGameIndex ? (
                                    <span className="px-2 py-1 gold-bg text-black text-xs rounded-full">Aktiv</span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">Inaktiv</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">Fortschritt</div>
                                    <div className="text-3xl font-bold gold-text text-center mt-1">
                                        {rotatingGame.currentWins} / {rotatingGame.winCount}
                                    </div>
                                    <div className="w-full bg-[#2a2a2a] h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full gold-progress-bar rounded-full"
                                            style={{ width: `${(rotatingGame.currentWins / rotatingGame.winCount) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">Spielzeit</div>
                                    <div className="text-3xl font-mono gold-shimmer-text text-center mt-1">
                                        {formatTime(gameTimers[rotatingGameIndex]?.value || 0)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">% Komplett</div>
                                    <div className="text-3xl font-bold gold-text text-center mt-1">
                                        {Math.round((rotatingGame.currentWins / rotatingGame.winCount) * 100)}%
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                                    <div className="text-xs text-gray-400">Zeit pro Sieg</div>
                                    <div className="text-3xl font-mono gold-text text-center mt-1">
                                        {rotatingGame.currentWins > 0
                                            ? formatTime(Math.floor((gameTimers[rotatingGameIndex]?.value || 0) / rotatingGame.currentWins))
                                            : "00:00:00"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow"></div>

                            <div className="mt-4 text-sm text-center text-gray-400">
                                {rotatingGameIndex === activeGameIndex
                                    ? "Dieses Spiel ist aktiv"
                                    : rotatingGame.completed
                                        ? "Dieses Spiel ist abgeschlossen"
                                        : "Klicke auf dieses Spiel in der Liste, um es zu aktivieren"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoScrollView;