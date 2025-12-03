"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TransletText } from "@/app/lib/services/translation/transletText";

export default function Works() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-white">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <TransletText>Comment utiliser le service</TransletText>
              </h1>
              <p className="mt-4 text-blue-100 text-lg">
                <TransletText>Parcourez, comparez et réservez votre séjour en quelques étapes simples.</TransletText>
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/etablissements" className="px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50">
                  <TransletText>Explorer les établissements</TransletText>
                </Link>
                <Link href="/reservations" className="px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10">
                  <TransletText>Mes réservations</TransletText>
                </Link>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3]">
              <Image src="/globe.svg" alt="Illustration globe" fill className="object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Étapes clés</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StepCard
            image="/window.svg"
            title="Rechercher une destination"
            description="Choisissez la ville ou le pays de votre prochaine escapade."
            ctaHref="/etablissements"
            ctaLabel="Chercher"
          />
          <StepCard
            image="/file.jpg"
            title="Filtrer et comparer"
            description="Affinez par type d’établissement, services, prix, et disponibilités."
            ctaHref="/etablissements"
            ctaLabel="Afficher les filtres"
          />
          <StepCard
            image="/teams/entreprise.jpg"
            title="Choisir une chambre"
            description="Consultez les détails, photos et équipements avant de réserver."
            ctaHref="/etablissements"
            ctaLabel="Voir les chambres"
          />
          <StepCard
            image="/teams/4.jpg"
            title="Réserver vos dates"
            description="Sélectionnez vos dates et le nombre de personnes, puis validez."
            ctaHref="/reservations"
            ctaLabel="Réserver"
          />
          <StepCard
            image="/teams/7.jpg"
            title="Recevoir la confirmation"
            description="Suivez le statut de votre réservation en temps réel."
            ctaHref="/reservations"
            ctaLabel="Voir le statut"
          />
          <StepCard
            image="/teams/8.jpg"
            title="Gérer votre séjour"
            description="Accédez à votre historique et préparez votre arrivée en toute sérénité."
            ctaHref="/reservations"
            ctaLabel="Gérer"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            <InfoBlock
              title="Recherche intelligente"
              description="Des filtres avancés pour trouver rapidement l’établissement idéal."
            />
            <InfoBlock
              title="Disponibilités en temps réel"
              description="Une vue claire des périodes disponibles pour éviter les surprises."
            />
            <InfoBlock
              title="Suivi des réservations"
              description="Un tableau simple pour surveiller vos réservations confirmées ou en attente."
            />
          </div>
          <div className="mt-8 text-center">
            <Link href="/etablissements" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
              <TransletText>Commencer</TransletText>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({ image, title, description, ctaHref, ctaLabel }: { image: string; title: string; description: string; ctaHref: string; ctaLabel: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="relative w-full h-40 rounded-xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        <TransletText>{title}</TransletText>
      </h3>
      <p className="mt-1 text-gray-600">
        <TransletText>{description}</TransletText>
      </p>
      <Link href={ctaHref} className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
        <TransletText>{ctaLabel}</TransletText>
      </Link>
    </div>
  );
}

function InfoBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h4 className="text-lg font-semibold text-gray-900">
        <TransletText>{title}</TransletText>
      </h4>
      <p className="mt-2 text-gray-600">
        <TransletText>{description}</TransletText>
      </p>
    </div>
  );
}
