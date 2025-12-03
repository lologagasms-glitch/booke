'use client';

import { useSession, authClient } from '@/app/lib/auth-client';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getReservationsByUser } from '@/app/lib/services/reservation.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/* ---------- Types ---------- */
type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  image?: string;
  loyaltyPoints?: number; // points fidélité
};

/* ---------- Squelette de chargement ---------- */
const Skeleton = () => (
  <div className="grid place-content-center min-h-[60vh]">
    <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

/* ---------- Page ---------- */
export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Redirection si non connecté
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/auth/signin');
    }
  }, [session, isPending, router]);

  // Fetch reservations
  const { data: reservationsResponse, isLoading: isLoadingRes } = useQuery({
    queryKey: ['my-reservations', session?.user?.id],
    queryFn: () => getReservationsByUser(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });

  const reservations = reservationsResponse?.data || [];
  const upcoming = reservations.find(r => new Date(r.dateDebut) > new Date() && r.statut === 'confirm');

  const user: User = {
    id: session?.user?.id || '',
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    role: (session?.user?.role as 'USER' | 'ADMIN') || 'USER',
    image: session?.user?.image ?? undefined,
    loyaltyPoints: 1250, // Mock pour l'instant
  };

  useEffect(() => {
    if (user.name) setEditName(user.name);
    if (user.image) setEditImage(user.image);
  }, [user.name, user.image]);

  const handleUpdateProfile = async () => {
    try {
      let imageUrl: string | undefined = editImage || undefined;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const res = await fetch('/api/user/avatar', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Échec du téléchargement de la photo');
        const data = await res.json();
        imageUrl = data.url as string;
      }
      await authClient.updateUser({ name: editName, image: imageUrl });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  if (isPending || !session) return <Skeleton />;

  

  return (
    <main className="bg-gray-50 min-h-screen pb-12">
      {/* HERO */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 pt-10">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-white/70" />
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-0 p-2 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition-transform hover:scale-110"
                title="Modifier le profil"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>

            <div>
              {isEditing ? (
                <div className="flex flex-col gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-2 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Votre nom"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setAvatarFile(f);
                      if (f) setEditImage(URL.createObjectURL(f));
                    }}
                    className="px-3 py-2 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
                      <XMarkIcon className="w-5 h-5 text-white" />
                    </button>
                    <button onClick={handleUpdateProfile} className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-white shadow-lg">
                      <CheckIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bonjour, {user.name}</h1>
                  <p className="text-blue-100 mt-2 text-lg">Prêt pour votre prochaine escapade ?</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Compte {user.role === 'ADMIN' ? 'Administrateur' : 'Membre'}
                  </div>
                </>
              )}
            </div>
          </div>

          
        </div>
      </section>

      {/* GRILLE */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 grid md:grid-cols-2 gap-6">
        {/* Prochain séjour */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
              </div>
              Votre prochain séjour
            </h2>
            <Link href="/reservations" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
              Voir tout l'historique
            </Link>
          </div>

          {upcoming ? (
            <div className="flex flex-col sm:flex-row gap-6 group">
              <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shadow-md">
                {/* Placeholder image since we don't have real image in reservation yet, or use etablissement image if available */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-300">
                  <MapPinIcon className="w-12 h-12" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{upcoming.chambre?.nom || 'Chambre'}</h3>
                    <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      {upcoming.etablissement?.nom || 'Établissement'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                    Confirmé
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-blue-500" />
                    Du <span className="font-semibold text-gray-900">{format(new Date(upcoming.dateDebut), 'dd MMM yyyy', { locale: fr })}</span>
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>Au <span className="font-semibold text-gray-900">{format(new Date(upcoming.dateFin), 'dd MMM yyyy', { locale: fr })}</span></span>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/reservations/${upcoming.id}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                  >
                    Gérer la réservation
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">Aucun séjour à venir</p>
              <p className="text-gray-500 text-sm mt-1 mb-4">C'est le moment idéal pour planifier vos vacances !</p>
              <Link href="/etablissements" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:text-blue-600 transition">
                Explorer les destinations
              </Link>
            </div>
          )}
        </div>

        

        

        
      </section>

      {/* Admin */}
      {user.role.toLowerCase() === 'admin' && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-800 rounded-xl">
                <UserIcon className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Espace Administration</h3>
                <p className="text-gray-400 text-sm">Gérez les établissements, réservations et utilisateurs.</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Accéder au dashboard
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
