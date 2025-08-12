// src/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { verifyPassword } from "@/utils/password";
import { db } from "@/prisma/db";
import { getTraccarSessionCookie } from "@/lib/api/traccarAuth";


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: { email },
          });

       
          if (!user || !user.password) {
            return null; 
          }
          
          const isValid = await verifyPassword(password, user.password);
          if (!isValid) return null; // Invalid password

          // NEW: Traccar account check
          // The user MUST have a traccarId from the admin creation process
          if (!user.traccarId) {
            console.error(`Attempted login for user ${user.email} with no Traccar ID. Access denied.`);
            // You might want to throw an error here or show a custom message
            throw new Error("Your account has not been fully set up by an administrator.");
          }

          // 2. Get Traccar Session
          // Now that our user is authenticated, we get their Traccar session cookie.
          // This is a crucial step that your old code was missing.
          const traccarSessionCookie = await getTraccarSessionCookie(user, credentials.password as string);
          if (!traccarSessionCookie) {
            throw new Error("Failed to create Traccar session.");
          }

          // 3. Return the user object with all necessary data
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
            traccarId: user.traccarId,
            traccarSessionCookie, // This is a new, essential piece of data
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // This callback is for the JWT token
    async jwt({ token, user }) {
      if (user) {
        // User object from authorize() is available here
        token.role = user.role as string;
        token.traccarId = user.traccarId as string;
        token.traccarSessionCookie = user.traccarSessionCookie as string;
      }
      return token;
    },
    // This callback is for the session object
    async session({ session, token }) {
      if (token.sub) {
        // Data from the JWT token is available here
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.traccarId = token.traccarId;
        session.user.traccarSessionCookie = token.traccarSessionCookie;
      }
      return session;
    },
  },
} satisfies NextAuthConfig);