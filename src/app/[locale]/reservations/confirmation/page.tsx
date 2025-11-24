'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function ReservationConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // If not coming from a successful reservation, redirect to home
    if (!success) {
      router.push('/');
      return;
    }
    
    // Countdown to redirect to profile page
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [success, router]);
  
  if (!success) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold mb-4">Réservation confirmée !</h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Merci pour votre réservation. Un email de confirmation a été envoyé à votre adresse email.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Détails de la réservation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-600 text-sm">Numéro de réservation</p>
              <p className="font-medium">RES-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Date de réservation</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/profile"
            className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors"
          >
            Voir mes réservations
          </Link>
          
          <Link 
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
        
        <p className="text-gray-500 mt-8">
          Redirection automatique vers votre profil dans {countdown} secondes...
        </p>
      </div>
    </div>
  );
}