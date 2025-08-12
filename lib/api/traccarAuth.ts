"use server"

import { cookies } from "next/headers";
import { User } from "@prisma/client";


const traccarApiUrl = process.env.TRACCAR_API_URL
if (!traccarApiUrl) {
  throw new Error("TRACCAR_API_URL is not defined in the environment variables.");
}



// NOTE: This function is for internal server use only.
// It uses a user's database entry to get an authenticated session cookie from Traccar.
export const getTraccarSessionCookie = async (user: User, password: string) => {
  try {
    if (!user.traccarId) {
      throw new Error("User does not have a Traccar ID.");
    }

    const authResponse = await fetch(`${traccarApiUrl}/api/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${user.email}&password=${password}`,
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Traccar session creation failed: ${errorText}`);
    }

    const setCookieHeader = authResponse.headers.get("Set-Cookie");
    if (!setCookieHeader) {
      throw new Error("Traccar did not return a session cookie.");
    }

    // Extract the JSESSIONID cookie
    const sessionIdCookie = setCookieHeader
      .split(";")
      .find((cookie) => cookie.trim().startsWith("JSESSIONID"));

    if (!sessionIdCookie) {
      throw new Error("Failed to find JSESSIONID in the Set-Cookie header.");
    }

    const sessionId = sessionIdCookie.split("=")[1];

    return sessionId;
  } catch (error) {
    console.error('Error getting Traccar session cookie:', error);
    throw new Error('Could not establish Traccar session.');
  }
};

