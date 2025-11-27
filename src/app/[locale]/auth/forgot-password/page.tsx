'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { authClient, useSession } from '@/app/lib/auth-client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { locale } = useParams();
  // Redirect if user is already signed in
  useEffect(() => {
    const { data: session } = useSession();
    if (session) {
      router.push(`/${locale}`);
    }
  }, [locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await authClient.forgetPassword({
        email,
      },{
        onError: (err) => {
          setError( 'Une erreur est survenue. Veuillez réessayer.');
        } ,
        onSuccess: () => {
          router.push(`/${locale}/auth/verify`);
        }
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card container with glassmorphism effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
              <EnvelopeIcon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              <TransletText>
                Réinitialisation du mot de passe
              </TransletText>
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              <TransletText>
                Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </TransletText>
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100/70">
                <svg className="h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">E-mail envoyé</h3>
              <p className="mt-2 text-sm text-gray-500">
                <TransletText>
                  Si un compte existe avec l'adresse e-mail {email}, vous recevrez un e-mail avec les instructions pour réinitialiser votre mot de passe.
                </TransletText> 
              </p>
              <div className="mt-6">
                <Link
                  href={`/${locale}/auth/signin`}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <TransletText>
                    Retour à la connexion
                  </TransletText>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50/70 border border-red-200/50 text-red-700 px-4 py-3 rounded-lg" role="alert">
                  <span className="block sm:inline text-sm"><TransletText>{error}</TransletText></span>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <TransletText>
                    Adresse e-mail
                  </TransletText>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <TransletText>
                        Envoi en cours...
                      </TransletText>
                    </>
                  ) : (
                    <TransletText>
                      Envoyer les instructions
                    </TransletText>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <Link href={`/${locale?.toString()}/auth/signin`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  <TransletText>
                    Retour à la page de connexion
                  </TransletText>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}