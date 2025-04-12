"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useSession } from "next-auth/react";

const PasswordEditForm = ({ showMessage }) => {
  const { data: session } = useSession();
  const [isResetRequested, setIsResetRequested] = useState(false);
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [error, setError] = useState("");

  const requestPasswordReset = async () => {
    if (!session?.user?.email) {
      setError("No email address found. Please contact support.");
      return;
    }

    try {
      setIsRequestingReset(true);
      setError("");

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error requesting password reset");
      }

      setIsResetRequested(true);
      showMessage("Reset link has been sent to your email!");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsRequestingReset(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-[#a6916e]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">Password</h3>
        {!isResetRequested && !isRequestingReset && (
          <button
            className="text-white cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1"
            onClick={requestPasswordReset}
            disabled={isRequestingReset}
            title="Reset Password via Email"
          >
            <Mail width={18} height={18} />
            <span className="text-sm">Reset Password</span>
          </button>
        )}
      </div>

      {isResetRequested ? (
        <div className="bg-green-900 bg-opacity-20 border border-green-800 p-4 rounded text-green-300 text-sm">
          <p>An email with instructions to reset your password has been sent to {session?.user?.email}.</p>
          <p className="mt-2">Please check your email inbox and follow the instructions in the email.</p>
          <button
            className="mt-3 text-green-300 hover:text-green-100 underline"
            onClick={() => setIsResetRequested(false)}
          >
            Back
          </button>
        </div>
      ) : (
        <div>
            <div className="bg-gray-70 py-2 text-[#a6916e]">
              ••••••••••••
            </div>
        </div>
      )}

      {isRequestingReset && (
        <div className="mt-2 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          <span className="text-sm text-gray-300">Email is being sent...</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default PasswordEditForm;