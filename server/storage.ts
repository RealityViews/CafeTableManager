import { tables, reservations, type Table, type InsertTable, type Reservation, type InsertReservation, type TableWithReservations } from "@shared/schema";

export interface IStorage {
  // Tables
  getTables(): Promise<Table[]>;
  getTable(id: number): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, updates: Partial<InsertTable>): Promise<Table | undefined>;
  updateTableStatus(id: number, status: "available" | "reserved" | "occupied"): Promise<Table | undefined>;
  
  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  getReservationsByDate(date: string): Promise<Reservation[]>;
  getReservationsByTable(tableId: number): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, updates: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
  
  // Combined queries
  getTablesWithReservations(date?: string): Promise<TableWithReservations[]>;
}

export class MemStorage implements IStorage {
  private tables: Map<number, Table>;
  private reservations: Map<number, Reservation>;
  private currentTableId: number;
  private currentReservationId: number;

  constructor() {
    this.tables = new Map();
    this.reservations = new Map();
    this.currentTableId = 1;
    this.currentReservationId = 1;
    
    // Initialize with default tables based on the design
    this.initializeDefaultTables();
  }

  private initializeDefaultTables() {
    const defaultTables: InsertTable[] = [
      { number: 1, capacity: 2, x: 50, y: 80, width: 60, height: 60, status: "available", shape: "round" },
      { number: 2, capacity: 2, x: 150, y: 80, width: 60, height: 60, status: "reserved", shape: "round" },
      { number: 3, capacity: 4, x: 250, y: 80, width: 80, height: 60, status: "occupied", shape: "rectangular" },
      { number: 4, capacity: 6, x: 50, y: 200, width: 100, height: 60, status: "available", shape: "rectangular" },
      { number: 5, capacity: 2, x: 200, y: 200, width: 60, height: 60, status: "reserved", shape: "round" },
      { number: 6, capacity: 4, x: 300, y: 200, width: 80, height: 60, status: "available", shape: "rectangular" },
      { number: 7, capacity: 4, x: 400, y: 200, width: 80, height: 60, status: "reserved", shape: "rectangular" },
      { number: 8, capacity: 6, x: 500, y: 150, width: 100, height: 60, status: "available", shape: "rectangular" },
      { number: 9, capacity: 6, x: 500, y: 250, width: 100, height: 60, status: "occupied", shape: "rectangular" },
      { number: 10, capacity: 2, x: 80, y: 350, width: 60, height: 60, status: "available", shape: "round" },
      { number: 11, capacity: 4, x: 180, y: 350, width: 80, height: 60, status: "reserved", shape: "rectangular" },
      { number: 12, capacity: 8, x: 450, y: 350, width: 120, height: 80, status: "reserved", shape: "rectangular" },
    ];

    defaultTables.forEach(table => {
      const newTable: Table = { ...table, id: this.currentTableId++ };
      this.tables.set(newTable.id, newTable);
    });

    // Add some sample reservations for today
    const today = new Date().toISOString().split('T')[0];
    const sampleReservations: InsertReservation[] = [
      {
        tableId: 2,
        customerName: "Иван Смирнов",
        customerPhone: "+7 (999) 123-45-67",
        guests: 4,
        date: today,
        time: "19:30",
        duration: 120,
        comment: "Окно, пожалуйста. День рождения!",
        status: "active"
      },
      {
        tableId: 3,
        customerName: "Мария Козлова",
        customerPhone: "+7 (999) 765-43-21",
        guests: 2,
        date: today,
        time: "12:15",
        duration: 90,
        comment: "",
        status: "active"
      },
      {
        tableId: 5,
        customerName: "Анна Сидорова",
        customerPhone: "+7 (999) 456-78-90",
        guests: 4,
        date: today,
        time: "19:15",
        duration: 120,
        comment: "",
        status: "active"
      }
    ];

    sampleReservations.forEach(reservation => {
      const newReservation: Reservation = { 
        ...reservation, 
        id: this.currentReservationId++,
        createdAt: new Date()
      };
      this.reservations.set(newReservation.id, newReservation);
    });
  }

  async getTables(): Promise<Table[]> {
    return Array.from(this.tables.values());
  }

  async getTable(id: number): Promise<Table | undefined> {
    return this.tables.get(id);
  }

  async createTable(table: InsertTable): Promise<Table> {
    const id = this.currentTableId++;
    const newTable: Table = { ...table, id };
    this.tables.set(id, newTable);
    return newTable;
  }

  async updateTable(id: number, updates: Partial<InsertTable>): Promise<Table | undefined> {
    const table = this.tables.get(id);
    if (!table) return undefined;
    
    const updatedTable = { ...table, ...updates };
    this.tables.set(id, updatedTable);
    return updatedTable;
  }

  async updateTableStatus(id: number, status: "available" | "reserved" | "occupied"): Promise<Table | undefined> {
    return this.updateTable(id, { status });
  }

  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.date === date
    );
  }

  async getReservationsByTable(tableId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.tableId === tableId
    );
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const newReservation: Reservation = { 
      ...reservation, 
      id,
      createdAt: new Date()
    };
    this.reservations.set(id, newReservation);
    
    // Update table status to reserved
    await this.updateTableStatus(reservation.tableId, "reserved");
    
    return newReservation;
  }

  async updateReservation(id: number, updates: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, ...updates };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    const reservation = this.reservations.get(id);
    if (!reservation) return false;
    
    this.reservations.delete(id);
    
    // Check if table has any other active reservations today
    const today = new Date().toISOString().split('T')[0];
    const tableReservations = await this.getReservationsByTable(reservation.tableId);
    const todayActiveReservations = tableReservations.filter(
      r => r.date === today && r.status === "active"
    );
    
    // If no active reservations, set table to available
    if (todayActiveReservations.length === 0) {
      await this.updateTableStatus(reservation.tableId, "available");
    }
    
    return true;
  }

  async getTablesWithReservations(date?: string): Promise<TableWithReservations[]> {
    const allTables = await this.getTables();
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const tablesWithReservations: TableWithReservations[] = [];
    
    for (const table of allTables) {
      const tableReservations = await this.getReservationsByTable(table.id);
      const todayReservations = tableReservations.filter(r => r.date === targetDate);
      const currentReservation = todayReservations.find(r => r.status === "active");
      
      tablesWithReservations.push({
        ...table,
        currentReservation,
        todayReservations
      });
    }
    
    return tablesWithReservations;
  }
}

export const storage = new MemStorage();
