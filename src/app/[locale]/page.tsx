import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import PopularEstablishments from "@/components/PopularEstablishments";
import { getPopularEtablissements } from "../lib/services/etablissement.service";
import Carousel from "./Carousel";
import { TranslatedText } from "../lib/services/translation/TranslatedText";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Carousel />
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-4 sm:py-6 md:py-12 lg:py-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 transition-all duration-300">
              <TranslatedText text="Trouvez votre prochain séjour" targetLang={locale} />
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl transition-all duration-300">
              <TranslatedText text="Recherchez des offres sur des hôtels, des maisons et bien plus encore..." targetLang={locale} />
            </p>
          </div>

          <SearchForm />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">


        {/* Popular Establishments */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 transition-all duration-300">
            <TranslatedText text="Hébergements populaires" targetLang={locale} />
          </h2>
          <PopularEstablishments locale={locale} />
        </section>

        {/* Promotional Section */}
        <section className="bg-blue-50 rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
            <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
              <h2 className="text-xl text-yellow-600 sm:text-2xl md:text-3xl font-bold transition-all duration-300">
                <TranslatedText text="Économisez 15% avec les Offres de Dernière Minute" targetLang={locale} />
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg transition-all duration-300">
                <TranslatedText text="Découvrez des offres de voyage dans le monde entier et économisez sur votre prochain séjour" targetLang={locale} />
              </p>
              <a
                href="/offres"
                className="inline-block bg-blue-700 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 
                         rounded-md font-medium hover:bg-blue-800 transition-all duration-300 
                         text-sm sm:text-base md:text-lg"
              >
                <TranslatedText text="Explorer les offres" targetLang={locale} />
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
