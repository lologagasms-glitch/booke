"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TransletText } from "@/app/lib/services/translation/transletText";

export default function PressPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-white">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <TransletText>Presse & Médias</TransletText>
              </h1>
              <p className="mt-4 text-blue-100 text-lg">
                <TransletText>Toutes les informations, logos et visuels pour la presse.</TransletText>
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/" className="px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50">
                  <TransletText>Accueil</TransletText>
                </Link>
                <Link href="/etablissements" className="px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10">
                  <TransletText>Découvrir</TransletText>
                </Link>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3]">
              <Image src="/file.svg" alt="Press kit" fill className="object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          <TransletText>Communiqués de presse</TransletText>
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ReleaseCard
            date="2025-10-15"
            title="Lancement de nouvelles destinations"
            summary="Extension du catalogue et nouvelles fonctionnalités de recherche."
          />
          <ReleaseCard
            date="2025-07-02"
            title="Mise à niveau de l’expérience mobile"
            summary="Performance, accessibilité et navigation améliorées."
          />
          <ReleaseCard
            date="2025-03-12"
            title="Partenariats avec des établissements premium"
            summary="Réservations simplifiées et meilleures offres."
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            <TransletText>Kit média</TransletText>
          </h2>
          <p className="mt-2 text-gray-600">
            <TransletText>Téléchargez logos et visuels pour vos publications.</TransletText>
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <AssetCard src="/next.svg" label="Logo clair" href="/next.svg" />
            <AssetCard src="/vercel.svg" label="Logo sombre" href="/vercel.svg" />
            <AssetCard src="/globe.svg" label="Illustration globe" href="/globe.svg" />
            <AssetCard src="/window.svg" label="Illustration fenêtre" href="/window.svg" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/next.svg" download className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              <TransletText>Télécharger le logo</TransletText>
            </a>
            <a href="/globe.svg" download className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
              <TransletText>Télécharger l’illustration</TransletText>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-indigo-50 p-8 border border-indigo-100">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-semibold text-indigo-900">
                <TransletText>Contact presse</TransletText>
              </h3>
              <p className="mt-2 text-indigo-700">
                <TransletText>Pour demandes d’interview, informations et ressources additionnelles.</TransletText>
              </p>
              <div className="mt-4 flex gap-3">
                <a href="mailto:press@evasion.example" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                  <TransletText>Contacter</TransletText>
                </a>
                <Link href="/contact" className="px-4 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 text-sm font-medium hover:bg-indigo-100">
                  <TransletText>Formulaire de contact</TransletText>
                </Link>
              </div>
            </div>
            <div className="relative w-full h-48 md:h-64">
              <Image src="/file.jpg" alt="Media" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReleaseCard({ date, title, summary }: { date: string; title: string; summary: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</p>
      <h3 className="mt-1 text-lg font-semibold text-gray-900">
        <TransletText>{title}</TransletText>
      </h3>
      <p className="mt-1 text-gray-600">
        <TransletText>{summary}</TransletText>
      </p>
      <Link href="/" className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
        <TransletText>En savoir plus</TransletText>
      </Link>
    </div>
  );
}

function AssetCard({ src, label, href }: { src: string; label: string; href: string }) {
  return (
    <div className="text-center">
      <div className="relative w-full h-24">
        <Image src={src} alt={label} fill className="object-contain" />
      </div>
      <p className="mt-2 text-sm text-gray-700">
        <TransletText>{label}</TransletText>
      </p>
      <a href={href} download className="mt-2 inline-block px-3 py-1 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800">
        <TransletText>Télécharger</TransletText>
      </a>
    </div>
  );
}
