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
CREATE INDEX `reservation_userId_idx` ON `reservation` (`userId`);--> statement-breakpoint
CREATE INDEX `reservation_roomId_idx` ON `reservation` (`roomId`);--> statement-breakpoint
CREATE INDEX `reservation_etablissementId_idx` ON `reservation` (`etablissementId`);--> statement-breakpoint
CREATE INDEX `reservation_statut_idx` ON `reservation` (`statut`);--> statement-breakpoint
CREATE INDEX `reservation_dateDebut_idx` ON `reservation` (`dateDebut`);