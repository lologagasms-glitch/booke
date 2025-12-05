'use client';

import { TransletText } from '@/app/lib/services/translation/transletText';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import {
  UserGroupIcon,
  WifiIcon,
  TvIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

type ChambreWithMedia = {
  id: string;
  createdAt: Date;
  nom: string;
  description: string;
  type: string;
  services: string[] | null;
  etablissementId: string;
  prix: number;
  capacite: number;
  disponible: boolean;
  medias: {
    id: string;
    createdAt: Date;
    type: "image" | "video";
    url: string;
    filename: string;
    chambreId: string;
  }[]
}

const RoomList: FC<{ rooms: ChambreWithMedia[] }> = ({ rooms }) => {
  const { locale } = useParams();

  // Helper to get icon for service (simplified mapping)
  const getServiceIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes('wifi') || s.includes('internet')) return <WifiIcon className="w-4 h-4" />;
    if (s.includes('tv') || s.includes('télé')) return <TvIcon className="w-4 h-4" />;
    return <SparklesIcon className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        if (!room.disponible) return null;
        const coverImage = room.medias?.find((m) => m.type === 'image')?.url;

        return (
          <div
            key={room.id}
            className="group flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full"
          >
            {/* Image Section - Responsive Height */}
            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
              <img
                src={coverImage || '/placeholder-room.jpg'}
                alt={room.nom || undefined}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Price Badge */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                <span className="text-base sm:text-lg font-bold text-black">
                  <TransletText>{room.prix.toFixed(0)}</TransletText>€
                </span>
                <span className="text-xs text-black ml-1">/<TransletText>nuit</TransletText></span>
              </div>

              {/* Capacity Badge */}
              <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-white/20">
                <UserGroupIcon className="w-3 h-3" />
               {room.capacite} <TransletText> Personnes</TransletText>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-1 group-hover:text-blue-600 transition-colors">
                  <TransletText>{room.nom}</TransletText>
                </h3>
                <p className="text-black text-xs sm:text-sm leading-relaxed line-clamp-2">
                  <TransletText>{room.description}</TransletText>
                </p>
              </div>

              {/* Services Tags */}
              {room.services && room.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {room.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-black text-xs font-medium rounded-md border border-gray-100"
                    >
                      {getServiceIcon(service)}
                      <TransletText>{service}</TransletText>
                    </span>
                  ))}
                  {room.services.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-black text-xs font-medium rounded-md">
                      +{room.services.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2">
                <Link
                  href={`/${locale}/reservation/${room.id}`}
                  className="flex-1 bg-gray-900 text-white text-center py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                >
                  <TransletText>Réserver maintenant</TransletText>
                </Link>
                <Link
                  href={`/${locale}/reservation/${room.id}`}
                  className="px-3 py-2.5 bg-gray-50 text-black rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors border border-gray-200 group/btn"
                >
                  <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
