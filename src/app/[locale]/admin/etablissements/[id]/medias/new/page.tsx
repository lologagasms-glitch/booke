'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  PhotoIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  LinkIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useParams, useRouter } from 'next/navigation';
import {
  addEtablissementMediasAction,
  getEtablissementByIdAction,
} from '@/app/lib/services/actions/etablissements';

type MediaInput = { url: string; type: 'image' | 'video'; caption?: string };

export default function EtablissementMediaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [previews, setPreviews] = useState<MediaInput[]>([]);
  const [linkInput, setLinkInput] = useState('');

  const { data: resultEtablissement, isLoading: loadingEtablissement } = useQuery({
    queryKey: ['etablissement', id],
    queryFn: () => getEtablissementByIdAction({ id }),
    staleTime: 5 * 60 * 1000,
  });
  const etablissement = resultEtablissement?.data?.data;

  const upload = useMutation({
    mutationFn: (medias: MediaInput[]) =>
      addEtablissementMediasAction({ etablissementId: id as string, medias }),
    onSuccess: () => {
      toast.success('Médias publiés ✨');
      queryClient.invalidateQueries({ queryKey: ['etablissement', id] });
      router.push(`/${id}/medias`);
    },
    onError: () => toast.error('Erreur lors de la publication'),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews: MediaInput[] = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video',
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const handleAddLink = useCallback(() => {
    const trimmed = linkInput.trim();
    if (!trimmed) return toast.error('Lien invalide');
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(trimmed);
    if (!isImage && !isVideo) return toast.error('Lien non supporté (image ou vidéo)');
    const newMedia: MediaInput = { url: trimmed, type: isImage ? 'image' : 'video' };
    setPreviews((prev) => [...prev, newMedia]);
    setLinkInput('');
  }, [linkInput]);

  const handlePublish = useCallback(() => {
    if (previews.length === 0) return toast.error('Aucun média sélectionné');
    upload.mutate(previews);
  }, [previews, upload]);

  const removePreview = useCallback((index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const isUploading = upload.isPending;

  const memoizedMediaCards = useMemo(
    () =>
      previews.map((media, idx) => (
        <MediaCard
          key={`${media.url}-${idx}`}
          media={media}
          onRemove={() => removePreview(idx)}
        />
      )),
    [previews, removePreview]
  );

  if (loadingEtablissement)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse" />
      </div>
    );

  if (!etablissement)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center text-white">
        <p>Établissement introuvable</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ajouter des médias pour {etablissement.nom}</h1>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-slate-600 hover:border-slate-400'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300">
            {isDragActive
              ? 'Relâchez les fichiers ici…'
              : 'Glissez-déposez des images ou vidéos, ou cliquez pour sélectionner'}
          </p>
        </div>

        {/* Link input */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="text"
            placeholder="Coller un lien image ou vidéo…"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleAddLink}
            disabled={!linkInput.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <LinkIcon className="h-5 w-5" />
            Ajouter
          </button>
        </div>

        {/* Previews */}
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memoizedMediaCards}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handlePublish}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isUploading ? 'Publication…' : 'Publier'}
                </button>
                <button
                  onClick={() => setPreviews([])}
                  className="px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MediaCard({ media, onRemove }: { media: MediaInput; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ scale: 1.03 }}
      className="relative rounded-xl overflow-hidden shadow-lg group"
    >
      {media.type === 'image' ? (
        <img
          src={media.url}
          className="w-full h-full object-cover"
          alt="preview"
          loading="lazy"
        />
      ) : (
        <video
          src={media.url}
          className="w-full h-full object-cover"
          controls
          muted
          playsInline
        />
      )}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-xs flex items-center gap-1">
        {media.type === 'image' ? (
          <PhotoIcon className="h-4 w-4" />
        ) : (
          <VideoCameraIcon className="h-4 w-4" />
        )}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 left-2 bg-red-600/80 backdrop-blur p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
        aria-label="Remove media"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
