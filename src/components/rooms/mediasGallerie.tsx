'use client'

import { useState, useEffect } from 'react'
import { PlayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import MediaModal from './mediaModal'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/effect-fade'

// ✅ INTERFACE CORRIGÉE
interface Media {
  id: string
  url: string
  filename: string
  type: "image" | "video"
  createdAt: Date // Ajout de la propriété manquante
  chambreId?: string // Optionnel si vous en avez besoin
  etablissementId?: string // Optionnel pour les médias d'établissement
}

interface MediaGalleryProps {
  medias: Media[] | undefined
}

export default function MediaGallery({ medias }: MediaGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:v=|\.be\/)([^&]+)/)?.[1]
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-4">
      {/* Main Large View */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg relative group">
        <Swiper
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties}
          spaceBetween={10}
          navigation={true}
          effect={'fade'}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, EffectFade]}
          className="h-full w-full"
        >
          {medias.map((media) => (
            <SwiperSlide key={media.id} className="bg-black flex items-center justify-center">
              {media.type === 'image' ? (
                <div
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => setSelectedMedia(media)}
                >
                  <img
                    src={media.url}
                    alt={media.filename}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {getYouTubeEmbedUrl(media.url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(media.url)!}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <p className="text-white">Vidéo non disponible</p>
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails Strip */}
      <div className="h-24 w-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-full w-full thumbs-gallery"
          direction="horizontal"
          breakpoints={{
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
        >
          {medias.map((media) => (
            <SwiperSlide
              key={media.id}
              className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all opacity-60 hover:opacity-100 [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-blue-600"
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={media.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={getYouTubeThumbnail(media.url) || ''}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Fullscreen Modal for Images */}
      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          getYouTubeEmbedUrl={getYouTubeEmbedUrl}
        />
      )}
    </div>
  )
}