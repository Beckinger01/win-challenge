import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";

const Settings = () => {
  const { data: session } = useSession();
  const [isCredentialsUser, setIsCredentialsUser] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const hasGooglePicture = session.user.image?.includes('googleusercontent.com');
      setIsCredentialsUser(!hasGooglePicture);
    }
  }, [session]);

  if (!session) {
    return <div>Bitte melde dich an, um deine Einstellungen zu sehen.</div>;
  }

  return (
    <div className='p-4 rounded-lg bg-gray-800 border border-[#a6916e]'>
      <div className="flex items-center gap-4">
        <h1 className="text-white font-semibold text-xl">
          Benutzername: <span className="primary-text-gradient">{session?.user.username || session?.user.name}</span>
        </h1>
        <button className="text-white cursor-pointer">
          <Pencil width={20} height={20} />
        </button>
      </div>

      {isCredentialsUser && (
        <>
          <div className="flex items-center gap-4 mt-4">
            <h1 className="text-white font-semibold text-xl">
              Passwort: <span className="primary-text-gradient">••••••••</span>
            </h1>
            <button className="text-white cursor-pointer">
              <Pencil width={20} height={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <h1 className="text-white font-semibold text-xl">
              E-Mail: <span className="primary-text-gradient">{session?.user.email}</span>
            </h1>
            <button className="text-white cursor-pointer">
              <Pencil width={20} height={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;