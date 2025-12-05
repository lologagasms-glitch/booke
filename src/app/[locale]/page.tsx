'use client';

import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import PopularEstablishments from "@/components/PopularEstablishments";
import Carousel from "./Carousel";
import { TransletText } from "../lib/services/translation/transletText";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useParams } from "next/navigation";
import { authClient, useSession } from "../lib/auth-client";

export default function Home() {
  const { locale } = useParams();
  const {data:session}=useSession()
 
  // Témoignages avec images Pexels (URL corrigées sans espaces)
  const testimonials = [
    {
      id: 1,
      nameKey: "Marie L.",
      locationKey: "Paris, France",
      rating: 5,
      commentKey: "Séjour inoubliable ! L'hôtel était parfait et le service impeccable. Je recommande vivement !",
      establishmentKey: "Hôtel Le Parisien",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 2,
      nameKey: "Jean D.",
      locationKey: "Lyon, France",
      rating: 5,
      commentKey: "Le parc d'attractions est fantastique pour toute la famille. Mes enfants ont adoré !",
      establishmentKey: "Parc Aventure",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 3,
      nameKey: "Sophie M.",
      locationKey: "Marseille, France",
      rating: 4,
      commentKey: "Très bel établissement avec une vue magnifique sur la mer. Le personnel était très accueillant.",
      establishmentKey: "Resort Côté Mer",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 4,
      nameKey: "Pierre T.",
      locationKey: "Nice, France",
      rating: 5,
      commentKey: "Expérience unique ! Le spa est incroyable et le personnel très attentionné.",
      establishmentKey: "Spa & Détente",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 5,
      nameKey: "Emma R.",
      locationKey: "Bordeaux, France",
      rating: 5,
      commentKey: "Parfait pour notre escapade romantique. Le cadre était magique et les équipements top.",
      establishmentKey: "Gîte Bordelais",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 6,
      nameKey: "Lucas B.",
      locationKey: "Lille, France",
      rating: 4,
      commentKey: "Excellent rapport qualité-prix. Le parc aquatique a été un succès auprès des enfants.",
      establishmentKey: "Aqua Parc",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 7,
      nameKey: "Clara V.",
      locationKey: "Strasbourg, France",
      rating: 5,
      commentKey: "Maison d'hôtes charmante avec un petit-déjeuner délicieux. Hôtes très sympathiques.",
      establishmentKey: "Maison Alsacienne",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 8,
      nameKey: "Marc A.",
      locationKey: "Toulouse, France",
      rating: 5,
      commentKey: "Le parc zoologique est magnifique. Les animaux semblent heureux et bien entretenus.",
      establishmentKey: "Zoo du Sud-Ouest",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 9,
      nameKey: "Julie C.",
      locationKey: "Nantes, France",
      rating: 4,
      commentKey: "Bonne expérience globale. La chambre était propre et confortable. Je reviendrai.",
      establishmentKey: "Hôtel du Centre",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 10,
      nameKey: "Thomas G.",
      locationKey: "Montpellier, France",
      rating: 5,
      commentKey: "Le parc de loisirs offre des attractions pour tous les âges. Journée mémorable !",
      establishmentKey: "Fun Park",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&h=100&w=100"
    }
  ];

  // PARTENAIRES avec logos (URLs corrigées sans espaces)
 const partners = [


  {
    name: "Hyatt Hotels",
    logo: "https://www.hyatt.com/content/dam/hyatt/hyatt-webstyles/logos/Hyatt_Logo.svg",
    website: "https://www.hyatt.com",
    description: "Park Hyatt, Grand Hyatt - Luxe et lifestyle"
  },
  {
    name: "Meliá Hotels",
    logo: "https://www.melia.com/etc/designs/meliapublic/img/logos/logo-melia-hotels.png",
    website: "https://www.melia.com",
    description: "Leader espagnol avec 370+ hôtels en Europe"
  },
  {
    name: "NH Hotel Group",
    logo: "https://www.nh-hotels.com/etc/designs/nh-hotels/logo.svg",
    website: "https://www.nh-hotels.com",
    description: "380+ hôtels dans 25 pays, partie de Minor Hotels"
  },
  {
    name: "Radisson Hotel Group",
    logo: "https://www.radissonhotels.com/etc/designs/radissonhotels/img/logos/radisson-hotels-logo.svg",
    website: "https://www.radissonhotels.com",
    description: "Radisson Blu, Red - 1 500+ propriétés"
  },
 

];

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Carousel />
      
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-4 sm:py-6 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
              <TransletText>Trouvez votre prochain séjour</TransletText>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
              <TransletText>Recherchez des offres sur des hôtels, des maisons et bien plus encore...</TransletText>
            </p>
          </div>
          <SearchForm />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        
        {/* Popular Establishments */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6">
            <TransletText>Hébergements populaires</TransletText>
          </h2>
          <PopularEstablishments locale={locale as string} />
        </section>

        {/* TESTIMONIALS SWIPER - THEME NOIR & BLANC AVEC ACCENTS JAUNES */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="relative rounded-3xl bg-gray-900 py-12 sm:py-16 md:py-20">
            
            <div className="relative z-10 max-w-7xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-8 sm:mb-12 md:mb-16">
                <TransletText>Ce que disent nos clients</TransletText>
              </h2>

              <Swiper
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  el: '.custom-pagination',
                  bulletClass: 'swiper-pagination-bullet w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-yellow-400 opacity-50 hover:opacity-80 transition-all duration-300 bg-cover bg-center mx-1',
                  bulletActiveClass: 'opacity-100 border-yellow-500 shadow-lg shadow-yellow-400/40 scale-110',
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 2, spaceBetween: 30 },
                  1024: { slidesPerView: 2.5, spaceBetween: 40 },
                  1280: { slidesPerView: 3, spaceBetween: 50 },
                }}
                className="py-8"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id} className="!w-auto">
                    <div className="relative h-full p-2 sm:p-4">
                      {/* Carte noire avec bordure jaune */}
                      <div className="relative bg-gray-800 rounded-3xl p-6 sm:p-8 border border-yellow-400 shadow-lg group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        
                        {/* Étoiles jaunes */}
                        <div className="flex items-center mb-5 sm:mb-6 relative z-10">
                          <div className="flex text-yellow-400 text-2xl">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-6 h-6 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-3 text-white font-bold">{testimonial.rating}/5</span>
                        </div>

                        {/* Commentaire en blanc */}
                        <p className="text-white text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed italic relative z-10">
                          "<TransletText>{testimonial.commentKey}</TransletText>"
                        </p>

                        {/* Info utilisateur */}
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md">
                            <Image src={testimonial.avatar} alt={testimonial.nameKey} fill className="object-cover" sizes="64px" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{testimonial.nameKey}</h4>
                            <p className="text-gray-300 text-sm">{testimonial.locationKey}</p>
                          </div>
                        </div>

                        {/* Établissement */}
                        <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-700 relative z-10">
                          <p className="text-yellow-400 font-bold">{testimonial.establishmentKey}</p>
                          <p className="text-gray-300 text-sm capitalize">
                            <TransletText>{testimonial.type === 'hotel' ? 'hotel' : 'leisure'}</TransletText>
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation en jaune avec icônes noires */}
              <div className="swiper-button-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-yellow-400 text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="swiper-button-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-yellow-400 text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Pagination avec avatars */}
              <div className="custom-pagination flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10"></div>
            </div>
          </div>
        </section>

        {/* PARTENAIRES - GRANDES ENTREPRISES HOTELIERES EUROPEENNES */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="rounded-3xl p-6 sm:p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-10 md:mb-12">
              <TransletText>Nos Partenaires Prestigieux</TransletText>
            </h2>
            
            {/* Grille des logos partenaires */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="relative group flex flex-col items-center w-40 sm:w-44 md:w-48">
                  {/* Logo */}
                  <div className="relative w-full h-12 sm:h-16 mb-3 sm:mb-4 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={150}
                      height={60}
                      className="object-contain max-w-full max-h-full"
                      priority
                    />
                  </div>

                  {/* Nom de l'entreprise */}
                  <h3 className="text-gray-800 text-center font-semibold text-sm sm:text-base">
                    {partner.name}
                  </h3>
                </div>
              ))}
            </div>
          
          </div>
        </section>

        {/* Promotional Section */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 bg-white border-2 border-yellow-200 rounded-2xl p-6 sm:p-8">
            <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
              <h2 className="text-xl text-yellow-600 sm:text-2xl md:text-3xl font-bold">
                <TransletText>Économisez 15% avec les Offres de Dernière Minute</TransletText>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                <TransletText>Découvrez des offres de voyage dans le monde entier et économisez sur votre prochain séjour</TransletText>
              </p>
              <a
                href="/offres"
                className="inline-block bg-yellow-500 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 
                         rounded-md font-medium hover:bg-yellow-600 transition-all duration-300 
                         text-sm sm:text-base md:text-lg"
              >
                <TransletText>Explorer les offres</TransletText> 
              </a>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="relative aspect-video sm:aspect-square lg:aspect-[4/3]">
                <Image
                  src="/file.jpg"
                  alt="Offres spéciales"
                  fill
                  className="rounded-lg object-cover object-center transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}