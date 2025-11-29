'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative, Parallax } from 'swiper/modules';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useCarousel from './useCarousel';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import 'swiper/css/parallax';
import { TransletText } from '../lib/services/translation/transletText';

export default function ModernCarousel() {
  const { data, isLoading } = useCarousel();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  if (isLoading) {
    return (
      <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden group">
      {/* Overlay radial pour profondeur */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCreative, Parallax]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.activeIndex);
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        spaceBetween={0}
        slidesPerView={1}
        loop
        speed={1200}
        parallax
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="creative"
        creativeEffect={{
          limitProgress: 3,
          prev: {
            opacity: 0.7,
            scale: 0.85,
            translate: ["-40%", 0, -400],
            // filter: "blur(5px)", // Removed – not allowed in CreativeEffectTransform
          },
          next: {
            opacity: 0.7,
            scale: 0.85,
            translate: ["40%", 0, -400],
          },
        }}
        className="w-full h-full"
      >
        {data?.map((img, index) => (
          <SwiperSlide key={img.id} className="relative overflow-hidden">
            {/* Background image avec parallax */}
            <div 
              data-swiper-parallax="50%" 
              className="absolute inset-0 transform scale-110"
            >
              <Image
                src={img.url}
                alt={img.type}
                fill
                className="object-cover transition-transform duration-1000"
                sizes="100vw"
                priority={index === 0}
              />
            </div>

            {/* Éléments de contenu avec parallax */}
            <div className="absolute inset-0 z-20 flex items-end p-8 md:p-12">
              <div 
                data-swiper-parallax="-300" 
                data-swiper-parallax-opacity="0"
                className="text-white max-w-2xl transform translate-y-8"
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                 <TransletText>{ 'Établissement'}</TransletText> 
                </h2>
                <p className="text-lg md:text-xl opacity-80">
                  <TransletText> { 'Découvrez nos espaces uniques'}</TransletText> 
                 
                </p>
              </div>
            </div>

            {/* Gradient overlay pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </SwiperSlide>
        ))}

        {/* Navigation custom avec HEROICONS */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
        >
          <ChevronRightIcon className="w-6 h-6 text-white" />
        </button>

        {/* Pagination custom (bulles animées) */}
        <div className="swiper-pagination !bottom-6 !flex !justify-center gap-3 z-30" />
      </Swiper>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((activeIndex + 1) / (data?.length || 1)) * 100}%` }}
        />
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-6 z-30 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="mx-2 text-white/40">/</span>
        <span>{String(data?.length || 0).padStart(2, '0')}</span>
      </div>
    </div>
  );
}