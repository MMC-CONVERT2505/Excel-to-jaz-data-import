import React from "react";
import { Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold tracking-tight">Excel to Jaz Migration Tool</h1>
            <p className="text-xs font-medium text-slate-500">Bulk reference data import &amp; reconciliation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 ring-4 ring-green-100" />
          Backend reachable
        </div>
      </div>
    </header>
  );
}
