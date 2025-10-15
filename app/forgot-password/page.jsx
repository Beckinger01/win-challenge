"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccess(true);
                setMessage('Wenn ein Konto mit dieser E-Mail existiert, erhältst du in Kürze eine E-Mail mit weiteren Anweisungen.');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        } catch (error) {
            setMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='w-full h-screen flex items-center justify-center'>
            <div className="max-w-md w-full px-6 py-8 bg-[#151515] rounded-lg gold-gradient-border shadow-lg">
                <h1 className="text-2xl font-bold gold-shimmer-text mb-6 text-center">Passwort zurücksetzen</h1>

                {success ? (
                    <div className="space-y-6">
                        <div className="bg-green-900 bg-opacity-20 border border-green-800 p-4 rounded text-green-300">
                            {message}
                        </div>
                        <Link href="/login" className="block text-center gold-text hover:underline">
                            Zurück zum Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-gray-300 mb-2">
                                E-Mail Adresse
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {isSubmitting ? 'Bitte warten...' : 'Link zusenden'}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="gold-text hover:underline">
                                Zurück zum Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
