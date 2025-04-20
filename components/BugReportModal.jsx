"use client";

import { useState } from 'react';

const BugReportModal = ({ isOpen, onClose }) => {
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

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1f1a14] border border-[#a6916e] rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-[#a6916e]">Report a Bug</h2>

                {error && (
                    <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-2 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-900 bg-opacity-20 border border-green-500 text-green-300 p-2 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-1 text-sm text-[#a6916e]">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a241b] border border-[#a6916e] rounded p-2 text-white"
                            placeholder="Brief description of the issue"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-1 text-sm text-[#a6916e]">
                            Description
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a241b] border border-[#a6916e] rounded p-2 text-white h-32"
                            placeholder="Please describe the bug in detail"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#a6916e] text-[#a6916e] rounded hover:bg-[#2a241b] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#a6916e] text-[#1f1a14] rounded hover:bg-[#8c7b5e] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BugReportModal;