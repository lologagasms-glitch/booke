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
  <div className="animate-pulse" role="status" aria-label="Chargement…">
    <div className="aspect-video w-full rounded-2xl bg-surface/50" />
    <div className="mt-3 space-y-2">
      <div className="h-5 w-3/4 rounded bg-surface/50" />
      <div className="h-4 w-1/2 rounded bg-surface/50" />
      <div className="h-4 w-1/3 rounded bg-surface/50" />
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
    <StarIcon key={i} className="h-5 w-5 text-primary" />
  ));

  // Calcul du pourcentage de réduction (arrondi à 5 % près)
  const percent = e.prixMin && e.prixMin ? Math.round((1 - e.prixMin / e.prixMin) * 100) : null;

  return (
    <Link href={`/${locale}/etablissements/${e.etablissementId}`} >
      <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">

        <div className="flex items-center justify-between text-foreground/60 p-4 ">
          <TransletText>{e.nom}</TransletText>
        </div>


        <figure className="relative aspect-video w-full">
          <Image
            src={e.mediaUrl || '/placeholder-hotel.jpg'}
            alt={`Photo de ${e.nom}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badge résas */}
          <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {e.totalResa > 50 ? '🔥' : e.totalResa > 20 ? '👀' : '✨'} {e.totalResa} résa.
          </span>

          {/* Nom + services */}
          <figcaption className="pointer-events-none absolute bottom-3 left-3 text-white">
            <h3 className="text-xl font-bold tracking-tight">{e.nom}</h3>
            <p className="text-sm opacity-90">{e.services?.join(' · ')}</p>
          </figcaption>

          {/* Étoiles */}
          <div className="pointer-events-none absolute bottom-3 right-3 flex gap-1">{stars}</div>
        </figure>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex flex-wrap gap-2">
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

          <div className="mt-auto flex items-baseline justify-between">
            <div>
              {e.prixMin ? (
                <div className="flex items-end gap-2">
                  {/* Prix barré */}
                  {e.prixMin && (
                    <span className="text-base text-foreground/60 line-through">
                      {Math.round(e.prixMin + 10)} €
                    </span>
                  )}
                  {/* Prix promo */}
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-extrabold text-primary">
                      {e.prixMin} €
                    </span>
                    <TagIcon className="h-4 w-4 text-primary" aria-hidden />
                  </div>
                  <span className="ml-1 text-sm text-foreground/60">par nuit</span>
                </div>
              ) : (
                <span className="text-sm text-foreground/60">Prix sur demande</span>
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
  <section className="mb-10 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-6 shadow-sm">
    <h2 className="mb-4 text-center text-2xl font-extrabold text-foreground">
      <TransletText>Evasion en quelques chiffres </TransletText>
    </h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="text-center">
        <p className="text-3xl font-bold text-primary">250+</p>
        <p className="text-sm text-foreground/60">
          <TransletText>Établissements partenaires</TransletText>
        </p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-purple-600">12 000+</p>
        <p className="text-sm text-foreground/60">
          <TransletText>Nuits réservées</TransletText>
        </p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-pink-600">4.8/5</p>
        <p className="text-sm text-foreground/60">
          <TransletText>Note moyenne</TransletText>
        </p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-amber-600">24h</p>
        <p className="text-sm text-foreground/60">
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
}: {
  locale: string;
  limit?: number;
}) {
  const { data, isLoading, isError, refetch } = usePopularEtablissements({  limit });
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-600">
            <TransletText>Impossible de charger les établissements populaires.</TransletText>
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
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
        <p className="text-center text-foreground/60">
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
          'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
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