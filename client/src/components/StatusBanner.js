import React from "react";

const toneClasses = {
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/80 dark:bg-rose-950/40 dark:text-rose-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-200",
  info:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/80 dark:bg-sky-950/40 dark:text-sky-200"
};

function StatusBanner({ tone = "info", message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone]}`}
      role="status"
    >
      {message}
    </div>
  );
}

export default StatusBanner;
