"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UsernameEditForm from "@/components/settings/UsernameEditForm";
import EmailEditForm from "@/components/settings/EmailEditForm";
import PasswordEditForm from "@/components/settings/PasswordEditForm";

const Settings = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isCredentialsUser, setIsCredentialsUser] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      const hasGooglePicture = session.user.image?.includes('googleusercontent.com');
      setIsCredentialsUser(!hasGooglePicture);
    }
  }, [session]);

  const maskEmail = (email) => {
    if (!email) return '';

    const [username, domain] = email.split('@');

    if (username.length <= 2) {
      return `${username.charAt(0)}*@${domain}`;
    }

    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const maskedLength = username.length - 2;
    const maskedUsername = `${firstChar}${'*'.repeat(maskedLength)}${lastChar}`;

    return `${maskedUsername}@${domain}`;
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setErrorMessage("");
    }

    setTimeout(() => {
      if (isError) {
        setErrorMessage("");
      } else {
        setSuccessMessage("");
      }
    }, 5000);
  };

  const handleSessionUpdate = async (data, forceRefresh = false) => {
    try {
      await update(data);

      if (forceRefresh) {
        console.log("Aktualisiere Session und lade Seite neu:", data);

        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Session:", error);
      showMessage("Fehler beim Aktualisieren der Benutzereinstellungen. Bitte lade die Seite neu.", true);
    }
  };

  if (!session) {
    return <div className="text-white">Please SignIn to see your Settings</div>;
  }

  return (
    <div className='p-6 rounded-lg bg-[#1f1a14] border border-[#a6916e]'>
      <h2 className="text-2xl text-white font-bold mb-6">Account Settings</h2>

      <div className="text-gray-400 mb-6">
        <span>Signed in as: </span>
        <span className="text-[#a6916e]">{maskEmail(session?.user.email)}</span>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md">
          {errorMessage}
        </div>
      )}

      <UsernameEditForm
        session={session}
        onUpdate={(data) => handleSessionUpdate(data, true)}
        showMessage={showMessage}
      />

      {isCredentialsUser && (
        <>
          {/* E-Mail-Formular */}
          <EmailEditForm
            session={session}
            onUpdate={(data) => handleSessionUpdate(data, true)}
            showMessage={showMessage}
            emailMask={maskEmail(session?.user.email)}
          />

          <PasswordEditForm
            showMessage={showMessage}
          />
        </>
      )}
    </div>
  );
};

export default Settings;