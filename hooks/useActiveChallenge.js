"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useActiveChallenge(initialChallenge, setChallenge) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [displayTimers, setDisplayTimers] = useState({
    main: 0,
    games: {}
  });

  // Refs für Timer und Challenge
  const timerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const challengeRef = useRef(initialChallenge);

  // Refs für Funktionen, um zirkuläre Abhängigkeiten zu vermeiden
  const startChallengeRef = useRef(null);
  const pauseChallengeRef = useRef(null);
  const resumeChallengeRef = useRef(null);
  const selectGameRef = useRef(null);
  const incrementWinRef = useRef(null);
  const resetGameRef = useRef(null);
  const forfeitChallengeRef = useRef(null);

  // Challenge-Ref aktualisieren
  useEffect(() => {
    challengeRef.current = initialChallenge;

    // Initialisiere Timer
    if (initialChallenge) {
      console.log("Challenge geladen:", initialChallenge._id);

      // Timer-Werte aus der Challenge übernehmen
      setDisplayTimers({
        main: initialChallenge.timer?.duration || 0,
        games: Object.fromEntries(
          initialChallenge.games.map((game, index) => [index, game.timer?.duration || 0])
        )
      });

      // Status aus der Challenge übernehmen
      setIsRunning(initialChallenge.timer?.isRunning || false);
      setIsPaused(initialChallenge.paused || false);

      const gameIndex = initialChallenge.games.findIndex(game => game.timer?.isRunning);
      setActiveGameIndex(gameIndex !== -1 ? gameIndex : -1);
    }
  }, [initialChallenge?._id]);

  // Timer-Interval starten
  const startTimerInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setDisplayTimers(prev => {
        const updated = { ...prev };
        updated.main = (updated.main || 0) + 1000;

        if (activeGameIndex !== -1) {
          updated.games = { ...prev.games };
          updated.games[activeGameIndex] = (updated.games[activeGameIndex] || 0) + 1000;
        }

        return updated;
      });
    }, 1000);

    console.log("Timer-Interval gestartet");
  }, [activeGameIndex]);

  // Haupttimer-Interval
  useEffect(() => {
    if (isRunning) {
      startTimerInterval();
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isRunning, startTimerInterval]);

  // Challenge starten
  const startChallenge = useCallback(async () => {
    if (!challengeRef.current) return;
    const challenge = challengeRef.current;

    // Prüfen, ob die Challenge aufgegeben oder abgeschlossen wurde
    if (challenge.forfeited || challenge.completed) {
      console.log("Challenge kann nicht gestartet werden:",
                  challenge.forfeited ? "Aufgegeben" : "Abgeschlossen");
      return;
    }

    try {
      console.log("Challenge starten:", challenge._id);

      // API aufrufen
      await fetch(`/api/challenges/${challenge._id}/timer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      // UI-Zustand aktualisieren
      setIsRunning(true);

      // Challenge aktualisieren
      setChallenge(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          timer: {
            ...prev.timer,
            isRunning: true
          }
        };
      });
    } catch (error) {
      console.error('Fehler beim Starten der Challenge:', error);
    }
  }, [setChallenge]);

  // Startchallenge-Ref aktualisieren
  useEffect(() => {
    startChallengeRef.current = startChallenge;
  }, [startChallenge]);

  // Challenge pausieren
  const pauseChallenge = useCallback(async () => {
    if (!challengeRef.current || !isRunning) return;
    const challenge = challengeRef.current;

    try {
      console.log("Challenge pausieren:", challenge._id);

      // Aktuelle Timer-Werte speichern
      const currentMain = displayTimers.main;
      const currentGameTime = activeGameIndex !== -1 ? displayTimers.games[activeGameIndex] || 0 : 0;

      // Timer-Interval stoppen
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // UI-Zustand aktualisieren
      setIsRunning(false);
      setIsPaused(true);
      setPauseStartTime(Date.now());

      // Startet den Pause-Timer
      if (pauseTimerRef.current) {
        clearInterval(pauseTimerRef.current);
      }

      pauseTimerRef.current = setInterval(() => {
        setPauseDuration(prev => prev + 1000);
      }, 1000);

      const prevActiveIndex = activeGameIndex;

      // Erst Spiel stoppen (falls aktiv)
      if (prevActiveIndex !== -1) {
        await fetch(`/api/challenges/${challenge._id}/timer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stop',
            gameIndex: prevActiveIndex,
            duration: currentGameTime
          }),
        });
      }

      // Dann Challenge stoppen
      await fetch(`/api/challenges/${challenge._id}/timer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          duration: currentMain
        }),
      });

      // Timer-Wert sichern
      await fetch(`/api/challenges/${challenge._id}/mainTimer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: currentMain
        }),
      });

      // Als pausiert markieren
      await fetch(`/api/challenges/${challenge._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paused',
          timestamp: new Date().toISOString()
        }),
      });

      // Challenge neu laden
      const refreshResponse = await fetch(`/api/challenges/${challenge._id}`);
      const refreshedData = await refreshResponse.json();

      // Timer-Werte manuell setzen
      const updatedChallenge = {
        ...refreshedData,
        timer: {
          ...refreshedData.timer,
          duration: currentMain
        },
        paused: true,
        pausedAt: new Date().toISOString()
      };

      setChallenge(updatedChallenge);

      // Display-Timer aktualisieren
      setDisplayTimers(prev => ({
        main: currentMain,
        games: { ...prev.games }
      }));
    } catch (error) {
      console.error('Fehler beim Pausieren der Challenge:', error);
    }
  }, [isRunning, activeGameIndex, displayTimers, setChallenge]);

  // PauseChallenge-Ref aktualisieren
  useEffect(() => {
    pauseChallengeRef.current = pauseChallenge;
  }, [pauseChallenge]);

  // Challenge fortsetzen
  const resumeChallenge = useCallback(async () => {
    if (!challengeRef.current || !isPaused) return;
    const challenge = challengeRef.current;

    try {
      console.log("Challenge fortsetzen:", challenge._id);

      // Pause-Timer stoppen
      if (pauseTimerRef.current) {
        clearInterval(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }

      // Pause-Daten zurücksetzen
      setPauseStartTime(null);
      const finalPauseDuration = pauseDuration;
      setPauseDuration(0);

      // API aufrufen
      await fetch(`/api/challenges/${challenge._id}/timer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      // Als fortgesetzt markieren
      await fetch(`/api/challenges/${challenge._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resumed',
          timestamp: new Date().toISOString(),
          pauseDuration: finalPauseDuration
        }),
      });

      // UI-Zustand aktualisieren
      setIsRunning(true);
      setIsPaused(false);

      // Timer explizit hier neu starten
      startTimerInterval();

      // Challenge aktualisieren
      setChallenge(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          timer: {
            ...prev.timer,
            isRunning: true
          },
          paused: false,
          pausedAt: null,
          totalPauseDuration: (prev.totalPauseDuration || 0) + finalPauseDuration
        };
      });

      // Wenn vorher ein Spiel aktiv war, dieses wieder aktivieren
      const prevActiveIndex = activeGameIndex;
      if (prevActiveIndex !== -1 && selectGameRef.current) {
        setTimeout(() => {
          selectGameRef.current(prevActiveIndex);
        }, 300);
      }
    } catch (error) {
      console.error('Fehler beim Fortsetzen der Challenge:', error);
    }
  }, [isPaused, pauseDuration, pauseStartTime, activeGameIndex, startTimerInterval, setChallenge]);

  // ResumeChallenge-Ref aktualisieren
  useEffect(() => {
    resumeChallengeRef.current = resumeChallenge;
  }, [resumeChallenge]);

  // Spiel auswählen
  const selectGame = useCallback(async (index) => {
    if (!challengeRef.current) return;
    const challenge = challengeRef.current;

    // Prüfe, ob das Spiel bereits abgeschlossen ist
    if (challenge.games[index].completed) return;

    try {
      console.log("Spiel auswählen:", index, "Timer läuft:", isRunning);

      // Wenn Timer nicht läuft und nicht pausiert ist, starten
      if (!isRunning && !isPaused && startChallengeRef.current) {
        await startChallengeRef.current();

        // Warte einen Moment
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Aktuelle Timer-Werte speichern
      const currentTimers = { ...displayTimers };

      // Stoppt das aktuelle Spiel, wenn ein anderes aktiv ist
      if (activeGameIndex !== -1 && activeGameIndex !== index) {
        console.log("Stoppe aktives Spiel:", activeGameIndex);

        await fetch(`/api/challenges/${challenge._id}/timer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stop',
            gameIndex: activeGameIndex,
            duration: currentTimers.games[activeGameIndex] || 0
          }),
        });

        // Haupttimer-Zeit beibehalten
        await fetch(`/api/challenges/${challenge._id}/mainTimer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: currentTimers.main
          }),
        });
      }

      // Neues Spiel starten
      console.log("Starte neues Spiel:", index);

      await fetch(`/api/challenges/${challenge._id}/timer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', gameIndex: index }),
      });

      // UI-Zustand aktualisieren
      setActiveGameIndex(index);

      // UI aktualisieren
      setChallenge(prev => {
        if (!prev) return prev;

        const updated = { ...prev };
        updated.games = [...prev.games];

        // Vorheriges Spiel deaktivieren
        if (activeGameIndex !== -1 && activeGameIndex !== index) {
          const prevGame = updated.games[activeGameIndex];
          if (prevGame) {
            if (!prevGame.timer) prevGame.timer = {};
            prevGame.timer.isRunning = false;
            prevGame.timer.duration = currentTimers.games[activeGameIndex] || 0;
          }
        }

        // Neues Spiel aktivieren
        const newGame = updated.games[index];
        if (newGame) {
          if (!newGame.timer) newGame.timer = {};
          newGame.timer.isRunning = true;
        }

        // Haupttimer-Zeit beibehalten
        if (!updated.timer) updated.timer = {};
        updated.timer.duration = currentTimers.main;

        return updated;
      });
    } catch (error) {
      console.error('Fehler beim Auswählen des Spiels:', error);
    }
  }, [isRunning, isPaused, activeGameIndex, displayTimers, setChallenge]);

  // SelectGame-Ref aktualisieren
  useEffect(() => {
    selectGameRef.current = selectGame;
  }, [selectGame]);

  // Siege erhöhen
  const incrementWin = useCallback(async (gameIndex) => {
    if (!challengeRef.current || !isRunning) return;
    const challenge = challengeRef.current;

    try {
      console.log("Sieg erhöhen für Spiel:", gameIndex);

      // Aktuelle Timer-Werte speichern
      const currentTimers = { ...displayTimers };

      // API aufrufen
      const response = await fetch(`/api/challenges/${challenge._id}/wins`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameIndex, action: 'increment' }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Siege');
      }

      // Haupttimer-Zeit beibehalten
      await fetch(`/api/challenges/${challenge._id}/mainTimer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: currentTimers.main
        }),
      });

      // ENTFERNT: Die lokale UI-Aktualisierung vor der Server-Antwort

      // Challenge neu laden
      const refreshResponse = await fetch(`/api/challenges/${challenge._id}`);
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();

        // Überprüfe, ob das Spiel jetzt komplett ist
        const game = refreshedData.games[gameIndex];

        // Aktualisiere Challenge, behalte aber Timer-Werte
        setChallenge({
          ...refreshedData,
          timer: {
            ...refreshedData.timer,
            duration: currentTimers.main
          }
        });

        if (game.completed && gameIndex === activeGameIndex) {
          // Finde das nächste nicht abgeschlossene Spiel
          const nextIndex = refreshedData.games.findIndex((g, idx) =>
            idx !== gameIndex && !g.completed
          );

          if (nextIndex !== -1 && selectGameRef.current) {
            await selectGameRef.current(nextIndex);
          } else {
            // Timer-Interval sofort stoppen
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            // UI-Zustand aktualisieren
            setIsRunning(false);
            setIsPaused(false);

            // Timer in der DB stoppen, aber ohne in den pausierten Zustand zu wechseln
            await fetch(`/api/challenges/${challenge._id}/timer`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'stop',
                duration: currentTimers.main
              }),
            });

            // Als abgeschlossen markieren
            await fetch(`/api/challenges/${challenge._id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'completed',
                timestamp: new Date().toISOString()
              }),
            });

            // Aktualisierte Daten laden
            const finalResponse = await fetch(`/api/challenges/${challenge._id}`);
            const finalData = await finalResponse.json();

            setChallenge({
              ...finalData,
              timer: {
                ...finalData.timer,
                isRunning: false,
                duration: currentTimers.main
              },
              paused: false,
              completed: true
            });
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Erhöhen der Siege:', error);
    }
  }, [isRunning, activeGameIndex, displayTimers, setChallenge]);

  // IncrementWin-Ref aktualisieren
  useEffect(() => {
    incrementWinRef.current = incrementWin;
  }, [incrementWin]);

  // Spiel zurücksetzen
  const resetGame = useCallback(async (gameIndex) => {
    if (!challengeRef.current || isRunning) return;
    const challenge = challengeRef.current;

    try {
      console.log("Spiel zurücksetzen:", gameIndex);

      const response = await fetch(`/api/challenges/${challenge._id}/wins`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameIndex, action: 'reset' }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Zurücksetzen des Spiels');
      }

      // Challenge neu laden
      const refreshResponse = await fetch(`/api/challenges/${challenge._id}`);
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();

        // Timer-Werte beibehalten
        const currentMain = displayTimers.main;

        setChallenge({
          ...refreshedData,
          timer: {
            ...refreshedData.timer,
            duration: currentMain
          }
        });

        // Timer für dieses Spiel zurücksetzen
        setDisplayTimers(prev => {
          const updated = { ...prev };
          updated.games = { ...prev.games };
          updated.games[gameIndex] = 0;
          return updated;
        });
      }
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Spiels:', error);
    }
  }, [isRunning, displayTimers, setChallenge]);

  // ResetGame-Ref aktualisieren
  useEffect(() => {
    resetGameRef.current = resetGame;
  }, [resetGame]);

  // Challenge aufgeben
  const forfeitChallenge = useCallback(async () => {
    if (!challengeRef.current || !isRunning) return;
    const challenge = challengeRef.current;

    try {
      console.log("Challenge aufgeben");

      // Aktuelle Timer-Werte speichern
      const currentTimers = { ...displayTimers };

      // Timer-Interval sofort stoppen
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Pause-Timer stoppen falls aktiv
      if (pauseTimerRef.current) {
        clearInterval(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }

      // UI-Zustand aktualisieren
      setIsRunning(false);
      setIsPaused(false);  // Wichtig: Sicherstellen, dass isPaused auch auf false gesetzt wird
      setPauseDuration(0); // Pausendauer zurücksetzen

      // Timer in der DB stoppen, ohne in den pausierten Zustand zu wechseln
      await fetch(`/api/challenges/${challenge._id}/timer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          duration: currentTimers.main
        }),
      });

      // Als aufgegeben markieren
      await fetch(`/api/challenges/${challenge._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'forfeited',
          timestamp: new Date().toISOString()
        }),
      });

      // Challenge neu laden
      const refreshResponse = await fetch(`/api/challenges/${challenge._id}`);
      const refreshedData = await refreshResponse.json();

      // Timer-Werte beibehalten
      setChallenge({
        ...refreshedData,
        timer: {
          ...refreshedData.timer,
          isRunning: false,
          duration: currentTimers.main
        },
        paused: false,   // Explizit auf nicht pausiert setzen
        forfeited: true  // Challenge explizit als aufgegeben markieren
      });

      // Zurück zum Dashboard navigieren
      //router.push('/dashboard');
    } catch (error) {
      console.error('Fehler beim Aufgeben der Challenge:', error);
    }
  }, [isRunning, displayTimers, router]);

  // ForfeitChallenge-Ref aktualisieren
  useEffect(() => {
    forfeitChallengeRef.current = forfeitChallenge;
  }, [forfeitChallenge]);

  // Cleanup-Funktion für alle Timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (pauseTimerRef.current) {
        clearInterval(pauseTimerRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    activeGameIndex,
    isPaused,
    pauseDuration,
    timers: displayTimers,
    startChallenge,
    pauseChallenge,
    resumeChallenge,
    selectGame,
    incrementWin,
    resetGame,
    forfeitChallenge
  };
}