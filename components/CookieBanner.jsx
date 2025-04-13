"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        // Check if user already accepted cookies
        const cookieConsent = localStorage.getItem("cookieConsent");

        // Show banner if no consent yet
        if (!cookieConsent) {
            setIsVisible(true);
        }

        // Detect browser language
        if (!localStorage.getItem("preferredLanguage")) {
            const browserLang = navigator.language || navigator.userLanguage;
            setLanguage(browserLang.startsWith("de") ? "de" : "en");
        } else {
            setLanguage(localStorage.getItem("preferredLanguage"));
        }
    }, []);

    // Accept all cookies
    const acceptAllCookies = () => {
        localStorage.setItem("cookieConsent", "all");
        localStorage.setItem("preferredLanguage", language);
        setIsVisible(false);
        window.location.reload(); // Force reload to initialize analytics
    };

    // Accept only essential cookies
    const acceptEssentialCookies = () => {
        localStorage.setItem("cookieConsent", "essential");
        localStorage.setItem("preferredLanguage", language);
        setIsVisible(false);
    };

    // Toggle language
    const toggleLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("preferredLanguage", lang);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50  flex items-center justify-center p-4">
            <div className="bg-[#151515] rounded-lg gold-gradient-border max-w-lg w-full p-6 shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold gold-shimmer-text mb-4">
                        {language === "de" ? "Cookies & Datenschutz" : "Cookies & Privacy"}
                    </h2>
                    <div className="h-1 w-16 gold-gradient-bg mx-auto"></div>
                </div>

                <div className="mb-6">
                    {language === "de" ? (
                        <div className="text-white">
                            <p className="mb-4">
                                Diese Website verwendet Cookies, um deine Erfahrung zu verbessern. Um fortzufahren, triff bitte eine Auswahl:
                            </p>
                            <ul className="list-disc pl-5 mb-4 text-sm text-gray-300">
                                <li className="mb-1">Notwendige Cookies ermöglichen grundlegende Funktionen</li>
                                <li className="mb-1">Analytische Cookies (Google Analytics) helfen uns, das Nutzererlebnis zu verbessern</li>
                                <li className="mb-1">Werbe-Cookies (Google AdSense) ermöglichen personalisierte Werbung</li>
                            </ul>
                            <p className="text-sm text-gray-300">
                                Weitere Informationen findest du in unserer{" "}
                                <Link href="/data-policy" className="text-blue-400 hover:underline">
                                    Datenschutzerklärung
                                </Link>.
                            </p>
                        </div>
                    ) : (
                        <div className="text-white">
                            <p className="mb-4">
                                This website uses cookies to enhance your experience. To continue, please make a selection:
                            </p>
                            <ul className="list-disc pl-5 mb-4 text-sm text-gray-300">
                                <li className="mb-1">Necessary cookies enable core functionality</li>
                                <li className="mb-1">Analytics cookies (Google Analytics) help us improve user experience</li>
                                <li className="mb-1">Advertising cookies (Google AdSense) enable personalized ads</li>
                            </ul>
                            <p className="text-sm text-gray-300">
                                For more information, please see our{" "}
                                <Link href="/data-policy" className="text-blue-400 hover:underline">
                                    Privacy Policy
                                </Link>.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => toggleLanguage("de")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${language === "de"
                                ? "gold-bg text-black"
                                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                }`}
                        >
                            Deutsch
                        </button>
                        <button
                            onClick={() => toggleLanguage("en")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${language === "en"
                                ? "gold-bg text-black"
                                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                }`}
                        >
                            English
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={acceptEssentialCookies}
                            className="py-3 bg-[#1a1a1a] text-white hover:bg-[#222] rounded-md transition-colors"
                        >
                            {language === "de" ? "Nur notwendige" : "Essential only"}
                        </button>

                        <button
                            onClick={acceptAllCookies}
                            className="py-3 gold-gradient-bg text-black font-medium rounded-md transition-colors hover:opacity-90"
                        >
                            {language === "de" ? "Alle akzeptieren" : "Accept all"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;