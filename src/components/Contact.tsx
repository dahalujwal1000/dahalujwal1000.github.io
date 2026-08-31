import { FormEvent, useState } from "react";
import { site } from "../content";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="container section" id="contact">
      <div className="sec-head" data-reveal>
        <p className="dim">03 GET IN TOUCH</p>
        <h2>
          <span className="dollar">$</span> echo &quot;hello, world&quot;
        </h2>
      </div>

      <div className="contact-grid">
        <div className="cinfo" data-reveal>
          <h3 className="big" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)" }}>
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
              <span className="k dim">location</span> {site.location} · {site.tz}
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

        <form className="cform" data-reveal style={{ transitionDelay: "120ms" }} onSubmit={onSubmit}>
          {sent ? (
            <div className="sent">
              <p className="ok">✔ message queued</p>
              <p className="dim small">
                Demo mode — this form doesn&apos;t send anywhere yet. Wire it to a
                backend (Formspree / Resend) or mail me directly:{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          ) : (
            <>
              <label>
                NAME *
                <input required name="name" placeholder="Ada Lovelace" autoComplete="name" />
              </label>
              <label>
                EMAIL *
                <input required type="email" name="email" placeholder="ada@example.com" autoComplete="email" />
              </label>
              <label>
                MESSAGE *
                <textarea required name="message" rows={4} placeholder="Let&apos;s build something together…" />
              </label>
              <button className="btn" type="submit">
                send message ↵
              </button>
              <p className="dim small">protected · rate-limited</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}