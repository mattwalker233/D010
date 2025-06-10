import { sql } from '@vercel/postgres';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const entities = pgTable('entities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  taxId: text('tax_id').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert; 