'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { TransletText } from '@/app/lib/services/translation/transletText'
import { Field } from './fieldServeur'
import { Input } from '@/app/lib/services/translation/inputTranslate'
import { useParams } from 'next/navigation'

/* ---------- static data ---------- */
const ESTABLISHMENT_TYPES = [
  { value: 'hotel', label: 'Hôtel' },
  { value: 'auberge', label: 'Auberge' },
  { value: 'villa', label: 'Villa' },
  { value: 'residence', label: 'Résidence' },
  { value: 'autre', label: 'Autre' },
] as const
type FilterShape = {
  destination?: string | null
  ville?:       string | null
  pays?:        string | null
  type?:        string | null
  services?:    string[] | null
  stars?:       number | null
  checkIn?:     Date | null
  checkOut?:    Date | null
  minPrice?:    number | null
  maxPrice?:    number | null
  capaciteMin?: number | null
  capaciteMax?: number | null
  adults?:      number
  children?:    number
  chambre?:     number
  disponible?:  "true" | "false" | null
  etablissementId?: string | null
  page?:        number
}
const SERVICE_OPTIONS = [
  'Wi-Fi gratuit',
  'Piscine',
  'Spa',
  'Restaurant',
  'Salle de sport',
  'Parking',
  'Climatisation',
  'Petit-déjeuner inclus',
  'Clim',
  'Minibar',
  'Coffre',
  'TV',
  'Balcon',
  'Baignoire',
  'Douche',
] as const

/* ---------- props ---------- */
type Props = {
  isOpen: boolean
  onClose: () => void
  filters: FilterShape
  setFilters: (updater: Partial<FilterShape> | ((prev: FilterShape) => Partial<FilterShape>)) => void
  handleSearch: () => Promise<void>
}

export default function FilterSidebar({ isOpen, onClose, filters,setFilters, handleSearch, }: Props) {
  /* ---------- état synchronisé avec l’URL ---------- */

 const {locale} = useParams();
  const targetLang = locale?.toString() ||"fr";
  /* ---------- helpers ---------- */
  const toggleService = (s: string) =>
    setFilters((prev) => ({
      services: prev.services?.includes(s)
        ? prev.services.filter((i) => i !== s)
        : [...(prev.services ?? []), s],
    }))

  const reset = () => {
    /* on remet tout à null (nuqs enlèvera les clés de l’URL) */
    setFilters({
      ville: null,
      pays: null,
      type: null,
      minPrice: null,
      maxPrice: null,
      services: null,
      stars: null,
      checkIn: null,
      checkOut: null,
      capaciteMin: null,
      capaciteMax: null,
      disponible: null,
      etablissementId: null,
      page: 1, // on remet page 1
    })
    onClose()
  }

  /* ---------- UI blocks ---------- */
 



  const Checkbox = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean
    onChange: (c: boolean) => void
    label: string
  }) => (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="ml-2 text-sm text-gray-700"><TransletText>{label}</TransletText></span>
    </label>
  )

  /* ---------- render ---------- */
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-semibold text-gray-900"><TransletText>Filtres avancés</TransletText></Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* body */}
                    <div className="flex-1 px-5 py-6 space-y-6">
                      {/* Ville */}
                      <Field label="Ville">
                        <Input
                          targetLang={targetLang}
                          placeholder="Ex: Paris"
                          value={filters.ville ?? ''}
                          onChange={(e) => setFilters({ ville: e.target.value || null })}
                        />
                      </Field>

                      {/* Pays */}
                      <Field label="Pays">
                        <Input
                          targetLang={targetLang}
                          placeholder="Ex: France"
                          value={filters.pays ?? ''}
                          onChange={(e) => setFilters({ pays: e.target.value || null })}
                        />
                      </Field>

                      {/* Type */}
                      <Field label="Type d’hébergement">
                        <div className="space-y-2">
                          {ESTABLISHMENT_TYPES.map(({ value, label }) => (
                            <label key={value} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="type"
                                value={value}
                                checked={filters.type === value}
                                onChange={() => setFilters({ type: value })}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700"><TransletText>{label}</TransletText></span>
                            </label>
                          ))}
                        </div>
                      </Field>

                      {/* Prix */}
                      <Field label="Prix par nuit (€)">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1"><TransletText>Min</TransletText></div>
                            <Input
                              targetLang={targetLang}
                              type="number"
                              min={0}
                              placeholder="0"
                              value={filters.minPrice ?? ''}
                              onChange={(e) => setFilters({ minPrice: Number(e.target.value) || null })}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1"><TransletText>Max</TransletText></div>
                            <Input
                              targetLang={targetLang}
                              type="number"
                              min={0}
                              placeholder="1000"
                              value={filters.maxPrice ?? ''}
                              onChange={(e) => setFilters({ maxPrice: Number(e.target.value) || null })}
                            />
                          </div>
                        </div>
                      </Field>

                      {/* Capacité */}
                      <Field label="Capacité (voyageurs)">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1"><TransletText>Min</TransletText></div>
                            <Input
                              targetLang={targetLang}
                              type="number"
                              min={1}
                              placeholder="1"
                              value={filters.capaciteMin ?? ''}
                              onChange={(e) => setFilters({ capaciteMin: Number(e.target.value) || null })}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1"><TransletText>Max</TransletText></div>
                            <Input
                              targetLang={targetLang}
                              type="number"
                              min={1}
                              placeholder="20"
                              value={filters.capaciteMax ?? ''}
                              onChange={(e) => setFilters({ capaciteMax: Number(e.target.value) || null })}
                            />
                          </div>
                        </div>
                      </Field>

                      {/* Dates */}
                      <Field label="Dates">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Arrivée</div>
                            <Input
                              placeholder="Ex: 2024-01-01"
                              targetLang={targetLang}
                              type="date"
                              value={filters.checkIn?.toISOString().slice(0, 10) ?? ''}
                              onChange={(e) => setFilters({ checkIn: e.target.value ? new Date(e.target.value) : null })}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Départ</div>
                            <Input
                              placeholder="Ex: 2024-01-01"
                              targetLang={targetLang}
                              type="date"
                              value={filters.checkOut?.toISOString().slice(0, 10) ?? ''}
                              onChange={(e) => setFilters({ checkOut: e.target.value ? new Date(e.target.value) : null })}
                            />
                          </div>
                        </div>
                      </Field>

                      {/* Étoiles */}
                      <Field label="Catégorie">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setFilters({ stars: s })}
                              className={`p-1 rounded-full transition-transform hover:scale-110 ${filters.stars === s ? 'text-amber-400' : 'text-gray-300'}`}
                            >
                              {filters.stars === s ? (
                                <StarSolid className="h-6 w-6" />
                              ) : (
                                <StarOutline className="h-6 w-6" />
                              )}
                            </button>
                          ))}
                        </div>
                      </Field>

                      {/* Services */}
                      <Field label="Services & équipements">
                        <div className="grid grid-cols-2 gap-3">
                          {SERVICE_OPTIONS.map((s) => (
                            <Checkbox
                              key={s}
                              checked={filters.services?.includes(s) ?? false}
                              onChange={() => toggleService(s)}
                              label={s}
                            />
                          ))}
                        </div>
                      </Field>

                      {/* Disponible */}
                      <Field>
                        <Checkbox
                          checked={filters.disponible === 'true'}
                          onChange={(c) => setFilters({ disponible: c ? 'true' : 'false' })}
                          label="Uniquement les hébergements disponibles"
                        />
                      </Field>
                    </div>

                    {/* footer */}
                    <div className="flex items-center gap-3 border-t border-gray-200 px-5 py-4">
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <TransletText>Réinitialiser</TransletText>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSearch()
                          onClose()
                        }}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <TransletText>Appliquer</TransletText>
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

