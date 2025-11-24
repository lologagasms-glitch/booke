'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MagnifyingGlassIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    
    if (destination) searchParams.append('destination', destination);
    if (checkIn) searchParams.append('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) searchParams.append('checkOut', format(checkOut, 'yyyy-MM-dd'));
    searchParams.append('adults', guests.adults.toString());
    searchParams.append('children', guests.children.toString());
    searchParams.append('rooms', guests.rooms.toString());
    
    router.push(`/etablissements?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="relative">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Où allez-vous ?"
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Check-in */}
          <div>
            <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Check-out */}
          <div>
            <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Guests */}
          <div className="relative">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Voyageurs
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {guests.adults} adulte{guests.adults > 1 ? 's' : ''}, {guests.children} enfant{guests.children > 1 ? 's' : ''}, {guests.rooms} chambre{guests.rooms > 1 ? 's' : ''}
              </button>
              
              {isGuestsOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-4 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Adultes</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults - 1)})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{guests.adults}</span>
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, adults: guests.adults + 1})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Enfants</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, children: Math.max(0, guests.children - 1)})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{guests.children}</span>
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, children: guests.children + 1})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Chambres</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, rooms: Math.max(1, guests.rooms - 1)})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{guests.rooms}</span>
                        <button 
                          type="button" 
                          onClick={() => setGuests({...guests, rooms: guests.rooms + 1})}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsGuestsOpen(false)}
                      className="w-full bg-blue-700 text-white rounded-md py-2 hover:bg-blue-800 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-700 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;