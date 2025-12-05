CREATE TABLE `conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`lastMessageAt` integer NOT NULL,
	`hasUnreadMessages` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `conversation_user_unique_idx` ON `conversation` (`userId`);--> statement-breakpoint
CREATE INDEX `conversation_lastMessage_idx` ON `conversation` (`lastMessageAt`);--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`conversationId` text NOT NULL,
	`senderRole` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE cascade
);
