import { about, site } from "../content";

export default function AboutPage() {
  return (
    <section className="container section page" id="about">
      <div className="about-grid">
        <div className="about-copy">
          <p className="crumb dim" data-reveal>
            ~ / about
          </p>
          <h1 className="big" data-reveal style={{ transitionDelay: "60ms" }}>
            <span className="dollar">$</span> whoami
          </h1>
          <p
            className="about-handle dim"
            data-reveal
            style={{ transitionDelay: "120ms" }}
          >
            {site.name} ·{" "}
            <a
              className="ok"
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{site.github}
            </a>
          </p>
          <p className="lead" data-reveal style={{ transitionDelay: "180ms" }}>
            <span className="ok">{about.accent}</span> {about.intro}
          </p>
          <ul
            className="about-rows"
            data-reveal
            style={{ transitionDelay: "240ms" }}
          >
            <li>
              <span className="k dim">→ name</span>
              <span>{site.name}</span>
            </li>
            <li>
              <span className="k dim">→ based in</span>
              <span>
                {site.location} <span className="ok">// {site.tz}</span>
              </span>
            </li>
            <li>
              <span className="k dim">→ role</span>
              <span>{site.role}</span>
            </li>
            <li>
              <span className="k dim">→ stack</span>
              <span>{site.stack.join(" / ")}</span>
            </li>
            <li>
              <span className="k dim">→ speaks</span>
              <span>{about.speaks}</span>
            </li>
            <li>
              <span className="k dim">→ status</span>
              <span className="ok">● {site.statusNote}</span>
            </li>
          </ul>
        </div>

        <div className="photo-card" data-reveal style={{ transitionDelay: "200ms" }}>
          <span className="photo-badge" aria-hidden="true">
            ★ irl
          </span>
          {about.photo ? (
            <img src={about.photo} alt={`${site.name} — portrait`} />
          ) : (
            <div className="photo-placeholder" aria-hidden="true">
              <p>
                <span className="dollar">$</span> cat portrait.jpg
              </p>
              <p className="dim">
                no photo yet — drop portrait.jpg into public/ and set
                about.photo in content.ts
              </p>
              <span className="photo-ascii">&gt;_</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}