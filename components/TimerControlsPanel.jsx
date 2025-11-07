'use client';

export default function TimerControlsPanel({
    challenge,
    challengeTime,
    pauseTime,
    formatTime,
    onStart,
    onPause,
    onStop,
    className = '',
}) {
    const canStart = !challenge?.timer?.isRunning && !challenge?.completed;
    const canPause = !!challenge?.timer?.isRunning && !challenge?.completed;
    const canStop = !challenge?.completed && !!(challenge?.timer?.startTime || challenge?.timer?.isRunning);

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            {/* Timer */}
            <div className="text-5xl sm:text-7xl md:text-9xl font-mono font-bold gold-shimmer-text mb-3">
                {formatTime(challengeTime)}
            </div>

            {/* Pause-Time */}
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
                    onClick={onStart}
                    disabled={!canStart}
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${!canStart ? 'bg-gray-800 text-gray-600' : 'gold-bg text-black gold-pulse'
                        } transition duration-300`}
                >
                    Start
                </button>
                <button
                    onClick={onPause}
                    disabled={!canPause}
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${!canPause ? 'bg-gray-800 text-gray-600' : 'gold-bg text-black'
                        } transition duration-300`}
                >
                    Pause
                </button>
                <button
                    onClick={onStop}
                    disabled={!canStop}
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-md text-base sm:text-xl font-medium ${!canStop ? 'bg-gray-800 text-gray-600' : 'bg-red-700 text-white hover:bg-red-800'
                        } transition duration-300`}
                >
                    Give Up
                </button>
            </div>
        </div>
    );
}