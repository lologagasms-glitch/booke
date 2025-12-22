'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getChambreByIdAction } from '@/app/lib/services/actions/chambres';
import { getEtablissementByIdAction } from '@/app/lib/services/actions/etablissements';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewReservation, reservationSchema } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createReservationAction } from '@/app/lib/services/actions/reservations';
import { useSession } from '@/app/lib/auth-client';
import MediaModal from '../MediaModal';
import { TransletText } from '@/app/lib/services/translation/transletText';
type Media = {
  id?: string;
  createdAt: Date;
  type: "image" | "video";
  chambreId?: string;
  url: string;
  filename: string;
}
export default function ChambrePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const chambreId = params.chambreId as string;
  const {data:sessionData}=useSession()
  if(!sessionData?.user?.id) {
    router.push(`/${params.locale}/auth/login`);
    return null;
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewReservation>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      userId: sessionData.user.id,
      nombrePersonnes: 1,
    },
  });
const [modalMedia, setModalMedia] = useState<Media | null>(null);
  // Récupérer les détails de la chambre
  const { data: chambreData, isLoading: isLoadingChambre, error: chambreError } = useQuery({
    queryKey: ['chambre', chambreId],
    queryFn: () => getChambreByIdAction({ id: chambreId }).then(res => res.data?.data),
    enabled: !!chambreId,
  });

  // Récupérer les détails de l'établissement
  const { data: etablissementData, isLoading: isLoadingEtablissement } = useQuery({
    queryKey: ['etablissement', id],
    queryFn: () => getEtablissementByIdAction({ id }).then(res => res.data?.data),
    enabled: !!id,
  });

  const createReservationMutation = useMutation({
    mutationFn: createReservationAction,
    onSuccess: (data) => {
      if (data.data?.id) {
        router.push(`/${params.locale}/reservations/${data.data.id}`);
      }
    },
    onError: (error) => {
      alert('Erreur lors de la création de la réservation');
      console.error(error);
    },
  });

  if (isLoadingChambre || isLoadingEtablissement) {
    return <Loading />;
  }

  if (chambreError || !chambreData || !etablissementData) {
    notFound();
  }
  const chambre = chambreData;
  const etablissement = etablissementData;
  const mediaImage = chambre.medias?.find(media => media.type === 'image');

 
  // Calculer le prix total en fonction des dates sélectionnées
  const prixTotal = useMemo(() => {
    const debut = watch('dateDebut');
    const fin = watch('dateFin');
    if (!debut || !fin) return chambre.prix;

    const debutDate = new Date(debut);
    const finDate = new Date(fin);
    const diffTime = Math.abs(finDate.getTime() - debutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return chambre.prix * diffDays;
  }, [watch('dateDebut'), watch('dateFin'), chambre.prix]);





  // Rediriger vers la page de réservation
  const onSubmit = (data: NewReservation) => {
    createReservationMutation.mutate({
      ...data,
      roomId: chambreId,
      etablissementId: id,
      userId: sessionData.user.id , 
      statut: 'en_attente',
    });
  };

 return (
  <div className="min-h-screen bg-theme-base">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Lien retour */}
      <div className="mb-8">
        <Link
          href={`/${params.locale}/etablissements/${id}`}
          className="inline-flex items-center text-theme-btn hover:opacity-80 transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
           <TransletText >   
            Retour à l’établissement
          </TransletText>
          
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Colonne gauche : infos chambre */}
        <div className="lg:col-span-2 space-y-8">
          {/* Titre + badge dispo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-extrabold text-theme-main">{chambre.nom}</h1>
              {chambre.disponible ? (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Disponible
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Non disponible
                </span>
              )}
            </div>
            <p className="text-theme-main opacity-80">
              {etablissement.nom} · {etablissement.ville}, {etablissement.pays}
            </p>
          </div>

          {/* Image principale */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={encodeURI(mediaImage?.url || '/file.svg')}
              alt={chambre.nom}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Miniatures */}
         {chambre.medias && chambre.medias.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {chambre.medias.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setModalMedia(media)}
                  className="relative h-28 rounded-xl overflow-hidden shadow hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-theme-btn"
                >
                  {media.type === 'image' ? (
                    <Image
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  {media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <span className="text-white text-sm font-semibold">
                        <TransletText >   
                         ▶ Vidéo
                        </TransletText>
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          {/* Description */}
          <div className="bg-theme-card rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-3 text-theme-main">
              <TransletText >   
                Description
              </TransletText>
            </h2>
            <p className="text-theme-main opacity-90 leading-relaxed">
              <TransletText >   
              {chambre.description}
              </TransletText>
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-theme-main">
              <TransletText >   
                Services inclus
              </TransletText>
              </h3>
            <ul className="grid grid-cols-2 gap-2 text-theme-main opacity-90">
              {chambre.services?.map((service) => (
                <li key={service} className="flex items-center">
                  <span className="w-2 h-2 bg-theme-btn rounded-full mr-3" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-theme-card rounded-2xl shadow-lg p-6 sticky top-10 space-y-5"
          >
            <h3 className="text-xl font-bold text-theme-main">
              <TransletText >   
                Réserver cette chambre
              </TransletText>
            </h3>

            <div>
              <label className="block text-sm font-medium text-theme-main opacity-80 mb-1">
                <TransletText >    
                {"Date d’arrivée"}
               </TransletText>
                </label>
              <input
                type="date"
                {...register('dateDebut')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-btn focus:border-theme-btn transition"
              />
              {errors.dateDebut && <p className="text-red-500 text-sm mt-1">
                <TransletText >   
                {errors.dateDebut.message||""}
               </TransletText>
                </p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-main opacity-80 mb-1">Date de départ</label>
              <input
                type="date"
                {...register('dateFin')}
                min={watch('dateDebut') ? new Date(watch('dateDebut')).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-btn focus:border-theme-btn transition"
              />
              {errors.dateFin && <p className="text-red-500 text-sm mt-1">{errors.dateFin.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-main opacity-80 mb-1">Nombre de personnes</label>
              <select
                {...register('nombrePersonnes', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-btn focus:border-theme-btn transition"
              >
                {Array.from({ length: chambre.capacite }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              {errors.nombrePersonnes && <p className="text-red-500 text-sm mt-1">
                 <TransletText >
                    {errors.nombrePersonnes.message||""}
                  </TransletText>
                
              </p>}
            </div>

            <div className="border-t border-theme-main opacity-20 pt-4">
              <div className="flex justify-between text-theme-main opacity-80 mb-2">
                <span>Prix par nuit</span>
                <span>{chambre.prix} €</span>
              </div>
              {watch('dateDebut') && watch('dateFin') && (
                <div className="flex justify-between font-bold text-lg text-green-600">
                  <span>Prix total</span>
                  <span>{prixTotal} €</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-theme-btn text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!chambre.disponible || createReservationMutation.isPending}
            >
               <TransletText >    
                {createReservationMutation.isPending ? 'Réservation en cours...' : 'Réserver maintenant'}
               </TransletText>
              
            </button>

            {!chambre.disponible && (
              <p className="text-red-500 text-sm text-center"><TransletText > 
               Cette chambre n’est pas disponible.
               </TransletText>
               </p>
            )}
          </form>
        </div>
      </div>
    </div>
    {modalMedia && <MediaModal media={modalMedia} onClose={() => setModalMedia(null)} />}
  </div>
);
}