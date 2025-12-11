'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { StarIcon as StarSolid, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Testimonial = {
  id: number;
  nameKey: string;
  locationKey: string;
  rating: number;
  commentKey: string;
  establishmentKey: string;
  type: string;
  avatar: string;
};

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
  autoplay?: boolean;
  loop?: boolean;
}

export default function TestimonialSlider({ 
  testimonials = [],
  autoplay = true,
  loop = true 
}: TestimonialSliderProps) {
  const { locale } = useParams() as { locale: string };

  // Si pas de témoignages
  if (!testimonials.length) return null;

  return (
    <section className="relative py-20 sm:py-28 bg-theme-base overflow-hidden">
      {/* Fond architectural subtil sans dégradé */}
      <div className="absolute inset-0 bg-theme-base" />
      
      {/* En-tête */}
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center">
          <div className="inline-flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolid key={star} className="w-6 h-6 text-yellow-500" />
            ))}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-theme-main mb-4 leading-tight">
            <TransletText>Ce que nos clients disent</TransletText>
          </h2>
          <p className="text-lg sm:text-xl text-theme-main max-w-2xl mx-auto">
            <TransletText>Des milliers d'expériences satisfaisantes</TransletText>
          </p>
        </div>
      </motion.div>

      {/* Slider Container */}
      <div className="relative max-w-7xl mx-auto px-0 sm:px-12">
        <Swiper
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          loop={loop && testimonials.length > 3}
          autoplay={autoplay ? {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          } : false}
          mousewheel={{ 
            forceToAxis: true,
            thresholdDelta: 30,
          }}
          keyboard={{ enabled: true }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: '.testimonial-next',
            prevEl: '.testimonial-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          grabCursor={true}
          className="py-8"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.id}>
              <motion.article 
                className="bg-theme-card/80 backdrop-blur rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 h-full"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (index % 3), type: 'spring', stiffness: 100 }}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.nameKey}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-theme-main truncate">
                      <TransletText>{testimonial.nameKey}</TransletText>
                    </h3>
                    <p className="text-sm text-theme-main flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      <TransletText>{testimonial.locationKey}</TransletText>
                    </p>
                  </div>
                </div>

                {/* Étoiles */}
                <div className="flex items-center gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    star <= testimonial.rating ? (
                      <StarSolid key={star} className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <StarOutline key={star} className="w-5 h-5 text-gray-300" />
                    )
                  ))}
                </div>

                {/* Commentaire */}
                <blockquote className="relative mb-6">
                  <span className="absolute -top-3 -left-2 text-5xl text-gray-200 select-none">"</span>
                  <p className="text-base sm:text-lg text-theme-main leading-relaxed pl-4">
                    <TransletText>{testimonial.commentKey}</TransletText>
                  </p>
                </blockquote>

                {/* Établissement reference */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    testimonial.type === 'hotel' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <BuildingOfficeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-theme-main uppercase tracking-wide font-medium">
                      {testimonial.type === 'hotel' ? 'Hôtel' : 'Loisirs'}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-theme-main truncate">
                      <TransletText>{testimonial.establishmentKey}</TransletText>
                    </p>
                  </div>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}

          {/* Navigation Boutons - Glassmorphism */}
          <button className="testimonial-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-theme-btn/80 backdrop-blur border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-theme-btn transition-all cursor-pointer">
            <svg className="w-5 h-5 text-theme-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="testimonial-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-theme-btn/80 backdrop-blur border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-theme-btn transition-all cursor-pointer">
            <svg className="w-5 h-5 text-theme-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Swiper>

        {/* Pagination custom position */}
        <div className="swiper-pagination testimonial-pagination mt-8 sm:mt-10" />
      </div>
    </section>
  );
}