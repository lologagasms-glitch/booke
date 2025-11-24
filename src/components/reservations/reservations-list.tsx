'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CalendarIcon,
    MapPinIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CurrencyEuroIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Define types based on the schema/service return type
type Reservation = {
    id: string
    dateDebut: Date
    dateFin: Date
    nombrePersonnes: number
    prixTotal: number
    statut: 'confirm' | 'en_attente' | 'annul'
    etablissement?: {
        nom: string
        ville: string
        pays: string
        type: string
    }
    chambre?: {
        nom: string
        type: string
    }
    user?: {
        name: string
        email: string
    }
}

interface ReservationsListProps {
    reservations: Reservation[]
}

export default function ReservationsList({ reservations }: ReservationsListProps) {
    const [activeTab, setActiveTab] = useState<'en_attente' | 'confirm' | 'annul'>('en_attente')

    const filteredReservations = reservations.filter(r => r.statut === activeTab)

    const tabs = [
        { id: 'en_attente', label: 'En attente', icon: ClockIcon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        { id: 'confirm', label: 'Confirmées', icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        { id: 'annul', label: 'Annulées', icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    ] as const

    return (
        <div className="w-full max-w-5xl mx-auto">

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-4 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${activeTab === tab.id
                                ? 'bg-white shadow-md text-gray-900 ring-1 ring-black/5 scale-105'
                                : 'bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm'
                            }
            `}
                    >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${tab.color.replace('text-', 'bg-')}`}
                            />
                        )}
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-200'}`}>
                            {reservations.filter(r => r.statut === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
                    >
                        {filteredReservations.length > 0 ? (
                            filteredReservations.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                                    {activeTab === 'en_attente' && <ClockIcon className="w-8 h-8 text-gray-300" />}
                                    {activeTab === 'confirm' && <CheckCircleIcon className="w-8 h-8 text-gray-300" />}
                                    {activeTab === 'annul' && <XCircleIcon className="w-8 h-8 text-gray-300" />}
                                </div>
                                <p className="text-lg font-medium text-gray-500">Aucune réservation {
                                    activeTab === 'en_attente' ? 'en attente' :
                                        activeTab === 'confirm' ? 'confirmée' : 'annulée'
                                }</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
    const statusConfig = {
        en_attente: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'En attente' },
        confirm: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Confirmée' },
        annul: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Annulée' },
    }

    const config = statusConfig[reservation.statut]

    return (
        <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${config.bg}`}>
                        <BuildingOfficeIcon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{reservation.etablissement?.nom || 'Établissement inconnu'}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{reservation.etablissement?.ville}, {reservation.etablissement?.pays}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                    {config.label}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-50 my-4" />

            {/* Details */}
            <div className="space-y-3">

                {/* Dates */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dates</span>
                        <span className="font-semibold text-gray-900">
                            {format(new Date(reservation.dateDebut), 'dd MMM', { locale: fr })} - {format(new Date(reservation.dateFin), 'dd MMM yyyy', { locale: fr })}
                        </span>
                    </div>
                </div>

                {/* Room & Guests */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Détails</span>
                        <span className="font-medium text-gray-900">
                            {reservation.chambre?.nom} • {reservation.nombrePersonnes} pers.
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <CurrencyEuroIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Prix Total</span>
                        <span className="font-bold text-gray-900 text-lg">
                            {reservation.prixTotal} €
                        </span>
                    </div>
                </div>

            </div>

            {/* Footer Actions (Optional - can be added later) */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Voir les détails &rarr;
                </button>
            </div>
        </div>
    )
}
