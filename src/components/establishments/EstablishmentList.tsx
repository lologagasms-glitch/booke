"use client";

import { DataEtabs } from "@/app/api/etablissement/getall/route";
import { TransletText } from "@/app/lib/services/translation/transletText";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ImageWithFallback } from "../images";

type EstablishmentListProps = {
  etablissements: DataEtabs;
  isLoading?: boolean;
  error?: string | null;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  goNext: () => void;
  goPrev: () => void;
};

export default function EstablishmentList({
  etablissements,
  isLoading = false,
  error,
  offset,
  hasNext,
  hasPrev,
  goNext,
  goPrev,
}: EstablishmentListProps) {
  const { locale } = useParams() as { locale: string };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          <p className="text-center font-medium">
            <TransletText>Une erreur s'est produite</TransletText>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="aspect-video animate-pulse bg-white/10" />
              <div className="p-6">
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!etablissements.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-white/20 bg-white/10 p-8 text-white/60 backdrop-blur-xl">
          <p className="text-center font-medium">
            <TransletText>Aucun établissement trouvé</TransletText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 bg-theme-base p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {etablissements.map(({ etablissements: item, firstImageUrl }) => (
          <Link
            key={item.id}
            href={`/${locale}/etablissements/${item.id}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div className="aspect-video overflow-hidden">
              {firstImageUrl ? (
                <ImageWithFallback
                  width={400}
                  height={400}
                  src={firstImageUrl}
                  alt={item.nom}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  timeout={8000} // 8 second timeout
                  fallbackSrc="/placeholder-image.jpg"
                  retryAttempts={2}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                  <span className="text-white/40">
                    <TransletText>Pas d'image</TransletText>
                  </span>
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{item.nom}</h3>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  <TransletText>{item.type}</TransletText>
                </span>
              </div>

              <div className="flex items-center gap-4 text-white/70">
                <span className="text-sm">{item.ville}</span>
                {item.etoiles && (
                  <div className="flex gap-1">
                    {[...Array(item.etoiles)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(hasPrev || hasNext) && (
       <div className="flex items-center justify-center gap-4">
  <button
    onClick={goPrev}
    disabled={!hasPrev}
    className="rounded-xl border-2 border-indigo-500 bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:scale-100"
  >
    <TransletText>Précédent</TransletText>
  </button>

  <div className="rounded-xl border-2 border-indigo-500 bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg">
    {Math.round(offset/9) + 1}
  </div>

  <button
    onClick={goNext}
    disabled={!hasNext}
    className="rounded-xl border-2 border-indigo-500 bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:scale-100"
  >
    <TransletText>Suivant</TransletText>
  </button>
</div>
      )}
    </div>
  );
}