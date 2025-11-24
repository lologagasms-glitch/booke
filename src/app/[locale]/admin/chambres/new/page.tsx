import { auth } from "@/app/lib/auth";
import EstablishmentsForChambres from "@/components/admin/EtablissementsForChambres";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewRoomPage({ params }: { params: { locale: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
   if(!session) {return redirect(`/${params.locale}/signin`);}
    if (!(session?.user?.role !== "admin")) {
      redirect(`/${params.locale}/profile`);
    }
  return (
   <EstablishmentsForChambres />
  );
}