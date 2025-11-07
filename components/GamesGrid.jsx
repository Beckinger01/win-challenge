'use client';

import GameCard from '@components/GameCard';

export default function GamesGrid({
    challenge,
    isSwitchingGame = false,
    activeGameIndex = -1,
    pendingGameIndex = -1,
    switchToGame,
    increaseWinCount,
    formatTime,
    gameTimers = [],
    isAuthorized = false,
    className = '',
}) {
    if (!challenge?.games?.length) {
        return <div className="text-gray-400">No games</div>;
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {challenge.games.map((game, index) => (
                <GameCard
                    key={game.id ?? game._id ?? `${game.name ?? 'game'}-${index}`}
                    challenge={challenge}
                    game={game}
                    index={index}
                    isSwitchingGame={isSwitchingGame}
                    activeGameIndex={activeGameIndex}
                    pendingGameIndex={pendingGameIndex}
                    switchToGame={switchToGame}
                    increaseWinCount={(i, e) => {
                        e?.stopPropagation?.();
                        if (typeof increaseWinCount === 'function') increaseWinCount(i);
                    }}
                    formatTime={formatTime}
                    gameTimers={gameTimers}
                    isAuthorized={isAuthorized}
                />
            ))}
        </div>
    );
}