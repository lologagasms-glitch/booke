import { auth } from '@/app/lib/auth';
import CreateRoomForm from '@/components/admin/CreateRommForm';
import { headers } from 'next/headers';
interface NewRoomPageProps {
  params: Promise<{ id: string; locale: string }>;
}
export default async function NewRoomPage({
  params,
}: {
  params: NewRoomPageProps['params'];
}) {
  const { id } = await params;
  console.log(id);
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter une nouvelle chambre</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <CreateRoomForm etablissementId={id} /> 
      </div>
    </div>
  );
}