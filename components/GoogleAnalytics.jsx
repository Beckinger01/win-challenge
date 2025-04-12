"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
    useEffect(() => {
        // Check if user has consented to cookies
        const cookieConsent = localStorage.getItem("cookieConsent");

        // If we have the Google Analytics tags loaded but user has only consented to essential cookies,
        // we should respect this and disable tracking
        if (cookieConsent === "essential" && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }, []);

    return (
        <>
            {/* Load the Google Analytics script */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-V4JSECSYVT"
                strategy="afterInteractive"
            />

            {/* Initialize Google Analytics with consent mode */}
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Initialize with consent mode
          gtag('consent', 'default', {
            'analytics_storage': 'denied'
          });
          
          gtag('config', 'G-V4JSECSYVT', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
          
          // Check for existing consent
          const cookieConsent = localStorage.getItem("cookieConsent");
          if (cookieConsent === "all") {
            gtag('consent', 'update', {
              'analytics_storage': 'granted'
            });
          }
        `}
            </Script>
        </>
    );
}