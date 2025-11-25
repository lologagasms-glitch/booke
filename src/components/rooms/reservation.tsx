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
const HOTEL_WHATSAPP_NUMBER = "33612345678" // Format international sans +
const HOTEL_NAME = "Notre Hôtel"

// ==========================================
// 📱 ICÔNE WHATSAPP SVG
// ==========================================
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
        <h2 className="text-lg font-bold text-gray-900 mb-3">Établissement</h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{room.etablissement.nom}</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold capitalize ${etablissementTypeColors[room.etablissement.type]
                }`}>
                {room.etablissement.type}
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
              {room.etablissement.adresse}, {room.etablissement.ville}, {room.etablissement.pays}
            </span>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Contact</p>
            <p className="text-sm font-medium text-gray-800">{room.etablissement.contact.telephone}</p>
          </div>
        </div>
      </div>

      {/* Séjour */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Votre séjour</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Arrivée
            </span>
            <span className="font-medium text-gray-900">{formatDate(checkIn)}</span>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Départ
            </span>
            <span className="font-medium text-gray-900">{formatDate(checkOut)}</span>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Nombre de personnes
            </span>
            <span className="font-medium text-gray-900">{guests} / {room.capacite}</span>
          </div>
        </div>
      </div>

      {/* Chambre */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Chambre</h2>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-900">{room.nom}</p>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Prix / nuit
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
                Services inclus
              </p>
              <div className="flex flex-wrap gap-1">
                {room.services.slice(0, 4).map((service: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                    {service}
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
              Photos & Vidéos de la chambre
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
            <span className="text-sm font-medium">Modifier ma réservation</span>
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
              <h1 className="text-2xl font-bold mb-6 text-gray-900">✅ Finaliser votre réservation</h1>
              <TrustMessageCard />

              {/* Dates de séjour - Ultra moderne */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Date d'arrivée *
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
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.checkIn.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Date de départ *
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
                  Nombre de personnes *
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
                  <p className="text-red-500 text-xs mt-1 ml-2">{errors.guests.message}</p>
                )}
              </div>

              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Prénom - Ultra moderne */}
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Prénom *
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
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Nom - Ultra moderne */}
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Nom *
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
                  Email *
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
                  <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>
                )}
              </div>

              {/* Téléphone - Ultra moderne */}
              <div className="mb-6 relative">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Téléphone *
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
                  <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone.message}</p>
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
                    J'accepte les <a href="/cgv" className="text-blue-600 underline hover:text-blue-800 font-medium">conditions générales de vente</a> *
                  </span>
                </label>
                {errors.acceptCGV && (
                  <p className="text-red-500 text-xs mt-2 ml-10">{errors.acceptCGV.message}</p>
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
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="w-7 h-7 text-white" />
                    <span>Finaliser sur WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                🔒 Vos données sont sécurisées et chiffrées. Un conseiller vous répondra sous 30 minutes sur WhatsApp pour confirmer et procéder au paiement sécurisé.
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