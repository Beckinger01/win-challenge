"use client";

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CreateChallenge = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  return (
    <section className="w-full h-screen bg-base flex flex-col justify-center items-center">
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Abmelden
      </button>
    </section>
  );
};

export default CreateChallenge;