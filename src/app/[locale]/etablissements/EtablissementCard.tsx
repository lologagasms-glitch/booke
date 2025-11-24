import { EtablissementWithRooms } from "@/types/combineType"

// components/etablissements/EtablissementCard.tsx
export default function EtablissementCard({ etablissement }: { etablissement: EtablissementWithRooms }) {
  const mainImg = etablissement.medias?.find((m) => m.type === 'image')?.url

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3">
      {/* Image */}
      {mainImg && (
        <img src={mainImg} alt={etablissement.nom ?? ''} className="w-full h-40 object-cover rounded" />
      )}

      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{etablissement.nom ?? 'Sans nom'}</h3>
        <p className="text-sm text-gray-600">
          {etablissement.ville}, {etablissement.pays}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < (etablissement.etoiles ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 line-clamp-3">{etablissement.description ?? ''}</p>

      {/* Services */}
      <div className="flex flex-wrap gap-2">
        {etablissement.services?.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">
            {s}
          </span>
        ))}
      </div>

      {/* Chambres */}
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Chambres disponibles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {etablissement.chambres?.slice(0, 4).map((chambre) => (
            <div key={chambre.id} className="border rounded p-2 bg-gray-50">
              <p className="text-xs font-medium text-gray-900">{chambre.nom ?? 'Chambre'}</p>
              <p className="text-xs text-gray-600">{chambre.capacite} personnes</p>
              <p className="text-xs text-gray-800 font-semibold">{chambre.prix} € / nuit</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${i < (etablissement.etoiles ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Voir
        </button>
      </div>
    </div>
  )
}