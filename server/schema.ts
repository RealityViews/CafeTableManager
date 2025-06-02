import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tables = pgTable('tables', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  number: integer('number').notNull().unique(),
  capacity: integer('capacity').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  hallId: text('hall_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const reservations = pgTable('reservations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tableId: text('table_id')
    .notNull()
    .references(() => tables.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled', 'active'] })
    .default('pending')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 