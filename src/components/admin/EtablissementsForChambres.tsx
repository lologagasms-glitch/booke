'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  HomeModernIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getAllEtablissementsAction, deleteEtablissementAction } from '@/app/lib/services/actions/etablissements';
import { Etablissement } from '@/types';
import { getAllEtablissements } from '@/app/lib/services/etablissement.service';
import { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';

/* -------------------------------------------------- */
/*  Types                                             */
/* -------------------------------------------------- */

/* -------------------------------------------------- */
/*  StarStepProgress                                  */
/* -------------------------------------------------- */
function StarStepProgress({ 
  value, 
  onChange 
}: {
  value: number;
  onChange: (stars: number) => void;
}) {
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const clickedValue = Math.ceil((x / width) * 5);
    onChange(Math.max(1, Math.min(5, clickedValue)));
  };

  const handleStepClick = (starValue: number) => {
    onChange(starValue);
  };

  const progressPercent = (value / 5) * 100;

  return (
    <div className="w-full md:w-3/4 lg:w-1/2">
      <div className="relative px-2 sm:px-4">
        {/* Barre de fond grise */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0 rounded-full shadow-inner" />
        
        {/* Barre de progression colorée */}
        <div 
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 z-10 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        
        {/* Étapes */}
        <div className="relative flex justify-between items-start">
          {[
            { threshold: 1, name: '★ 1', smName: '★ 1 étoile' },
            { threshold: 2, name: '★★ 2', smName: '★★ 2 étoiles' },
            { threshold: 3, name: '★★★ 3', smName: '★★★ 3 étoiles' },
            { threshold: 4, name: '★★★★ 4', smName: '★★★★ 4 étoiles' },
            { threshold: 5, name: '★★★★★ 5', smName: '★★★★★ 5 étoiles' }
          ].map((step) => {
            const isCompleted = step.threshold <= value;
            const isActive = step.threshold === value;
            
            return (
              <div 
                key={step.threshold}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => handleStepClick(step.threshold)}
              >
                {/* Cercle de l'étape */}
                <div className={clsx(
                  "relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-md border-2",
                  isActive 
                    ? 'scale-110 border-white bg-gradient-to-br from-amber-600 to-yellow-500 animate-pulse' 
                    : isCompleted 
                      ? 'border-white bg-gradient-to-br from-amber-500 to-yellow-400' 
                      : 'border-gray-300 bg-white group-hover:border-amber-400'
                )}>
                  {/* Icône étoile */}
                  <span className={clsx(
                    "text-sm sm:text-lg transition-all",
                    isActive || isCompleted ? 'text-white drop-shadow' : 'text-gray-400 group-hover:text-amber-500'
                  )}>
                    {isCompleted ? '⭐' : '☆'}
                  </span>
                </div>
                
                {/* Label sous le cercle */}
                <span className={clsx(
                  "text-xs sm:text-sm font-medium text-center transition-colors max-w-16 sm:max-w-20",
                  isActive ? 'text-amber-900 font-bold' : isCompleted ? 'text-amber-700' : 'text-gray-500 group-hover:text-amber-600'
                )}>
                  <span className="hidden sm:inline">{step.smName}</span>
                  <span className="sm:hidden">{step.name}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/*  Page Liste Admin                                  */
/* -------------------------------------------------- */
export default function EstablishmentsForChambres() {
  const queryClient = useQueryClient();
  const {locale} = useParams<{ locale: string }>();
  /* ---- Pagination ---- */
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  /* ---- React-Query ---- */
  const { data: etablissements = [], isLoading } = useQuery({
    queryKey: ['etablissements', limit, offset],
    queryFn: async () => {
      const res = await getAllEtablissements(limit, offset);
      if (!res) throw new Error('Failed to fetch');
      return res ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEtablissementAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['etablissements'] }),
  });
  /* ---- Filtres ---- */
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filtered = useMemo(() => {
    return (Array.isArray(etablissements) ? etablissements : etablissements).filter((e) => {
      const matchSearch =
        e.etablissements.nom.toLowerCase().includes(search.toLowerCase()) ||
         e.etablissements.ville.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter ?  e.etablissements.type === typeFilter : true;
      return matchSearch && matchType;
    });
  }, [etablissements, search, typeFilter]);

  /* ---- UI helpers ---- */
  const typeOptions = [...new Set((Array.isArray(etablissements) ? etablissements : etablissements).map((e) =>  e.etablissements.type))];

  if (isLoading)
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-sand-50">
    

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Barre de filtres */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou ville…"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-300 bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-sand-300 bg-white appearance-none focus:outline-none focus:border-blue-500"
            >
              <option value="">Tous les types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => (
            <Card
              locale={locale}
              key={ e.etablissements.id}
              etablissement={{ ... e.etablissements, etoiles:  e.etablissements.etoiles ?? 0 ,firstImage:e.firstImageUrl}}
              onDelete={() => {
                if (confirm(`Supprimer « ${ e.etablissements.nom} » ?`)) deleteMutation.mutate({ id:  e.etablissements.id });
              }}
            />
          ))}
        </div>

        {!filtered.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun établissement ne correspond aux filtres.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setOffset((o) => Math.max(o - limit, 0))}
            disabled={offset === 0}
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sand-300 bg-white text-gray-700 hover:bg-sand-50 transition',
              offset === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Précédent
          </button>
          <button
            onClick={() => setOffset((o) => o + limit)}
            disabled={filtered.length < limit}
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sand-300 bg-white text-gray-700 hover:bg-sand-50 transition',
              filtered.length < limit && 'opacity-50 cursor-not-allowed'
            )}
          >
            Suivant
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------- */
/*  Carte individuelle                                */
/* -------------------------------------------------- */

function Card({ etablissement, onDelete ,locale}: { etablissement: Etablissement & { firstImage?: string|null }; onDelete: () => void ;locale:string}) {
  
  const { id, nom, type, ville, pays, etoiles, firstImage } = etablissement;
  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Image */}
      {firstImage && (
        <div className="relative w-full h-48">
          <Image
            src={firstImage}
            alt={nom}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-display text-xl text-gray-800">{nom}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {ville}, {pays}
        </p>
        <p className="text-xs text-gray-500 mt-2 capitalize">{type}</p>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/${locale}/admin/etablissements/${id}/chambres/new`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-blue-700 text-white text-sm hover:bg-blue-800 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Créer une chambre
          </Link>
         
        </div>
      </div>
    </div>
  );
}