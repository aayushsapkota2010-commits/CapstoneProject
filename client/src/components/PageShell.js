import React from "react";

function PageShell({ eyebrow, title, description, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/80 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <div className="relative border-b border-slate-200/70 px-6 py-8 dark:border-slate-800 sm:px-8 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_50%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.12),_transparent_44%)]" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative max-w-3xl space-y-4">
              {eyebrow ? (
                <p className="section-kicker">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-[2.65rem]">
                {title}
              </h1>
              {description ? (
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="relative flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
        <div className="px-6 py-8 sm:px-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}

export default PageShell;
