import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  chatChips,
  chatFallback,
  chatTopics,
  projects,
  site,
  statsLine,
  terminalIntroduction,
} from "../content";

type Line = { kind: "sys" | "q" | "a"; text: string };

/** A "topic" the bot can answer: keywords to match + canned answer lines. */
type Intent = { keywords: string[]; lines: string[]; weight?: number };

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter(Boolean);

// light plural-stemming so "projects" matches the keyword "project"
const stem = (t: string) =>
  t.length > 3 && t.endsWith("s") && !t.endsWith("ss") && !t.includes(".")
    ? t.slice(0, -1)
    : t;

function scoreIntent(q: string, tokens: string[], intent: Intent): number {
  let score = 0;
  for (const kw of intent.keywords) {
    const k = stem(kw.toLowerCase());
    if (kw.includes(" ")) {
      if (q.includes(kw)) score += 3; // multi-word phrase hit
    } else if (tokens.some((t) => t === k)) {
      score += 2; // exact token hit
    } else if (
      k.length >= 5 &&
      tokens.some((t) => t.length >= 3 && (t.startsWith(k) || k.startsWith(t)))
    ) {
      score += 1; // loose prefix hit
    }
  }
  return score;
}

// README digest → a couple of readable bot lines (the GitHub-fed knowledge)
function readMeLines(digest: string | undefined, max = 2): string[] {
  if (!digest) return [];
  const sentences = digest.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && `${cur} ${s}`.length > 220) {
      lines.push(cur);
      if (lines.length === max) return lines;
      cur = s;
    } else {
      cur = `${cur} ${s}`.trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, max).map((l) => `readme → ${l}`);
}

/** Project Q&A is generated from the `projects` data — the bot's fine-tuning.
 *  Manual entries and GitHub-discovered repos alike: stats and README digest
 *  flow in automatically from the sync. */
const projectIntent = (p: (typeof projects)[number]): Intent => ({
  keywords: [
    p.title.toLowerCase(),
    ...Array.from(
      new Set([
        ...tokenize(p.title),
        ...tokenize(p.path),
        ...p.tags.map((t) => t.toLowerCase()),
      ])
    ),
  ],
  lines: [
    `[${p.index}] ${p.title} — ${[p.year, p.role].filter(Boolean).join(" · ")}`,
    p.description,
    ...(statsLine(p) ? [statsLine(p)] : []),
    ...readMeLines(p.readMe),
    (() => {
      const link = p.href && p.href !== "#" ? p.href : site.githubUrl;
      const label = /github\.com/.test(link) ? "code" : "live";
      return `${p.path} · ${label} → ${link}`;
    })(),
  ],
});

const INTENTS: Intent[] = [
  ...chatTopics.map((t) => ({ keywords: t.keywords, lines: t.answers })),
  // project intents get a weight boost so e.g. "what is your hospital
  // project about?" routes to the project, not a generic topic
  ...projects.map((p) => ({ ...projectIntent(p), weight: 1.25 })),
];

function answerFor(question: string): string[] {
  const q = question.toLowerCase();
  const tokens = tokenize(q).map(stem);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(q, tokens, intent) * (intent.weight ?? 1);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }
  return best && bestScore >= 2 ? best.lines : chatFallback;
}

export default function Terminal() {
  const reduce = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [log, setLog] = useState<Line[]>([
    { kind: "sys", text: terminalIntroduction },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    []
  );

  // keep the latest line in view, like a real terminal
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [log, busy, reduce]);

  const respond = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const answers = answerFor(trimmed);
    setInput("");
    setLog((l) => [...l.slice(-40), { kind: "q", text: trimmed }]);
    if (reduce) {
      // no theatrics for reduced-motion users — print instantly
      setLog((l) => [
        ...l,
        ...answers.map((text) => ({ kind: "a" as const, text })),
      ]);
      return;
    }
    setBusy(true);
    answers.forEach((text, i) => {
      timers.current.push(
        window.setTimeout(
          () => {
            setLog((l) => [...l, { kind: "a", text }]);
            if (i === answers.length - 1) setBusy(false);
          },
          420 + i * 380
        )
      );
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    respond(input);
  };

  return (
    <div className="term" data-reveal style={{ transitionDelay: "400ms" }}>
      <div className="term-head">
        <span className="term-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">~/ask-me.sh</span>
        <span className={`term-ready${busy ? " busy" : ""}`}>
          {busy ? "thinking" : "ready"}
        </span>
      </div>
      <div className="term-body">
        <div className="term-log" ref={logRef} aria-live="polite">
          {log.map((line, i) => (
            <div
              key={i}
              className={
                line.kind === "q"
                  ? "line q pop"
                  : line.kind === "a"
                    ? "line a pop"
                    : "line sys"
              }
            >
              {line.kind === "q" && (
                <span className="prompt" aria-hidden="true">
                  ›
                </span>
              )}
              {line.text}
            </div>
          ))}
          {busy && (
            <div className="line a" aria-hidden="true">
              <span className="prompt">▸</span>
              <span className="caret" />
            </div>
          )}
        </div>
        <div className="chips">
          {chatChips.map((chip, i) => (
            <button
              key={chip}
              className="chip"
              type="button"
              disabled={busy}
              aria-label={chip}
              onClick={() => respond(chip)}
            >
              {["My stack", "Availability", "Recent work", "This site"][i] ?? chip}
            </button>
          ))}
        </div>
        <form className="prompt-row" onSubmit={onSubmit}>
          <span className="prompt" aria-hidden="true">
            ›
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`ask anything about ${site.name.toLowerCase()}…`}
            aria-label={`Ask a question about ${site.name}`}
            autoComplete="off"
            spellCheck={false}
            maxLength={120}
          />
          <button className="send" type="submit" disabled={busy}>
            send ↵
          </button>
        </form>
      </div>
    </div>
  );
}