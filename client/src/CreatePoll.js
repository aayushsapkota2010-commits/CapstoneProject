import React, { useState } from "react";

import FormField from "./components/FormField";
import PageShell from "./components/PageShell";
import StatusBanner from "./components/StatusBanner";
import api from "./lib/api";
import { getStoredUser } from "./utils/session";

function CreatePoll() {
  const [type, setType] = useState("poll");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [allowMultipleSelections, setAllowMultipleSelections] = useState(false);
  const [allowTextResponse, setAllowTextResponse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  const handleChange = (index, value) => {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  };

  const addOption = () => {
    setOptions((current) => [...current, ""]);
  };

  const removeOption = (index) => {
    setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index));
  };

  const resetBuilder = () => {
    setQuestion("");
    setOptions(["", "", ""]);
    setAllowMultipleSelections(false);
    setAllowTextResponse(false);
  };

  const handleSubmit = async () => {
    const user = getStoredUser();
    const cleanOptions = options.map((option) => option.trim()).filter(Boolean);

    if (!question.trim()) {
      setStatus({
        tone: "error",
        message: `Add a ${type} question before publishing.`
      });
      return;
    }

    if (cleanOptions.length < 2) {
      setStatus({
        tone: "error",
        message: `Add at least two answer options so people can respond to the ${type}.`
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ tone: "info", message: "" });

      await api.post("/poll/create", {
        type,
        question: question.trim(),
        options: cleanOptions,
        allowMultipleSelections,
        allowTextResponse,
        createdBy: user?.name || "Admin"
      });

      resetBuilder();
      setStatus({
        tone: "success",
        message: `${type === "survey" ? "Survey" : "Poll"} created successfully.`
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || `Unable to create the ${type}.`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPreviewOptions = options.filter((option) => option.trim());

  return (
    <PageShell
      eyebrow="Poll and survey builder"
      title="Create quick polls and richer surveys"
      description="The builder now supports fast opinion checks and more detailed survey collection in one consistent workflow."
      actions={
        <>
          <button type="button" onClick={addOption} className="secondary-button">
            Add option
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Publishing..."
              : `Publish ${type === "survey" ? "survey" : "poll"}`}
          </button>
        </>
      }
    >
      <div className="grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <div className="panel-card p-6 sm:p-8">
            <div className="space-y-6">
              <StatusBanner tone={status.tone} message={status.message} />

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Content type
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: "poll",
                      title: "Poll",
                      copy: "Single-answer voting built for quick decisions."
                    },
                    {
                      value: "survey",
                      title: "Survey",
                      copy: "Structured feedback with optional multi-select and comments."
                    }
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setType(item.value)}
                      className={[
                        "rounded-[24px] border p-5 text-left transition",
                        type === item.value
                          ? "border-slate-950 bg-slate-950 text-white shadow-soft dark:border-brand-300 dark:bg-brand-300 dark:text-slate-950"
                          : "border-slate-200 bg-slate-50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-900"
                      ].join(" ")}
                    >
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 opacity-80">{item.copy}</p>
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                label={`${type === "survey" ? "Survey" : "Poll"} question`}
                placeholder={
                  type === "survey"
                    ? "How satisfied are you with the campus placement support?"
                    : "What should be the theme for the next campus event?"
                }
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                      Answer options
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Use clear labels that are easy to compare on desktop and mobile.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {options.length} options
                  </span>
                </div>

                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FormField
                      label={`Option ${index + 1}`}
                      placeholder={`Enter option ${index + 1}`}
                      value={option}
                      onChange={(event) => handleChange(index, event.target.value)}
                      className="flex-1"
                    />
                    {options.length > 2 ? (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="mt-7 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/70 dark:text-rose-300 dark:hover:bg-rose-950/30"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              {type === "survey" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setAllowMultipleSelections((current) => !current)}
                    className={[
                      "rounded-[24px] border p-5 text-left transition",
                      allowMultipleSelections
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                        : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70"
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Response mode
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                      {allowMultipleSelections ? "Multi-select enabled" : "Single-select only"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Let respondents choose more than one option when the survey needs broader feedback.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllowTextResponse((current) => !current)}
                    className={[
                      "rounded-[24px] border p-5 text-left transition",
                      allowTextResponse
                        ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30"
                        : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70"
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Qualitative input
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                      {allowTextResponse ? "Comment box enabled" : "Choices only"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Collect written notes alongside option selections when you need more context.
                    </p>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
              Preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              How participants will experience it
            </h2>
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">
                  {question.trim() || "Your question will appear here"}
                </p>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                  {type}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {(cleanPreviewOptions.length > 0 ? cleanPreviewOptions : options).map((option, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-300"
                  >
                    {option.trim() || `Option ${index + 1}`}
                  </div>
                ))}
              </div>
              {type === "survey" && allowTextResponse ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Optional comment box will appear below the choices.
                </div>
              ) : null}
            </div>
          </div>

          <div className="panel-card bg-slate-950 p-6 text-white dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
              Publishing tips
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Use polls for fast single-decision moments and surveys for broader sentiment gathering.</li>
              <li>Enable multi-select only when respondents may genuinely agree with more than one option.</li>
              <li>Turn on written feedback when the numbers alone will not explain why people answered the way they did.</li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

export default CreatePoll;
