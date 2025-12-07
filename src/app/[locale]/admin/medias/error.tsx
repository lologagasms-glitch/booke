'use client'

import { useEffect } from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/solid'
import { BugAntIcon } from '@heroicons/react/24/outline'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error details:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Header avec icône */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 animate-pulse">
            <ExclamationTriangleIcon className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Oups ! Une erreur est survenue
            </h2>
            <p className="text-slate-600 text-lg">
              Nous sommes désolés, mais quelque chose s'est mal passé.
            </p>
          </div>

          {/* Détails de l'erreur (optionnel) */}
          {error.digest && (
            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-slate-400">
              <div className="flex items-start gap-3">
                <BugAntIcon className="w-5 h-5 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">Code d'erreur</p>
                  <p className="text-xs text-slate-500 font-mono bg-white px-2 py-1 rounded mt-1">
                    {error.digest}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Réessayer</span>
            </button>
            
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transform hover:scale-105 transition-all duration-200"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </a>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Si le problème persiste, contactez notre support technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
