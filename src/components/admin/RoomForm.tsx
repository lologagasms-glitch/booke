'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { getChambreById, update, create, getEtablissementAndChambreWithMedia } from '@/app/lib/services/chambre.service';
import { chambreSchema } from '@/types';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { usePopup } from '../popup';
import FileUploadModern from './ImageInput';
import { useFileUploadWithOptions } from './useSaveFilfe';

const schema = chambreSchema;
type FormValues = z.infer<typeof schema>;

export default function RoomForm({ etablissementId, id }: { etablissementId: string; id?: string }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show, PopupComponent } = usePopup();
  const mutationFile = useFileUploadWithOptions();

  const { data: defaultChambreWithEtab, isLoading, isError } = useQuery({
    queryKey: ['chambres', id],
    queryFn: async () => {
      if (id) return getEtablissementAndChambreWithMedia(etablissementId, id);
      return Promise.resolve(undefined);
    },
    enabled: !!id,
  });

  const defaultValuesChambre = defaultChambreWithEtab?.chambre;
  const defaultValuesEtab = defaultChambreWithEtab?.etablissement;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: undefined,
  });

  useEffect(() => {
    if (defaultValuesChambre) reset(defaultValuesChambre);
  }, [defaultValuesChambre, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => id ? update(id, data) : create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chambres'] });
      setIsSubmitting(false);
      show({ type: 'success', message: id ? 'Chambre mise à jour avec succès.' : 'Chambre créée avec succès.' });
      if (!id) reset();
    },
    onError: () => {
      setIsSubmitting(false);
      show({ type: 'error', message: 'Erreur lors de la sauvegarde.' });
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  const serviceOptions = useMemo(() => [
    { key: 'wifi', label: 'WiFi', icon: '📶' },
    { key: 'television', label: 'Télévision', icon: '📺' },
    { key: 'minibar', label: 'Minibar', icon: '🥤' },
    { key: 'climatisation', label: 'Climatisation', icon: '❄️' },
    { key: 'jacuzzi', label: 'Jacuzzi', icon: '🛁' },
    { key: 'balcon', label: 'Balcon', icon: '🌅' },
    { key: 'vue sur mer', label: 'Vue sur mer', icon: '🌊' },
    { key: 'coffre-fort', label: 'Coffre-fort', icon: '🔒' },
    { key: 'sèche-cheveux', label: 'Sèche-cheveux', icon: '💇' },
    { key: 'petit-déjeuner inclus', label: 'Petit-déjeuner', icon: '🍳' },
  ], []);

  const roomTypes = [
    { value: 'simple', label: 'Simple', description: '1-2 pers.' },
    { value: 'double', label: 'Double', description: '2-3 pers.' },
    { value: 'suite', label: 'Suite', description: '2-4 pers.' },
  ];

  const handleSave = async (files: File[]) => {
    await mutationFile.mutate({
      files,
      nom: defaultValuesChambre?.nom || "",
      id: defaultValuesChambre?.id || "",
      nomParent: defaultValuesEtab?.nom || "",
      type: "chambre",
    });
  };

  const watchedServices = watch('services') || [];
  const watchedDisponible = watch('disponible');

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border">
      <div className="flex flex-col items-center space-y-4">
        <ArrowPathIcon className="h-10 w-10 animate-spin text-gray-600" />
        <p className="text-gray-600">Chargement de la chambre...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-red-500 mb-3" />
      <h3 className="text-lg font-medium text-red-800 mb-1">Erreur de chargement</h3>
      <p className="text-red-600 mb-4">Impossible de charger les données de la chambre.</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {defaultValuesChambre ? 'Modifier la chambre' : 'Créer une nouvelle chambre'}
          </h1>
          <p className="text-gray-600">Définissez les caractéristiques et services de votre chambre</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            {/* Informations principales */}
            <div className="space-y-6 border-b border-gray-100 pb-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom de la chambre</label>
                  <input
                    {...register('nom')}
                    className={`w-full px-4 py-2.5 border rounded-md transition-colors text-black ${errors.nom ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'}`}
                    placeholder="Ex: Chambre Vue Mer"
                  />
                  {errors.nom && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.nom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type de chambre</label>
                  <div className="grid grid-cols-3 gap-3">
                    {roomTypes.map((roomType) => (
                      <label key={roomType.value} className="flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input type="radio" value={roomType.value} {...register('type')} className="mb-2 text-blue-600" />
                        <span className="text-sm font-medium text-center text-black">{roomType.label}</span>
                        <span className="text-xs text-gray-500">{roomType.description}</span>
                      </label>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-md resize-none transition-colors text-black ${errors.description ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'}`}
                  placeholder="Décrivez la chambre, ses avantages, la vue, etc."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Capacité & Tarification */}
            <div className="space-y-6 border-b border-gray-100 pb-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Capacité & Tarification</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Capacité maximale</label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register('capacite', { valueAsNumber: true })}
                      className={`w-full px-4 py-2.5 border rounded-md transition-colors text-black ${errors.capacite ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'}`}
                      min={1}
                      placeholder="2"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">pers.</span>
                  </div>
                  {errors.capacite && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.capacite.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Prix par nuit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      step={0.01}
                      {...register('prix', { valueAsNumber: true })}
                      className={`w-full pl-8 pr-10 py-2.5 border rounded-md transition-colors text-black ${errors.prix ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'}`}
                      min={0}
                      placeholder="150.00"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">/nuit</span>
                  </div>
                  {errors.prix && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.prix.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6 border-b border-gray-100 pb-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Services et équipements</h2>
              <Controller
                name="services"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {serviceOptions.map((service) => {
                      const isSelected = (field.value || []).includes(service.key);
                      return (
                        <button
                          type="button"
                          key={service.key}
                          onClick={() => {
                            const currentServices = field.value || [];
                            const arr = isSelected
                              ? currentServices.filter((v: string) => v !== service.key)
                              : [...currentServices, service.key];
                            field.onChange(arr);
                          }}
                          className={`p-4 rounded-md border text-sm transition-all ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xl">{service.icon}</span>
                            <span className="font-medium text-center text-black">{service.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Disponibilité */}
            <div className="space-y-6">
              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('disponible')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-100"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Disponible à la réservation</h3>
                  <p className="text-sm text-gray-600">Cette chambre peut être réservée par les clients</p>
                </div>
              </label>
              <input type="hidden" {...register('etablissementId')} value={etablissementId} />
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-100 mt-8">
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className={`w-full py-3 px-4 rounded-md font-medium transition-all ${isSubmitting || mutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                  }`}
              >
                {isSubmitting || mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </span>
                ) : defaultValuesChambre ? (
                  'Mettre à jour la chambre'
                ) : (
                  'Créer la chambre'
                )}
              </button>

              {mutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    Une erreur est survenue lors de la sauvegarde.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
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