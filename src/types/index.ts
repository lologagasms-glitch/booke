import {  chambres, etablissements, mediaChambres, mediaEtablissements, reservations, user } from "@/db/schema"
import { createInsertSchema } from "drizzle-zod";
import {z} from "zod"


export type Chambre = typeof chambres.$inferSelect;
export type NewChambre = typeof chambres.$inferInsert;
export type NewEtablissement = typeof etablissements.$inferInsert;
export type MediaChambre = typeof mediaChambres.$inferSelect;
export type NewMediaChambre = typeof mediaChambres.$inferInsert;
export type Etablissement = typeof etablissements.$inferSelect;
export type NewMediaEtablissement = typeof mediaEtablissements.$inferInsert;
export type MediaEtablissement = typeof mediaEtablissements.$inferSelect;




export interface SearchParams {
  /* ----- recherche principale (déjà présentes) ----- */
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  guests?: number;
  chambre?: number;
  page?: string;
  type?: string;
  services?: string[];
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  stars?: number;
  ville?: string;
  pays?: string;
  prixMin?: string;
  prixMax?: string;
  capaciteMin?: string;
  capaciteMax?: string;
  dateDebut?: string;
  dateFin?: string;
  etoiles?: number;
  disponible?: boolean;
  etablissementId?: string;
}
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type NewReservation      = typeof reservations.$inferInsert;
export type Reservation         = typeof reservations.$inferSelect;
export type ReservationStatus   = NewReservation['statut']; // 'confirm' | 'en_attente' | 'annul'

export const baseSchema = createInsertSchema(etablissements, {
  // on force quelques règles plus strictes
  nom: z.string().min(1),
  adresse: z.string().min(1),
  description: z.string().min(1),
  pays: z.string().min(1),
  ville: z.string().min(1),
  contact: z.object({
    telephone: z.string().default(""),
    email: z.string().email().default(""),
    siteWeb: z.string().url().optional().transform(v => v ?? ""),
  }),
});
export const chambreSchema = createInsertSchema(chambres, {
  id             : z.string().uuid().optional(), // auto-généré
  etablissementId: z.string(),
  nom            : z.string().min(1, 'Le nom est requis'),
  description    : z.string().min(1, 'La description est requise'),
  prix           : z.number().positive('Le prix doit être positif'),
  capacite       : z.number().int().positive('La capacité doit être un entier positif'),
  disponible     : z.boolean(),
  type           : z.string().min(1, 'Le type est requis'),
  createdAt      : z.date().optional(), // auto-généré
  services       : z.array(z.string()).nullable(), // tableau de strings
});
// app/establishments/types.ts

export type EtablissementWithRooms = {
  etablissement: NewEtablissement;
  chambres: Chambre[];
  medias: MediaEtablissement[];
}
export const reservationSchema = z.object({
  roomId: z.string().uuid(),
  userId: z.string().uuid(),
  etablissementId: z.string().uuid(),
  dateDebut: z.date(),
  dateFin: z.date(),
  nombrePersonnes: z.number().int().min(1, "At least one person is required"),
  prixTotal: z.number().positive("prixTotal must be positive"),
  statut: z.enum(["confirm", "en_attente", "annul"]),
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
});
