'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Clock, Trophy, XCircle, CheckCircle } from 'lucide-react';
import StatusBadge from '@components/StatusBadge';
import GamesGrid from '@components/GamesGrid';
import { formatTime } from '@/utils/timerUtils.client';

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
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="text-red-500 mb-4 text-center">{error}</div>
        <Link href="/profile" className="px-4 py-2 gold-bg text-black rounded">
          Back to Profile
        </Link>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-screen p-4 gold-shimmer-text text-center">
        Challenge not found
      </div>
    );
  }

  // Calculate overall progress
  const totalGames = challenge.games?.length || 0;
  const completedGames = challenge.games?.filter(game => game.completed).length || 0;
  const overallProgress = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;
  const pauseDuration = challenge.pauseTimer?.duration || 0;

  // Create gameTimers array for GamesGrid compatibility
  const gameTimers = challenge.games?.map(game => ({
    value: game.timer?.duration || 0
  })) || [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Top navigation and title bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold gold-shimmer-text break-words">{challenge.name}</h1>
          <Link href="/profile" className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition duration-300">
            Back to Profile
          </Link>
        </div>

        {/* Challenge Status Banner */}
        <div className={`w-full mb-6 py-3 px-4 rounded-lg flex items-center justify-center ${challenge.forfeited
          ? 'bg-red-900 bg-opacity-20 border border-red-800'
          : challenge.completed
            ? 'bg-green-900 bg-opacity-20 border border-green-800'
            : 'bg-blue-900 bg-opacity-20 border border-blue-800'
          }`}>
          {challenge.forfeited ? (
            <>
              <XCircle size={20} className="text-red-400 mr-2" />
              <span className="text-red-300 text-base sm:text-xl font-bold">Challenge Forfeited</span>
            </>
          ) : challenge.completed ? (
            <>
              <Trophy size={20} className="text-green-400 mr-2" />
              <span className="text-green-300 text-base sm:text-xl font-bold">Challenge Completed</span>
            </>
          ) : (
            <>
              <Clock size={20} className="text-blue-400 mr-2" />
              <span className="text-blue-300 text-base sm:text-xl font-bold">Challenge in Progress</span>
            </>
          )}
        </div>

        {/* Main challenge stats and info */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Challenge status card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold gold-text mb-3 flex items-center">
              <Clock size={18} className="mr-2 text-[#a6916e]" />
              Challenge Time
            </h2>
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-6xl font-mono font-bold gold-shimmer-text mb-3">
                {formatTime(challenge.timer?.duration)}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 text-sm">Paused Time:</span>
                <span className="gold-text font-mono text-sm">{formatTime(pauseDuration)}</span>
              </div>
              {challenge.createdAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Created:</span>
                  <span className="gold-text text-sm">{formatDate(challenge.createdAt)}</span>
                </div>
              )}
              {challenge.timer?.startTime && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Started:</span>
                  <span className="gold-text text-sm">{formatDate(challenge.timer.startTime)}</span>
                </div>
              )}
              {challenge.completedAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Finished:</span>
                  <span className="gold-text text-sm">{formatDate(challenge.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold gold-text mb-3 flex items-center">
              <CheckCircle size={18} className="mr-2 text-[#a6916e]" />
              Progress
            </h2>
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-6xl font-bold gold-shimmer-text mb-2">
                {overallProgress.toFixed(0)}%
              </div>
              <div className="text-gray-300 text-sm sm:text-base mb-2">
                <span className="gold-text font-medium">{completedGames}</span> of <span className="gold-text font-medium">{totalGames}</span> games completed
              </div>
            </div>
            <div className="w-full bg-[#2a2a2a] h-3 sm:h-4 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${challenge.forfeited ? 'bg-red-600' : 'gold-gradient-bg'} rounded-full transition-all duration-500`}
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Creator info card */}
          <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold gold-text mb-3 flex items-center">
              <User size={18} className="mr-2 text-[#a6916e]" />
              Challenge Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {creatorInfo && (
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Creator:</div>
                  <div className="gold-text text-sm sm:text-base font-medium flex items-center">
                    <User size={14} className="mr-1 gold-text" />
                    {creatorInfo.username || creatorInfo.name || creatorInfo.email}
                  </div>
                </div>
              )}
              <div className="bg-[#1a1a1a] p-3 rounded-lg">
                <div className="text-gray-400 text-xs mb-1">Challenge Type:</div>
                <div className="gold-text text-sm sm:text-base font-medium">{challenge.type || "Standard"}</div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-lg">
                <div className="text-gray-400 text-xs mb-1">Status:</div>
                <StatusBadge challenge={challenge} />
              </div>
              {challenge.type === "FirstTry" && (
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Lost Streaks:</div>
                  <h2 className='gold-text'>{challenge.streaksBroken}</h2>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Games section - Using GamesGrid */}
        <div className="bg-[#151515] rounded-lg gold-gradient-border p-4 sm:p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold gold-text mb-4 pb-2 border-b border-[#333333]">Games</h2>
          <GamesGrid
            challenge={challenge}
            formatTime={formatTime}
            gameTimers={gameTimers}
            isAuthorized={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewChallenge;