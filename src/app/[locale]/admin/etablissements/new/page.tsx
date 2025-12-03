
import { auth } from '@/app/lib/auth';
import EstablishmentForm from '@/components/admin/EstablishmentForm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NewEstablishmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
const session=await auth.api.getSession({ headers: await headers() });
if (!session) return redirect(`/${locale}/signin`);
if (session.user?.role?.toLowerCase() !== "admin") return redirect(`/${locale}/profile`);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un établissement</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <EstablishmentForm />
      </div>
    </div>
  );
}