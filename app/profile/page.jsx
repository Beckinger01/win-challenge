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
        <h1 className="text-white text-2xl text-center mt-10">Please SignIn to see your profile.</h1>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-6">
      <h1 className="text-white text-5xl font-bold mb-2">Hello, {session?.user.username || session?.user.name}!</h1>

      <div className="mt-8 mb-4 text-center">
        <h2 className="text-white text-5xl pb-4 font-semibold">Challenges</h2>
      </div>

      {loading ? (
        <h1 className="text-white w-full text-center text-3xl">Challenges loading</h1>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : challenges.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-white text-3xl font-semibold mb-6 border-b-2 border-[#a6916e] pb-2">Active Challenges</h2>

            {challenges.some(challenge => !challenge.completed && !challenge.forfeited) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges
                  .filter(challenge => !challenge.completed && !challenge.forfeited)
                  .map((challenge) => (
                    <ProfileChallengeCard
                      key={challenge._id}
                      id={challenge._id}
                      name={challenge.name}
                      timer={challenge.timer}
                      startDate={challenge.createdAt}
                      type={challenge.type}
                      gameCount={challenge.games.length}
                      isActive={!challenge.completed && !challenge.forfeited}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No active challenges found.</p>
            )}
          </div>
          <div>
            <h2 className="text-white text-3xl font-semibold mb-6 border-b-2 border-[#a6916e] pb-2">All Challenges</h2>
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
        <p className="text-white w-full text-center text-2xl py-5">You haven't created a challenge yet.</p>
      )}

      <div className="mt-8 mb-4 text-center">
        <h2 className="text-white text-5xl pb-4 font-semibold border-b-4 border-[#a6916e]">Settings</h2>
      </div>
      <Settings />
    </section>
  );
};

export default Profile;