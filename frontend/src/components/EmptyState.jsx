import React from "react";
import { FileSpreadsheet } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center px-5 py-9 text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <FileSpreadsheet className="h-10 w-10 text-blue-300" />
        </div>
        <h3 className="mb-1.5 text-base font-bold">Upload an Excel file to begin migration.</h3>
        <p className="max-w-sm text-sm text-slate-500">Once a workbook is added, we'll show row counts and reference totals here.</p>
      </div>
    </div>
  );
}
