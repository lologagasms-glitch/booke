'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Chambre } from '@/types';
import { getAllChambreById } from '@/app/lib/services/chambre.service';

export default function MediaChambres({ etablissementId, locale }: { etablissementId: string; locale: string }) {

  /* ---- Pagination ---- */
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  /* ---- React-Query ---- */
  const { data: chambres = [], isLoading } = useQuery({
    queryKey: ['chambres', etablissementId, limit, offset],
    queryFn: async () => {
      const res = await getAllChambreById(etablissementId, limit, offset);
      if (!res) throw new Error('Failed to fetch');
      return res ?? [];
    },
  });

  /* ---- Filtres ---- */
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filtered = useMemo(() => {
    return (Array.isArray(chambres) ? chambres : chambres).filter((c) => {
      const matchSearch =
        c.chambre.nom.toLowerCase().includes(search.toLowerCase()) ||
        c.chambre.description?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter ? c.chambre.type === typeFilter : true;
      return matchSearch && matchType;
    });
  }, [chambres, search, typeFilter]);

  const typeOptions = [...new Set((Array.isArray(chambres) ? chambres : chambres).map((c) => c.chambre.type))];

  if (isLoading)
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhotoIcon className="w-8 h-8 text-blue-700" />
            <h1 className="font-display text-2xl text-gray-800">Chambres - Gestion des Médias</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou description…"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <ChambreCard key={c.chambre.id} chambre={{...c.chambre, firstImageUrl: c?.firstMedia || null}} locale={locale} />
          ))}
        </div>

        {!filtered.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune chambre ne correspond aux filtres.</p>
          </div>
        )}

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

function ChambreCard({ chambre, locale }: { chambre: Chambre & { firstImageUrl: string|null }; locale: string }) {
  const { id, nom, type, description, firstImageUrl } = chambre;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {firstImageUrl ? (
        <div className="relative w-full h-48">
          <Image src={firstImageUrl} alt={nom} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <PhotoIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-display text-xl text-gray-800">{nom}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 mt-2 capitalize">{type}</p>

        <div className="mt-6 flex justify-center">
          <a
            href={`/${locale}/admin/etablissements/${chambre.etablissementId}/chambres/${chambre.id}/medias/edit`}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full
                       bg-gradient-to-r from-purple-600 to-purple-700 
                       text-white text-sm font-medium 
                       hover:from-purple-700 hover:to-purple-800 
                       transition-all duration-300 shadow-md hover:shadow-lg
                       group/button"
          >
            <PhotoIcon className="w-5 h-5 transition-transform group-hover/button:scale-110" />
            Gérer médias
          </a>
        </div>
      </div>
    </div>
  );
}
