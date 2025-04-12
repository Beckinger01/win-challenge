"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
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
          gtag('js', new Date());
          gtag('config', 'G-V4JSECSYVT', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
            </Script>
        </>
    );
}