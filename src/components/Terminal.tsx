import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { site } from "../site";

type Line = { kind: "sys" | "q" | "a"; text: string };

const introduction =
  "// Explore my projects, skills, and availability. Pick a topic below.";
const chips = [
  "what is your stack?",
  "are you available for hire?",
  "tell me about a recent project",
  "how was this site built?",
];
const chipLabels = ["My stack", "Availability", "Recent work", "This site"];

export default function Terminal() {
  const reduce = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [log, setLog] = useState<Line[]>([
    { kind: "sys", text: introduction },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const logRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => timers.current.forEach((timer) => window.clearTimeout(timer)),
    []
  );

  useEffect(() => {
    const el = logRef.current;
    if (!el || (log.length === 1 && !busy)) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [log, busy, reduce]);

  const respond = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setInput("");
    setLog((lines) => [...lines.slice(-40), { kind: "q", text: trimmed }]);

    let answers: string[];
    try {
      answers = (await import("../terminal-answer")).answerFor(trimmed);
    } catch {
      answers = ["I couldn't load the project index. Please try again."];
    }

    if (reduce) {
      setLog((lines) => [
        ...lines,
        ...answers.map((text) => ({ kind: "a" as const, text })),
      ]);
      busyRef.current = false;
      setBusy(false);
      return;
    }

    answers.forEach((text, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setLog((lines) => [...lines, { kind: "a", text }]);
          if (index === answers.length - 1) {
            busyRef.current = false;
            setBusy(false);
          }
        }, 420 + index * 380)
      );
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void respond(input);
  };

  return (
    <div className="term">
      <div className="term-head">
        <span className="term-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">~/ask-me.sh</span>
        <span className={"term-ready" + (busy ? " busy" : "")}>
          {busy ? "thinking" : "ready"}
        </span>
      </div>
      <div className="term-body">
        <div className="term-log" ref={logRef} aria-live="polite">
          {log.map((line, index) => (
            <div
              key={index}
              className={
                line.kind === "q"
                  ? "line q pop"
                  : line.kind === "a"
                    ? "line a pop"
                    : "line sys"
              }
            >
              {line.kind === "q" && (
                <span className="prompt" aria-hidden="true">›</span>
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
          {chips.map((chip, index) => (
            <button
              key={chip}
              className="chip"
              type="button"
              disabled={busy}
              aria-label={chipLabels[index] + " — " + chip}
              onClick={() => void respond(chip)}
            >
              {chipLabels[index] ?? chip}
            </button>
          ))}
        </div>
        <form className="prompt-row" onSubmit={onSubmit}>
          <span className="prompt" aria-hidden="true">›</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={"ask anything about " + site.name.toLowerCase() + "…"}
            aria-label={"Ask a question about " + site.name}
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
