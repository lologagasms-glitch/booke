// app/lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action";        // ton helper Better-Auth
import { headers } from "next/headers";
import { auth } from "./auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // message générique côté client
    return "Une erreur serveur est survenue.";
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Non autorisé");
  return next({ ctx: { userId: session.user.id } });
});