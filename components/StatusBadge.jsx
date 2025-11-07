'use client';

export default function StatusBadge({ challenge, isPauseRunning = false, className = '' }) {
    if (!challenge) return null;

    const getConfig = () => {
        if (challenge.forfeited) return { text: 'Forfeited', classes: 'bg-red-900 text-red-300' };
        if (challenge.completed) return { text: 'Completed', classes: 'bg-green-900 text-green-300' };
        if (isPauseRunning) return { text: 'Paused', classes: 'bg-yellow-900 text-yellow-300' };
        if (challenge.timer?.isRunning) return { text: 'Running', classes: 'gold-gradient-bg text-black' };
        return { text: 'Not Started', classes: 'bg-gray-800 text-gray-300' };
    };

    const { text, classes } = getConfig();

    return (
        <span className={`px-3 py-1 rounded-full ${classes} ${className}`}>
            {text}
        </span>
    );
}