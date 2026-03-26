import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/validations";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = signInSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        let user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        // Auto-create the admin user if they don't exist yet but provide the correct hardcoded credentials
        if (!user && email.toLowerCase() === "codesorted0704@gmail.com" && password === "Adarsh180704##") {
          const hashedPassword = await bcrypt.hash(password, 12);
          user = await prisma.user.create({
            data: {
              email: email.toLowerCase(),
              name: "Admin",
              role: "ADMIN",
              consentGiven: true,
              hashedPassword,
            },
          });
        }

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // The user object comes from the DB in authorize or adapter
        // @ts-ignore - appending custom properties
        token.role = user.role;
        // @ts-ignore
        token.consentGiven = user.consentGiven;
      }
      
      // Handle manual session updates (e.g. when consent is given)
      if (trigger === "update" && session) {
        if (session.consentGiven !== undefined) {
          token.consentGiven = session.consentGiven;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // @ts-ignore - appending custom properties
        session.user.role = token.role;
        // @ts-ignore
        session.user.consentGiven = token.consentGiven;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isLanding = nextUrl.pathname === "/";

      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/notes") ||
        nextUrl.pathname.startsWith("/quiz") ||
        nextUrl.pathname.startsWith("/admin");

      // Admin route protection
      if (nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn) return Response.redirect(new URL("/auth/signin", nextUrl));
        // @ts-ignore
        if (auth?.user?.email !== "codesorted0704@gmail.com" && auth?.user?.role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      // Protected route enforcement
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }

      // Redirect authenticated users away from auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow landing page for everyone
      if (isLanding) {
        return true;
      }

      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
