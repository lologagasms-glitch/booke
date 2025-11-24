"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function VerifyInfoPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("token"); // on récupère l'email passé en token

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Côté gauche : visuel */}
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1267&q=80"
          alt="Plage calme au coucher du soleil"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-light">Bienvenue dans l&#39;univers Évasion Hôtels & Résorts</h2>
          <p className="mt-2 opacity-80">Réservez, détendez-vous, profitez.</p>
        </div>
      </div>

      {/* Côté droit : message */}
      <div className="flex items-center justify-center px-8 py-12 bg-amber-50">
        <div className="max-w-md w-full text-center">
          {/* Icône cocotte minute */}
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-3xl">📧</span>
          </div>

          <h1 className="text-2xl font-semibold text-amber-900">
            Vérifiez votre boîte mail
          </h1>
          <p className="mt-3 text-amber-700">
            Nous avons envoyé un e-mail de confirmation à{" "}
            <strong className="text-amber-900">{email}</strong>.
            <br />
            Cliquez sur le lien reçu pour activer votre compte et profiter de
            nos offres exclusives.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-white shadow hover:bg-amber-700 transition"
            >
              Ouvrir Gmail
            </Link>

            <Link
              href="/fr/auth/signin"
              className="w-full inline-flex justify-center rounded-lg bg-white px-4 py-2.5 text-amber-600 border border-amber-300 hover:bg-amber-50 transition"
            >
              Retour à la connexion
            </Link>
          </div>

          <p className="mt-6 text-xs text-amber-600">
            Problème ? Vérifiez vos spams ou contactez notre service client
            24 h/24.
          </p>
        </div>
      </div>
    </main>
  );
}