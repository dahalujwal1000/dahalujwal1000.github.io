import { about, site } from "../site";

export default function AboutPage() {
  return (
    <section className="container section page" id="about">
      <div className={about.photo ? "about-grid" : "about-grid about-text-only"}>
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

        {about.photo && <div className="photo-card" data-reveal>
          <span className="photo-badge" aria-hidden="true">★ irl</span>
          <img src={about.photo} alt={site.name + " — portrait"} width={360} height={450} />
        </div>}
      </div>
    </section>
  );
}
