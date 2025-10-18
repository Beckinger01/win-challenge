"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    setConsent(savedConsent);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (consent !== "all") {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V4JSECSYVT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Standard: Alles abgelehnt
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
          });
          
          // Bei Cookie-Zustimmung: Alles erlauben
          gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
          });
          
          gtag('js', new Date());
          gtag('config', 'G-V4JSECSYVT', { 
            anonymize_ip: true 
          });
        `}
      </Script>

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1511082465942403"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}