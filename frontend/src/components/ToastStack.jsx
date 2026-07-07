import React from "react";

export default function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex min-w-[220px] items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl animate-[toastIn_0.25s_ease]"
        >
          <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${t.type === "error" ? "bg-red-400" : "bg-green-400"}`} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
