'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, TrashIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import { deleteChambre, getAllByEtablissement } from '@/app/lib/services/chambre.service';

export default function RoomTable({ etablissementId }: { etablissementId: string }) {
  const queryClient = useQueryClient();

  // Fetch rooms with proper query key including etablissementId
  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ['chambres', etablissementId],
    queryFn: () => getAllByEtablissement(etablissementId ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Deletion mutation with improved error handling
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChambre( id ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chambres', etablissementId] });
      // Consider using a toast notification library instead of alert
      alert('Chambre supprimée avec succès');
    },
    onError: (err: any) => {
      alert(`Erreur : ${err?.message || 'Problème serveur'}`);
    },
  });

  const rooms = result || [];

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Erreur lors du chargement des chambres</p>
        <p className="text-sm text-gray-600">{error?.message || 'Une erreur inattendue est survenue'}</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">Aucune chambre trouvée</p>
        <Link
          href={`/admin/etablissements/${etablissementId}/chambres/new`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Ajouter une chambre
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Top action bar */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <Link
          href={`/admin/etablissements/${etablissementId}/chambres/new`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nouvelle chambre
        </Link>
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'nom', label: 'Nom' },
                { key: 'etablissement', label: 'Établissement' },
                { key: 'type', label: 'Type' },
                { key: 'capacite', label: 'Capacité' },
                { key: 'prix', label: 'Prix' },
                { key: 'disponible', label: 'Disponibilité' },
                { key: 'actions', label: 'Actions' },
              ].map((h) => (
                <th
                  key={h.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{room.nom}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{room.nom}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 capitalize">{room.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {room.capacite} personne{room.capacite > 1 ? 's' : ''}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{room.prix.toFixed(2)} €</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      room.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {room.disponible ? 'Disponible' : 'Indisponible'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/admin/etablissements/${etablissementId}/chambres/${room.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                      aria-label={`Modifier la chambre ${room.nom}`}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/admin/etablissements/${etablissementId}/chambres/${room.id}/medias/new`}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      aria-label={`Ajouter des médias à la chambre ${room.nom}`}
                    >
                      <PhotoIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(room.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Supprimer la chambre ${room.nom}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}