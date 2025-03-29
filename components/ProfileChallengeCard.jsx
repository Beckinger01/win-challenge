"use client";

import Link from "next/link";

const formatTime = (duration) => {
  if (!duration) return "00:00:00";

  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "–";
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProfileChallengeCard = ({ name, timer = {}, id, startDate, type, gameCount, isActive }) => {

  const formattedTime = formatTime(timer.duration);
  const formattedDate = formatDate(startDate);

  const handleCardClick = (e) => {
    if (e.target.closest('.action-buttons')) {
      e.stopPropagation();
      return;
    }
    window.location.href = `/challenge-view/${id}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative cursor-pointer bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border ${isActive ? 'border-green-500 border-2' : 'border-[#a6916e]'} hover:border-blue-600`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs flex items-center rounded-bl-lg z-10">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
          Live
        </div>
      )}

      <h3 className="text-white text-4xl font-semibold mb-3 text-center">{name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10">
        <div className="text-center text-white text-1xl font-semibold">
          Typ: {type}
        </div>
        <div className="text-center text-white text-1xl font-semibold">
          Am: {formattedDate}
        </div>
        <div className="text-center primary-text-gradient text-3xl font-semibold">
          {formattedTime}
        </div>
        <div className="text-center primary-text-gradient text-3xl font-semibold">
          {gameCount == 1 ? (
            `${gameCount} Spiel`
          ) : (
            `${gameCount} Spiele`
          )}
        </div>
      </div>

      <div className="action-buttons flex justify-center gap-3 mt-6" onClick={(e) => e.stopPropagation()}>
        <Link
          href={`/challenge/${id}`}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
        >
          Controller
        </Link>
        <Link
          href={`/challenge/public/${id}`}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zuschauer
        </Link>
      </div>
    </div>
  );
};

export default ProfileChallengeCard;