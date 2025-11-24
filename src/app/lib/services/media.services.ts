"use server"

import { db } from "@/db";
import { mediaChambres, mediaEtablissements } from "@/db/schema"; // Assurez-vous d'importer votre table
import { eq } from "drizzle-orm";

export async function saveEtablissementMedias(
  etablissementId: string,
  medias: { filename: string; url: string; type: string }[]
): Promise<{ success: boolean; mediaIds?: string[]; error?: string }> {
  try {
    // ✅ Batch insert correct avec Drizzle
    const inserted = await db
      .insert(mediaEtablissements)
      .values(
        medias.map(media => ({
          etablissementId, // Correspond à votre colonne schema
          url: media.url,
          filename: media.filename,
          type: media.type as "image" | "video", 
        }))
      )
      .returning({ id: mediaEtablissements.id });

    return { 
      success: true, 
      mediaIds: inserted.map(row => row.id) 
    };
  } catch (err) {
    console.error("Erreur lors de l'enregistrement des médias:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erreur inconnue" 
    };
  }
}

export async function getEtablissementMedias(etablissementId: string) {
  try {
    const medias = await db
      .select()
      .from(mediaEtablissements)
      .where(eq(mediaEtablissements.etablissementId, etablissementId));

    return { success: true, medias };
  } catch (err) {
    console.error("Erreur lors de la récupération des médias:", err);
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
export async function deleteEtablissementMedia(
  mediaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .delete(mediaEtablissements)
      .where(eq(mediaEtablissements.id, mediaId));
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de la suppression du média:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erreur inconnue" 
    };
  }
}

export async function saveChambreMedias(
  chambreId: string,
  medias: { filename: string; url: string; type: string }[]
): Promise<{ success: boolean; mediaIds?: string[]; error?: string }> {
  try {
    const inserted = await db
      .insert(mediaChambres)
      .values(
        medias.map(media => ({
          chambreId: chambreId,
          url: media.url,
          filename: media.filename,
          type: media.type as "image" | "video", 
        }))
      )
      .returning({ id: mediaChambres.id });

    return { 
      success: true, 
      mediaIds: inserted.map(row => row.id) 
    };
  } catch (err) {
    console.error("Erreur lors de l'enregistrement des médias de chambre:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erreur inconnue" 
    };
  }
}

export async function getChambreMedias(chambreId: string) {
  try {
    const medias = await db
      .select()
      .from(mediaChambres)
      .where(eq(mediaChambres.chambreId, chambreId));
    return { success: true, medias };
  } catch (err) {
    console.error("Erreur lors de la récupération des médias de chambre:", err);
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function deleteChambreMedia(
  mediaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .delete(mediaChambres)
      .where(eq(mediaChambres.id, mediaId));
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de la suppression du média de chambre:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erreur inconnue" 
    };
  }
}
