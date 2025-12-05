// schema.ts
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

/* ------------------------------------------------------------------ */
/* 1.  TABLES BETTER-AUTH (obligatoires)                              */
/* ------------------------------------------------------------------ */

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  banned: integer('banned', { mode: 'boolean' }).notNull().default(false),
  isAnonymous: integer('isAnonymous', { mode: 'boolean' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  idToken: text('idToken'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

/* ------------------------------------------------------------------ */
/* 2.  TABLES MÉTIERS                                                 */
/* ------------------------------------------------------------------ */

export const etablissements = sqliteTable('etablissement', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: text('nom').notNull(),
  adresse: text('adresse').notNull(),
  description: text('description').notNull(),
  longitude: text('longitude').notNull(),
  latitude: text('latitude').notNull(),
  pays: text('pays').notNull(),
  ville: text('ville').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  type: text('type', { enum: ['hotel', 'auberge', 'villa', 'residence', 'autre'] }).notNull(),
  services: text('services', { mode: 'json' }).$type<string[]>().notNull(),
  etoiles: integer('etoiles'),
  contact: text('contact', { mode: 'json' }).$type<{ telephone: string; email: string; siteWeb?: string }>().notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const chambres = sqliteTable('chambre', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  etablissementId: text('etablissementId').notNull().references(() => etablissements.id, { onDelete: 'cascade' }),
  nom: text('nom').notNull(),
  description: text('description').notNull(),
  prix: real('prix').notNull(),
  capacite: integer('capacite').notNull(),
  disponible: integer('disponible', { mode: 'boolean' }).notNull().default(true),
  type: text('type').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  services: text('services', { mode: 'json' }).$type<string[]>(),
});

export const mediaEtablissements = sqliteTable('mediaEtablissement', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  etablissementId: text('etablissementId').notNull().references(() => etablissements.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const mediaChambres = sqliteTable('mediaChambre', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chambreId: text('chambreId').notNull().references(() => chambres.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const reservations = sqliteTable('reservation', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  roomId: text('roomId').notNull().references(() => chambres.id, { onDelete: 'cascade' }),
  etablissementId: text('etablissementId').notNull().references(() => etablissements.id, { onDelete: 'cascade' }),
  dateDebut: integer('dateDebut', { mode: 'timestamp' }).notNull(),
  dateFin: integer('dateFin', { mode: 'timestamp' }).notNull(),
  nombrePersonnes: integer('nombrePersonnes').notNull(),
  prixTotal: real('prixTotal').notNull(),
  statut: text('statut', { enum: ['confirm', 'en_attente', 'annul'] }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('reservation_userId_idx').on(table.userId),
  roomIdIdx: index('reservation_roomId_idx').on(table.roomId),
  etablissementIdIdx: index('reservation_etablissementId_idx').on(table.etablissementId),
  statutIdx: index('reservation_statut_idx').on(table.statut),
  dateDebutIdx: index('reservation_dateDebut_idx').on(table.dateDebut),
}));





// Chat support: Conversations & Messages
export const conversations = sqliteTable('conversation', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  lastMessageAt: integer('lastMessageAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  hasUnreadMessages: integer('hasUnreadMessages', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userUniqueIdx: index('conversation_user_unique_idx').on(table.userId),
  lastMessageIdx: index('conversation_lastMessage_idx').on(table.lastMessageAt),
}));

export const messages = sqliteTable('message', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text('conversationId').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderRole: text('senderRole', { enum: ['ADMIN', 'USER'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
/* ------------------------------------------------------------------ */
/* 3.  RELATIONS                                                      */
/* ------------------------------------------------------------------ */

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  etablissements: many(etablissements),
  reservations: many(reservations),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

/* ---------- établissement ---------- */
export const etablissementRelations = relations(etablissements, ({ one, many }) => ({
  user: one(user, { fields: [etablissements.userId], references: [user.id] }),
  chambres: many(chambres),
  medias: many(mediaEtablissements),
  reservations: many(reservations),
}));

/* ---------- chambre ---------- */
export const chambreRelations = relations(chambres, ({ one, many }) => ({
  etablissement: one(etablissements, { fields: [chambres.etablissementId], references: [etablissements.id] }),
  medias: many(mediaChambres),
  reservations: many(reservations),
}));

/* ---------- mediaEtablissement ---------- */
export const mediaEtablissementRelations = relations(mediaEtablissements, ({ one }) => ({
  etablissement: one(etablissements, { fields: [mediaEtablissements.etablissementId], references: [etablissements.id] }),
}));

/* ---------- mediaChambre ---------- */
export const mediaChambreRelations = relations(mediaChambres, ({ one }) => ({
  chambre: one(chambres, { fields: [mediaChambres.chambreId], references: [chambres.id] }),
}));

/* ---------- reservation ---------- */
export const reservationRelations = relations(reservations, ({ one }) => ({
  user: one(user, { fields: [reservations.userId], references: [user.id] }),
  chambre: one(chambres, { fields: [reservations.roomId], references: [chambres.id] }),
  etablissement: one(etablissements, { fields: [reservations.etablissementId], references: [etablissements.id] }),
}));

export const conversationRelations = relations(conversations, ({ one, many }) => ({
  user: one(user, { fields: [conversations.userId], references: [user.id] }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

/* ------------------------------------------------------------------ */
/* 4.  EXPORT UNIQUE                                                  */
/* ------------------------------------------------------------------ */

export const schema = {
  // tables
  user, account, session, verification,
  etablissements, chambres, mediaEtablissements, mediaChambres, reservations,
  conversations, messages,
 
  // relations
  userRelations, accountRelations, sessionRelations,
  etablissementRelations, chambreRelations,
  mediaEtablissementRelations, mediaChambreRelations,
  reservationRelations,
  conversationRelations, messageRelations,
};

/* ---------------------------------------------------------- */
/* Relations liées au SEARCH                                  */
/* ---------------------------------------------------------- */

export const reservationSearchRelations = relations(reservations, ({ one }) => ({
  user: one(user, { fields: [reservations.userId], references: [user.id] }),
  chambre: one(chambres, { fields: [reservations.roomId], references: [chambres.id] }),
  etablissement: one(etablissements, { fields: [reservations.etablissementId], references: [etablissements.id] }),
}));

export const chambreSearchRelations = relations(chambres, ({ one, many }) => ({
  etablissement: one(etablissements, { fields: [chambres.etablissementId], references: [etablissements.id] }),
  reservations: many(reservations),
  medias: many(mediaChambres),
}));

export const etablissementSearchRelations = relations(etablissements, ({ one, many }) => ({
  user: one(user, { fields: [etablissements.userId], references: [user.id] }),
  chambres: many(chambres),
  medias: many(mediaEtablissements),
  reservations: many(reservations),
}));
