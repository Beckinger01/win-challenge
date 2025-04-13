"use client"

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        isSignUp: 'true'
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/create-challenge');
      }
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center gold-shimmer-text">Register</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-white rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium gold-text mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your Username"
            required
            className="w-full px-4 py-3 bg-[#151515] border border-[#a6916e] text-white rounded-md focus:outline-none focus:gold-border"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium gold-text mb-1">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@beispiel.de"
            required
            className="w-full px-4 py-3 bg-[#151515] border border-[#a6916e] text-white rounded-md focus:outline-none focus:gold-border"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium gold-text mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 bg-[#151515] border border-[#a6916e] text-white rounded-md focus:outline-none focus:gold-border"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 text-black font-medium rounded-md transition-colors ${isLoading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'gold-gradient-bg gold-pulse cursor-pointer'
            }`}
        >
          {isLoading ? 'Processing...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already registered?{' '}
          <Link href="/login" className="gold-text hover:text-[#f0d080] transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}