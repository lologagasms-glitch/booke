'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CalendarDaysIcon, 
  UserIcon, 
  HomeModernIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SignalIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { 
  format, 
  isFuture,
  differenceInDays,
  isToday,
  isTomorrow 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAllReservationByUserAndByChambre } from '@/app/lib/services/reservation.service';

// Types mis à jour pour correspondre aux données réelles
type ReservationStatus = 'confirm' | 'en_attente' | 'annul';
type UrgencyLevel = 'high' | 'medium' | 'low';

// Interface complète basée sur votre schéma Drizzle
interface Reservation {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  nombrePersonnes: number;
  prixTotal: number;
  statut: ReservationStatus;
  createdAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    role?: "USER" | "ADMIN";
    banned?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  chambre?: {
    id: string;
    nom: string;
    etablissement?: {
      id: string;
      nom: string;
    };
  };
}

const ITEMS_PER_PAGE = 10;

export default function ReservationsDashboard() {
  const [activeTab, setActiveTab] = useState<'sejours' | 'annulations' | 'demandes'>('sejours');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations', 'realtime'],
    queryFn: () => getAllReservationByUserAndByChambre(),
    refetchInterval: 30000,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const calculateUrgency = (date: Date): { level: UrgencyLevel; label: string } => {
    const days = differenceInDays(date, new Date());
    if (days < 0) return { level: 'low', label: 'Passé' };
    if (isToday(date)) return { level: 'high', label: "Aujourd'hui" };
    if (isTomorrow(date)) return { level: 'high', label: 'Demain' };
    if (days <= 2) return { level: 'high', label: `Dans ${days}j` };
    if (days <= 7) return { level: 'medium', label: `Dans ${days}j` };
    return { level: 'low', label: `Dans ${days}j` };
  };

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    
    return reservations.filter(r => {
      const tabMatch = 
        activeTab === 'sejours' ? r.statut === 'confirm' :
        activeTab === 'annulations' ? r.statut === 'annul' :
        r.statut === 'en_attente';
      
      const statusMatch = statusFilter === 'all' || r.statut === statusFilter;
      
      const searchMatch = !searchQuery || 
        r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.chambre?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r?.etablissement?.nom?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return tabMatch && statusMatch && searchMatch;
    }).sort((a, b) => 
      differenceInDays(a.dateDebut, new Date()) - differenceInDays(b.dateDebut, new Date())
    );
  }, [reservations, activeTab, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    if (!reservations) return { sejours: 0, annulations: 0, demandes: 0, arrivages: 0 };
    
    return {
      sejours: reservations.filter(r => r.statut === 'confirm').length,
      annulations: reservations.filter(r => r.statut === 'annul').length,
      demandes: reservations.filter(r => r.statut === 'en_attente').length,
      arrivages: reservations.filter(r => 
        r.statut === 'confirm' && (isToday(r.dateDebut) || isTomorrow(r.dateDebut))
      ).length,
    };
  }, [reservations]);

  const paginatedData = filteredReservations.slice(0, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);

  const getUrgencyStyles = (level: UrgencyLevel) => {
    switch(level) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusStyles = (statut: ReservationStatus) => {
    const base = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold";
    switch(statut) {
      case 'confirm': return `${base} bg-green-100 text-green-800`;
      case 'en_attente': return `${base} bg-amber-100 text-amber-800`;
      case 'annul': return `${base} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 sm:h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        
        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                Tableau de bord
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <SignalIcon className="h-4 w-4 text-green-500 animate-pulse flex-shrink-0" />
                <p className="text-sm sm:text-base text-black truncate">
                  Suivi des réservations en temps réel
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-black flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full">
                <div className="relative">
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-green-700 font-medium">LIVE</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">MAJ : {format(new Date(), 'HH:mm:ss')}</span>
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Séjours Confirmés', value: stats.sejours, sub: `${reservations?.filter(r => r.statut === 'confirm' && isFuture(r.dateDebut)).length} à venir`, icon: CalendarDaysIcon, color: 'green' },
            { label: 'Arrivages Proches', value: stats.arrivages, sub: 'Aujourd\'hui & Demain', icon: HomeModernIcon, color: stats.arrivages > 0 ? 'red' : 'blue', highlight: stats.arrivages > 0 },
            { label: 'Demandes en Attente', value: stats.demandes, sub: 'À traiter rapidement', icon: ClockIcon, color: 'amber' },
            { label: 'Annulations', value: stats.annulations, sub: 'Ce mois-ci', icon: XCircleIcon, color: 'gray' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl shadow-sm border p-3 sm:p-4 md:p-5 hover:shadow-md transition-all duration-200 group
              ${stat.highlight ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-black">{stat.label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-0.5 ${
                    stat.highlight ? 'text-red-700' : 'text-black'
                  }`}>{stat.value}</p>
                  <p className="text-xs text-black mt-1">{stat.sub}</p>
                </div>
                <div className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0
                  ${stat.highlight ? `bg-${stat.color}-100` : `bg-${stat.color}-50 group-hover:bg-${stat.color}-100`}`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== BARRE D'OUTILS ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
              >
                <option value="all">Tous</option>
                <option value="confirm">Confirmé</option>
                <option value="en_attente">En attente</option>
                <option value="annul">Annulé</option>
              </select>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-3 sm:px-4 py-2.5 sm:py-3 text-black hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 flex-shrink-0"
                title="Réinitialiser les filtres"
              >
                <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'sejours', label: 'Séjours', count: stats.sejours },
                { id: 'demandes', label: 'Demandes', count: stats.demandes },
                { id: 'annulations', label: 'Annulations', count: stats.annulations },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setPage(1);
                  }}
                  className={`relative flex-1 min-w-0 px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                      : 'text-black hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold
                        ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-black'}`}>
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* VUE MOBILE */}
          <div className="block sm:hidden">
            {paginatedData.length === 0 ? (
              <div className="text-center py-12 px-4">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-black">Aucune réservation</h3>
                <p className="text-gray-500 text-sm mt-1">Essayez d'ajuster vos filtres</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {paginatedData.map(reservation => {
                  const urgency = calculateUrgency(reservation.dateDebut);
                  return (
                    <div key={reservation.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-black text-sm truncate">
                              {reservation.user?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-black truncate">
                              {reservation.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className={getStatusStyles(reservation.statut)}>
                          {reservation.statut === 'confirm' && <CheckCircleIcon className="h-3 w-3" />}
                          {reservation.statut === 'en_attente' && <ClockIcon className="h-3 w-3" />}
                          {reservation.statut === 'annul' && <XCircleIcon className="h-3 w-3" />}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <HomeModernIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-black font-medium">
                            {reservation.chambre?.nom || 'N/A'}
                          </span>
                          <span className="text-gray-500 text-xs truncate">
                            • {reservation?.etablissement?.nom || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-black">
                            {format(reservation.dateDebut, 'dd MMM', { locale: fr })} → {format(reservation.dateFin, 'dd MMM', { locale: fr })}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({differenceInDays(reservation.dateFin, reservation.dateDebut)} nuits)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${getUrgencyStyles(urgency.level)}`}>
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            {urgency.label}
                          </div>
                          <div className="flex items-center gap-1 text-sm font-bold text-black">
                            <BanknotesIcon className="h-4 w-4 text-gray-500" />
                            {reservation.prixTotal.toFixed(2)} €
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                            <EyeIcon className="h-4 w-4" />
                            Voir détails
                          </button>
                          {reservation.statut === 'en_attente' && (
                            <button className="px-4 py-2 text-sm font-semibold text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap">
                              Confirmer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* VUE DESKTOP */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Chambre
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Statut & Prix
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((reservation) => {
                  const urgency = calculateUrgency(reservation.dateDebut);
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-black truncate">
                              {reservation.user?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-black truncate">
                              {reservation.user?.email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-black mt-0.5">
                              <UserIcon className="h-3 w-3" />
                              {reservation.nombrePersonnes} pers.
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-black">
                            {reservation.chambre?.nom || 'N/A'}
                          </div>
                          <div className="text-xs text-black mt-0.5 flex items-center gap-1">
                            <HomeModernIcon className="h-3 w-3" />
                            <span className="truncate">{reservation?.etablissement?.nom || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="text-sm font-medium text-black">
                            {format(reservation.dateDebut, 'dd MMM', { locale: fr })} → {format(reservation.dateFin, 'dd MMM', { locale: fr })}
                          </div>
                          <div className="text-xs text-black">
                            {differenceInDays(reservation.dateFin, reservation.dateDebut)} nuits
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getUrgencyStyles(urgency.level)}`}>
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            {urgency.label}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="space-y-1.5">
                          <div className={getStatusStyles(reservation.statut)}>
                            {reservation.statut === 'confirm' && <CheckCircleIcon className="h-3 w-3" />}
                            {reservation.statut === 'en_attente' && <ClockIcon className="h-3 w-3" />}
                            {reservation.statut === 'annul' && <XCircleIcon className="h-3 w-3" />}
                            {reservation.statut === 'confirm' ? 'Confirmé' : 
                             reservation.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                          </div>
                          <div className="text-sm font-bold text-black">
                            {reservation.prixTotal.toFixed(2)} €
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5 md:gap-2">
                          <button className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                            <EyeIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden lg:inline">Détails</span>
                          </button>
                          {reservation.statut === 'en_attente' && (
                            <button className="px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors">
                              Confirmer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paginatedData.length === 0 && (
              <div className="text-center py-16 px-6">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-black">Aucune réservation trouvée</h3>
                <p className="text-gray-500 mb-6">Essayez d'ajuster vos filtres ou votre recherche</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {page < totalPages && (
            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="w-full py-2.5 md:py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span className="truncate">Charger plus ({totalPages - page} pages)</span>
              </button>
            </div>
          )}
        </div>

        {/* ===== INDICATEUR MOBILE ===== */}
        <div className="flex sm:hidden items-center justify-center gap-2 text-xs text-black">
          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-full">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">LIVE</span>
          </div>
          <span>MAJ : {format(new Date(), 'HH:mm')}</span>
        </div>
      </div>
    </div>
  );
}