import React from "react";
import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

function AuthLayout({
  eyebrow,
  title,
  description,
  asideTitle,
  asideCopy,
  darkMode,
  setDarkMode,
  children
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.2),_transparent_30%),linear-gradient(160deg,#f8fbff_0%,#eef4ff_45%,#fff7ed_100%)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.16),_transparent_25%),linear-gradient(160deg,#020617_0%,#0f172a_48%,#111827_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl justify-end">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-panel dark:border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.22),_transparent_28%)]" />
          <div className="relative space-y-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.28em] text-sky-200 uppercase"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">
                P
              </span>
              PollWise
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">
                {eyebrow}
              </p>
              <h1 className="max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">
                {asideTitle}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                {asideCopy}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Live signals", "Track real-time participation without clutter."],
                ["Role aware", "Admins and students get focused workflows."],
                ["Modern polish", "Stronger hierarchy, motion, and readability."]
              ].map(([label, copy]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-brand-300">
                {eyebrow}
              </p>
              <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
