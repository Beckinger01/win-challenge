"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const KlassischChallengeForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Debug: Session-Daten in der Konsole anzeigen
  console.log("Session data:", session);

  const [challengeName, setChallengeName] = useState("");
  const [games, setGames] = useState([
    { name: "", winCount: 1 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle adding a new game to the list
  const handleAddGame = () => {
    setGames([...games, { name: "", winCount: 1 }]);
  };

  // Handle removing a game from the list
  const handleRemoveGame = (index) => {
    const updatedGames = [...games];
    updatedGames.splice(index, 1);
    setGames(updatedGames);
  };

  // Handle game input changes
  const handleGameChange = (index, field, value) => {
    const updatedGames = [...games];

    if (field === "winCount") {
      // Ensure win count is at least 1
      value = Math.max(1, parseInt(value) || 1);
    }

    updatedGames[index] = {
      ...updatedGames[index],
      [field]: value
    };

    setGames(updatedGames);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!challengeName.trim()) {
      setErrorMessage("Bitte gib einen Namen für die Challenge ein.");
      return;
    }

    // Überprüfung, ob jedes Spiel eine Anzahl Siege >= 1 hat
    if (games.some(game => game.winCount < 1)) {
      setErrorMessage("Anzahl Siege muss für alle Spiele mindestens 1 sein.");
      return;
    }

    if (games.some(game => !game.name.trim())) {
      setErrorMessage("Bitte gib allen Spielen einen Namen.");
      return;
    }

    // Überprüfe, ob Benutzer eingeloggt ist
    if (!session?.user?.id) {
      setErrorMessage("Benutzer nicht gefunden oder nicht eingeloggt. Bitte melde dich erneut an.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Create challenge object
      const challengeData = {
        name: challengeName,
        type: "Klassisch",
        games: games.map(game => ({
          name: game.name,
          winCount: game.winCount
        })),
        creator: session.user.id // Verwende "creator" statt "userId" passend zum Schema
      };

      console.log("Submitting challenge data:", JSON.stringify(challengeData));

      // Submit to API
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      });

      // Vollständige Antwort für Debugging
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = "Fehler beim Erstellen der Challenge";
        try {
          // Versuche, den Text als JSON zu parsen
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          console.error("Server error details:", errorData);
        } catch (e) {
          // Falls es kein gültiges JSON ist, nutze den Rohtext
          console.error("Raw server error:", responseText);
        }
        throw new Error(errorMessage);
      }

      console.log("Challenge erfolgreich erstellt:", responseText);

      // Redirect to dashboard or challenges overview
      router.push("/dashboard");

    } catch (error) {
      console.error("Error creating challenge:", error);
      setErrorMessage(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in, show error
  if (!session?.user) {
    return (
      <section className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-white">Du bist nicht eingeloggt!</h1>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-8">Klassische Win-Challenge erstellen</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 shadow-lg"
      >
        {/* Challenge Name */}
        <div className="mb-6">
          <label htmlFor="challengeName" className="block text-white text-lg font-medium mb-2">
            Challenge-Name
          </label>
          <input
            type="text"
            id="challengeName"
            value={challengeName}
            onChange={(e) => setChallengeName(e.target.value)}
            placeholder="z.B. Wochenend-Challenge"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Games List */}
        <div className="mb-6">
          <label className="block text-white text-lg font-medium mb-2">
            Spiele
          </label>

          {games.map((game, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-700 rounded">
              <div className="flex-grow">
                <label htmlFor={`gameName-${index}`} className="block text-white text-sm mb-1">
                  Spielname
                </label>
                <input
                  type="text"
                  id={`gameName-${index}`}
                  value={game.name}
                  onChange={(e) => handleGameChange(index, "name", e.target.value)}
                  placeholder="z.B. Fortnite, League of Legends"
                  className="w-full px-3 py-2 rounded bg-gray-600 text-white border border-gray-500"
                  required
                />
              </div>

              <div className="w-full md:w-32">
                <label htmlFor={`winCount-${index}`} className="block text-white text-sm mb-1">
                  Anzahl Siege
                </label>
                <input
                  type="number"
                  id={`winCount-${index}`}
                  value={game.winCount}
                  onChange={(e) => handleGameChange(index, "winCount", e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded bg-gray-600 text-white border border-gray-500"
                  required
                />
              </div>

              {games.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGame(index)}
                  className="self-end md:self-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Entfernen
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddGame}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Spiel hinzufügen
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded text-white font-bold text-lg transition
            ${isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isSubmitting ? 'Wird erstellt...' : 'Challenge erstellen'}
        </button>
      </form>
    </section>
  );
};

export default KlassischChallengeForm;