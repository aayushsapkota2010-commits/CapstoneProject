import React from "react";

function StatCard({ label, value, caption }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-panel dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      {caption ? (
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export default StatCard;
