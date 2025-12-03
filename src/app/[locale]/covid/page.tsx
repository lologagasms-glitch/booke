import { TransletText } from '@/app/lib/services/translation/transletText';
import Image from 'next/image';
import {
  ShieldCheckIcon,
  HandRaisedIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

export default function CovidPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/covid-hero.jpg"
            alt="Travel safety during COVID-19"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6 text-blue-300" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <TransletText>Voyager en toute sécurité</TransletText>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            <TransletText>
              Découvrez nos protocoles sanitaires renforcés et nos conseils pour un voyage serein
            </TransletText>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Introduction */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              <TransletText>
                Chez Evasion, votre santé et votre sécurité sont notre priorité absolue. 
                Nous avons mis en place des mesures strictes conformes aux directives 
                de l'OMS et des autorités sanitaires internationales.
              </TransletText>
            </p>
          </div>
        </section>

        {/* Key Measures Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <TransletText>Nos mesures sanitaires</TransletText>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Cleaning */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HandRaisedIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Nettoyage renforcé</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Désinfection complète de tous les hébergements avec des produits 
                  certifiés virucides entre chaque séjour.
                </TransletText>
              </p>
            </div>

            {/* Flexible Cancellation */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CalendarDaysIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Annulation flexible</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Modification ou annulation gratuite jusqu'à 24h avant votre départ 
                  en cas de situation sanitaire imprévue.
                </TransletText>
              </p>
            </div>

            {/* Travel Insurance */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <PaperAirplaneIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Assurance COVID-19</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Couverture complète incluant les frais médicaux et de quarantaine 
                  liés à la COVID-19 pendant votre voyage.
                </TransletText>
              </p>
            </div>

            {/* Reduced Capacity */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Capacité réduite</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Jusqu'à 50% de réduction de la capacité dans les transports et 
                  activités pour garantir la distanciation physique.
                </TransletText>
              </p>
            </div>

            {/* Health Protocols */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Protocoles de santé</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Contrôle de température, gel hydroalcoolique disponible et 
                  port du masque obligatoire dans tous les espaces communs.
                </TransletText>
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <TransletText>Support 24/7</TransletText>
              </h3>
              <p className="text-gray-600">
                <TransletText>
                  Une équipe dédiée disponible 24h/24 pour répondre à toutes 
                  vos questions et vous accompagner en cas de besoin.
                </TransletText>
              </p>
            </div>
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <TransletText>Conseils pour voyager sereinement</TransletText>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-blue-900 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-3 text-green-600" />
                <TransletText>Avant votre départ</TransletText>
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <TransletText>Vérifiez les exigences d'entrée de votre destination</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <TransletText>Effectuez un test PCR 72h avant le départ si nécessaire</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <TransletText>Téléchargez l'application de traçage locale</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <TransletText>Prévoyez des masques et du gel hydroalcoolique</TransletText>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-green-900 flex items-center">
                <ShieldCheckIcon className="w-6 h-6 mr-3 text-blue-600" />
                <TransletText>Pendant votre séjour</TransletText>
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <TransletText>Respectez les gestes barrières locaux</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <TransletText>Privilégiez les activités en plein air</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <TransletText>Évitez les foules et les heures de pointe</TransletText>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <TransletText>Restez informé des évolutions locales</TransletText>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warning Section */}
        <section className="mb-16">
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-8">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-8 h-8 text-amber-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">
                  <TransletText>Information importante</TransletText>
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  <TransletText>
                    Les mesures sanitaires peuvent varier selon les destinations et évoluer 
                    rapidement. Nous vous recommandons de consulter régulièrement nos mises 
                    à jour et de suivre les directives des autorités locales. Notre équipe 
                    reste à votre disposition pour toute question concernant votre voyage.
                  </TransletText>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            <TransletText>Prêt à partir en toute sécurité ?</TransletText>
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            <TransletText>
              Réservez votre prochain voyage avec l'esprit tranquille
            </TransletText>
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors">
            <TransletText>Je réserve maintenant</TransletText>
          </button>
        </section>
      </div>
    </div>
  );
}
