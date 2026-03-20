import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  domain: text('domain').notNull(),
  eventType: text('event_type').notNull(),
  data: text('data').notNull(),        // JSON stored as string
  metadata: text('metadata'),           // JSON stored as string
});

export const days = sqliteTable('days', {
  date: text('date').primaryKey(),
  tasks: text('tasks').notNull(),       // JSON string
  reflection: text('reflection').notNull().default(''),
  completed: integer('completed', { mode: 'boolean' })
    .notNull()
    .default(false),
});

export const challenge = sqliteTable('challenge', {
  id: integer('id').primaryKey(),
  startDate: text('start_date').notNull(),
  identityName: text('identity_name'),
  identityStatement: text('identity_statement'),
  identityPrinciples: text('identity_principles'),
});

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  totalPages: integer('total_pages').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const spanishState = sqliteTable('spanish_state', {
  id: integer('id').primaryKey(),
  currentLevel: integer('current_level').notNull().default(1),
});

export const speakingState = sqliteTable('speaking_state', {
  id: integer('id').primaryKey(),
  currentLevel: integer('current_level').notNull().default(29),
});
