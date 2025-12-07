'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import {
  WifiIcon,
  SparklesIcon,
  SwatchIcon,
  TruckIcon,
  HomeIcon,
  HeartIcon,
  TagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { usePopularEtablissements } from '@/components/hooks/etablissements';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { CompanyAdvantages, CompanyHero, CompanyTestimonials } from './HomeComponents';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { DataEtabsPopularType } from '@/app/api/etablissement/getPopular/route';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

/* ---------- mapping service → icône ---------- */
const serviceIcons: Record<string, React.ElementType> = {
  'wifi gratuit': WifiIcon,
  piscine: SwatchIcon,
  spa: SparklesIcon,
  parking: TruckIcon,
  'vue mer': HomeIcon,
  jardin: HeartIcon,
};

/* ---------- Skeleton maison ---------- */
const SkeletonCard = () => (
  <div className="animate-pulse w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0" role="status" aria-label="Chargement…">
    <div className="mr-2">
      <div className="aspect-video w-full rounded-2xl bg-surface/50" />
      <div className="mt-3 space-y-2">
        <div className="h-5 w-3/4 rounded bg-surface/50" />
        <div className="h-4 w-1/2 rounded bg-surface/50" />
        <div className="h-4 w-1/3 rounded bg-surface/50" />
      </div>
    </div>
  </div>
);

/* ---------- carte individuelle ---------- */
function EstablishmentCard({
  locale,
  e,
  priority = false,
}: {
  locale: string;
  e: NonNullable<
    Awaited<ReturnType<typeof usePopularEtablissements>>['data']
  >[number];
  priority?: boolean;
}) {
  const stars = Array.from({ length: e.etoiles || 0 }).map((_, i) => (
    <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-primary" />
  ));

  // Calcul du pourcentage de réduction (arrondi à 5 % près)
  const percent = e.prixMin && e.prixMin ? Math.round((1 - e.prixMin / e.prixMin) * 100) : null;

  return (
    <Link href={`/${locale}/etablissements/${e.etablissementId}`} className="group w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0">
      <article className="relative mr-2 flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">

        <div className="flex items-center justify-between text-foreground/60 p-3 md:p-4">
          <TransletText>{e.nom}</TransletText>
        </div>


        <figure className="relative aspect-video w-full">
          <Image
            src={e.mediaUrl || '/placeholder-hotel.jpg'}
            alt={`Photo de ${e.nom}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badge résas */}
          <span className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-surface/80 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {e.totalResa > 50 ? '🔥' : e.totalResa > 20 ? '👀' : '✨'} {e.totalResa} résa.
          </span>

          {/* Nom + services */}
          <figcaption className="pointer-events-none absolute bottom-2 left-2 text-white">
            <h3 className="text-base md:text-lg lg:text-xl font-bold tracking-tight">{e.nom}</h3>
            <p className="text-xs opacity-90">{e.services?.join(' · ')}</p>
          </figcaption>

          {/* Étoiles */}
          <div className="pointer-events-none absolute bottom-2 right-2 flex gap-1">{stars}</div>
        </figure>

        <div className="flex flex-1 flex-col p-3 md:p-4">
          <div className="mb-2 flex flex-wrap gap-1 md:gap-2">
            {(e.services || []).slice(0, 4).map((s) => {
              const Icon = serviceIcons[s] || SparklesIcon;
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-xs text-foreground/80"
                >
                  <Icon className="h-3 w-3" aria-hidden />
                  <span>{s}</span>
                </span>
              );
            })}
          </div>

          <div className="mt-auto flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-2">
            <div>
              {e.prixMin ? (
                <div className="flex items-end gap-2">
                  {/* Prix barré */}
                  {e.prixMin && (
                    <span className="text-xs md:text-sm text-foreground/60 line-through">
                      {Math.round(e.prixMin + 10)} €
                    </span>
                  )}
                  {/* Prix promo */}
                  <div className="flex items-center gap-1">
                    <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-primary">
                      {e.prixMin} €
                    </span>
                    <TagIcon className="h-3 w-3 md:h-4 md:w-4 text-primary" aria-hidden />
                  </div>
                  <span className="ml-1 text-xs text-foreground/60">par nuit</span>
                </div>
              ) : (
                <span className="text-xs md:text-sm text-foreground/60">Prix sur demande</span>
              )}
            </div>

            {/* Badge réduction */}
            {percent && percent >= 5 && (
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                -{percent} %
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ---------- Bloc chiffres clés (statique) ---------- */
const CompanyStats = () => (
  <section className="mb-8 md:mb-10 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 shadow-sm">
    <h2 className="mb-3 md:mb-4 text-center text-base sm:text-lg md:text-2xl font-extrabold text-foreground">
      <TransletText>Evasion en quelques chiffres </TransletText>
    </h2>
    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
      <div className="w-1/2 sm:w-1/4 flex-shrink-0 text-center">
        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-primary">250+</p>
        <p className="text-xs sm:text-sm text-foreground/60">
          <TransletText>Établissements partenaires</TransletText>
        </p>
      </div>
      <div className="w-1/2 sm:w-1/4 flex-shrink-0 text-center">
        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-600">12 000+</p>
        <p className="text-xs sm:text-sm text-foreground/60">
          <TransletText>Nuits réservées</TransletText>
        </p>
      </div>
      <div className="w-1/2 sm:w-1/4 flex-shrink-0 text-center">
        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-pink-600">4.8/5</p>
        <p className="text-xs sm:text-sm text-foreground/60">
          <TransletText>Note moyenne</TransletText>
        </p>
      </div>
      <div className="w-1/2 sm:w-1/4 flex-shrink-0 text-center">
        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-600">24h</p>
        <p className="text-xs sm:text-sm text-foreground/60">
          <TransletText>Support réactif</TransletText>
        </p>
      </div>
    </div>
  </section>
);

/* ---------- liste complète ---------- */
export default function PopularEstablishments({
  locale,
  limit = 10,
  data,
  refetch,
  isLoading,
  isError,
}: {
  locale: string;
  limit?: number;
  data: DataEtabsPopularType | undefined,
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<DataEtabsPopularType, Error>>,
  isLoading: boolean,
  isError: boolean,
}) {
  const [shuffled, setShuffled] = useState(data);

  useEffect(() => {
    if (data && data.length) {
      setShuffled([...data].sort(() => Math.random() - 0.5));
    }
  }, [data]);

  if (isLoading)
    return (
      <>
        <CompanyStats />
        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );

  if (isError)
    return (
      <>
        <CompanyStats />
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm md:text-base text-red-600">
            <TransletText>Impossible de charger les établissements populaires.</TransletText>
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-primary-foreground hover:bg-primary/90"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <TransletText>Réessayer</TransletText>
          </button>
        </div>
      </>
    );

  if (!shuffled?.length)
    return (
      <>
        <CompanyStats />
        <p className="text-center text-sm md:text-base text-foreground/60">
          <TransletText>Aucun établissement trouvé.</TransletText>
        </p>
      </>
    );

  return (
    <>
      <CompanyStats />

      <CompanyHero locale={locale} />
      <CompanyAdvantages />
      <div
        className={clsx(
          'flex flex-wrap gap-3 sm:gap-4 md:gap-6',
          'motion-safe:animate-fade-in'
        )}
      >
        {shuffled.map((e, i) => (
          <EstablishmentCard key={e.etablissementId} e={e} priority={i === 0} locale={locale} />
        ))}
      </div>
      <CompanyTestimonials  />
    </>
  );
}