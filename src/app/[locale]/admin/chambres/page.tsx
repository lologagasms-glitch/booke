import { auth } from "@/app/lib/auth";
import ChambreByEtab from "@/components/admin/chambreByEtab";
import { Params } from "next/dist/server/request/params";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Chambres({ params }: { params: Params }) {
  const session = await auth.api.getSession({ headers: await headers() });
   if(!session) {return redirect(`/${params.locale}/signin`);}
    if (!(session?.user?.role !== "admin")) {
      redirect(`/${params.locale}/profile`);
    }
  return (
    <div>
      <ChambreByEtab/>
    </div>
  );
}