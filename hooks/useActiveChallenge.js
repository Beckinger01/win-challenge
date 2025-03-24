"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useActiveChallenge(initialChallenge, setChallenge) {
  const router = useRouter();
  
  // Status
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(-1);
  
  // Zustandsvariablen für Pausentimer
  const [totalPauseDuration, setTotalPauseDuration] = useState(0);
  const [currentPauseTimer, setCurrentPauseTimer] = useState(0);
  
  // Timer-Werte
  const [timers, setTimers] = useState({
    main: 0,
    games: {}
  });
  
  // Refs
  const challengeRef = useRef(initialChallenge);
  const timerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseStartTimeRef = useRef(null);
  
  // Debug-Helfer
  const logTimers = () => {
    console.log("Timer-Stand:", {
      main: timers.main,
      games: timers.games,
      activeGameIndex,
      isRunning,
      isPaused,
      totalPauseDuration,
      currentPauseTimer,
      displayedPauseDuration: totalPauseDuration + currentPauseTimer
    });
  };
  
  // Helfer-Funktion, um Timer im localStorage zu speichern
  const saveTimerState = () => {
    if (challengeRef.current?._id) {
      const state = {
        timers,
        isRunning,
        isPaused,
        activeGameIndex,
        totalPauseDuration,
        pauseStartTime: pauseStartTimeRef.current,
        currentPauseTimer,
        lastUpdated: Date.now()
      };
      localStorage.setItem(`timer_state_${challengeRef.current._id}`, JSON.stringify(state));
    }
  };
  
  const loadTimerState = () => {
    if (challengeRef.current?._id) {
      const savedState = localStorage.getItem(`timer_state_${challengeRef.current._id}`);
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          
          // Timer-Werte laden
          setTimers(state.timers);
          setIsRunning(state.isRunning);
          setIsPaused(state.isPaused);
          setActiveGameIndex(state.activeGameIndex);
          setTotalPauseDuration(state.totalPauseDuration || 0);
          
          console.log("Timer-Status geladen:", state);
          
          // Wenn pausiert, Pausetimer fortsetzen
          if (state.isPaused) {
            // Bisherige Pausendauer beibehalten
            setCurrentPauseTimer(state.currentPauseTimer || 0);
            
            // Neuen Pausenstart simulieren, basierend auf der bisherigen Pausendauer
            const adjustedStartTime = Date.now() - (state.currentPauseTimer || 0);
            pauseStartTimeRef.current = adjustedStartTime;
            
            // Pausetimer starten
            pauseTimerRef.current = setInterval(() => {
              const elapsed = Date.now() - pauseStartTimeRef.current;
              setCurrentPauseTimer(elapsed);
            }, 100);
            
            console.log("Pausetimer fortgesetzt mit:", {
              adjustedStartTime,
              currentPauseTimer: state.currentPauseTimer,
              totalPauseDuration: state.totalPauseDuration
            });
          }
          
          // Wenn der Timer läuft, Zeit seit dem letzten Speichern berücksichtigen
          if (state.isRunning && !state.isPaused) {
            const lastUpdated = state.lastUpdated;
            const now = Date.now();
            const elapsedSinceLastUpdate = lastUpdated ? now - lastUpdated : 0;
            
            console.log("Zeit seit letztem Update:", {
              lastUpdated,
              vergangeneZeit: elapsedSinceLastUpdate
            });
            
            // Timer-Werte anpassen
            const updatedTimers = {
              main: state.timers.main + elapsedSinceLastUpdate,
              games: { ...state.timers.games }
            };
            
            // Wenn ein Spiel aktiv war, dessen Timer auch anpassen
            if (state.activeGameIndex >= 0) {
              updatedTimers.games[state.activeGameIndex] = 
                (state.timers.games[state.activeGameIndex] || 0) + elapsedSinceLastUpdate;
            }
            
            // Aktualisiere Timer mit angepassten Werten
            setTimers(updatedTimers);
            
            // Starte Timer mit aktualisierten Werten
            const timerStartTs = Date.now();
            const initialTimerValues = {...updatedTimers};
            
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            
            timerRef.current = setInterval(() => {
              // Berechne, wie viel Zeit tatsächlich vergangen ist
              const currentTs = Date.now();
              const elapsedSinceStart = currentTs - timerStartTs;
              
              setTimers(prev => {
                // Berechne die absoluten Werte basierend auf der tatsächlich verstrichenen Zeit
                const updated = { 
                  main: initialTimerValues.main + elapsedSinceStart,
                  games: { ...initialTimerValues.games }
                };
                
                // Aktives Spiel aktualisieren
                if (state.activeGameIndex >= 0) {
                  const initialGameTime = initialTimerValues.games[state.activeGameIndex] || 0;
                  updated.games[state.activeGameIndex] = initialGameTime + elapsedSinceStart;
                }
                
                return updated;
              });
            }, 100);
            
            // Aktualisiere auch den Haupttimer in der DB
            updateMainTimer(updatedTimers.main);
          }
          
          return true;
        } catch (error) {
          console.error("Fehler beim Laden des Timer-Status:", error);
        }
      }
    }
    return false;
  };
  
  // Challenge aktualisieren wenn sie sich ändert
  useEffect(() => {
    challengeRef.current = initialChallenge;
    
    if (initialChallenge) {
      console.log("Challenge geladen:", initialChallenge._id);
      
      // Debug-Ausgabe zur Pausendauer
      console.log("Pausendauer in Challenge:", {
        pauseDuration: initialChallenge.pauseDuration
      });
      
      // Versuche, gespeicherten Timer-Status zu laden
      const loaded = loadTimerState();
      
      if (!loaded) {
        // Wenn kein gespeicherter Status, initialisiere mit Challenge-Daten
        // Timer-Status setzen
        const timerRunning = initialChallenge.timer?.isRunning || false;
        setIsRunning(timerRunning);
        setIsPaused(initialChallenge.paused || false);
        
        // Lade die gespeicherte Pausendauer aus der Datenbank
        if (initialChallenge.pauseDuration !== undefined) {
          console.log("Pausendauer aus DB geladen:", initialChallenge.pauseDuration);
          setTotalPauseDuration(initialChallenge.pauseDuration);
        } else {
          setTotalPauseDuration(0);
        }
        
        // Aktives Spiel finden
        const activeIdx = initialChallenge.games.findIndex(game => game.timer?.isRunning);
        setActiveGameIndex(activeIdx >= 0 ? activeIdx : -1);
        
        // Initiale Timer-Werte setzen und Zeit seit letztem Zugriff berechnen
        let initialTimers = {
          main: initialChallenge.timer?.duration || 0,
          games: {}
        };
        
        // Wenn Timer läuft aber Seite war geschlossen, Zeit berechnen die vergangen ist
        if (timerRunning && !initialChallenge.paused && initialChallenge.timer?.startTime) {
          const startTime = new Date(initialChallenge.timer.startTime);
          const now = new Date();
          const elapsedSinceStart = now - startTime;
          
          console.log("Zeit seit Timer-Start:", {
            startTime: startTime.toISOString(),
            jetzt: now.toISOString(),
            vergangeneZeit: elapsedSinceStart,
            gespeicherteDauer: initialChallenge.timer?.duration || 0
          });
          
          // Addiere vergangene Zeit zur gespeicherten Dauer
          initialTimers.main += elapsedSinceStart;
          
          // Aktualisiere DB mit neuem Wert
          updateMainTimer(initialTimers.main);
        }
        
        // Spiel-Timer setzen
        initialChallenge.games.forEach((game, index) => {
          initialTimers.games[index] = game.timer?.duration || 0;
          
          // Wenn Spiel-Timer läuft, berechne verstrichene Zeit
          if (game.timer?.isRunning && game.timer?.startTime && timerRunning && !initialChallenge.paused) {
            const startTime = new Date(game.timer.startTime);
            const now = new Date();
            const elapsedSinceStart = now - startTime;
            
            // Addiere verstrichene Zeit
            initialTimers.games[index] += elapsedSinceStart;
          }
        });
        
        setTimers(initialTimers);
        
        // Timer starten wenn nötig
        if (timerRunning && !initialChallenge.paused) {
          startTimeRef.current = Date.now();
          startTimer();
        }
        
        // Pausetimer starten, wenn im Pause-Modus
        if (initialChallenge.paused) {
          pauseStartTimeRef.current = Date.now();
          
          // Starte den Pausetimer
          pauseTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - pauseStartTimeRef.current;
            setCurrentPauseTimer(elapsed);
          }, 100);
        }
      }
      
      // Erste Debug-Ausgabe
      setTimeout(() => {
        logTimers();
      }, 500);
    }
  }, [initialChallenge?._id]);
  
  // Timer-Status speichern wenn sich etwas ändert
  useEffect(() => {
    saveTimerState();
  }, [timers, isRunning, isPaused, activeGameIndex, totalPauseDuration, currentPauseTimer]);
  
  // Timer starten (intern) - Angepasst für Tab-Wechsel
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Aktuellen Timestamp speichern
    const timerStartTs = Date.now();
    const initialTimerValues = {...timers};
    
    console.log("Timer gestartet mit aktivem Spiel:", activeGameIndex);
    
    timerRef.current = setInterval(() => {
      // Berechne, wie viel Zeit tatsächlich vergangen ist
      const currentTs = Date.now();
      const elapsedSinceStart = currentTs - timerStartTs;
      
      setTimers(prev => {
        // Berechne die absoluten Werte basierend auf der tatsächlich verstrichenen Zeit
        const updated = { 
          main: initialTimerValues.main + elapsedSinceStart,
          games: { ...initialTimerValues.games }
        };
        
        // Aktives Spiel aktualisieren
        if (activeGameIndex >= 0) {
          const initialGameTime = initialTimerValues.games[activeGameIndex] || 0;
          updated.games[activeGameIndex] = initialGameTime + elapsedSinceStart;
        }
        
        return updated;
      });
    }, 100);
  };
  
  // Haupttimer-API aufrufen (für Challenge)
  const updateMainTimer = async (duration) => {
    if (!challengeRef.current?._id) return;
    
    try {
      // Haupttimer separat aktualisieren
      await fetch(`/api/challenges/${challengeRef.current._id}/mainTimer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Haupttimers:", error);
    }
  };
  
  // Challenge starten
  const startChallenge = async () => {
    console.log("Challenge starten");
    
    // Lokale Timer starten
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    startTimer();
    
    // Backend informieren wenn möglich
    if (challengeRef.current?._id) {
      try {
        // Haupttimer starten via mainTimer API
        await updateMainTimer(timers.main);
        
        // Status aktualisieren
        await fetch(`/api/challenges/${challengeRef.current._id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: 'running',
            timestamp: new Date().toISOString()
          }),
        });
        
        // Challenge aktualisieren
        const response = await fetch(`/api/challenges/${challengeRef.current._id}`);
        if (response.ok) {
          const data = await response.json();
          setChallenge(data);
        }
      } catch (error) {
        console.error("API-Fehler:", error);
        // Frontend-Timer läuft trotzdem weiter
      }
    }
  };
  
  // Challenge pausieren
  const pauseChallenge = async () => {
    if (!isRunning) return;
    
    console.log("Challenge pausieren");
    
    // Timer stoppen
    setIsRunning(false);
    setIsPaused(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Pausenstart-Timestamp speichern
    const pauseStartTime = Date.now();
    pauseStartTimeRef.current = pauseStartTime;
    
    // Pausentimer zurücksetzen und neu starten
    setCurrentPauseTimer(0);
    
    // Vorherigen Pause-Timer stoppen, falls vorhanden
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
    }
    
    // Neuen Pausetimer starten
    pauseTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - pauseStartTime;
      setCurrentPauseTimer(elapsed);
    }, 100);
    
    // Diese Pause-Daten auch im localStorage speichern
    saveTimerState();
    
    // Backend informieren wenn möglich
    if (challengeRef.current?._id) {
      try {
        // Spieltimer stoppen
        if (activeGameIndex >= 0) {
          await fetch(`/api/challenges/${challengeRef.current._id}/timer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'stop',
              gameIndex: activeGameIndex
            }),
          });
        }
        
        // Haupttimer aktualisieren (über mainTimer API)
        await updateMainTimer(timers.main);
        
        // Status setzen
        await fetch(`/api/challenges/${challengeRef.current._id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: 'paused',
            timestamp: new Date().toISOString()
          }),
        });
        
        // Challenge aktualisieren
        const response = await fetch(`/api/challenges/${challengeRef.current._id}`);
        if (response.ok) {
          const data = await response.json();
          setChallenge(data);
        }
      } catch (error) {
        console.error("API-Fehler:", error);
      }
    }
  };
  
  // Challenge fortsetzen
  const resumeChallenge = async () => {
    if (!isPaused) return;
    
    console.log("Challenge fortsetzen");
    
    // Aktuelle Pausendauer berechnen und zur Gesamtpausenzeit addieren
    const pauseDuration = currentPauseTimer;
    const newTotalPauseDuration = totalPauseDuration + pauseDuration;
    setTotalPauseDuration(newTotalPauseDuration);
    
    console.log("Neue Gesamtpausendauer:", {
      vorher: totalPauseDuration,
      aktuellePause: pauseDuration,
      neu: newTotalPauseDuration
    });
    
    // Pausentimer stoppen
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    
    // Pausentimer zurücksetzen
    setCurrentPauseTimer(0);
    
    // Timer wieder starten
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    startTimer();
    
    // Backend informieren wenn möglich
    if (challengeRef.current?._id) {
      try {
        // Pausendauer in der Datenbank speichern
        try {
          await fetch(`/api/challenges/${challengeRef.current._id}/pauseDuration`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pauseDuration: newTotalPauseDuration }),
          });
        } catch (pauseError) {
          console.error("Fehler beim Speichern der Pausendauer:", pauseError);
        }
        
        // Haupttimer aktualisieren (über mainTimer API)
        await updateMainTimer(timers.main);
        
        // Status aktualisieren
        await fetch(`/api/challenges/${challengeRef.current._id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: 'resumed',
            timestamp: new Date().toISOString(),
            pauseDuration: newTotalPauseDuration
          }),
        });
        
        // Challenge aktualisieren
        const response = await fetch(`/api/challenges/${challengeRef.current._id}`);
        if (response.ok) {
          const data = await response.json();
          setChallenge(data);
          
          // Wenn vorher ein Spiel aktiv war, wieder aktivieren
          if (activeGameIndex >= 0) {
            selectGame(activeGameIndex);
          }
        }
      } catch (error) {
        console.error("API-Fehler:", error);
      }
    }
  };
  
  // Spiel auswählen
  const selectGame = async (index) => {
    console.log(`Spiel ${index} auswählen`);
    
    // Wenn Timer nicht läuft, starten
    if (!isRunning && !isPaused) {
      await startChallenge();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Wenn pausiert, Auswahl nicht ändern
    if (isPaused) {
      console.log("Challenge ist pausiert, Spiel kann nicht gewechselt werden");
      return;
    }
  
    // Timer-Intervall zuerst stoppen, bevor wir die Spielwechsel machen
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Vorheriges Spiel merken
    const previousGameIndex = activeGameIndex;
    
    // Neuen Spielindex setzen
    setActiveGameIndex(index);
    
    // Hier ist die wichtige Änderung: Wir aktualisieren den Timer-Intervall manuell
    // und starten ihn neu, BEVOR wir die API-Calls machen
    timerRef.current = setInterval(() => {
      setTimers(prev => {
        // Kopie erstellen
        const updated = { 
          main: prev.main + 100,
          games: { ...prev.games }
        };
        
        // WICHTIG: Nur das AKTUELLE Spiel (index) aktualisieren, nicht das vorherige!
        if (updated.games[index] === undefined) {
          updated.games[index] = 0;
        }
        
        // Nur das aktuelle Spiel inkrementieren
        updated.games[index] += 100;
        
        return updated;
      });
    }, 100);
    
    // API-Aufrufe machen
    if (challengeRef.current?._id) {
      try {
        // Altes Spiel stoppen (über timer API)
        if (previousGameIndex >= 0) {
          await fetch(`/api/challenges/${challengeRef.current._id}/timer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'stop',
              gameIndex: previousGameIndex
            }),
          });
        }
        
        // Neues Spiel starten (über timer API)
        await fetch(`/api/challenges/${challengeRef.current._id}/timer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'start', 
            gameIndex: index 
          }),
        });
        
        // Haupttimer aktualisieren (über mainTimer API)
        await updateMainTimer(timers.main);
        
        // Challenge aktualisieren
        const response = await fetch(`/api/challenges/${challengeRef.current._id}`);
        if (response.ok) {
          const data = await response.json();
          setChallenge(data);
        }
      } catch (error) {
        console.error("API-Fehler:", error);
      }
    }
    
    // Debug-Ausgabe nach dem Wechsel
    setTimeout(() => {
      logTimers();
    }, 500);
  };
  
  // Siege erhöhen
  const incrementWin = async (gameIndex) => {
    console.log(`Sieg für Spiel ${gameIndex} erhöhen`);
    
    if (!challengeRef.current?._id) return;
    
    try {
      // Haupttimer aktualisieren bevor API-Aufruf
      await updateMainTimer(timers.main);
      
      const response = await fetch(`/api/challenges/${challengeRef.current._id}/wins`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameIndex, action: 'increment' }),
      });
      
      if (!response.ok) {
        throw new Error("Fehler beim Erhöhen der Siege");
      }
      
      // Challenge aktualisieren
      const refreshResponse = await fetch(`/api/challenges/${challengeRef.current._id}`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setChallenge(data);
        
        // Prüfen ob Spiel abgeschlossen ist
        const game = data.games[gameIndex];
        
        if (game.completed && gameIndex === activeGameIndex) {
          // Nächstes nicht abgeschlossenes Spiel finden
          const nextIndex = data.games.findIndex((g, idx) => 
            idx !== gameIndex && !g.completed
          );
          
          if (nextIndex >= 0) {
            // Zum nächsten Spiel wechseln
            await selectGame(nextIndex);
          } else {
            // Alle Spiele abgeschlossen
            console.log("Alle Spiele abgeschlossen");
            
            // Timer stoppen
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            // Status aktualisieren
            setIsRunning(false);
            setIsPaused(false);
            
            // Spieltimer stoppen
            await fetch(`/api/challenges/${challengeRef.current._id}/timer`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                action: 'stop',
                gameIndex: activeGameIndex 
              }),
            });
            
            // Haupttimer aktualisieren
            await updateMainTimer(timers.main);
            
            // Status aktualisieren
            await fetch(`/api/challenges/${challengeRef.current._id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                status: 'completed',
                timestamp: new Date().toISOString()
              }),
            });
            
            // Challenge aktualisieren
            const finalResponse = await fetch(`/api/challenges/${challengeRef.current._id}`);
            if (finalResponse.ok) {
              const finalData = await finalResponse.json();
              setChallenge(finalData);
            }
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Erhöhen der Siege:", error);
    }
  };
  
  // Spiel zurücksetzen
  const resetGame = async (gameIndex) => {
    if (!challengeRef.current?._id || isRunning) return;
    
    console.log(`Spiel ${gameIndex} zurücksetzen`);
    
    try {
      // Haupttimer aktualisieren bevor API-Aufruf
      await updateMainTimer(timers.main);
      
      const response = await fetch(`/api/challenges/${challengeRef.current._id}/wins`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameIndex, action: 'reset' }),
      });
      
      if (!response.ok) {
        throw new Error("Fehler beim Zurücksetzen des Spiels");
      }
      
      // Challenge aktualisieren
      const refreshResponse = await fetch(`/api/challenges/${challengeRef.current._id}`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setChallenge(data);
      }
    } catch (error) {
      console.error("Fehler beim Zurücksetzen des Spiels:", error);
    }
  };
  
  // Challenge aufgeben
  const forfeitChallenge = async () => {
    if (!challengeRef.current?._id) return;
    
    console.log("Challenge aufgeben");
    
    // Timer stoppen
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    
    // Status aktualisieren
    setIsRunning(false);
    setIsPaused(false);
    
    try {
      // Spieltimer stoppen (falls aktiv)
      if (activeGameIndex >= 0) {
        await fetch(`/api/challenges/${challengeRef.current._id}/timer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'stop',
            gameIndex: activeGameIndex 
          }),
        });
      }
      
      // Haupttimer aktualisieren
      await updateMainTimer(timers.main);
      
      // Als aufgegeben markieren
      await fetch(`/api/challenges/${challengeRef.current._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'forfeited',
          timestamp: new Date().toISOString()
        }),
      });
      
      // Challenge aktualisieren
      const response = await fetch(`/api/challenges/${challengeRef.current._id}`);
      if (response.ok) {
        const data = await response.json();
        setChallenge(data);
      }
      
      // Gespeicherten Timer-Status löschen
      localStorage.removeItem(`timer_state_${challengeRef.current._id}`);
      
      // Zum Dashboard navigieren
      router.push('/dashboard');
    } catch (error) {
      console.error("Fehler beim Aufgeben der Challenge:", error);
    }
  };
  
  // Cleanup
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
  
  // Berechne die angezeigte Pausendauer (gesamt + aktuell)
  const displayedPauseDuration = totalPauseDuration + currentPauseTimer;
  
  return {
    isRunning,
    activeGameIndex,
    isPaused,
    pauseDuration: displayedPauseDuration, // ← Hier die berechnete Pausendauer zurückgeben
    totalPauseDuration,
    currentPauseTimer,
    timers,
    startChallenge,
    pauseChallenge,
    resumeChallenge,
    selectGame,
    incrementWin,
    resetGame,
    forfeitChallenge
  };
}