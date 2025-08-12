// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      traccarId: string;
      traccarSessionCookie: string; // <-- Added this
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    traccarId: string;
    traccarSessionCookie: string; // <-- Added this
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    traccarId: string;
    traccarSessionCookie: string; // <-- Added this
  }
}