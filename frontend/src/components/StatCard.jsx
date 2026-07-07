import React from "react";

const COLORS = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  orange: "bg-orange-50 text-orange-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function StatCard({ color = "blue", icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-[fadeIn_0.4s_ease_both]">
      <div className={`mb-2.5 flex h-7 w-7 items-center justify-center rounded-lg ${COLORS[color]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-mono text-[17px] font-bold tracking-tight text-slate-900 truncate">{value}</div>
    </div>
  );
}
