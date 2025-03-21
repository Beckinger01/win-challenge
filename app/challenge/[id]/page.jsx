"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Hilfsfunktion zum Formatieren des Datums
const formatDate = (dateString) => {
  if (!dateString) return "–";
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Hilfsfunktion zum Formatieren der Zeit (HH:MM:SS)
const formatTime = (duration) => {
  if (!duration) return "00:00:00";

  // Umrechnung von Millisekunden in Stunden, Minuten und Sekunden
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format: HH:MM:SS mit führenden Nullen
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ChallengeDetailPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Fehler beim Laden der Challenge:", err);
        setError(err.message || "Fehler beim Laden der Challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [params.id, session]);

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
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <Link href="/profile" className="text-blue-400 hover:underline cursor-pointer">
            ← Zurück zum Profil
          </Link>
          <div className="bg-blue-600 px-3 py-1 rounded text-white">
            {challenge.completed ? "Abgeschlossen" : "Aktiv"}
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
            <div>
              <span className="text-gray-400">Typ:</span> {challenge.type}
            </div>
          </div>
        </div>

        {/* Challenge Timer */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-3">Challenge-Timer</h2>
          <div className="bg-gray-700 p-4 rounded-md">
            <div className="text-blue-400 font-mono text-2xl text-center">
              {formatTime(challenge.timer?.duration || 0)}
            </div>
            <div className="text-gray-400 text-center mt-2">
              {challenge.timer?.isRunning ? "Timer läuft" : "Timer gestoppt"}
            </div>
          </div>
        </div>

        {/* Games List */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">Spiele</h2>

          {challenge.games.length === 0 ? (
            <p className="text-gray-400">Keine Spiele in dieser Challenge.</p>
          ) : (
            <div className="space-y-4">
              {challenge.games.map((game, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${game.completed ? 'bg-green-900/30' : 'bg-gray-700'} transition-colors duration-300`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white text-lg font-medium">{game.name}</h3>
                    <div className={`px-2 py-1 rounded text-sm ${game.completed ? 'bg-green-600' : 'bg-blue-600'}`}>
                      {game.completed ? "Abgeschlossen" : "In Bearbeitung"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400 text-sm">Spiel-Timer</div>
                      <div className="text-blue-400 font-mono">
                        {formatTime(game.timer?.duration || 0)}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400 text-sm">Aktuelle Siege</div>
                      <div className="text-white font-semibold">
                        {game.currentWins} / {game.winCount}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded">
                      <div className="text-gray-400 text-sm">Fortschritt</div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (game.currentWins / game.winCount) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChallengeDetailPage;