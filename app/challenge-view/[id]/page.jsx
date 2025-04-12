"use client";

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Clock, Calendar, CheckCircle, AlertTriangle, Trophy, XCircle } from 'lucide-react';

const formatTime = (duration) => {
  if (!duration && duration !== 0) return "00:00:00";

  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const ViewChallenge = ({ params }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: session } = useSession();
  const [challenge, setChallenge] = useState(null);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }

        const data = await response.json();
        setChallenge(data);

        // Fetch creator info if there's a creator ID
        if (data.creator) {
          try {
            const creatorResponse = await fetch(`/api/user/${data.creator}`);
            if (creatorResponse.ok) {
              const creatorData = await creatorResponse.json();
              setCreatorInfo(creatorData);
            }
          } catch (creatorError) {
            console.error("Error fetching creator:", creatorError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 gold-border"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/profile" className="px-4 py-2 gold-bg text-black rounded">
          Back to Profile
        </Link>
      </div>
    );
  }

  if (!challenge) {
    return <div className="flex justify-center items-center h-screen gold-shimmer-text">Challenge not found</div>;
  }

  // Calculate overall progress
  const totalGames = challenge.games?.length || 0;
  const completedGames = challenge.games?.filter(game => game.completed).length || 0;
  const overallProgress = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  // Ensure pauseTimer exists with fallback for older data
  const pauseDuration = challenge.pauseTimer?.duration || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Top navigation and title bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gold-shimmer-text">{challenge.name}</h1>
          <Link href="/profile" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition duration-300">
            Back to Profile
          </Link>
        </div>

        {/* Challenge Status Banner - More prominent status indicator */}
        <div className={`w-full mb-6 py-4 px-6 rounded-lg flex items-center justify-center ${challenge.forfeited
            ? 'bg-red-900 bg-opacity-20 border border-red-800'
            : challenge.completed
              ? 'bg-green-900 bg-opacity-20 border border-green-800'
              : 'bg-blue-900 bg-opacity-20 border border-blue-800'
          }`}>
          {challenge.forfeited ? (
            <>
              <XCircle size={24} className="text-red-400 mr-3" />
              <span className="text-red-300 text-xl font-bold">Challenge Forfeited</span>
            </>
          ) : challenge.completed ? (
            <>
              <Trophy size={24} className="text-green-400 mr-3" />
              <span className="text-green-300 text-xl font-bold">Challenge Completed</span>
            </>
          ) : (
            <>
              <Clock size={24} className="text-blue-400 mr-3" />
              <span className="text-blue-300 text-xl font-bold">Challenge in Progress</span>
            </>
          )}
        </div>

        {/* Main challenge stats and info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Challenge status card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold gold-text mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-[#a6916e]" />
              Challenge Time
            </h2>

            <div className="text-center mb-6">
              <div className="text-7xl font-mono font-bold gold-shimmer-text mb-3">
                {formatTime(challenge.timer?.duration)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Paused Time:</span>
                <span className="gold-text font-mono">{formatTime(pauseDuration)}</span>
              </div>

              {challenge.createdAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Created:</span>
                  <span className="gold-text">{formatDate(challenge.createdAt)}</span>
                </div>
              )}

              {challenge.timer && challenge.timer.startTime && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Started:</span>
                  <span className="gold-text">{formatDate(challenge.timer.startTime)}</span>
                </div>
              )}

              {challenge.completedAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Finished:</span>
                  <span className="gold-text">{formatDate(challenge.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold gold-text mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-[#a6916e]" />
              Progress
            </h2>

            <div className="text-center mb-6">
              <div className="text-7xl font-bold gold-shimmer-text mb-3">
                {overallProgress.toFixed(0)}%
              </div>
              <div className="text-gray-300 mb-2">
                <span className="gold-text font-medium">{completedGames}</span> of <span className="gold-text font-medium">{totalGames}</span> games completed
              </div>
            </div>

            <div className="w-full bg-[#2a2a2a] h-4 rounded-full overflow-hidden mb-6">
              <div
                className={`h-full ${challenge.forfeited ? 'bg-red-600' : 'gold-gradient-bg'} rounded-full transition-all duration-500`}
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Creator info card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-6 shadow-lg">
            <h2 className="text-xl font-semibold gold-text mb-4 flex items-center">
              <User size={20} className="mr-2 text-[#a6916e]" />
              Challenge Info
            </h2>

            <div className="space-y-4">
              {creatorInfo && (
                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Creator:</div>
                  <div className="gold-text text-lg font-medium flex items-center">
                    <User size={18} className="mr-2 gold-text" />
                    {creatorInfo.username || creatorInfo.name || creatorInfo.email}
                  </div>
                </div>
              )}

              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Challenge Type:</div>
                <div className="gold-text text-lg font-medium">{challenge.type || "Standard"}</div>
              </div>

              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Status:</div>
                <div className={`text-lg font-medium ${challenge.forfeited ? 'text-red-400' :
                    challenge.completed ? 'text-green-400' : 'text-blue-400'
                  }`}>
                  {challenge.forfeited
                    ? 'Forfeited'
                    : challenge.completed
                      ? 'Completed'
                      : 'In Progress'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Games section */}
        <div className="bg-[#151515] rounded-lg gold-gradient-border p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold gold-text mb-6 pb-2 border-b border-[#333333]">Games</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenge.games && challenge.games.map((game, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg 
                ${game.completed
                    ? 'bg-[#1a1a1a] border-2 border-green-600'
                    : challenge.forfeited
                      ? 'bg-[#1a1a1a] border-2 border-red-600'
                      : 'bg-[#1a1a1a] border border-[#333333]'
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium gold-text">{game.name}</h3>
                    {game.completed ? (
                      <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">Completed</span>
                    ) : challenge.forfeited ? (
                      <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">Forfeited</span>
                    ) : null}
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-xs text-gray-400">Progress</div>
                      <div className="text-base font-semibold gold-text">
                        {game.currentWins} / {game.winCount} Wins
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Time</div>
                      <div className="text-base font-mono gold-shimmer-text">
                        {formatTime(game.timer?.duration)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-[#2a2a2a] h-2 rounded-full mb-4 overflow-hidden">
                    <div
                      className={`h-full ${challenge.forfeited ? 'bg-red-600' : 'gold-progress-bar'} rounded-full`}
                      style={{ width: `${(game.currentWins / game.winCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChallenge;