// components/CompanyStats.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  StarIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Données statiques - structure moderne avec badges
const STATS_DATA = [
  {
    key: 'reservations',
    value: '250K+',
    label: 'Réservations',
    description: 'Réservations facilitées',
    icon: CalendarDaysIcon,
    accent: 'blue',
  },
  {
    key: 'etablissements',
    value: '3,500+',
    label: 'Établissements',
    description: 'Hôtels & restaurants partenaires',
    icon: BuildingOfficeIcon,
    accent: 'emerald',
  },
  {
    key: 'destinations',
    value: '850+',
    label: 'Destinations',
    description: 'Lieux de rêve disponibles',
    icon: MapPinIcon,
    accent: 'violet',
  },
  {
    key: 'satisfaction',
    value: '4.8/5',
    label: 'Satisfaction',
    description: 'Note moyenne clients',
    icon: StarIcon,
    accent: 'amber',
  },
  {
    key: 'experience',
    value: '10+',
    label: 'Expérience',
    description: "Années d'expertise",
    icon: ClockIcon,
    accent: 'rose',
  },
  {
    key: 'clients',
    value: '1M+',
    label: 'Clients',
    description: 'Voyageurs satisfaits',
    icon: UsersIcon,
    accent: 'teal',
  },
];

const COMPANY_DESCRIPTION = `
Evasion simplifie vos réservations dans les secteurs de l'hôtellerie, 
de la restauration et des loisirs. Grâce à notre plateforme intuitive, 
réservez en quelques clics vos prochaines expériences : chambres d'hôtel, 
tables de restaurants, activités de loisirs. Nous connectons voyageurs et 
professionnels pour des expériences sans stress, de la découverte à la confirmation.
`;

// Configuration des couleurs sans dégradé
const ACCENT_CONFIG = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  violet: { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  teal: { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
};

export default function CompanyStats() {
  const { locale } = useParams() as { locale: string };
  
  // Variants d'animation modernes avec ressort
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-white">
      {/* Effet de lumière subtil - sans dégradé */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-gray-50/60" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête moderne */}
        <motion.header
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase">
              <TransletText>Depuis 2014</TransletText>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-950 mb-6 leading-tight">
            <span className="text-blue-600">Evasion</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 mb-8 font-light max-w-3xl mx-auto leading-snug">
            <TransletText>La réservation simplifiée, l&apos;expérience amplifiée</TransletText>
          </p>
          
          <div className="mx-auto w-24 h-1 bg-blue-600 rounded-full mb-8" />
          
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              <TransletText>{COMPANY_DESCRIPTION}</TransletText>
            </p>
          </div>
        </motion.header>

        {/* Grille hyper-responsive avec CSS Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {STATS_DATA.map((stat, index) => {
            const Icon = stat.icon;
            const config = ACCENT_CONFIG[stat.accent as keyof typeof ACCENT_CONFIG];
            
            return (
              <motion.article
                key={stat.key}
                variants={itemVariants as any}
                className="group relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ 
                  y: -8,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
              >
                {/* Badge icône moderne avec bordure */}
                <motion.div
                  variants={badgeVariants as any}
                  className={`inline-flex p-3 sm:p-4 rounded-xl ${config.bg} ${config.border} border mb-4 sm:mb-6 transition-transform`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${config.text}`} />
                </motion.div>

                {/* Valeur avec effet de compteur */}
                <motion.div 
                  className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${config.text} mb-2 tracking-tight` }
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-950 mb-2">
                  <TransletText>{stat.label}</TransletText>
                </h3>

                {/* Description avec ligne accent */}
                <div className={`w-10 h-0.5 ${config.bg} rounded-full mb-3 sm:mb-4`} />
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <TransletText>{stat.description}</TransletText>
                </p>

                {/* Indicateur de hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.article>
            );
          })}
        </motion.div>

        {/* CTA moderne avec icône animée */}
        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        >
          <Link 
            href={`/${locale}/etablissements`}
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-semibold text-lg sm:text-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg hover:shadow-2xl group"
          >
            <TransletText>Commencer une réservation</TransletText>
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}