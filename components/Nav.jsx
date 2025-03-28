"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { House, UserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


function Nav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // Wenn nach unten gescrollt wird, verstecke die Navbar
        if (window.scrollY > lastScrollY) {
          setNavbarVisible(false);
        }
        // Wenn nach oben gescrollt wird, zeige die Navbar
        else {
          setNavbarVisible(true);
        }

        // Aktualisiere die letzte Scroll-Position
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup-Funktion
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav className={`w-full p-4 flex justify-end items-center gap-4 fixed top-0 z-50 transition-transform duration-300 ${navbarVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      {session?.user ? (
        <>
          <button
            onClick={handleSignOut}
            className="bg-gray-700 border border-[#a6916e] p-2 rounded-full primary-text cursor-pointer"
          >
            Abmelden
          </button>
          <Link href="/profile" className='bg-gray-700 border border-[#a6916e] p-2 rounded-full'>
            <UserRound color='#c4af88' />
          </Link>
        </>
      ) : (
        <div></div>
      )}
      <Link href="/" className='bg-gray-700 border border-[#a6916e] p-2 rounded-full'>
        <House color='#c4af88' />
      </Link>
    </nav>
  )
}

export default Nav