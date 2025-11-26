'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveEtablissementMedias, getEtablissementMedias, deleteEtablissementMedia } from '@/app/lib/services/media.services';
import { usePopup } from '../popup';
import { TrashIcon, ArrowPathIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

// Schémas Zod
const mediaSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long'),
  url: z.string().url('URL invalide'),
  type: z.enum(['image', 'video']),
  filename: z.string().min(1, 'Filename requis'),
});

const formSchema = z.object({
  etablissementId: z.string().uuid('ID établissement invalide'),
  medias: z.array(mediaSchema).min(1, 'Au moins un média est requis'),
});

type FormData = z.infer<typeof formSchema>;

// Fonctions utilitaires
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[match.length - 1];
  }
  return null;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasValidExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  try { new URL(url); } catch { return false; }
  return hasValidExtension;
};

interface MediaEtablissementFormProps {
  etablissementId: string;
  onSuccess?: () => void;
}

export default function MediaEtablissementForm({ etablissementId, onSuccess }: MediaEtablissementFormProps) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { show, PopupComponent } = usePopup();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { etablissementId, medias: [] },
  });

  const { fields: newMedias, append, remove: removeNewMedia } = useFieldArray({ 
    control, 
    name: 'medias' 
  });

  // useQuery pour charger les médias existants
  const { data: existingMedias, isLoading, error: queryError } = useQuery({
    queryKey: ['etablissement-medias', etablissementId],
    queryFn: () => getEtablissementMedias(etablissementId),
    enabled: !!etablissementId,
  });

  // useMutation pour sauvegarder les NOUVEAUX médias
  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await saveEtablissementMedias(data.etablissementId, data.medias);
    },
    onSuccess: () => {
      setGlobalError(null);
      show({ type: 'success', message: 'Médias sauvegardés avec succès' });
      setValue('medias', []);
      queryClient.invalidateQueries({ queryKey: ['etablissement-medias', etablissementId] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      setGlobalError(error.message);
      show({ type: 'error', message: error.message });
    },
  });

  // useMutation pour supprimer les médias EXISTANTS
  const deleteMutation = useMutation({
    mutationFn: async (mediaId: string) => {
      return await deleteEtablissementMedia(mediaId);
    },
    onSuccess: () => {
      show({ type: 'success', message: 'Média supprimé avec succès' });
      queryClient.invalidateQueries({ queryKey: ['etablissement-medias', etablissementId] });
    },
    onError: (error: Error) => {
      show({ type: 'error', message: error.message });
    },
  });

  // Validation et ajout d'un NOUVEAU média
  const validateAndAdd = useCallback(() => {
    setCurrentError('');
    setIsValidating(true);
    const trimmedUrl = currentUrl.trim();
    const youtubeId = extractYouTubeId(trimmedUrl);
    const isImage = isValidImageUrl(trimmedUrl);
    
    let detectedType: 'video' | 'image' | null = null;
    let mediaId: string | null = null;

    if (youtubeId) {
      detectedType = 'video';
      mediaId = youtubeId;
    } else if (isImage) {
      detectedType = 'image';
      mediaId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (detectedType && mediaId) {
      const urlObj = new URL(trimmedUrl);
      const filename = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1) || `media_${Date.now()}`;
      
      append({
        name: `Media ${newMedias.length + 1}`,
        url: trimmedUrl,
        type: detectedType,
        filename,
      });
      
      setCurrentUrl('');
    } else {
      setCurrentError('Lien invalide. URL YouTube ou directe d\'image requise.');
    }
    setIsValidating(false);
  }, [currentUrl, newMedias.length, append]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') validateAndAdd();
  }, [validateAndAdd]);

  const onSubmit = (data: FormData) => {
    saveMutation.mutate(data);
  };

  // Fonctions de zoom
  const openZoom = (url: string) => {
    setZoomedImage(url);
    setZoomLevel(1);
  };

  const closeZoom = () => {
    setZoomedImage(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Composant badge de type (version minimaliste moderne)
  const TypeBadge = ({ type }: { type: 'image' | 'video' }) => (
    <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
      type === 'video' ? 'bg-red-500/10 text-red-700 border-red-200' : 'bg-blue-500/10 text-blue-700 border-blue-200'
    }`}>
      {type === 'video' ? '📹 VIDÉO' : '🖼️ IMAGE'}
    </span>
  );

  // Composant MediaCard existant
  const ExistingMediaCard = ({ media }: { media: any }) => (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="relative">
        <TypeBadge type={media.type as 'image' | 'video'} />
        {media.type === 'video' ? (
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-t-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div 
            className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
            onClick={() => openZoom(media.url)}
          >
            <img
              src={media.url}
              alt={media.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error'; }}
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{media.name}</h4>
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <p className="font-mono truncate">{media.filename}</p>
            <p className="truncate">{media.url}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            show({
              type: 'warning',
              message: 'Êtes-vous sûr de vouloir supprimer ce média ?',
              onAction: () => deleteMutation.mutate(media.id)
            });
          }}
          disabled={deleteMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <TrashIcon className="w-4 h-4" />
          <span>{deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Gestion des médias
          </h2>
        </div>

        {/* Messages d'erreur */}
        {globalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3" role="alert">
            <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-800 font-medium">{globalError}</span>
          </div>
        )}
        
        {queryError && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3" role="alert">
            <ExclamationCircleIcon className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800 font-medium">Impossible de charger les médias existants</span>
          </div>
        )}

        {/* Médias existants */}
        {existingMedias?.medias && existingMedias.medias.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <span>Médias existants</span>
                {isLoading && <ArrowPathIcon className="w-5 h-5 animate-spin text-gray-400" />}
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {existingMedias.medias.length} média{existingMedias.medias.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {existingMedias.medias.map((media) => (
                <ExistingMediaCard key={media.id} media={media} />
              ))}
            </div>
          </section>
        )}

        {/* Nouveaux médias */}
        <section className="space-y-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Ajouter de nouveaux médias</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Collez un lien YouTube ou une image..."
                className="flex-1 text-black px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                aria-label="Lien média"
              />
              <button
                type="button"
                onClick={validateAndAdd}
                disabled={isValidating || !currentUrl.trim()}
                className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isValidating ? (
                  <span className="flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Validation...
                  </span>
                ) : (
                  'Ajouter'
                )}
              </button>
            </div>
            {currentError && <p className="text-sm text-red-600 font-medium">{currentError}</p>}
          </div>

          {newMedias.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newMedias.map((field, index) => (
                  <div key={field.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                    <div className="relative">
                      <TypeBadge type={field.type as 'image' | 'video'} />
                      {field.type === 'video' ? (
                        <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-t-xl overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(field.url)}`}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div 
                          className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                          onClick={() => openZoom(field.url)}
                        >
                          <img
                            src={field.url}
                            alt={field.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error'; }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <Controller
                          name={`medias.${index}.name`}
                          control={control}
                          render={({ field: nameField }) => (
                            <input
                              {...nameField}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                              placeholder="Nom du média"
                            />
                          )}
                        />
                        {errors.medias?.[index]?.name && (
                          <p className="text-xs text-red-600 mt-1 font-medium">{errors.medias[index].name?.message}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono truncate">{field.filename}</p>
                          <p className="truncate">{field.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewMedia(index);
                          }}
                          className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          aria-label="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveMutation.isPending || newMedias.length === 0}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {saveMutation.isPending && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </>
          )}
        </section>
      </form>
      {PopupComponent}

      {/* Modal Zoom - Design moderne et professionnel */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeZoom}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
          >
            {/* Bouton fermer */}
            <button
              onClick={closeZoom}
              className="absolute -top-16 right-0 text-white/80 hover:text-white transition-colors duration-200"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-10 h-10" />
            </button>

            {/* Contrôles de zoom */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Dézoomer"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Zoomer"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="overflow-auto max-h-screen max-w-screen flex items-center justify-center p-6">
              <img
                src={zoomedImage}
                alt="Image agrandie"
                className="transition-transform duration-200 rounded-lg shadow-2xl"
                style={{ transform: `scale(${zoomLevel})`, maxWidth: '100%', height: 'auto' }}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800?text=Image+Error'; }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}