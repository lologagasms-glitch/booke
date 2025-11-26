import { TransletText } from "../lib/services/translation/transletText";

export interface ChambreDTO {
  id: string;
  nom: string;
  type: string;
  capacite: number;
  prix: number;
  description: string;
  services?: string[] | null;
  disponible: boolean;
  etablissement: {
    id: string;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    etoiles?: number | null;
    description?: string;
    services?: string[] | null;
    contact: {
      email: string;
      telephone: string;
      siteWeb?: string;
    };
  };
}

export default function ChambreCard({ chambre }: { chambre: ChambreDTO }) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 md:p-5 bg-white shadow-sm space-y-3 sm:space-y-4">
      {/* Header: nom + prix */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{chambre.nom}</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {chambre.type} • {chambre.capacite} personne{chambre.capacite > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-xl sm:text-2xl font-bold text-indigo-600">{chambre.prix}&nbsp;€</p>
          <p className="text-xs text-gray-500"><TransletText> par nuit</TransletText></p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 break-words"><TransletText>{chambre.description}</TransletText></p>

      {/* Services chambre */}
      <div className="flex flex-wrap gap-2">
        {chambre.services?.map((s, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Établissement */}
      <div className="border-t pt-3 sm:pt-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{chambre.etablissement.nom}</h4>
        <p className="text-xs sm:text-sm text-gray-600">
          <TransletText>{chambre.etablissement.adresse}</TransletText>,{' '}
          <TransletText>{chambre.etablissement.ville}</TransletText>,{' '}
          <TransletText>{chambre.etablissement.pays}</TransletText>
        </p>

        {/* Étoiles */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                i < (chambre.etablissement.etoiles ?? 0) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Description établissement */}
        {chambre.etablissement.description && (
          <p className="text-xs sm:text-sm text-gray-700 mt-2 break-words"><TransletText>{chambre?.etablissement?.description?.toString()}</TransletText></p>
        )}

        {/* Services établissement */}
        <div className="flex flex-wrap gap-2 mt-2">
          {chambre.etablissement.services?.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-indigo-50 text-xs rounded-full text-indigo-700"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-3 text-xs text-gray-600 space-y-1">
          <p>
            Email :{' '}
            <a
              href={`mailto:${chambre.etablissement.contact.email}`}
              className="text-indigo-600 hover:underline break-all"
            >
              <TransletText>{chambre.etablissement.contact.email}</TransletText>
            </a>
          </p>
          <p>
            Tél :{' '}
            <a
              href={`tel:${chambre.etablissement.contact.telephone}`}
              className="text-indigo-600 hover:underline"
            >
              <TransletText>{chambre.etablissement.contact.telephone}</TransletText>
            </a>
          </p>
          {chambre.etablissement.contact.siteWeb && (
            <p>
              Site :{' '}
              <a
                href={chambre.etablissement.contact.siteWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline break-all"
              >
                {chambre.etablissement.contact.siteWeb}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Footer: disponibilité + CTA */}
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
        <span
          className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
            chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {chambre.disponible ? 'Disponible' : 'Indisponible'}
        </span>
        <button
          className="w-full xs:w-auto px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          disabled={!chambre.disponible}
        >
          Réserver
        </button>
      </div>
    </div>
  );
}