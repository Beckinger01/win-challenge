// app/challenge/public/[id]/page.jsx
'use client';

import { useState, useEffect, use } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatTime, getCurrentTimerValue } from '@/utils/timerUtils.client';

const ChallengePublicPage = ({ params }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { socket, isConnected } = useSocket(id);
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeTime, setChallengeTime] = useState(0);
  const [gameTimers, setGameTimers] = useState([]);
  const [activeGameIndex, setActiveGameIndex] = useState(null);
  
  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }
        
        const data = await response.json();
        setChallenge(data);
        
        // Initialize game timers
        setGameTimers(data.games.map((game) => ({
          value: getCurrentTimerValue(game.timer),
          isRunning: game.timer.isRunning
        })));
        
        // Set challenge timer
        setChallengeTime(getCurrentTimerValue(data.timer));
        
        // Set active game (first running game, or first non-completed game, or first game)
        const runningGameIndex = data.games.findIndex(game => game.timer.isRunning);
        const nonCompletedIndex = data.games.findIndex(game => !game.completed);
        
        if (runningGameIndex >= 0) {
          setActiveGameIndex(runningGameIndex);
        } else if (nonCompletedIndex >= 0) {
          setActiveGameIndex(nonCompletedIndex);
        } else if (data.games.length > 0) {
          setActiveGameIndex(0);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchChallenge();
  }, [id]);
  
  // Update timers periodically
  useEffect(() => {
    if (!challenge) return;
    
    const timerInterval = setInterval(() => {
      // Update challenge timer
      if (challenge.timer.isRunning) {
        setChallengeTime((prev) => prev + 1000);
      }
      
      // Update game timers
      setGameTimers((prevTimers) => 
        prevTimers.map((timer, index) => {
          if (timer.isRunning) {
            return { ...timer, value: timer.value + 1000 };
          }
          return timer;
        })
      );
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [challenge]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    const handleChallengeUpdated = (data) => {
      setChallenge(data);
      
      // Update game timers state
      setGameTimers(data.games.map((game) => ({
        value: getCurrentTimerValue(game.timer),
        isRunning: game.timer.isRunning
      })));
      
      // Update challenge timer
      setChallengeTime(getCurrentTimerValue(data.timer));
      
      // Set active game if necessary
      const runningGameIndex = data.games.findIndex(game => game.timer.isRunning);
      if (runningGameIndex >= 0 && runningGameIndex !== activeGameIndex) {
        setActiveGameIndex(runningGameIndex);
      }
    };
    
    socket.on('challenge-updated', handleChallengeUpdated);
    
    return () => {
      socket.off('challenge-updated', handleChallengeUpdated);
    };
  }, [socket, activeGameIndex]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Lädt Challenge...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Fehler: {error}</div>;
  }
  
  if (!challenge) {
    return <div className="flex justify-center items-center h-screen">Challenge nicht gefunden</div>;
  }
  
  // Calculate overall progress
  const totalWins = challenge.games.reduce((sum, game) => sum + game.currentWins, 0);
  const totalRequired = challenge.games.reduce((sum, game) => sum + game.winCount, 0);
  const progressPercentage = Math.round((totalWins / totalRequired) * 100);
  
  // Get active game
  const activeGame = challenge.games[activeGameIndex];
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">{challenge.name}</h1>
        <p className="text-center text-gray-600">{challenge.type} Challenge</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Timer section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Challenge Timer</h2>
          <div className="text-4xl font-mono text-center mb-4">{formatTime(challengeTime)}</div>
          
          <div className="flex items-center justify-center">
            <div className={`px-3 py-1 rounded-full ${
              challenge.completed 
                ? 'bg-green-100 text-green-800' 
                : challenge.paused 
                ? 'bg-yellow-100 text-yellow-800' 
                : challenge.timer.isRunning 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {challenge.completed 
                ? 'Abgeschlossen' 
                : challenge.paused 
                ? 'Pausiert' 
                : challenge.timer.isRunning 
                ? 'Läuft' 
                : 'Nicht gestartet'}
            </div>
          </div>
        </div>
        
        {/* Progress section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Gesamtfortschritt</h2>
          <div className="text-4xl font-bold text-center mb-4">{progressPercentage}%</div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="font-medium">{totalWins}</span> von <span className="font-medium">{totalRequired}</span> Siegen
          </div>
        </div>
        
        {/* Active game section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aktives Spiel</h2>
          
          {activeGame ? (
            <>
              <div className="text-2xl font-bold text-center mb-4">{activeGame.name}</div>
              
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-500">Fortschritt</div>
                  <div className="text-xl font-semibold">{activeGame.currentWins} / {activeGame.winCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Timer</div>
                  <div className="text-xl font-mono">{formatTime(gameTimers[activeGameIndex]?.value || 0)}</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ width: `${(activeGame.currentWins / activeGame.winCount) * 100}%` }}
                ></div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Kein aktives Spiel</div>
          )}
        </div>
      </div>
      
      {/* All games section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Alle Spiele</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenge.games.map((game, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                index === activeGameIndex 
                  ? 'border-blue-500 bg-blue-50' 
                  : game.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{game.name}</h3>
                {game.completed ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Abgeschlossen</span>
                ) : game.timer.isRunning ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Aktiv</span>
                ) : null}
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm text-gray-500">Fortschritt</div>
                  <div className="text-lg font-semibold">
                    {game.currentWins} / {game.winCount} Siege
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Zeit</div>
                  <div className="text-lg font-mono">
                    {formatTime(gameTimers[index]?.value || 0)}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(game.currentWins / game.winCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isConnected ? 'Live-Verbindung aktiv' : 'Keine Live-Verbindung'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengePublicPage;