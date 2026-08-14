import { useRef, useState } from "react";
import "./style.css";

const API_BASE = "https://mental-health-score-predictor-ml-iell.onrender.com";

const initialForm = {
  age: "",
  gender: "",
  country: "",
  academic_level: "",
  most_used_platform: "",
  purpose_of_use: "",
  avg_daily_usage_hours: "",
  daily_unlocks: "",
  study_hours: "",
  physical_activity_hours: "",
  sleep_hours_per_night: "",
  stress_level: "",
};

const countries = [
  "India",
  "USA",
  "Canada",
  "Australia",
  "UK",
  "Germany",
  "Mexico",
  "Turkey",
  "France",
];

const platforms = [
  "Facebook",
  "Instagram",
  "Snapchat",
  "Twitter",
  "YouTube",
  "TikTok",
  "LinkedIn",
  "LINE",
  "KakaoTalk",
  "VKontakte",
  "WhatsApp",
  "WeChat",
];

function Gauge({ score = null }) {
  const clamped = score == null ? 0 : Math.max(0, Math.min(10, score));
  const offset = 314 * (1 - clamped / 10);

  return (
    <svg
      className="gauge gauge-result"
      viewBox="0 0 240 160"
      aria-hidden="true">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D9534F" />
          <stop offset="45%" stopColor="#E3B341" />
          <stop offset="100%" stopColor="#4C9A78" />
        </linearGradient>
      </defs>

      <path className="gauge-track" d="M 30 140 A 100 100 0 0 1 210 140" />
      <path
        className="gauge-fill"
        d="M 30 140 A 100 100 0 0 1 210 140"
        style={{
          strokeDasharray: 314,
          strokeDashoffset: score == null ? 314 : offset,
        }}
      />

      <g className="gauge-ticks">
        {Array.from({ length: 6 }, (_, i) => {
          const value = i * 2;
          const angle = Math.PI - (value / 10) * Math.PI;
          const x1 = 120 + 100 * Math.cos(angle);
          const y1 = 140 - 100 * Math.sin(angle);
          const x2 = 120 + 90 * Math.cos(angle);
          const y2 = 140 - 90 * Math.sin(angle);

          return (
            <line
              key={value}
              x1={x1.toFixed(1)}
              y1={y1.toFixed(1)}
              x2={x2.toFixed(1)}
              y2={y2.toFixed(1)}
            />
          );
        })}
      </g>

      {score != null && (
        <circle className="gauge-needle-hub" cx="120" cy="140" r="5" />
      )}
    </svg>
  );
}

function FieldError({ message }) {
  return <span className="error-msg">{message || ""}</span>;
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [score, setScore] = useState(null);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorCopy, setErrorCopy] = useState("");
  const firstErrorRef = useRef(null);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (payload) => {
    const nextErrors = {};

    const numericChecks = [
      ["age", 10, 100],
      ["avg_daily_usage_hours", 0, 24],
      ["daily_unlocks", 0, Infinity],
      ["study_hours", 0, 24],
      ["physical_activity_hours", 0, 24],
      ["sleep_hours_per_night", 0, 24],
    ];

    numericChecks.forEach(([key, min, max]) => {
      const value = payload[key];

      if (value === "" || value === null || Number.isNaN(value)) {
        nextErrors[key] = "This field is required.";
      } else if (value < min || value > max) {
        nextErrors[key] =
          `Must be between ${min} and ${max === Infinity ? "0+" : max}.`;
      }
    });

    [
      "gender",
      "country",
      "academic_level",
      "most_used_platform",
      "purpose_of_use",
    ].forEach((key) => {
      if (!payload[key] || String(payload[key]).trim() === "") {
        nextErrors[key] = "This field is required.";
      }
    });

    if (!payload.stress_level) {
      nextErrors.stress_level = "Pick a stress level.";
    }

    return nextErrors;
  };

  const buildPayload = () => ({
    age: form.age === "" ? NaN : parseInt(form.age, 10),
    gender: form.gender,
    country: form.country.trim(),
    academic_level: form.academic_level,
    most_used_platform: form.most_used_platform,
    purpose_of_use: form.purpose_of_use,
    avg_daily_usage_hours:
      form.avg_daily_usage_hours === ""
        ? NaN
        : parseFloat(form.avg_daily_usage_hours),
    daily_unlocks:
      form.daily_unlocks === "" ? NaN : parseInt(form.daily_unlocks, 10),
    study_hours: form.study_hours === "" ? NaN : parseFloat(form.study_hours),
    physical_activity_hours:
      form.physical_activity_hours === ""
        ? NaN
        : parseFloat(form.physical_activity_hours),
    sleep_hours_per_night:
      form.sleep_hours_per_night === ""
        ? NaN
        : parseFloat(form.sleep_hours_per_night),
    stress_level: form.stress_level,
  });

  const renderError = (title, copy) => {
    setErrorTitle(title);
    setErrorCopy(copy);
    setState("error");
  };

  const applyServerValidationErrors = (detail) => {
    if (!Array.isArray(detail)) return false;

    const serverErrors = {};

    detail.forEach((err) => {
      const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : null;

      if (field) {
        serverErrors[field] = err.msg || "Invalid value.";
      }
    });

    if (Object.keys(serverErrors).length) {
      setErrors(serverErrors);
      return true;
    }

    return false;
  };

  const submitPrediction = async (event) => {
    event.preventDefault();
    setErrors({});

    const payload = buildPayload();
    const clientErrors = validate(payload);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      firstErrorRef.current?.focus?.();
      return;
    }

    setState("loading");

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        const body = await response.json().catch(() => null);
        const matched = body && applyServerValidationErrors(body.detail);

        renderError(
          "Check your inputs",
          matched
            ? "The API rejected a few fields — details are marked on the form."
            : "The API rejected this submission. Please review your inputs and try again.",
        );
        return;
      }

      if (!response.ok) {
        let detailMsg = `The API responded with status ${response.status}.`;
        const body = await response.json().catch(() => null);

        if (body && typeof body.detail === "string") {
          detailMsg = body.detail;
        }

        renderError("Prediction failed", detailMsg);
        return;
      }

      const data = await response.json();

      if (typeof data.predicted_mental_health_score !== "number") {
        renderError(
          "Unexpected response",
          "The API responded, but the score was missing or malformed.",
        );
        return;
      }

      setScore(data.predicted_mental_health_score);
      setState("result");
    } catch {
      renderError(
        "Can't reach the server",
        `Couldn't connect to ${API_BASE}. Make sure the FastAPI backend is running and reachable from this page.`,
      );
    }
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setScore(null);
    setState("idle");
    setErrorTitle("");
    setErrorCopy("");
  };

  const scoreBand = (value) => {
    if (value < 4) {
      return {
        label: "Signal: strained",
        context:
          "Your responses suggest elevated strain right now. Small shifts in sleep or screen time can go a long way.",
      };
    }

    if (value < 7) {
      return {
        label: "Signal: balanced",
        context:
          "Your rhythm looks fairly steady, with some room to recover and reset.",
      };
    }

    return {
      label: "Signal: strong",
      context:
        "Your habits point to a well-supported, resilient baseline. Keep it up.",
    };
  };

  const inputClass = (name) => (errors[name] ? "field field-error" : "field");

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />

      <header className="site-header">
        <div className="header-inner">
          <span className="eyebrow">Student Wellness Analytics</span>
          <h1 className="title">
            Mental Health <em>Signal</em>
          </h1>
          <p className="subtitle">
            A quick read on how habits, screen time, and stress are trending —
            modeled from your daily rhythm, not a diagnosis.
          </p>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel" aria-labelledby="form-heading">
          <form id="predict-form" onSubmit={submitPrediction} noValidate>
            <fieldset className="group">
              <legend>
                <span className="legend-index">01</span> Profile
              </legend>

              <div className="grid grid-3">
                <div className={inputClass("age")}>
                  <label htmlFor="age">Age</label>
                  <input
                    ref={errors.age ? firstErrorRef : null}
                    type="number"
                    id="age"
                    min="10"
                    max="100"
                    step="1"
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="e.g. 21"
                  />
                  <span className="hint">10–100</span>
                  <FieldError message={errors.age} />
                </div>

                <div className={inputClass("gender")}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <FieldError message={errors.gender} />
                </div>

                <div className={inputClass("country")}>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    list="country-list"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="e.g. India"
                    autoComplete="off"
                  />
                  <datalist id="country-list">
                    {countries.map((country) => (
                      <option value={country} key={country} />
                    ))}
                  </datalist>
                  <span className="hint">Not listed? Type it anyway.</span>
                  <FieldError message={errors.country} />
                </div>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>
                <span className="legend-index">02</span> Academic &amp; Digital
                Habits
              </legend>

              <div className="grid grid-2">
                <div className={inputClass("academic_level")}>
                  <label htmlFor="academic_level">Academic level</label>
                  <select
                    id="academic_level"
                    value={form.academic_level}
                    onChange={(e) =>
                      updateField("academic_level", e.target.value)
                    }>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                  <FieldError message={errors.academic_level} />
                </div>

                <div className={inputClass("most_used_platform")}>
                  <label htmlFor="most_used_platform">Most-used platform</label>
                  <select
                    id="most_used_platform"
                    value={form.most_used_platform}
                    onChange={(e) =>
                      updateField("most_used_platform", e.target.value)
                    }>
                    <option value="" disabled>
                      Select
                    </option>
                    {platforms.map((platform) => (
                      <option value={platform} key={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.most_used_platform} />
                </div>

                <div className={inputClass("purpose_of_use")}>
                  <label htmlFor="purpose_of_use">Primary purpose</label>
                  <select
                    id="purpose_of_use"
                    value={form.purpose_of_use}
                    onChange={(e) =>
                      updateField("purpose_of_use", e.target.value)
                    }>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Networking">Networking</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="News">News</option>
                  </select>
                  <FieldError message={errors.purpose_of_use} />
                </div>

                <div className={inputClass("avg_daily_usage_hours")}>
                  <label htmlFor="avg_daily_usage_hours">
                    Avg. daily screen time
                  </label>
                  <div className="unit-input">
                    <input
                      type="number"
                      id="avg_daily_usage_hours"
                      min="0"
                      max="24"
                      step="0.1"
                      value={form.avg_daily_usage_hours}
                      onChange={(e) =>
                        updateField("avg_daily_usage_hours", e.target.value)
                      }
                      placeholder="0.0"
                    />
                    <span className="unit">hrs</span>
                  </div>
                  <FieldError message={errors.avg_daily_usage_hours} />
                </div>

                <div className={inputClass("daily_unlocks")}>
                  <label htmlFor="daily_unlocks">Daily phone unlocks</label>
                  <input
                    type="number"
                    id="daily_unlocks"
                    min="0"
                    step="1"
                    value={form.daily_unlocks}
                    onChange={(e) =>
                      updateField("daily_unlocks", e.target.value)
                    }
                    placeholder="e.g. 60"
                  />
                  <FieldError message={errors.daily_unlocks} />
                </div>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>
                <span className="legend-index">03</span> Lifestyle &amp; Stress
              </legend>

              <div className="grid grid-3">
                {[
                  ["study_hours", "Study hours / day"],
                  ["physical_activity_hours", "Physical activity / day"],
                  ["sleep_hours_per_night", "Sleep / night"],
                ].map(([name, label]) => (
                  <div className={inputClass(name)} key={name}>
                    <label htmlFor={name}>{label}</label>
                    <div className="unit-input">
                      <input
                        type="number"
                        id={name}
                        min="0"
                        max="24"
                        step="0.1"
                        value={form[name]}
                        onChange={(e) => updateField(name, e.target.value)}
                        placeholder="0.0"
                      />
                      <span className="unit">hrs</span>
                    </div>
                    <FieldError message={errors[name]} />
                  </div>
                ))}

                <div className={`${inputClass("stress_level")} field-span`}>
                  <label>Perceived stress level</label>

                  <div className="segmented" id="stress_level_group">
                    {["Low", "Medium", "High", "Very High"].map((level) => (
                      <button
                        type="button"
                        className={`seg-btn ${
                          form.stress_level === level ? "active" : ""
                        }`}
                        key={level}
                        onClick={() => updateField("stress_level", level)}>
                        {level}
                      </button>
                    ))}
                  </div>

                  <FieldError message={errors.stress_level} />
                </div>
              </div>
            </fieldset>

            <div className="form-footer">
              <button
                type="submit"
                className={`submit-btn ${state === "loading" ? "loading" : ""}`}
                disabled={state === "loading"}>
                <span className="btn-label">
                  {state === "loading" ? "Reading..." : "Read my signal"}
                </span>
                <span className="btn-spinner" aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>

        <aside className="panel result-panel" aria-live="polite">
          <div className="result-inner">
            {state === "idle" && (
              <div className="state state-idle">
                <Gauge />
                <p className="idle-label">Your score will appear here</p>
                <p className="idle-copy">
                  Fill in the form and submit to generate a predicted mental
                  health score from 0–10.
                </p>
              </div>
            )}

            {state === "loading" && (
              <div className="state state-loading">
                <div className="pulse-ring" />
                <p className="loading-label">Reading the signal…</p>
                <p className="loading-copy">
                  Running your habits through the model.
                </p>
              </div>
            )}

            {state === "result" && score != null && (
              <div className="state state-result">
                <Gauge score={score} />

                <div className="score-readout">
                  <span className="score-number">{score.toFixed(2)}</span>
                  <span className="score-max">/10</span>
                </div>

                <p className="score-band">{scoreBand(score).label}</p>
                <p className="score-context">{scoreBand(score).context}</p>

                <button type="button" className="reset-btn" onClick={reset}>
                  Run another read
                </button>
              </div>
            )}

            {state === "error" && (
              <div className="state state-error">
                <div className="error-icon" aria-hidden="true">
                  !
                </div>
                <p className="error-label">{errorTitle}</p>
                <p className="error-copy">{errorCopy}</p>
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => setState("idle")}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="site-footer">
        <p>
          Built for informational purposes only — this is not a clinical
          assessment. If you're struggling, please talk to someone you trust.
        </p>
      </footer>
    </>
  );
}
