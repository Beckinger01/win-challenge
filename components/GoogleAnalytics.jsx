"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const consent = typeof window !== "undefined" ? localStorage.getItem("cookieConsent") : null;

  if (consent !== "all") {
    return null;
  }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
  });

  if (cookieConsent === 'all') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  }

  return (
    <>
      {/* Google AdSense – nur bei Zustimmung */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1511082465942403"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V4JSECSYVT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V4JSECSYVT', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
