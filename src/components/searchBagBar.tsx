'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon, MinusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { TransletText } from '@/app/lib/services/translation/transletText';

const FIELD_LABELS = {
  destination: 'Destination',
  ville: 'Ville',
  pays: 'Pays',
  checkIn: "Date d'arrivée",
  checkOut: 'Date de départ',
  adults: 'Adultes',
  children: 'Enfants',
  guests: 'Total voyageurs',
  chambre: 'Chambres',
  prixMin: 'Prix min',
  prixMax: 'Prix max',
  type: "Type d'hébergement",
  stars: 'Catégorie',
  services: 'Services',
  disponible: 'Disponible uniquement',
};

const DEFAULT_FORM_STATE = {
  destination: '', ville: '', pays: '',
  checkIn: '', checkOut: '',
  adults: 1, children: 0, guests: 1, chambre: 1,
  prixMin: '', prixMax: '',
  type: '', stars: '',
  services: [] as string[],
  disponible: false,
};

export default function SearchDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const locale = pathname?.split('/')?.[1] || 'fr';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const CounterInput = ({ label, field, value, min = 0, max = 10 }: any) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium text-gray-700 flex-1">{label}</label>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => handleInputChange(field, Math.max(min, Number(value) - 1))}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <MinusIcon className="w-4 h-4 text-gray-600" />
        </button>
        <span className="w-8 text-center font-semibold text-gray-900 text-base sm:text-sm">{value}</span>
        <button
          type="button"
          onClick={() => handleInputChange(field, Math.min(max, Number(value) + 1))}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <PlusIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '' || value === 0 || value === false || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) value.forEach(v => params.append(key, v));
      else params.append(key, String(value));
    });

    if (formData.checkIn) params.set('dateDebut', formData.checkIn);
    if (formData.checkOut) params.set('dateFin', formData.checkOut);

    router.push(`/${locale}/search-results?${params}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* BOUTON DE DÉCLENCHEMENT - Responsive */}
      {/* Desktop: Bouton sur le côté gauche */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed left-0 top-24 z-40 items-center gap-2 bg-white border border-l-0 border-gray-200 rounded-r-lg px-4 py-3 shadow-lg hover:shadow-xl transition-shadow group"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors"> <TransletText>Rechercher</TransletText> </span>
      </button>

      {/* Mobile: Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
        style={{ touchAction: 'manipulation' }}
        aria-label="Ouvrir la recherche"
      >
        <FunnelIcon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:bg-black/30"
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:max-w-lg transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col bg-white shadow-2xl">
          {/* Header sticky - amélioré pour mobile */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur">
            <h2 className="text-lg font-semibold text-gray-900">Recherche</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95 w-10 h-10 flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Formulaire avec scroll tactile optimisé */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Localisation */}
            <section className="pb-5 mb-5 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Où ?</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.destination}</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                    placeholder="Ex: Paris, Bord de mer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.ville}</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.pays}</label>
                    <input
                      type="text"
                      value={formData.pays}
                      onChange={(e) => handleInputChange('pays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                      placeholder="Pays"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Dates */}
            <section className="pb-5 mb-5 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quand ?</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.checkIn}</label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.checkOut}</label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Voyageurs */}
            <section className="pb-5 mb-5 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Qui ?</h3>
              <div className="divide-y divide-gray-100">
                <CounterInput label={FIELD_LABELS.adults} field="adults" value={formData.adults} min={1} />
                <CounterInput label={FIELD_LABELS.children} field="children" value={formData.children} />
                <CounterInput label={FIELD_LABELS.guests} field="guests" value={formData.guests} min={1} />
                <CounterInput label={FIELD_LABELS.chambre} field="chambre" value={formData.chambre} min={1} />
              </div>
            </section>

            {/* Budget */}
            <section className="pb-5 mb-5 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Budget</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.prixMin}</label>
                  <input
                    type="number"
                    value={formData.prixMin}
                    onChange={(e) => handleInputChange('prixMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                    placeholder="0€"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.prixMax}</label>
                  <input
                    type="number"
                    value={formData.prixMax}
                    onChange={(e) => handleInputChange('prixMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </section>

            {/* Filtres */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Filtres</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.type}</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm">
                    <option value=""> <TransletText>Tous types</TransletText></option>
                    <option value="hotel"> <TransletText>Hôtel</TransletText></option>
                    <option value="appartement"> <TransletText>Appartement</TransletText> </option>
                    <option value="villa"> <TransletText>Villa</TransletText></option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS.stars}</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-sm">
                    <option value="">Toutes catégories</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  {['wifi', 'parking', 'pet-friendly', 'pool'].map(service => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer active:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 capitalize">{service.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-3 cursor-pointer active:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) => handleInputChange('disponible', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{FIELD_LABELS.disponible}</span>
                </label>
              </div>
            </section>
          </form>

          {/* Bouton sticky bottom sur mobile */}
          <div className="sticky bottom-0 z-10 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white/95 backdrop-blur">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
               <TransletText>Rechercher </TransletText>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}