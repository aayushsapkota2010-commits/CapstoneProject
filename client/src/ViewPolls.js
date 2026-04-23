import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";

import FormField from "./components/FormField";
import PageShell from "./components/PageShell";
import StatCard from "./components/StatCard";
import StatusBanner from "./components/StatusBanner";
import api from "./lib/api";
import { getStoredUser } from "./utils/session";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ViewPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [activeVoteId, setActiveVoteId] = useState("");
  const [surveyDrafts, setSurveyDrafts] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const user = getStoredUser();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setStatus({ tone: "info", message: "" });
      const response = await api.get("/poll");
      setPolls(response.data);
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to fetch items right now."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSurveyDraft = (pollId, updater) => {
    setSurveyDrafts((current) => ({
      ...current,
      [pollId]: updater(current[pollId] || { selectedOptionIndexes: [], textResponse: "" })
    }));
  };

  const toggleSurveyOption = (poll, index) => {
    updateSurveyDraft(poll._id, (draft) => {
      const selectedIndexes = draft.selectedOptionIndexes || [];

      if (!poll.allowMultipleSelections) {
        return {
          ...draft,
          selectedOptionIndexes: selectedIndexes.includes(index) ? [] : [index]
        };
      }

      return {
        ...draft,
        selectedOptionIndexes: selectedIndexes.includes(index)
          ? selectedIndexes.filter((value) => value !== index)
          : [...selectedIndexes, index]
      };
    });
  };

  const updateSurveyComment = (pollId, value) => {
    updateSurveyDraft(pollId, (draft) => ({
      ...draft,
      textResponse: value
    }));
  };

  const handleVote = async (pollId, index) => {
    try {
      setActiveVoteId(pollId);
      const response = await api.post("/poll/vote", {
        pollId,
        optionIndex: index,
        userEmail: user?.email
      });

      setStatus({ tone: "success", message: response.data.message });
      await fetchPolls();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to register your vote."
      });
    } finally {
      setActiveVoteId("");
    }
  };

  const handleSurveySubmit = async (poll) => {
    const draft = surveyDrafts[poll._id] || { selectedOptionIndexes: [], textResponse: "" };

    try {
      setActiveVoteId(poll._id);
      const response = await api.post("/poll/survey/respond", {
        pollId: poll._id,
        selectedOptionIndexes: draft.selectedOptionIndexes || [],
        textResponse: draft.textResponse || "",
        userEmail: user?.email
      });

      setStatus({ tone: "success", message: response.data.message });
      setSurveyDrafts((current) => ({
        ...current,
        [poll._id]: { selectedOptionIndexes: [], textResponse: "" }
      }));
      await fetchPolls();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to submit survey response."
      });
    } finally {
      setActiveVoteId("");
    }
  };

  const totalVotesAcrossPolls = polls.reduce(
    (sum, poll) =>
      sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0),
    0
  );

  const surveyCount = polls.filter((poll) => poll.type === "survey").length;
  const filteredPolls = polls.filter((poll) => {
    if (activeFilter === "all") {
      return true;
    }

    return poll.type === activeFilter;
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#64748b"
        },
        grid: {
          color: "rgba(148, 163, 184, 0.18)"
        }
      }
    }
  };

  return (
    <PageShell
      eyebrow="Live polling and surveys"
      title="Vote fast, gather richer feedback, and compare responses"
      description="The live board now combines quick polls with survey collection so the product matches the stronger project idea in the UI."
      actions={
        <button type="button" onClick={fetchPolls} className="secondary-button">
          Refresh data
        </button>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Live items"
            value={loading ? "..." : polls.length}
            caption="All active polls and surveys available right now."
          />
          <StatCard
            label="Survey count"
            value={loading ? "..." : surveyCount}
            caption="Longer-form response experiences available in the system."
          />
          <StatCard
            label="Recorded inputs"
            value={loading ? "..." : totalVotesAcrossPolls}
            caption="Combined option selections across polls and surveys."
          />
        </section>

        <StatusBanner tone={status.tone} message={status.message} />

        <section className="flex flex-wrap items-center gap-3">
          {[
            { value: "all", label: `All items (${polls.length})` },
            { value: "poll", label: `Polls (${polls.length - surveyCount})` },
            { value: "survey", label: `Surveys (${surveyCount})` }
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeFilter === filter.value
                  ? "bg-slate-950 text-white shadow-soft dark:bg-brand-300 dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              ].join(" ")}
            >
              {filter.label}
            </button>
          ))}
        </section>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="panel-card animate-pulse space-y-4 p-6"
                aria-hidden="true"
              >
                <div className="h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-56 rounded-[24px] bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-3">
                  <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <div className="panel-card p-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              No polls or surveys yet
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Once admins publish content, this page will show voting controls, survey inputs, and analytics cards.
            </p>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="panel-card p-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              No items in this view
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Switch filters to see the rest of the live content or create a new item from the admin builder.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredPolls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
              const responseCount =
                poll.type === "survey"
                  ? poll.surveyResponses?.length || 0
                  : totalVotes;
              const feedbackCount =
                poll.surveyResponses?.filter((response) => response.textResponse).length || 0;
              const hasResponded = Boolean(user?.email && poll.votedUsers?.includes(user.email));
              const draft = surveyDrafts[poll._id] || {
                selectedOptionIndexes: [],
                textResponse: ""
              };

              const winner = poll.options.reduce((currentWinner, option) =>
                option.votes > currentWinner.votes ? option : currentWinner
              );

              const chartData = {
                labels: poll.options.map((option) => option.text),
                datasets: [
                  {
                    label: poll.type === "survey" ? "Selections" : "Votes",
                    data: poll.options.map((option) => option.votes),
                    backgroundColor: ["#0f766e", "#0284c7", "#f97316", "#7c3aed", "#e11d48"],
                    borderRadius: 10
                  }
                ]
              };

              return (
                <article key={poll._id} className="panel-card overflow-hidden">
                  <div className="border-b border-slate-200/80 p-6 dark:border-slate-800">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
                            {poll.type === "survey" ? "Survey" : "Poll"}
                          </p>
                          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                            {poll.type === "survey" && poll.allowMultipleSelections ? "multi-select" : "single-select"}
                          </span>
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                          {poll.question}
                        </h2>
                      </div>
                      <div className="rounded-[24px] bg-slate-50 px-4 py-3 text-right dark:bg-slate-900">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                          Leading option
                        </p>
                        <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                          {winner?.text || "No responses yet"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                        {poll.type === "survey" ? `${responseCount} responses` : `${totalVotes} total votes`}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                        {poll.options.length} answer choices
                      </span>
                      {poll.type === "survey" && poll.allowTextResponse ? (
                        <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                          {feedbackCount} written comments
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-6 p-6">
                    <div className="h-72 rounded-[28px] border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                      <Bar data={chartData} options={chartOptions} />
                    </div>

                    {poll.type === "poll" ? (
                      <div className="space-y-4">
                        {poll.options.map((option, index) => {
                          const percentage =
                            totalVotes === 0
                              ? 0
                              : Number(((option.votes / totalVotes) * 100).toFixed(1));

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleVote(poll._id, index)}
                              disabled={activeVoteId === poll._id || hasResponded}
                              className="w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-900"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {option.text}
                                </span>
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                  {option.votes} votes
                                </span>
                              </div>
                              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-brand-600 via-sky-500 to-orange-400"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                <span>{hasResponded ? "Already voted" : "Vote now"}</span>
                                <span>{percentage}%</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {poll.options.map((option, index) => {
                          const percentage =
                            totalVotes === 0
                              ? 0
                              : Number(((option.votes / totalVotes) * 100).toFixed(1));
                          const isSelected = (draft.selectedOptionIndexes || []).includes(index);

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => toggleSurveyOption(poll, index)}
                              disabled={activeVoteId === poll._id || hasResponded}
                              className={[
                                "w-full rounded-[24px] border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-70",
                                isSelected
                                  ? "border-slate-950 bg-slate-950 text-white dark:border-brand-300 dark:bg-brand-300 dark:text-slate-950"
                                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:hover:bg-slate-900"
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium">{option.text}</span>
                                <span className="text-sm font-semibold opacity-80">
                                  {option.votes} selections
                                </span>
                              </div>
                              <div className="mt-3 h-2 rounded-full bg-slate-200/80 dark:bg-slate-800">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-brand-600 via-sky-500 to-orange-400"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] opacity-80">
                                <span>{isSelected ? "Selected" : "Tap to choose"}</span>
                                <span>{percentage}%</span>
                              </div>
                            </button>
                          );
                        })}

                        {poll.allowTextResponse ? (
                          <FormField
                            as="textarea"
                            rows="4"
                            label="Optional comment"
                            placeholder="Share any extra detail that will help interpret your response."
                            value={draft.textResponse}
                            onChange={(event) => updateSurveyComment(poll._id, event.target.value)}
                            disabled={activeVoteId === poll._id || hasResponded}
                          />
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleSurveySubmit(poll)}
                          disabled={activeVoteId === poll._id || hasResponded}
                          className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {hasResponded ? "Survey already submitted" : "Submit survey"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default ViewPolls;
