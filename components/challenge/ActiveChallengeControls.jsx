"use client";

import { useState } from 'react';
import { PlayCircle, PauseCircle, Flag, Trophy, AlertTriangle, PlayIcon } from 'lucide-react';
import { formatTime } from "@/utils/timeUtils";

export default function ActiveChallengeControls({
  isRunning,
  isPaused,
  pauseDuration,
  isCompleted,
  isForfeited,
  onStart,
  onPause,
  onResume,
  onForfeit
}) {
  const [showConfirmForfeit, setShowConfirmForfeit] = useState(false);

  const handleForfeit = () => {
    if (showConfirmForfeit) {
      onForfeit();
      setShowConfirmForfeit(false);
    } else {
      setShowConfirmForfeit(true);
    }
  };

  // Wenn die Challenge abgeschlossen ist
  if (isCompleted) {
    return (
      <div className="flex justify-center my-6">
        <div className="flex items-center px-4 py-2 bg-green-600/30 text-green-400 rounded-md">
          <Trophy className="mr-2" size={18} />
          <span>Challenge abgeschlossen</span>
        </div>
      </div>
    );
  }

  // Wenn die Challenge aufgegeben wurde
  if (isForfeited) {
    return (
      <div className="flex justify-center my-6">
        <div className="flex items-center px-4 py-2 bg-red-600/30 text-red-400 rounded-md">
          <Flag className="mr-2" size={18} />
          <span>Challenge aufgegeben</span>
        </div>
      </div>
    );
  }

  // Wenn die Challenge pausiert ist
  if (isPaused) {
    return (
      <div className="flex flex-col items-center my-6">
        <div className="flex items-center px-4 py-2 bg-yellow-600/30 text-yellow-400 rounded-md mb-4">
          <PauseCircle className="mr-2" size={18} />
          <span>Challenge pausiert - {formatTime(pauseDuration)}</span>
        </div>

        <button
          onClick={onResume}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlayIcon className="mr-2" size={20} />
          Challenge fortsetzen
        </button>
      </div>
    );
  }

  // Normaler Challenge-Zustand (läuft oder bereit)
  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlayCircle className="mr-2" size={20} />
          Challenge starten
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium flex items-center hover:bg-yellow-700 transition-colors"
          >
            <PauseCircle className="mr-2" size={20} />
            Challenge pausieren
          </button>

          {showConfirmForfeit ? (
            <div className="flex items-center">
              <button
                onClick={handleForfeit}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium flex items-center hover:bg-red-700 transition-colors"
              >
                <AlertTriangle className="mr-2" size={20} />
                Wirklich aufgeben?
              </button>
              <button
                onClick={() => setShowConfirmForfeit(false)}
                className="ml-2 px-4 py-3 bg-gray-700 text-white rounded-lg"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={handleForfeit}
              className="px-6 py-3 bg-red-800 text-white rounded-lg font-medium flex items-center hover:bg-red-700 transition-colors"
            >
              <Flag className="mr-2" size={20} />
              Aufgeben
            </button>
          )}
        </>
      )}
    </div>
  );
}