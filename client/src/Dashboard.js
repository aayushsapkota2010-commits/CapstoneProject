import React from "react";
import { useNavigate } from "react-router-dom";

import PageShell from "./components/PageShell";
import StatCard from "./components/StatCard";
import { getStoredUser } from "./utils/session";

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const quickActions = isAdmin
    ? [
        {
          title: "Create a new poll or survey",
          copy: "Start from the shared builder and publish a question in a couple of steps.",
          cta: "Open builder",
          onClick: () => navigate("/create-poll")
        },
        {
          title: "Review response analytics",
          copy: "Track live momentum, compare options, and inspect survey activity in one board.",
          cta: "Open live board",
          onClick: () => navigate("/polls")
        }
      ]
    : [
        {
          title: "Respond to live items",
          copy: "Vote on quick polls or complete a richer survey without hunting around the app.",
          cta: "Go to board",
          onClick: () => navigate("/polls")
        },
        {
          title: "See what is trending",
          copy: "Check which options are leading and how the latest responses are moving.",
          cta: "View results",
          onClick: () => navigate("/polls")
        }
      ];

  const checklist = isAdmin
    ? [
        "Publish one focused question at a time.",
        "Use surveys when you need comments, not just counts.",
        "Check the live board after launch to confirm responses are coming in."
      ]
    : [
        "Open the live board for everything active right now.",
        "Use surveys when you want to add a comment with your response.",
        "Return to results to see how group sentiment is shifting."
      ];

  return (
    <PageShell
      eyebrow={isAdmin ? "Admin workspace" : "Student workspace"}
      title={`Welcome back, ${user?.name || "PollWise user"}`}
      description={
        isAdmin
          ? "The workspace is now more action-led: create feedback items faster, monitor responses more clearly, and move through the platform with less friction."
          : "The experience is now more direct: jump straight into live participation, understand what needs your attention, and read results with less noise."
      }
      actions={
        <>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate(isAdmin ? "/create-poll" : "/polls")}
          >
            {isAdmin ? "Create item" : "Open live board"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/polls")}
          >
            View results
          </button>
        </>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Current role"
            value={isAdmin ? "Admin" : "Student"}
            caption="Navigation and calls to action adapt to the work you are most likely to do next."
          />
          <StatCard
            label="Fastest next step"
            value={isAdmin ? "Publish" : "Participate"}
            caption={
              isAdmin
                ? "Jump into the builder and launch a poll or survey quickly."
                : "Open the live board to respond without extra clicks."
            }
          />
          <StatCard
            label="Experience focus"
            value="Clarity"
            caption="Cleaner structure, stronger prompts, and better mobile navigation across the app."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="panel-card overflow-hidden">
            <div className="border-b border-slate-200/80 px-6 py-6 dark:border-slate-800">
              <p className="section-kicker">Quick start</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                The app now points you toward the next useful action
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Instead of generic dashboard copy, the overview now emphasizes what you can do immediately and where to go next.
              </p>
            </div>

            <div className="grid gap-4 p-6">
              {quickActions.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.onClick}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-panel dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <span className="surface-chip">Step 0{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-brand-300 dark:text-slate-950">
                      {item.cta}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel-card bg-slate-950 text-white dark:bg-slate-900">
              <div className="space-y-5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Why it feels better
                </p>
                <h2 className="text-2xl font-semibold">
                  Less explanation, more direction
                </h2>
                <div className="grid gap-3">
                  {[
                    "The primary actions are surfaced immediately in the header.",
                    "Cards are organized around outcomes, not just decorative copy.",
                    "The navigation now works better on small screens too."
                  ].map((point) => (
                    <div
                      key={point}
                      className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-card p-6">
              <p className="section-kicker">Recommended flow</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                Use this path for the smoothest experience
              </h2>
              <div className="mt-5 space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default Dashboard;
