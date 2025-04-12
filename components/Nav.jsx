"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { House, UserRound, LogOut, User, Pencil } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

function Nav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  // Nur für das Dropdown-Menü: Schließen beim Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full p-4 flex justify-end items-center gap-4 fixed top-0 z-50">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-[#1f1a14] border border-[#a6916e] p-2 rounded-full cursor-pointer"
        >
          <UserRound color="#d9a441" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1f1a14] border border-[#a6916e] z-50">
            <div className="py-1">
              {!session?.user ? (
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-sm gold-text hover:bg-[#2a241b] transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="mr-2" size={16} color="#d9a441" />
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm gold-text hover:bg-[#2a241b] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="mr-2" size={16} color="#d9a441" />
                    Profile
                  </Link>
                  <Link
                    href="/create-challenge"
                    className="flex items-center px-4 py-2 text-sm gold-text hover:bg-[#2a241b] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Pencil className="mr-2" size={16} color="#d9a441" />
                    Create Challenge
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm gold-text hover:bg-[#2a241b] transition-colors"
                  >
                    <LogOut className="mr-2 cursor-pointer" size={16} color="#d9a441" />
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Link href="/" className='bg-[#1f1a14] border border-[#a6916e] p-2 rounded-full'>
        <House color='#d9a441' />
      </Link>
    </nav>
  )
}

export default Nav