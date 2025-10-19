"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const DeleteAccount = ({ showMessage }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!session?.user) {
      setError("You must be logged in!");
      return;
    }

    if (confirmText !== "CONFIRM") {
      setError("Please type CONFIRM to delete your account");
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      const response = await fetch("/api/user/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error deleting account");
      }

      showMessage("Account successfully deleted");
      
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setConfirmText("");
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setConfirmText("");
    setError("");
  };

  return (
    <>
      <div className="p-4 rounded-lg border border-[#a6916e]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">Delete Account</h3>
            <p className="text-gray-400 text-sm">
              Permanently delete your account and all your data
            </p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          <Trash2 width={18} height={18} />
          Delete Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151515] rounded-lg border-2 border-red-800 max-w-md w-full p-6 shadow-2xl">
            {/* Warning Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-900 bg-opacity-30 rounded-full p-3">
                <AlertTriangle className="text-red-500" width={40} height={40} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Delete Account
            </h2>

            {/* Warning Text */}
            <div className="bg-red-950 bg-opacity-40 border border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-300 text-sm mb-2">
                <strong>⚠️ Warning:</strong> This action cannot be undone!
              </p>
              <p className="text-gray-300 text-sm">
                Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-2 ml-2 space-y-1">
                <li>Your profile and username</li>
                <li>All your created challenges</li>
                <li>Your progress and statistics</li>
                <li>All associated data</li>
              </ul>
            </div>

            {/* Confirmation Input */}
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Type <span className="text-red-400 font-bold">CONFIRM</span> to delete your account:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                disabled={isDeleting}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 p-3 rounded text-red-300 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== "CONFIRM"}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 width={18} height={18} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;