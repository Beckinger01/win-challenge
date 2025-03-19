"use client";

import { signIn, useSession, getProviders, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

const CreateChallenge = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error loading providers:", error);
      }
    };
    setUpProviders();
  }, []);


  return (
    <section className="w-full h-screen bg-base flex flex-col justify-center items-center">
      {session?.user ? (
        <div>
          <button
          type='button'
          onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <>
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="text-white bg-blue-500 p-2 rounded m-2"
              >
                Sign In with {provider.name}
              </button>
            ))}
        </>
      )}
    </section>
  );
};

export default CreateChallenge;