"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

export interface Column<T extends object> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
}

export default function DataTable<T extends object>({ columns, data, pageSize = 8, searchable = true }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = data;
    if (q) {
      out = out.filter(row => Object.values(row as Record<string, unknown>).some(v => String(v).toLowerCase().includes(q)));
    }
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey as string] as string | number | boolean;
        const bv = (b as Record<string, unknown>)[sortKey as string] as string | number | boolean;
        if (av === bv) return 0;
        if (sortDir === "asc") return String(av) > String(bv) ? 1 : -1;
        return String(av) < String(bv) ? 1 : -1;
      });
    }
    return out;
  }, [data, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-2 flex items-center">
          <div className="relative w-full max-w-xs">
            <Icon icon="mdi:magnify" width={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search…" className="pl-7 pr-2 py-1.5 text-sm rounded-md border border-neutral-200/70 bg-white/80 w-full" />
          </div>
        </div>
      )}
      <div className="overflow-auto border border-neutral-200/70 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map(col => (
                <th key={String(col.key)} className="text-left font-normal px-3 py-2 border-b border-neutral-200/70">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => {
                    if (sortKey === col.key) setSortDir(d => d === "asc" ? "desc" : "asc");
                    setSortKey(col.key);
                  }}>
                    <span>{col.header}</span>
                    {sortKey === col.key && <Icon icon={sortDir === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"} width={14} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-neutral-50/60">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-3 py-2 border-b border-neutral-200/60">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-neutral-500">Page {page} of {totalPages}</p>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs rounded border border-neutral-200/70" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <button className="px-2 py-1 text-xs rounded border border-neutral-200/70" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
