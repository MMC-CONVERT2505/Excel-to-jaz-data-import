import React from "react";
import { ArrowRight } from "lucide-react";

export default function SubmitBar({ ready, submitting, totalRows, moduleName, onStart }) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <div className="text-xs text-slate-500">
        {ready
          ? `Ready to migrate ${totalRows.toLocaleString()} rows into "${moduleName}".`
          : "Complete all fields above to enable migration."}
      </div>
      <button
        onClick={onStart}
        disabled={!ready || submitting}
        className="inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/30 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <ArrowRight className="h-4 w-4" />
        Start Migration
      </button>
    </div>
  );
}
