import '@styles/globals.css';
import Provider from '@components/Provider';
import Nav from '@components/Nav';
import GoogleAnalytics from '@components/GoogleAnalytics';

export const metadata = {
  title: "Win-Challenge",
  description: "Create or watch Win-Challenges",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="de">
      <body>
        <GoogleAnalytics />
        <Provider>
          <main className='pt-16 font-int'>
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;