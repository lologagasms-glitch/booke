"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionClient } from "../../safe-action";
import { baseSchema } from "@/types";
import {
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
  getAllEtablissements,
  getEtablissementById,
  searchEtablissements,
  getPopularDestinations,
  addMediasToEtablissement,
  getFirstMediaImageEtablissement,
  searchGlobal  ,
  getPopularEtablissements,
} from "../etablissement.service";

/* ------------------------------------------------------------------ */
/* 1. Schéma Zod généré depuis Drizzle                                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* 2. Schéma complet (médias + userId injectés côté serveur)          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* 3. Action de création                                               */
/* ------------------------------------------------------------------ */
export const createEtablissementAction = actionClient
  .inputSchema(baseSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createEtablissement({
      ...parsedInput,
      userId: ctx.userId,
    });
    revalidatePath("/admin/etablissements");
    return { message: "Établissement créé ✨" };
  });

/* ------------------------------------------------------------------ */
/* 4. Schéma de mise à jour (partiel + id)                             */
/* ------------------------------------------------------------------ */
const updateEtablissementSchema = baseSchema
  .partial()
  .extend({ id: z.string().uuid() });

export const updateEtablissementAction = actionClient
  .inputSchema(updateEtablissementSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    await updateEtablissement(id, data);
    revalidatePath("/admin/etablissements");
    return { message: "Établissement mis à jour ✨" };
  });

/* ------------------------------------------------------------------ */
/* 5. Suppression                                                       */
/* ------------------------------------------------------------------ */
export const deleteEtablissementAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    await deleteEtablissement(parsedInput.id);
    revalidatePath("/admin/etablissements");
    return { message: "Établissement supprimé 🗑️" };
  });

/* ------------------------------------------------------------------ */
/* 6. Lectures (inchangées)                                             */
/* ------------------------------------------------------------------ */
export const getAllEtablissementsAction = actionClient.action(async () => await getAllEtablissements());

export const getEtablissementByIdAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => ({
    data: await getEtablissementById(parsedInput.id),
  }));

export const searchEtablissementsAction = actionClient
  .inputSchema(z.object({
    nom: z.string().optional(),
    adresse: z.string().optional(),
    description: z.string().optional(),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    pays: z.string().optional(),
    ville: z.string().optional(),
    type: z.enum(["hotel", "auberge", "villa", "residence", "autre"]).optional(),
    services: z.array(z.string()).optional(),
    etoiles: z.number().int().min(1).max(5).optional(),
    dateDebut: z.string().datetime().optional(),
    dateFin: z.string().datetime().optional(),
  }))
  .action(async ({ parsedInput }) => ({
    data: await searchEtablissements({
      ...parsedInput,
      dateDebut: parsedInput.dateDebut ? new Date(parsedInput.dateDebut) : undefined,
      dateFin: parsedInput.dateFin ? new Date(parsedInput.dateFin) : undefined,
    }),
  }));

export const getPopularDestinationsAction = actionClient
  .inputSchema(z.object({ limit: z.number().int().min(1).max(20).optional() }))
  .action(async ({ parsedInput }) => ({
    data: await getPopularDestinations(parsedInput.limit),
  }));

/* ------------------------------------------------------------------ */
/* 7. Ajout de médias                                                 */
/* ------------------------------------------------------------------ */
const addMediasSchema = z.object({
  etablissementId: z.string().uuid(),
  medias: z.array(z.object({
    url: z.string().url(),
    type: z.enum(["image", "video"]),
    caption: z.string().optional(),
  })).min(1),
});

export const addEtablissementMediasAction = actionClient
  .inputSchema(addMediasSchema)
  .action(async ({ parsedInput }) => {
    await addMediasToEtablissement(parsedInput.etablissementId, parsedInput.medias);
    revalidatePath(`/admin/etablissements/${parsedInput.etablissementId}`);
    return { message: "Médias ajoutés ✨" };
  });

/* ------------------------------------------------------------------ */
/* 8. Récupération du premier média d’un établissement               */
/* ------------------------------------------------------------------ */
export const fetchFirstMediaImageByEstablishmentAction = actionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const media = await getFirstMediaImageEtablissement(parsedInput.id);
    return { data: media ?? null };
  });

/* ------------------------------------------------------------------ */
/* 9. Recherche rapide barre (destination + disponibilité chambres)   */
/* ------------------------------------------------------------------ */
const searchBarEtabWithChambreSchema = z.object({
  destination: z.string().nullable().optional(),
  checkIn: z.date().nullable().optional(),
  checkOut: z.date().nullable().optional(),
  guests: z.number().nullable().optional(),
});

export const searchBarEtabWithChambreAction = actionClient
  .inputSchema(searchBarEtabWithChambreSchema)
  .action(async ({ parsedInput }) => {
    const { destination, checkIn, checkOut, guests } = parsedInput;
    const format = {
      ville: destination,
      dateDebut: checkIn ? new Date(checkIn) : undefined,
      dateFin: checkOut ? new Date(checkOut) : undefined,
      guests,
    };
    const data = await searchGlobal(format);
    return { data };
  });

export const getPopularEtablissementsAction = actionClient
  .inputSchema(z.object({ limit: z.number().int().min(1).max(20).optional() }))
  .action(async ({ parsedInput }) => {
    const data = await getPopularEtablissements(parsedInput.limit);
    console.log("je suis la");
    console.log(data);
    return data;
  });
