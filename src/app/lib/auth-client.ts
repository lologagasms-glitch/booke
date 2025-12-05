import { adminClient, anonymousClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",

  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    organizationClient() ,
    anonymousClient(),

  ]
});
export const { signIn, signUp, changeEmail, changePassword, getSession, signOut, useSession } = authClient;

