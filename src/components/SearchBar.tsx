"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPinIcon, CalendarIcon, UsersIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { traduireTexteSecurise } from '@/app/lib/services/translation/translateApiWithLingvaAndVercel';
import { useQuery } from '@tanstack/react-query';

// Composant DestinationField
const DestinationField = ({ value, onChange, hasError, onErrorChange }: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  onErrorChange: () => void;
}) => {
  const {locale} = useParams();
    const { data:translateText, isLoading, error } = useQuery({
    queryKey: ["translation", locale],
    queryFn: async () => {
      const res = await traduireTexteSecurise("Destination", "fr", locale?.toString() || "en");
      return res;
    },
  });
  return (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 rounded-lg px-3 py-3 ${hasError ? 'bg-red-100' : 'bg-gray-100'}`}>
        <MapPinIcon className={`w-5 h-5 flex-shrink-0 ${hasError ? 'text-red-700' : 'text-gray-700'}`} />
        <input
          type="text"
          placeholder={translateText || "Destination"}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (hasError) onErrorChange();
          }}
          className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm sm:text-base placeholder-gray-500"
        />
      </div>
    </div>
  );
};

// Composant DateField
const DateField = ({ value, onChange, hasError, onErrorChange, icon: Icon, label }: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  onErrorChange: () => void;
  icon: React.ElementType;
  label: string;
}) => {
  const translatedLabel = <TransletText>{label}</TransletText> as unknown as string;
  return (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 rounded-lg px-3 py-3 ${hasError ? 'bg-red-100' : 'bg-gray-100'}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${hasError ? 'text-red-700' : 'text-gray-700'}`} />
        <input
          type="date"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (hasError) onErrorChange();
          }}
          aria-label={translatedLabel}
          className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm sm:text-base cursor-pointer"
        />
      </div>
    </div>
  );
};

// Composant TravelersField
const TravelersField = ({ value, onChange }: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const label = <TransletText>{value.toString()} Voyageur{value > 1 ? 's' : ''}</TransletText> as unknown as string;
  return (
    <div className="flex-1 min-w-0 relative">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-3">
        <UsersIcon className="w-5 h-5 text-gray-700 flex-shrink-0" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-left bg-transparent text-gray-900 font-medium focus:outline-none text-sm sm:text-base cursor-pointer"
        >
          {label}
        </button>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <div
              key={num}
              onClick={() => {
                onChange(num);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 font-medium"
            >
              <TransletText>{num.toString()} Voyageur{num > 1 ? 's' : ''}</TransletText>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant SearchButton
const SearchButton = () => {
  const text = <TransletText>Rechercher</TransletText> as unknown as string;
  return (
    <button
      type="submit"
      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
    >
      <MagnifyingGlassIcon className="w-5 h-5" />
      <span className="font-semibold text-sm sm:text-base">{text}</span>
    </button>
  );
};

export const SearchBar = () => {
  const { locale } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [errors, setErrors] = useState({
    destination: false,
    arrivalDate: false,
    departureDate: false
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      destination: !destination.trim(),
      arrivalDate: !arrivalDate,
      departureDate: !departureDate || (arrivalDate && departureDate < arrivalDate)
    };
    setErrors({
      destination: newErrors.destination,
      arrivalDate: newErrors.arrivalDate,
      departureDate: Boolean(newErrors.departureDate)
    });
    if (Object.values(newErrors).some(Boolean)) return;

    const query = new URLSearchParams({
      destination,
      checkIn: arrivalDate,
      checkOut: departureDate,
      capaciteMax: travelers.toString()
    }).toString();
    router.push(`/${locale}/search-results?${query}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <DestinationField
            value={destination}
            onChange={setDestination}
            hasError={errors.destination}
            onErrorChange={() => setErrors(prev => ({ ...prev, destination: false }))}
          />
          <DateField
            value={arrivalDate}
            onChange={setArrivalDate}
            hasError={errors.arrivalDate}
            onErrorChange={() => setErrors(prev => ({ ...prev, arrivalDate: false }))}
            icon={CalendarIcon}
            label="Arrivée"
          />
          <DateField
            value={departureDate}
            onChange={setDepartureDate}
            hasError={errors.departureDate}
            onErrorChange={() => setErrors(prev => ({ ...prev, departureDate: false }))}
            icon={CalendarIcon}
            label="Départ"
          />
          <TravelersField value={travelers} onChange={setTravelers} />
          <SearchButton />
        </form>
      </div>
    </div>
  );
};
