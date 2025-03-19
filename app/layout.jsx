import '@styles/globals.css';
import Provider from '@components/Provider';

export const metadata = {
  title: "Win-Challenge",
  description: "Create or watch Win-Challenges",
};

const RootLayout =({ children }) => {
  return (
    <html lang="en">
      <body>
      <Provider>
        <main>
          {children}
        </main>
      </Provider>
      </body>
    </html>
  );
}

export default RootLayout;