'use client'

import { Suspense, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { filtersParsers } from './filter'
import EstablishmentList from '@/components/establishments/EstablishmentList'
import FilterSidebar from '@/components/establishments/FilterSidebar'
import SearchBar from '@/components/establishments/SearchBar'
import Loading from '@/components/Loading'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import { searchGlobal } from '@/app/lib/services/etablissement.service'
import ChambreCardSearch from '@/components/rooms/chambreSearchCard'
import EstablishmentSearchCard from '@/components/establishments/etablissentSearchCard'

export default function EstablishmentsPage() {
  const [open, setOpen] = useState(false)
  
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
              <ChambreCardSearch key={etablissementOrChambre.id} data={etablissementOrChambre} />
            ) : (
              <EstablishmentSearchCard key={etablissementOrChambre.id} data={etablissementOrChambre} />
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
          <EstablishmentList />
        </Suspense>
      </div>
    </div>
  )
}