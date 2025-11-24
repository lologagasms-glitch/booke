
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import clsx from 'clsx';
import EstablishmentTable from '@/components/admin/EstablishmentTable';
export default async function AdminEstablishmentsPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-blue-50">
      {/* Hero section */}
      <header className="relative h-56 md:h-64">
        <Image
          src="/admin/hero-hotel.jpg"
          alt="Tableau de bord hôtelier"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-end pb-6">
          <div className="flex items-center gap-3 text-white">
            <HomeModernIcon className="w-8 h-8" />
            <h1 className="font-display text-3xl md:text-4xl">Gestion des établissements</h1>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Carte blanche qui englobe le tableau */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 md:p-6">
          <EstablishmentTable />
        </div>
      </main>

      {/* Bouton flottant « Ajouter » */}
      <Link
        href="/admin/etablissements/new"
        className={clsx(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-700 text-white',
          'flex items-center justify-center shadow-xl hover:bg-blue-800 transition',
          'md:bottom-8 md:right-8 md:w-16 md:h-16',
          'focus:outline-none focus:ring-4 focus:ring-blue-300'
        )}
        aria-label="Ajouter un établissement"
      >
        <PlusIcon className="w-6 h-6" />
      </Link>
    </div>
  );
}