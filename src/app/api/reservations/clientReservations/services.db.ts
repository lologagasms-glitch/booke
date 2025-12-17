
import { db } from '@/db';
import { chambres, etablissements, mediaChambres, reservations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getReservationsByUserId(userId: string) {
  return db
    .select({
      // --- réservation ---
      reservationId: reservations.id,
      dateDebut: reservations.dateDebut,
      dateFin: reservations.dateFin,
      nombrePersonnes: reservations.nombrePersonnes,
      prixTotal: reservations.prixTotal,
      statut: reservations.statut,
      createdAt: reservations.createdAt,

      // --- chambre ---
      chambreId: chambres.id,
      chambreNom: chambres.nom,
      chambreDescription: chambres.description,
      chambrePrix: chambres.prix,
      chambreCapacite: chambres.capacite,
      chambreType: chambres.type,

      // --- établissement ---
      etablissementId: etablissements.id,
      etablissementNom: etablissements.nom,
      etablissementAdresse: etablissements.adresse,
      etablissementVille: etablissements.ville,
      etablissementPays: etablissements.pays,
      etablissementType: etablissements.type,

      // --- médias de la chambre (1ère image) ---
      mediaUrl: mediaChambres.url,
      mediaFilename: mediaChambres.filename,
    })
    .from(reservations)
    .innerJoin(chambres, eq(reservations.roomId, chambres.id))
    .innerJoin(etablissements, eq(reservations.etablissementId, etablissements.id))
    .leftJoin(mediaChambres, eq(chambres.id, mediaChambres.chambreId))
    .where(eq(reservations.userId, userId))
    .orderBy(reservations.dateDebut); // ou orderBy desc(reservations.createdAt)
}