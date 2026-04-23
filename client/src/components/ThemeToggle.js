import React from "react";

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      type="button"
      onClick={() => setDarkMode((current) => !current)}
      className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-amber-300 dark:text-slate-900">
        {darkMode ? "L" : "D"}
      </span>
      <span>{darkMode ? "Light" : "Dark"} mode</span>
    </button>
  );
}

export default ThemeToggle;
