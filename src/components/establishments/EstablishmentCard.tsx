'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, PhoneIcon, WifiIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Etablissement } from '@/types';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { usePathname } from 'next/navigation';

interface EstablishmentCardProps {
  establishment: Etablissement;
  firstImageUrl: string | null;
}

const EstablishmentCard = ({ establishment, firstImageUrl }: EstablishmentCardProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  return (
    <article className="group relative bg-theme-card rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-theme-main">
      {/* Image on top */}
      <div className="relative w-full h-56 md:h-64">
        <Link
          href={`/${locale}/etablissements/${establishment.id}`}
          className="block w-full h-full"
          aria-label={establishment.nom}
        >
          <Image
            src={encodeURI(firstImageUrl || '/file.svg')}
            alt={establishment.nom}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 500px"
            priority={false}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </Link>

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            <TransletText>{establishment.type}</TransletText>
          </span>
        </div>

        {/* Star rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow">
          <StarIcon className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-black">{establishment.etoiles}</span>
        </div>
      </div>

      {/* Content below image */}
      <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-between">
        <div>
          {/* Title & location */}
          <div className="mb-3">
            <Link
              href={`/${locale}/etablissements/${establishment.id}`}
              className="group/link"
            >
              <h3 className="text-xl md:text-2xl font-bold text-black group-hover/link:text-theme-btn transition-colors duration-200">
                {establishment.nom}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mt-2 text-sm text-black">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <Link
                href={`/${locale}/etablissements/${establishment.id}/localiser?lat=${establishment.latitude}&lng=${establishment.longitude}`}
                className="hover:text-theme-btn underline-offset-2 hover:underline"
              >
                <TransletText>{establishment.ville}</TransletText>, <TransletText>{establishment.pays}</TransletText>
              </Link>
            </div>
          </div>

          {/* Description */}
          <p className="text-black text-sm leading-relaxed mb-4 line-clamp-3">
            {establishment.description}
          </p>

          {/* Services */}
          <div className="flex flex-wrap gap-2 mb-5">
            {establishment.services.slice(0, 5).map((service, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-gray-50 text-black text-xs px-3 py-1.5 rounded-full border border-gray-200"
              >
                {service === 'wifi gratuit' && <WifiIcon className="h-3 w-3 text-blue-500" />}
                <TransletText>{service}</TransletText>
              </span>
            ))}
            {establishment.services.length > 5 && (
              <span className="inline-flex items-center text-black text-xs px-2 py-1">
                +{establishment.services.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-black">
            <PhoneIcon className="h-4 w-4 text-gray-400" />
            <span>{establishment.contact.telephone}</span>
          </div>

          <Link
            href={`/${locale}/etablissements/${establishment.id}`}
            className="inline-flex items-center gap-2 bg-theme-btn hover:bg-theme-btn/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
          >
            <TransletText>Voir les chambres</TransletText>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EstablishmentCard;