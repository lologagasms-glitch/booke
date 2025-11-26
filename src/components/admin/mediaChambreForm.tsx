'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveChambreMedias, getChambreMedias, deleteChambreMedia } from '@/app/lib/services/media.services';
import { usePopup } from '../popup';
import { TrashIcon, ArrowPathIcon, ExclamationCircleIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Schéma Zod
const mediaSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long'),
  url: z.string().url('URL invalide'),
  type: z.enum(['image', 'video']),
  filename: z.string().min(1, 'Filename requis'),
});

const formSchema = z.object({
  chambreId: z.string().uuid('ID chambre invalide'),
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

interface MediaChambreFormProps {
  chambreId: string;
  onSuccess?: () => void;
}

export default function MediaChambreForm({ chambreId, onSuccess }: MediaChambreFormProps) {
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
    defaultValues: { chambreId, medias: [] },
  });

  const { fields: newMedias, append, remove: removeNewMedia } = useFieldArray({ 
    control, 
    name: 'medias' 
  });

  // useQuery pour charger les médias existants
  const { data: existingMedias, isLoading, error: queryError } = useQuery({
    queryKey: ['chambre-medias', chambreId],
    queryFn: () => getChambreMedias(chambreId),
    enabled: !!chambreId,
  });

  // useMutation pour sauvegarder les NOUVEAUX médias
  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await saveChambreMedias(data.chambreId, data.medias);
    },
    onSuccess: () => {
      setGlobalError(null);
      show({ type: 'success', message: 'Médias sauvegardés avec succès' });
      setValue('medias', []);
      queryClient.invalidateQueries({ queryKey: ['chambre-medias', chambreId] });
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
      return await deleteChambreMedia(mediaId);
    },
    onSuccess: () => {
      show({ type: 'success', message: 'Média supprimé avec succès' });
      queryClient.invalidateQueries({ queryKey: ['chambre-medias', chambreId] });
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

  // Composant badge de type
  const TypeBadge = ({ type }: { type: 'image' | 'video' }) => (
    <span className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white rounded ${
      type === 'video' ? 'bg-red-600' : 'bg-blue-600'
    }`}>
      {type === 'video' ? '📹 VIDÉO' : '🖼️ IMAGE'}
    </span>
  );

  // Composant MediaCard
  const ExistingMediaCard = ({ media }: { media: any }) => (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white relative">
      <div className="relative">
        <TypeBadge type={media.type as 'image' | 'video'} />
        {media.type === 'video' ? (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div 
            className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
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

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">{media.name}</h4>
        <div className="text-xs text-gray-500 space-y-1">
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
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des médias de la chambre</h2>
        </div>

        {globalError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2" role="alert">
            <ExclamationCircleIcon className="w-4 h-4" />
            {globalError}
          </div>
        )}
        {queryError && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg flex items-center gap-2" role="alert">
            <ExclamationCircleIcon className="w-4 h-4" />
            Impossible de charger les médias existants
          </div>
        )}

        {existingMedias?.medias && existingMedias.medias.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span>Médias existants</span>
              {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin text-gray-500" />}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingMedias.medias.map((media) => (
                <ExistingMediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 w-1/2 p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-100">Ajouter de nouveaux médias</h3>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Collez un lien YouTube ou une image..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                aria-label="Lien média"
              />
              <button
                type="button"
                onClick={validateAndAdd}
                disabled={isValidating || !currentUrl.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isValidating ? 'Validation...' : 'Ajouter'}
              </button>
            </div>
            {currentError && <p className="text-sm text-red-600" role="alert">{currentError}</p>}
          </div>

          {newMedias.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newMedias.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
                    <div className="relative">
                      <TypeBadge type={field.type as 'image' | 'video'} />
                      {field.type === 'video' ? (
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(field.url)}`}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div 
                          className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
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

                    <div className="space-y-2">
                      <Controller
                        name={`medias.${index}.name`}
                        control={control}
                        render={({ field: nameField }) => (
                          <input
                            {...nameField}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Nom du média"
                          />
                        )}
                      />
                      {errors.medias?.[index]?.name && (
                        <p className="text-sm text-red-600">{errors.medias[index].name?.message}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
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
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shrink-0"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {saveMutation.isPending ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> 
                  ) : null}
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder les nouveaux'}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
      {PopupComponent}

      {/* Modal Zoom */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeZoom}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="relative max-w-5xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
          >
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-10"
              aria-label="Fermer le zoom"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="flex justify-center items-center gap-4 mb-4">
              <button
                onClick={handleZoomOut}
                className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                aria-label="Dézoomer"
              >
                <MagnifyingGlassMinusIcon className="w-5 h-5" />
                <span>Dézoomer</span>
              </button>
              
              <span className="text-white font-medium min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                aria-label="Zoomer"
              >
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
                <span>Zoomer</span>
              </button>
            </div>

            <div className="overflow-auto max-h-[80vh] max-w-[90vw] flex items-center justify-center">
              <img
                src={zoomedImage}
                alt="Image agrandie"
                className="transition-transform duration-200 ease-in-out"
                style={{ transform: `scale(${zoomLevel})`, maxWidth: '100%', height: 'auto' }}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800?text=Image+Error'; }}
              />
            </div>
            
            <p className="text-white text-center mt-4 text-sm">
              Utilisez la molette de la souris ou les boutons pour zoomer/dézoomer. Cliquez en dehors de l'image pour fermer.
            </p>
          </div>
        </div>
      )}
    </>
  );
}