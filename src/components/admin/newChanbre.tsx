'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { create } from '@/app/lib/services/chambre.service';
import { chambreSchema } from '@/types';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { usePopup } from '../popup';

type FormValues = z.infer<typeof chambreSchema>;

const serviceOptions = [
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
];

const roomTypes = [
  { value: 'simple', label: 'Simple', desc: '1 lit simple' },
  { value: 'double', label: 'Double', desc: '1 lit double' },
  { value: 'suite', label: 'Suite', desc: 'Plusieurs pièces' },
];

export default function NewRoom({ etablissementId }: { etablissementId: string }) {
  const queryClient = useQueryClient();
  const { show, PopupComponent } = usePopup();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(chambreSchema),
    defaultValues: {
      disponible: true,
      services: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) =>
      create({
        ...data,
        etablissementId,
        services: data.services?.length ? data.services : null,
        mediaFiles: undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chambres'] });
      show({ type: 'success', message: 'Chambre créée avec succès.' });
      reset();
    },
    onError: () => show({ type: 'error', message: 'Erreur lors de la création.' }),
  });

  const watchedServices = watch('services') || [];
  const watchedDisponible = watch('disponible');

  const InputError = ({ field }: { field: keyof FormValues }) =>
    errors[field] ? (
      <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
        <ExclamationTriangleIcon className="h-4 w-4" />
        {errors[field]?.message}
      </p>
    ) : null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle chambre</h1>
          <p className="text-gray-600">Remplissez les informations ci-dessous pour ajouter une chambre.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-8 space-y-10">
            {/* Informations principales */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations principales</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de la chambre</label>
                  <input
                    {...register('nom')}
                    placeholder="Ex: Chambre Vue Mer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-100 focus:border-blue-500 text-black"
                  />
                  <InputError field="nom" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de chambre</label>
                  <div className="grid grid-cols-3 gap-3">
                    {roomTypes.map((rt) => (
                      <label
                        key={rt.value}
                        className="flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <input type="radio" value={rt.value} {...register('type')} className="mb-2" />
                        <span className="text-sm font-medium text-black">{rt.label}</span>
                        <span className="text-xs text-gray-500">{rt.desc}</span>
                      </label>
                    ))}
                  </div>
                  <InputError field="type" />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Décrivez la chambre, ses avantages, la vue, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-100 focus:border-blue-500 text-black"
                />
                <InputError field="description" />
              </div>
            </section>

            {/* Capacité & Prix */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacité et prix</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacité maximale</label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register('capacite', { valueAsNumber: true })}
                      min={1}
                      placeholder="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-100 focus:border-blue-500 text-black"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">pers.</span>
                  </div>
                  <InputError field="capacite" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix par nuit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      step={0.01}
                      {...register('prix', { valueAsNumber: true })}
                      placeholder="150.00"
                      className="w-full pl-8 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-blue-100 focus:border-blue-500 text-black"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/nuit</span>
                  </div>
                  <InputError field="prix" />
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Services et équipements</h2>
              <Controller
                name="services"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {serviceOptions.map((s) => {
                      const selected = field.value?.includes(s.key);
                      return (
                        <button
                          type="button"
                          key={s.key}
                          onClick={() =>
                            field.onChange(
                              selected
                                ? field.value?.filter((v) => v !== s.key)
                                : [...(field.value || []), s.key]
                            )
                          }
                          className={`p-3 rounded-md border transition ${selected
                              ? 'bg-blue-50 border-blue-300 shadow-sm'
                              : 'bg-white border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-sm font-medium text-black">{s.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </section>

            {/* Disponibilité */}
            <section>
              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  {...register('disponible')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-100"
                />
                <div>
                  <h3 className="font-medium text-gray-900">Disponible à la réservation</h3>
                  <p className="text-sm text-gray-600">Si coché, la chambre sera visible et réservable par les clients.</p>
                </div>
              </label>
              <input type="hidden" {...register('etablissementId')} value={etablissementId} />
            </section>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-100">
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
                    En cours...
                  </span>
                ) : (
                  'Créer la chambre'
                )}
              </button>

              {mutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    Une erreur est survenue lors de la création.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {PopupComponent}
    </div>
  );
}