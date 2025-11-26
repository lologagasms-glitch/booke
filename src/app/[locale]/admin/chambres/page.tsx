import { auth } from "@/app/lib/auth";
import ChambreByEtab from "@/components/admin/chambreByEtab";
import { Params } from "next/dist/server/request/params";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Chambres({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
   if(!session) {return redirect(`/${locale}/signin`);}
    if (session?.user?.role?.toLowerCase() !== "admin") {
      redirect(`/${locale}/profile`);
    }
  return (
    <div>
      <ChambreByEtab/>
    </div>
  );
}