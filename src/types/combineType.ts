// app/establishments/types.ts

export type EtablissementWithRooms = {
  id?: string | null
  nom?: string | null
  adresse?: string | null
  description?: string | null
  longitude?: string | null
  latitude?: string | null
  pays?: string | null
  ville?: string | null
  createdAt?: Date | null
  type?: 'hotel' | 'auberge' | 'villa' | 'residence' | 'autre' | null
  services?: string[] | null
  etoiles?: number | null
  contact?: { telephone: string; email: string; siteWeb?: string } | null
  userId?: string | null
  medias?: MediaEtablissement[] | null
  chambres?: ChambreWithMedia[] | null
}

export type MediaEtablissement = {
  id?: string | null
  etablissementId?: string | null
  url?: string | null
  filename?: string | null
  type?: 'image' | 'video' | null
  createdAt?: Date | null
}

export type ChambreWithMedia = {
  id?: string | null
  etablissementId?: string | null
  nom?: string | null
  description?: string | null
  prix?: number | null
  capacite?: number | null
  disponible?: boolean | null
  type?: string | null
  createdAt?: Date | null
  services?: string[] | null
  medias?: MediaChambre[] | null
}

export type MediaChambre = {
  id?: string | null
  chambreId?: string | null
  url?: string | null
  filename?: string | null
  type?: 'image' | 'video' | null
  createdAt?: Date | null
}