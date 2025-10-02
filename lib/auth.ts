import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "./db";
import User from "../models/User";
import { User as AppUser } from "../types";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        await dbConnect();
        const usernameInput = credentials.username.trim();
        const user = await User.findOne({ username: usernameInput }).select("+password role username");
        if (!user) return null;
        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;
        return { 
          id: user._id.toString(), 
          name: user.username, 
          role: user.role 
        } as NextAuthUser & { role: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as NextAuthUser & { role: string }).role || "student";
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as AppUser).role = (token.role as 'student' | 'recruiter') || 'student';
        (session.user as AppUser).id = (token.uid as string) || (token.sub as string);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

