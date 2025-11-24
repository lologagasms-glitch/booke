'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { ChambreResult } from '@/app/lib/services/etablissement.service';
import { useParams, usePathname } from 'next/navigation';
import { TransletText } from '@/app/lib/services/translation/transletText';

interface ChambreCardProps {
  data: ChambreResult;
}

const ChambreCardSearch = ({ data}: ChambreCardProps) => {
   const router = usePathname();
    const locale = router.split('/')[1];
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group m-4">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-1/3 h-48 md:h-56 lg:h-64">
          <Link href={`/${locale}/chambres/${data.id}`} className="block h-full">
            <Image
              src={data.image || '/file.svg'}
              alt={data.nom}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden" />
          </Link>
          <div className="absolute top-3 left-3 md:hidden">
            <span className="inline-block bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              {data.capacite} pers.
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-4 md:p-5 lg:p-6 flex flex-col">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Link href={`/${locale}/chambres/${data.id}`} className="group/link hover:text-blue-700 transition-colors">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 group-hover/link:underline">
                  {data.nom}
                </h2>
              </Link>

              <div className="flex items-center gap-1 mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  <TransletText>{data.ville}</TransletText>, <TransletText>{data.pays}</TransletText>
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Dans <span className="font-medium">{data.etablissementNom}</span>
              </p>
            </div>

            <div className="hidden md:block">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {data.capacite} pers.
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 md:line-clamp-3 flex-1">
            <TransletText>{data.description}</TransletText>
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto pt-2">
            <div className="text-lg font-semibold text-gray-900">
              {data.prix.toLocaleString('fr-FR')} € <span className="text-sm text-gray-500">/ nuit</span>
            </div>

            <Link
              href={`/${locale}/chambres/${data.id}`}
              className="w-full sm:w-auto bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-all duration-200 text-center shadow-md hover:shadow-lg"
            >
              <TransletText>voir la chambre</TransletText>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChambreCardSearch;