import React from "react";

const GameCard = ({
    challenge,
    game,
    index,
    isSwitchingGame = false,
    activeGameIndex = -1,
    pendingGameIndex = -1,
    switchToGame,
    increaseWinCount,
    formatTime = (ms) => `${Math.floor((ms ?? 0) / 1000)}s`,
    gameTimers = [],
    isAuthorized = false,
}) => {
    // Guards
    const canClick =
        !isSwitchingGame &&
        !challenge?.paused &&
        !challenge?.completed &&
        challenge?.timer?.isRunning;

    const handleClick = () => {
        if (!isAuthorized) return;
        if (!canClick) return;
        if (typeof switchToGame === "function") switchToGame(index);
    };

    const canWin =
        !challenge?.paused &&
        !challenge?.completed &&
        challenge?.timer?.isRunning &&
        activeGameIndex === index;

    const disabledCard =
        game?.completed ||
        isSwitchingGame ||
        challenge?.paused ||
        challenge?.completed ||
        !challenge?.timer?.isRunning;

    const isActive = activeGameIndex === index && pendingGameIndex !== index;
    const isPending = pendingGameIndex === index;

    const timerValue = gameTimers?.[index]?.value ?? 0;
    const progressPct = (() => {
        const wins = Number(game?.currentWins ?? 0);
        const target = Number(game?.winCount ?? 1);
        if (target <= 0) return 0;
        return Math.max(0, Math.min(100, (wins / target) * 100));
    })();

    return (
        <div
            onClick={isAuthorized ? handleClick : undefined}
            className={`relative overflow-hidden rounded-lg transition-all duration-500
        ${disabledCard
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:transform hover:scale-[1.02]"
                }
        ${game?.completed
                    ? "bg-[#1a1a1a] border-2 border-green-600"
                    : activeGameIndex === index || pendingGameIndex === index
                        ? "bg-gold-active border-3 gold-gradient-border-active game-card-active"
                        : "bg-[#1a1a1a] border border-[#333333] hover:gold-border"
                }`}
        >
            {!game?.completed &&
                (activeGameIndex === index || pendingGameIndex === index) && (
                    <div className="absolute top-0 left-0 w-full h-1 gold-gradient-bg" />
                )}

            {challenge?.paused && (
                <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-800 text-yellow-300 text-xs rounded-bl">
                    Paused
                </div>
            )}

            {!challenge?.timer?.isRunning &&
                !challenge?.paused &&
                !challenge?.completed && (
                    <div className="absolute top-0 right-0 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-bl">
                        Timer not active
                    </div>
                )}

            <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-medium gold-text break-words pr-2">
                        {game?.name ?? "Game"}
                    </h3>

                    {game?.completed && (
                        <span className="px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-full whitespace-nowrap">
                            Finished
                        </span>
                    )}

                    {!game?.completed &&
                        !challenge?.paused &&
                        !challenge?.completed &&
                        challenge?.timer?.isRunning && (
                            <>
                                {isPending && (
                                    <span className="px-2 py-0.5 gold-gradient-bg text-black text-xs rounded-full flex items-center whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-1 animate-pulse" />
                                        Activating...
                                    </span>
                                )}
                                {isActive && !isPending && (
                                    <span className="active-badge">
                                        <span className="pulse-dot" />
                                        Active
                                    </span>
                                )}
                            </>
                        )}
                </div>

                <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div>
                        <div className="text-xs text-gray-400">Progress</div>
                        <div className="text-sm sm:text-base font-semibold gold-text">
                            {game?.currentWins ?? 0} / {game?.winCount ?? 0} Wins
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-400">Time</div>
                        <div className="text-sm sm:text-base font-mono gold-shimmer-text">
                            {formatTime(timerValue)}
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#2a2a2a] h-1.5 sm:h-2 rounded-full mb-3 sm:mb-4 overflow-hidden">
                    <div
                        className="h-full gold-progress-bar rounded-full"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

                {isAuthorized && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (canWin && typeof increaseWinCount === "function") {
                                increaseWinCount(index, e);
                            }
                        }}
                        disabled={!canWin}
                        className={`w-full py-1.5 sm:py-2 px-3 sm:px-4 rounded font-medium text-xs sm:text-sm
              ${!canWin
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "gold-bg text-black gold-pulse"
                            } transition duration-300`}
                    >
                        Win +1
                    </button>
                )}
            </div>
        </div>
    );
};

export default GameCard;