import React, { useRef, useState } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { bytesToSize } from "../lib/utils";

export default function UploadCard({ file, onFileSelected, onRemoveFile, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-bold text-blue-700">02</div>
        <div>
          <h3 className="text-[15px] font-bold tracking-tight">Upload Excel File</h3>
          <div className="text-xs text-slate-500">.xlsx or .xls, parsed locally first</div>
        </div>
      </div>

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (!disabled) onFileSelected(e.dataTransfer.files?.[0]);
        }}
        className={`cursor-pointer rounded-lg border-[1.5px] border-dashed px-5 py-7 text-center transition-colors ${
          disabled ? "opacity-50 pointer-events-none" : ""
        } ${dragActive ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/50"}`}
      >
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">
          Drag &amp; drop your file, or <span className="text-blue-600 underline">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">Accepts .xlsx and .xls — up to 25 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => onFileSelected(e.target.files?.[0])}
        />
      </div>

      {file && (
        <div className="mt-3.5 flex animate-[fadeIn_0.3s_ease_both] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{file.name}</div>
            <div className="text-[11px] text-slate-500">{bytesToSize(file.size)}</div>
          </div>
          <button onClick={onRemoveFile} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
