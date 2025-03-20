import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { hash, compare } from 'bcrypt';
import User from '@models/user';
import { connectToDB } from '@utils/database';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "boolean" }
      },
      async authorize(credentials) {
        await connectToDB();

        try {
          if (credentials.isSignUp === 'true') {
            const existingUser = await User.findOne({ email: credentials.email });
            if (existingUser) {
              throw new Error('User already exists');
            }

            const hashedPassword = await hash(credentials.password, 12);
            const newUser = new User({
              email: credentials.email,
              password: hashedPassword,
              username: credentials.username,
            });

            await newUser.save();

            return {
              id: newUser._id.toString(),
              email: newUser.email,
              username: newUser.username
            };
          } else {
            const user = await User.findOne({ email: credentials.email });
            if (!user) {
              throw new Error('No user found with the email');
            }
            if (!user.password) {
              throw new Error('This account uses Google authentication');
            }
            const isValid = await compare(credentials.password, user.password);
            if (!isValid) {
              throw new Error('Incorrect password');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              username: user.username,
              image: user.image
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],

  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },

    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectToDB();

          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          }

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }

      return true;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };