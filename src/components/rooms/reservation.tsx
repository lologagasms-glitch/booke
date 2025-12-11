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

// Carte de confiance - Style thématique
const TrustMessageCard = () => (
  <div className="mb-6 bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <ShieldCheckIcon className="w-8 h-8 text-theme-btn flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h3 className="font-semibold text-theme-main mb-2 flex items-center gap-2">
          <TransletText>Votre réservation est protégée</TransletText>
        </h3>
        <div className="space-y-2 text-sm text-theme-main">
          <div className="flex items-center gap-2">
            <LockClosedIcon className="w-4 h-4 text-green-600" />
            <TransletText>Paiement sécurisé et crypté</TransletText>
          </div>
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-600" />
            <TransletText>Support client 7j/7 sur WhatsApp</TransletText>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-green-600" />
            <TransletText>Annulation gratuite jusqu'à 48h avant l'arrivée</TransletText>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 italic">
          🔒 <TransletText>Conforme au RGPD - Vos données ne sont jamais partagées</TransletText>
        </p>
      </div>
    </div>
  </div>
)

// Configuration WhatsApp
const HOTEL_WHATSAPP_NUMBER = "33780997572"
const HOTEL_NAME = "Evasion"



// Schéma validation
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

// Composant Résumé Simplifié - Style thématique
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
      <div className="bg-theme-card rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-theme-base rounded mb-4"></div>
        <div className="h-4 bg-theme-base rounded mb-2"></div>
        <div className="h-4 bg-theme-base rounded mb-2"></div>
      </div>
    )
  }

  const etablissementTypeColors = {
    hotel: "bg-theme-btn/10 text-theme-btn",
    auberge: "bg-green-100 text-green-800",
    villa: "bg-purple-100 text-purple-800",
    residence: "bg-orange-100 text-orange-800",
    autre: "bg-theme-base text-theme-main"
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
    <div className="bg-theme-card rounded-2xl shadow-xl p-6 border border-theme-border">
      {/* Établissement */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-theme-main"><TransletText>Établissement</TransletText></h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-theme-main">{room.etablissement.nom}</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold capitalize ${etablissementTypeColors[room.etablissement.type]}`}>
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

          <div className="flex items-start gap-2 p-2 bg-theme-base rounded-lg">
            <MapPinIcon className="w-4 h-4 mt-0.5 text-gray-600 flex-shrink-0" />
            <span className="text-sm text-theme-main">
              <TransletText>{room.etablissement.adresse}</TransletText>, <TransletText>{room.etablissement.ville}</TransletText>, <TransletText>{room.etablissement.pays}</TransletText>
            </span>
          </div>

          <div className="p-2 bg-theme-base rounded-lg">
            <p className="text-xs text-gray-500 mb-1"><TransletText>Contact</TransletText></p>
            <p className="text-sm font-medium text-theme-main">{room.etablissement.contact.telephone}</p>
          </div>
        </div>
      </div>

      {/* Séjour */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-theme-main"><TransletText>Votre séjour</TransletText></h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm p-2 bg-theme-base rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <TransletText>Arrivée</TransletText>
            </span>
            <span className="font-medium text-theme-main">{formatDate(checkIn)}</span>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-theme-base rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <TransletText>Départ</TransletText>
            </span>
            <span className="font-medium text-theme-main">{formatDate(checkOut)}</span>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-theme-base rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              <TransletText>Nombre de personnes</TransletText>
            </span>
            <span className="font-medium text-theme-main">{guests} / {room.capacite}</span>
          </div>
        </div>
      </div>

      {/* Chambre */}
      <div>
        <h2 className="text-lg font-bold mb-3 text-theme-main"><TransletText>Chambre</TransletText></h2>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-theme-main"><TransletText>{room.nom}</TransletText></p>
          </div>

          <div className="flex items-center justify-between text-sm p-2 bg-theme-base rounded-lg">
            <span className="text-gray-600 flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              <TransletText>Prix / nuit</TransletText>
            </span>
            <span className="font-medium text-theme-main">{room.prix} €</span>
          </div>

          {nights > 0 && (
            <div className="flex items-center justify-between text-sm p-2 bg-theme-base rounded-lg font-semibold">
              <span className="text-gray-600 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Total ({nights} nuit{nights > 1 ? 's' : ''})
              </span>
              <span className="text-theme-btn">{room.prix * nights} €</span>
            </div>
          )}

          {room.services && room.services.length > 0 && (
            <div className="p-3 bg-theme-base rounded-lg border border-theme-border">
              <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
                <ShieldCheckIcon className="w-3 h-3" />
                <TransletText>Services inclus</TransletText>
              </p>
              <div className="flex flex-wrap gap-1">
                {room.services.slice(0, 4).map((service: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-theme-base text-theme-main text-xs rounded-md font-medium">
                    <TransletText>{service}</TransletText>
                  </span>
                ))}
                {room.services.length > 4 && (
                  <span className="px-2 py-1 bg-theme-base text-theme-main text-xs rounded-md font-medium">
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

// Page principale - Style thématique
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
    onSuccess: (response) => {},
    onError: (err) => {
      show({
        type: 'error',
        message: "Une erreur technique est survenue. Veuillez réessayer.",
        title: "Erreur"
      })
    }
  })

  // Charger les détails de réservation
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

  // Mettre à jour les dates dans le résumé
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
    <div className="min-h-screen bg-theme-base py-4 md:py-8 px-4">
      {PopupComponent}
      <div className="max-w-6xl mx-auto">

        {/* Gallerie Media */}
        {roomMedias && roomMedias.length > 0 && room && (
          <div className="mb-8 bg-theme-card rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-theme-main">
              <PhotoIcon className="w-5 h-5 text-theme-btn" />
              <TransletText>Photos & Vidéos de la chambre</TransletText>
            </h2>
            <MediaGallery medias={roomMedias} />
          </div>
        )}

        {/* Bouton Modifier sticky */}
        <div className="sticky top-4 z-10 bg-theme-card/95 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-theme-btn hover:text-theme-btn-hover transition-colors"
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
            <form onSubmit={handleSubmit(onSubmit)} className="bg-theme-card rounded-2xl shadow-lg p-6 md:p-8">
              <h1 className="text-2xl font-bold mb-6 text-theme-main">
                <TransletText>✅ Finaliser votre réservation</TransletText>
              </h1>
              <TrustMessageCard />

              {/* Dates de séjour */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-theme-main">
                    <TransletText>Date d'arrivée *</TransletText>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      {...register("checkIn")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.checkIn
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                        }`}
                    />
                  </div>
                  {errors.checkIn && (
                    <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.checkIn.message || ""}</TransletText></p>
                  )}
                </div>

                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-theme-main">
                    <TransletText>Date de départ *</TransletText>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      {...register("checkOut")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.checkOut
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                        }`}
                    />
                  </div>
                  {errors.checkOut && (
                    <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.checkOut.message || ""}</TransletText></p>
                  )}
                </div>
              </div>

              {/* Nombre de personnes */}
              <div className="mb-6 relative">
                <label className="block mb-2 text-sm font-semibold text-theme-main">
                  <TransletText>Nombre de personnes *</TransletText>
                </label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    {...register("guests", { valueAsNumber: true })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.guests
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
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
                  <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.guests.message || ""}</TransletText></p>
                )}
              </div>

              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Prénom */}
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-theme-main">
                    <TransletText>Prénom *</TransletText>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      {...register("firstName")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.firstName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                        }`}
                      placeholder="Jean"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.firstName.message || ""}</TransletText></p>
                  )}
                </div>

                {/* Nom */}
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-theme-main">
                    <TransletText>Nom *</TransletText>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      {...register("lastName")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.lastName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                        }`}
                      placeholder="Dupont"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.lastName.message || ""}</TransletText></p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-6 relative">
                <label className="block mb-2 text-sm font-semibold text-theme-main">
                  <TransletText>Email *</TransletText>
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    {...register("email")}
                    type="email"
                    onBlur={handleEmailBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                      }`}
                    placeholder="jean.dupont@gmail.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.email.message || ""}</TransletText></p>
                )}
              </div>

              {/* Téléphone */}
              <div className="mb-6 relative">
                <label className="block mb-2 text-sm font-semibold text-theme-main">
                  <TransletText>Téléphone *</TransletText>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    {...register("phone")}
                    type="tel"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-theme-base text-theme-main focus:bg-theme-card transition-all duration-200 focus:ring-4 ${errors.phone
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-theme-border focus:border-theme-btn focus:ring-theme-btn/20'
                      }`}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-2"><TransletText>{errors.phone.message || ""}</TransletText></p>
                )}
              </div>

              {/* Conditions */}
              <div className="mb-8">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      {...register("acceptCGV")}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-lg border-2 border-theme-border peer-checked:bg-theme-btn peer-checked:border-theme-btn transition-all duration-200 peer-focus:ring-4 peer-focus:ring-theme-btn/20 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-sm text-theme-main group-hover:text-theme-btn transition-colors">
                    <TransletText>J'accepte les conditions générales de vente</TransletText> *
                  </span>
                </label>
                {errors.acceptCGV && (
                  <p className="text-red-500 text-xs mt-2 ml-10"><TransletText>{errors.acceptCGV.message || ""}</TransletText></p>
                )}
              </div>

              {/* Bouton WhatsApp */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full bg-theme-btn hover:bg-theme-btn-hover disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-6 h-6 animate-spin" />
                    <TransletText>Traitement en cours...</TransletText>
                  </>
                ) : (
                  <>
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

// Hooks Data
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