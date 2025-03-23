"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const KlassischChallengeForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Debug: Session-Daten in der Konsole anzeigen
  console.log("Session data:", session);

  const [challengeName, setChallengeName] = useState("");
  const [games, setGames] = useState([
    { name: "", winCount: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle adding a new game to the list
  const handleAddGame = () => {
    setGames([...games, { name: "", winCount: 0 }]);
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

    if (!session?.user?.id) {
      setErrorMessage("Benutzer nicht gefunden oder nicht eingeloggt. Bitte melde dich erneut an.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const challengeData = {
        name: challengeName,
        type: "Klassisch",
        games: games.map(game => ({
          name: game.name,
          winCount: game.winCount
        })),
        creator: session.user.id
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

      if (!response.ok) {
        const responseData = await response.text();
        let errorMessage = "Fehler beim Erstellen der Challenge";
        try {
          const errorData = JSON.parse(responseData);
          errorMessage = errorData.message || errorMessage;
          console.error("Server error details:", errorData);
        } catch (e) {
          console.error("Raw server error:", responseData);
        }
        throw new Error(errorMessage);
      }

      // Parsen der Antwort, um die Challenge-ID zu erhalten
      const responseData = await response.json();
      console.log("Challenge-Antwort:", responseData);

      // Ermittle die ID aus der Antwort - überprüfe verschiedene mögliche Feldnamen
      const challengeId = responseData.id || responseData._id || responseData.challengeId;
      console.log("Extrahierte Challenge-ID:", challengeId);

      if (challengeId) {
        // Erweiterte Debug-Informationen
        console.log("Redirect-URL:", `/challenge/${challengeId}`);

        // Kurzer Timeout, um sicherzustellen, dass die Daten in der DB verfügbar sind
        setTimeout(() => {
          // Setze den Pfad für die Weiterleitung
          const path = `/challenge/${challengeId}`;
          console.log("Navigiere zu:", path);
          router.push(path);
        }, 500);
      } else {
        console.warn("Keine Challenge-ID in der Antwort gefunden, Fallback zum Dashboard");
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("Error creating challenge:", error);
      setErrorMessage(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Du bist nicht eingeloggt!</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Klassische Win-Challenge erstellen</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-gray-900 rounded-2xl border border-[#a6916e] p-6"
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
            className="w-full px-3 py-2 border border-[#a6916e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Games List */}
        <div className="mb-6">
          <label className="block text-white text-lg font-medium mb-2">
            Spiele
          </label>

          {games.map((game, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 p-4 border border-[#a6916e] rounded">
              <div className="flex-grow">
                <label htmlFor={`gameName-${index}`} className="block text-white text-sm mb-1">
                  Spiel {index + 1}
                </label>
                <input
                  type="text"
                  id={`gameName-${index}`}
                  value={game.name}
                  onChange={(e) => handleGameChange(index, "name", e.target.value)}
                  placeholder="z.B. Fortnite, Fall Guys B2B"
                  className="w-full px-3 py-2 rounded  text-white border border-gray-500"
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
                  className="w-full px-3 py-2 rounded  text-white border border-gray-500"
                  required
                />
              </div>

              {games.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGame(index)}
                  className="self-end md:self-center p-3 text-white hover:text-[#2E2E2E] rounded-full cursor-pointer hover:primary-gradient border border-[#a6916e] transition"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddGame}
            className="w-full py-2 primary-text-gradient cursor-pointer"
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
          className={`w-full py-3 rounded text-white font-bold text-lg transition border border-[#a6916e] cursor-pointer
            ${isSubmitting ? 'bg-gray-500' : 'hover:primary-gradient hover:text-[#2E2E2E]'}`}
        >
          {isSubmitting ? 'Wird erstellt...' : 'Challenge erstellen'}
        </button>
      </form>
    </div>
  );
};

export default KlassischChallengeForm;