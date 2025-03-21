"use client";

import { useSession } from "next-auth/react";
import TypeWinCard from "@components/TypeWinCard";

const CreateChallenge = () => {
  const { data: session } = useSession();

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">

    {session?.user ? (
      <>
      <h1 className="text-6xl font-bold text-white pb-10">Wähle die Art der Win-Challenge</h1>
      <div className="flex">
        <TypeWinCard
          type="Klassisch"
          desc="Die Klassische Win-Challenge. Es müssen alle Siege für die ausgewählten Spiele geholt werden"
        />
        <TypeWinCard
          type="Bald verfügbar (Münzwurf)"
          desc="Nach jedem Sieg wird eine Münze geworfen. Der Sieg zählt nur, wenn Kopf oder Zahl richtig geraten wird"
        />
        <TypeWinCard
          type="Bald verfügbar (FirstTry)"
          desc="Die Siege müssen alle hintereinander gewonnen werden. Sobald man einmal verliert, muss man von vorne starten"
        />
      </div>
      </>
    ) : (
      <h1>Du bist nicht eingeloggt!</h1>
    )
    }
    </section>
  );
};

export default CreateChallenge;