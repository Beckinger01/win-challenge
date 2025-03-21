"use client";

import Link from "next/link"
import { useSession } from "next-auth/react";

const KlassischOption = () => {
  const { data: session } = useSession();

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">

    {session?.user ? (
      <>
      
      </>
    ) : (
      <h1>Du bist nicht eingeloggt!</h1>
    )
    }
    </section>
  );
};

export default KlassischOption;