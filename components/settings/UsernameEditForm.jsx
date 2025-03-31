"use client";

import { useState, useEffect } from "react";
import { Pencil, Save, X, Info } from "lucide-react";

const UsernameEditForm = ({ session, onUpdate, showMessage }) => {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const currentUsername = session.user.username || session.user.name || "";
      setNewUsername(currentUsername);
    }
  }, [session]);

  const handleUpdate = async () => {
    if (!newUsername.trim()) {
      setError("Benutzername darf nicht leer sein.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await fetch("/api/user/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Fehler beim Parsen der API-Antwort:", responseText);
        throw new Error("Ungültiges Antwortformat vom Server");
      }

      if (!response.ok) {
        throw new Error(data.message || "Fehler beim Aktualisieren des Benutzernamens");
      }

      showMessage("Benutzername erfolgreich aktualisiert! Seite wird neu geladen...");

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Fehler beim Aktualisieren des Benutzernamens:", error);
      setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setNewUsername(session?.user?.username || session?.user?.name || "");
    setError("");
    setShowHint(false);
  };

  return (
    <div className="mb-6 p-4  rounded-lg border border-[#a6916e]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">Username</h3>
        {!editing && (
          <button
            className="text-white cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => setEditing(true)}
          >
            <Pencil width={18} height={18} />
          </button>
        )}
      </div>

      {!editing ? (
        <p className="text-[#a6916e]">{session?.user.username || session?.user.name}</p>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2"
              placeholder="Neuer Benutzername"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-400 transition-colors"
              onClick={() => setShowHint(!showHint)}
            >
              <Info size={18} />
            </button>
          </div>

          {showHint && (
            <div className="text-gray-300 text-sm bg-gray-800 p-2 rounded-md">
              <p>Username requirements</p>
              <ul className="list-disc pl-5 mt-1">
                <li>8-20 characters.</li>
                <li>Only letters, numbers, dots and underscores.</li>
                <li>Can't begin or end with dots or underscores.</li>
                <li>Not two or more dots or underscores in a row.</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-500/20 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
              onClick={cancelEditing}
              disabled={isSubmitting}
            >
              <X size={16} /> Cancel
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameEditForm;