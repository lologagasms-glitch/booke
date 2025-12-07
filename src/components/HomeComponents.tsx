import { TransletText } from "@/app/lib/services/translation/transletText";
import { ArrowPathIcon, HeartIcon, HomeIcon, SparklesIcon, StarIcon, SwatchIcon, TagIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

/* ---------- Hero Section Présentation ---------- */
export const CompanyHero = ({ locale }: { locale: string }) => (
  <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-xl sm:p-6 md:p-8 lg:p-12">
    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:-right-24 sm:-top-24 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96" />
    <div className="relative">
      <h1 className="mb-3 text-xl font-extrabold tracking-tight xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        <TransletText>Evasion : Votre voyage commence ici</TransletText>
      </h1>
      <p className="mx-auto mb-6 max-w-3xl text-xs opacity-90 xs:text-sm sm:text-base md:text-lg">
        <TransletText>La première plateforme de réservation française qui met l'expérience voyageur au cœur de tout. 
        Nous croyons que chaque nuit compte, chaque détail importe.</TransletText>
      </p>
      <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
        <Link 
          href={`/${locale}/about`} 
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-indigo-600 transition-transform hover:scale-105 hover:bg-white/90 xs:px-4 xs:py-2 xs:text-sm sm:px-6 sm:py-3 sm:text-base"
        >
          <HeartIcon className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          <TransletText>Découvrez notre histoire</TransletText>
        </Link>
        <Link 
          href={`/${locale}/contact`} 
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-3 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/20 xs:px-4 xs:py-2 xs:text-sm sm:px-6 sm:py-3 sm:text-base"
        >
          <TagIcon className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          <TransletText>Nous contacter</TransletText>
        </Link>
      </div>
    </div>
  </section>
);

/* ---------- Avantages clés ---------- */
export const CompanyAdvantages = () => {
  const advantages = [
    {
      title: "Aucune commission cachée",
      description: "Nos prix sont transparents. Ce que vous voyez est ce que vous payez.",
      icon: SparklesIcon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Support humain 24/7", 
      description: "Notre équipe française vous répond en moins de 2 minutes en moyenne.",
      icon: HomeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Annulation flexible",
      description: "Jusqu'à 48h avant votre arrivée sur la majorité de nos offres.",
      icon: ArrowPathIcon,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Paiement sécurisé",
      description: "Transactions cryptées et protection des données garanties.",
      icon: SwatchIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section className="mb-12 rounded-2xl bg-slate-50 p-3 shadow-sm xs:p-4 sm:p-6 lg:p-8">
      <h2 className="mb-4 text-center text-lg font-extrabold text-slate-800 xs:text-xl sm:text-2xl lg:mb-6">
        <TransletText>Pourquoi Evasion est différent</TransletText>
      </h2>
      <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
        {advantages.map((adv, i) => (
          <div 
            key={i}
            className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0"
          >
            <div className="group relative h-full overflow-hidden rounded-xl bg-white p-3 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg xs:p-4 sm:p-6">
              <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl ${adv.bgColor} ${adv.color} transition-transform group-hover:scale-110 xs:h-11 xs:w-11 sm:mb-3 sm:h-14 sm:w-14`}>
                <adv.icon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-slate-800 xs:text-base sm:text-lg">
                <TransletText>{adv.title}</TransletText>
              </h3>
              <p className="text-xs text-slate-600 sm:text-sm">
                <TransletText>{adv.description}</TransletText>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------- Témoignages ---------- */
export const CompanyTestimonials = () => {
  const testimonials = [
    {
      name: "Marie D.",
      role: "Voyageur depuis 2 ans",
      text: "Interface claire, réservation en 3 clics. Le support m'a même trouvé une chambre dès minute !",
      rating: 5,
    },
    {
      name: "Lucas T.",
      role: "Responsable hôtelier partenaire",
      text: "Evasion nous apporte des clients qualifiés et le tableau de bord est incroyablement intuitif.",
      rating: 5,
    },
  ];

  return (
    <section className="mb-12 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50 p-3 shadow-sm xs:p-4 sm:p-6 lg:p-8">
      <h2 className="mb-3 text-center text-lg font-extrabold text-slate-800 xs:text-xl sm:mb-4 sm:text-2xl">
        <TransletText>Nos utilisateurs en parlent mieux que nous</TransletText>   
      </h2>
      <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
        {testimonials.map((t, i) => (
          <article key={i} className="w-full sm:w-1/2 flex-shrink-0 rounded-xl bg-white p-3 shadow-md transition-transform hover:scale-[1.02] xs:p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-1 text-amber-400 xs:mb-3 xs:gap-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <StarIcon key={i} className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              ))}
            </div>
            <p className="mb-2 text-xs italic text-slate-700 xs:mb-3 xs:text-sm sm:mb-4 sm:text-base">
              <TransletText>{t.text}</TransletText>
            </p>
            <footer className="border-t border-slate-100 pt-2 xs:pt-3">
              <p className="text-xs font-semibold text-slate-800 xs:text-sm">
                <TransletText>{t.name}</TransletText>
              </p>
              <p className="text-xs text-slate-500">
                <TransletText>{t.role}</TransletText>
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};