"use server"

import { auth } from "@/app/lib/auth";

export async function connectUserSocialGoogle() {
  try {
    const response = await auth.api.signInSocial({
      body: { provider: "google" },
    });

    if (!response?.url) {
      throw new Error("No redirect URL returned from provider");
    }

    return response.url;
  } catch (error) {
    console.error("Google social sign-in error:", error);
    throw error;
  }
}