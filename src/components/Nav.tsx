import { site } from "../content";

export default function Nav() {
  return (
    <header className="topbar">
      <nav className="container topbar-inner">
        <a className="brand" href="#top">
          {site.domain}
          <span className="caret" aria-hidden="true" />
        </a>
        <div className="nav-links">
          <a href="#top">home</a>
          <a href="#projects">projects</a>
          <a href="#contact">contact</a>
        </div>
        <span className="pill" title={site.statusNote}>
          <span className="dot" aria-hidden="true" />
          {site.status}
        </span>
      </nav>
    </header>
  );
}