CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`total_pages` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenge` (
	`id` integer PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`identity_name` text,
	`identity_statement` text,
	`identity_principles` text
);
--> statement-breakpoint
CREATE TABLE `days` (
	`date` text PRIMARY KEY NOT NULL,
	`tasks` text NOT NULL,
	`reflection` text DEFAULT '' NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` text NOT NULL,
	`domain` text NOT NULL,
	`event_type` text NOT NULL,
	`data` text NOT NULL,
	`metadata` text
);
--> statement-breakpoint
CREATE TABLE `spanish_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`current_level` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `speaking_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`current_level` integer DEFAULT 1 NOT NULL
);
