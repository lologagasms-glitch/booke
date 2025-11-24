// app/admin/etablissements/[id]/edit/page.tsx

'use client';

import { useParams, notFound } from 'next/navigation';
import UpdateEstablishmentForm from '@/components/admin/EstablishmentFormEdit';

export default function EditEtablissementPage() {
  const { id } = useParams() as { id: string };

  


  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="font-display text-3xl text-gray-800 mb-8">Modifier l’établissement</h1>
      <UpdateEstablishmentForm id={id} />
    </main>
  );
}