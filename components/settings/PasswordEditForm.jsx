"use client";

import { useState } from "react";
import { Pencil, Save, X, Eye, EyeOff } from "lucide-react";

const PasswordEditForm = ({ showMessage }) => {
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleUpdate = async () => {
    setError("");
    if (!currentPassword) {
      setError("Bitte gib dein aktuelles Passwort ein.");
      return;
    }

    if (!newPassword) {
      setError("Bitte gib ein neues Passwort ein.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Fehler beim Aktualisieren des Passworts");
      }

      setEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage("Passwort erfolgreich aktualisiert!");

    } catch (error) {
      console.error("Fehler beim Aktualisieren des Passworts:", error);
      setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">Passwort</h3>
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
        <p className="text-[#a6916e]">••••••••</p>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Aktuelles Passwort</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2 pr-10"
                placeholder="Aktuelles Passwort"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Neues Passwort</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2 pr-10"
                placeholder="Neues Passwort"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Passwort bestätigen</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 text-white border border-[#a6916e] rounded-md px-3 py-2"
              placeholder="Passwort bestätigen"
              disabled={isSubmitting}
            />
          </div>

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

export default PasswordEditForm;