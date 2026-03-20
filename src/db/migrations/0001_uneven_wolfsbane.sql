PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_speaking_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`current_level` integer DEFAULT 29 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_speaking_state`("id", "current_level") SELECT "id", "current_level" FROM `speaking_state`;--> statement-breakpoint
DROP TABLE `speaking_state`;--> statement-breakpoint
ALTER TABLE `__new_speaking_state` RENAME TO `speaking_state`;--> statement-breakpoint
PRAGMA foreign_keys=ON;