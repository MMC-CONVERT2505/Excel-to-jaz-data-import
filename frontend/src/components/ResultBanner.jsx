import React from "react";
import { CheckCircle2, Timer, XCircle } from "lucide-react";

const TONE_CLASSES = {
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-orange-50 border-orange-200 text-orange-800",
  error: "bg-red-50 border-red-200 text-red-800",
};
const ICON_TONE_CLASSES = {
  success: "text-green-700",
  warning: "text-orange-700",
  error: "text-red-700",
};

export default function ResultBanner({ result }) {
  let tone, Icon, title, text;

  console.log("result", result)


  if (result.failedCount === 0) {
    tone = "success";
    Icon = CheckCircle2;
    title = "Migration completed successfully";
    text = `All ${result?.total?.toLocaleString()} records were imported into Jaz with no errors.`;
  } else if (result.successCount === 0) {
    tone = "error";
    Icon = XCircle;
    title = "Migration failed";
    text = `None of the ${result?.total?.toLocaleString()} records could be imported. Review the errors below.`;
  } else {
    tone = "warning";
    Icon = Timer;
    title = "Migration completed with some errors";
    text = `${result?.success?.toLocaleString()} of ${result?.total?.toLocaleString()} records imported. ${result?.failed?.toLocaleString()} need attention.`;
  }

  return (
    <div className={`flex animate-[fadeIn_0.4s_ease_both] items-center gap-3.5 rounded-xl border px-5 py-4 ${TONE_CLASSES[tone]}`}>
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/60">
        <Icon className={`h-5 w-5 ${ICON_TONE_CLASSES[tone]}`} />
      </div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-xs">{text}</p>
      </div>
    </div>
  );
}
