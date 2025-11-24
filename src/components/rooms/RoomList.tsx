'use client';

import { TransletText } from '@/app/lib/services/translation/transletText';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import  { FC } from 'react';

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

const Star: FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const RoomList: FC<{ rooms:ChambreWithMedia[] }> = ({ rooms }) => {
  const {locale}=useParams();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {rooms.map((room) => {
        if(!room.disponible) return null;
        const coverImage = room.medias?.find((m) => m.type === 'image')?.url;
        const stars = 5; // default 5-star rating

        return (
          <div
            key={room.id}
            className="group relative bg-white/60 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
          >
            {/* Image avec effet zoom */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={coverImage || '/placeholder-room.jpg'}
                alt={room.nom || undefined}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Badge capacité */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                {room.capacite} pers.
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                {room.nom}
              </h3>

            
              <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                {<TransletText>{room.description}</TransletText>}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-yellow-700">
                    {<TransletText>{room.prix.toFixed(2)}</TransletText>} €
                  </span>
                  <span className="text-xs text-gray-500 block">par nuit</span>
                </div>

                <Link
                  className="px-3 py-1.5 bg-yellow-400 cursor-pointer text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition-colors text-xs"
                  href={`/${locale}/reservation/${room.id}`}
                >
                  Réserver
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
