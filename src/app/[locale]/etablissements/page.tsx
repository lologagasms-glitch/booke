'use client'

import { Suspense, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { filtersParsers } from './filter'
import EstablishmentList from '@/components/establishments/EstablishmentList'
import Loading from '@/components/Loading'
import {  useQuery } from '@tanstack/react-query'
import { DataEtabs } from '@/app/api/etablissement/getall/route'
const LIMIT = 10;
export default function EstablishmentsPage() {
  const [offset, setOffset] = useState(0);
   const { data: etablissements = [], isLoading, error:erroretab } = useQuery({
    queryKey: ['etablissements', LIMIT, offset],
    queryFn: async (): Promise<DataEtabs> => {
      const res = await fetch(`/api/etablissement/getall?limit=${LIMIT}&offset=${offset}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText} – ${errorText}`);
      }
      return res.json();
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
   const hasNext = etablissements.length === LIMIT;
    const hasPrev = offset > 0;
  
    const goNext = () => setOffset((o) => o + LIMIT);
    const goPrev = () => setOffset((o) => Math.max(0, o - LIMIT));
  
  /* ---------- 1. LECTURE / ECRITURE SYNC AVEC L'URL ---------- */
  const [filters, setFilters] = useQueryStates(filtersParsers, {
    shallow: true,      // pas de rechargement page
    history: 'push'     // bouton retour fonctionne
  })


  

  


 

  /* ---------- 4. AFFICHAGE PRINCIPAL ---------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


    
      

      {/* Liste des établissements */}
      <div className="mt-6">
        <Suspense fallback={<Loading />}>
          <EstablishmentList etablissements={etablissements} isLoading={isLoading} error={erroretab} offset={offset} hasNext={hasNext} hasPrev={hasPrev} goNext={goNext} goPrev={goPrev} />
        </Suspense>
      </div>
    </div>
  )
}