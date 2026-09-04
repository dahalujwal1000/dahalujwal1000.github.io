import { site } from "../content";
import Terminal from "./Terminal";

export default function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="status-line" data-reveal>
            <span className="dot" aria-hidden="true" />
            {site.status} · {site.statusNote}
          </p>
          <h1 className="big" data-reveal style={{ transitionDelay: "80ms" }}>
            <span className="dollar">$</span> hi, I&apos;m
            <br />
            <span className="accent">{site.name}</span>
            <span className="caret" aria-hidden="true" />
          </h1>
          <p className="role" data-reveal style={{ transitionDelay: "160ms" }}>
            {site.role}
          </p>
          <p className="lead" data-reveal style={{ transitionDelay: "240ms" }}>
            {site.tagline}
          </p>
          <div className="cta-row" data-reveal style={{ transitionDelay: "320ms" }}>
            <a className="btn" href="#contact">
              get in touch →
            </a>
            <a className="btn ghost" href="#projects">
              view projects →
            </a>
          </div>
        </div>
        <Terminal />
      </div>
    </section>
  );
}