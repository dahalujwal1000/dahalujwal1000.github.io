import { site } from "../site";
import Terminal from "./Terminal";

export default function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="status-line">
            <span className="dot" aria-hidden="true" />
            {site.status} · {site.statusNote}
          </p>
          <h1 className="big">
            <span className="dollar">$</span> hi, I&apos;m
            <br />
            <span className="accent">{site.name}</span>
            <span className="caret" aria-hidden="true" />
          </h1>
          <p className="role">
            {site.role}
          </p>
          <p className="lead">
            {site.tagline}
          </p>
          <div className="cta-row">
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
