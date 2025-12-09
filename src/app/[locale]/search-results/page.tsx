'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { StarIcon, MapPinIcon, HomeIcon, UsersIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Link from 'next/link'
import { TransletText } from '@/app/lib/services/translation/transletText'

type Media = { 
  id: string; 
  url: string; 
  type: 'image' | 'video'; 
  filename: string; 
  etablissementId?: string; 
  chambreId?: string; 
  createdAt?: Date 
}

type Chambre = { 
  id: string; 
  nom: string; 
  description: string; 
  prix: number; 
  capacite: number; 
  disponible: boolean; 
  type: string; 
  etablissementId: string; 
  medias: Media[] 
}

type Etablissement = { 
  id: string; 
  nom: string; 
  description: string; 
  ville: string; 
  pays: string; 
  type: string; 
  etoiles: number | null; 
  contact: { 
    telephone: string; 
    email: string; 
    siteWeb?: string 
  }; 
  services: string[]; 
  medias: Media[]; 
  chambres: Chambre[] 
}

// Types pour les résultats de jointure
type MediaEtablissement = Media & Required<Pick<Media, 'createdAt' | 'etablissementId'>> & {
  chambreId?: never;
}

type MediaChambre = Media & Required<Pick<Media, 'createdAt' | 'chambreId'>> & {
  etablissementId?: never;
}

type ChambreJointure = Omit<Chambre, 'medias'> & {
  createdAt: Date;
  services: string[] | null;
  medias: MediaChambre[];
}

type EtablissementComplet = Omit<Etablissement, 'medias' | 'chambres' | 'type'> & {
  userId: string;
  adresse: string;
  longitude: string;
  latitude: string;
  type: "hotel" | "auberge" | "villa" | "residence" | "autre";
  createdAt: Date;
  medias: MediaEtablissement[];
  chambres: ChambreJointure[];
}

type Data = EtablissementComplet[];

// Composant pour l'image avec skeleton
const CardImage = ({ src, alt, className }: { src?: string; alt: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <HomeIcon className="w-12 h-12" />
        </div>
      )}
    </div>
  )
}

export default function Page() {
  const sp = useSearchParams()
  const qs = sp.toString()
  const {locale}=useParams()
  const { data, isLoading, isError } = useQuery<Data>({
    queryKey: ['search-results', qs],
    queryFn: async () => {
      const res = await fetch(`/api/search?${qs}`)
      if (!res.ok) throw new Error('failed')
      return res.json()
    },
  })

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-2xl shadow-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2"><TransletText>Erreur de chargement</TransletText></h2>
        <p className="text-gray-600"><TransletText>Impossible de charger les résultats de recherche</TransletText></p>
      </div>
    </div>
  )

  if (!data || data.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="text-gray-400 text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2"><TransletText>Aucun résultat</TransletText></h2>
        <p className="text-gray-600"><TransletText>Essayez d'ajuster vos critères de recherche</TransletText></p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🏨 <TransletText>Résultats de recherche</TransletText></h1>
          <p className="text-blue-100">{data.length} <TransletText>établissement</TransletText>{data.length > 1 ? 's' : ''} <TransletText>trouvé</TransletText></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 gap-8">
          {data.map((etablissement) => (
            
            <div 
              key={etablissement.id} 
              className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Link href={`/${locale}/etablissements/${etablissement.id}`} key={etablissement.id}>
              {/* Section Établissement */}
              <div className="relative">
                {/* Image principale de l'établissement */}
                <div className="h-64 md:h-80 overflow-hidden">
                  <CardImage 
                    src={etablissement.medias[0]?.url} 
                    alt={etablissement.nom}
                    className="w-full h-full"
                  />
                </div>

                {/* Badge étoiles en position absolue */}
                {etablissement.etoiles && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    {etablissement.etoiles}
                  </div>
                )}

              
                {/* Overlay avec infos principales */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{etablissement.nom}</h2>
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{etablissement.ville}, {etablissement.pays}</span>
                  </div>
                </div>
              </div>

            </Link>
              {/* Section Chambres */}
              <div className="p-6 bg-gray-50">
                {/* En-tête section chambres avec animation */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-600 p-2 rounded-xl">
                      <HomeIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800"><TransletText>Chambres disponibles</TransletText></h3>
                    <span className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {etablissement.chambres.length}
                    </span>
                  </div>
                </div>

                {/* Grille des chambres */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {etablissement.chambres.map((chambre) => (
                    <div 
                      key={chambre.id} 
                      className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Images mini-carousel */}
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {chambre.medias.length > 0 ? (
                          chambre.medias.slice(0, 3).map((media, idx) => (
                            <div key={media.id} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                              <img 
                                src={media.url} 
                                alt={`${chambre.nom} - ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            <HomeIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Infos chambre */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg mb-1">{chambre.nom}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{chambre.description}</p>
                        </div>

                        {/* Spécifications */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm font-medium">
                            <SparklesIcon className="w-4 h-4" />
                            {chambre.type}
                          </div>
                          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-sm font-medium">
                            <UsersIcon className="w-4 h-4" />
                            {chambre.capacite} <TransletText>pers.</TransletText>
                          </div>
                        </div>

                        {/* Prix et bouton */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500"><TransletText>à partir de</TransletText></span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {chambre.prix}€
                            </span>
                            <span className="text-xs text-gray-500">/<TransletText>nuit</TransletText></span>
                          </div>
                          <Link href={`/${locale}/reservation/${chambre.id}`}>
                            
                          <button
                            
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg 
                                     font-semibold text-sm flex items-center gap-2 hover:shadow-lg transform transition-all 
                                     hover:scale-105"
                          >
                            <span><TransletText>Détails</TransletText></span>
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                          </Link>
                        </div>
                      </div>

                      {/* Badge disponibilité */}
                      <div className={`absolute top-1 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                        chambre.disponible 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {chambre.disponible ? <TransletText>DISPONIBLE</TransletText> : <TransletText>COMPLET</TransletText>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services de l'établissement */}
              {etablissement.services.length > 0 && (
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-blue-600" />
                    <TransletText>Services inclus</TransletText>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {etablissement.services.slice(0, 6).map((service, idx) => (
                      <span key={idx} className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {service}
                      </span>
                    ))}
                    {etablissement.services.length > 6 && (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                        +{etablissement.services.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}