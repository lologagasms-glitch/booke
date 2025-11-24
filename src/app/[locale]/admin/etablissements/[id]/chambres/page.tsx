import { redirect } from 'next/navigation';
import Link from 'next/link';
import RoomTable from '@/components/admin/RoomTable';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export default async function AdminRoomsPage({ params }: { params: { id: string } }) {
  // Check if user is authenticated and is an admin
  const session = await auth.api.getSession({headers: await headers()});
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des chambres</h1>
        <Link 
          href={`/admin/etablissements/${params.id}/chambres/new`} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Ajouter une chambre
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <RoomTable etablissementId={params.id} />
      </div>
    </div>
  );
}