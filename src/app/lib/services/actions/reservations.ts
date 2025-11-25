// reservation.actions.ts
"use server";

import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { actionClient } from "../../safe-action";
import {
  getAllReservations,
  getReservationById,
  getReservationsByUser,
  createReservation,
  updateReservation,
  cancelReservation,
  deleteReservation,
  getOccupiedPeriods
} from "../reservation.service";
import { reservations } from "@/db/schema";
import { reservationSchema } from "@/types";

/* ------------------------------------------------------------------ */
/* 1. Schéma Zod généré depuis Drizzle                                */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/* 2. Actions                                                           */
/* ------------------------------------------------------------------ */
export const getAllReservationsAction = actionClient
  .inputSchema(z.undefined())
  .action(async () => ({ data: await getAllReservations() }));

export const getReservationByIdAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => ({ data: await getReservationById(parsedInput.id) }));

export const getReservationsByUserAction = actionClient
  .inputSchema(z.object({ userId: z.string().uuid() }))
  .action(async ({ parsedInput }) => ({ data: await getReservationsByUser(parsedInput.userId) }));

export const createReservationAction = actionClient
  .inputSchema(reservationSchema)
  .action(async ({ parsedInput }) => {
    const id = await createReservation({
      ...parsedInput,
      dateDebut: new Date(parsedInput.dateDebut),
      dateFin: new Date(parsedInput.dateFin),
    });
    return { message: "Réservation créée ✨", id };
  });

export const updateReservationAction = actionClient
  .inputSchema(reservationSchema.partial().extend({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    await updateReservation(id, {
      ...data,
      dateDebut: data.dateDebut ? new Date(data.dateDebut) : undefined,
      dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
    });
    return { message: "Réservation mise à jour ✨" };
  });

export const cancelReservationAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    await cancelReservation(parsedInput.id);
    return { message: "Réservation annulée ✅" };
  });

export const deleteReservationAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    await deleteReservation(parsedInput.id);
    return { message: "Réservation supprimée 🗑️" };
  });

export const getOccupiedPeriodsAction = actionClient
  .inputSchema(z.object({ roomId: z.string().uuid() }))
  .action(async ({ parsedInput }) => ({ data: await getOccupiedPeriods(parsedInput.roomId) }));
