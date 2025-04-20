"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bug } from 'lucide-react';

export default function BugReportPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/bugs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit bug report');
            }

            setSuccess('Bug report submitted successfully!');
            setFormData({ title: '', message: '' });
            
            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);
            
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // If not logged in, show a message and login link
    if (status === 'unauthenticated') {
        return (
            <div className="container mx-auto py-16 px-6">
                <div className="max-w-2xl mx-auto bg-[#151515] border border-[#a6916e] rounded-lg p-10 shadow-xl">
                    <div className="flex items-center justify-center mb-8">
                        <Bug className="w-10 h-10 text-[#a6916e] mr-3" />
                        <h1 className="text-3xl font-bold text-[#a6916e]">Report a Bug</h1>
                    </div>
                    <p className="mb-6 text-xl text-center text-white">You need to be logged in to report bugs.</p>
                    <div className="flex justify-center">
                        <Link 
                            href="/login" 
                            className="px-6 py-3 text-lg bg-[#a6916e] text-[#1f1a14] rounded-md hover:bg-[#8c7b5e] transition-colors inline-block font-medium"
                        >
                            Login to Continue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-6">
            <div className="max-w-2xl mx-auto bg-[#151515] border border-[#a6916e] rounded-lg p-10 shadow-xl">
                <div className="flex items-center justify-center mb-8">
                    <Bug className="w-10 h-10 text-[#a6916e] mr-3" />
                    <h1 className="text-3xl font-bold text-[#a6916e]">Report a Bug</h1>
                </div>
                
                {error && (
                    <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-md mb-6 text-center">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-900 bg-opacity-20 border border-green-500 text-green-300 p-4 rounded-md mb-6 text-center">
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block mb-2 text-lg text-[#a6916e] font-medium">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a241b] border border-[#a6916e] rounded-md p-3 text-white text-lg"
                            placeholder="Brief description of the issue"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block mb-2 text-lg text-[#a6916e] font-medium">
                            Description
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a241b] border border-[#a6916e] rounded-md p-3 text-white text-lg h-48"
                            placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <Link
                            href="/"
                            className="px-6 py-3 border-2 border-[#a6916e] text-[#a6916e] rounded-md hover:bg-[#2a241b] transition-colors text-lg font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#a6916e] text-[#1f1a14] rounded-md hover:bg-[#8c7b5e] transition-colors disabled:opacity-50 text-lg font-medium min-w-32"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}