// components/PartnersSlider.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowTopRightOnSquareIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';
import Link from 'next/link';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Partner = {
  name: string;
  logo: string;
  website: string;
  description: string;
};

interface PartnersSliderProps {
  partners?: Partner[];
  autoplay?: boolean;
  loop?: boolean;
}

export default function PartnersSlider({
  partners = [],
  autoplay = true,
  loop = true
}: PartnersSliderProps) {
  const { locale } = useParams() as { locale: string };

  if (!partners.length) return null;

  return (
    <section className="relative py-20 sm:py-28  overflow-hidden">
      {/* Fond subtil sans dégradé */}
      <div className="absolute inset-0 " />
      
      {/* Container centré */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête centré */}
        <motion.header
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase">
              <TransletText>Nos partenaires de confiance</TransletText>
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 mb-4">
            <TransletText>Ils nous font </TransletText><span className="text-blue-600"><TransletText>confiance </TransletText> </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            <TransletText>Des leaders du secteur qui choisissent Evasion pour booster leurs réservations</TransletText>
          </p>
        </motion.header>

        {/* Swiper centré avec espacement réduit */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            loop={loop && partners.length > 3}
            autoplay={autoplay ? {
              delay: 4000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            } : false}
            mousewheel={{
              forceToAxis: true,
              thresholdDelta: 30,
              sensitivity: 1,
            }}
            keyboard={{ enabled: true }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: '.partner-next',
              prevEl: '.partner-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
            }}
            grabCursor={true}
            className="py-8"
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={`${partner.name}-${index}`}>
                <motion.article
                  className="group bg-white/90 backdrop-blur rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 sm:p-8 h-full flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * (index % 4), type: 'spring', stiffness: 120 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Logo container */}
                  <Link href={partner.website} target="_blank" rel="noopener noreferrer" className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 block">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 112px"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
                        <BuildingOfficeIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </Link>

                  {/* Nom */}
                  <Link href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xl sm:text-2xl font-bold text-gray-950 mb-3 line-clamp-1 hover:text-blue-600 transition-colors">
                    {partner.name}
                  </Link>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 flex-1">
                    <TransletText>{partner.description}</TransletText>
                  </p>

                  {/* Lien */}
                  {partner.website !== "#" && (
                    <Link
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      <TransletText>Visiter le site</TransletText>
                    </Link>
                  )}
                  
                  {partner.website === "#" && (
                    <span className="text-gray-400 text-sm italic">
                      <TransletText>Site à venir</TransletText>
                    </span>
                  )}
                </motion.article>
              </SwiperSlide>
            ))}

            {/* Navigation Boutons - Glassmorphism minimal */}
            <button className="partner-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 bg-white/80 backdrop-blur border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all cursor-pointer">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button className="partner-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 bg-white/80 backdrop-blur border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all cursor-pointer">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Swiper>

          {/* Pagination */}
          <div className="swiper-pagination partner-pagination mt-6 sm:mt-8" />
        </div>

       
      </div>
    </section>
  );
}