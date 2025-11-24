'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllEtablissementsOnlyNameAndId } from '@/app/lib/services/etablissement.service';
import ChambreByEtabId from './chambreByEtabId';
import clsx from 'clsx';

const Limit = 10;

export default function ChambreByEtab() {
  const [offset, setOffset] = useState(0);

  const {
    data: etablissements,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['etablissementIdAndName', offset],
    queryFn: () => getAllEtablissementsOnlyNameAndId(Limit, offset),
  });

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - Limit, 0));
  };

  const handleNext = () => {
    setOffset((prev) => prev + Limit);
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
          <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
        <p className="text-gray-500">Impossible de récupérer la liste des établissements</p>
      </div>
    );
  }

  if (!isSuccess || !etablissements?.length) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun établissement</h3>
        <p className="text-gray-500">Aucun établissement n'a été trouvé</p>
      </div>
    );
  }

  const hasPrevious = offset > 0;
  const hasNext = etablissements.length === Limit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Explorer nos établissements
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez une sélection d'établissements soigneusement choisis pour vous
        </p>
      </div>

      {/* Grille des établissements */}
      <div className="mb-16">
        <div className="grid gap-6 md:gap-8 grid-cols-1">
          {etablissements.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animation: `slide-up 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {item.nom}
                </h2>
              </div>
              <div className="p-5">
                <div className="text-gray-600">
                  <ChambreByEtabId etablissementId={item.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination moderne sans total */}
      <div className="flex flex-col items-center space-y-6">
        {/* Indicateur visuel simple */}
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="font-medium">Page {Math.floor(offset / Limit) + 1}</span>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <span className="text-gray-400">Navigation</span>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={clsx(
              "inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              hasPrevious 
                ? "bg-gray-900 text-white hover:bg-gray-800" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Précédent
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={clsx(
              "inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              hasNext 
                ? "bg-gray-900 text-white hover:bg-gray-800" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Suivant
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}