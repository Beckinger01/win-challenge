import '@styles/globals.css';
import Provider from '@components/Provider';
import Nav from '@components/Nav';
import GoogleAnalytics from '@components/GoogleAnalytics';
import Script from 'next/script';

export const metadata = {
  title: "Win-Challenge",
  description: "Create or watch Win-Challenges",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1511082465942403"
          crossorigin="anonymous"
          strategy="afterInteractive"
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