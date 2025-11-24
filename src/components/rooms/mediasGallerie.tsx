'use client'

import { useState } from 'react'
import { PlayIcon, PhotoIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import MediaModal from './mediaModal'

// ✅ INTERFACE CORRIGÉE
interface Media {
  id: string
  url: string
  filename: string
  type: "image" | "video"
  createdAt: Date // Ajout de la propriété manquante
  chambreId?: string // Optionnel si vous en avez besoin
}

interface MediaGalleryProps {
  medias: Media[] | undefined
}

export default function MediaGallery({ medias }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  if (!medias || medias.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-xl">
        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Aucun média disponible pour cette chambre</p>
      </div>
    )
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?rel=0&modestbranding=1` : null
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {medias.map((media) => (
          <div
            key={media.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => setSelectedMedia(media)}
          >
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.filename}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="relative w-full h-full">
                {getYouTubeEmbedUrl(media.url) ? (
                  <img
                    src={`https://img.youtube.com/vi/${media.url.match(/(?:v=|\.be\/)([^&]+)/)?.[1]}/maxresdefault.jpg`}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <ArrowsPointingOutIcon className="w-4 h-4 text-gray-700" />
            </div>

            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md flex items-center gap-1">
              {media.type === 'video' ? (
                <PlayIcon className="w-3 h-3 text-white" />
              ) : (
                <PhotoIcon className="w-3 h-3 text-white" />
              )}
              <span className="text-xs text-white capitalize">{media.type}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          getYouTubeEmbedUrl={getYouTubeEmbedUrl}
        />
      )}
    </>
  )
}