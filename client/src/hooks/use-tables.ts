import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Table, TableWithReservations, InsertTable } from "@shared/schema";

export function useTables(date?: string) {
  return useQuery<TableWithReservations[]>({
    queryKey: ["/api/tables", date],
    queryFn: async () => {
      const url = date ? `/api/tables?date=${date}` : "/api/tables";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }
      return response.json();
    },
  });
}

export function useTable(id: number) {
  return useQuery<Table>({
    queryKey: ["/api/tables", id],
    enabled: !!id,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (table: InsertTable) => {
      const response = await apiRequest("POST", "/api/tables", table);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertTable> }) => {
      const response = await apiRequest("PATCH", `/api/tables/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "available" | "reserved" | "occupied" }) => {
      const response = await apiRequest("PATCH", `/api/tables/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}
