// Import global styles and fonts
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/solid'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '404 - Page non trouvée',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
}

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Header avec icône */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 animate-pulse">
              <ExclamationTriangleIcon className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8 space-y-6 text-center">
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                404
              </h1>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Page non trouvée
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Oups ! La page que vous recherchez semble avoir disparu ou n'a jamais existé.
              </p>
            </div>

            {/* Action */}
            <div className="flex justify-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Retour à l'accueil</span>
              </a>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}