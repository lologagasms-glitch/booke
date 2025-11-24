"use server"
import { db } from '@/db';
import { reservations, chambres, etablissements, user } from '@/db/schema';
import { NewReservation } from '@/types';
import { eq, and, or, lte, gte, sql, desc, not } from 'drizzle-orm';

/* ------------------------------------------------------------------ */
/*  Service                                                             */
/* ------------------------------------------------------------------ */

type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/* 1  Toutes les réservations complètes (avec user, chambre, établissement) */
export async function getAllReservations(): Promise<ServiceResponse<any[]>> {
  try {
    const rows = await db
      .select({
        reservation: reservations,
        user: user,
        chambre: chambres,
        etablissement: etablissements,
      })
      .from(reservations)
      .leftJoin(user, eq(reservations.userId, user.id))
      .leftJoin(chambres, eq(reservations.roomId, chambres.id))
      .leftJoin(etablissements, eq(reservations.etablissementId, etablissements.id))
      .orderBy(desc(reservations.createdAt));

    const data = rows.map(r => ({
      ...r.reservation,
      user: r.user ?? undefined,
      chambre: r.chambre ?? undefined,
      etablissement: r.etablissement ?? undefined,
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    return { success: false, error: 'Impossible de récupérer les réservations.' };
  }
}

/* 2  Une réservation par ID */
export async function getReservationById(id: string): Promise<ServiceResponse<any>> {
  try {
    const [row] = await db
      .select({
        reservation: reservations,
        user: user,
        chambre: chambres,
        etablissement: etablissements,
      })
      .from(reservations)
      .leftJoin(user, eq(reservations.userId, user.id))
      .leftJoin(chambres, eq(reservations.roomId, chambres.id))
      .leftJoin(etablissements, eq(reservations.etablissementId, etablissements.id))
      .where(eq(reservations.id, id))
      .limit(1);

    if (!row) return { success: false, error: 'Réservation introuvable.' };

    const data = {
      ...row.reservation,
      user: row.user ?? undefined,
      chambre: row.chambre ?? undefined,
      etablissement: row.etablissement ?? undefined,
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error);
    return { success: false, error: 'Erreur lors de la récupération de la réservation.' };
  }
}

/* 3  Réservations d’un user */
export async function getReservationsByUser(userId: string): Promise<ServiceResponse<any[]>> {
  try {
    const rows = await db
      .select({
        reservation: reservations,
        chambre: chambres,
        etablissement: etablissements,
      })
      .from(reservations)
      .leftJoin(chambres, eq(reservations.roomId, chambres.id))
      .leftJoin(etablissements, eq(reservations.etablissementId, etablissements.id))
      .where(eq(reservations.userId, userId))
      .orderBy(desc(reservations.createdAt));

    const data = rows.map(r => ({
      ...r.reservation,
      chambre: r.chambre ?? undefined,
      etablissement: r.etablissement ?? undefined,
    }));

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching reservations for user ${userId}:`, error);
    return { success: false, error: 'Impossible de récupérer vos réservations.' };
  }
}

/* 4  Créer une réservation (avec vérif dispo) */
export async function createReservation(
  data: Omit<NewReservation, 'id' | 'createdAt'>
): Promise<ServiceResponse<string>> {
  try {
    // Validation basique
    if (!data.roomId || !data.dateDebut || !data.dateFin) {
      return { success: false, error: 'Données de réservation incomplètes.' };
    }

    if (new Date(data.dateDebut) >= new Date(data.dateFin)) {
      return { success: false, error: 'La date de début doit être antérieure à la date de fin.' };
    }

    const overlap = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservations)
      .where(
        and(
          eq(reservations.roomId, data.roomId),
          eq(reservations.statut, 'confirm'),
          lte(reservations.dateDebut, data.dateFin),
          gte(reservations.dateFin, data.dateDebut)
        )
      );

    if (overlap[0].count > 0) {
      return { success: false, error: 'Chambre non disponible à ces dates.' };
    }

    await db.insert(reservations).values({ ...data });
    return { success: true, data: 'success' };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { success: false, error: 'Erreur lors de la création de la réservation.' };
  }
}

/* 5  Mettre à jour (dates, prix, statut…) */
export async function updateReservation(
  id: string,
  data: Partial<Omit<NewReservation, 'id' | 'createdAt'>>
): Promise<ServiceResponse<void>> {
  try {
    // Si on touche aux dates → revérifier la disponibilité
    if (data.dateDebut || data.dateFin) {
      const currentRes = await getReservationById(id);
      if (!currentRes.success || !currentRes.data) {
        return { success: false, error: 'Réservation introuvable.' };
      }
      const current = currentRes.data;

      const debut = data.dateDebut ?? current.dateDebut;
      const fin = data.dateFin ?? current.dateFin;

      if (new Date(debut) >= new Date(fin)) {
        return { success: false, error: 'La date de début doit être antérieure à la date de fin.' };
      }

      const overlap = await db
        .select({ count: sql<number>`count(*)` })
        .from(reservations)
        .where(
          and(
            eq(reservations.roomId, current.roomId),
            eq(reservations.statut, 'confirm'),
            not(eq(reservations.id, id)), // exclure la résa en cours
            lte(reservations.dateDebut, fin),
            gte(reservations.dateFin, debut)
          )
        );

      if (overlap[0].count > 0) {
        return { success: false, error: 'Chambre non disponible à ces nouvelles dates.' };
      }
    }

    await db.update(reservations).set(data).where(eq(reservations.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    return { success: false, error: 'Erreur lors de la mise à jour de la réservation.' };
  }
}

/* 6  Annuler (statut = 'annul') */
export async function cancelReservation(id: string): Promise<ServiceResponse<void>> {
  try {
    await db
      .update(reservations)
      .set({ statut: 'annul' })
      .where(eq(reservations.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Error cancelling reservation ${id}:`, error);
    return { success: false, error: 'Erreur lors de l\'annulation de la réservation.' };
  }
}

/* 7  Suppression définitive */
export async function deleteReservation(id: string): Promise<ServiceResponse<void>> {
  try {
    await db.delete(reservations).where(eq(reservations.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Error deleting reservation ${id}:`, error);
    return { success: false, error: 'Erreur lors de la suppression de la réservation.' };
  }
}

/* 8  Périodes occupées d’une chambre (calendar picker) */
export async function getOccupiedPeriods(roomId: string): Promise<ServiceResponse<{ start: Date; end: Date }[]>> {
  try {
    const rows = await db
      .select({
        dateDebut: reservations.dateDebut,
        dateFin: reservations.dateFin,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.roomId, roomId),
          eq(reservations.statut, 'confirm')
        )
      )
      .orderBy(reservations.dateDebut);

    const data = rows.map(r => ({ start: r.dateDebut, end: r.dateFin }));
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching occupied periods for room ${roomId}:`, error);
    return { success: false, error: 'Impossible de récupérer les disponibilités.' };
  }
}


/* 9  Toutes les réservations d’un user pour une chambre donnée */
export async function getAllReservationByUserAndByChambre() {
  try {
    const rows = await db
      .select({
        reservation: reservations,
        user: user,
        chambre: chambres,
        etablissement: etablissements,
      })
      .from(reservations)
      .leftJoin(user, eq(reservations.userId, user.id))
      .leftJoin(chambres, eq(reservations.roomId, chambres.id))
      .leftJoin(etablissements, eq(reservations.etablissementId, etablissements.id))
      .orderBy(desc(reservations.createdAt));

    const data = rows.map(r => ({
      ...r.reservation,
      user: r.user ?? undefined,
      chambre: r.chambre ?? undefined,
      etablissement: r.etablissement ?? undefined,
    }));

    return data;
  } catch (error) {
    console.error('Error fetching reservations by user and room:', error);
    return { success: false, error: 'Erreur lors de la récupération des réservations.' };
  }
}
