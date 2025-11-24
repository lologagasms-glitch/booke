'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  XMarkIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
} from '@/components/icons/social';
import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* ---------- Données enrichies ---------- */
const teamData = {
  leadership: [
    {
      id: 'jean-dupont',
      name: 'Jean Dupont',
      role: 'CEO & Fondateur',
      bio: '15 ans d\'expérience dans l\'innovation tech. Ancien VP Product chez Airbnb.',
      photo: '/team/jean.jpg',
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
      photo: '/team/marie.jpg',
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
      photo: '/team/pierre.jpg',
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
      photo: '/team/sophie.jpg',
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
      photo: '/team/antoine.jpg',
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
      photo: '/team/camille.jpg',
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
      photo: '/team/lucas.jpg',
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
      photo: '/team/emma.jpg',
      phone: '+33 6 89 01 23 45',
      location: { label: 'Strasbourg, FR', lat: 48.5734, lng: 7.7521 },
      socials: {
        linkedin: 'https://linkedin.com/in/emmadubois',
      },
    },
  ],
};

/* ---------- Icône de marqueur personnalisée ---------- */
function createCustomIcon(color: string = '#f59e0b') {
  return L.divIcon({
    html: `<div style="background: linear-gradient(135deg, ${color}, #f97316); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
             <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
               <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
             </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: 'custom-marker',
  });
}

/* ---------- Composant Carte Miniature (cliquable) ---------- */
function MiniMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialisation de la carte miniature (non interactive)
    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([lat, lng], 12);

    // Couche de tuiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Ajout du marqueur
    L.marker([lat, lng], { icon: createCustomIcon() })
      .addTo(mapRef.current)
      .bindPopup(`<div style="color: #1f2937; font-weight: 600;">${label}</div>`);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="h-20 w-full rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:opacity-90 transition"
        onClick={() => setIsModalOpen(true)}
        title="Cliquez pour agrandir"
      />
      {isModalOpen && <MapModal lat={lat} lng={lng} label={label} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

/* ---------- Composant Modal avec Carte Interactive ---------- */
function MapModal({ lat, lng, label, onClose }: {
  lat: number;
  lng: number;
  label: string;
  onClose: () => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialisation de la carte interactive
    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    }).setView([lat, lng], 13);

    // Couche de tuiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Ajout du marqueur avec popup permanent
    L.marker([lat, lng], { icon: createCustomIcon() })
      .addTo(mapRef.current)
      .bindPopup(`<div style="color: #1f2937; font-weight: 600; font-size: 16px;">${label}</div>`, {
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-11/12 h-5/6 bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          aria-label="Fermer"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}

/* ---------- Composant Social Links ---------- */
type SocialPlatform = 'linkedin' | 'twitter' | 'github';

function SocialLinks({ socials }: { socials: Partial<Record<SocialPlatform, string>> }) {
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
}

/* ---------- Hero Section ---------- */
function TeamHero() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-700 via-yellow-800 to-yellow-600 px-6 py-16 text-center text-white shadow-2xl md:px-12 md:py-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <UserGroupIcon className="mx-auto mb-6 h-16 w-16 animate-bounce text-white/80 md:h-20 md:w-20" />
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
        Rencontrez l'équipe Evasion
      </h1>
      <p className="mx-auto max-w-3xl text-lg opacity-90 md:text-xl">
        Une équipe passionnée qui croit que chaque voyage devrait être exceptionnel
      </p>
    </section>
  );
}

/* ---------- Stats Overview ---------- */
function TeamStats() {
  const stats = [
    { label: 'Membres', value: '42', icon: UserGroupIcon, color: 'text-indigo-600' },
    { label: 'Nationalités', value: '12', icon: MapPinIcon, color: 'text-purple-600' },
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
            <p className="text-sm text-slate-600">{stat.label}</p>
          </div>
        );
      })}
    </section>
  );
}

/* ---------- Leadership Card ---------- */
function LeadershipCard({ member, isFirst }: { member: typeof teamData.leadership[0], isFirst?: boolean }) {
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
          {member.role}
        </div>

        <div className="absolute right-4 top-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <SocialLinks socials={member.socials} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="mb-1 text-2xl font-extrabold">{member.name}</h3>
        <p className="mb-3 text-sm opacity-90">{member.bio}</p>

        <div className="mt-4 space-y-3 border-t border-white/20 pt-4">
          <div className="flex gap-4">
            {Object.entries(member.stats).map(([key, value]) => (
              <div key={key} className="flex-1 text-center">
                <p className="text-lg font-bold text-indigo-300">{value}</p>
                <p className="text-xs uppercase tracking-wide opacity-80">{key}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-indigo-300" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-indigo-300" />
              <span>{member.location.label}</span>
            </div>
          </div>

          {/* Carte cliquable */}
          <MiniMap lat={member.location.lat} lng={member.location.lng} label={member.location.label} />
        </div>
      </div>
    </article>
  );
}

/* ---------- Team Member Card ---------- */
function TeamMemberCard({ member }: { member: typeof teamData.team[0] }) {
  const [isHovered, setIsHovered] = useState(false);

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
        <p className="mb-1 text-sm font-semibold text-indigo-600">{member.role}</p>
        <p className="mb-3 text-xs text-slate-600">{member.bio}</p>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-3 w-3" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-3 w-3" />
            <span>{member.location.label}</span>
          </div>
        </div>

        {/* Carte cliquable */}
        <MiniMap lat={member.location.lat} lng={member.location.lng} label={member.location.label} />
      </div>
    </article>
  );
}

/* ---------- Values Section ---------- */
function TeamValues() {
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
        Nos valeurs
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
              <h3 className="mb-2 text-lg font-bold text-slate-800">{value.title}</h3>
              <p className="text-sm text-slate-600">{value.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Company HQ Section ---------- */
function CompanyHQ() {
  const hqLocation = {
    lat: 48.8566, // Paris coordinates for example
    lng: 2.3522,
    label: 'Siège Social Evasion'
  };

  return (
    <section className="mb-16 overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto min-h-[400px]">
          <Image
            src="/team/office.jpg" // Assuming this image exists or will be handled
            alt="Bureaux Evasion"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:hidden" />
          <div className="absolute bottom-0 left-0 p-6 text-white md:hidden">
            <h3 className="text-2xl font-bold">Nos Bureaux</h3>
            <p className="opacity-90">Au cœur de l'innovation</p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-800">
            Venez nous voir chez <span className="text-indigo-600">Evasion</span>
          </h2>
          <p className="mb-6 text-slate-600 text-lg">
            Notre siège social est un espace ouvert conçu pour la collaboration et la créativité.
            Situé au cœur de Paris, c'est ici que la magie opère.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-800">Adresse</p>
                <p className="text-slate-600">123 Avenue de l'Innovation, 75001 Paris, France</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-800">Horaires</p>
                <p className="text-slate-600">Lun - Ven: 9h00 - 18h00</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
            <MiniMap lat={hqLocation.lat} lng={hqLocation.lng} label={hqLocation.label} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact Section ---------- */
function TeamContact() {
  return (
    <section className="mb-16 rounded-3xl bg-gradient-to-br from-yellow-600 via-yellow-800 to-yellow-600 p-8 text-center text-white shadow-xl md:p-12">
      <h2 className="mb-4 text-2xl font-extrabold md:text-4xl">Vous avez une question ?</h2>
      <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
        Notre équipe est là pour vous répondre. N'hésitez pas à nous contacter.
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
}

/* ---------- Page Principale ---------- */
export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <TeamHero />
      <TeamStats />

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 md:text-4xl">
          Direction
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamData.leadership.map((member, index) => (
            <LeadershipCard key={member.id} member={member} isFirst={index === 0} />
          ))}
        </div>
      </section>

      <TeamValues />

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 md:text-4xl">
          Toute l'équipe
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