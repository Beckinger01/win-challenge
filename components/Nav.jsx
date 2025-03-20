"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { House } from 'lucide-react';
import { signOut } from 'next-auth/react';


function Nav() {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
        router.push('/');
      };

  return (
    <nav className="w-full p-4 flex justify-end items-center gap-4 fixed top-0 ">
        {session?.user ? (
            <button
            onClick={handleSignOut}
            className="bg-gray-700 border border-[#a6916e] p-2 rounded-full text-[#c4af88]"
          >
            Abmelden
          </button>
        ) : (
            <div></div>
        )}
        <Link href="/" className='bg-gray-700 border border-[#a6916e] p-2 rounded-full'>
            <House
                color='#c4af88'
            />
        </Link>
    </nav>
  )
}

export default Nav