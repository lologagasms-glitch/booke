'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllChambreById } from "@/app/lib/services/chambre.service";
import clsx from 'clsx';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';

const LIMIT = 3;

// Icônes SVG inline (remplace Font Awesome)
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    error: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    empty: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    trash: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  };
  
  return icons[name] || null;
};

export default function ChambreByEtabId({ etablissementId }: { etablissementId: string }) {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const {locale}=useParams();
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    data: chambres,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['chambres', etablissementId, LIMIT, offset],
    queryFn: () => getAllChambreById(etablissementId, LIMIT, offset),
  });

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - LIMIT, 0));
  };

  const handleNext = () => {
    setOffset((prev) => prev + LIMIT);
  };

  // Skeleton loader hyper-responsive
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-40 sm:h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 sm:p-5 space-y-3">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État erreur
  if (isError) {
    return (
      <div className="py-8 sm:py-12 text-center px-4">
        <Icon name="error" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-red-400 mb-3" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Erreur de chargement</h3>
        <p className="text-xs sm:text-sm text-gray-500">Impossible de récupérer les chambres</p>
      </div>
    );
  }

  // État vide
  if (!isSuccess || !chambres?.length) {
    return (
      <div className="py-8 sm:py-12 text-center px-4">
        <Icon name="empty" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Aucune chambre disponible</h3>
        <p className="text-xs sm:text-sm text-gray-500">Cet établissement ne propose pas encore de chambres</p>
      </div>
    );
  }

  const hasPrevious = offset > 0;
  const hasNext = chambres.length === LIMIT;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Nos chambres</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Une sélection de chambres pour votre confort</p>
      </div>

      {/* Grille des chambres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {chambres.map((item, index) => (
          <div
            key={item.chambre.id}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Image avec fallback */}
            <div className="aspect-w-16 aspect-h-10 bg-gray-100">
              {item.firstMedia ? (
                <img
                  src={item.firstMedia || ''}
                  alt={item.chambre.nom}
                  className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-gray-50">
                  <div className="text-gray-400">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                  {item.chambre.nom}
                </h3>
                <span className="ml-2 sm:ml-3 shrink-0 inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-100 text-amber-800">
                  €{item.chambre.prix || 150}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                {item.chambre.description || "Chambre confortable avec équipements modernes."}
              </p>

              {/* Footer avec infos */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {item.chambre.capacite || 2} pers.
                </div>

                {/* Étoiles */}
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Boutons Modifier / Supprimer */}
              <div className="mt-3 sm:mt-4 flex items-center justify-end space-x-2">
                <Link
                  href={`/${locale?.toString()}/admin/etablissements/${etablissementId}/chambres/${item.chambre.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Icon name="edit" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Modifier
                </Link>
                <button
                  onClick={() => alert(`Supprimer la chambre ${item.chambre.nom}`)}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Icon name="trash" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {chambres.length > 0 && (
        <div className={clsx(
          "flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200",
          isMobile && "flex-col space-y-3"
        )}>
          <div className="text-xs sm:text-sm text-gray-500">
            Affichage de {offset + 1} à {offset + chambres.length} résultats
          </div>

          <div className={clsx(
            "flex items-center",
            isMobile ? "w-full justify-between" : "space-x-3"
          )}>
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={clsx(
                "inline-flex items-center px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200",
                hasPrevious 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-400 cursor-not-allowed opacity-50"
              )}
            >
              <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {isMobile ? "" : "Précédent"}
            </button>

            {!isMobile && <div className="h-6 w-px bg-gray-200"></div>}

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={clsx(
                "inline-flex items-center px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200",
                hasNext 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-400 cursor-not-allowed opacity-50"
              )}
            >
              {isMobile ? "" : "Suivant"}
              <svg className="w-4 h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}