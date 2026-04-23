import React from "react";

function FormField({
  label,
  error,
  as = "input",
  className = "",
  ...props
}) {
  const Element = as;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <Element
        className={[
          "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:shadow-soft dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-300",
          className
        ].join(" ")}
        {...props}
      />
      {error ? (
        <p className="text-sm text-rose-500" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}

export default FormField;
