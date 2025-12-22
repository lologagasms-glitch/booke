'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import clsx from 'clsx';
import { getEtablissementById, updateEtablissement } from '@/app/lib/services/etablissement.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { usePopup } from '../popup';
import FileUploadModern from './ImageInput';
import { useFileUploadWithOptions } from './useSaveFilfe';

// Schéma de validation
const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
  adresse: z.string().min(5, 'Adresse invalide').max(200, 'Adresse trop longue'),
  ville: z.string().min(2, 'Ville invalide').max(50, 'Ville trop longue'),
  pays: z.string().min(2, 'Pays invalide').max(50, 'Pays trop long'),
  type: z.enum(['hotel', 'auberge', 'villa', 'residence']),
  etoiles: z.number().min(0).max(5, 'Maximum 5 étoiles').optional(),
  telephone: z.string().refine(
    (val) => {
      const clean = val.replace(/[\s\-\(\)\.]/g, '');
      const frenchFormat = /^0[1-9]\d{8}$/.test(clean);
      const frenchIntlFormat = /^\+33[1-9]\d{8}$/.test(clean);
      const usFormat = /^\(\d{3}\)\s?\d{3}-\d{4}$/.test(val);
      return frenchFormat || frenchIntlFormat || usFormat;
    },
    { message: 'Format invalide. Utilisez : 0123456789, +33123456789 ou (392) 885-0243' }
  ),
  email: z.string().email('Email invalide').max(100, 'Email trop long'),
  siteWeb: z.string().url('URL invalide').max(200, 'URL trop longue').optional().or(z.literal('')),
  description: z.string().min(20, 'Description trop courte (min 20 caractères)'),
  services: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Props = { id: string };

const serviceIcons: Record<string, string> = {
  'wifi gratuit': '📶', climatisation: '❄️', minibar: '🧊', coffre: '🔒',
  'sèche-cheveux': '💇‍♀️', baignoire: '🛁', douche: '🚿', 'vue sur mer': '🌊',
  'vue sur montagne': '🏔️', balcon: '🌅', terrasse: '🍹', spa: '🧖‍♀️',
  piscine: '🏊', restaurant: '🍽️', 'salle de sport': '🏋️', parking: '🚗',
  'petit-déjeuner inclus': '🥐', 'service en chambre': '🛏️', concierge: '🧑‍💼',
  blanchisserie: '👔', jardin: '🌳', ascenseur: '🛗',
};

function ServiceTile({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={clsx(
        'flex flex-col items-center justify-center gap-2 w-full px-4 py-4 rounded-2xl border text-sm font-medium transition-colors',
        selected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
      )}
    >
      <span className="text-2xl">{serviceIcons[label] ?? '⋅'}</span>
      <span className="text-center capitalize leading-tight">{label}</span>
    </button>
  );
}

function StarStepProgress({ value, onChange }: { value: number; onChange: (stars: number) => void }) {
  const handleStepClick = (starValue: number) => onChange(starValue);

  return (
    <div className="w-full md:w-3/4 lg:w-1/2">
      <div className="relative px-2 sm:px-4">
        <div className="relative flex justify-between items-start">
          {[
            { threshold: 1, name: '★ 1', smName: '★ 1 étoile' },
            { threshold: 2, name: '★★ 2', smName: '★★ 2 étoiles' },
            { threshold: 3, name: '★★★ 3', smName: '★★★ 3 étoiles' },
            { threshold: 4, name: '★★★★ 4', smName: '★★★★ 4 étoiles' },
            { threshold: 5, name: '★★★★★ 5', smName: '★★★★★ 5 étoiles' }
          ].map((step) => {
            const isCompleted = step.threshold <= value;
            const isActive = step.threshold === value;
            return (
              <div
                key={step.threshold}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => handleStepClick(step.threshold)}
              >
                <div className={clsx(
                  "relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-md border-2",
                  isActive ? 'scale-110 border-white bg-gradient-to-br from-amber-600 to-yellow-500 animate-pulse'
                    : isCompleted ? 'border-white bg-gradient-to-br from-amber-500 to-yellow-400'
                    : 'border-gray-300 bg-white group-hover:border-amber-400'
                )}>
                  <span className={clsx(
                    "text-sm sm:text-lg transition-all",
                    isActive || isCompleted ? 'text-white drop-shadow' : 'text-gray-400 group-hover:text-amber-500'
                  )}>
                    {isCompleted ? '⭐' : '☆'}
                  </span>
                </div>
                <span className={clsx(
                  "text-xs sm:text-sm font-medium text-center transition-colors max-w-16 sm:max-w-20",
                  isActive ? 'text-amber-900 font-bold' : isCompleted ? 'text-amber-700' : 'text-gray-500 group-hover:text-amber-600'
                )}>
                  <span className="hidden sm:inline">{step.smName}</span>
                  <span className="sm:hidden">{step.name}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function UpdateEstablishmentForm({ id }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { locale } = useParams();
  const mutationFile = useFileUploadWithOptions();
  const { show, PopupComponent } = usePopup();

  const { data: etablissement, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['etablissement', id],
    queryFn: () => getEtablissementById(id),
    enabled: !!id,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitted },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nom: '',
      adresse: '',
      ville: '',
      pays: '',
      type: 'hotel',
      etoiles: 0,
      description: '',
      telephone: '',
      email: '',
      siteWeb: '',
      services: [],
    },
  });

  useEffect(() => {
    if (isSuccess && etablissement) {
      reset({
        nom: etablissement.nom || '',
        adresse: etablissement.adresse || '',
        ville: etablissement.ville || '',
        pays: etablissement.pays || '',
        type: (etablissement.type === 'autre' ? 'hotel' : etablissement.type) as FormValues['type'],
        etoiles: etablissement.etoiles || 0,
        description: etablissement.description || '',
        telephone: etablissement.contact?.telephone || '',
        email: etablissement.contact?.email || '',
        siteWeb: etablissement.contact?.siteWeb || '',
        services: etablissement.services || [],
      });
    }
  }, [isSuccess, etablissement, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updateEtablissement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etablissements'] });
      queryClient.invalidateQueries({ queryKey: ['etablissement', id] });
      show({
        title: 'Modification réussie',
        message: 'L’établissement a été mis à jour avec succès !',
        type: 'success',
      });
      router.push(`/${locale}/admin`);
      router.refresh();
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (isError) return (
    <div className="min-h-[60vh] flex items-center justify-center text-red-600">
      <p>❌ Erreur lors du chargement</p>
    </div>
  );

  if (!isSuccess || !etablissement) return null;

  const ErrorMessage = ({ field }: { field: keyof FormValues }) =>
    errors[field] && isSubmitted ? (
      <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
        <span>⚠️</span>
        {errors[field]?.message}
      </p>
    ) : null;

  const inputClass = (field: keyof FormValues) =>
    clsx(
      "w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-black",
      errors[field] && isSubmitted ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
    );

  const handleSave = async (files: File[]) => {
    await mutationFile.mutate({
      files,
      nom: etablissement.nom,
      id: etablissement.id,
      nomParent: "",
      type: "etablissement",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🏨</span>
            Modifier l'établissement
          </h1>
          <span className={clsx(
            'px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full font-medium shadow-sm whitespace-nowrap',
            isDirty ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          )}>
            {isDirty ? 'Modifications détectées' : 'À jour'}
          </span>
        </div>
      </div>

      {Object.keys(errors).length > 0 && isSubmitted && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm font-medium text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            Veuillez corriger les {Object.keys(errors).length} erreur(s) ci-dessous
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <span className="text-xl sm:text-2xl">📍</span>
            Informations générales
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>🏨</span>
                Nom de l'établissement
              </label>
              <input {...register('nom')} className={inputClass('nom')} placeholder="Hôtel Les Flots Bleus" />
              <ErrorMessage field="nom" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>★</span>
                Catégorie
              </label>
              <select {...register('type')} className={inputClass('type')}>
                <option value="hotel">Hôtel</option>
                <option value="auberge">Auberge</option>
                <option value="villa">Villa</option>
                <option value="residence">Résidence</option>
              </select>
              <ErrorMessage field="type" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>⭐</span>
                Étoiles
              </label>
              <Controller
                name="etoiles"
                control={control}
                render={({ field }) => <StarStepProgress value={field.value || 0} onChange={field.onChange} />}
              />
              <ErrorMessage field="etoiles" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>📍</span>
                Adresse complète
              </label>
              <input {...register('adresse')} className={inputClass('adresse')} placeholder="123 Rue de la Mer, La Rochelle" />
              <ErrorMessage field="adresse" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>🌍</span>
                Pays
              </label>
              <input {...register('pays')} className={inputClass('pays')} placeholder="France" />
              <ErrorMessage field="pays" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>📍</span>
                Ville
              </label>
              <input {...register('ville')} className={inputClass('ville')} placeholder="La Rochelle" />
              <ErrorMessage field="ville" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <span className="text-xl sm:text-2xl">📞</span>
            Contact
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>📞</span>
                Téléphone
              </label>
              <input {...register('telephone')} className={inputClass('telephone')} placeholder="0123456789" inputMode="numeric" />
              <ErrorMessage field="telephone" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>✉️</span>
                Email
              </label>
              <input {...register('email')} type="email" className={inputClass('email')} placeholder="contact@hotel.com" />
              <ErrorMessage field="email" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <span>🌐</span>
                Site Web
              </label>
              <input {...register('siteWeb')} type="url" className={inputClass('siteWeb')} placeholder="https://hotel.com" />
              <ErrorMessage field="siteWeb" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">Services & équipements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(serviceIcons).map(([label, icon]) => (
              <Controller
                key={label}
                name="services"
                control={control}
                render={({ field }) => (
                  <ServiceTile
                    label={label}
                    selected={field.value?.includes(label) || false}
                    onToggle={() => {
                      const hasService = field.value?.includes(label);
                      const newServices = hasService
                        ? field.value?.filter((s) => s !== label) || []
                        : [...(field.value || []), label];
                      field.onChange(newServices);
                    }}
                  />
                )}
              />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">Description</h2>
          <div>
            <textarea
              {...register('description')}
              rows={6}
              className={inputClass('description')}
              placeholder="Décrivez l'ambiance, les points forts, l'emplacement..."
            />
            <div className="flex justify-between mt-2">
              <ErrorMessage field="description" />
              <span className={clsx(
                "text-xs text-gray-500",
                watch('description')?.length > 450 && 'text-amber-600 font-medium',
                watch('description')?.length > 490 && 'text-red-600 font-bold'
              )}>
                {watch('description')?.length || 0} / 500
              </span>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={clsx(
                "px-5 py-3 rounded-xl transition flex items-center justify-center gap-3 shadow-md",
                mutation.isPending
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
              )}
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder les modifications'
              )}
            </button>
          </div>
        </div>
      </form>

      {PopupComponent}

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Téléchargement de fichiers
          </h1>
          <FileUploadModern
            handleSave={handleSave}
            maxSize={10 * 1024 * 1024}
            acceptedTypes="image/*,.pdf,.doc,.docx"
            isLoading={mutationFile.isPending}
            isSuccess={mutationFile.isSuccess}
          />
        </div>
      </div>
    </div>
  );
}