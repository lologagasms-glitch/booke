'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow, EffectCube, EffectFlip } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-flip';
import useCarousel from './useCarousel';

const effects = [EffectFade, EffectCoverflow, EffectCube, EffectFlip];
const effectNames = ['fade', 'coverflow', 'cube', 'flip'] as const;

export default function Carousel() {
  const { data, isLoading } = useCarousel();

  if (isLoading)
    return (
      <div className="w-full aspect-[21/9] skeleton rounded-lg" />
    );

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, ...effects]}
      spaceBetween={0}
      slidesPerView={1}
      loop
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      effect={effectNames[Math.floor(Math.random() * effectNames.length)]}
      className="w-full aspect-[21/9] rounded-xl overflow-hidden"
    >
      {data?.map((img) => (
        <SwiperSlide key={img.id} className="bg-black/20 backdrop-blur-lg">
          <Image
            src={img.url}
            alt={img.type}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}