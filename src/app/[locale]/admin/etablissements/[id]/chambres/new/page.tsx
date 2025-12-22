import { auth } from "@/app/lib/auth";
import NewRoom from "@/components/admin/newChanbre";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewRoomPage({ params }: { params: Promise<{ locale: string,id:string }> }) {
  const { locale ,id} = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect(`/${locale}/signin`);
  if (session.user?.role?.toLowerCase() !== "admin") return redirect(`/${locale}/profile`);
  return <NewRoom etablissementId={id} />;
}