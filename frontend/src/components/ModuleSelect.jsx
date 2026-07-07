import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export default function ModuleSelect({ modules, moduleId, moduleName, onSelect, onClearSelection, disabled }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = useMemo(
    () => modules.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [modules, query]
  );

  return (
    <div ref={ref}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-900">Select Module</label>
      <div className="relative">
        <input
          type="text"
          value={open ? query : moduleName}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            onClearSelection();
          }}
          placeholder="Search and select a module…"
          autoComplete="off"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
        />
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        {open && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
            {modules.length === 0 ? (
              <div className="flex items-center gap-2 p-3.5 text-sm text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading modules from Jaz…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-3.5 text-center text-sm text-slate-500">No modules match "{query}"</div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelect(m);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-sm hover:bg-blue-50"
                >
                  <span>{m.name}</span>
                  <span className="font-mono text-[11px] text-slate-400">{m.id}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="mt-1.5 text-[11px] text-slate-400">
        {modules.length ? `${modules.length} modules available in this workspace.` : "Modules are fetched live from your Jaz workspace."}
      </div>
    </div>
  );
}
