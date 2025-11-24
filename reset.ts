// src/db/reset.ts
import { db } from '@/db';
import { sql } from 'drizzle-orm';

/* liste TES tables dans l’ordre inverse des FK */
const tables = [
  'reservation',
  'mediaChambre',
  'mediaEtablissement',
  'chambre',
  'etablissement',
  'session',
  'account',
  'verification',
  'user',
] as const;

export async function clearDB() {
  console.log('🧹 Vidage des tables…');
  for (const t of tables) {
    await db.run(sql`DELETE FROM ${sql.raw(t)}`);
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name=${t}`); // remet AUTOINCREMENT à 0
  }
  console.log('✅ DB vidée');
}

/* si tu lances ce script directement */
if (import.meta.url === `file://${process.argv[1]}`) {
  clearDB().then(() => process.exit(0));
}