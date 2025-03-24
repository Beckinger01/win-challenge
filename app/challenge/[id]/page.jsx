"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatTime, formatDate } from "@/utils/timeUtils";
import { useActiveChallenge } from "@/hooks/useActiveChallenge";
import ActiveChallengeControls from "@/components/challenge/ActiveChallengeControls";
import ActiveGameCard from "@/components/challenge/ActiveGameCard";
import { Share2 } from 'lucide-react';

const ChallengeDetailPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Active challenge controls
  const {
    isRunning,
    activeGameIndex,
    isPaused,
    pauseDuration,
    timers,
    startChallenge,
    pauseChallenge,  // Umbenannt von stopChallenge
    resumeChallenge, // Neu
    selectGame,
    incrementWin,
    resetGame,
    forfeitChallenge
  } = useActiveChallenge(challenge, setChallenge);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/challenges/${params.id}`);

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Challenge");
        }

        const data = await response.json();
        setChallenge(data);

        // Generate share URL (for future use)
        setShareUrl(`${window.location.origin}/challenge/public/${params.id}`);
      } catch (err) {
        console.error("Fehler beim Laden der Challenge:", err);
        setError(err.message || "Fehler beim Laden der Challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [params.id, session]);

  // Handle share button click
  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }).catch(err => {
      console.error("Fehler beim Kopieren der URL:", err);
    });
  };

  if (!session) {
    return (
      <section className="w-full h-screen flex-col justify-center items-center">
        <h1 className="text-white text-2xl text-center mt-10">
          Bitte melde dich an, um die Challenge-Details zu sehen.
        </h1>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <div className="text-white text-xl">Challenge wird geladen...</div>
      </section>
    );
  }

  if (error || !challenge) {
    return (
      <section className="w-full h-screen flex-col justify-center items-center">
        <div className="text-red-500 text-xl text-center mt-10">
          {error || "Challenge konnte nicht geladen werden."}
        </div>
        <Link href="/profile" className="text-blue-400 hover:underline mt-4 block text-center">
          Zurück zum Profil
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen p-6">
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded text-sm ${
              challenge.completed
                ? 'bg-green-600/30 text-green-400'
                : challenge.forfeited
                  ? 'bg-red-600/30 text-red-400'
                  : isRunning
                    ? 'bg-blue-600/30 text-blue-400 animate-pulse'
                    : 'bg-gray-600/30 text-gray-300'
            }`}>
              {challenge.completed
                ? "Abgeschlossen"
                : challenge.forfeited
                  ? "Aufgegeben"
                  : isRunning
                    ? "Live"
                    : "Bereit"}
            </div>

            <div className="relative">
              <button
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={handleShare}
                title="Link teilen"
              >
                <Share2 size={16} className="text-gray-300" />
              </button>

              {showShareTooltip && (
                <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                  Link kopiert!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h1 className="text-white text-3xl font-bold mb-2">{challenge.name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <div>
              <span className="text-gray-400">Erstellt am:</span> {formatDate(challenge.createdAt)}
            </div>
            {challenge.completed && (
              <div>
                <span className="text-gray-400">Abgeschlossen am:</span> {formatDate(challenge.completedAt)}
              </div>
            )}
            {challenge.forfeited && (
              <div>
                <span className="text-gray-400">Aufgegeben am:</span> {formatDate(challenge.forfeitedAt)}
              </div>
            )}
            <div>
              <span className="text-gray-400">Typ:</span> {challenge.type}
            </div>
          </div>
        </div>

        {/* Challenge Controls */}
        <ActiveChallengeControls
          isRunning={isRunning}
          isPaused={isPaused}
          pauseDuration={pauseDuration}
          isCompleted={challenge.completed}
          isForfeited={challenge.forfeited}
          onStart={startChallenge}
          onPause={pauseChallenge}   // Umbenannt von onStop
          onResume={resumeChallenge} // Neu
          onForfeit={forfeitChallenge}
        />

        {/* Challenge Timer */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-3">Challenge-Timer</h2>
          <div className="bg-gray-700 p-4 rounded-md">
          <div className={`font-mono text-2xl text-center ${
            isRunning
            ? 'text-blue-400'
            : isPaused
            ? 'text-yellow-400'
            : challenge.forfeited
            ? 'text-red-400'
            : 'text-white'
          }`}>
            {formatTime(timers.main)}
          </div>
          <div className="text-gray-400 text-center mt-2">
            {isRunning
            ? "Timer läuft"
            : isPaused
            ? "Challenge pausiert"
            : challenge.forfeited
            ? "Challenge aufgegeben"
            : "Timer gestoppt"}
          </div>
          </div>
          {isPaused && (
  <div className="bg-yellow-800/20 rounded-lg p-6 mt-6 border border-yellow-700/30">
    <h2 className="text-yellow-400 text-xl font-semibold mb-3">Challenge pausiert</h2>
    <div className="text-gray-300">
      <p>Die Challenge wurde am {formatDate(challenge.pausedAt)} pausiert.</p>
      <p className="mt-2">Pausendauer: {formatTime(pauseDuration)}</p>
      <button
        onClick={resumeChallenge}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Challenge fortsetzen
      </button>
    </div>
  </div>
)}
        </div>

        {/* Games List */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">Spiele</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge.games.map((game, index) => (
              <ActiveGameCard
                key={game.id || index}
                game={{
                  ...game,
                  // Timer-Werte aus den timers überschreiben
                  timer: {
                    ...game.timer,
                    duration: timers.games[index] || 0
                  }
                }}
                isActive={activeGameIndex === index}
                isRunning={isRunning}
                isCompleted={challenge.completed || challenge.forfeited} // Auch bei forfeited als abgeschlossen behandeln
                onClick={() => selectGame(index)}
                onIncrementWin={() => incrementWin(index)}
                onReset={() => resetGame(index)}
                disabled={!isRunning || challenge.completed || challenge.forfeited || (game.completed && isRunning)} // Bei forfeited deaktivieren
              />
            ))}
          </div>
          {challenge.games.length === 0 && (
            <div className="text-gray-400 text-center p-4">
              Keine Spiele in dieser Challenge.
            </div>
          )}
        </div>

        {/* Challenge Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-3">Challenge-Fortschritt</h2>
          <div className="bg-gray-700 p-4 rounded-md">
            {challenge.games.length > 0 ? (
              <>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full ${challenge.forfeited ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{
                      width: `${Math.round((challenge.games.filter(game => game.wins >= game.winCount).length / challenge.games.length) * 100)}%`
                    }}
                  />
                </div>
                <div className="text-gray-300 text-center">
                  {challenge.games.filter(game => game.wins >= game.winCount).length} von {challenge.games.length} Spielen abgeschlossen
                  {challenge.forfeited && " (Challenge aufgegeben)"}
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-center">
                Füge Spiele hinzu, um deinen Fortschritt zu verfolgen.
              </div>
            )}
          </div>
        </div>

        {/* Challenge Completion Section */}
        {challenge.completed && (
          <div className="bg-green-800/20 rounded-lg p-6 mt-6 border border-green-700/30">
            <h2 className="text-green-400 text-xl font-semibold mb-3">Challenge abgeschlossen!</h2>
            <div className="text-gray-300">
              <p>Du hast diese Challenge am {formatDate(challenge.completedAt)} erfolgreich abgeschlossen.</p>
              <p className="mt-2">Gesamtzeit: {formatTime(timers.main)}</p>
            </div>
          </div>
        )}

        {/* Challenge Forfeit Section */}
        {challenge.forfeited && (
          <div className="bg-red-800/20 rounded-lg p-6 mt-6 border border-red-700/30">
            <h2 className="text-red-400 text-xl font-semibold mb-3">Challenge aufgegeben!</h2>
            <div className="text-gray-300">
              <p>Du hast diese Challenge am {formatDate(challenge.forfeitedAt)} aufgegeben.</p>
              <p className="mt-2">Gesamtzeit: {formatTime(timers.main)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeDetailPage;