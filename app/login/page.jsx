"use client"

import { Suspense } from 'react';
import SignInForm from '@components/SignInForm';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Separate Komponente, die useSearchParams verwendet
function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isGoogleRedirect, setIsGoogleRedirect] = useState(false);

  // Check if we're in a Google redirect by looking for Google-specific parameters
  useEffect(() => {
    const hasGoogleParams = window.location.search.includes('callback=google');
    if (hasGoogleParams) {
      setIsGoogleRedirect(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user && (isGoogleRedirect || status === "authenticated")) {
      const timer = setTimeout(() => {
        router.push(returnUrl || '/profile');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [session, status, router, returnUrl, isGoogleRedirect]);

  return (
    <section className='w-full h-screen flex items-center justify-center'>
      <div className="max-w-md w-full px-6 py-8">
        {session?.user ? (
          <div className="w-full h-screen bg-base flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white ml-3">Redirecting...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <SignInForm />
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: returnUrl || '/profile' })}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 primary-text-gradient cursor-pointer font-medium rounded-md hover:bg-gray-100 transition-colors mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign In with Google
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Hauptkomponente mit Suspense-Boundary
const Login = () => {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="text-white ml-3">Loading...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
};

export default Login;