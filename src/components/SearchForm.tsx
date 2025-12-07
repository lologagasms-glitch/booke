'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MagnifyingGlassIcon, CalendarIcon, UserIcon, CheckIcon, MinusIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Toggle switch futuriste
const FuturisticToggle = ({
  active,
  onToggle,
  label
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center justify-between w-full group"
    role="switch"
    aria-checked={active}
  >
    <span className="font-medium text-gray-900 text-sm sm:text-base">{label}</span>
    <div className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all duration-300 ${active
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30'
        : 'bg-gray-300'
      }`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'translate-x-5 sm:translate-x-6' : ''
        }`} />
    </div>
  </button>
);

// Compteur avec design futuriste
const GuestCounter = ({
  label,
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 20
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group">
    <div>
      <span className="font-semibold text-gray-900 text-sm sm:text-base">{label}</span>
      <p className="text-xs text-gray-500 mt-0.5">
        {label === 'Adultes' && 'Âge 18+'}
        {label === 'Enfants' && 'Âge 0-17'}
        {label === 'Chambres' && 'Nombre de chambres'}
      </p>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= min}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center 
                   transition-all hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed
                   group-hover:scale-105 active:scale-95"
      >
        <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
      </button>
      <span className="w-6 sm:w-8 text-center font-bold text-base sm:text-lg text-gray-900">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={value >= max}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center 
                   transition-all hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed
                   group-hover:scale-105 active:scale-95"
      >
        <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
      </button>
    </div>
  </div>
);

// Hook générique pour fermer le dropdown
function useClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, handler: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler]);
}

const SearchForm = () => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isBusinessTrip, setIsBusinessTrip] = useState(false);
  const [isPetsAllowed, setIsPetsAllowed] = useState(false);
  const { locale } = useParams()
  const guestsRef = useRef<HTMLDivElement>(null);
  useClickOutside(guestsRef as React.RefObject<HTMLDivElement>, () => setIsGuestsOpen(false));

  // Validation des dates
  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setCheckOut(null);
      setDateError('La date de départ doit être après la date d\'arrivée');
    } else {
      setDateError(null);
    }
  }, [checkIn, checkOut]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setDateError('Veuillez entrer une destination');
      return;
    }
    if (!checkIn || !checkOut) {
      setDateError('Veuillez sélectionner les dates');
      return;
    }

    const searchParams = new URLSearchParams({
      destination: destination.trim(),
      checkIn: format(checkIn, 'yyyy-MM-dd'),
      checkOut: format(checkOut, 'yyyy-MM-dd'),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      rooms: guests.rooms.toString(),
      ...(isBusinessTrip && { business: 'true' }),
      ...(isPetsAllowed && { pets: 'true' })
    });

    // Redirection vers locale/search-result avec les paramètres
    router.push(`/${locale}/search-results?${searchParams.toString()}`);
  }, [destination, checkIn, checkOut, guests, isBusinessTrip, isPetsAllowed, router, locale]);

  // Animation du badge quand le nombre change
  const [badgePulse, setBadgePulse] = useState(false);
  const totalGuests = guests.adults + guests.children;
  useEffect(() => {
    setBadgePulse(true);
    const timer = setTimeout(() => setBadgePulse(false), 300);
    return () => clearTimeout(timer);
  }, [totalGuests, guests.rooms]);

  // ---------- FIX ICI : Ajout du manquant ----------
  const guestsText = useMemo(() => {
    const parts = [`${guests.adults} adulte${guests.adults > 1 ? 's' : ''}`];
    if (guests.children > 0) {
      parts.push(`${guests.children} enfant${guests.children > 1 ? 's' : ''}`);
    }
    parts.push(`${guests.rooms} chambre${guests.rooms > 1 ? 's' : ''}`);
    return parts.join(', ');
  }, [guests]);
  // ---------- FIN FIX ----------

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-8 transition-shadow hover:shadow-2xl">
      {dateError && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md text-xs sm:text-sm text-red-700">
          {dateError}
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
        {/* CONVERTI DE GRID EN FLEX */}
        <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6">
          {/* Destination */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 relative group">
            <label htmlFor="destination" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Destination
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-600" />
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Où allez-vous ?"
                className="pl-8 sm:pl-10 w-full rounded-lg sm:rounded-xl border border-gray-300 py-3 sm:py-4 px-3 sm:px-4 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 relative group">
            <label htmlFor="check-in" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Arrivée
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-600" />
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                locale={fr}
                dateFormat="dd/MM/yyyy"
                placeholderText="Date d'arrivée"
                className="pl-8 sm:pl-10 w-full rounded-lg sm:rounded-xl border border-gray-300 py-3 sm:py-4 px-3 sm:px-4 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 relative group">
            <label htmlFor="check-out" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Départ
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-600" />
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                locale={fr}
                dateFormat="dd/MM/yyyy"
                placeholderText="Date de départ"
                className="pl-8 sm:pl-10 w-full rounded-lg sm:rounded-xl border border-gray-300 py-3 sm:py-4 px-3 sm:px-4 text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          {/* Champ Voyageurs - Design Futuriste */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 relative" ref={guestsRef}>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Voyageurs
            </label>

            {/* Bouton principal avec effet glassmorphique */}
            <button
              type="button"
              onClick={() => setIsGuestsOpen(!isGuestsOpen)}
              className={`relative w-full rounded-lg sm:rounded-2xl border-2 py-3 sm:py-4 px-3 sm:px-4 text-left transition-all overflow-hidden
                ${isGuestsOpen
                  ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/20'
                  : 'border-gray-300 bg-gray-50/80 hover:border-blue-400 hover:bg-white'
                } backdrop-blur-sm`}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full duration-700" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`relative p-1.5 sm:p-2 rounded-full transition-all ${isGuestsOpen ? 'bg-blue-500/10' : 'bg-gray-200/50'
                    }`}>
                    <UserIcon className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isGuestsOpen ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    {/* Badge animé */}
                    <span className={`absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
                                    text-white text-xs flex items-center justify-center font-bold shadow-md
                                    transition-transform ${badgePulse ? 'scale-110' : 'scale-100'}`}>
                      {totalGuests}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{guestsText}</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform duration-300 ${isGuestsOpen ? 'rotate-180 text-blue-600' : ''
                  }`} />
              </div>
            </button>

            {/* Dropdown futuriste avec animation scale */}
            <div
              className={`absolute z-20 mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl shadow-2xl border border-white/10 p-0 
                         backdrop-blur-xl bg-white/95 overflow-hidden transform transition-all duration-300 origin-top
                         ${isGuestsOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
            >
              {/* Header avec gradient animé */}
              <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-3 sm:p-4 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                <h3 className="relative z-10 font-bold text-base sm:text-lg">🚀 Configuration</h3>
                <p className="relative z-10 text-xs sm:text-sm opacity-90">Personnalisez votre voyage</p>
              </div>

              {/* Contenu */}
              <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                <GuestCounter
                  label="Adultes"
                  value={guests.adults}
                  min={1}
                  onIncrement={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                  onDecrement={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                />

                <GuestCounter
                  label="Enfants"
                  value={guests.children}
                  onIncrement={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                  onDecrement={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                />

                <GuestCounter
                  label="Chambres"
                  value={guests.rooms}
                  min={1}
                  onIncrement={() => setGuests(g => ({ ...g, rooms: g.rooms + 1 }))}
                  onDecrement={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                />

                {/* Toggle switches futuristes */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3 sm:space-y-4">
                  <FuturisticToggle
                    active={isBusinessTrip}
                    onToggle={() => setIsBusinessTrip(!isBusinessTrip)}
                    label="💼 Voyage d'affaires"
                  />
                  <FuturisticToggle
                    active={isPetsAllowed}
                    onToggle={() => setIsPetsAllowed(!isPetsAllowed)}
                    label="🐾 Animaux acceptés"
                  />
                </div>

                {/* Bouton Appliquer avec effet néon */}
                <button
                  type="button"
                  onClick={() => setIsGuestsOpen(false)}
                  className="relative w-full mt-3 sm:mt-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-blue-700 to-cyan-500 
                           hover:from-blue-800 hover:to-cyan-600 transition-all transform hover:scale-[1.02] 
                           shadow-lg hover:shadow-blue-500/25 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Appliquer
                  </span>
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!destination.trim() || !checkIn || !checkOut}
            className="relative w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700
                     transition-all transform hover:scale-[1.02] 
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none 
                     shadow-xl hover:shadow-2xl overflow-hidden group text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Rechercher
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;