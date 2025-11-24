// app/establishments/filters.ts
import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  parseAsBoolean,
  parseAsIsoDate,
  parseAsStringEnum
} from 'nuqs'

export const filtersParsers = {
  destination: parseAsString,
  ville:       parseAsString,
  pays:        parseAsString,
  type:        parseAsString,
  services:    parseAsArrayOf(parseAsString),      // ?services=wifi&services=parking
  stars:       parseAsInteger,                      // ?stars=4
  checkIn:     parseAsIsoDate,                     // ?checkIn=2025-10-08
  checkOut:    parseAsIsoDate,
  minPrice:    parseAsInteger,
  maxPrice:    parseAsInteger,
  capaciteMin: parseAsInteger,
  capaciteMax: parseAsInteger,
  adults:      parseAsInteger.withDefault(1),
  children:    parseAsInteger.withDefault(0),
  chambre:     parseAsInteger.withDefault(1),
  disponible:  parseAsStringEnum(['true', 'false']),  
} as const


