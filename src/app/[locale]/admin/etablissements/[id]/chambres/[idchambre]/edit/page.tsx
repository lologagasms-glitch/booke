// app/admin/chambres/[id]/edit/page.tsx  (ou ton chemin)
import { redirect, notFound } from 'next/navigation';
import RoomForm from '@/components/admin/RoomForm';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';



export default async function EditRoomPage({ 
  params 
}: { 
  params: Promise<{ id: string; idchambre: string }> 
}) {
  const { id: etablissementId, idchambre } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Modifier la chambre</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <RoomForm etablissementId={etablissementId} id={idchambre} />
      </div>
    </div>
  );
}