import React from "react";

export default function PageIntro() {
  return (
    <div className="mb-7">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-blue-600">Step 01 — 03</div>
      <h2 className="mb-1.5 text-2xl font-bold tracking-tight">Migrate your Excel data into Jaz</h2>
      <p className="max-w-xl text-sm text-slate-500">
        Authenticate, choose a target module, and upload a workbook. We validate it locally before anything is sent to the server.
      </p>
    </div>
  );
}
