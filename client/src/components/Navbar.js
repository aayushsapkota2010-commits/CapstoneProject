import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import { clearStoredUser, getStoredUser } from "../utils/session";

function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthRoute = location.pathname === "/" || location.pathname === "/signup";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAuthRoute) {
    return null;
  }

  const navLinks = user?.role === "admin"
    ? [
        { to: "/dashboard", label: "Overview" },
        { to: "/create-poll", label: "Create item" },
        { to: "/polls", label: "Results" }
      ]
    : [
        { to: "/dashboard", label: "Overview" },
        { to: "/polls", label: "Live board" }
      ];

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium transition",
      isActive
        ? "bg-slate-950 text-white shadow-soft dark:bg-brand-300 dark:text-slate-950"
        : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
    ].join(" ");

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white dark:bg-brand-300 dark:text-slate-950">
              P
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                PollWise
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Polling and surveys
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-right shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {user?.name || "Guest user"}
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {user?.role || "viewer"}
              </p>
            </div>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            <button type="button" onClick={handleLogout} className="secondary-button">
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="secondary-button ml-auto px-4 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-4 space-y-4 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 md:hidden">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {user?.name || "Guest user"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {user?.role || "viewer"}
              </p>
            </div>

            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <button type="button" onClick={handleLogout} className="secondary-button">
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
