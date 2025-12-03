'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  saveChambreMedias, 
  getChambreMedias, 
  deleteChambreMedia 
} from '@/app/lib/services/media.services';
import { usePopup } from '../popup';
import { 
  TrashIcon, 
  ArrowPathIcon, 
  ExclamationCircleIcon, 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon, 
  XMarkIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/solid';

// Schémas Zod
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

  // Queries et mutations
  const { data: existingMedias, isLoading, error: queryError } = useQuery({
    queryKey: ['chambre-medias', chambreId],
    queryFn: () => getChambreMedias(chambreId),
    enabled: !!chambreId,
  });

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

  // Validation et ajout
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
    <span className={`absolute top-3 left-3 z-10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white rounded-full ${
      type === 'video' ? 'bg-rose-500' : 'bg-sky-500'
    } shadow-md`}>
      {type === 'video' ? (
        <span className="flex items-center gap-1">
          <VideoCameraIcon className="w-3.5 h-3.5" />
          Vidéo
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <PhotoIcon className="w-3.5 h-3.5" />
          Image
        </span>
      )}
    </span>
  );

  // Composant MediaCard
  const ExistingMediaCard = ({ media }: { media: any }) => (
    <div className="group border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative mb-3">
        <TypeBadge type={media.type as 'image' | 'video'} />
        {media.type === 'video' ? (
          <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden">
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
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error '; }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-base">{media.name}</h4>
        <div className="text-xs text-gray-500 space-y-1 font-mono">
          <p className="truncate">{media.filename}</p>
          <p className="truncate text-[10px] text-gray-400">{media.url}</p>
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
        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm group-hover:shadow-sm"
      >
        {deleteMutation.isPending ? (
          <ArrowPathIcon className="w-4 h-4 animate-spin" />
        ) : (
          <TrashIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
        )}
        <span>
          {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-sky-600">🎬</span>
            Gestion des médias de la chambre
          </h2>
        </div>

        {/* Alertes */}
        {globalError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-3 shadow-sm" role="alert">
            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{globalError}</span>
          </div>
        )}
        {queryError && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg flex items-center gap-3 shadow-sm" role="alert">
            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Impossible de charger les médias existants</span>
          </div>
        )}

        {/* Médias existants */}
        {existingMedias?.medias && existingMedias.medias.length > 0 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
              <span className="text-sky-600">📁</span>
              Médias existants
              {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin text-slate-500" />}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingMedias.medias.map((media) => (
                <ExistingMediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        )}

        {/* Section ajout */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-inner">
          <h3 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-3">
            <PlusCircleIcon className="w-5 h-5 text-emerald-600" />
            Ajouter de nouveaux médias
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Collez un lien YouTube ou une URL d'image..."
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all"
                aria-label="Lien média"
              />
              <button
                type="button"
                onClick={validateAndAdd}
                disabled={isValidating || !currentUrl.trim()}
                className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {isValidating ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircleIcon className="w-4 h-4" />
                )}
                <span>Ajouter</span>
              </button>
            </div>
            {currentError && (
              <p className="text-sm text-rose-600 font-medium flex items-center gap-2" role="alert">
                <ExclamationCircleIcon className="w-4 h-4" />
                {currentError}
              </p>
            )}
          </div>

          {/* Liste des nouveaux médias */}
          {newMedias.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {newMedias.map((field, index) => (
                  <div key={field.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="relative mb-4">
                      <TypeBadge type={field.type as 'image' | 'video'} />
                      {field.type === 'video' ? (
                        <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(field.url)}`}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div 
                          className="relative w-full aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-zoom-in"
                          onClick={() => openZoom(field.url)}
                        >
                          <img
                            src={field.url}
                            alt={field.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error '; }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Controller
                        name={`medias.${index}.name`}
                        control={control}
                        render={({ field: nameField }) => (
                          <input
                            {...nameField}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 transition-all"
                            placeholder="Nom du média"
                          />
                        )}
                      />
                      {errors.medias?.[index]?.name && (
                        <p className="text-sm text-rose-600 font-medium">{errors.medias[index].name?.message}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3 mt-3">
                      <div className="flex-1 min-w-0 font-mono">
                        <p className="truncate text-[11px]">{field.filename}</p>
                        <p className="truncate text-[10px] text-slate-400">{field.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNewMedia(index);
                        }}
                        className="ml-3 px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all duration-200 flex items-center gap-1.5 text-sm font-medium"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Retirer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                >
                  {saveMutation.isPending ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> 
                  ) : (
                    <CheckCircleIcon className="w-4 h-4" />
                  )}
                  <span>{saveMutation.isPending ? 'Sauvegarde en cours...' : 'Sauvegarder tous les médias'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </form>
      {PopupComponent}

      {/* Modal Zoom amélioré */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-opacity-95 backdrop-blur-sm"
          onClick={closeZoom}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="relative max-w-6xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
          >
            {/* Bouton fermeture */}
            <button
              onClick={closeZoom}
              className="absolute top-6 right-6 text-slate-100 bg-slate-800 bg-opacity-70 rounded-full p-3 hover:bg-opacity-90 transition-all duration-200 z-10 shadow-lg hover:shadow-xl"
              aria-label="Fermer le zoom"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Contrôles de zoom */}
            <div className="flex justify-center items-center gap-5 mb-5">
              <button
                onClick={handleZoomOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 bg-opacity-70 text-slate-100 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
                aria-label="Dézoomer"
              >
                <MagnifyingGlassMinusIcon className="w-5 h-5" />
                <span className="font-medium">Dézoomer</span>
              </button>
              
              <span className="text-slate-100 font-bold text-lg min-w-[80px] text-center bg-slate-800 bg-opacity-50 px-4 py-2 rounded-lg">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 bg-opacity-70 text-slate-100 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
                aria-label="Zoomer"
              >
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
                <span className="font-medium">Zoomer</span>
              </button>
            </div>

            {/* Image */}
            <div className="overflow-auto max-h-[80vh] max-w-[90vw] flex items-center justify-center bg-slate-900 rounded-lg shadow-2xl">
              <img
                src={zoomedImage}
                alt="Image agrandie"
                className="transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})`, maxWidth: '100%', height: 'auto' }}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800?text=Image+Error '; }}
              />
            </div>
            
            {/* Instructions */}
            <p className="text-slate-300 text-center mt-6 text-sm max-w-md mx-auto">
              Utilisez la molette de la souris ou les boutons pour zoomer/dézoomer. 
              Cliquez en dehors de l'image pour fermer.
            </p>
          </div>
        </div>
      )}
    </>
  );
}