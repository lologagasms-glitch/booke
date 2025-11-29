"use server"

import { auth } from "@/app/lib/auth";

/**
 * Initiates Google OAuth sign-in and returns the redirect URL.
 * @returns The OAuth provider’s redirect URL.
 * @throws If the provider fails to return a valid redirect URL.
 */
export async function connectUserSocialGoogle(): Promise<string> {
  const response = await auth.api.signInSocial({
    body: { provider: "google" },
  });

  if (!response?.url) {
    throw new Error("Google OAuth provider did not return a redirect URL");
  }

  return response.url;
}