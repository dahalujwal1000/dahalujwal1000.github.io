import { FormEvent, useState } from "react";
import { site } from "../content";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Demo mode — no access key configured, nothing is sent anywhere.
    if (!ACCESS_KEY) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const data = new FormData(form);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          subject: `Portfolio message from ${data.get("name") ?? "someone"}`,
          from_name: "Portfolio Contact Form",
        }),
      });
      const json = await res.json();
      if (json.success) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const reset = () => setStatus("idle");

  return (
    <section className="container section" id="contact">
      <div className="sec-head" data-reveal>
        <p className="dim">03 GET IN TOUCH · ~/contact · replies in &lt; 24h</p>
        <h2>
          <span className="dollar">$</span> echo &quot;hello, world&quot;
        </h2>
      </div>

      <div className="contact-grid">
        <div className="cinfo" data-reveal>
          <h3
            className="big"
            style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)" }}
          >
            Let&apos;s build something.
          </h3>
          <ul className="klist">
            <li>
              <span className="k dim">~/contact</span> replies in &lt; 24h
            </li>
            <li>
              <span className="k dim">email</span>{" "}
              <a href={`mailto:${site.email}`}>{site.email} →</a>
            </li>
            <li>
              <span className="k dim">location</span> {site.location} ·{" "}
              {site.tz}
            </li>
            <li>
              <span className="k dim">status</span>{" "}
              <span className="ok">accepting work · Q3 2026</span>
            </li>
            <li>
              <span className="k dim">stack</span> {site.stack.join(" / ")}
            </li>
            <li>
              <span className="k dim">github</span>{" "}
              <a href={site.githubUrl} target="_blank" rel="noreferrer">
                @{site.github}
              </a>
            </li>
            <li>
              <span className="k dim">linkedin</span>{" "}
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer">
                {site.linkedin}
              </a>
            </li>
          </ul>
        </div>

        <form
          className="cform"
          data-reveal
          style={{ transitionDelay: "120ms" }}
          onSubmit={onSubmit}
        >
          {status === "sent" ? (
            <div className="sent">
              <p className="ok">
                ✔ {ACCESS_KEY ? "message sent" : "message queued (demo mode)"}
              </p>
              <p className="dim small">
                {ACCESS_KEY
                  ? "Thanks! I'll get back to you soon."
                  : "Demo mode — this form doesn't send anywhere yet. Add a VITE_WEB3FORMS_ACCESS_KEY in .env to go live, or mail me directly: "}
                {!ACCESS_KEY && (
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                )}
              </p>
              <button
                className="btn"
                type="button"
                onClick={reset}
                style={{ marginTop: "12px" }}
              >
                send another →
              </button>
            </div>
          ) : status === "error" ? (
            <div className="sent">
              <p className="dollar">✖ message failed</p>
              <p className="dim small">
                Something went wrong — please try again or mail me directly:{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <button
                className="btn"
                type="button"
                onClick={reset}
                style={{ marginTop: "12px" }}
              >
                try again ↵
              </button>
            </div>
          ) : (
            <>
              <label>
                NAME *
                <input
                  required
                  name="name"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </label>
              <label>
                EMAIL *
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="ada@example.com"
                  autoComplete="email"
                />
              </label>
              <label>
                MESSAGE *
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Let's build something together…"
                />
              </label>
              <button
                className="btn"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "sending…" : "send message ↵"}
              </button>
              <p className="dim small">
                {ACCESS_KEY ? "protected · rate-limited" : "demo mode · not connected"}
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}