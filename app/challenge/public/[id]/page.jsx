// app/challenge/public/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatTime, formatDate } from "@/utils/timeUtils";

const ChallengeSpectatorPage = () => {
  const params = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timers, setTimers] = useState({ main: 0, games: {} });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(-1);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Timer-Berechnungen
  useEffect(() => {
    let timerInterval = null;
    
    if (challenge && isRunning && !isPaused) {
      // Timer lokal hochzählen
      timerInterval = setInterval(() => {
        setTimers(prev => {
          const updated = {
            main: prev.main + 100,
            games: { ...prev.games }
          };
          
          if (activeGameIndex >= 0) {
            updated.games[activeGameIndex] = (prev.games[activeGameIndex] || 0) + 100;
          }
          
          return updated;
        });
      }, 100);
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [challenge, isRunning, isPaused, activeGameIndex]);
  
  // SSE-Verbindung aufbauen
  useEffect(() => {
    if (!params.id) return;
    
    // Initial laden
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/challenges/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Challenge");
        }
        
        const data = await response.json();
        setChallenge(data);
        
        // Timer-Werte initialisieren
        const initialTimers = {
          main: data.timer?.duration || 0,
          games: {}
        };
        
        data.games.forEach((game, index) => {
          initialTimers.games[index] = game.timer?.duration || 0;
        });
        
        setTimers(initialTimers);
        setIsRunning(data.timer?.isRunning || false);
        setIsPaused(data.paused || false);
        
        const activeIdx = data.games.findIndex(game => game.timer?.isRunning);
        setActiveGameIndex(activeIdx >= 0 ? activeIdx : -1);
        
        setError(null);
      } catch (err) {
        console.error("Fehler beim Laden der Challenge:", err);
        setError(err.message || "Fehler beim Laden der Challenge");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    // EventSource einrichten
    const eventSource = new EventSource(`/api/challenges/${params.id}/events`);
    
    eventSource.onopen = () => {
      console.log("SSE-Verbindung hergestellt!");
      setIsConnected(true);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("SSE-Nachricht empfangen:", data);
        
        setLastUpdate(data.timestamp);
        
        if (data.type === 'connected') {
          setIsConnected(true);
        } else if (data.type === 'update' && data.challenge) {
          setChallenge(data.challenge);
          
          // Status aktualisieren
          setIsRunning(data.challenge.timer?.isRunning || false);
          setIsPaused(data.challenge.paused || false);
          
          // Timer-Werte aktualisieren
          const updatedTimers = {
            main: data.challenge.timer?.duration || 0,
            games: {}
          };
          
          data.challenge.games.forEach((game, index) => {
            updatedTimers.games[index] = game.timer?.duration || 0;
          });
          
          setTimers(updatedTimers);
          
          // Aktives Spiel aktualisieren
          const activeIdx = data.challenge.games.findIndex(game => game.timer?.isRunning);
          setActiveGameIndex(activeIdx >= 0 ? activeIdx : -1);
        }
      } catch (err) {
        console.error("Fehler beim Verarbeiten der SSE-Nachricht:", err);
      }
    };
    
    eventSource.onerror = (err) => {
      console.error("SSE-Fehler:", err);
      setIsConnected(false);
      
      // Bei Verbindungsabbruch versuche, neu zu verbinden
      setTimeout(() => {
        eventSource.close();
        // Die Seite wird neu geladen, was automatisch neu verbindet
        window.location.reload();
      }, 5000);
    };
    
    return () => {
      eventSource.close();
    };
  }, [params.id]);
  
  if (loading) {
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <div className="text-white text-xl">Verbinde zur Challenge...</div>
      </section>
    );
  }
  
  if (error || !challenge) {
    return (
      <section className="w-full h-screen flex-col justify-center items-center">
        <div className="text-red-500 text-xl text-center mt-10">
          {error || "Challenge konnte nicht geladen werden."}
        </div>
        <Link href="/" className="text-blue-400 hover:underline mt-4 block text-center">
          Zurück zur Startseite
        </Link>
      </section>
    );
  }
  
  return (
    <section className="w-full min-h-screen p-6">
      <div className="max-w-4xl mx-auto mt-6">
        {/* Verbindungsstatus */}
        <div className={`px-3 py-1 mb-4 inline-flex items-center rounded text-sm ${
          isConnected ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'
        }`}>
          <span className={`w-2 h-2 mr-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          {isConnected ? "Live verbunden" : "Verbindung unterbrochen"}
        </div>
        
        {/* Spektator-Hinweis */}
        <div className="bg-blue-800/20 rounded-lg p-3 mb-6 border border-blue-700/30">
          <div className="text-blue-400 text-sm">
            Du betrachtest diese Challenge im Zuschauermodus. Letzte Aktualisierung: {lastUpdate ? formatDate(lastUpdate) : "Noch keine"}
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

        {/* Challenge-Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
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
          </div>
          
          {/* Timer */}
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
          
          {/* Pause-Info */}
          {isPaused && (
            <div className="bg-yellow-800/20 rounded-lg p-6 mt-6 border border-yellow-700/30">
              <h2 className="text-yellow-400 text-xl font-semibold mb-3">Challenge pausiert</h2>
              <div className="text-gray-300">
                <p>Die Challenge wurde am {formatDate(challenge.pausedAt)} pausiert.</p>
                <p className="mt-2">Pausendauer: {formatTime(challenge.pauseDuration || 0)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Games List */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">Spiele</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge.games.map((game, index) => (
              <div
                key={index}
                className={`bg-gray-700 p-4 rounded-lg border ${
                  activeGameIndex === index
                    ? 'border-blue-500'
                    : game.completed
                      ? 'border-green-500/30'
                      : 'border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">{game.name}</h3>
                  {activeGameIndex === index && isRunning && (
                    <div className="bg-blue-600/30 text-blue-400 px-2 py-0.5 text-xs rounded animate-pulse">
                      Aktiv
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-gray-300 mb-2">
                  <span className="text-sm">Timer:</span>
                  <span className="font-mono ml-2">
                    {formatTime(timers.games[index] || 0)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-300 mb-4">
                  <span className="text-sm">Fortschritt:</span>
                  <span className="font-mono ml-2">
                    {game.currentWins} / {game.winCount}
                  </span>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      game.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((game.currentWins / game.winCount) * 100))}%`
                    }}
                  />
                </div>
              </div>
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
                      width: `${Math.round((challenge.games.filter(game => game.completed).length / challenge.games.length) * 100)}%`
                    }}
                  />
                </div>
                <div className="text-gray-300 text-center">
                  {challenge.games.filter(game => game.completed).length} von {challenge.games.length} Spielen abgeschlossen
                  {challenge.forfeited && " (Challenge aufgegeben)"}
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-center">
                Keine Spiele in dieser Challenge.
              </div>
            )}
          </div>
        </div>

        {/* Challenge Completion Section */}
        {challenge.completed && (
          <div className="bg-green-800/20 rounded-lg p-6 mt-6 border border-green-700/30">
            <h2 className="text-green-400 text-xl font-semibold mb-3">Challenge abgeschlossen!</h2>
            <div className="text-gray-300">
              <p>Diese Challenge wurde am {formatDate(challenge.completedAt)} erfolgreich abgeschlossen.</p>
              <p className="mt-2">Gesamtzeit: {formatTime(challenge.timer?.duration || 0)}</p>
            </div>
          </div>
        )}

        {/* Challenge Forfeit Section */}
        {challenge.forfeited && (
          <div className="bg-red-800/20 rounded-lg p-6 mt-6 border border-red-700/30">
            <h2 className="text-red-400 text-xl font-semibold mb-3">Challenge aufgegeben!</h2>
            <div className="text-gray-300">
              <p>Diese Challenge wurde am {formatDate(challenge.forfeitedAt)} aufgegeben.</p>
              <p className="mt-2">Gesamtzeit: {formatTime(challenge.timer?.duration || 0)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeSpectatorPage;