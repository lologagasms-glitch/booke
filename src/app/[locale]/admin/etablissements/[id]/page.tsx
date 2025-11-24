'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useSession } from '@/app/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { getEtablissementByIdAction } from '@/app/lib/services/actions/etablissements';
import { getEtablissementById } from '@/app/lib/services/etablissement.service';

export default function AdminEstablishmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: establishment, isLoading, error ,isSuccess} = useQuery({
    queryKey: ['etablissement', params.id],
    queryFn: async () => await getEtablissementById(params.id),
   
    enabled: session?.user?.role === 'ADMIN',
  });

  const handleDelete = async () => {
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to establishments list
      router.push('/admin/etablissements');
    } catch (error) {
      console.error('Error deleting establishment:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !establishment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Établissement non trouvé
        </div>
        <Link 
          href="/admin/etablissements"
          className="mt-4 inline-block text-blue-700 hover:text-blue-900"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Link 
              href="/admin/etablissements"
              className="text-blue-700 hover:text-blue-900 mr-2"
            >
              Établissements
            </Link>
            <span className="text-gray-500">/</span>
            <span className="ml-2">{establishment.nom}</span>
          </div>
          <h1 className="text-3xl font-bold">{establishment.nom}</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            href={`/admin/etablissements/${params.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Modifier
          </Link>
          <Link
            href={`/admin/etablissements/${params.id}/medias/new`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PhotoIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Ajouter média
          </Link>
          <Link
            href={`/admin/etablissements/${params.id}/chambres`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MapPinIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Chambres
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            Supprimer
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2">{establishment.type}</span>
                </div>
                
                <div>
                  <span className="text-gray-500">Adresse:</span>
                  <span className="ml-2">{establishment.adresse}, {establishment.ville}, {establishment.pays}</span>
                </div>
                
                <div>
                  <span className="text-gray-500">Étoiles:</span>
                  <div className="inline-flex ml-2">
                    {Array.from({ length: establishment.etoiles ?? 0 }).map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{establishment.contact.telephone}</span>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{establishment.contact.email}</span>
                </div>
                
                {establishment.contact.siteWeb && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{establishment.contact.siteWeb}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{establishment.description}</p>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {establishment.services.map((service: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-blue-700 rounded-full mr-2"></div>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chambres</h2>
          <Link
            href={`/admin/etablissements/${params.id}/rooms/new`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
            Ajouter une chambre
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {establishment.chambres.length > 0 ? (
                establishment.chambres.map((room: any) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacite} {room.capacite > 1 ? 'personnes' : 'personne'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.prix} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/etablissements/${params.id}/rooms/${room.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => console.log('Delete room:', room.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune chambre disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            href={`/admin/etablissements/${params.id}/rooms`}
            className="text-blue-700 hover:text-blue-900"
          >
            Voir toutes les chambres
          </Link>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer l'établissement "{establishment.nom}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}