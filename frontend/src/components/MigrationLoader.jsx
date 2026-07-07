import React from "react";
import { Loader2 } from "lucide-react";

export default function MigrationLoader({ progress }) {
  const stageIdx = Math.min(3, Math.floor(progress.pct / 25));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-9 text-center shadow-2xl">
        <Loader2 className="mx-auto mb-4.5 h-9 w-9 animate-spin text-blue-600" />
        <h3 className="mb-1.5 text-lg font-bold">Migration in Progress…</h3>
        <p className="mb-6 text-[13px] text-slate-500">
          {progress.pct < 100 ? "Sending records to Jaz, please keep this tab open." : "Finalizing and verifying results…"}
        </p>

        {/* pipeline */}
        <div className="mb-6 flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`h-3 w-3 rounded-full transition-colors ${
                  i < stageIdx
                    ? "bg-green-600"
                    : i === stageIdx
                    ? "bg-blue-600 ring-4 ring-blue-100 animate-[pulseDot_1.1s_infinite]"
                    : "bg-slate-200"
                }`}
              />
              {i < 3 && <div className={`h-0.5 w-8 ${i < stageIdx ? "bg-blue-600" : "bg-slate-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="mb-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-slate-500">
          <span>
            <b className="text-slate-900">{progress.processed.toLocaleString()}</b> / {progress.total.toLocaleString()} records
          </span>
          <span>
            <b className="text-slate-900">{progress.pct}%</b>
          </span>
        </div>
      </div>
    </div>
  );
}
