// app/(account)/reservations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useSession } from '@/app/lib/auth-client';
type StatutReservation="confirmée" | "en_attente" |"annulée" | "terminee"
/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface ReservationWithDetails {
  id: string;
  etablissementId: string;
  roomId: string;
  dateDebut: Date;
  dateFin: Date;
  prixTotal: number;
  statut: StatutReservation;
  etablissement: {
    nom: string;
    ville: string;
    pays: string;
    imagesEtab: { url: string }[];
  };
  room: {
    nom: string;
    imagesChambre: { url: string }[];
  };
}

/* ------------------------------------------------------------------ */
/* Mock generator                                                     */
/* ------------------------------------------------------------------ */
const fakeReservations = (): ReservationWithDetails[] => [
  {
    id: 'res-001',
    etablissementId: 'etab-1',
    roomId: '101',
    dateDebut: new Date(Date.now() + 7 * 86_400_000),
    dateFin: new Date(Date.now() + 10 * 86_400_000),
    prixTotal: 750,
    statut: "confirmée",
    etablissement: {
      nom: 'Hôtel de Paris',
      ville: 'Paris',
      pays: 'France',
      imagesEtab: [{ url: 'https://picsum.photos/seed/hp1/600/400' }],
    },
    room: {
      nom: 'Chambre Deluxe',
      imagesChambre: [{ url: 'https://picsum.photos/seed/hp2/600/400' }],
    },
  },
  {
    id: 'res-002',
    etablissementId: 'etab-2',
    roomId: '201',
    dateDebut: new Date(Date.now() - 30 * 86_400_000),
    dateFin: new Date(Date.now() - 25 * 86_400_000),
    prixTotal: 1_600,
    statut: "terminee",
    etablissement: {
      nom: 'Villa Méditerranée',
      ville: 'Nice',
      pays: 'France',
      imagesEtab: [{ url: 'https://picsum.photos/seed/vm1/600/400' }],
    },
    room: {
      nom: 'Chambre Vue Mer',
      imagesChambre: [{ url: 'https://picsum.photos/seed/vm2/600/400' }],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function ReservationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const {locale}=useParams()
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role?.toLowerCase()!=="admin") {
      router.replace(`/${locale}/auth/signin?callbackUrl=/reservations`);
      return;
    }
    if (!session?.user){
      notFound()
      return
    }

    (async () => {
      try {
        const res = await fetch(`/${locale}/api/reservations?userId=${session?.user.id}`);
        if (!res.ok) throw new Error('fetch error');
        const data: ReservationWithDetails[] = await res.json();
        setReservations(data);
      } catch {
        // fallback
        setReservations(fakeReservations());
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ router, session]);

  /* --------------------------------- */
  /* Helpers                           */
  /* --------------------------------- */
  const formatDateRange = (d1: Date, d2: Date) => {
    const opts: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return `${d1.toLocaleDateString('fr-FR', opts)} – ${d2.toLocaleDateString('fr-FR', opts)}`;
  };

  const badge = (s: StatutReservation) => {
    switch (s) {
      case "confirmée":
        return 'bg-green-100 text-green-800';
      case "annulée":
        return 'bg-red-100 text-red-800';
      case "terminee":
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  /* --------------------------------- */
  /* Loading                           */
  /* --------------------------------- */
  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 h-32 bg-gray-200 rounded-md" />
                <div className="w-full md:w-3/4 md:pl-6 mt-4 md:mt-0">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  /* --------------------------------- */
  /* Empty                             */
  /* --------------------------------- */
  if (reservations.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <svg
              className="h-16 w-16 text-gray-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Aucune réservation trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore effectué de réservation.
          </p>
          <Link
            href="/etablissements"
            className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors inline-flex items-center"
          >
            Explorer les établissements
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    );

  /* --------------------------------- */
  /* Liste                             */
  /* --------------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>

      <div className="space-y-6">
        {reservations?.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* image */}
              <div className="relative w-full md:w-1/4 h-48 md:h-auto">
                <Image
                  src={r.etablissement.imagesEtab[0].url}
                  alt={r.etablissement.nom}
                  fill
                  className="object-cover"
                />
              </div>

              {/* contenu */}
              <div className="w-full md:w-3/4 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {r.etablissement.nom}
                    </h2>
                    <p className="text-gray-600 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {r.etablissement.ville}, {r.etablissement.pays}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badge(r.statut)}`}
                  >
                    {r.statut}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium">{r.room.nom}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{formatDateRange(r.dateDebut, r.dateFin)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-gray-600 text-sm">Montant total</span>
                    <p className="text-xl font-bold">{r.prixTotal} €</p>
                  </div>

                  <div className="space-x-3">
                    {r.statut === "confirmée" && (
                      <button
                        className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors"
                        onClick={() => alert('Annulation à implémenter')}
                      >
                        Annuler
                      </button>
                    )}

                    <Link
                      href={`/etablissements/${r.etablissementId}`}
                      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}