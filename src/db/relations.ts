import { relations } from 'drizzle-orm';
import {
  etablissements, chambres, mediaEtablissements, mediaChambres,
  user, session, reservations, verification,
} from './schema';

export const etablissementRelations = relations(etablissements, ({ many }) => ({
  chambres: many(chambres),
  imagesEtab: many(mediaEtablissements),
  reservations: many(reservations),
}));

export const chambreRelations = relations(chambres, ({ one, many }) => ({
  etablissement: one(etablissements, {
    fields: [chambres.etablissementId],
    references: [etablissements.id],
  }),
  imagesChambre: many(mediaChambres),
  reservations: many(reservations),
}));

export const etablissementImageRelations = relations(mediaEtablissements, ({ one }) => ({
  etablissement: one(etablissements, {
    fields: [mediaEtablissements.etablissementId],    
    references: [etablissements.id],
  }),
}));

export const chambreImageRelations = relations(mediaChambres, ({ one }) => ({
  chambre: one(chambres, {
    fields: [mediaChambres.chambreId],
    references: [chambres.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  reservations: many(reservations),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const reservationRelations = relations(reservations, ({ one }) => ({
  user: one(user, {
    fields: [reservations.userId],
    references: [user.id],
  }),
  room: one(chambres, {
    fields: [reservations.roomId],
    references: [chambres.id],
  }),
  etablissement: one(etablissements, {
    fields: [reservations.etablissementId],
    references: [etablissements.id],
  }),
}));