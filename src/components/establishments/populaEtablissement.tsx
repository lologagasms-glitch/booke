'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPinIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

type DataEtabsPopularType = {
  mediaUrl: string | null;
  etablissementId: string;
  nom: string;
  ville: string;
  pays: string;
  etoiles: number | null;
  services: string[];
  prixMin: number | null;
  totalResa: number;
};

interface PopularEtablissementsProps {
  data?: DataEtabsPopularType[];
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  title?: string;
  subtitle?: string;
}

const SERVICE_COLORS = {
  wifi: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  parking: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  spa: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  piscine: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  restaurant: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  default: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating ? (
          <StarSolid key={star} className="w-4 h-4 text-yellow-500" />
        ) : (
          <StarOutline key={star} className="w-4 h-4 text-gray-300" />
        )
      ))}
      <span className="text-sm font-medium text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ServiceBadge({ service }: { service: string }) {
  const colors = SERVICE_COLORS[service as keyof typeof SERVICE_COLORS] || SERVICE_COLORS.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
      {service}
    </span>
  );
}

function EtablissementCard({ data }: { data: DataEtabsPopularType }) {
  const { locale } = useParams() as { locale: string };
  const formatReservations = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M+`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
    return `${count}+`;
  };

  return (
    <Link
      href={`/${locale}/etablissements/${data.etablissementId}`}
      className="group relative bg-theme-card rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden block"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {data.mediaUrl ? (
          <Image
            src={encodeURI(data.mediaUrl)}
            alt={data.nom}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {data.prixMin && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-sm font-bold text-gray-950">
              À partir de <span className="text-blue-600">{data.prixMin}€</span>
            </span>
          </div>
        )}
        
        {data.totalResa > 100 && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <StarSolid className="w-3 h-3 text-orange-500" />
            <span className="text-xs font-semibold text-gray-700">
              {formatReservations(data.totalResa)} réserv.
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-theme-main mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {data.nom}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="truncate">{data.ville}, {data.pays}</span>
          </div>
        </div>

        {data.etoiles && (
          <div className="mb-3">
            <StarRating rating={data.etoiles} />
          </div>
        )}

        {data.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.services.slice(0, 3).map((service) => (
              <ServiceBadge key={service} service={service} />
            ))}
            {data.services.length > 3 && (
              <span className="text-xs text-gray-500 self-center">+{data.services.length - 3}</span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"
                  style={{ zIndex: 3 - i }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {formatReservations(data.totalResa)} voyageurs
            </span>
          </div>
          
         
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-blue-500/20 transition-all duration-300 pointer-events-none" />
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ refetch }: { refetch?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center">
        <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oups, une erreur est survenue</h3>
        <p className="text-gray-600 mb-4">Impossible de charger les établissements populaires</p>
        <button
          onClick={refetch}
          className="bg-theme-btn text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export default function PopularEtablissements({ 
  data = [],
  isLoading = false,
  isError = false,
  refetch,
  title = "Nos établissements coup de cœur",
  subtitle = "Découvrez les lieux les plus réservés par nos voyageurs"
}: PopularEtablissementsProps) {
  // Si chargement
  if (isLoading) {
    return (
      <section className="py-16 sm:py-24 bg-theme-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-main mb-4">{title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  // Si erreur
  if (isError) {
    return (
      <section className="py-16 sm:py-24 bg-theme-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-main mb-4">{title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          <ErrorState refetch={refetch} />
        </div>
      </section>
    );
  }

  // Si pas de données
  if (!data || data.length === 0) {
    return (
      <section className="py-16 sm:py-24 bg-theme-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-main mb-4">{title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-500">Aucun établissement disponible pour le moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-theme-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-main mb-4">{title}</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {data.map((etablissement) => (
            <EtablissementCard 
              key={etablissement.etablissementId} 
              data={etablissement}
            />
          ))}
        </div>
      </div>
    </section>
  );
}