import { auth } from "@/app/lib/auth";
import EstablishmentsForChambres from "@/components/admin/EtablissementsForChambres";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewRoomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect(`/${locale}/signin`);
  if (session.user?.role?.toLowerCase() !== "admin") return redirect(`/${locale}/profile`);
  return <EstablishmentsForChambres />;
}