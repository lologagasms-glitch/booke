"use server"
import { db } from '@/db';
import {
  chambres,
  mediaEtablissements,
  mediaChambres,
  reservations,
  etablissements,
} from '@/db/schema';
import { Chambre, Etablissement, MediaChambre, MediaEtablissement, NewEtablissement, SearchParams as SearchParamsIface } from '@/types';
import { eq, and, lte, gte, or, sql, desc, inArray, min, count, asc, like, SQL, notInArray } from 'drizzle-orm';
import z from 'zod';

// ------------------------------------------------------------------
// Type final contrôlé
// ------------------------------------------------------------------
export type EtablissementWithMediasAndRooms = Etablissement & {
  mediasEtab: MediaEtablissement[];
  chambres: (Chambre & { mediasChambre: MediaChambre[] })[];
};

// ------------------------------------------------------------------
// Server Actions
// ------------------------------------------------------------------
export async function getAllEtablissements(limit?: number, offset?: number) {
  const firstImage = db.$with('first_image').as(
    db.select({
      etablissementId: mediaEtablissements.etablissementId,
      url: mediaEtablissements.url,
      row_num: sql<number>`row_number() over (partition by ${mediaEtablissements.etablissementId} order by ${mediaEtablissements.createdAt} asc)`.as('row_num'),
    })
    .from(mediaEtablissements)
    .where(eq(mediaEtablissements.type, 'image'))
  );

  const data = await db.with(firstImage)
    .select({
      etablissements,
      firstImageUrl: firstImage.url,
    })
    .from(etablissements)
    .leftJoin(firstImage, and(
      eq(etablissements.id, firstImage.etablissementId),
      eq(firstImage.row_num, 1) // Ne garde que la première image
    ))
    .orderBy(desc(etablissements.createdAt))
    .limit(limit ?? 10) 
    .offset(offset ?? 0); 
    return data     
}

export const getAllEtablissementsOnlyNameAndId = async (limit?: number, offset?: number) => {
  const query = db
    .select({
      id: etablissements.id,
      nom: etablissements.nom,
    })
    .from(etablissements)
    .orderBy(asc(etablissements.nom));

  if (limit) query.limit(limit);
  if (offset) query.offset(offset);

  return query;
};
export async function getPopularEtablissements(limit = 10) {
  /* 1. établissements populaires (stats uniquement) */
  const pop = await db
    .select({
      etablissementId: etablissements.id,
      nom: etablissements.nom,
      ville: etablissements.ville,
      pays: etablissements.pays,
      etoiles: etablissements.etoiles,
      services: etablissements.services,
      prixMin: sql<number | null>`min(${chambres.prix})`.as('prixMin'),
      totalResa: sql<number>`count(${reservations.id})`.as('totalResa'),
    })
    .from(etablissements)
    .leftJoin(chambres, eq(chambres.etablissementId, etablissements.id))
    .leftJoin(
      reservations,
      and(
        eq(reservations.etablissementId, etablissements.id),
        eq(reservations.statut, 'confirm')
      )
    )
    .groupBy(
      etablissements.id,
      etablissements.nom,
      etablissements.ville,
      etablissements.pays,
      etablissements.etoiles,
      etablissements.services
    )
    .orderBy(({ totalResa }) => desc(totalResa))
    .limit(limit);

  if (!pop.length) return [];

  /* 2. première image (la plus ancienne) pour ces ids */
  const ids = pop.map((p) => p.etablissementId);
  const imgs = await db
    .select({
      etablissementId: mediaEtablissements.etablissementId,
      mediaUrl: sql<string>`min(${mediaEtablissements.url})`.as('mediaUrl'),
    })
    .from(mediaEtablissements)
    .where(inArray(mediaEtablissements.etablissementId, ids))
    .groupBy(mediaEtablissements.etablissementId);

  /* 3. fusion */
  const map = new Map(imgs.map((i) => [i.etablissementId, i.mediaUrl]));
  return pop.map((p) => ({ ...p, mediaUrl: map.get(p.etablissementId) ?? null }));
}

export async function getEtablissementById(id: string) {
  return db.query.etablissements.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    with: {
      medias: true, // mediaEtablissements
      chambres: {
        with: { medias: true }, // mediaChambres
      },
    },
  });
}

export async function searchEtablissements(params: {
  ville?: string;
  pays?: string;
  type?: string;
  dateDebut?: Date;
  dateFin?: Date;
  services?: string[];
  etoiles?: number;
}) {
  const { ville, pays, type, dateDebut, dateFin, services, etoiles } = params;

  return db.query.etablissements.findMany({
    where: (et, { eq, and, like, sql, gte }) =>
      and(
        ville ? like(sql`lower(${et.ville})`, `%${ville.toLowerCase()}%`) : undefined,
        pays  ? like(sql`lower(${et.pays})`,   `%${pays.toLowerCase()}%`)  : undefined,
        type ? eq(et.type, type as "hotel" | "auberge" | "villa" | "residence" | "autre") : undefined,
        services?.length ? sql`${et.services} @> ${JSON.stringify(services)}` : undefined,
        etoiles ? gte(et.etoiles, etoiles) : undefined
      ),

    with: {
      medias: true,
      chambres: {
        where: (ch, { eq, and, notExists }) =>
          and(
            eq(ch.disponible, true),
            dateDebut && dateFin
              ? notExists(
                  db
                    .select({ one: sql`1` })
                    .from(reservations)
                    .where(
                      and(
                        eq(reservations.roomId, ch.id),
                        eq(reservations.statut, 'confirm'),
                        lte(reservations.dateDebut, dateFin),
                        gte(reservations.dateFin, dateDebut)
                      )
                    )
                )
              : undefined
          ),
        with: { medias: true },
      },
    },
  });
}

export async function getPopularDestinations(limit = 6) {
  const rows = await db
    .select({
      ville: etablissements.ville,
      pays: etablissements.pays,
      media: mediaEtablissements,
    })
    .from(etablissements)
    .leftJoin(mediaEtablissements, eq(etablissements.id, mediaEtablissements.etablissementId))
    .groupBy(etablissements.ville, etablissements.pays, mediaEtablissements.url)
    .orderBy(desc(etablissements.createdAt));

  const seen = new Set<string>();
  const destinations: typeof rows = [];

  for (const r of rows) {
    if (!seen.has(r.ville)) {
      seen.add(r.ville);
      destinations.push(r);
      if (destinations.length === limit) break;
    }
  }

  return destinations;
}

export async function createEtablissement(data: Omit<NewEtablissement, 'id' | 'createdAt'>) {
  await db.insert(etablissements).values({
    ...data,
    contact: data.contact ?? { telephone: '', email: '' },
  });
}

export async function updateEtablissement(id: string, data: Partial<NewEtablissement>) {
  await db.update(etablissements).set(data).where(eq(etablissements.id, id));
}

export async function deleteEtablissement(id: string) {
  await db.delete(etablissements).where(eq(etablissements.id, id));
}

export async function addMediasToEtablissement(
  etablissementId: string,
  medias: { url: string; type: "image" | "video"; caption?: string }[]
) {
  const values = medias.map(m => ({
    ...m,
    etablissementId,
    filename: m.caption ?? m.url.split('/').pop() ?? 'media',
  }));
  await db.insert(mediaEtablissements).values(values);
}

export async function getFirstMediaImageEtablissement(etablissementId: string) {
  const [media] = await db
    .select()
    .from(mediaEtablissements)
    .where(
      and(
        eq(mediaEtablissements.etablissementId, etablissementId),
        eq(mediaEtablissements.type, 'image')
      )
    )
    .limit(1);

  return media || null;
}

export async function getAllMediaImages(limit = 10, offset = 0) {
  const etabImages = await db
    .select({
      id: mediaEtablissements.id,
      url: mediaEtablissements.url,
      type: mediaEtablissements.type,
      etablissementId: mediaEtablissements.etablissementId,
      chambreId: sql`null`.as('chambreId'),
    })
    .from(mediaEtablissements)
    .where(eq(mediaEtablissements.type, 'image'))
    .limit(limit)
    .offset(offset);

  const chambreImages = await db
    .select({
      id: mediaChambres.id,
      url: mediaChambres.url,
      type: mediaChambres.type,
      etablissementId: sql`null`.as('etablissementId'),
      chambreId: mediaChambres.chambreId,
    })
    .from(mediaChambres)
    .where(eq(mediaChambres.type, 'image'))
    .limit(limit)
    .offset(offset);

  return [...etabImages, ...chambreImages].slice(0, limit);
}

/*********************************************************************/
/*  1.  Mapping  label  →  DB                                       */
/*********************************************************************/
const SERVICE_LABEL_TO_DB: Record<string, string> = {
  'Wi-Fi gratuit'        : 'wifi',
  Piscine                : 'piscine',
  Spa                    : 'spa',
  Restaurant             : 'restaurant',
  'Salle de sport'       : 'gym',
  Parking                : 'parking',
  Climatisation          : 'clim',
  'Petit-déjeuner inclus': 'petit_dejeuner',
} as const;

// Mapping spécifique aux services de chambre
const ROOM_SERVICE_LABEL_TO_DB: Record<string, string> = {
  'Wi-Fi gratuit'        : 'wifi',
  Climatisation          : 'clim',
  'Mini-bar'             : 'minibar',
  Coffre                 : 'coffre',
  Télévision             : 'tv',
  Balcon                 : 'balcon',
  'Baignoire'            : 'baignoire',
  'Douche'               : 'douche',
} as const;

const FILTER_OWNER = {
  destination: 'etablissement',
  ville: 'etablissement',
  pays: 'etablissement',
  type: 'etablissement',
  stars: 'etablissement',
  minPrice: 'chambre',
  maxPrice: 'chambre',
  capaciteMin: 'chambre',
  capaciteMax: 'chambre',
  adults: 'chambre',
  children: 'chambre',
  disponible: 'chambre',
  checkIn: 'chambre',
  checkOut: 'chambre',
} as const;

const SERVICE_TO_TABLE: Record<string, 'etablissement' | 'chambre'> = {
  wifi: 'etablissement',
  parking: 'etablissement',
  clim: 'etablissement',
  coffre: 'chambre',
  minibar: 'chambre',
  tv: 'chambre',
  balcon: 'chambre',
  baignoire: 'chambre',
  douche: 'chambre',
  piscine: 'etablissement',
  spa: 'etablissement',
  restaurant: 'etablissement',
  gym: 'etablissement',
  petit_dejeuner: 'etablissement',
};

function splitServices(services: string[]) {
  const e: string[] = [];
  const c: string[] = [];
  for (const s of services) {
    const table = SERVICE_TO_TABLE[s.toLowerCase()];
    if (!table) continue;
    table === 'etablissement' ? e.push(s) : c.push(s);
  }
  return { etab: e, chambre: c };
}

const SearchParamsSchema = z.object({
  destination: z.string().trim().max(100).optional().nullable(),
  ville       : z.string().trim().max(60).optional().nullable(),
  pays        : z.string().trim().max(60).optional().nullable(),
  type        : z.enum(['hotel', 'auberge', 'villa', 'residence', 'autre']).optional().nullable(),
  services    : z.array(z.string().trim().max(30))
                 .max(20).optional().nullable()
                 .transform(arr => (arr ?? []).map(l => SERVICE_LABEL_TO_DB[l] || ROOM_SERVICE_LABEL_TO_DB[l]).filter(Boolean)),
  stars       : z.number().int().min(0).max(5).optional().nullable(),
  checkIn     : z.coerce.date().optional().nullable(),
  checkOut    : z.coerce.date().optional().nullable(),
  minPrice    : z.number().nonnegative().max(999_999).optional().nullable(),
  maxPrice    : z.number().nonnegative().max(999_999).optional().nullable(),
  capaciteMin : z.number().int().nonnegative().max(99).optional().nullable(),
  capaciteMax : z.number().int().nonnegative().max(99).optional().nullable(),
  adults      : z.number().int().nonnegative().max(99).optional().nullable(),
  children    : z.number().int().nonnegative().max(99).optional().nullable(),
  disponible  : z.enum(['true', 'false']).optional().nullable(),
})
.refine(d => !d.checkIn || !d.checkOut || d.checkOut > d.checkIn, {
  message: 'checkOut must be after checkIn',
  path   : ['checkOut'],
})
.refine(d => (d.minPrice ?? 0) <= (d.maxPrice ?? Infinity), {
  message: 'minPrice must be ≤ maxPrice',
  path   : ['maxPrice'],
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

/*********************************************************************/
/*  3.  Types de sortie                                              */
/*********************************************************************/
export type EtablissementResult = {
  kind: 'etablissement'
  id   : string
  nom  : string
  description: string
  image: string
  ville: string
  pays : string
  type : string
  etoiles: number | null
};

export type ChambreResult = {
  kind : 'chambre'
  id   : string
  nom  : string
  description: string
  image: string
  ville: string
  pays : string
  type : string
  etoiles: number | null
  prix : number
  capacite: number
  etablissementId: string
  etablissementNom: string
};

export type GlobalSearchResult = EtablissementResult | ChambreResult;

/*********************************************************************/
/*  4.  Helpers internes                                             */
/*********************************************************************/

function buildScore(result: any, p: SearchParams): number {
  let score = 0;
  if (p.destination) {
    const d = p.destination.toLowerCase();
    if (result.nom?.toLowerCase().includes(d)) score += 40;
    else if (result.description?.toLowerCase().includes(d)) score += 20;
    else if (result.ville?.toLowerCase().includes(d)) score += 10;
  }
  if (p.ville && result.ville?.toLowerCase().includes(p.ville.toLowerCase())) score += 15;
  if (p.pays && result.pays?.toLowerCase().includes(p.pays.toLowerCase())) score += 10;
  if (p.type && result.type === p.type) score += 5;
  if (p.stars && result.etoiles === p.stars) score += 5;
  if (result.kind === 'chambre') {
    if (p.minPrice != null && result.prix >= p.minPrice) score += 5;
    if (p.maxPrice != null && result.prix <= p.maxPrice) score += 5;
  }
  return Math.min(100, score);
}

async function getReservedRoomIds(checkIn: Date, checkOut: Date): Promise<string[]> {
  const rows = await db
    .select({ roomId: reservations.roomId })
    .from(reservations)
    .where(
      and(
        eq(reservations.statut, 'confirm'),
        sql`${checkIn} < ${reservations.dateFin} AND ${checkOut} > ${reservations.dateDebut}`
      )
    );
  return rows.map(r => r.roomId);
}

async function getEtablissementsFiltered(
  whereEtab: SQL<unknown>[],
  cursor: string | undefined,
  limit: number
) {
  const where = and(...whereEtab, cursor ? sql`${etablissements.id} > ${cursor}` : undefined);
  return db.query.etablissements.findMany({
    where,
    with: {
      medias: {
        where: eq(mediaEtablissements.type, 'image'),
        orderBy: asc(mediaEtablissements.createdAt),
        limit: 1,
      },
    },
    orderBy: asc(etablissements.id),
    limit,
  });
}

async function getChambresFiltered(
  whereChambre: SQL<unknown>[],
  dateFilter: SQL<unknown> | undefined,
  cursor: string | undefined,
  limit: number
) {
  const where = and(...whereChambre, dateFilter, cursor ? sql`${chambres.id} > ${cursor}` : undefined);
  return db.query.chambres.findMany({
    where,
    with: {
      etablissement: true,
      medias: {
        where: eq(mediaChambres.type, 'image'),
        orderBy: asc(mediaChambres.createdAt),
        limit: 1,
      },
    },
    orderBy: asc(chambres.id),
    limit,
  });
}

/*********************************************************************/
/*  5.  Fonction de recherche principale                             */
/*********************************************************************/
export async function searchGlobal(
  unsafe: unknown,
  options?: { cursor?: string; limit?: number }
): Promise<{ results: GlobalSearchResult[]; nextCursor?: string }> {
  const limit = options?.limit ?? 20;
  const cursor = options?.cursor;

  /* 5-a  validation Zod  ----------------------------------------- */
  const p = SearchParamsSchema.parse(unsafe);

  /* 5-b  split services  ----------------------------------------- */
  const { etab: servicesEtab, chambre: servicesChambre } = splitServices(p.services ?? []);

  /* 5-c  build WHERE établissement  ------------------------------ */
  const whereEtab: SQL<unknown>[] = [];
  if (p.destination) {
    const dest = p.destination.toLowerCase();
    whereEtab.push(
      sql`EXISTS (
        SELECT 1 FROM etab_fts
        WHERE etab_fts.id = ${etablissements.id}
        AND etab_fts MATCH ${dest}
      )`
    );
  }
  if (p.ville) whereEtab.push(like(etablissements.ville, `%${p.ville.toLowerCase()}%`));
  if (p.pays) whereEtab.push(like(etablissements.pays, `%${p.pays.toLowerCase()}%`));
  if (p.type) whereEtab.push(eq(etablissements.type, p.type));
  if (p.stars != null) whereEtab.push(eq(etablissements.etoiles, p.stars));
  if (servicesEtab.length) {
    const pattern = servicesEtab.map(s => s.toLowerCase()).join('|');
    whereEtab.push(
      sql`EXISTS (
        SELECT 1
        FROM json_each(${etablissements.services}) AS s
        WHERE lower(s.value) GLOB '*' || ${pattern} || '*'
      )`
    );
  }

  /* 5-d  build WHERE chambre  ----------------------------------- */
  const whereChambre: SQL<unknown>[] = [];
  if (p.minPrice != null) whereChambre.push(gte(chambres.prix, p.minPrice));
  if (p.maxPrice != null) whereChambre.push(lte(chambres.prix, p.maxPrice));
  const voyageurs = (p.adults ?? 0) + (p.children ?? 0);
  if (voyageurs > 0) whereChambre.push(gte(chambres.capacite, voyageurs));
  else {
    if (p.capaciteMin != null) whereChambre.push(gte(chambres.capacite, p.capaciteMin));
    if (p.capaciteMax != null) whereChambre.push(lte(chambres.capacite, p.capaciteMax));
  }
  if (p.disponible === 'true') whereChambre.push(eq(chambres.disponible, true));
  if (p.disponible === 'false') whereChambre.push(eq(chambres.disponible, false));
  if (servicesChambre.length) {
    const pattern = servicesChambre.map(s => s.toLowerCase()).join('|');
    whereChambre.push(
      sql`EXISTS (
        SELECT 1
        FROM json_each(${chambres.services}) AS s
        WHERE lower(s.value) GLOB '*' || ${pattern} || '*'
      )`
    );
  }

  /* 5-e  date filter  ------------------------------------------- */
  let dateFilter: SQL<unknown> | undefined;
  if (p.checkIn && p.checkOut) {
    const reservedIds = await getReservedRoomIds(p.checkIn, p.checkOut);
    if (reservedIds.length) dateFilter = notInArray(chambres.id, reservedIds);
  }

  /* 5-f  fetch data  ------------------------------------------- */
  const [etabRows, chambreRows] = await Promise.all([
    getEtablissementsFiltered(whereEtab, cursor?.startsWith('etab-') ? cursor.replace('etab-', '') : undefined, limit),
    getChambresFiltered(whereChambre, dateFilter, cursor?.startsWith('chambre-') ? cursor.replace('chambre-', '') : undefined, limit),
  ]);

  /* 5-g  mapping strict vers types  ----------------------------- */
  const etabResults: GlobalSearchResult[] = etabRows.map(et => ({
    kind: 'etablissement',
    id: et.id,
    nom: et.nom,
    description: et.description,
    image: et.medias[0]?.url ?? '',
    ville: et.ville,
    pays: et.pays,
    type: et.type,
    etoiles: et.etoiles ?? null,
  }));

  const chambreResults: GlobalSearchResult[] = chambreRows.map(ch => ({
    kind: 'chambre',
    id: ch.id,
    nom: ch.nom,
    description: ch.description,
    image: ch.medias[0]?.url ?? '',
    ville: ch.etablissement.ville,
    pays: ch.etablissement.pays,
    type: ch.etablissement.type,
    etoiles: ch.etablissement.etoiles ?? null,
    prix: ch.prix,
    capacite: ch.capacite,
    etablissementId: ch.etablissementId,
    etablissementNom: ch.etablissement.nom,
  }));

  /* 5-h  score, tri, dé-duplication  ---------------------------- */
  const all = [...etabResults, ...chambreResults];
  for (const r of all) (r as any)._score = buildScore(r, p);
  all.sort((a, b) => (b as any)._score - (a as any)._score);

  // dé-duplication : garde meilleur score par établissement
  const seen = new Set<string>();
  const deduped: GlobalSearchResult[] = [];
  for (const r of all) {
    const key = r.kind === 'etablissement' ? r.id : r.etablissementId;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  /* 5-i  nextCursor  ------------------------------------------- */
  const last = deduped[deduped.length - 1];
  let nextCursor: string | undefined;
  if (last && deduped.length === limit) {
    nextCursor = last.kind === 'etablissement' ? `etab-${last.id}` : `chambre-${last.id}`;
  }

  /* 5-j  return strict sans _score  ---------------------------- */
  return {
    results: deduped.map(({  ...rest }) => rest as GlobalSearchResult),
    nextCursor,
  };
}

export async function searchData(params: Partial<SearchParamsIface>) {
  const conds: any[] = [];
  if (params.destination) {
    const d = params.destination.toLowerCase();
    conds.push(
      or(
        like(etablissements.nom, `%${d}%`),
        like(etablissements.description, `%${d}%`),
        like(etablissements.ville, `%${d}%`)
      )
    );
  }
  if (params.ville) conds.push(like(etablissements.ville, `%${params.ville.toLowerCase()}%`));
  if (params.pays) conds.push(like(etablissements.pays, `%${params.pays.toLowerCase()}%`));
  if (params.type) conds.push(eq(etablissements.type, params.type as any));
  if (params.stars != null) conds.push(eq(etablissements.etoiles, Number(params.stars)));
  if (params.minPrice != null) conds.push(gte(chambres.prix, Number(params.minPrice)));
  if (params.maxPrice != null) conds.push(lte(chambres.prix, Number(params.maxPrice)));
  if (params.capaciteMin != null) conds.push(gte(chambres.capacite, Number(params.capaciteMin)));
  if (params.capaciteMax != null) conds.push(lte(chambres.capacite, Number(params.capaciteMax)));
  if (params.disponible != null) conds.push(eq(chambres.disponible, Boolean(params.disponible)));

  const base = db
    .select({
      etab: etablissements,
      room: chambres,
      etabMedia: mediaEtablissements,
      roomMedia: mediaChambres,
    })
    .from(etablissements)
    .leftJoin(chambres, eq(chambres.etablissementId, etablissements.id))
    .leftJoin(mediaEtablissements, eq(mediaEtablissements.etablissementId, etablissements.id))
    .leftJoin(mediaChambres, eq(mediaChambres.chambreId, chambres.id));

  const rows = conds.length ? await base.where(and(...conds)) : await base;

  const map = new Map<string, Etablissement & { medias: MediaEtablissement[]; chambres: (Chambre & { medias: MediaChambre[] })[] }>();
  for (const r of rows) {
    const e = r.etab;
    if (!map.has(e.id)) {
      map.set(e.id, { ...e, medias: [], chambres: [] });
    }
    const cur = map.get(e.id)!;
    if (r.etabMedia && r.etabMedia.id) {
      if (r.etabMedia && !cur.medias.find(m => m.id === r.etabMedia!.id)) cur.medias.push(r.etabMedia);
    }
    if (r.room && r.room.id) {
      if (!r.room) continue;
      let room = cur.chambres.find(c => c.id === r?.room?.id);
      if (!room) {
        room = { ...r.room, medias: [] } as any;
        if (room) cur.chambres.push(room);
      }
      if (r.roomMedia && r.roomMedia.id) {
        if (!room?.medias.find(m => m.id === r.roomMedia?.id)) room?.medias.push(r.roomMedia);
      }
    }
  }

  return Array.from(map.values());
}
