import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Table schemas
export const tableSchema = z.object({
  id: z.string(),
  number: z.number(),
  capacity: z.number(),
  isAvailable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTableSchema = z.object({
  number: z.number(),
  capacity: z.number(),
  hallId: z.string(),
});

// Reservation schemas
export const reservationSchema = z.object({
  id: z.string(),
  tableId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createReservationSchema = z.object({
  tableId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
});

// Types
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Table = z.infer<typeof tableSchema>;
export type CreateTable = z.infer<typeof createTableSchema>;

export type Reservation = z.infer<typeof reservationSchema>;
export type CreateReservation = z.infer<typeof createReservationSchema>;
