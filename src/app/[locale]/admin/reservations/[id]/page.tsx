"use server"
import { getReservationById } from '@/app/lib/services/reservation.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    UserIcon,
    CalendarDaysIcon,
    HomeModernIcon,
    BanknotesIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';

export default async function ReservationDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id } = await params;
    const response = await getReservationById(id);

    if (!response.success || !response.data) {
        notFound();
    }

    const reservation = response.data;

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'confirm':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4" />
                        Confirmé
                    </span>
                );
            case 'en_attente':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                        <ClockIcon className="h-4 w-4" />
                        En attente
                    </span>
                );
            case 'annul':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                        <XCircleIcon className="h-4 w-4" />
                        Annulé
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/reservations"
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails de la réservation</h1>
                        <p className="text-sm text-gray-500">ID: {reservation.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Content - Left Column */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Status Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">État de la réservation</h2>
                                {getStatusBadge(reservation.statut)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Date de création</p>
                                    <p className="font-medium text-gray-900">
                                        {format(new Date(reservation.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        à {format(new Date(reservation.createdAt), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <HomeModernIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Hébergement</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Chambre</p>
                                    <p className="text-lg font-medium text-gray-900">{reservation.chambre?.nom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Établissement</p>
                                    <p className="font-medium text-gray-900">{reservation.etablissement?.nom}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                                    <UserIcon className="h-4 w-4" />
                                    <span>{reservation.nombrePersonnes} personnes</span>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Dates du séjour</h2>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Arrivée</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {format(new Date(reservation.dateDebut), 'dd MMM', { locale: fr })}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {format(new Date(reservation.dateDebut), 'yyyy')}
                                    </p>
                                </div>
                                <div className="flex-1 px-4 flex flex-col items-center">
                                    <div className="w-full h-px bg-gray-300 relative">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-xs text-gray-500 font-medium">
                                            {Math.ceil((new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime()) / (1000 * 60 * 60 * 24))} nuits
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Départ</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {format(new Date(reservation.dateFin), 'dd MMM', { locale: fr })}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {format(new Date(reservation.dateFin), 'yyyy')}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">

                        {/* Client Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <UserIcon className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Client</h2>
                            </div>

                            {reservation.user ? (
                                <>
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                                            {reservation.user.image ? (
                                                <img src={reservation.user.image} alt={reservation.user.name || 'Client'} className="h-full w-full object-cover" />
                                            ) : (
                                                <UserIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900">{reservation.user.name || 'Nom inconnu'}</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                            {reservation.user.role || 'USER'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                            <span className="truncate">{reservation.user.email}</span>
                                        </div>
                                        {/* Add phone if available in user model */}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 text-sm">
                                    Aucune information client disponible
                                </div>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <BanknotesIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Paiement</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Prix par nuit (est.)</span>
                                    <span className="font-medium">
                                        {(reservation.prixTotal / Math.ceil((new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)} €
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-green-600">{reservation.prixTotal.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
