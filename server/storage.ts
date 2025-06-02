import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import type { Reservation } from '@shared/schema';
import { SQL } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Helper functions for database operations
export async function createUser(username: string, email: string, password: string) {
  const [user] = await db
    .insert(schema.users)
    .values({
      username,
      email,
      password,
    })
    .returning();
  return user;
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
}

export async function createTable(number: number, capacity: number, hallId: string) {
  const [table] = await db
    .insert(schema.tables)
    .values({
      number,
      capacity,
      hallId,
    })
    .returning();
  return table;
}

export async function getTables() {
  return db.query.tables.findMany();
}

export async function updateTableAvailability(id: string, isAvailable: boolean) {
  const [table] = await db
    .update(schema.tables)
    .set({ isAvailable })
    .where(eq(schema.tables.id, id))
    .returning();
  return table;
}

export async function createReservation(
  tableId: string,
  userId: string,
  customerName: string,
  customerPhone: string,
  startTime: Date,
  endTime: Date
) {
  const [reservation] = await db
    .insert(schema.reservations)
    .values({
      tableId,
      userId,
      customerName,
      customerPhone,
      startTime,
      endTime,
    })
    .returning();
  return reservation;
}

export async function getReservations(userId?: string) {
  if (userId) {
    return db.query.reservations.findMany({
      where: (reservations, { eq }) => eq(reservations.userId, userId),
      with: {
        table: true,
      },
    });
  }
  return db.query.reservations.findMany({
    with: {
      table: true,
    },
  });
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  const [reservation] = await db
    .update(schema.reservations)
    .set({ status })
    .where(eq(schema.reservations.id, id))
    .returning();
  return reservation;
}

export async function getTablesWithReservations(date: string) {
  const tables = await db.query.tables.findMany({
    columns: {
      id: true,
      number: true,
      capacity: true,
      isAvailable: true,
      hallId: true,
      createdAt: true,
      updatedAt: true
    },
    with: {
      reservations: {
        where: (reservations: any, { eq }: { eq: any }) => eq(reservations.startTime, new Date(date))
      }
    }
  });
  return tables;
}

export async function getTable(id: number) {
  return db.query.tables.findFirst({
    where: (tables, { eq }) => eq(tables.id, id.toString())
  });
}

export async function updateTable(id: number, updates: any) {
  const [table] = await db
    .update(schema.tables)
    .set(updates)
    .where(eq(schema.tables.id, id.toString()))
    .returning();
  return table;
}

export async function updateTableStatus(id: number, status: string) {
  const [table] = await db
    .update(schema.tables)
    .set({ isAvailable: status === 'available' })
    .where(eq(schema.tables.id, id.toString()))
    .returning();
  return table;
}

export async function getReservationsByDate(date: string) {
  return db.query.reservations.findMany({
    where: (reservations, { eq }) => eq(reservations.startTime, new Date(date))
  });
}

export async function getReservationsByTable(tableId: string) {
  return db.query.reservations.findMany({
    where: (fields, { eq }) => eq(fields.tableId, tableId)
  });
}

export async function getReservation(id: number) {
  return db.query.reservations.findFirst({
    where: (reservations, { eq }) => eq(reservations.id, id.toString())
  });
}

export async function updateReservation(id: number, updates: any) {
  const [reservation] = await db
    .update(schema.reservations)
    .set(updates)
    .where(eq(schema.reservations.id, id.toString()))
    .returning();
  return reservation;
}

export async function deleteReservation(id: number) {
  const [reservation] = await db
    .delete(schema.reservations)
    .where(eq(schema.reservations.id, id.toString()))
    .returning();
  return !!reservation;
}

export const storage = {
  createUser,
  findUserByEmail,
  createTable,
  getTables,
  updateTableAvailability,
  createReservation,
  getReservations,
  updateReservationStatus,
  getTablesWithReservations,
  getTable,
  updateTable,
  updateTableStatus,
  getReservationsByDate,
  getReservationsByTable,
  getReservation,
  updateReservation,
  deleteReservation
};
