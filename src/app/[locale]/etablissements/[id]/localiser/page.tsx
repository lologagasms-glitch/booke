"use client";
import MapClient from '@/components/establishments/MapClient';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function LocaliserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lat = parseFloat(searchParams.get('lat') ?? 'NaN');
  const lng = parseFloat(searchParams.get('lng') ?? 'NaN');

  if (Number.isNaN(lat) || Number.isNaN(lng)) notFound();

  return (
    <>
      <section>
        <main className="w-full bg-theme-base pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-theme-main mb-6">
            Localisation sur la carte
          </h1>

          {/* Carte : hauteur fixe + scroll interdit */}
          <div className="w-full h-[60vh] max-h-[60vh] rounded-2xl overflow-hidden shadow-lg bg-theme-card">
            <MapClient 
              size={40} 
              position={[lat, lng]} 
              className="w-full h-full"
              scrollWheelZoom={true}    // zoom souris activé
              zoomControl={true}        // garder les boutons +/- si besoin
            />
          </div>

          <div className="mt-4 text-sm text-theme-main">
            <p>Latitude: {lat.toFixed(6)}</p>
            <p>Longitude: {lng.toFixed(6)}</p>
          </div>

          {/* Bouton retour placé en bas du card localisation */}
          <div className="mt-6 cursor-pointer">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-btn hover:bg-red-400 shadow hover:shadow-md transition-all duration-300 text-theme-main hover:text-white"
              aria-label="Retour"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </button>
          </div>
        </div>
      </main>
      </section>
    </>
  );
}