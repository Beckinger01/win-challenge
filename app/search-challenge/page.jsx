"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Calendar, User, X } from "lucide-react";
import ProfileChallengeCard from "@/components/ProfileChallengeCard";
import Link from "next/link";

const SearchChallenge = () => {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("name");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [challenges, setChallenges] = useState([]);
    const [liveChallenges, setLiveChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [liveLoading, setLiveLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [visibleLiveChallenges, setVisibleLiveChallenges] = useState(5);

    // Fetch live challenges on page load
    useEffect(() => {
        const fetchLiveChallenges = async () => {
            setLiveLoading(true);
            try {
                const response = await fetch("/api/challenges/live");

                if (!response.ok) {
                    throw new Error("Error loading live challenges");
                }

                const data = await response.json();
                setLiveChallenges(data);
            } catch (err) {
                console.error("Error fetching live challenges:", err);
            } finally {
                setLiveLoading(false);
            }
        };

        fetchLiveChallenges();
    }, []);

    const handleSearch = async (e) => {
        e?.preventDefault();

        if (!searchTerm && searchType !== "date") {
            setError("Please enter a search term");
            return;
        }

        if (searchType === "date" && (!dateRange.from || !dateRange.to)) {
            setError("Please select a date range");
            return;
        }

        setLoading(true);
        setError(null);
        setShowResults(true);

        try {
            let url = "/api/challenges/search?";

            if (searchType === "name") {
                url += `name=${encodeURIComponent(searchTerm)}`;
            } else if (searchType === "creator") {
                url += `creator=${encodeURIComponent(searchTerm)}`;
            } else if (searchType === "date") {
                url += `from=${dateRange.from}&to=${dateRange.to}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error searching");
            }

            const data = await response.json();
            setChallenges(data);
        } catch (err) {
            setError(err.message);
            setChallenges([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setDateRange({ from: "", to: "" });
        setChallenges([]);
        setShowResults(false);
        setError(null);
    };

    const loadMoreLiveChallenges = () => {
        setVisibleLiveChallenges(prevVisible => prevVisible + 5);
    };

    return (
        <div className="min-h-screen w-full px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold gold-shimmer-text text-center mb-10">
                    Challenge search
                </h1>

                {/* Search Form */}
                <div className="bg-[#151515] rounded-lg gold-gradient-border p-6 shadow-lg mb-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="flex space-x-4 mb-4 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setSearchType("name")}
                                        className={`px-4 py-2 rounded-md mb-2 ${searchType === "name"
                                            ? "gold-bg text-black"
                                            : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                            } transition-colors`}
                                    >
                                        <Search className="w-4 h-4 inline mr-2" />
                                        Name
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchType("creator")}
                                        className={`px-4 py-2 rounded-md mb-2 ${searchType === "creator"
                                            ? "gold-bg text-black"
                                            : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                            } transition-colors`}
                                    >
                                        <User className="w-4 h-4 inline mr-2" />
                                        Creator
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchType("date")}
                                        className={`px-4 py-2 rounded-md mb-2 ${searchType === "date"
                                            ? "gold-bg text-black"
                                            : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                            } transition-colors`}
                                    >
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Date
                                    </button>
                                </div>

                                {searchType !== "date" ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder={
                                                searchType === "name"
                                                    ? "Enter challenge name..."
                                                    : "Enter the creator's name..."
                                            }
                                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#a6916e]"
                                        />
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-gray-400 mb-1">From:</label>
                                            <input
                                                type="date"
                                                value={dateRange.from}
                                                onChange={(e) =>
                                                    setDateRange({ ...dateRange, from: e.target.value })
                                                }
                                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#a6916e]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-gray-400 mb-1">To:</label>
                                            <input
                                                type="date"
                                                value={dateRange.to}
                                                onChange={(e) =>
                                                    setDateRange({ ...dateRange, to: e.target.value })
                                                }
                                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#a6916e]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                type="submit"
                                className="px-6 py-3 gold-bg text-black font-semibold rounded-md hover:opacity-90 transition-opacity"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></span>
                                        Searching...
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </button>
                            {showResults && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-300 text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Search Results */}
                {showResults && (
                    <div className="my-8">
                        <h2 className="text-2xl font-semibold gold-text mb-4 border-b border-[#333] pb-2">
                            Search results
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 gold-border"></div>
                            </div>
                        ) : challenges.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-400 text-lg">No challenges found</p>
                                <p className="text-gray-500 mt-2">Try a different search</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {challenges.map((challenge) => (
                                    <ProfileChallengeCard
                                        key={challenge._id}
                                        id={challenge._id}
                                        name={challenge.name}
                                        timer={challenge.timer}
                                        startDate={challenge.createdAt}
                                        type={challenge.type}
                                        gameCount={challenge.games.length}
                                        isActive={!challenge.completed && (challenge.timer?.isRunning || challenge.games.some(game => game.timer?.isRunning))}
                                        creatorUsername={challenge.creatorUsername} // Add this line - use whatever property has the creator info
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Live Challenges Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold gold-text mb-4 border-b border-[#333] pb-2">
                        Live Challenges
                    </h2>

                    {liveLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 gold-border"></div>
                        </div>
                    ) : liveChallenges.length === 0 ? (
                        <div className="text-center py-10 bg-[#151515] rounded-lg border border-[#333] p-6">
                            <p className="text-gray-400 text-lg">No live challenges at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {liveChallenges.slice(0, visibleLiveChallenges).map((challenge) => (
                                    <ProfileChallengeCard
                                        key={challenge._id}
                                        id={challenge._id}
                                        name={challenge.name}
                                        timer={challenge.timer}
                                        startDate={challenge.createdAt}
                                        type={challenge.type}
                                        gameCount={challenge.games.length}
                                        isActive={true}
                                        creatorUsername={challenge.creatorUsername}
                                    />
                                ))}
                            </div>

                            {liveChallenges.length > visibleLiveChallenges && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMoreLiveChallenges}
                                        className="px-4 py-2 bg-[#1a1a1a] text-gold-text border border-[#a6916e] rounded-md hover:bg-[#222] transition-colors"
                                    >
                                        Show more ({liveChallenges.length - visibleLiveChallenges} weitere)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchChallenge;