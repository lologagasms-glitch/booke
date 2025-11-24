export const TypeEtablissement = {
  hotel: 'hotel',
  auberge: 'auberge',
  villa: 'villa',
  residence: 'residence',
  autre: 'autre',
} as const;

export type TypeEtablissement = (typeof TypeEtablissement)[keyof typeof TypeEtablissement];

export const RoleUser = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type RoleUser = (typeof RoleUser)[keyof typeof RoleUser];

export const StatutReservation = {
  confirm: 'confirm',
  en_attente: 'en_attente',
  annul: 'annul',
} as const;

export type StatutReservation = (typeof StatutReservation)[keyof typeof StatutReservation];