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
  hallId: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  status: z.enum(['available', 'reserved', 'occupied']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const hallSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Reservation schemas
export const reservationSchema = z.object({
  id: z.string(),
  tableId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  guests: z.number(),
  date: z.date(),
  time: z.string(),
  duration: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  comment: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createTableSchema = tableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createHallSchema = hallSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createReservationSchema = reservationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateTableSchema = createTableSchema.partial();
export const updateHallSchema = createHallSchema.partial();
export const updateReservationSchema = createReservationSchema.partial();

// Types
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Table = z.infer<typeof tableSchema>;
export type Hall = z.infer<typeof hallSchema>;
export type Reservation = z.infer<typeof reservationSchema>;
export type CreateTable = z.infer<typeof createTableSchema>;
export type CreateHall = z.infer<typeof createHallSchema>;
export type CreateReservation = z.infer<typeof createReservationSchema>;
export type UpdateTable = z.infer<typeof updateTableSchema>;
export type UpdateHall = z.infer<typeof updateHallSchema>;
export type UpdateReservation = z.infer<typeof updateReservationSchema>;

export type TableWithReservations = Table & {
  reservations: Reservation[]
};

export type ReservationWithTable = Reservation & {
  table: Table
};

export type InsertTable = CreateTable;
export type InsertReservation = CreateReservation;

// Transform functions for date fields
export const transformDate = (str: string) => new Date(str);
export const transformTime = (str: string) => str;
