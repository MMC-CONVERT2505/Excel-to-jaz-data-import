import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ApiKeyInput({ value, onChange, disabled }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-semibold text-slate-900">Jaz API Key</label>
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Jaz API Key"
          autoComplete="off"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowKey((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-1.5 text-[11px] text-slate-400">Used only for this session, never stored in the browser.</div>
    </div>
  );
}
