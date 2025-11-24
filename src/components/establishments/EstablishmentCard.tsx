'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, PhoneIcon, WifiIcon } from '@heroicons/react/24/outline';
import { Etablissement } from '@/types';
import { fetchFirstMediaImageByEstablishmentAction } from '@/app/lib/services/actions/etablissements';
import { useQuery } from '@tanstack/react-query';
import { getFirstMediaImageEtablissement } from '@/app/lib/services/etablissement.service';
import Loading from '../Loading';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { usePathname } from 'next/navigation';

interface EstablishmentCardProps {
  establishment: Etablissement;
  firstImageUrl:string|null;
}

const EstablishmentCard = ({ establishment, firstImageUrl }: EstablishmentCardProps) => {
  const router = usePathname();
  const locale = router.split('/')[1];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-1/3 h-48 md:h-56 lg:h-64">
          <Link href={`/${locale}/etablissements/${establishment.id}`} className="block h-full">
          
             <Image
               src={firstImageUrl || '/file.svg'}
               alt={establishment.nom}
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-300"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
             />
            {/* Overlay gradient for better text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden" />
          </Link>
          {/* Type badge on image for mobile */}
          <div className="absolute top-3 left-3 md:hidden">
            <span className="inline-block bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              <TransletText>{establishment.type}</TransletText>
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full md:w-2/3 p-4 md:p-5 lg:p-6 flex flex-col">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Link 
                href={`/${locale}/etablissements/${establishment.id}`} 
                className="group/link hover:text-blue-700 transition-colors"
              >
                <h2 className="text-lg md:text-xl text-black hover:text-yellow lg:text-2xl font-bold mb-1 group-hover/link:underline">
                  {establishment.nom}
                </h2>
              </Link>
              
              <div className="flex items-center gap-1 mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                 <Link href={`/${locale}/etablissements/${establishment.id}/localiser?lat=${establishment.latitude}&lng=${establishment.longitude}`} className="group/link hover:text-blue-700 transition-colors">
                  {<TransletText>{establishment.ville}</TransletText>}, {<TransletText>{establishment.pays}</TransletText>}
                 </Link>
                </span>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: establishment.etoiles || 0 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
            </div>
            
            {/* Type badge for desktop */}
            <div className="hidden md:block">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                <TransletText>{establishment.type}</TransletText>
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 md:line-clamp-3 flex-1">
            {establishment.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {establishment.services.slice(0, 4).map((service, index) => (
              <span 
                key={index} 
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1.5 rounded-full"
              >
                {service === 'wifi gratuit' && <WifiIcon className="h-3 w-3" />}
                <TransletText>{service}</TransletText>
              </span>
            ))}
            {establishment.services.length > 4 && (
              <span className="inline-flex items-center text-gray-500 text-xs px-2 py-1">
                +{establishment.services.length - 4}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto pt-2">
            <div className="flex items-center gap-1 text-gray-600">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{establishment.contact.telephone}</span>
            </div>
            
            <Link 
              href={`/${locale}/etablissements/${establishment.id}`}
              className="w-full sm:w-auto bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-all duration-200 text-center shadow-md hover:shadow-lg"
            >
              <TransletText>Voir les chambres</TransletText>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCard;