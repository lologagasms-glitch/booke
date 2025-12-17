// app/reservations/page.tsx  (ou pages/reservations.tsx en Pages Router)
'use client';

import { TransletText } from '@/app/lib/services/translation/transletText';
import { useReservations } from '@/components/reservations/useReservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity } from 'react';

export default function ReservationsPage() {
  const { data, isLoading, error } = useReservations();

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Erreur : {error.message}</p>
      </div>
    );

  const list = data?.reservations;


  return (
    <Activity mode={list?"visible":"hidden"}>
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <header className="mb-10 md:mb-14">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
             <TransletText>Mes réservations</TransletText> 
            </h1>
            <p className="mt-2 text-gray-600">
              {list?.length
                ? `${list?.length} séjour${list?.length > 1 ? 's' : ''} trouvé${
                    list?.length > 1 ? 's' : ''
                  }`
                : 'Aucune réservation pour le moment.'}
            </p>
          </header>

          {list?.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500"><TransletText>Vos prochaines escapades apparaîtront ici.</TransletText> </p>
            </div>
          ) : (
            <ul className="grid gap-6 md:gap-8">
              {list?.map((r) => (
                <li
                  key={r.reservationId}
                  className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6"
                >
                  {/* visuel */}
                  <div className="shrink-0 w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
                    {r.mediaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.mediaUrl}
                        alt={r.chambreNom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 21l19.5-18L2.25 3l1.5-1.5L21 12 3.75 19.5 2.25 21z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* contenu */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500"><TransletText>Établissement</TransletText> </p>
                        <h3 className="text-xl font-semibold">{r.etablissementNom}</h3>
                        <p className="text-gray-600">
                          {r.etablissementVille}, {r.etablissementPays}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.statut === 'confirm'
                            ? 'bg-green-50 text-green-700'
                            : r.statut === 'en_attente'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {r.statut === 'confirm'
                          ? 'Confirmée'
                          : r.statut === 'en_attente'
                          ? 'En attente'
                          : 'Annulée'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500"><TransletText>Chambre</TransletText></p>
                        <p className="font-medium">{r.chambreNom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500"><TransletText>Capacité</TransletText></p>
                        <p className="font-medium">{r.chambreCapacite} pers.</p>
                      </div>
                      <div>
                        <p className="text-gray-500"><TransletText>Arrivée</TransletText></p>
                        <p className="font-medium">
                          {format(new Date(r.dateDebut), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Départ</p>
                        <p className="font-medium">
                          {format(new Date(r.dateFin), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* prix */}
                  <div className="shrink-0 text-right">
                    <p className="text-gray-500 text-sm"><TransletText>Prix total</TransletText></p>
                    <p className="text-2xl font-semibold">{r.prixTotal.toFixed(2)} €</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Activity>
  );
}

