import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { TableWithReservations } from "@shared/schema";

interface DraggableTableProps {
  table: TableWithReservations;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (table: TableWithReservations) => void;
  onDoubleClick?: (table: TableWithReservations) => void;
  onMove: (table: TableWithReservations, x: number, y: number) => void;
  onResize: (table: TableWithReservations, width: number, height: number) => void;
}

export function DraggableTable({ 
  table, 
  isSelected, 
  isEditMode, 
  onSelect, 
  onDoubleClick, 
  onMove, 
  onResize 
}: DraggableTableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const tableRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, tableX: 0, tableY: 0, width: 0, height: 0 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600";
      case "reserved":
        return "bg-amber-500 hover:bg-amber-600";
      case "occupied":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getTableShape = (shape: string) => {
    switch (shape) {
      case "round":
        return "rounded-full";
      case "square":
        return "rounded-lg";
      case "rectangular":
        return "rounded-lg";
      default:
        return "rounded-lg";
    }
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isEditMode) {
      onSelect(table);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    const rect = tableRef.current?.getBoundingClientRect();
    if (!rect) return;

    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains('resize-handle');
    
    if (isResizeHandle) {
      setIsResizing(true);
      setResizeHandle(target.dataset.handle || "");
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        tableX: table.x,
        tableY: table.y,
        width: table.width,
        height: table.height
      };
    } else {
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        tableX: table.x,
        tableY: table.y,
        width: table.width,
        height: table.height
      };
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [isEditMode, table, onSelect]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    if (isDragging) {
      const newX = Math.max(0, startPosRef.current.tableX + deltaX);
      const newY = Math.max(0, startPosRef.current.tableY + deltaY);
      onMove(table, newX, newY);
    } else if (isResizing) {
      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;

      switch (resizeHandle) {
        case "se":
          newWidth = Math.max(40, startPosRef.current.width + deltaX);
          newHeight = Math.max(40, startPosRef.current.height + deltaY);
          break;
        case "e":
          newWidth = Math.max(40, startPosRef.current.width + deltaX);
          break;
        case "s":
          newHeight = Math.max(40, startPosRef.current.height + deltaY);
          break;
      }

      onResize(table, newWidth, newHeight);
    }
  }, [isDragging, isResizing, resizeHandle, table, onMove, onResize]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
    
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const handleClick = () => {
    if (!isEditMode) {
      onSelect(table);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditMode && onDoubleClick) {
      onDoubleClick(table);
    }
  };

  return (
    <div
      ref={tableRef}
      className={cn(
        "absolute select-none touch-none",
        isEditMode ? "cursor-move" : "cursor-pointer",
        isDragging && "z-50",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Main table */}
      <div
        className={cn(
          "w-full h-full flex items-center justify-center text-white font-semibold shadow-lg transition-colors relative",
          getTableShape(table.shape),
          getStatusColor(table.status),
          isEditMode && "border-2 border-dashed border-white/50"
        )}
      >
        <div className="text-center">
          <div className="text-sm">{table.number}</div>
          {table.name && (
            <div className="text-xs opacity-90">{table.name}</div>
          )}
        </div>

        {/* Resize handles */}
        {isEditMode && isSelected && (
          <>
            {/* Southeast corner handle */}
            <div
              className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize z-10"
              data-handle="se"
              onPointerDown={(e) => e.stopPropagation()}
            />
            {/* East handle */}
            <div
              className="resize-handle absolute top-1/2 -right-1 w-3 h-6 bg-blue-500 border border-white rounded-sm cursor-e-resize transform -translate-y-1/2 z-10"
              data-handle="e"
              onPointerDown={(e) => e.stopPropagation()}
            />
            {/* South handle */}
            <div
              className="resize-handle absolute -bottom-1 left-1/2 w-6 h-3 bg-blue-500 border border-white rounded-sm cursor-s-resize transform -translate-x-1/2 z-10"
              data-handle="s"
              onPointerDown={(e) => e.stopPropagation()}
            />
          </>
        )}
      </div>

      {/* Capacity indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center text-gray-600 whitespace-nowrap">
        {table.capacity} {table.capacity === 1 ? "место" : table.capacity <= 4 ? "места" : "мест"}
      </div>
    </div>
  );
}