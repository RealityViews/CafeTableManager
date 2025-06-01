import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  capacity: integer("capacity").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  status: text("status", { enum: ["available", "reserved", "occupied"] }).notNull().default("available"),
  shape: text("shape", { enum: ["round", "square", "rectangular"] }).notNull().default("round"),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  guests: integer("guests").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull().default(120), // minutes
  comment: text("comment"),
  status: text("status", { enum: ["active", "completed", "cancelled"] }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export type InsertTable = z.infer<typeof insertTableSchema>;
export type Table = typeof tables.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

// Extended types for frontend
export type TableWithReservations = Table & {
  currentReservation?: Reservation;
  todayReservations?: Reservation[];
};
