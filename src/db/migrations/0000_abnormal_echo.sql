CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`idToken` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chambre` (
	`id` text PRIMARY KEY NOT NULL,
	`etablissementId` text NOT NULL,
	`nom` text NOT NULL,
	`description` text NOT NULL,
	`prix` real NOT NULL,
	`capacite` integer NOT NULL,
	`disponible` integer DEFAULT true NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer NOT NULL,
	`services` text,
	FOREIGN KEY (`etablissementId`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chatMessage` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionId` text NOT NULL,
	`emailHash` text NOT NULL,
	`from` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `chatSession`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chatSession` (
	`id` text PRIMARY KEY NOT NULL,
	`emailHash` text NOT NULL,
	`email` text,
	`createdAt` integer NOT NULL,
	`lastActiveAt` integer NOT NULL,
	`online` integer DEFAULT false NOT NULL,
	`unreadCount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `etablissement` (
	`id` text PRIMARY KEY NOT NULL,
	`nom` text NOT NULL,
	`adresse` text NOT NULL,
	`description` text NOT NULL,
	`longitude` text NOT NULL,
	`latitude` text NOT NULL,
	`pays` text NOT NULL,
	`ville` text NOT NULL,
	`createdAt` integer NOT NULL,
	`type` text NOT NULL,
	`services` text NOT NULL,
	`etoiles` integer,
	`contact` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mediaChambre` (
	`id` text PRIMARY KEY NOT NULL,
	`chambreId` text NOT NULL,
	`url` text NOT NULL,
	`filename` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`chambreId`) REFERENCES `chambre`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mediaEtablissement` (
	`id` text PRIMARY KEY NOT NULL,
	`etablissementId` text NOT NULL,
	`url` text NOT NULL,
	`filename` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`etablissementId`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reservation` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`roomId` text NOT NULL,
	`etablissementId` text NOT NULL,
	`dateDebut` integer NOT NULL,
	`dateFin` integer NOT NULL,
	`nombrePersonnes` integer NOT NULL,
	`prixTotal` real NOT NULL,
	`statut` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`roomId`) REFERENCES `chambre`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`etablissementId`) REFERENCES `etablissement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reservation_userId_idx` ON `reservation` (`userId`);--> statement-breakpoint
CREATE INDEX `reservation_roomId_idx` ON `reservation` (`roomId`);--> statement-breakpoint
CREATE INDEX `reservation_etablissementId_idx` ON `reservation` (`etablissementId`);--> statement-breakpoint
CREATE INDEX `reservation_statut_idx` ON `reservation` (`statut`);--> statement-breakpoint
CREATE INDEX `reservation_dateDebut_idx` ON `reservation` (`dateDebut`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`banned` integer DEFAULT false NOT NULL,
	`isAnonymous` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
