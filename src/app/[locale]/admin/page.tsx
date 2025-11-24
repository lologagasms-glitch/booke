import { redirect } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import {
  HomeModernIcon,
  Bars3CenterLeftIcon,
  CalendarDaysIcon,
  PlusIcon,
  ArrowLongRightIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhotoIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Params } from 'next/dist/server/request/params';

export default async function AdminPage({ params }: { params: Promise<Params> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { locale } = await params
  if (!session) { return redirect(`/${locale}/signin`); }
  if (session?.user?.role !== "admin") {
    redirect(`/${locale}/profile`);
  }
  const cards = [
    {
      title: 'Établissements',
      desc: 'Ajoutez ou modifiez vos hôtels, villégiatures et résidences de charme.',
      icon: HomeModernIcon,
      bg: 'from-amber-400 to-orange-500',
      href: `/${locale}/admin/etablissements`,
      cta: 'Gérer',
      plus: `/${locale}/admin/etablissements/new`,
    },
    {
      title: 'Chambres & Suites',
      desc: 'Mettez en valeur vos suites vue-mer, lofts ou cabanes perchées.',
      icon: Bars3CenterLeftIcon,
      bg: 'from-sky-400 to-cyan-500',
      href: `/${locale}/admin/chambres`,
      cta: 'Parcourir',
      plus: `/${locale}/admin/chambres/new`,
    },
    {
      title: 'Réservations',
      desc: 'Suivez les séjours, annulations et demandes spéciales en temps réel.',
      icon: CalendarDaysIcon,
      bg: 'from-emerald-400 to-teal-500',
      href: `/${locale}/admin/reservations`,
      cta: 'Consulter',
    },
    {
      title: 'Médias',
      desc: 'Ajoutez ou modifiez les images et vidéos de vos établissements et chambres.',
      icon: PhotoIcon,
      bg: 'from-purple-400 to-indigo-500',
      href: `/${locale}/admin/medias/etablissements`,
      mediaButtons: [
        { label: 'Établissements', href: `/${locale}/admin/medias/etablissements` },
        { label: 'Chambres', href: `/${locale}/admin/medias/chambres` },
      ],
    },
    {
      title: 'Utilisateurs',
      desc: 'Gérez les utilisateurs, leurs rôles et leurs accès.',
      icon: UserIcon,
      bg: 'from-pink-400 to-rose-500',
      href: `/${locale}/admin/users`,
      cta: 'Gérer',
    },
    {
      title: 'Paiements & Validation',
      desc: 'Validez les paiements et générez des reçus multilingues.',
      icon: CalendarDaysIcon, // Using CalendarDaysIcon as a placeholder, ideally use BanknotesIcon or similar if available
      bg: 'from-indigo-400 to-violet-500',
      href: `/${locale}/admin/payments`,
      cta: 'Accéder',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br mt-2 from-sand-50 via-white to-blue-50">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          <h1 className="font-display text-4xl md:text-5xl text-gray-200 drop-shadow">
            Tableau de bord <span className="text-blue-700">loisirs</span>
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-2xl drop-shadow-sm">
            Offrez à vos visiteurs une expérience d’exception, de la première
            recherche au dernier souvenir.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className={clsx(
                    'group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl',
                    'transition-all duration-300 ease-out hover:-translate-y-1'
                  )}
                >
                  <div className={clsx('absolute inset-0 bg-gradient-to-br', c.bg)} />
                  <div className="relative z-10 p-6 text-white flex flex-col h-full">
                    <Icon className="w-10 h-10 mb-4 drop-shadow" />
                    <h3 className="font-display text-2xl">{c.title}</h3>
                    <p className="mt-2 text-sm opacity-90">{c.desc}</p>

                    <div className="mt-auto pt-4 flex items-center gap-3">
                      <Link
                        href={c.href}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                   bg-white/20 backdrop-blur hover:bg-white/30 transition"
                      >
                        {c.cta}
                        <ArrowLongRightIcon className="w-5 h-5" />
                      </Link>

                      {c.plus && (
                        <Link
                          href={c.plus}
                          aria-label={`Ajouter ${c.title}`}
                          className="ml-auto w-9 h-9 grid place-items-center
                                     bg-white/20 backdrop-blur rounded-full
                                     hover:bg-white/30 transition"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </Link>
                      )}

                      {c.mediaButtons && (
                        <div className="ml-auto flex gap-2">
                          {c.mediaButtons.map((btn) => (
                            <Link
                              key={btn.label}
                              href={btn.href}
                              className="px-3 py-2 rounded-full bg-white/20 backdrop-blur
                                         hover:bg-white/30 transition text-sm"
                            >
                              {btn.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section aide */}
        <section className="mt-12 bg-white/70 backdrop-blur rounded-2xl p-8 shadow-md">
          <div className="flex items-start gap-4">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-700 shrink-0" />
            <div>
              <h2 className="font-display text-2xl text-gray-800">Besoin d’aide ?</h2>
              <p className="text-gray-600 mt-2">
                Consultez notre centre d’aide ou contactez le support technique.
              </p>
              <div className="mt-4 flex gap-4">
                <Link
                  href={`/${locale}/admin/aide`}
                  className="px-4 py-2 rounded-full border border-blue-700 text-blue-700
                             hover:bg-blue-50 transition"
                >
                  Centre d’aide
                </Link>
                <a
                  href="mailto:support@votredomaine.com"
                  className="px-4 py-2 rounded-full bg-blue-700 text-white
                             hover:bg-blue-800 transition inline-flex items-center gap-2"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Contacter le support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}