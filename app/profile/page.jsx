"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ProfileChallengeCard from "@components/ProfileChallengeCard";
import Settings from "@components/Settings";

const Profile = () => {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const response = await fetch("/api/challenges");

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Challenges");
        }

        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        console.error("Fehler beim Laden der Challenges:", err);
        setError(err.message || "Fehler beim Laden der Challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [session]);

  if (!session) {
    return (
      <section className="w-full h-screen flex-col justify-center items-center">
        <h1 className="text-white text-2xl text-center mt-10">Bitte melde dich an, um dein Profil zu sehen.</h1>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-6">
      <h1 className="text-white text-5xl font-bold mb-2">Hallo, {session?.user.username || session?.user.name}!</h1>

      <div className="mt-8 mb-4 text-center">
        <h2 className="text-white text-4xl pb-4 font-semibold border-b-4 border-[#a6916e]">Challenges</h2>
      </div>

      {loading ? (
        <h1 className="text-white w-full text-center text-3xl">Challenges werden geladen...</h1>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : challenges.length > 0 ? (
        <>
          {challenges.some(challenge => !challenge.completed && (challenge.timer?.isRunning || challenge.games.some(game => game.timer?.isRunning))) && (
            <div className="mb-8">
              <h2 className="text-white text-3xl font-semibold mb-6 flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Aktive Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges
                  .filter(challenge => !challenge.completed && (challenge.timer?.isRunning || challenge.games.some(game => game.timer?.isRunning)))
                  .map((challenge) => (
                    <ProfileChallengeCard
                      key={challenge._id}
                      id={challenge._id}
                      name={challenge.name}
                      timer={challenge.timer}
                      startDate={challenge.createdAt}
                      type={challenge.type}
                      gameCount={challenge.games.length}
                      isActive={true}
                    />
                  ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-white text-3xl font-semibold mb-6 border-b-2 border-[#a6916e] pb-2">Alle Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <ProfileChallengeCard
                  key={challenge._id}
                  id={challenge._id}
                  name={challenge.name}
                  timer={challenge.timer}
                  startDate={challenge.createdAt}
                  type={challenge.type}
                  gameCount={challenge.games.length}
                  isActive={!challenge.completed && (challenge.timer?.isRunning || challenge.games.some(game => game.timer?.isRunning))}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-white">Du hast noch keine Challenges erstellt.</p>
      )}

      <div className="mt-8 mb-4 text-center">
        <h2 className="text-white text-4xl pb-4 font-semibold border-b-4 border-[#a6916e]">Einstellungen</h2>
      </div>
      <Settings />
    </section>
  );
};

export default Profile;