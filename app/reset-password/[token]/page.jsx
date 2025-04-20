// app/reset-password/[token]/page.jsx
"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function ResetPassword({ params }) {
    const { token } = use(params);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [tokenValid, setTokenValid] = useState(true); // Assume valid initially
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/reset-password/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            if (response.ok) {
                // Show success message and log out
                setSuccess(true);

                // Wait 3 seconds before logging out and redirecting
                setTimeout(async () => {
                    await signOut({ redirect: false });
                    router.push('/login?reset=success');
                }, 3000);
            } else {
                const data = await response.json();
                setMessage(data.message || 'An error occurred. Please try again later.');
                if (data.message === 'Token is invalid or expired') {
                    setTokenValid(false);
                }
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='w-full h-screen flex items-center justify-center'>
            <div className="max-w-md w-full px-6 py-8 bg-[#151515] rounded-lg gold-gradient-border shadow-lg">
                <h1 className="text-2xl font-bold gold-shimmer-text mb-6 text-center">Set New Password</h1>

                {success ? (
                    <div className="space-y-6">
                        <div className="bg-green-900 bg-opacity-20 border border-green-500 p-4 rounded text-green-300 text-center">
                            Password has been reset successfully! You will be redirected to the login page.
                        </div>
                    </div>
                ) : !tokenValid ? (
                    <div className="space-y-6">
                        <div className="bg-red-900 bg-opacity-20 border border-red-800 p-4 rounded text-red-300">
                            The reset link is invalid or has expired. Please request a new link.
                        </div>
                        <Link href="/forgot-password" className="block text-center gold-text hover:underline">
                            Request New Link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-gray-300 mb-2">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#a6916e]"
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#a6916e]"
                                required
                            />
                        </div>

                        {message && (
                            <div className="bg-red-900 bg-opacity-20 border border-red-800 p-4 rounded text-red-300">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full gold-bg text-black font-semibold py-3 rounded-md"
                        >
                            {isSubmitting ? 'Please wait...' : 'Save Password'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}