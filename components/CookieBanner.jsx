"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [language, setLanguage] = useState("de");

    useEffect(() => {
        // Check if user already accepted cookies
        const cookieConsent = localStorage.getItem("cookieConsent");

        // Set banner visibility if consent not given yet
        if (!cookieConsent) {
            // Small delay to avoid immediate popup on first visit
            setTimeout(() => {
                setIsVisible(true);
            }, 1000);
        } else if (cookieConsent === "all") {
            // Initialize analytics if user already consented
            initializeGoogleAnalytics();
            initializeGoogleAdSense();
        }

        // Detect browser language for first visit
        if (!cookieConsent && !localStorage.getItem("preferredLanguage")) {
            const browserLang = navigator.language || navigator.userLanguage;
            setLanguage(browserLang.startsWith("de") ? "de" : "en");
        } else if (localStorage.getItem("preferredLanguage")) {
            setLanguage(localStorage.getItem("preferredLanguage"));
        }
    }, []);

    // Handle accept all cookies
    const acceptAllCookies = () => {
        localStorage.setItem("cookieConsent", "all");
        localStorage.setItem("preferredLanguage", language);
        setIsVisible(false);

        // Initialize analytics and advertising scripts
        initializeGoogleAnalytics();
        initializeGoogleAdSense();
    };

    // Handle only essential cookies
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

    // Google Analytics initialization function
    const initializeGoogleAnalytics = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-V4JSECSYVT', {
            page_path: window.location.pathname,
            anonymize_ip: true
        });

        console.log("Google Analytics initialized");
    };

    // Google AdSense initialization function
    const initializeGoogleAdSense = () => {
        // This would be where you initialize Google AdSense
        // Usually by loading a script tag

        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        // Replace with your AdSense publisher ID when you have it
        script.dataset.adClient = "ca-pub-YOUR_ADSENSE_ID";
        document.head.appendChild(script);

        console.log("Google AdSense initialized");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#151515] shadow-lg gold-gradient-border-top">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        {language === "de" ? (
                            <div className="text-white">
                                <h3 className="text-lg font-semibold gold-text mb-2">Wir verwenden Cookies</h3>
                                <p className="text-sm mb-3">
                                    Diese Website verwendet Cookies, um deine Erfahrung zu verbessern. Einige Cookies sind für den Betrieb dieser Seite notwendig, während andere uns helfen, deine Nutzererfahrung zu verbessern (Google Analytics) und Werbung anzuzeigen (Google AdSense). Du kannst selbst entscheiden, welche Cookies du zulassen möchtest. Weitere Informationen findest du in unserer{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Datenschutzerklärung
                                    </Link>.
                                </p>
                            </div>
                        ) : (
                            <div className="text-white">
                                <h3 className="text-lg font-semibold gold-text mb-2">We Use Cookies</h3>
                                <p className="text-sm mb-3">
                                    This website uses cookies to enhance your experience. Some cookies are necessary for the operation of this site, while others help us analyze usage (Google Analytics) and display advertising (Google AdSense). You can decide which cookies you want to allow. For more information, please see our{" "}
                                    <Link href="/data-policy" className="text-blue-400 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleLanguage("de")}
                                className={`px-2 py-1 text-xs rounded-md transition-colors ${language === "de"
                                        ? "gold-bg text-black"
                                        : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                    }`}
                            >
                                DE
                            </button>
                            <button
                                onClick={() => toggleLanguage("en")}
                                className={`px-2 py-1 text-xs rounded-md transition-colors ${language === "en"
                                        ? "gold-bg text-black"
                                        : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                                    }`}
                            >
                                EN
                            </button>
                        </div>

                        <button
                            onClick={acceptEssentialCookies}
                            className="px-4 py-2 text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#222] rounded-md transition-colors"
                        >
                            {language === "de" ? "Nur notwendige" : "Essential only"}
                        </button>

                        <button
                            onClick={acceptAllCookies}
                            className="px-4 py-2 text-sm gold-bg text-black rounded-md transition-colors hover:opacity-90"
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