'use client';

import { useState, useEffect, use } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatTime, getCurrentTimerValue } from '@/utils/timerUtils.client';
import { User } from 'lucide-react';

const ChallengePublicPage = ({ params }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { socket, isConnected } = useSocket(id);

  const [challenge, setChallenge] = useState(null);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeTime, setChallengeTime] = useState(0);
  const [gameTimers, setGameTimers] = useState([]);
  const [activeGameIndex, setActiveGameIndex] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }

        const data = await response.json();
        setChallenge(data);

        setGameTimers(data.games.map((game) => ({
          value: getCurrentTimerValue(game.timer),
          isRunning: game.timer.isRunning
        })));

        setChallengeTime(getCurrentTimerValue(data.timer));

        const runningGameIndex = data.games.findIndex(game => game.timer.isRunning);
        const nonCompletedIndex = data.games.findIndex(game => !game.completed);

        if (runningGameIndex >= 0) {
          setActiveGameIndex(runningGameIndex);
        } else if (nonCompletedIndex >= 0) {
          setActiveGameIndex(nonCompletedIndex);
        } else if (data.games.length > 0) {
          setActiveGameIndex(0);
        }

        // Fetch creator information if creator ID exists
        if (data.creator) {
          try {
            const creatorResponse = await fetch(`/api/user/${data.creator}`);
            if (creatorResponse.ok) {
              const creatorData = await creatorResponse.json();
              setCreatorInfo(creatorData);
            }
          } catch (creatorError) {
            console.error("Error fetching creator:", creatorError);
            // Don't set the main error state, just log it
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  useEffect(() => {
    if (!challenge) return;

    const timerInterval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [challenge]);

  useEffect(() => {
    if (!socket) return;

    const handleChallengeUpdated = (data) => {
      setChallenge(data);

      setGameTimers(data.games.map((game) => ({
        value: getCurrentTimerValue(game.timer),
        isRunning: game.timer.isRunning
      })));

      setChallengeTime(getCurrentTimerValue(data.timer));

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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a6916e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="gold-gradient-border p-8 rounded-lg text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-2xl font-bold gold-text mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="gold-gradient-border p-8 rounded-lg text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-2xl font-bold gold-text mb-4">Not Found</h2>
          <p className="text-gray-300">Challenge not found</p>
        </div>
      </div>
    );
  }

  // Zähle abgeschlossene Spiele statt Siege
  const completedGames = challenge.games.filter(game => game.completed).length;
  const totalGames = challenge.games.length;
  const progressPercentage = Math.round((completedGames / totalGames) * 100);

  const activeGame = challenge.games[activeGameIndex];

  // Get creator display name
  const creatorName = creatorInfo ? (creatorInfo.username || creatorInfo.name || creatorInfo.email) : null;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold gold-shimmer-text mb-3">{challenge.name}</h1>
        {/* Creator info display */}
        {creatorName && (
          <div className="flex items-center justify-center mb-2">
            <User size={16} className="text-[#a6916e] mr-1" />
            <span className="text-[#a6916e]">Created by {creatorName}</span>
          </div>
        )}
        <p className="text-gray-300">{challenge.type} Challenge</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Challenge Timer */}
        <div className="gold-gradient-border rounded-lg p-6" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-xl font-semibold mb-4 gold-text">Challenge Timer</h2>
          <div className="text-5xl font-mono text-center mb-4 gold-shimmer-text">{formatTime(challengeTime)}</div>

          <div className="flex items-center justify-center">
            <div className={`px-3 py-1 rounded-full ${challenge.forfeited
              ? 'bg-red-900 text-red-300'
              : challenge.completed
                ? 'bg-green-900 text-green-300'
                : challenge.paused
                  ? 'bg-yellow-900 text-yellow-300'
                  : challenge.timer.isRunning
                    ? 'gold-gradient-bg text-black'
                    : 'bg-gray-800 text-gray-300'
              }`}>
              {challenge.forfeited
                ? 'Forfeited'
                : challenge.completed
                  ? 'Completed'
                  : challenge.paused
                    ? 'Paused'
                    : challenge.timer.isRunning
                      ? 'Running'
                      : 'Not Started'}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="gold-gradient-border rounded-lg p-6" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-xl font-semibold mb-4 gold-text">Overall Progress</h2>
          <div className="text-5xl font-bold text-center mb-4 gold-shimmer-text">{progressPercentage}%</div>

          <div className="w-full bg-[#2a2a2a] rounded-full h-4 mb-4 overflow-hidden">
            <div
              className={`${challenge.forfeited ? 'bg-red-600' : 'gold-gradient-bg'} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="text-center text-gray-300">
            <span className="font-medium gold-text">{completedGames}</span> of <span className="font-medium gold-text">{totalGames}</span> games completed
            {challenge.forfeited && <div className="text-red-400 mt-2">Challenge was forfeited</div>}
          </div>
        </div>

        {/* Active Game */}
        <div className="gold-gradient-border rounded-lg p-6" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-xl font-semibold mb-4 gold-text">Active Game</h2>

          {activeGame ? (
            <>
              <div className="text-2xl font-bold text-center mb-4 gold-shimmer-text">{activeGame.name}</div>

              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-xl font-semibold gold-text">{activeGame.currentWins} / {activeGame.winCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Timer</div>
                  <div className="text-xl font-mono gold-text">{formatTime(gameTimers[activeGameIndex]?.value || 0)}</div>
                </div>
              </div>

              <div className="w-full bg-[#2a2a2a] rounded-full h-4 overflow-hidden">
                <div
                  className="gold-gradient-bg h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(activeGame.currentWins / activeGame.winCount) * 100}%` }}
                ></div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              {challenge.forfeited
                ? "Challenge was forfeited"
                : challenge.completed
                  ? "All games completed"
                  : "No active game"}
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 gold-text">All Games</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenge.games.map((game, index) => (
            <div
              key={index}
              className={`p-5 rounded-lg ${index === activeGameIndex && !challenge.forfeited
                ? 'gold-gradient-border gold-pulse'
                : game.completed
                  ? 'border-2 border-green-600'
                  : 'border border-[#333333]'
                }`}
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium gold-text">{game.name}</h3>
                {game.completed ? (
                  <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Completed</span>
                ) : challenge.forfeited ? (
                  <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">Forfeited</span>
                ) : game.timer.isRunning ? (
                  <span className="px-2 py-1 gold-gradient-bg text-black text-xs rounded-full flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-1 animate-pulse"></span>
                    Active
                  </span>
                ) : null}
              </div>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-lg font-semibold gold-text">
                    {game.currentWins} / {game.winCount} wins
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Time</div>
                  <div className="text-lg font-mono gold-text">
                    {formatTime(gameTimers[index]?.value || 0)}
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className={`${challenge.forfeited ? 'bg-red-600' : 'gold-gradient-bg'} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(game.currentWins / game.winCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengePublicPage;