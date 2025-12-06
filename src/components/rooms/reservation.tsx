  'use client'

  import { useState, useEffect, useCallback } from 'react'
  import { useRouter } from 'next/navigation'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useForm } from 'react-hook-form'
  import { z } from 'zod'
  import {
    CheckCircleIcon,
    PencilSquareIcon,
    UsersIcon,
    ArrowPathIcon,
    PhotoIcon,
    StarIcon,
    MapPinIcon,
    ShieldCheckIcon,
    TagIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon
  } from '@heroicons/react/24/outline'
  import { useMutation, useQuery } from '@tanstack/react-query'
  import { getChambreMedias } from '@/app/lib/services/media.services'
  import MediaGallery from './mediasGallerie'
  import { getById } from '@/app/lib/services/chambre.service'
  import { ChatBubbleLeftRightIcon, LockClosedIcon } from '@heroicons/react/24/solid'
  import { createReservation } from '@/app/lib/services/reservation.service'
  import { useSession } from '@/app/lib/auth-client'
  import { usePopup } from '@/components/popup'
import { TransletText } from '@/app/lib/services/translation/transletText'
import Image from 'next/image'

  const TrustMessageCard = () => (
    <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <ShieldCheckIcon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            Votre réservation est protégée
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <LockClosedIcon className="w-4 h-4 text-green-600" />
              <span>Paiement sécurisé et crypté</span>
            </div>
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-600" />
              <span>Support client 7j/7 sur WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-green-600" />
              <span>Annulation gratuite jusqu'à 48h avant l'arrivée</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3 italic">
            🔒 Conforme au RGPD - Vos données ne sont jamais partagées
          </p>
        </div>
      </div>
    </div>
  )

  // ==========================================
  // 📱 CONFIGURATION WHATSAPP
  // ==========================================
  const HOTEL_WHATSAPP_NUMBER = "33780997572" // Format international sans +
  const HOTEL_NAME = "Evasion"

  // ==========================================
  // 📱 ICÔNE WHATSAPP SVG
  // ==========================================
  const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg 
    version="1.1" 
    id="Calque_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    x="0px" 
    y="0px"
    viewBox="0 0 595.28 841.89" 
    xmlSpace="preserve"
   
  >
    {/* CSS Styles moved to inline or an external stylesheet for React context */}
    <style type="text/css">
      {`
        .st0{fill:#FFED00;}
        .st1{fill:#BE1622;}
        .st2{font-family:'AdobeArabic-Regular';}
        .st3{font-size:75.5541px;}
      `}
    </style>
    <g>
      <g>
        <path 
          className="st0" 
          d="M524.26,419.9c0.26,29.31-4.84,57.69-15.64,84.92c-12.55,31.64-31.37,59.04-56.69,81.93
            c-28,25.31-60.41,42.25-97.02,51.13c-26.27,6.38-52.88,7.89-79.76,4.88c-24.82-2.78-48.56-9.41-71.09-20.1
            c-39.28-18.63-70.61-46.32-93.41-83.41c-16.85-27.42-27.13-57.2-31.13-89.16c-4.75-37.91,0.18-74.59,14-110.08
            c7.96-20.44,19-39.14,32.68-56.34c12.63-15.88,27.21-29.62,43.61-41.46c24.69-17.82,52.02-29.94,81.67-36.66
            c20.55-4.66,41.43-6.42,62.48-5.11c38.09,2.37,73.6,13.26,106.05,33.43c36.65,22.77,64.17,53.89,82.72,92.77
            C516.83,356.21,523.7,387.03,524.26,419.9z M482.74,394.37c-0.59-6.87-0.95-13.77-1.82-20.61c-3.24-25.5-12.2-48.9-26.6-70.17
            c-15.49-22.87-35.59-40.76-59.73-54.07c-33.89-18.68-7.26-26.31-108.78-23.4c-32.43,2.45-62.38,12.43-89.66,30.28
            c-17.08,11.18-31.93,24.71-44.03,41.17c-27.03,36.76-37.35,77.8-30.22,122.84c6.34,40.04,25.99,72.91,56.5,99.28
            c20.02,17.31,43.04,29.25,68.52,36.55c28.92,8.28,58.21,9.7,87.77,4.73c27.18-4.57,52.19-14.7,74.91-30.45
            c20.73-14.38,37.68-32.27,50.45-54.02C474.89,451.18,482.24,423.76,482.74,394.37z M424.92,545.43c3.87,5.02,7.53,9.76,11.6,15.05
            c-1.89-0.34-3.12-0.49-4.32-0.78c-6.05-1.46-12.08-2.97-18.13-4.41c-0.65-0.15-1.57-0.17-2.07,0.17c-1.64,1.14-3.14,2.48-4.9,3.9
            c6.65,8.7,13.21,17.28,19.94,26.09c2.19-1.74,4.11-3.27,6.04-4.8c-3.95-5.33-7.63-10.28-11.71-15.78
            c1.24,0.22,1.72,0.27,2.18,0.38c6.05,1.45,12.18,2.63,18.12,4.45c4.23,1.29,6.65-0.55,9.18-3.77
            c-6.65-8.43-13.3-16.86-20.05-25.42C428.75,542.24,426.96,543.73,424.92,545.43z M173.01,550.85c4.44,3.28,8.68,6.41,13.17,9.72
            c1.35-1.82,2.56-3.45,3.85-5.19c-6.44-4.99-12.58-9.75-18.93-14.66c-7.08,8.63-13.93,16.99-20.9,25.5
            c6.86,5.44,13.43,10.66,20.26,16.08c1.39-1.83,2.67-3.5,4.01-5.25c-4.78-3.8-9.23-7.35-13.78-10.96c0.45-0.57,0.8-1.03,1.17-1.47
            c3.35-3.94,3.35-3.93,7.48-0.68c2.55,2,5.14,3.96,7.86,6.06c1.37-1.81,2.5-3.3,3.7-4.89c-4.15-3.16-8.06-6.14-12.14-9.25
            C170.29,554.04,171.58,552.53,173.01,550.85z M314.5,593.55c-5.59-3.28-11.27-4.34-17.26-3.1c-5.58,1.15-8.6,5.18-8.31,10.66
            c0.25,4.56,3.2,6.86,7.09,8.18c2.86,0.97,5.89,1.44,8.69,2.54c1.08,0.42,2.42,1.95,2.4,2.96c-0.01,0.98-1.45,2.35-2.55,2.78
            c-1.32,0.51-3.04,0.53-4.43,0.17c-2.89-0.74-5.68-1.87-8.82-2.95c-1.03,1.38-2.26,3.01-3.57,4.77c6.65,5.05,13.62,6.46,21.18,3.81
            c4.13-1.45,6.25-4.72,6.5-9.07c0.23-3.97-1.86-6.92-6.01-8.71c-1.23-0.53-2.53-0.89-3.82-1.27c-2.01-0.6-4.06-1.07-6.05-1.75
            c-1.48-0.5-2.82-1.29-2.58-3.23c0.24-1.99,1.79-2.83,3.38-2.75c2.47,0.11,4.94,0.69,7.37,1.24c1.17,0.27,2.26,0.92,3.44,1.43
            C312.33,597.24,313.35,595.52,314.5,593.55z M201.54,563.82c-0.18,1.24-0.37,2.14-0.42,3.05c-0.5,9.17-1.02,18.33-1.44,27.5
            c-0.25,5.46-0.13,5.38,4.75,7.76c1.67,0.81,2.72,0.51,3.96-0.71c4.45-4.36,9.04-8.57,13.47-12.94c3.41-3.36,6.68-6.86,10.2-10.51
            c-2.07-0.92-4.16-1.95-6.33-2.75c-0.49-0.18-1.45,0.29-1.91,0.74c-4.31,4.26-8.55,8.59-12.82,12.89
            c-1.02,1.03-2.06,2.05-3.57,3.56c0-1.56-0.05-2.37,0.01-3.17c0.42-5.54,0.8-11.09,1.32-16.62c0.49-5.24,0.56-5.24-4.12-7.42
            C203.73,564.79,202.81,564.39,201.54,563.82z M333.44,587.92c2.11,10.97,4.16,21.65,6.28,32.68c2.68-0.51,5.1-0.96,7.83-1.48
            c-2.09-10.68-4.11-21.05-6.22-31.4c-0.09-0.45-1.06-1.08-1.55-1.02C337.73,586.96,335.71,587.46,333.44,587.92z"
        />
        <path 
          d="M282.33,340.35c0,1.45,0,2.44,0,3.44c-0.02,20.8-0.03,41.59-0.05,62.39c-0.01,18.94-0.03,37.89-0.04,56.83
            c0,1.68-0.26,3.25,2.46,3.23c20.96-0.11,41.93-0.09,62.9-0.04c1.94,0,2.4-0.66,2.38-2.49c-0.09-8.5-0.06-17.01-0.07-25.51
            c-0.01-31.66-0.04-63.32,0.01-94.98c0-2.16-0.53-2.91-2.81-2.9c-16.08,0.09-32.16,0.03-48.24,0.03
            C293.49,340.35,288.11,340.35,282.33,340.35z M267.03,466.04c0-1.61,0-3.1,0-4.6c-0.01-35.61-0.01-71.22-0.02-106.84
            c0-3.96,0.07-7.92-0.1-11.87c-0.03-0.8-0.92-2.2-1.51-2.25c-5-0.46-9.98-0.07-14.47,2.41c-8.58,4.74-12.71,12.11-12.7,21.92
            c0.05,26.17,0.02,52.35,0.05,78.52c0.01,6.77,2.59,12.43,7.65,16.94C251.83,465.53,258.91,466.59,267.03,466.04z M365.11,466.07
            c7.18,0.5,13.74-0.2,19.45-4.53c6.8-5.16,9.34-12.23,9.33-20.53c-0.03-25.68,0.02-51.37-0.02-77.05
            c-0.01-4.08-0.85-8.01-2.96-11.59c-5.42-9.23-13.71-12.62-24.06-12.01c-1.6,0.09-1.7,0.92-1.69,2.13
            c0.03,3.87,0.01,7.75,0.01,11.62c-0.02,35.45-0.04,70.9-0.06,106.35C365.11,462.28,365.11,464.1,365.11,466.07z M221.71,390.53
            c-15.13-8.96-29.7-17.48-44.14-26.22c-4.65-2.81-9.02-5.4-14.79-3.19c-4.35,1.66-8.91,2.77-13.76,4.24
            c0.92,1.44,1.56,2.5,2.26,3.52c7.96,11.56,15.95,23.1,23.85,34.69c0.95,1.4,1.86,0.96,3.02,0.59c9.38-2.94,18.77-5.84,28.15-8.77
            C211.24,393.84,216.18,392.27,221.71,390.53z M229.28,397.45c-1.29,0.37-2.25,0.62-3.2,0.91c-10.46,3.19-20.91,6.36-31.36,9.57
            c-8.84,2.71-17.68,5.44-26.49,8.25c-0.79,0.25-1.35,1.21-2.01,1.84c0.7,0.34,1.37,0.88,2.11,1c7.37,1.27,14.75,2.48,22.13,3.7
            c9.13,1.5,18.26,3,27.39,4.49c3.78,0.62,7.56,1.23,11.42,1.85C229.28,418.35,229.28,408.05,229.28,397.45z M402.63,376.53
            c0.62-0.16,0.88-0.17,1.08-0.3c10.91-6.79,21.91-13.45,32.65-20.5c2.68-1.76,4.85-4.58,6.68-7.3c1.8-2.68,2.07-5.91,0-8.77
            c-2.05-2.83-5.06-3.66-8.3-2.83c-6.66,1.72-13.26,3.65-19.88,5.54c-5.62,1.61-11.23,3.29-17.28,5.07
            C403.73,356.51,402.44,366.52,402.63,376.53z M315.71,307.55c0,0,0,0.01,0,0.01c-4.46,0-8.93-0.12-13.38,0.03
            c-6.25,0.21-11.21,4.1-12.31,10.3c-0.71,4.01-0.42,8.2-0.47,12.31c0,0.43,0.77,1.23,1.2,1.24c2.26,0.08,4.54,0.04,6.79-0.18
            c0.38-0.04,0.9-1.09,0.94-1.71c0.12-1.93,0-3.87,0.06-5.81c0.13-4.18,3.04-7.13,7.18-7.17c6.4-0.06,12.8-0.03,19.19-0.02
            c5.61,0,8.4,2.83,8.28,8.38c-0.16,7.35-0.16,7.35,7.21,6.65c0.08-0.01,0.17-0.01,0.25-0.02c1.34-0.04,1.89-0.62,1.83-2.06
            c-0.12-2.86,0.01-5.73-0.07-8.59c-0.23-7.7-5.87-13.27-13.57-13.38C324.46,307.5,320.08,307.55,315.71,307.55z M284.32,483.4
            c-0.06-5.99-4.14-10.1-9.95-10.02c-5.29,0.08-9.93,4.51-9.93,9.49c0,5.96,4.3,10.26,10.19,10.18
            C279.9,492.98,284.37,488.53,284.32,483.4z M358.16,473.42c-5.72,0.01-10.06,4.18-10.09,9.7c-0.03,5.61,4.19,9.82,9.88,9.86
            c5.34,0.04,9.92-4.25,9.95-9.32C367.93,477.62,363.92,473.41,358.16,473.42z"
        />
        <path 
          d="M424.92,545.43c2.04-1.7,3.83-3.19,5.89-4.91c6.75,8.56,13.39,16.98,20.05,25.42c-2.53,3.21-4.95,5.06-9.18,3.77
            c-5.94-1.81-12.07-3-18.12-4.45c-0.46-0.11-0.94-0.17-2.18-0.38c4.08,5.5,7.76,10.45,11.71,15.78c-1.93,1.53-3.84,3.05-6.04,4.8
            c-6.73-8.8-13.29-17.39-19.94-26.09c1.76-1.43,3.26-2.76,4.9-3.9c0.5-0.35,1.41-0.33,2.07-0.17c6.05,1.44,12.09,2.95,18.13,4.41
            c1.2,0.29,2.43,0.44,4.32,0.78C432.45,555.2,428.79,550.45,424.92,545.43z"
        />
        <path 
          d="M385.01,607.41c-10.47,0.34-17.25-8.55-17.11-17.3c0.16-9.87,9.09-17.8,19.87-17.63c9.31,0.15,16.71,7.8,16.59,17.14
            C404.23,599.71,395.71,607.54,385.01,607.41z M376.09,589.77c0.02,6.05,4.28,10.59,9.89,10.54c5.79-0.05,10.14-4.33,10.15-10
            c0.02-6.02-4.41-10.77-10.02-10.76C380.59,579.56,376.07,584.17,376.09,589.77z"
        />
        <path 
          d="M173.01,550.85c-1.43,1.68-2.71,3.19-4.26,5c4.07,3.1,7.98,6.08,12.14,9.25c-1.2,1.58-2.33,3.08-3.7,4.89
            c-2.72-2.1-5.31-4.05-7.86-6.06c-4.13-3.25-4.13-3.26-7.48,0.68c-0.37,0.44-0.72,0.9-1.17,1.47c4.55,3.62,9,7.16,13.78,10.96
            c-1.34,1.76-2.62,3.43-4.01,5.25c-6.83-5.42-13.4-10.63-20.26-16.08c6.98-8.51,13.83-16.87,20.9-25.5
            c6.35,4.92,12.49,9.68,18.93,14.66c-1.28,1.73-2.5,3.37-3.85,5.19C181.69,557.26,177.45,554.13,173.01,550.85z"
        />
        <path 
          d="M314.5,593.55c-1.15,1.96-2.16,3.69-3.34,5.71c-1.18-0.5-2.26-1.16-3.44-1.43c-2.43-0.55-4.9-1.13-7.37-1.24
            c-1.59-0.07-3.14,0.77-3.38,2.75c-0.24,1.93,1.1,2.73,2.58,3.23c1.99,0.67,4.04,1.15,6.05,1.75c1.29,0.38,2.59,0.74,3.82,1.27
            c4.15,1.79,6.24,4.74,6.01,8.71c-0.25,4.34-2.37,7.62-6.5,9.07c-7.56,2.65-14.53,1.24-21.18-3.81c1.31-1.75,2.53-3.39,3.57-4.77
            c3.14,1.08,5.93,2.21,8.82,2.95c1.39,0.36,3.11,0.34,4.43-0.17c1.11-0.43,2.54-1.81,2.55-2.78c0.01-1.01-1.32-2.53-2.4-2.96
            c-2.8-1.09-5.84-1.57-8.69-2.54c-3.89-1.32-6.84-3.62-7.09-8.18c-0.3-5.47,2.73-9.51,8.31-10.66
            C303.23,589.21,308.91,590.27,314.5,593.55z"
        />
        <path 
          d="M201.54,563.82c1.27,0.57,2.18,0.97,3.09,1.39c4.68,2.18,4.61,2.18,4.12,7.42c-0.52,5.53-0.9,11.08-1.32,16.62
            c-0.06,0.8-0.01,1.61-0.01,3.17c1.51-1.5,2.55-2.52,3.57-3.56c4.27-4.3,8.51-8.63,12.82-12.89c0.46-0.46,1.42-0.92,1.91-0.74
            c2.17,0.79,4.26,1.82,6.33,2.75c-3.53,3.65-6.79,7.15-10.2,10.51c-4.44,4.37-9.02,8.58-13.47,12.94
            c-1.25,1.22-2.29,1.52-3.96,0.71c-4.88-2.38-5-2.3-4.75-7.76c0.42-9.17,0.94-18.33,1.44-27.5
            C201.17,565.96,201.37,565.06,201.54,563.82z"
        />
        <path 
          d="M333.44,587.92c2.28-0.46,4.29-0.96,6.34-1.22c0.48-0.06,1.46,0.57,1.55,1.02c2.11,10.35,4.12,20.72,6.22,31.4
            c-2.73,0.52-5.14,0.97-7.83,1.48C337.6,609.57,335.55,598.89,333.44,587.92z"
        />
        <path 
          className="st1" 
          d="M282.33,340.35c5.78,0,11.16,0,16.53,0c16.08,0.01,32.16,0.06,48.24-0.03c2.28-0.01,2.82,0.74,2.81,2.9
            c-0.05,31.66-0.02,63.32-0.01,94.98c0,8.5-0.03,17.01,0.07,25.51c0.02,1.83-0.44,2.5-2.38,2.49c-20.97-0.05-41.93-0.06-62.9,0.04
            c-2.71,0.01-2.46-1.55-2.46-3.23c0.01-18.94,0.03-37.89,0.04-56.83c0.02-20.8,0.03-41.59,0.05-62.39
            C282.33,342.79,282.33,341.8,282.33,340.35z"
        />
        <path 
          className="st1" 
          d="M267.03,466.04c-8.12,0.55-15.21-0.51-21.1-5.76c-5.06-4.51-7.64-10.17-7.65-16.94
            c-0.03-26.17-0.01-52.35-0.05-78.52c-0.02-9.81,4.12-17.18,12.7-21.92c4.49-2.48,9.46-2.87,14.47-2.41
            c0.59,0.05,1.48,1.45,1.51,2.25c0.17,3.95,0.1,7.91,0.1,11.87c0.01,35.61,0.02,71.22,0.02,106.84
            C267.03,462.94,267.03,464.43,267.03,466.04z"
        />
        <path 
          className="st1" 
          d="M365.11,466.07c0-1.96,0-3.79,0-5.62c0.02-35.45,0.04-70.9,0.06-106.35c0-3.87,0.02-7.75-0.01-11.62
            c-0.01-1.21,0.1-2.04,1.69-2.13c10.35-0.61,18.64,2.78,24.06,12.01c2.11,3.59,2.95,7.52,2.96,11.59
            c0.04,25.68-0.01,51.37,0.02,77.05c0.01,8.29-2.52,15.37-9.33,20.53C378.84,465.86,372.28,466.56,365.11,466.07z"
        />
        <path 
          className="st1" 
          d="M221.71,390.53c-5.52,1.74-10.47,3.31-15.42,4.85c-9.38,2.93-18.77,5.83-28.15,8.77
            c-1.16,0.36-2.06,0.8-3.02-0.59c-7.91-11.59-15.9-23.13-23.85-34.69c-0.7-1.02-1.33-2.08-2.26-3.52
            c4.84-1.47,9.41-2.57,13.76-4.24c5.77-2.21,10.13,0.38,14.79,3.19C192,373.05,206.58,381.57,221.71,390.53z"
        />
        <path 
          className="st1" 
          d="M229.28,397.45c0,10.61,0,20.91,0,31.62c-3.86-0.63-7.64-1.23-11.42-1.85c-9.13-1.49-18.26-2.99-27.39-4.49
            c-7.38-1.22-14.76-2.43-22.13-3.7c-0.74-0.13-1.41-0.66-2.11-1c0.67-0.63,1.23-1.59,2.01-1.84c8.81-2.82,17.65-5.54,26.49-8.25
            c10.45-3.21,20.91-6.38,31.36-9.57C227.03,398.07,227.99,397.81,229.28,397.45z"
        />
        <path 
          className="st1" 
          d="M402.63,376.53c-0.19-10.01,1.09-20.02-5.05-29.08c6.06-1.78,11.66-3.46,17.28-5.07
            c6.61-1.89,13.22-3.83,19.88-5.54c3.24-0.83,6.24,0,8.3,2.83c2.07,2.86,1.8,6.09,0,8.77c-1.83,2.72-4,5.54-6.68,7.3
            c-10.74,7.05-21.74,13.7-32.65,20.5C403.52,376.36,403.25,376.37,402.63,376.53z"
        />
        <path 
          className="st1" 
          d="M315.71,307.55c4.38,0,8.76-0.05,13.13,0.01c7.7,0.11,13.34,5.68,13.57,13.38c0.08,2.86-0.05,5.73,0.07,8.59
            c0.06,1.44-0.49,2.02-1.83,2.06c-0.08,0-0.17,0.01-0.25,0.02c-7.38,0.7-7.38,0.7-7.21-6.65c0.12-5.55-2.66-8.38-8.28-8.38
            c-6.4,0-12.8-0.03-19.19,0.02c-4.14,0.04-7.05,2.98-7.18,7.17c-0.06,1.93,0.06,3.88-0.06,5.81c-0.04,0.61-0.56,1.67-0.94,1.71
            c-2.25,0.21-4.53,0.25-6.79,0.18c-0.43-0.01-1.21-0.81-1.2-1.24c0.04-4.11-0.25-8.3,0.47-12.31c1.1-6.2,6.06-10.09,12.31-10.3
            c4.46-0.15,8.92-0.03,13.38-0.03C315.71,307.56,315.71,307.56,315.71,307.55z"
        />
        <path 
          className="st1" 
          d="M284.32,483.4c0.05,5.13-4.42,9.59-9.68,9.65c-5.89,0.07-10.19-4.22-10.19-10.18c0-4.97,4.65-9.41,9.93-9.49
            C280.18,473.3,284.26,477.41,284.32,483.4z"
        />
        <path 
          className="st1" 
          d="M358.16,473.42c5.77-0.01,9.77,4.2,9.74,10.24c-0.03,5.07-4.61,9.36-9.95,9.32c-5.7-0.04-9.92-4.25-9.88-9.86
            C348.09,477.6,352.44,473.42,358.16,473.42z"
        />
      </g>
      <text 
        transform="matrix(1.333 0.4669 -0.3306 0.9438 222.7556 607.9258)" 
        className="st2 st3"
      >
        A
      </text>
    </g>
  </svg>
  )

  // ==========================================
  // 🎯 SCHEMA VALIDATION MIS À JOUR
  // ==========================================
  const validationSchema = z.object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(10, "Téléphone requis"),
    checkIn: z.string().min(1, "Date d'arrivée requise"),
    checkOut: z.string().min(1, "Date de départ requise"),
    guests: z.number().min(1, "Au moins 1 personne").max(10, "Maximum 10 personnes"),
    acceptCGV: z.boolean().refine(val => val === true, {
      message: "Vous devez accepter les conditions"
    })
  })

  type ValidationFormData = z.infer<typeof validationSchema>

  // ==========================================
  // 🏨 INTERFACE DONNÉES
  // ==========================================
  interface RoomData {
    type: string
    id: string
    createdAt: Date
    nom: string
    description: string
    services: string[] | null
    etablissementId: string
    prix: number
    capacite: number
    disponible: boolean
    etablissement: {
      type: "hotel" | "auberge" | "villa" | "residence" | "autre"
      id: string
      createdAt: Date
      userId: string
      nom: string
      adresse: string
      description: string
      longitude: string
      latitude: string
      pays: string
      ville: string
      services: string[]
      etoiles: number | null
      contact: {
        telephone: string
        email: string
        siteWeb?: string
      }
    }
    medias: Array<{
      id: string
      url: string
      filename: string
      type: "image" | "video"
      createdAt: Date
      chambreId: string
    }>
  }

  // ==========================================
  // 🎨 COMPOSANT RÉSUMÉ SIMPLIFIÉ
  // ==========================================
  const ReservationSummary = ({
    room,
    checkIn,
    checkOut,
    guests
  }: {
    room: RoomData | undefined
    checkIn: string
    checkOut: string
    guests: number
  }) => {
    if (!room) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      )
    }

    const etablissementTypeColors = {
      hotel: "bg-blue-100 text-blue-800",
      auberge: "bg-green-100 text-green-800",
      villa: "bg-purple-100 text-purple-800",
      residence: "bg-orange-100 text-orange-800",
      autre: "bg-gray-100 text-gray-800"
    }

    const formatDate = (dateString: string) => {
      if (!dateString || dateString === "0000-00-00") return "Non définie"
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    }

    const nights = checkIn && checkOut && checkIn !== "0000-00-00" && checkOut !== "0000-00-00"
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        {/* Établissement */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3"><TransletText>Établissement</TransletText></h2>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{room.etablissement.nom}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold capitalize ${etablissementTypeColors[room.etablissement.type]
                  }`}>
                    <TransletText>{room.etablissement.type}</TransletText>
                </span>
              </div>
              {room.etablissement.etoiles && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < room.etablissement.etoiles!
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
              <MapPinIcon className="w-4 h-4 mt-0.5 text-gray-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                <TransletText>{room.etablissement.adresse}</TransletText>, <TransletText>{room.etablissement.ville}</TransletText>, <TransletText>{room.etablissement.pays}</TransletText>
              </span>
            </div>

            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1"><TransletText>Contact</TransletText></p>
              <p className="text-sm font-medium text-gray-800">{room.etablissement.contact.telephone}</p>
            </div>
          </div>
        </div>

        {/* Séjour */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3"><TransletText>Votre séjour</TransletText></h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
              <span className="text-gray-600 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <TransletText>Arrivée</TransletText>
              </span>
              <span className="font-medium text-gray-900">{formatDate(checkIn)}</span>
            </div>

            <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
              <span className="text-gray-600 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <TransletText>Départ</TransletText>
              </span>
              <span className="font-medium text-gray-900">{formatDate(checkOut)}</span>
            </div>

            <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
              <span className="text-gray-600 flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                <TransletText>Nombre de personnes</TransletText>
              </span>
              <span className="font-medium text-gray-900">{guests} / {room.capacite}</span>
            </div>
          </div>
        </div>

        {/* Chambre */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3"><TransletText>Chambre</TransletText></h2>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900"><TransletText>{room.nom}</TransletText></p>
            </div>

            <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                <TransletText>Prix / nuit</TransletText>
              </span>
              <span className="font-medium text-gray-900">{room.prix} €</span>
            </div>

            {nights > 0 && (
              <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg font-semibold">
                <span className="text-gray-600 flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Total ({nights} nuit{nights > 1 ? 's' : ''})
                </span>
                <span className="text-blue-600">{room.prix * nights} €</span>
              </div>
            )}

            {room.services && room.services.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
                  <ShieldCheckIcon className="w-3 h-3" />
                  <TransletText>Services inclus</TransletText>
                </p>
                <div className="flex flex-wrap gap-1">
                  {room.services.slice(0, 4).map((service: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                      <TransletText>{service}</TransletText>
                    </span>
                  ))}
                  {room.services.length > 4 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                      +{room.services.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 🚀 PAGE PRINCIPALE
  // ==========================================
  export default function ReservationValidationPage({ roomId }: { roomId: string }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { show, PopupComponent } = usePopup()

    const [reservationDetails, setReservationDetails] = useState({
      checkIn: "0000-00-00",
      checkOut: "0000-00-00",
      guests: 0
    })

    const { data: session } = useSession()
    const room = useRoom(roomId)
    const roomMedias = room?.medias

    const { mutate } = useMutation({
      mutationFn: createReservation,
      onSuccess: (response) => {
        // The response is now { success: boolean, data?: string, error?: string }
        // We handle the logic in onSubmit to access the response data directly
      },
      onError: (err) => {
        show({
          type: 'error',
          message: "Une erreur technique est survenue. Veuillez réessayer.",
          title: "Erreur"
        })
      }
    })

    // Charger les détails de réservation depuis localStorage ou URL params
    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const draft = localStorage.getItem('reservation-details')

      if (draft) {
        const parsed = JSON.parse(draft)
        setReservationDetails(parsed)
      } else if (params.get('checkIn') && params.get('checkOut')) {
        setReservationDetails({
          checkIn: params.get('checkIn') || '',
          checkOut: params.get('checkOut') || '',
          guests: parseInt(params.get('guests') || '1')
        })
      }
    }, [])

    const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, reset } = useForm<ValidationFormData>({
      resolver: zodResolver(validationSchema),
      mode: "onChange",
      defaultValues: {
        checkIn: reservationDetails.checkIn,
        checkOut: reservationDetails.checkOut,
        guests: reservationDetails.guests
      }
    })

    const formValues = watch()

    useEffect(() => {
      const draft = localStorage.getItem('draft-reservation')
      if (draft) {
        const parsed = JSON.parse(draft)
        Object.keys(parsed).forEach(key => {
          setValue(key as keyof ValidationFormData, parsed[key])
        })
      }
    }, [setValue])

    useEffect(() => {
      const timer = setTimeout(() => {
        if (Object.values(formValues).some(val => val !== '' && val !== false)) {
          localStorage.setItem('draft-reservation', JSON.stringify(formValues))
        }
      }, 3000)

      return () => clearTimeout(timer)
    }, [formValues])

    const handleEmailBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      const email = e.target.value
      if (email.includes('@') && !email.includes('.')) {
        setValue('email', `${email}gmail.com`)
      }
    }, [setValue])

    // Mettre à jour les dates dans le résumé quand elles changent
    useEffect(() => {
      if (formValues.checkIn && formValues.checkOut) {
        setReservationDetails(prev => ({
          ...prev,
          checkIn: formValues.checkIn,
          checkOut: formValues.checkOut,
          guests: formValues.guests
        }))
      }
    }, [formValues.checkIn, formValues.checkOut, formValues.guests])

    const generateWhatsAppMessage = (data: ValidationFormData) => {
      const reservationId = `RES-${Date.now().toString().slice(-6)}`
      const nights = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      const totalPrice = room ? room.prix * nights : 0

      return `🛎️ *NOUVELLE RÉSERVATION* #${reservationId}

  👤 *CLIENT*
  • Nom: ${data.lastName.toUpperCase()}
  • Prénom: ${data.firstName}
  • Email: ${data.email}
  • Tél: ${data.phone}

  🏨 *DÉTAILS RÉSERVATION*
  • Établissement: ${room?.etablissement.nom}
  • Chambre: ${room?.nom}
  • Type: ${room?.etablissement.type}
  • Date d'arrivée: ${data.checkIn}
  • Date de départ: ${data.checkOut}
  • Durée: ${nights} nuit${nights > 1 ? 's' : ''}
  • Nombre de personnes: ${data.guests}/${room?.capacite}
  • Prix / nuit: ${room?.prix} €
  • Prix total: ${totalPrice} €

  💡 *ACTION*
  Le client souhaite finaliser cette réservation. Veuillez confirmer et procéder au paiement.

  🔒 *CGV*: Acceptées`
    }

    const onSubmit = async (data: ValidationFormData) => {
      setIsSubmitting(true)

      try {
        const response = await createReservation({
          roomId: roomId,
          userId: session?.user?.id || null,
          etablissementId: room?.etablissementId || "",
          dateDebut: new Date(data.checkIn),
          dateFin: new Date(data.checkOut),
          nombrePersonnes: data.guests,
          prixTotal: (room?.prix || 0) * Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
          statut: "en_attente",
          ...data
        })

        if (response.success) {
          // Clear form fields
          reset({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            checkIn: '',
            checkOut: '',
            guests: 1,
            acceptCGV: false
          })

          show({
            type: 'success',
            title: "Demande enregistrée !",
            message: "Redirection vers WhatsApp pour finaliser...",
            duration: 3000,
            onAction: () => {
              const message = generateWhatsAppMessage(data)
              const encodedMessage = encodeURIComponent(message)
              const hotelPhone = HOTEL_WHATSAPP_NUMBER
              const whatsappUrl = `https://wa.me/${hotelPhone}?text=${encodedMessage}`
              window.open(whatsappUrl, '_blank')
              localStorage.removeItem('draft-reservation')
              router.push('/')
            }
          })

          setTimeout(() => {
            const message = generateWhatsAppMessage(data)
            const encodedMessage = encodeURIComponent(message)
            const hotelPhone = HOTEL_WHATSAPP_NUMBER
            const whatsappUrl = `https://wa.me/${hotelPhone}?text=${encodedMessage}`
            window.open(whatsappUrl, '_blank')
            localStorage.removeItem('draft-reservation')
            router.push('/')
          }, 1500)

        } else {
          show({
            type: 'error',
            title: "Erreur",
            message: response.error || "Une erreur est survenue lors de la réservation."
          })
        }

      } catch (err) {
        show({
          type: 'error',
          message: "Une erreur inattendue est survenue.",
          title: "Erreur"
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8 px-4">
        {PopupComponent}
        <div className="max-w-6xl mx-auto">

          {/* Gallerie Media */}
          {roomMedias && roomMedias.length > 0 && room && (
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-blue-600" />
               <TransletText>Photos & Vidéos de la chambre</TransletText> 
              </h2>
              <MediaGallery medias={roomMedias} />
            </div>
          )}

          {/* Bouton Modifier sticky */}
          <div className="sticky top-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <PencilSquareIcon className="w-4 h-4" />
              <TransletText>Modifier ma réservation</TransletText> 
            </button>
          </div>

          {/* Résumé + Formulaire */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Colonne 1 : Résumé sticky */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
              <ReservationSummary
                room={room}
                checkIn={reservationDetails.checkIn}
                checkOut={reservationDetails.checkOut}
                guests={reservationDetails.guests}
              />
            </aside>

            {/* Colonne 2 : Formulaire */}
            <main className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">
                  <TransletText>✅ Finaliser votre réservation</TransletText> 
                </h1>
                <TrustMessageCard />

                {/* Dates de séjour - Ultra moderne */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      <TransletText>Date d'arrivée *</TransletText> 
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        {...register("checkIn")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.checkIn
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                          }`}
                      />
                    </div>
                    {errors.checkIn && (
                      <p className="text-red-500 text-xs mt-1 ml-2"> <TransletText>{ errors.checkIn.message||""}</TransletText> </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      <TransletText>Date de départ *</TransletText> 
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        {...register("checkOut")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.checkOut
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                          }`}
                      />
                    </div>
                    {errors.checkOut && (
                      <p className="text-red-500 text-xs mt-1 ml-2">{errors.checkOut.message}</p>
                    )}
                  </div>
                </div>

                {/* Nombre de personnes - Ultra moderne */}
                <div className="mb-6 relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    <TransletText>Nombre de personnes *</TransletText> 
                  </label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      {...register("guests", { valueAsNumber: true })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.guests
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-blue-500'
                        }`}
                    >
                      {[...Array(room?.capacite || 0)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} personne{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.guests && (
                    <p className="text-red-500 text-xs mt-1 ml-2"> <TransletText>{ errors.guests.message||""}</TransletText> </p>
                  )}
                </div>

                {/* Informations personnelles */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Prénom - Ultra moderne */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      <TransletText>Prénom *</TransletText> 
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        {...register("firstName")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.firstName
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                          }`}
                        placeholder="Jean"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-2"> <TransletText>{ errors.firstName.message||""}</TransletText> </p>
                    )}
                  </div>

                  {/* Nom - Ultra moderne */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      <TransletText>Nom *</TransletText> 
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        {...register("lastName")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.lastName
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-blue-500'
                          }`}
                        placeholder="Dupont"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-2">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email - Ultra moderne */}
                <div className="mb-6 relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    <TransletText>Email *</TransletText> 
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      {...register("email")}
                      type="email"
                      onBlur={handleEmailBlur}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-blue-500'
                        }`}
                      placeholder="jean.dupont@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-2"> <TransletText>{ errors.email.message||""}</TransletText> </p>
                  )}
                </div>

                {/* Téléphone - Ultra moderne */}
                <div className="mb-6 relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    <TransletText>Téléphone *</TransletText> 
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      {...register("phone")}
                      type="tel"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 text-black ${errors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-blue-500'
                        }`}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-2"> <TransletText>{ errors.phone.message||""}</TransletText> </p>
                  )}
                </div>

                {/* Conditions - Ultra moderne */}
                <div className="mb-8">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input
                        {...register("acceptCGV")}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 rounded-lg border-2 border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 peer-focus:ring-4 peer-focus:ring-blue-500/20 flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      <TransletText>J'accepte les conditions générales de vente</TransletText> *
                    </span>
                  </label>
                  {errors.acceptCGV && (
                    <p className="text-red-500 text-xs mt-2 ml-10"> <TransletText>{errors.acceptCGV.message||""}</TransletText> </p>
                  )}
                </div>

                {/* Bouton WhatsApp - Ultra moderne */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-6 h-6 animate-spin" />
                      <TransletText>Traitement en cours...</TransletText>
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon className="w-7 h-7 text-white" />
                      <TransletText>Finaliser sur WhatsApp</TransletText>
                    </>
                  )}
                </button>

                {/* Moyens de paiement */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Image
                    src="https://vfluo.fr/cdn/shop/files/paypal-784404_640_750x.png?v=1666961944"
                    alt="PayPal"
                    width={80}
                    height={32}
                    className="h-8"
                  />
                  <Image
                    src="https://vfluo.fr/cdn/shop/files/virement_bancaire_1300x1300_2267b12b-5f6f-4af6-8cc2-06c2f8590902_750x.png?v=1667486674"
                    alt="Virement bancaire"
                    width={80}
                    height={32}
                    className="h-8"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                  <TransletText>🔒 Vos données sont sécurisées et chiffrées. Un conseiller vous répondra sous 30 minutes sur WhatsApp pour confirmer et procéder au paiement sécurisé.</TransletText>
                </p>
              </form>
            </main>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 📡 HOOKS DATA
  // ==========================================
  const useRoomMedias = (roomId: string) => {
    const { data: roomMedias, isLoading, error, isSuccess } = useQuery({
      queryKey: ['roomMedias', roomId],
      queryFn: async () => {
        return await getChambreMedias(roomId)
      },
      enabled: !!roomId,
      staleTime: 5 * 60 * 1000,
    })

    if (isSuccess) {
      return roomMedias.medias
    }
    if (error) {
      throw new Error(error.message)
    }
    return undefined
  }

  const useRoom = (roomId: string) => {
    const { data: room, isLoading, error, isSuccess } = useQuery({
      queryKey: ['room', roomId],
      queryFn: async () => {
        return await getById(roomId)
      },
      enabled: !!roomId,
      staleTime: 5 * 60 * 1000,
    })

    if (isSuccess) {
      return room
    }
    if (error) {
      throw new Error(error.message)
    }
    return undefined
  }