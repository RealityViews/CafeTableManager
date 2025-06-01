import { useState } from "react";
import { StatsCards } from "@/components/stats-cards";
import { FloorPlan } from "@/components/floor-plan";
import { Sidebar } from "@/components/sidebar";
import { ReservationModal } from "@/components/reservation-modal";
import { TableDetailModal } from "@/components/table-detail-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TableWithReservations } from "@shared/schema";
import { Utensils, Search, Plus, Calendar, Bell, User } from "lucide-react";

export default function Dashboard() {
  const [selectedTable, setSelectedTable] = useState<TableWithReservations | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [tableDetailModalOpen, setTableDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleTableSelect = (table: TableWithReservations) => {
    setSelectedTable(table);
  };

  const handleTableDetails = (table: TableWithReservations) => {
    setSelectedTable(table);
    setTableDetailModalOpen(true);
  };

  const handleNewReservation = () => {
    setReservationModalOpen(true);
  };

  const handleReserveTable = (table: TableWithReservations) => {
    setSelectedTable(table);
    setReservationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Utensils className="text-blue-600 text-xl" />
                <h1 className="text-xl font-bold text-gray-900">CafeAdmin</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button className="px-3 py-1.5 text-sm font-medium bg-white text-blue-600 rounded-md shadow-sm">
                  План зала
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Календарь
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Отчеты
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Администратор</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards />

        {/* Controls Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск брони или гостя..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все столы</SelectItem>
                  <SelectItem value="available">Только свободные</SelectItem>
                  <SelectItem value="reserved">Только забронированные</SelectItem>
                  <SelectItem value="occupied">Только занятые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Календарь
              </Button>
              <Button onClick={handleNewReservation}>
                <Plus className="h-4 w-4 mr-2" />
                Новая бронь
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FloorPlan
            onTableSelect={handleTableSelect}
            onTableDetails={handleTableDetails}
            selectedTable={selectedTable}
          />
          
          <Sidebar
            selectedTable={selectedTable}
            onNewReservation={handleNewReservation}
            onReserveTable={handleReserveTable}
          />
        </div>
      </div>

      {/* Modals */}
      <ReservationModal
        open={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        selectedTable={selectedTable}
      />

      <TableDetailModal
        open={tableDetailModalOpen}
        onClose={() => setTableDetailModalOpen(false)}
        table={selectedTable}
      />
    </div>
  );
}
