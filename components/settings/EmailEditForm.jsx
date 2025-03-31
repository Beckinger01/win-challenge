"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";

const EmailEditForm = ({ session, onUpdate, showMessage, emailMask }) => {
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleUpdate = async () => {

    if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (!currentPassword) {
      setError("Bitte gib dein aktuelles Passwort ein.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/user/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail, currentPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Fehler beim Aktualisieren der E-Mail");
      }

      await onUpdate({ email: newEmail });

      setEditing(false);

      showMessage("E-Mail erfolgreich aktualisiert! Seite wird neu geladen...");

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Fehler beim Aktualisieren der E-Mail:", error);
      setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setNewEmail(session?.user?.email || "");
    setError("");
  };

  return (
    <div className="mb-6 p-4  rounded-lg border-[#a6916e]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">E-Mail</h3>
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
        <p className="text-[#a6916e]">{emailMask}</p>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm text-gray-300 mb-1">Current E-Mail</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2"
            placeholder="Aktuelles Passwort"
            disabled={isSubmitting}
          />
          <label className="block text-sm text-gray-300 mb-1">New E-Mail</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2"
            placeholder="Neue E-Mail-Adresse"
            disabled={isSubmitting}
          />
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
              onClick={cancelEditing}
              disabled={isSubmitting}
            >
              <X size={16} /> Abbrechen
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              <Save size={16} /> Speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailEditForm;