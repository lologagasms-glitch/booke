'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEtablissementAction } from '@/app/lib/services/actions/etablissements';
import { NewEtablissement } from '@/types';
import { useSession } from '@/app/lib/auth-client';
import { createEtablissement } from '@/app/lib/services/etablissement.service';
import { usePopup } from '../popup';

/* -------------------------------------------------- */
/*  Schéma Zod aligné sur Drizzle                     */
/* -------------------------------------------------- */
const baseSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  description: z.string().min(1, "La description est requise"),
  longitude: z.string().min(1, "La longitude est requise"),
  latitude: z.string().min(1, "La latitude est requise"),
  pays: z.string().min(1, "Le pays est requis"),
  ville: z.string().min(1, "La ville est requise"),
  type: z.enum(['hotel', 'auberge', 'villa', 'residence', 'autre']),
  services: z.array(z.string()),
  etoiles: z.number().int().min(0).max(5).optional(),
  contact: z.object({
    telephone: z.string().min(1, "Le téléphone est requis"),
    email: z.string().email("Email invalide"),
    siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
  }),
  userId: z.string().min(1, "User ID est requis"),
});

type FormValues = z.infer<typeof baseSchema>;

/* -------------------------------------------------- */
/*  Icônes                                            */
/* -------------------------------------------------- */
const serviceIcons: Record<string, string> = {
  'wifi gratuit': '📶',
  climatisation: '❄️',
  minibar: '🧊',
  coffre: '🔒',
  'sèche-cheveux': '💇‍♀️',
  baignoire: '🛁',
  douche: '🚿',
  'vue sur mer': '🌊',
  'vue sur montagne': '🏔️',
  balcon: '🌅',
  terrasse: '🍹',
  spa: '🧖‍♀️',
  piscine: '🏊',
  restaurant: '🍽️',
  'salle de sport': '🏋️',
  parking: '🚗',
  'petit-déjeuner inclus': '🥐',
  'service en chambre': '🛏️',
  concierge: '🧑‍💼',
  blanchisserie: '👔',
  jardin: '🌳',
  ascenseur: '🛗',
};

/* -------------------------------------------------- */
/*  Tuile service                                     */
/* -------------------------------------------------- */
function ServiceTile({ label, selected, onToggle }: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={clsx(
        'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition',
        selected
          ? 'border-yellow-500 bg-yellow-400 text-white shadow-md'
          : 'border-sand-300 bg-white hover:border-sand-400 text-gray-700'
      )}
    >
      <span className="text-2xl md:text-3xl">{serviceIcons[label] ?? '📦'}</span>
      <span className="text-xs md:text-sm capitalize">{label}</span>
    </button>
  );
}

/* -------------------------------------------------- */
/*  StarStepProgress                                  */
/* -------------------------------------------------- */
function StarStepProgress({
  value,
  onChange
}: {
  value: number;
  onChange: (stars: number) => void;
}) {
  const handleStepClick = (starValue: number) => {
    onChange(starValue);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="relative px-1">
        <div className="relative flex justify-between items-start">
          {[1, 2, 3, 4, 5].map((threshold) => {
            const isCompleted = threshold <= value;
            const isActive = threshold === value;

            return (
              <div
                key={threshold}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={() => handleStepClick(threshold)}
              >
                <div className={clsx(
                  "relative w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-sm border",
                  isActive
                    ? 'scale-105 border-white bg-gradient-to-br from-amber-600 to-yellow-500'
                    : isCompleted
                      ? 'border-white bg-gradient-to-br from-amber-500 to-yellow-400'
                      : 'border-gray-300 bg-white group-hover:border-amber-400'
                )}>
                  <span className={clsx(
                    "text-xs md:text-sm transition-all",
                    isActive || isCompleted ? 'text-white drop-shadow' : 'text-gray-400 group-hover:text-amber-500'
                  )}>
                    {isCompleted ? '⭐' : '☆'}
                  </span>
                </div>
                <span className={clsx(
                  "text-[10px] md:text-xs font-medium text-center transition-colors max-w-12",
                  isActive ? 'text-amber-900 font-bold' : isCompleted ? 'text-amber-700' : 'text-gray-500 group-hover:text-amber-600'
                )}>
                  {threshold}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/*  Props du formulaire                               */
/* -------------------------------------------------- */
interface EstablishmentFormProps {
  /** ID de l'utilisateur connecté depuis votre système d'authentification */
  userId?: string;
}

/* -------------------------------------------------- */
/*  Formulaire principal                              */
/* -------------------------------------------------- */
export default function EstablishmentForm({ userId = 'default-user-id' }: EstablishmentFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { user } = session || {};
  const { show: showPopup ,PopupComponent} = usePopup();
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(baseSchema),
      defaultValues: {
        userId: user?.id || userId,
        services: [],
        etoiles: 0,
        type: 'hotel',
        contact: {
          telephone: '',
          email: '',
          siteWeb: '',
        },
      }
    });

  const watched = watch();

  const mutation = useMutation({
    mutationFn: (payload: NewEtablissement) => createEtablissement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etablissements'] });
      showPopup({ type: 'success', message: 'Établissement publié ✨' });
      router.push('/admin/etablissements');
    },
    onError: (err: any) => {
      console.error('Erreur complète:', err);
      showPopup({ type: 'error', message: `Erreur : ${err?.message || 'Une erreur est survenue'}` });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values as NewEtablissement);
  };

  const serviceOptions = Object.keys(serviceIcons);
  const establishmentTypes: { value: NewEtablissement['type']; label: string }[] = [
    { value: 'hotel', label: 'Hôtel' },
    { value: 'auberge', label: 'Auberge' },
    { value: 'villa', label: 'Villa' },
    { value: 'autre', label: 'Autre' },
    { value: 'residence', label: 'Résidence' },
  ];

  return (
    <>
    
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto p-4 md:p-6">
      {/* Champ caché pour userId */}
      <input type="hidden" {...register('userId')} />

      {/* -------------- Colonne gauche -------------- */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* Détails */}
        <section className="animate-slide-up bg-white rounded-2xl p-4 md:p-6 border border-sand-200">
          <h2 className="font-display text-xl md:text-2xl text-gray-800 mb-3 md:mb-4">Détails</h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement *</label>
              <input
                {...register('nom')}
                placeholder="ex. Hôtel Les Flots Bleus"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.nom && <p className="text-xs text-red-600 mt-1">{errors.nom.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'établissement *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {establishmentTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setValue('type', t.value, { shouldValidate: true })}
                    aria-pressed={watched.type === t.value}
                    className={clsx(
                      'capitalize px-2 py-1.5 rounded-lg border transition text-xs sm:text-sm md:text-base text-center break-words',
                      watched.type === t.value
                        ? 'border-yellow-500 bg-yellow-400 text-white shadow'
                        : 'border-sand-300 bg-white hover:bg-sand-50 text-gray-700'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Étoiles *</label>
              <Controller
                name="etoiles"
                control={control}
                render={({ field }) => (
                  <StarStepProgress
                    value={field.value || 0}
                    onChange={(stars) => field.onChange(stars)}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
              <input
                {...register('pays')}
                placeholder="France"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.pays && <p className="text-xs text-red-600 mt-1">{errors.pays.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
              <input
                {...register('adresse')}
                placeholder="123 Rue de la Mer"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.adresse && <p className="text-xs text-red-600 mt-1">{errors.adresse.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input
                {...register('ville')}
                placeholder="La Rochelle"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.ville && <p className="text-xs text-red-600 mt-1">{errors.ville.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordonnées GPS *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  {...register('longitude')}
                  placeholder="Longitude (ex: -1.5536)"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
                />
                <input
                  type="text"
                  {...register('latitude')}
                  placeholder="Latitude (ex: 46.1603)"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
                />
              </div>
              {(errors.longitude || errors.latitude) && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.longitude?.message || errors.latitude?.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="animate-slide-up bg-white rounded-2xl p-4 md:p-6 border border-sand-200">
          <h2 className="font-display text-xl md:text-2xl text-gray-800 mb-3 md:mb-4">Services & équipements</h2>
          <Controller
            name="services"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {serviceOptions.map((s) => (
                  <ServiceTile
                    key={s}
                    label={s}
                    selected={field.value.includes(s)}
                    onToggle={() => {
                      const arr = field.value.includes(s)
                        ? field.value.filter((v) => v !== s)
                        : [...field.value, s];
                      field.onChange(arr);
                    }}
                  />
                ))}
              </div>
            )}
          />
        </section>

        {/* Description */}
        <section className="animate-slide-up bg-white rounded-2xl p-4 md:p-6 border border-sand-200">
          <h2 className="font-display text-xl md:text-2xl text-gray-800 mb-3 md:mb-4">Description *</h2>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Décrivez l'établissement, son ambiance, ses points forts, l'histoire du lieu..."
            className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition resize-none"
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Astuce : parlez de l'ambiance, des services, de la localisation, de l'histoire du lieu...
          </p>
        </section>
      </div>

      {/* -------------- Colonne droite -------------- */}
      <div className="space-y-4 md:space-y-6">
        {/* Contact (obligatoire selon Drizzle) */}
        <section className="bg-white rounded-2xl p-4 md:p-6 border border-sand-200">
          <h2 className="font-display text-xl md:text-2xl text-gray-800 mb-3 md:mb-4">Contact</h2>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                {...register('contact.telephone')}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.contact?.telephone && <p className="text-xs text-red-600 mt-1">{errors.contact.telephone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                {...register('contact.email')}
                placeholder="contact@hotel.com"
                defaultValue={user?.email || ''}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.contact?.email && <p className="text-xs text-red-600 mt-1">{errors.contact.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
              <input
                type="url"
                {...register('contact.siteWeb')}
                placeholder="https://www.hotel.com"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-sand-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
              />
              {errors.contact?.siteWeb && <p className="text-xs text-red-600 mt-1">{errors.contact.siteWeb.message}</p>}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="bg-white rounded-2xl border border-sand-200 p-4 md:p-5 space-y-3 md:space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 text-sm md:text-base">Disponible à la réservation</span>
            <input type="checkbox" defaultChecked readOnly className="h-5 w-5 rounded accent-ocean-600" />
          </label>

          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-sand-300 hover:bg-sand-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || isSubmitting}
              className="flex-1 px-3 md:px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
            >
              {mutation.isPending ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </section>

        {/* Informations */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4">
          <h3 className="font-medium text-amber-900 mb-2">⚠️ Informations importantes</h3>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>• Les champs marqués d'une * sont obligatoires</li>
            <li>• L'établissement sera lié à votre compte utilisateur</li>
            <li>• Vous pourrez ajouter des chambres et des photos après publication</li>
          </ul>
        </section>
      </div>
    </form>
      {PopupComponent}
    </>
  );
}