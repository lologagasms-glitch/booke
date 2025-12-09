// app/components/CompanyBlocks.tsx
import React from "react";
import Link from "next/link";
import { 
  ArrowPathIcon, 
  HeartIcon, 
  HomeIcon, 
  SparklesIcon, 
  StarIcon, 
  SwatchIcon, 
  TagIcon 
} from "@heroicons/react/24/solid";

// --------------------------------------------------
// UI Primitives - Props par défaut modernes
// --------------------------------------------------

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary";
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  children: React.ReactNode;
}

// Valeurs par défaut via destructuration (React 19+)
export const Button = ({ 
  variant = "primary", 
  icon: Icon, 
  href, 
  children,
  className = "",
  ...props 
}: ButtonProps) => {
  const base = "inline-flex items-center gap-2 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary: "bg-white text-indigo-600 hover:scale-105 hover:bg-white/90 focus:ring-indigo-500",
    secondary: "border-2 border-white/50 text-white backdrop-blur hover:bg-white/20 focus:ring-white/50"
  };
  const sizes = "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base";

  return (
    <Link href={href} className={`${base} ${styles[variant]} ${sizes} ${className}`} {...props}>
      {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
      {children}
    </Link>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export const Card = ({ 
  children, 
  hoverable = false, 
  className = "",
  ...props 
}: CardProps) => (
  <div 
    className={`bg-white rounded-xl p-4 shadow-md ${hoverable ? "transition-all hover:-translate-y-1 hover:shadow-lg" : ""} sm:p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --------------------------------------------------
// Data
// --------------------------------------------------

const advantages = [
  { title: "Aucune commission cachée", description: "Nos prix sont transparents. Ce que vous voyez est ce que vous payez.", icon: SparklesIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "Support humain 24/7", description: "Notre équipe française vous répond en moins de 2 minutes en moyenne.", icon: HomeIcon, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Annulation flexible", description: "Jusqu'à 48h avant votre arrivée sur la majorité de nos offres.", icon: ArrowPathIcon, color: "text-pink-600", bg: "bg-pink-50" },
  { title: "Paiement sécurisé", description: "Transactions cryptées et protection des données garanties.", icon: SwatchIcon, color: "text-amber-600", bg: "bg-amber-50" },
] as const;

const testimonials = [
  { name: "Marie D.", role: "Voyageur depuis 2 ans", text: "Interface claire, réservation en 3 clics. Le support m'a même trouvé une chambre dès minute !", rating: 5 },
  { name: "Lucas T.", role: "Responsable hôtelier partenaire", text: "Evasion nous apporte des clients qualifiés et le tableau de bord est incroyablement intuitif.", rating: 5 },
] as const;

// --------------------------------------------------
// Sections avec React.memo pour la perf
// --------------------------------------------------

export const CompanyHero = React.memo(({ locale }: { locale: string }) => (
  <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-xl sm:p-6 lg:p-12">
    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96" aria-hidden="true" />
    <div className="relative max-w-6xl mx-auto">
      <h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
        Evasion : Votre voyage commence ici
      </h1>
      <p className="mx-auto mb-6 max-w-3xl text-sm opacity-90 sm:text-base md:text-lg">
        La première plateforme de réservation française qui met l'expérience voyageur au cœur de tout. 
        Nous croyons que chaque nuit compte, chaque détail importe.
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <Button href={`/${locale}/about`} variant="primary" icon={HeartIcon}>
          Découvrez notre histoire
        </Button>
        <Button href={`/${locale}/contact`} variant="secondary" icon={TagIcon}>
          Nous contacter
        </Button>
      </div>
    </div>
  </section>
));

CompanyHero.displayName = "CompanyHero";

export const CompanyAdvantages = React.memo(() => (
  <section className="mb-12 rounded-2xl bg-slate-50 p-4 shadow-sm sm:p-6 lg:p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="mb-6 text-center text-xl font-extrabold text-slate-800 sm:text-2xl">
        Pourquoi Evasion est différent
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {advantages.map((adv) => (
          <div key={adv.title} className="group">
            <Card hoverable>
              <div className={`mb-3 sm:mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${adv.bg} ${adv.color} transition-transform sm:h-14 sm:w-14 group-hover:scale-110`}>
                <adv.icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-base font-bold text-slate-800 sm:text-lg">{adv.title}</h3>
              <p className="text-sm text-slate-600">{adv.description}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
));

CompanyAdvantages.displayName = "CompanyAdvantages";

export const CompanyTestimonials = React.memo(() => (
  <section className="mb-12 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50 p-4 shadow-sm sm:p-6 lg:p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="mb-6 text-center text-xl font-extrabold text-slate-800 sm:text-2xl">
        Nos utilisateurs en parlent mieux que nous
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <article key={t.name} className="transition-transform hover:scale-[1.02]">
            <Card>
              <div className="mb-3 flex items-center gap-1 text-amber-400 sm:mb-4" role="img" aria-label={`${t.rating} étoiles`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                ))}
              </div>
              <p className="mb-4 text-sm italic text-slate-700 sm:text-base">{`"${t.text}"`}</p>
              <footer className="border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </footer>
            </Card>
          </article>
        ))}
      </div>
    </div>
  </section>
));

CompanyTestimonials.displayName = "CompanyTestimonials";