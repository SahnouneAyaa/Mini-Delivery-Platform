"use client";
import { Plus } from "lucide-react";

function ToolBar({
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterSlot,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 text-[13px] px-3 rounded-lg outline-none focus:border-orange-500"
          style={{ border: "0.5px solid rgba(0,0,0,0.12)" }}
        />
      </div>

      {filterSlot}

      {actionLabel && (
        <button
          onClick={onAction}
          className="ms-auto flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-white text-[13px] font-bold cursor-pointer whitespace-nowrap border-none"
          style={{
            background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
            boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
          }}
        >
          <Plus size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ToolBar;