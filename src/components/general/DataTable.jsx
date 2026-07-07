"use client";
import { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const DataTable = ({
  title,
  rows = [],
  columns,
  badge,
  onView,
  headerRight,
  filterBar,
  emptyText = "Aucun résultat",
  loadingText = "Chargement...",
  loading = false,
  paginate = true,
}) => {
  const [page, setPage] = useState(1);

  const safeRows = rows ?? [];
  const totalPages = Math.max(1, Math.ceil(safeRows.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [rows]);

  const safePage = Math.min(page, totalPages);
  const paged = paginate
    ? safeRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : safeRows;

  const showActions = Boolean(onView);
  const colCount = columns.length + (showActions ? 1 : 0);

  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ border: "0.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-md font-bold text-[#1a1a1a]">{title}</h2>
        {headerRight || (
          <span className="text-sm text-[#888] bg-[#f5f5f5] px-2.5 py-1 rounded-lg">
            {badge}
          </span>
        )}
      </div>

      {filterBar && <div className="mb-6">{filterBar}</div>}

      <div className="w-full overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-start text-[13px] font-semibold text-gray-600 uppercase tracking-wide pb-3 px-2"
                >
                  {col.label}
                </th>
              ))}
              {showActions && (
                <th className="text-start text-[13px] font-semibold text-gray-600 uppercase tracking-wide pb-3 px-2">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colCount} className="py-14 text-center">
                  <span className="text-[13px] font-medium text-slate-400">{loadingText}</span>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="text-center text-[#aaa] py-10 text-[13px]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr
                  key={row.id || row._id || idx}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-2">
                      {col.render(row)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="py-3 px-2">
                      <button
                        onClick={() => onView(row)}
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginate && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)" }}>
          <span className="text-[12px] text-gray-400">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, safeRows.length)} / {safeRows.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              style={{ color: safePage === 1 ? "#ccc" : "#EA580C" }}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={`page-${n}`}
                onClick={() => setPage(n)}
                className="w-7 h-7 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-colors"
                style={
                  n === safePage
                    ? { background: "#EA580C", color: "#fff" }
                    : { background: "transparent", color: "#888" }
                }
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              style={{ color: safePage === totalPages ? "#ccc" : "#EA580C" }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;