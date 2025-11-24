'use client'

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { searchSchema, type SearchFormData } from './searchSchema'
import { searchBarEtabWithChambreAction } from '@/app/lib/services/actions/etablissements'
import { EtablissementWithRooms } from '@/types/combineType'
import { filtersParsers } from '@/app/[locale]/etablissements/filter'
import { SetValues } from 'nuqs'
import { TransletText } from '@/app/lib/services/translation/transletText'
import { useParams } from 'next/navigation'
import { Input } from '@/app/lib/services/translation/inputTranslate'
import { TranslatedDatePicker } from '@/app/lib/services/translation/translateDatePinker'
type Filters = SetValues<typeof filtersParsers>

// ── 2. props de SearchBar ----------------------------------------------
type SearchBarProps = {
  setFilters: (updates: Partial<Filters>) => void
}
export default function SearchBar({setFilters, isPending, handleSearch}:{setFilters:SearchBarProps['setFilters'], isPending:boolean, handleSearch:()=>Promise<void>}) {
  /* ---------- react-hook-form ---------- */
  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<SearchFormData>({
      resolver: zodResolver(searchSchema),
      defaultValues: {
        destination: null,
        checkIn: null,
        checkOut: null,
        guests: 1,
      },
    })
    const {locale} = useParams();
    const targetLang = locale?.toString() ||"fr";
const initialiseSetFilters = () => {
  setFilters({})
}
const onSubmit = async (data: SearchFormData) => {
  await initialiseSetFilters()
  setFilters(data)
  await handleSearch()
}
  /* ---------- options ---------- */
  const guestOptions = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <div className="bg-blue-800 rounded-lg p-4 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Destination */}
        <div className="lg:col-span-1">
          <label htmlFor="destination" className="block text-xs text-white mb-1">Destination</label>
          <Input
            targetLang={targetLang}
            id="destination"
            type="text"
            {...register('destination')}
            placeholder="Où souhaitez-vous aller ?"
            className="w-full px-3 py-2 rounded border-0 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.destination && <span className="text-xs text-red-300">{<TransletText>{errors.destination.message||""}</TransletText>}</span>}
        </div>

        {/* Date d’arrivée */}
        <div className="lg:col-span-1">
          <label htmlFor="checkIn" className="block text-xs text-white mb-1"><TransletText>Date d’arrivée</TransletText></label>
          <TranslatedDatePicker
            targetLang={targetLang}
            id="checkIn"
            selected={watch('checkIn')}
            onChange={(date: Date | null) => setValue('checkIn', date, { shouldValidate: true })}
            selectsStart
            startDate={watch('checkIn')}
            endDate={watch('checkOut')}
            minDate={new Date()}
            placeholderText="Sélectionnez une date"
            className="w-full px-3 py-2 rounded border-0 focus:ring-2 focus:ring-blue-400 outline-none"
            dateFormat="dd/MM/yyyy"
            locale={fr}
          />
          {errors.checkIn && <span className="text-xs text-red-300">{<TransletText>{errors.checkIn.message||""}</TransletText>  }</span>}
        </div>

        {/* Date de départ */}
        <div className="lg:col-span-1">
          <label htmlFor="checkOut" className="block text-xs text-white mb-1"><TransletText>Date de départ</TransletText></label>
          <TranslatedDatePicker
            targetLang={targetLang}
            id="checkOut"
            selected={watch('checkOut')}
            onChange={(date: Date | null) => setValue('checkOut', date, { shouldValidate: true })}
            selectsEnd
            startDate={watch('checkIn')}
            endDate={watch('checkOut')}
            minDate={watch('checkIn') || new Date()}
            placeholderText="Sélectionnez une date"
            className="w-full px-3 py-2 rounded border-0 focus:ring-2 focus:ring-blue-400 outline-none"
            dateFormat="dd/MM/yyyy"
            locale={fr}
          />
          {errors.checkOut && <span className="text-xs text-red-300">{<TransletText>{errors.checkOut.message||""}</TransletText>  }</span>}
        </div>

        {/* Voyageurs */}
        <div className="lg:col-span-1">
          <label htmlFor="guests" className="block text-xs text-white mb-1"><TransletText>Nombre de voyageurs</TransletText></label>
          <select
            id="guests"
            {...register('guests', { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded border-0 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            {guestOptions.map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? <TransletText>voyageur</TransletText> : <TransletText>voyageurs</TransletText>}
              </option>
            ))}
          </select>
          {errors.guests && <span className="text-xs text-red-300">{<TransletText>{errors.guests.message||""}</TransletText>  }</span>}
        </div>

        {/* Bouton Rechercher */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white px-6 py-2 rounded transition-colors"
          >
            {isPending ? <TransletText>Recherche…</TransletText> : <TransletText>recherche</TransletText>}
          </button>
        </div>
      </form>

    </div>
  )
}