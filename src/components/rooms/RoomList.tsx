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
            // Utilisation de bg-theme-card pour le fond de la carte
            className="group flex flex-col bg-theme-card border border-theme-base/20 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full backdrop-blur-sm"
          >
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
              <img
                src={coverImage || '/placeholder-room.jpg'}
                alt={room.nom || undefined}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-main/60 via-transparent to-transparent opacity-60" />

              {/* Price Badge - avec fond thème */}
              <div className="absolute bottom-3 right-3 bg-theme-btn/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                <span className="text-base sm:text-lg font-bold text-theme-base">
                  <TransletText>{room.prix.toFixed(0)}</TransletText>€
                </span>
                <span className="text-xs text-theme-base ml-1">/<TransletText>nuit</TransletText></span>
              </div>

              {/* Capacity Badge - avec texte thème */}
              <div className="absolute top-3 left-3 bg-theme-card/40 backdrop-blur-md text-theme-main text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-theme-base/20">
                <UserGroupIcon className="w-3 h-3" />
               {room.capacite} <TransletText>Personnes</TransletText>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-theme-main mb-1 group-hover:text-theme-btn transition-colors">
                  <TransletText>{room.nom}</TransletText>
                </h3>
                <p className="text-theme-main/80 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  <TransletText>{room.description}</TransletText>
                </p>
              </div>

              {/* Services Tags - avec fond thème */}
              {room.services && room.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {room.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-theme-base/10 text-theme-main text-xs font-medium rounded-md border border-theme-base/20"
                    >
                      {getServiceIcon(service)}
                      <TransletText>{service}</TransletText>
                    </span>
                  ))}
                  {room.services.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-theme-base/10 text-theme-main text-xs font-medium rounded-md border border-theme-base/20">
                      +{room.services.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-auto pt-4 border-t border-theme-base/10 flex items-center gap-2">
                <Link
                  href={`/${locale}/reservation/${room.id}`}
                  // Bouton principal avec fond thème
                  className="flex-1 bg-theme-btn text-theme-base text-center py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-lg"
                >
                  <TransletText>Réserver maintenant</TransletText>
                </Link>
                <Link
                  href={`/${locale}/reservation/${room.id}`}
                  // Bouton secondaire avec fond thème
                  className="px-3 py-2.5 bg-theme-base/10 text-theme-main rounded-lg hover:bg-theme-base/20 transition-colors border border-theme-base/20 group/btn"
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