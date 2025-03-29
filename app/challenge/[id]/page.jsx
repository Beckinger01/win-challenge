'use client';

import { useState, useEffect, use } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatTime, getCurrentTimerValue } from '@/utils/timerUtils.client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const ChallengeControlPage = ({ params }) => {
  // Session für Auth-Prüfung
  const { data: session, status } = useSession();

  // Params unwrappen
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { socket, isConnected } = useSocket(id);

  // Zustandsvariablen
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeTime, setChallengeTime] = useState(0);
  const [gameTimers, setGameTimers] = useState([]);
  const [activeGameIndex, setActiveGameIndex] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSwitchingGame, setIsSwitchingGame] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [pauseTime, setPauseTime] = useState(0);
  const [isPauseRunning, setIsPauseRunning] = useState(false);
  const [pendingGameIndex, setPendingGameIndex] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    userId: null,
    creatorId: null,
    userEmail: null
  });

  useEffect(() => {
    const checkAuthAndFetchChallenge = async () => {
      try {

        const authResponse = await fetch(`/api/challenges/${id}/authorize`);
        const authData = await authResponse.json();

        setDebugInfo({
          userId: authData.userId || 'Nicht verfügbar',
          creatorId: authData.creatorId || 'Nicht verfügbar',
          userEmail: session?.user?.email || 'Nicht verfügbar',
          isAuthorized: authData.authorized
        });

        setIsAuthorized(authData.authorized);

        if (!authData.authorized) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/challenges/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await response.json();
        setChallenge(data);

        setGameTimers(data.games.map((game) => ({
          value: getCurrentTimerValue(game.timer),
          isRunning: game.timer.isRunning
        })));

        setChallengeTime(getCurrentTimerValue(data.timer));
        const activeIndex = data.games.findIndex(game => game.timer.isRunning);
        if (activeIndex !== -1) {
          setActiveGameIndex(activeIndex);
        }
        if (data.pauseTimer) {
          setPauseTime(data.pauseTimer.duration || 0);
          setIsPauseRunning(data.pauseTimer.isRunning || false);
        }

        setLoading(false);
        setLastSaveTime(Date.now());
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (session?.user) {
      checkAuthAndFetchChallenge();
    } else {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    if (!challenge) return;

    const timerInterval = setInterval(() => {
      const now = Date.now();
      if (challenge.timer.isRunning) {
        setChallengeTime((prev) => prev + 1000);
      }

      setGameTimers((prevTimers) =>
        prevTimers.map((timer, index) => {
          if (timer.isRunning) {
            return { ...timer, value: timer.value + 1000 };
          }
          return timer;
        })
      );

      if (isPauseRunning) {
        setPauseTime((prev) => prev + 1000);
      }

      if (now - lastSaveTime >= 600000) {
        saveCurrentState();
        setLastSaveTime(now);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [challenge, isPauseRunning, lastSaveTime]);

  useEffect(() => {
    if (!challenge) return;

    if (challenge.games.length > 0 &&
      challenge.games.every(game => game.completed) &&
      challenge.timer.isRunning &&
      !isSwitchingGame) {

      const challengeId = challenge._id;

      (async () => {
        console.log("Alle Spiele abgeschlossen - Timer wird automatisch gestoppt");
        setIsSwitchingGame(true);

        try {
          await fetch(`/api/challenges/${challengeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'stop-challenge-timer',
              challengeTime: challengeTime
            })
          });

          setTimeout(async () => {
            const response = await fetch(`/api/challenges/${challengeId}`);
            if (response.ok) {
              const refreshedData = await response.json();
              setChallenge(refreshedData);
              setChallengeTime(getCurrentTimerValue(refreshedData.timer));
              setIsSwitchingGame(false);
            }
          }, 500);

        } catch (error) {
          console.error("Fehler beim automatischen Stoppen:", error);
          setIsSwitchingGame(false);
        }
      })();
    }
  }, [challenge?.games, challenge?.timer.isRunning]);

  useEffect(() => {
    if (!socket) return;

    const handleChallengeUpdated = (data) => {
      setChallenge(data);

      setGameTimers(data.games.map((game) => ({
        value: getCurrentTimerValue(game.timer),
        isRunning: game.timer.isRunning
      })));

      setChallengeTime(getCurrentTimerValue(data.timer));

      const activeIndex = data.games.findIndex(game => game.timer.isRunning);
      if (activeIndex !== -1) {
        setActiveGameIndex(activeIndex);
      } else {
        setActiveGameIndex(null);
      }
      if (data.pauseTimer) {
        setPauseTime(data.pauseTimer.duration || 0);
        setIsPauseRunning(data.pauseTimer.isRunning || false);
      }
    };

    socket.on('challenge-updated', handleChallengeUpdated);

    return () => {
      socket.off('challenge-updated', handleChallengeUpdated);
    };
  }, [socket]);
  const saveCurrentState = async () => {
    if (!challenge) return;

    try {
      const updatedChallenge = { ...challenge };

      if (updatedChallenge.timer.isRunning) {
        updatedChallenge.timer.duration = challengeTime;
      }

      updatedChallenge.games = updatedChallenge.games.map((game, index) => {
        if (game.timer.isRunning) {
          return {
            ...game,
            timer: {
              ...game.timer,
              duration: gameTimers[index]?.value || 0
            }
          };
        }
        return game;
      });
      if (!updatedChallenge.pauseTimer) {
        updatedChallenge.pauseTimer = {};
      }
      updatedChallenge.pauseTimer.duration = pauseTime;
      updatedChallenge.pauseTimer.isRunning = isPauseRunning;

      const response = await fetch(`/api/challenges/${id}/save-state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challenge: updatedChallenge }),
      });

      if (!response.ok) {
        throw new Error('Failed to save challenge state');
      }

      console.log('Challenge state saved successfully');

      const savedChallenge = await response.json();
      setChallenge(savedChallenge);

      if (socket) {
        socket.emit('update-challenge', {
          challengeId: id,
          challengeData: savedChallenge
        });
      }

      setLastSaveTime(Date.now());
    } catch (err) {
      console.error('Error saving challenge state:', err);
    }
  };

  const updateChallenge = async (action, gameIndex = undefined) => {
    if (!isAuthorized) {
      setError('Du bist nicht berechtigt, diese Challenge zu steuern');
      return null;
    }

    try {
      await saveCurrentState();

      const response = await fetch(`/api/challenges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          gameIndex,
          challengeTime: challengeTime,
          gameTimers: gameTimers.map(timer => timer.value),
          pauseTime: pauseTime,
          isPauseRunning: isPauseRunning
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update challenge');
      }

      const updatedChallenge = await response.json();
      setChallenge(updatedChallenge);

      setGameTimers(updatedChallenge.games.map((game) => ({
        value: getCurrentTimerValue(game.timer),
        isRunning: game.timer.isRunning
      })));

      setChallengeTime(getCurrentTimerValue(updatedChallenge.timer));

      setLastSaveTime(Date.now());

      if (socket) {
        socket.emit('update-challenge', {
          challengeId: id,
          challengeData: updatedChallenge
        });
      }

      return updatedChallenge;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const startChallengeTimer = () => {
    setIsPauseRunning(false);
    updateChallenge('start-challenge-timer');
  };

  const pauseChallengeTimer = () => {
    setIsPauseRunning(true);
    updateChallenge('pause-challenge-timer');
  };

  const stopChallengeTimer = () => {
    setIsPauseRunning(false);
    updateChallenge('stop-challenge-timer');
  };

  const switchToGame = async (index) => {
    if (index === activeGameIndex) return;
    if (challenge.games[index]?.completed) return;
    if (isSwitchingGame) return;

    try {
      setIsSwitchingGame(true);
      setPendingGameIndex(index);

      if (!challenge.timer.isRunning) {
        await updateChallenge('start-challenge-timer');
      }

      if (activeGameIndex !== null) {
        await updateChallenge('stop-game-timer', activeGameIndex);
      }

      const result = await updateChallenge('start-game-timer', index);

      if (!result) {
        throw new Error("Fehler beim Starten des neuen Spiels");
      }
      setActiveGameIndex(index);
      setPendingGameIndex(null);

    } catch (error) {
      console.error("Fehler beim Spielwechsel:", error);
      setPendingGameIndex(null);
      try {
        const response = await fetch(`/api/challenges/${id}`);
        if (response.ok) {
          const refreshedData = await response.json();
          setChallenge(refreshedData);

          setGameTimers(refreshedData.games.map((game) => ({
            value: getCurrentTimerValue(game.timer),
            isRunning: game.timer.isRunning
          })));
          const refreshedActiveIndex = refreshedData.games.findIndex(game => game.timer.isRunning);
          setActiveGameIndex(refreshedActiveIndex !== -1 ? refreshedActiveIndex : null);
        }
      } catch (refreshError) {
        console.error("Fehler beim Neuladen:", refreshError);
      }
    } finally {
      setTimeout(() => {
        setIsSwitchingGame(false);
      }, 1000);
    }
  };

  const increaseWinCount = (index, e) => {
    e.stopPropagation();
    updateChallenge('increase-win-count', index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a6916e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/profile" className="px-4 py-2 bg-[#a6916e] text-black rounded hover:bg-[#8b7a5e]">
          Zurück zum Profil
        </Link>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="text-[#a6916e] mb-4">Du musst eingeloggt sein, um die Challenge zu steuern</div>
        <Link href={`/login?callbackUrl=/challenge/${id}`} className="px-4 py-2 bg-[#a6916e] text-black rounded hover:bg-[#8b7a5e]">
          Zum Login
        </Link>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="text-[#a6916e] mb-4">Du bist nicht berechtigt, diese Challenge zu steuern</div>
        <div className="text-[#a6916e] mb-4">Die Challenge kann nur vom Ersteller gesteuert werden</div>
        <Link href="/profile" className="px-4 py-2 bg-[#a6916e] text-black rounded hover:bg-[#8b7a5e]">
          Zurück zum Profil
        </Link>
      </div>
    );
  }

  if (!challenge) {
    return <div className="flex justify-center items-center h-screen bg-black text-[#a6916e]">Challenge nicht gefunden</div>;
  }

  const minutesSinceLastSave = Math.floor((Date.now() - lastSaveTime) / 60000);


  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#a6916e]">{challenge.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">{isConnected ? 'Verbunden' : 'Offline'}</span>
            </div>
            <button
              onClick={() => {
                const url = `${window.location.origin}/challenge/public/${id}`;
                navigator.clipboard.writeText(url);
                alert('Link zur Zuschauerseite wurde in die Zwischenablage kopiert!');
              }}
              className="px-3 py-1 bg-[#a6916e] text-black text-sm rounded hover:bg-[#8b7a5e] transition duration-300"
            >
              Link kopieren
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="text-8xl font-mono font-bold text-[#a6916e] mb-8">{formatTime(challengeTime)}</div>

          <div className="flex justify-center space-x-6 w-full max-w-xl mb-6">
            <button
              onClick={startChallengeTimer}
              disabled={challenge.timer.isRunning || challenge.completed}
              className={`flex-1 px-6 py-4 rounded-md text-xl font-medium ${challenge.timer.isRunning || challenge.completed ? 'bg-gray-800 text-gray-600' : 'bg-[#a6916e] text-black hover:bg-[#8b7a5e]'} transition duration-300`}
            >
              Start
            </button>
            <button
              onClick={pauseChallengeTimer}
              disabled={!challenge.timer.isRunning || challenge.completed}
              className={`flex-1 px-6 py-4 rounded-md text-xl font-medium ${!challenge.timer.isRunning || challenge.completed ? 'bg-gray-800 text-gray-600' : 'bg-[#a6916e] text-black hover:bg-[#8b7a5e]'} transition duration-300`}
            >
              Pause
            </button>
            <button
              onClick={stopChallengeTimer}
              disabled={challenge.completed || (!challenge.timer.startTime && !challenge.timer.isRunning)}
              className={`flex-1 px-6 py-4 rounded-md text-xl font-medium ${challenge.completed || (!challenge.timer.startTime && !challenge.timer.isRunning) ? 'bg-gray-800 text-gray-600' : 'bg-red-700 text-white hover:bg-red-800'} transition duration-300`}
            >
              Aufgeben
            </button>
          </div>

          <div className="flex items-center justify-center mb-8">
            <span className="font-medium text-lg mr-2 text-gray-400">Status:</span>
            {challenge.completed ? (
              <span className="text-green-500 text-lg font-bold">Abgeschlossen</span>
            ) : challenge.paused ? (
              <span className="text-yellow-500 text-lg font-bold">Pausiert</span>
            ) : challenge.timer.isRunning ? (
              <span className="text-blue-500 text-lg font-bold">Läuft</span>
            ) : (
              <span className="text-gray-500 text-lg font-bold">Nicht gestartet</span>
            )}
          </div>
          <div className="text-sm text-gray-400 mb-6">
            <span className="text-[#a6916e]">Letzter Speichervorgang: </span>
            <span>{minutesSinceLastSave === 0 ? 'Gerade eben' : `vor ${minutesSinceLastSave} Minuten`}</span>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <div className="bg-[#151515] rounded-lg border border-[#a6916e] py-3 px-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#a6916e]">Pause Zeit:</h2>
              <div className="text-2xl font-mono text-[#a6916e]">{formatTime(pauseTime)}</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#151515] rounded-lg border border-[#a6916e] p-6 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-[#a6916e] border-b border-[#333333] pb-2">Spiele</h2>
            <p className="text-sm text-gray-400 mb-6">Wähle ein Spiel, um seinen Timer zu starten. Das aktive Spiel wird mit einem farbigen Rahmen markiert.</p>
            {isSwitchingGame && (
              <div className="absolute inset-0 bg-[#151515] bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                  <div className="text-[#a6916e] text-2xl font-semibold mb-2">Spiel wird gewechselt</div>
                  <div className="flex justify-center">
                    <div className="w-2 h-2 bg-[#a6916e] rounded-full animate-pulse mx-1"></div>
                    <div className="w-2 h-2 bg-[#a6916e] rounded-full animate-pulse mx-1 animation-delay-200"></div>
                    <div className="w-2 h-2 bg-[#a6916e] rounded-full animate-pulse mx-1 animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {challenge.games.map((game, index) => (
                <div
                  key={index}
                  onClick={() => !isSwitchingGame && !challenge.paused && switchToGame(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-500 
                  ${(isSwitchingGame || challenge.paused) ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-[1.02]'}
                  ${game.completed
                      ? 'bg-[#1a1a1a] border-2 border-green-600'
                      : (activeGameIndex === index || pendingGameIndex === index)
                        ? 'bg-[#1f1a14] border-2 border-[#a6916e]'
                        : 'bg-[#1a1a1a] border border-[#333333] hover:border-[#a6916e]'
                    }`}
                >
                  {!game.completed && (activeGameIndex === index || pendingGameIndex === index) && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#a6916e]"></div>
                  )}

                  {challenge.paused && (
                    <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-800 text-yellow-300 text-xs rounded-bl">
                      Pausiert
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-[#a6916e]">{game.name}</h3>
                      {game.completed && (
                        <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Abgeschlossen</span>
                      )}
                      {!game.completed && !challenge.paused && (
                        <>
                          {pendingGameIndex === index && (
                            <span className="px-2 py-1 bg-[#8b7a5e] text-black text-xs rounded-full flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-1 animate-pulse"></span>
                              Wird aktiviert...
                            </span>
                          )}
                          {activeGameIndex === index && pendingGameIndex !== index && (
                            <span className="px-2 py-1 bg-[#a6916e] text-black text-xs rounded-full flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-1 animate-pulse"></span>
                              Aktiv
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-xs text-gray-400">Fortschritt</div>
                        <div className="text-base font-semibold text-[#a6916e]">
                          {game.currentWins} / {game.winCount} Siege
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Zeit</div>
                        <div className="text-base font-mono text-[#a6916e]">
                          {formatTime(gameTimers[index]?.value || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-[#2a2a2a] h-2 rounded-full mb-4 overflow-hidden">
                      <div
                        className="h-full bg-[#a6916e] rounded-full"
                        style={{ width: `${(game.currentWins / game.winCount) * 100}%` }}
                      ></div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!challenge.paused) {
                          increaseWinCount(index, e);
                        }
                      }}
                      disabled={game.completed || isSwitchingGame || challenge.paused}
                      className={`w-full py-2 px-4 rounded font-medium text-sm 
                      ${game.completed || isSwitchingGame || challenge.paused
                          ? 'bg-gray-800 text-gray-600'
                          : 'bg-[#a6916e] text-black hover:bg-[#8b7a5e]'
                        } transition duration-300`}
                    >
                      Sieg +1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeControlPage;