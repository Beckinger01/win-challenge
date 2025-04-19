import '@styles/globals.css';
import Provider from '@components/Provider';
import Nav from '@components/Nav';
import GoogleAnalytics from '@components/GoogleAnalytics';
import Script from 'next/script';

export const metadata = {
  title: "Win-Challenge",
  description: "Create or watch Win-Challenges",

  // Grundlegende SEO-Metadaten
  keywords: "challenges, win challenges, competition, social challenges, online challenges",
  author: "Win-Challenge Team",
  robots: "index, follow",

  // Open Graph / Social Media
  openGraph: {
    title: "Win-Challenge",
    description: "Create, compete, and watch exciting Win-Challenges",
    url: "https://www.yourwinchallenge.com",
    siteName: "Win-Challenge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // Pfad zu Ihrem OG-Bild anpassen
        width: 1200,
        height: 630,
        alt: "Win-Challenge - Create or watch Win-Challenges",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Win-Challenge",
    description: "Create or watch Win-Challenges",
    images: ["/images/og-image.jpg"], // Pfad zu Ihrem Twitter-Bild anpassen
    creator: "@winchallenges", // Ihren Twitter-Handle anpassen
  },

  // Kanonische URL
  alternates: {
    canonical: "https://www.yourwinchallenge.com",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="images/favicon.ico" sizes="any" />
        <link rel="icon" href="images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1511082465942403"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Strukturierte Daten für Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Win-Challenge",
              "url": "https://www.yourwinchallenge.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.yourwinchallenge.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <Provider>
          <main className='pt-16 font-int'>
            <Nav />
            {children}
          </main>
        </Provider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

export default RootLayout;