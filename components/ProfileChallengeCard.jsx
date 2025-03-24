"use client";

import Link from "next/link";

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

const formatDate = (dateString) => {
    if (!dateString) return "–";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

const ProfileChallengeCard = ({name, timer = {}, id, startDate, type, gameCount }) => {
  // Berechne die formatierte Zeit
  const formattedTime = formatTime(timer.duration);
  const formattedDate = formatDate(startDate);

  return (
    <Link href={`/challenge-view/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#a6916e] hover:border-blue-600">
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
      </div>
    </Link>
  );
};

export default ProfileChallengeCard;