'use client';

import { notFound, useParams } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import RoomList from '@/components/rooms/RoomList';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { EtabAndContentsType } from '@/app/api/etablissement/getById/route';
import MediaGallery from '@/components/rooms/mediasGallerie';
import { TransletText } from '@/app/lib/services/translation/transletText';

export default function EstablishmentPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: establishment, isLoading, error } = useQuery({
    queryKey: ['etablissement', id],
    queryFn: async (): Promise<EtabAndContentsType> => {
      const response = await fetch(`/api/etablissement/getById?id=${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: !!id,
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 gap-4">
              <div className="h-44 bg-gray-200 rounded-lg"></div>
              <div className="h-44 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !establishment) {
    notFound();
  }
  const media = establishment.medias.find((media) => media.type === 'image')
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700"><TransletText>{establishment.nom}</TransletText></h1>

        <div className="flex items-center mb-4">
          <div className="flex mr-4">
            {Array.from({ length: establishment.etoiles || 0 }).map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
            ))}
          </div>

          <div className="flex items-center text-white">
            <MapPinIcon className="h-5 w-5 mr-1" />
            <span><TransletText>{establishment.adresse}, {establishment.ville}, {establishment.pays}</TransletText></span>
            <Link
              href={`/fr/etablissements/${id}/localiser?lat=${establishment.latitude}&lng=${establishment.longitude}`}
              className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            >
              <TransletText>Voir la localisation</TransletText>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <MediaGallery medias={establishment.medias} />
      </div>

      <div className="">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700"><TransletText>À propos de cet établissement</TransletText></h2>
            <p className="text-black mb-6"><TransletText>{establishment.description}</TransletText></p>

            <h3 className="text-lg font-semibold mb-3 text-blue-700"><TransletText>Services et équipements</TransletText></h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {establishment.services.map((service, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-blue-700 rounded-full mr-2"></div>
                  <span className="text-black"><TransletText>{service}</TransletText></span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-3 text-blue-700"><TransletText>Informations de contact</TransletText></h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-black"><TransletText>{establishment.contact.telephone}</TransletText></span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-black"><TransletText>{establishment.contact.email}</TransletText></span>
              </div>
              {establishment.contact.siteWeb && (
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <a
                    href={`https://${establishment.contact.siteWeb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    <TransletText>{establishment.contact.siteWeb}</TransletText>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Room List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700"><TransletText>Chambres disponibles</TransletText></h2>
            <RoomList rooms={establishment.chambres} />

          </div>
        </div>


      </div>
    </div>
  );
}
