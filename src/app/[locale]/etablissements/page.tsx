'use client'

import { Suspense, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { filtersParsers } from './filter'
import EstablishmentList from '@/components/establishments/EstablishmentList'
import Loading from '@/components/Loading'
import {  useQuery } from '@tanstack/react-query'
import { DataEtabs } from '@/app/api/etablissement/getall/route'
const LIMIT = 9;
export default function EstablishmentsPage() {
  const [offset, setOffset] = useState(0);


const { data = [], isLoading, error: erroretab } = useQuery({
  queryKey: ['etablissements', LIMIT, offset],
  queryFn: async (): Promise<DataEtabs> => {
    const res = await fetch(`/api/etablissement/getall?limit=${LIMIT + 1}&offset=${offset}`);
    if (!res.ok) throw new Error(`Erreur: ${res.status}`);
    return res.json();
  },
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  retry: 1,
});

const hasNext = data.length > LIMIT;
const etablissements = hasNext ? data.slice(0, LIMIT) : data;
const hasPrev = offset > 0;

const goNext = () => {
  if (hasNext) setOffset((o) => o + LIMIT);
};

const goPrev = () => {
  setOffset((o) => Math.max(0, o - LIMIT));
};
  
  /* ---------- 1. LECTURE / ECRITURE SYNC AVEC L'URL ---------- */
  const [filters, setFilters] = useQueryStates(filtersParsers, {
    shallow: true,      // pas de rechargement page
    history: 'push'     // bouton retour fonctionne
  })


  

  


 

  /* ---------- 4. AFFICHAGE PRINCIPAL ---------- */
  return (
    
      

      <div className="mt-6">
        <Suspense fallback={<Loading />}>
          <EstablishmentList etablissements={etablissements} isLoading={isLoading}  offset={offset} hasNext={hasNext} hasPrev={hasPrev} goNext={goNext} goPrev={goPrev} />
        </Suspense>
      </div>
  )
}