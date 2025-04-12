"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Trash2, User } from "lucide-react"; // Added User icon

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

const ProfileChallengeCard = ({ name, timer = {}, id, startDate, type, gameCount, isActive, creatorUsername }) => {
  const { data: session } = useSession();
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [creator, setCreator] = useState(creatorUsername || null);

  useEffect(() => {
    // Check if the current user is the creator of this challenge
    const checkCreator = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/challenges/${id}/authorize`);
        const data = await response.json();
        setIsCreator(data.authorized);
      } catch (error) {
        console.error("Error checking challenge creator:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch creator info if not provided
    const fetchCreator = async () => {
      if (creatorUsername) {
        return; // Already have creator info from props
      }

      try {
        // First get the challenge to get the creator ID
        const challengeResponse = await fetch(`/api/challenges/${id}`);
        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json();

          if (challengeData.creator) {
            // Then get the creator info
            const userResponse = await fetch(`/api/user/${challengeData.creator}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setCreator(userData.username || userData.name || userData.email);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching creator info:", error);
      }
    };

    checkCreator();
    fetchCreator();
  }, [id, session, creatorUsername]);

  const formattedTime = formatTime(timer.duration);
  const formattedDate = formatDate(startDate);

  const handleCardClick = (e) => {
    if (e.target.closest('.action-buttons') || e.target.closest('.delete-btn')) {
      e.stopPropagation();
      return;
    }

    if (isActive) {
      // Challenge is live
      if (isCreator) {
        // User is the creator, go to control page
        window.location.href = `/challenge/${id}`;
      } else {
        // User is not the creator, go to public view
        window.location.href = `/challenge/public/${id}`;
      }
    } else {
      // Challenge is not live, go to view page
      window.location.href = `/challenge-view/${id}`;
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!isCreator) {
      alert("Nur der Ersteller kann die Challenge löschen.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    // Double-check server-side if user is creator
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      // First, check if user is authorized to delete
      const authCheck = await fetch(`/api/challenges/${id}/authorize`);
      const authData = await authCheck.json();

      if (!authData.authorized) {
        throw new Error("Du bist nicht berechtigt, diese Challenge zu löschen.");
      }

      // If authorized, proceed with deletion
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fehler beim Löschen der Challenge");
      }

      // On success, refresh the page to show updated challenge list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting challenge:", error);
      setDeleteError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative cursor-pointer bg-[#1f1a14] rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border ${isActive ? 'border-green-500 border-2' : 'border-[#a6916e]'} hover:border-blue-600`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs flex items-center rounded-bl-lg z-10">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
          {loading ? 'Checking...' : (isCreator ? 'Live (Control)' : 'Live (View)')}
        </div>
      )}

      {/* Delete button */}
      {!loading && isCreator && (
        <button
          onClick={handleDeleteClick}
          className="delete-btn absolute top-2 left-2 p-1.5 bg-[#2a2017] hover:bg-red-900 rounded-full transition-colors z-20"
          aria-label="Delete challenge"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      )}

      <h3 className="text-white text-4xl font-semibold mb-3 text-center">{name}</h3>

      {/* Creator info */}
      <div className="flex items-center justify-center mb-3 text-center">
        <User size={16} className="text-[#a6916e] mr-1" />
        <span className="text-[#a6916e] text-sm">
          {creator || "..."}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10">
        <div className="text-center text-white text-1xl font-semibold">
          Type: {type}
        </div>
        <div className="text-center text-white text-1xl font-semibold">
          Date: {formattedDate}
        </div>
        <div className="text-center gold-shimmer-text text-3xl font-semibold">
          {formattedTime}
        </div>
        <div className="text-center gold-shimmer-text text-3xl font-semibold">
          {gameCount == 1 ? (
            `${gameCount} Spiel`
          ) : (
            `${gameCount} Spiele`
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-[#1f1a14] rounded-lg gold-gradient-border p-6 max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold gold-text mb-4">Delete challenge?</h3>
            <p className="text-gray-300 mb-6">
              Are your sure, that you want to delete the challenge "{name}"? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-300 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Löschen"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileChallengeCard;