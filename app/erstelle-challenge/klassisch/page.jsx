"use client";

import KlassischChallengeForm from "@components/KlassischChallengeForm";
import { useSession } from "next-auth/react";

const KlassischOption = () => {
  const { data: session } = useSession();

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">

    {session?.user ? (
      <>
      <KlassischChallengeForm />
      </>
    ) : (
      <h1>Du bist nicht eingeloggt!</h1>
    )
    }
    </section>
  );
};

export default KlassischOption;