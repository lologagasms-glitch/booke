'use client'

import { Suspense, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { filtersParsers } from './filter'
import EstablishmentList from '@/components/establishments/EstablishmentList'
import FilterSidebar from '@/components/establishments/FilterSidebar'
import SearchBar from '@/components/establishments/SearchBar'
import Loading from '@/components/Loading'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { searchGlobal } from '@/app/lib/services/etablissement.service'
import ChambreCardSearch from '@/components/rooms/chambreSearchCard'
import EstablishmentSearchCard from '@/components/establishments/etablissentSearchCard'
import { DataEtabs } from '@/app/api/etablissement/getall/route'
const LIMIT = 10;
export default function EstablishmentsPage() {
  const [open, setOpen] = useState(false)
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


  const { mutate, data:searchData, isPending, error ,isSuccess} = useMutation({
   
    mutationFn: (params: typeof filters) => searchGlobal(params)
  })

  
  const handleSearch = async ()=>{
    await mutate(filters)
  }
if (isSuccess) {
  console.log(searchData)
}
  /* ---------- 3. AFFICHAGE DES CHAMBRES ---------- */
  if (searchData?.results?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {searchData.results.map((etablissementOrChambre) => (
            etablissementOrChambre.kind === "chambre" ? (
              
              <Suspense fallback={ <Loading/>} >
                <ChambreCardSearch key={etablissementOrChambre.id} data={etablissementOrChambre} />
              </Suspense>
            ) : (
              <Suspense fallback={ <Loading/>} >
              <EstablishmentSearchCard key={etablissementOrChambre.id} data={etablissementOrChambre} />
              </Suspense>
            )
          ))}
      </div>
    )
  }

  /* ---------- 4. AFFICHAGE PRINCIPAL ---------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <SearchBar setFilters={setFilters} isPending={isPending} handleSearch={handleSearch} />

      {/* Bouton Filtres en haut */}
      <div className="mt-6">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-white shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          Filtres
        </button>
      </div>

      <FilterSidebar
        filters={filters}
        isOpen={open}
        onClose={() => setOpen(false)}
        setFilters={setFilters}
        handleSearch={handleSearch}
      />

      {/* Liste des établissements */}
      <div className="mt-6">
        <Suspense fallback={<Loading />}>
          <EstablishmentList etablissements={etablissements} isLoading={isLoading} error={erroretab} offset={offset} hasNext={hasNext} hasPrev={hasPrev} goNext={goNext} goPrev={goPrev} />
        </Suspense>
      </div>
    </div>
  )
}