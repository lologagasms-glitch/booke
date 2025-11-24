// seed.ts
import { db } from '@/db';
import { schema } from '@/db/schema';
import type {
  NewUser,
  NewEtablissement,
  NewChambre,
  NewReservation,
  NewMediaEtablissement,
  NewMediaChambre,
} from '@/types';
import { faker } from '@faker-js/faker';

/* ---------- helpers ---------- */
const sample = <T>(arr: T[]): T => arr[faker.number.int({ min: 0, max: arr.length - 1 })];

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
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });
    userIds.push(id);
  }

  /* 2. Établissements */
  const etablissementIds: string[] = [];
  for (let i = 0; i < 60; i++) {
    const id = crypto.randomUUID();
    await db.insert(schema.etablissements).values({
      id,
      nom: `${faker.company.name()} Hôtel`,
      adresse: faker.location.streetAddress(),
      description: faker.lorem.paragraph(),
      longitude: faker.location.longitude().toFixed(6),
      latitude: faker.location.latitude().toFixed(6),
      pays: faker.location.country(),
      ville: faker.location.city(),
      type: sample(['hotel', 'auberge', 'villa', 'residence', 'autre']),
      services: faker.helpers.arrayElements(
        ['Wi-Fi', 'Piscine', 'Spa', 'Parking', 'Petit-déjeuner', 'Salle de sport'],
        { min: 2, max: 4 }
      ),
      etoiles: faker.number.int({ min: 1, max: 5 }),
      contact: {
        telephone: faker.phone.number(),
        email: faker.internet.email(),
        siteWeb: faker.internet.url(),
      },
      userId: sample(userIds),
      createdAt: faker.date.past(),
    });
    etablissementIds.push(id);
  }

  /* 3. Médias établissement (3 à 6 par hôtel) */
  for (const eid of etablissementIds) {
    const count = faker.number.int({ min: 3, max: 6 });
    for (let i = 0; i < count; i++) {
      const seed = faker.string.uuid();
      const media: NewMediaEtablissement = {
        id: crypto.randomUUID(),
        etablissementId: eid,
        url: `https://picsum.photos/seed/${seed}/1200/800.jpg`,
        filename: `etab-${eid}-${i}.jpg`,
        type: 'image',
        createdAt: faker.date.past(),
      };
      await db.insert(schema.mediaEtablissements).values(media);
    }
  }

  /* 4. Chambres */
  const chambreIds: string[] = [];
  for (const eid of etablissementIds) {
    const count = faker.number.int({ min: 4, max: 10 });
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID();
      await db.insert(schema.chambres).values({
        id,
        etablissementId: eid,
        nom: `Chambre ${faker.helpers.arrayElement(['Standard', 'Deluxe', 'Suite', 'Cosy'])} ${i + 1}`,
        description: faker.lorem.sentence(),
        prix: faker.number.float({ min: 50, max: 300, fractionDigits: 2 }),
        capacite: faker.number.int({ min: 1, max: 4 }),
        disponible: faker.datatype.boolean(0.8),
        type: sample(['Double', 'Twin', 'Single', 'Suite']),
        services: faker.helpers.arrayElements(
          ['Clim', 'TV', 'Mini-bar', 'Balcon', 'Coffre-fort'],
          { min: 1, max: 3 }
        ),
        createdAt: faker.date.past(),
      });
      chambreIds.push(id);
    }
  }

  /* 5. Médias chambres (4 à 8 par chambre) */
  for (const cid of chambreIds) {
    const count = faker.number.int({ min: 4, max: 8 });
    for (let i = 0; i < count; i++) {
      const seed = faker.string.uuid();
      const media: NewMediaChambre = {
        id: crypto.randomUUID(),
        chambreId: cid,
        url: `https://picsum.photos/seed/${seed}/800/600.jpg`,
        filename: `room-${cid}-${i}.jpg`,
        type: 'image',
        createdAt: faker.date.past(),
      };
      await db.insert(schema.mediaChambres).values(media);
    }
  }

  /* 6. Réservations */
  for (let i = 0; i < 200; i++) {
    const debut = faker.date.soon({ days: 60 });
    const fin   = faker.date.soon({ days: faker.number.int({ min: 1, max: 14 }), refDate: debut });

    await db.insert(schema.reservations).values({
      id: crypto.randomUUID(),
      userId: sample(userIds),
      roomId: sample(chambreIds),
      etablissementId: sample(etablissementIds),
      dateDebut: debut,
      dateFin: fin,
      nombrePersonnes: faker.number.int({ min: 1, max: 3 }),
      prixTotal: faker.number.float({ min: 100, max: 1200, fractionDigits: 2 }),
      statut: sample(['confirm', 'en_attente', 'annul']),
      createdAt: faker.date.past(),
    });
  }

  console.log(
    `✅ Seed terminé → ${userIds.length} users, ${etablissementIds.length} hôtels, ${chambreIds.length} chambres.`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur seed :', err);
  process.exit(1);
});