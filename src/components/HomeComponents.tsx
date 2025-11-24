import { ArrowPathIcon, HeartIcon, HomeIcon, SparklesIcon, StarIcon, SwatchIcon, TagIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

/* ---------- Hero Section Présentation ---------- */
export const CompanyHero = () => (
  <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-xl md:p-12">
    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
    <div className="relative">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-5xl">
        Bookeing : Votre voyage commence ici
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-lg opacity-90">
        La première plateforme de réservation française qui met l'expérience voyageur au cœur de tout. 
        Nous croyons que chaque nuit compte, chaque détail importe.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link 
          href="/fr/a-propos" 
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 transition-transform hover:scale-105 hover:bg-white/90"
        >
          <HeartIcon className="h-5 w-5" />
          Découvrez notre histoire
        </Link>
        <Link 
          href="/fr/contact" 
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-3 font-semibold backdrop-blur transition-colors hover:bg-white/20"
        >
          <TagIcon className="h-5 w-5" />
          Nous contacter
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
    <section className="mb-12 rounded-2xl bg-slate-50 p-6 shadow-sm">
      <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800">
        Pourquoi Bookeing est différent
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {advantages.map((adv, i) => (
          <div 
            key={i}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${adv.bgColor} ${adv.color} transition-transform group-hover:scale-110`}>
              <adv.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-800">{adv.title}</h3>
            <p className="text-sm text-slate-600">{adv.description}</p>
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
      text: "Bookeing nous apporte des clients qualifiés et le tableau de bord est incroyablement intuitif.",
      rating: 5,
    },
  ];

  return (
    <section className="mb-12 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50 p-6 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-800">
        Nos utilisateurs en parlent mieux que nous
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <article key={i} className="rounded-xl bg-white p-6 shadow-md transition-transform hover:scale-[1.02]">
            <div className="mb-3 flex items-center gap-2 text-amber-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5" />
              ))}
            </div>
            <p className="mb-4 text-slate-700 italic">"{t.text}"</p>
            <footer className="border-t border-slate-100 pt-3">
              <p className="font-semibold text-slate-800">{t.name}</p>
              <p className="text-xs text-slate-500">{t.role}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};