"use server"
import { db } from '@/db';
import {
  chambres,
  mediaChambres,
  mediaEtablissements,
  etablissements,
  reservations,
} from '@/db/schema';
import { eq, and, or, lte, gte, sql, desc, like, notExists } from 'drizzle-orm';
import type { NewChambre, NewMediaChambre, Chambre, MediaChambre } from '@/types';

/* ------------------------------------------------------------------ */
/*  1  Récupérer TOUTES les chambres (avec établissement + médias)     */
/* ------------------------------------------------------------------ */
export async function getAll() {
  return db.query.chambres.findMany({
    orderBy: (chambres, { desc }) => [desc(chambres.createdAt)],
    with: {
      etablissement: true, 
      medias: true,        
    },
  });
}

/* ------------------------------------------------------------------ */
/*  8  Récupérer toutes les chambres d’un établissement               */
/* ------------------------------------------------------------------ */
export async function getAllByEtablissement(etablissementId: string) {
  const results= db.query.chambres.findMany({
    where: (chambres, { eq }) => eq(chambres.etablissementId, etablissementId),
    orderBy: (chambres, { desc }) => [desc(chambres.createdAt)],
    with: {
      medias: true,
    },
  });
  console.log(results)
  return results
}

/* ------------------------------------------------------------------ */
/*  2  Une chambre par ID (avec établ. + médias + dispo résa)         */
/* ------------------------------------------------------------------ */
export async function getById(id: string) {
  return db.query.chambres.findFirst({
    where: (chambres, { eq }) => eq(chambres.id, id),
    with: {
      etablissement: true, 
      medias: true,       
    },
  });
}

export async function getAllChambreById(id: string, limit?: number, offset?: number) {
  const query = db
    .select({
      chambre: chambres,
      firstMedia: sql<string | null>`(
        select ${mediaChambres.url}
        from ${mediaChambres}
        where ${and(
          eq(mediaChambres.chambreId, chambres.id),
          sql`${mediaChambres.type} = 'image'`
        )}
        order by ${sql`${mediaChambres.createdAt} asc`}
        limit 1
      )`,
    })
    .from(chambres)
    .where(eq(chambres.etablissementId, id))
    .orderBy(desc(chambres.createdAt))
    .$dynamic();

  if (limit !== undefined) query.limit(limit);
  if (offset !== undefined) query.offset(offset);
  return query; 
}

/* ------------------------------------------------------------------ */
/*  3  Créer une chambre (+ médias si fournis)                        */
/* ------------------------------------------------------------------ */
export async function create(data: NewChambre & { mediaFiles?: { url: string; filename: string; type: 'image' | 'video' }[] }) {


  try {
    await db.insert(chambres).values({ ...data });
  } catch (error) {
    console.error('Erreur lors de la création de la chambre:', error);
    throw error;
  }

 
return "success"
  
}

/* ------------------------------------------------------------------ */
/*  4  Mettre à jour une chambre (+ remplacement médias si besoin)    */
/* ------------------------------------------------------------------ */
export async function update(id: string, data: Partial<NewChambre> & { mediaFiles?: { url: string; filename: string; type: 'image' | 'video' }[] }) {
  const { mediaFiles, ...chambreData } = data;
  if (Object.keys(chambreData).length) {
    await db.update(chambres).set(chambreData).where(eq(chambres.id, id));
  }

  if (mediaFiles) {
    await db.delete(mediaChambres).where(eq(mediaChambres.chambreId, id));
    if (mediaFiles.length) {
      const mediaRows: NewMediaChambre[] = mediaFiles.map(f => ({
        chambreId: id,
        url: f.url,
        filename: f.filename,
        type: f.type,
      }));
      await db.insert(mediaChambres).values(mediaRows);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  5  Supprimer une chambre ET ses médias                            */
/* ------------------------------------------------------------------ */
export async function deleteChambre(id: string) {
  await db.delete(mediaChambres).where(eq(mediaChambres.chambreId, id));
  await db.delete(chambres).where(eq(chambres.id, id));
}

export async function getAllEtabAndChambre() {
  return db.query.etablissements.findMany({
    with: {
      medias: true,
      chambres: {
        with: {
          medias: true,
        },
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/*  6  Disponibilité sur une période (true = libre)                   */
/* ------------------------------------------------------------------ */
export async function isAvailable(chambreId: string, dateDebut: Date, dateFin: Date) {
  const conflits = await db
    .select({ count: sql<number>`count(*)` })
    .from(reservations)
    .where(
      and(
        eq(reservations.roomId, chambreId),
        eq(reservations.statut, 'confirm'),
        or(
          and(lte(reservations.dateDebut, dateFin), gte(reservations.dateFin, dateDebut))
        )
      )
    );

  return conflits[0]?.count === 0;
}

/* ------------------------------------------------------------------ */
/*  7  Recherche libre (ville, pays, type, dispo période)             */
/* ------------------------------------------------------------------ */
export async function searchChambres(params: {
  ville?: string|null;
  pays?: string|null;
  type?: string|null;
  dateDebut?: string; // ISO datetime string
  dateFin?: string;   // ISO datetime string
  capaciteMin?: number|null;
  capaciteMax?: number|null;
  prixMin?: number|null;
  prixMax?: number|null;
  etablissementId?: string|null;
  disponible?: boolean|null;
  services?: string[]|null;
  adults?: number|null;
  children?: number|null;
  page?: number;
}) {
  const {
    ville,
    pays,
    type,
    dateDebut,
    dateFin,
    capaciteMin,
    capaciteMax,
    prixMin,
    prixMax,
    etablissementId,
    disponible,
    services,
    adults,
    children,
    page = 1,
  } = params;

  /* 1. capacité souhaitée */
  const wantedCapacity =
    adults || children
      ? (adults ?? 0) + (children ?? 0)
      : undefined;

  /* 2. pagination */
  const limit = 20;
  const offset = (page - 1) * limit;

  /* 3. conversion des dates */
  const debutDate = dateDebut ? new Date(dateDebut) : undefined;
  const finDate = dateFin ? new Date(dateFin) : undefined;

  /* 4. construction dynamique des conditions */
  const whereConditions = and(
    /* ----- chambres ----- */
    disponible !== undefined && disponible !== null ? eq(chambres.disponible, disponible) : undefined,
    type ? like(sql`lower(${chambres.type})`, `%${type.toLowerCase()}%`) : undefined,

    /* capacité : on combine le filtre explicite ET/OU le calcul adults+children */
    capaciteMin ? gte(chambres.capacite, capaciteMin) : undefined,
    capaciteMax ? lte(chambres.capacite, capaciteMax) : undefined,
    wantedCapacity ? gte(chambres.capacite, wantedCapacity) : undefined,

    /* prix */
    prixMin ? gte(chambres.prix, prixMin) : undefined,
    prixMax ? lte(chambres.prix, prixMax) : undefined,

    /* ----- établissements (via jointure) ----- */
    etablissementId ? eq(etablissements.id, etablissementId) : undefined,
    ville ? like(sql`lower(${etablissements.ville})`, `%${ville.toLowerCase()}%`) : undefined,
    pays ? like(sql`lower(${etablissements.pays})`, `%${pays.toLowerCase()}%`) : undefined,

    /* indisponibilités sur la période */
    debutDate && finDate
      ? notExists(
          db
            .select({ one: sql`1` })
            .from(reservations)
            .where(
              and(
                eq(reservations.roomId, chambres.id),
                eq(reservations.statut, 'confirm'),
                lte(reservations.dateDebut, finDate),
                gte(reservations.dateFin, debutDate)
              )
            )
        )
      : undefined,
  );

  /* 5. requête principale */
  const rows = await db
    .select({
      chambre: chambres,
      etablissement: etablissements,
    })
    .from(chambres)
    .innerJoin(etablissements, eq(chambres.etablissementId, etablissements.id))
    .where(whereConditions)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(chambres.createdAt));

  /* 6. services facultatifs (post-filter) */
  let filtered = rows;
  if (services?.length) {
    filtered = rows.filter(r =>
      services.every(s => r.chambre.services?.includes(s))
    );
  }

  /* 7. total pour la pagination */
  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(chambres)
    .innerJoin(etablissements, eq(chambres.etablissementId, etablissements.id))
    .where(whereConditions);

  return {
    data: filtered.map(r => ({ ...r.chambre, etablissement: r.etablissement, medias: [] })),
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    },
  };
}

export async function createMedias(chambreId: string, mediaFiles: { url: string; filename: string; type: 'image' | 'video' }[]) {
  if (!mediaFiles.length) return;

  const mediaRows: NewMediaChambre[] = mediaFiles.map(f => ({
    chambreId,
    url: f.url,
    filename: f.filename,
    type: f.type,
  }));

  await db.insert(mediaChambres).values(mediaRows);
}
/* ------------------------------------------------------------------ */
/*  9  Récupérer une chambre par ID (simple)                          */
/* ------------------------------------------------------------------ */
export async function getChambreById(id: string) {
  return db.query.chambres.findFirst({
    where: (chambres, { eq }) => eq(chambres.id, id),
  });
}


/**
 * Récupère un établissement et une chambre spécifique par leurs IDs
 * @param etablissementId - ID de l'établissement
 * @param chambreId - ID de la chambre
 * @returns Object contenant l'établissement et la chambre, ou null si non trouvés
 */
export async function getEtablissementAndChambre(
  etablissementId: string,
  chambreId: string
) {
  try {
    // Récupérer l'établissement
    const [etablissement] = await db
      .select()
      .from(etablissements)
      .where(eq(etablissements.id, etablissementId))
      .limit(1);

    if (!etablissement) {
      return { error: 'Établissement non trouvé', etablissement: null, chambre: null };
    }

    // Récupérer la chambre avec vérification qu'elle appartient bien à l'établissement
    const [chambre] = await db
      .select()
      .from(chambres)
      .where(
        and(
          eq(chambres.id, chambreId),
          eq(chambres.etablissementId, etablissementId)
        )
      )
      .limit(1);

    if (!chambre) {
      return { 
        error: 'Chambre non trouvée ou ne correspond pas à cet établissement', 
        etablissement, 
        chambre: null 
      };
    }

    return {
      success: true,
      etablissement,
      chambre,
      error: null
    };

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return { 
      error: 'Erreur serveur lors de la récupération des données', 
      etablissement: null, 
      chambre: null 
    };
  }
}

// Version avec les médias inclus
export async function getEtablissementAndChambreWithMedia(
  etablissementId: string,
  chambreId: string
) {
  try {
    // Récupérer l'établissement avec ses médias
    const etablissementWithMedia = await db
      .select({
        etablissement: etablissements,
        medias: mediaEtablissements
      })
      .from(etablissements)
      .leftJoin(
        mediaEtablissements,
        eq(mediaEtablissements.etablissementId, etablissements.id)
      )
      .where(eq(etablissements.id, etablissementId));

    if (!etablissementWithMedia.length) {
      return { error: 'Établissement non trouvé', etablissement: null, chambre: null };
    }

    // Récupérer la chambre avec ses médias
     const chambreWithMedia = await db
      .select({
        chambre: chambres,
        medias: mediaChambres
      })
      .from(chambres)
      .leftJoin(
        mediaChambres,
        eq(mediaChambres.chambreId, chambres.id)
      )
      .where(
        and(
          eq(chambres.id, chambreId),
          eq(chambres.etablissementId, etablissementId)
        )
      );

    if (!chambreWithMedia.length) {
      return { 
        error: 'Chambre non trouvée ou ne correspond pas à cet établissement', 
        etablissement: etablissementWithMedia[0].etablissement, 
        chambre: null 
      };
    }

    // Formater les résultats
    const etablissement = {
      ...etablissementWithMedia[0].etablissement,
      medias: etablissementWithMedia
        .filter(item => item.medias)
        .map(item => item.medias)
    };

    const chambre = {
      ...chambreWithMedia[0].chambre,
      medias: chambreWithMedia
        .filter(item => item.medias)
        .map(item => item.medias)
    };

    return {
      success: true,
      etablissement,
      chambre,
      error: null
    };

  } catch (error) {
    console.error('Erreur lors de la récupération avec médias:', error);
    return { 
      error: 'Erreur serveur lors de la récupération des données', 
      etablissement: null, 
      chambre: null 
    };
  }
}

// Types TypeScript pour les retours
export type GetEtablissementAndChambreResult = Awaited<ReturnType<typeof getEtablissementAndChambre>>;
export type GetEtablissementAndChambreWithMediaResult = Awaited<ReturnType<typeof getEtablissementAndChambreWithMedia>>;