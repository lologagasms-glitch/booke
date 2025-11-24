'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// ✅ INTERFACE CORRIGÉE
interface Media {
  id: string
  url: string
  filename: string
  type: "image" | "video"
  createdAt: Date // Ajout de la propriété manquante
  chambreId?: string // Optionnel
}

interface MediaModalProps {
  media: Media
  onClose: () => void
  getYouTubeEmbedUrl: (url: string) => string | null
}

export default function MediaModal({ media, onClose, getYouTubeEmbedUrl }: MediaModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const isYouTube = media.type === 'video' && getYouTubeEmbedUrl(media.url)

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>

        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {media.type === 'image' ? (
            <img
              src={media.url}
              alt={media.filename}
              className="w-full h-auto max-h-[85vh] object-contain"
              onLoad={() => setIsLoading(false)}
            />
          ) : isYouTube ? (
            <div className="relative aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(media.url)!}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <video
              src={media.url}
              controls
              className="w-full h-auto max-h-[85vh] object-contain"
              onLoadedData={() => setIsLoading(false)}
            />
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm font-medium truncate max-w-xs md:max-w-lg">
            {media.filename}
          </p>
        </div>
      </div>
    </div>
  )
}