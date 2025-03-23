"use client";

import { formatTime } from "@/utils/timeUtils";
import { TrophyIcon, RotateCcwIcon } from "lucide-react";

const ActiveGameCard = ({
  game,
  isActive,
  isRunning,
  isCompleted,
  onClick,
  onIncrementWin,
  onReset,
  disabled
}) => {
  // Sicherstellen, dass die Props korrekt sind
  const handleClick = () => {
    if (disabled || !onClick) return;

    // onClick ausführen (nicht onSelect)
    onClick();
  };

  const handleWinClick = (e) => {
    e.stopPropagation(); // Verhindert, dass das Klicken des Buttons auch die Karte auswählt
    if (disabled || isCompleted || !onIncrementWin) return;
    onIncrementWin();
  };

  const handleResetClick = (e) => {
    e.stopPropagation(); // Verhindert, dass das Klicken des Buttons auch die Karte auswählt
    if (isRunning || !onReset) return;
    onReset();
  };

  // Berechne den Fortschritt
  const progress = Math.min(100, Math.round((game.wins / game.winCount) * 100));
  const isGameCompleted = game.completed || (game.wins >= game.winCount);

  return (
    <div
      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
        disabled
          ? 'bg-gray-800 border-gray-700 opacity-60 cursor-not-allowed'
          : isActive
            ? 'bg-blue-900/30 border-blue-500'
            : isGameCompleted
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-gray-800 border-gray-700 hover:border-gray-500'
      }`}
      onClick={handleClick}
    >
      {/* Game Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">{game.name}</h3>
        {isGameCompleted && (
          <span className="inline-flex items-center bg-green-700/30 text-green-400 text-xs px-2 py-1 rounded">
            <TrophyIcon size={12} className="mr-1" /> Abgeschlossen
          </span>
        )}
        {isActive && isRunning && (
          <span className="inline-flex items-center bg-blue-700/30 text-blue-400 text-xs px-2 py-1 rounded animate-pulse">
            Aktiv
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${
            isGameCompleted ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-300 mb-4">
        <span>
          {game.wins} / {game.winCount} Siege
        </span>
        {game.timer && (
          <span className="text-gray-400">
            Zeit: {formatTime(game.timer.duration || 0)}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-2">
        <button
          onClick={handleWinClick}
          disabled={disabled || isGameCompleted}
          className={`flex-1 flex justify-center items-center gap-1 py-2 rounded ${
            disabled || isGameCompleted
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-600 text-white'
          }`}
        >
          <TrophyIcon size={16} />
          <span>Sieg</span>
        </button>

        <button
          onClick={handleResetClick}
          disabled={isRunning}
          className={`flex justify-center items-center p-2 rounded ${
            isRunning
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <RotateCcwIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActiveGameCard;