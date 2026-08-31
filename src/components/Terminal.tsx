import { FormEvent, useState } from "react";
import { terminalAnswers, terminalIntroduction } from "../content";

type Line = { kind: "q" | "a"; text: string };

const TOPICS = ["stack", "hire", "projects", "contact", "host"];

function answerFor(question: string): string[] {
  const clean = question.toLowerCase();
  const found = TOPICS.find((t) => clean.includes(t));
  const key = found ?? (clean.includes("available") ? "available" : "fallback");
  return terminalAnswers[key] ?? terminalAnswers.fallback;
}

export default function Terminal() {
  const [log, setLog] = useState<Line[]>([{ kind: "a", text: terminalIntroduction }]);
  const [input, setInput] = useState("");

  const respond = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const answers = answerFor(trimmed).map<Line>((a) => ({ kind: "a", text: a }));
    setLog((l) => [...l, { kind: "q", text: trimmed }, ...answers]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    respond(input);
    setInput("");
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
        <span className="term-ready">ready</span>
      </div>
      <div className="term-body">
        {log.map((line, i) => (
          <div key={i} className={line.kind === "q" ? "line q" : "line a"}>
            <span className="prompt">{line.kind === "q" ? "›" : "▸"}</span>
            {line.text}
          </div>
        ))}
        <form className="line prompt-row" onSubmit={onSubmit}>
          <span className="prompt">›</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask anything… (try: stack / hire / projects)"
            aria-label="Ask a question"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div className="chips">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              className="chip"
              type="button"
              onClick={() => respond(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}