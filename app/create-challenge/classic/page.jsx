"use client";

import KlassischChallengeForm from "@components/KlassischChallengeForm";
import { useSession } from "next-auth/react";

const KlassischOption = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center pt-8 pb-16 min-h-screen overflow-y-auto">
      <div className="max-w-2xl w-full px-4 mt-4">
        {session?.user ? (
          <KlassischChallengeForm />
        ) : (
          <h1 className="text-white text-center text-2xl">You are not logged in!</h1>
        )}
      </div>
    </div>
  );
};

export default KlassischOption;