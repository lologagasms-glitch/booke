// seed.ts - VERSION DÉFINITIVE
import { db } from '@/db';
import { schema } from '@/db/schema';
import { faker } from '@faker-js/faker';
import { seedData } from './seedata';

/* ---------- helpers ---------- */
const sample = <T>(arr: T[]): T => arr[faker.number.int({ min: 0, max: arr.length - 1 })];

/* ---------- types strictes ---------- */
type ValidEtablissementType = 'hotel' | 'auberge' | 'villa' | 'residence' | 'autre';

const validateType = (type: string): ValidEtablissementType => {
  const validTypes: ValidEtablissementType[] = ['hotel', 'auberge', 'villa', 'residence', 'autre'];
  return validTypes.includes(type as ValidEtablissementType) ? type as ValidEtablissementType : 'hotel';
};

/* ---------- main ---------- */
async function seed() {
  console.log('🌱 Seeding SQLite with Drizzle...');

  /* 1. Users */
  const userIds: string[] = [];
  for (let i = 0; i < 25; i++) {
    const id = crypto.randomUUID();
    await db.insert(schema.user).values({
      id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: faker.image.avatar(),
      role: i === 0 ? 'admin' : 'user',
      banned: false,
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
    });
    userIds.push(id);
  }

  /* 2. Établissements – insertion séparée */
  const etablissementData: { id: string; data: typeof seedData.etablissements[0] }[] = [];
  
  for (const etab of seedData.etablissements) {
    const id = crypto.randomUUID();
    const validType = validateType(etab.type);
    
    // ✅ INSERTION SANS L'ID (laisser Drizzle générer l'ID)
    await db.insert(schema.etablissements).values({
      nom: etab.nom,
      adresse: etab.adresse,
      description: etab.description,
      longitude: etab.longitude,
      latitude: etab.latitude,
      pays: etab.pays,
      ville: etab.ville,
      type: validType,
      services: etab.services,
      etoiles: etab.etoiles,
      contact: {
        telephone: faker.phone.number(),
        email: faker.internet.email(),
        siteWeb: faker.internet.url(),
      },
      userId: sample(userIds),
      createdAt: faker.date.past({ years: 1 }),
    });
    
    etablissementData.push({ id, data: etab });
  }

  /* 3. Récupérer les vrais IDs depuis la base */
  const realEtablissements = await db.select().from(schema.etablissements);
  
  /* 4. Médias établissement – avec vrais IDs */
  for (let i = 0; i < realEtablissements.length && i < seedData.etablissements.length; i++) {
    const realEtab = realEtablissements[i];
    const etab = seedData.etablissements[i];
    
    console.log(`📸 Insertion médias pour: ${realEtab.nom} (ID: ${realEtab.id})`);
    
    // Images
    for (let j = 0; j < etab.images.length; j++) {
      await db.insert(schema.mediaEtablissements).values({
        id: crypto.randomUUID(),
        etablissementId: realEtab.id,
        url: etab.images[j],
        filename: `etab-${realEtab.id}-img-${j}.jpg`,
        type: 'image',
        createdAt: faker.date.past({ years: 1 }),
      });
    }

    // Vidéos
    if (etab.videos) {
      for (let j = 0; j < etab.videos.length; j++) {
        await db.insert(schema.mediaEtablissements).values({
          id: crypto.randomUUID(),
          etablissementId: realEtab.id,
          url: etab.videos[j],
          filename: `etab-${realEtab.id}-video-${j}.mp4`,
          type: 'video',
          createdAt: faker.date.past({ years: 1 }),
        });
      }
    }
  }

  /* 5. Chambres – avec vrais IDs */
  const chambreIds: string[] = [];
  
  for (const realEtab of realEtablissements) {
    const roomTypes = faker.helpers.arrayElements(seedData.chambresTypes, { min: 4, max: 6 });
    
    for (let i = 0; i < roomTypes.length; i++) {
      const roomType = roomTypes[i];
      const id = crypto.randomUUID();
      
      await db.insert(schema.chambres).values({
        id,
        etablissementId: realEtab.id,
        nom: `${roomType.type} ${i + 1}`,
        description: roomType.description,
        prix: faker.number.float({ 
          min: roomType.prixMin, 
          max: roomType.prixMax, 
          fractionDigits: 2 
        }),
        capacite: roomType.capacite,
        disponible: faker.datatype.boolean(0.8),
        type: roomType.type.includes('Suite') ? 'Suite' : sample(['Double', 'Twin', 'Single']),
        services: faker.helpers.arrayElements(
          ['Clim', 'TV', 'Mini-bar', 'Balcon', 'Coffre-fort', 'Vue mer', 'Baignoire'],
          { min: 2, max: 5 }
        ),
        createdAt: faker.date.past({ years: 1 }),
      });
      
      chambreIds.push(id);
    }
  }

  /* 6. Récupérer les vrais IDs des chambres */
  const realChambres = await db.select().from(schema.chambres);
  
  /* 7. Médias chambres – avec vrais IDs */
  for (const realChambre of realChambres) {
    const roomType = sample(seedData.chambresTypes);
    
    // Images
    for (let i = 0; i < roomType.images.length; i++) {
      await db.insert(schema.mediaChambres).values({
        id: crypto.randomUUID(),
        chambreId: realChambre.id,
        url: roomType.images[i],
        filename: `room-${realChambre.id}-img-${i}.jpg`,
        type: 'image',
        createdAt: faker.date.past({ years: 1 }),
      });
    }

    // Vidéos
    if (roomType.videos) {
      for (let i = 0; i < roomType.videos.length; i++) {
        await db.insert(schema.mediaChambres).values({
          id: crypto.randomUUID(),
          chambreId: realChambre.id,
          url: roomType.videos[i],
          filename: `room-${realChambre.id}-video-${i}.mp4`,
          type: 'video',
          createdAt: faker.date.past({ years: 1 }),
        });
      }
    }
  }

  /* 8. Réservations */
  for (let i = 0; i < 200; i++) {
    const debut = faker.date.soon({ days: 60 });
    const fin = faker.date.soon({ days: faker.number.int({ min: 1, max: 14 }), refDate: debut });

    await db.insert(schema.reservations).values({
      id: crypto.randomUUID(),
      userId: sample(userIds),
      roomId: sample(realChambres).id,
      etablissementId: sample(realEtablissements).id,
      dateDebut: debut,
      dateFin: fin,
      nombrePersonnes: faker.number.int({ min: 1, max: 3 }),
      prixTotal: faker.number.float({ min: 100, max: 1200, fractionDigits: 2 }),
      statut: sample(['confirm', 'en_attente', 'annul']),
      createdAt: faker.date.past({ years: 1 }),
    });
  }

  console.log(
    `✅ Seed terminé → ${userIds.length} users, ${realEtablissements.length} hôtels, ${realChambres.length} chambres.`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur seed :', err);
  process.exit(1);
});