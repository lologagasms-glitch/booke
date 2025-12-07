'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useId, memo } from 'react';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
} from '@/components/icons/social';
import { TransletText } from '@/app/lib/services/translation/transletText';

// ========== SOLUTION : Chargement dynamique de la carte ==========
// Empêche l'import de Leaflet côté serveur qui cause "window is not defined"
const ModernLocationMap = dynamic(
  () => import('./localisation'),
  {
    ssr: false, 
    loading: () => (
      <div className="w-full h-48 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-slate-500 text-sm">Carte en chargement...</span>
      </div>
    ),
  }
);

// ========== Icône de localisation premium ==========
const PremiumMapPinIcon = memo(function PremiumMapPinIcon({ className = "" }: { className?: string }) {
  const id = useId();
  const gradientId = `grad-${id}`;
  const filterId = `shadow-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
          <stop offset="100%" stopColor="#C44569" stopOpacity="1" />
        </linearGradient>
        <filter id={filterId}>
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        filter={`url(#${filterId})`}
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      />
      <circle fill="white" cx="12" cy="9" r="3.5" />
      <circle fill="#FF6B6B" cx="12" cy="9" r="2" />
    </svg>
  );
});

// ========== Données de l'équipe ==========
const teamData = {
  leadership: [
    {
      id: 'jean-dupont',
      name: 'Jean Dupont',
      role: 'CEO & Fondateur',
      bio: '15 ans d\'expérience dans l\'innovation tech. Ancien VP Product chez Airbnb.',
      photo: '/teams/1.jpg',
      phone: '+33 6 12 34 56 78',
      location: { label: 'Paris, FR', lat: 48.8566, lng: 2.3522 },
      socials: {
        linkedin: 'https://linkedin.com/in/jeandupont',
        twitter: 'https://twitter.com/jeandupont',
      },
      stats: {
        'Réservations': '10k+',
        'Satisfaction': '98%',
      },
    },
    {
      id: 'marie-martin',
      name: 'Marie Martin',
      role: 'CTO',
      bio: 'Ingénieure passionnée par la scalabilité. Ex-Spotify, ex-Uber.',
      photo: '/teams/5.jpg',
      phone: '+33 6 23 45 67 89',
      location: { label: 'Lyon, FR', lat: 45.7640, lng: 4.8357 },
      socials: {
        linkedin: 'https://linkedin.com/in/mariemartin',
        github: 'https://github.com/mariemartin',
      },
      stats: {
        'Uptime': '99.9%',
        'Commits': '5k+',
      },
    },
  ],
  team: [
    {
      id: 'pierre-louis',
      name: 'Pierre Louis',
      role: 'Head of Design',
      bio: 'Créateur d\'expériences mémorables. Designer chez Apple pendant 8 ans.',
      photo: '/teams/2.jpg',
      phone: '+33 6 34 56 78 90',
      location: { label: 'Bordeaux, FR', lat: 44.8378, lng: -0.5792 },
      socials: {
        linkedin: 'https://linkedin.com/in/pierrelouis',
        twitter: 'https://twitter.com/pierrelouis',
      },
    },
    {
      id: 'sophie-leroy',
      name: 'Sophie Leroy',
      role: 'Head of Marketing',
      bio: 'Growth hacker reconnue. A fait passer 3 startups à l\'échelle.',
      photo: '/teams/6.jpg',
      phone: '+33 6 45 67 89 01',
      location: { label: 'Marseille, FR', lat: 43.2965, lng: 5.3698 },
      socials: {
        linkedin: 'https://linkedin.com/in/sophieleroy',
      },
    },
    {
      id: 'antoine-petit',
      name: 'Antoine Petit',
      role: 'Lead Developer',
      bio: 'Full-stack addict. Contributeur open-source sur 50+ projets.',
      photo: '/teams/4.jpg',
      phone: '+33 6 56 78 90 12',
      location: { label: 'Nantes, FR', lat: 47.2184, lng: -1.5536 },
      socials: {
        linkedin: 'https://linkedin.com/in/antoinepetit',
        github: 'https://github.com/antoinepetit',
      },
    },
    {
      id: 'camille-robert',
      name: 'Camille Robert',
      role: 'Customer Success',
      bio: 'Experte en relation client. Parle 4 langues.',
      photo: '/teams/3.jpg',
      phone: '+33 6 67 89 01 23',
      location: { label: 'Lille, FR', lat: 50.6292, lng: 3.0573 },
      socials: {
        linkedin: 'https://linkedin.com/in/camillerobert',
      },
    },
    {
      id: 'lucas-moreau',
      name: 'Lucas Moreau',
      role: 'Product Manager',
      bio: 'Crée des produits users-first. 10+ lancements réussis.',
      photo: '/teams/7.jpg',
      phone: '+33 6 78 90 12 34',
      location: { label: 'Toulouse, FR', lat: 43.6047, lng: 1.4442 },
      socials: {
        linkedin: 'https://linkedin.com/in/lucasmoreau',
        twitter: 'https://twitter.com/lucasmoreau',
      },
    },
    {
      id: 'emma-dubois',
      name: 'Emma Dubois',
      role: 'Data Analyst',
      bio: 'Transforme les data en décisions. Docteur en Statistiques.',
      photo: '/teams/8.jpg',
      phone: '+33 6 89 01 23 45',
      location: { label: 'Strasbourg, FR', lat: 48.5734, lng: 7.7521 },
      socials: {
        linkedin: 'https://linkedin.com/in/emmadubois',
      },
    },
  ],
};

// ========== Composant Social Links ==========
type SocialPlatform = 'linkedin' | 'twitter' | 'github';

const SocialLinks = memo(function SocialLinks({ socials }: { socials: Partial<Record<SocialPlatform, string>> }) {
  const socialIcons = {
    linkedin: LinkedinIcon,
    twitter: TwitterIcon,
    github: GithubIcon,
  };

  return (
    <div className="flex gap-2">
      {(Object.entries(socials) as Array<[SocialPlatform, string | undefined]>)
        .filter(([, url]) => url)
        .map(([platform, url]) => {
          const Icon = socialIcons[platform];
          if (!Icon) return null;
          return (
            <Link
              key={platform}
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all hover:scale-105 hover:bg-white/30"
              aria-label={`Profil ${platform}`}
            >
              <Icon className="h-4 w-4 text-white" />
            </Link>
          );
        })}
    </div>
  );
});

// ========== Section Hero ==========
const TeamHero = memo(function TeamHero() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-700 via-yellow-800 to-yellow-600 px-6 py-16 text-center text-white shadow-2xl md:px-12 md:py-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <UserGroupIcon className="mx-auto mb-6 h-16 w-16 animate-bounce text-white/80 md:h-20 md:w-20" />
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
        <TransletText>Rencontrez l'équipe Evasion</TransletText>
      </h1>
      <p className="mx-auto max-w-3xl text-lg opacity-90 md:text-xl">
        <TransletText>Une équipe passionnée qui croit que chaque voyage devrait être exceptionnel</TransletText>
      </p>
    </section>
  );
});

// ========== Section Statistiques ==========
const TeamStats = memo(function TeamStats() {
  const stats = [
    { label: 'Membres', value: '42', icon: UserGroupIcon, color: 'text-indigo-600' },
    { label: 'Nationalités', value: '12', icon: PremiumMapPinIcon, color: 'text-purple-600' },
    { label: 'Langues parlées', value: '8', icon: ChatBubbleLeftRightIcon, color: 'text-pink-600' },
    { label: 'Verres de café/semaine', value: '1,2k', icon: SparklesIcon, color: 'text-yellow-500' },
  ];

  return (
    <section className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group rounded-2xl bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <Icon className={`mx-auto mb-3 h-10 w-10 ${stat.color}`} />
            <p className="mb-1 text-3xl font-extrabold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-600"><TransletText>{stat.label}</TransletText></p>
          </div>
        );
      })}
    </section>
  );
});

// ========== Carte Direction ==========
const LeadershipCard = memo(function LeadershipCard({ member, isFirst }: { member: typeof teamData.leadership[0], isFirst?: boolean }) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <article className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${isFirst ? 'bg-indigo-700' : 'bg-slate-800'}`}>
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src={member.photo}
          alt={`${member.name} - ${member.role}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
          <TransletText>{member.role}</TransletText>
        </div>

        <div className="absolute right-4 top-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <SocialLinks socials={member.socials} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="mb-1 text-2xl font-extrabold">{member.name}</h3>
        <p className="mb-3 text-sm opacity-90"><TransletText>{member.bio}</TransletText></p>

        <div className="mt-4 space-y-3 border-t border-white/20 pt-4">
          <div className="flex gap-4">
            {Object.entries(member.stats).map(([key, value]) => (
              <div key={key} className="flex-1 text-center">
                <p className="text-lg font-bold text-indigo-300">{value}</p>
                <p className="text-xs uppercase tracking-wide opacity-80"><TransletText>{key}</TransletText></p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-indigo-300" />
              <span>{member.phone}</span>
            </div>
            <button
              type="button"
              onClick={() => setMapOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur transition hover:bg-white/20"
            >
              <PremiumMapPinIcon className="h-4 w-4 text-indigo-300" />
              <span><TransletText>{member.location.label}</TransletText></span>
            </button>
          </div>

          {mapOpen && (
            <div className="relative mt-3 rounded-xl bg-white/10 p-2 backdrop-blur">
              <button
                onClick={() => setMapOpen(false)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white"
              >
                ✕
              </button>
              <ModernLocationMap
                lat={member.location.lat}
                lng={member.location.lng}
                label={member.location.label}
                className="w-full h-48"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

// ========== Carte Membre d'équipe ==========
const TeamMemberCard = memo(function TeamMemberCard({ member }: { member: typeof teamData.team[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={member.photo}
          alt={`${member.name} - ${member.role}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className={`absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-900/90 via-transparent to-transparent p-4 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <SocialLinks socials={member.socials} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-extrabold text-slate-800">{member.name}</h3>
        <p className="mb-1 text-sm font-semibold text-indigo-600"><TransletText>{member.role}</TransletText></p>
        <p className="mb-3 text-xs text-slate-600"><TransletText>{member.bio}</TransletText></p>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-3 w-3" />
            <span>{member.phone}</span>
          </div>
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 hover:bg-slate-200"
          >
            <PremiumMapPinIcon className="h-3 w-3" />
            <span><TransletText>{member.location.label}</TransletText></span>
          </button>
        </div>

        {mapOpen && (
          <div className="relative mt-2 rounded-xl bg-slate-100 p-2">
            <button
              onClick={() => setMapOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white px-2 py-0.5 text-xs"
            >
              ✕
            </button>
            <ModernLocationMap
              lat={member.location.lat}
              lng={member.location.lng}
              label={member.location.label}
              className="w-full h-48"
            />
          </div>
        )}
      </div>
    </article>
  );
});

// ========== Section Valeurs ==========
const TeamValues = memo(function TeamValues() {
  const values = [
    {
      title: 'Users First',
      description: 'Chaque décision commence par "Comment cela profite-t-il à nos utilisateurs ?"',
      icon: HeartIcon,
      color: 'text-pink-600',
    },
    {
      title: 'Innovation Constante',
      description: 'Nous expérimentons, échouons vite, apprenons et itérons.',
      icon: RocketLaunchIcon,
      color: 'text-indigo-600',
    },
    {
      title: 'Transparence Totale',
      description: 'Communication ouverte, feedbacks directs, culture du partage.',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-purple-600',
    },
  ];

  return (
    <section className="mb-16 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-lg md:p-12">
      <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 md:text-4xl">
        <TransletText>Nos valeurs</TransletText>
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((value, i) => {
          const Icon = value.icon;
          return (
            <div
              key={i}
              className="group rounded-2xl bg-white p-6 text-center shadow-md transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 transition-transform group-hover:scale-110 ${value.color}`}>
                <Icon className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-800"><TransletText>{value.title}</TransletText></h3>
              <p className="text-sm text-slate-600"><TransletText>{value.description}</TransletText></p>
            </div>
          );
        })}
      </div>
    </section>
  );
});

// ========== Section Siège social ==========
const CompanyHQ = memo(function CompanyHQ() {
  return (
    <section className="mb-16 overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto min-h-[400px]">
          <Image
            src="/teams/entreprise.jpg"
            alt="Bureaux Evasion"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:hidden" />
          <div className="absolute bottom-0 left-0 p-6 text-white md:hidden">
            <h3 className="text-2xl font-bold"><TransletText>Nos Bureaux</TransletText></h3>
            <p className="opacity-90"><TransletText>Au cœur de l'innovation</TransletText></p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-800">
            <TransletText>Venez nous voir chez</TransletText> <span className="text-indigo-600">Evasion</span>
          </h2>
          <p className="mb-6 text-slate-600 text-lg">
            <TransletText>Notre siège social est un espace ouvert conçu pour la collaboration et la créativité.
            Situé au cœur de Paris, c'est ici que la magie opère.</TransletText>
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <PremiumMapPinIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-800"><TransletText>Adresse</TransletText></p>
                <p className="text-slate-600"><TransletText>46 Rue de Trévis, 75009 Paris, France</TransletText></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-800"><TransletText>Horaires</TransletText></p>
                <p className="text-slate-600"><TransletText>Lun - Ven: 9h00 - 18h00</TransletText></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ========== Section Contact ==========
const TeamContact = memo(function TeamContact() {
  return (
    <section className="mb-16 rounded-3xl bg-gradient-to-br from-yellow-600 via-yellow-800 to-yellow-600 p-8 text-center text-white shadow-xl md:p-12">
      <h2 className="mb-4 text-2xl font-extrabold md:text-4xl"><TransletText>Vous avez une question ?</TransletText></h2>
      <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
        <TransletText>Notre équipe est là pour vous répondre. N'hésitez pas à nous contacter.</TransletText>
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="mailto:equipe@evasion.fr"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 transition-transform hover:scale-105"
        >
          <EnvelopeIcon className="h-5 w-5" />
          equipe@evasion.fr
        </Link>
        <Link
          href="tel:+33123456789"
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-3 font-semibold backdrop-blur transition-all hover:bg-white/20"
        >
          <PhoneIcon className="h-5 w-5" />
          +33 1 23 45 67 89
        </Link>
      </div>
    </section>
  );
});

// ========== PAGE PRINCIPALE ==========
export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <TeamHero />
      <TeamStats />

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 md:text-4xl">
          <TransletText>Direction</TransletText>
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamData.leadership.map((member, index) => (
            <LeadershipCard key={member.id} member={member} isFirst={index === 0} />
          ))}
        </div>
      </section>

      <TeamValues />

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-500 md:text-4xl">
          <TransletText>Toute l'équipe</TransletText>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamData.team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <CompanyHQ />
      <TeamContact />
    </div>
  );
}