import { site } from "../content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container foot-inner">
        <span>
          © {new Date().getFullYear()} {site.name} · built from scratch with React
        </span>
        <div className="foot-links dim">
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            github
          </a>
          <span aria-hidden="true">/rss.xml</span>
          <span aria-hidden="true">/sitemap.xml</span>
        </div>
      </div>
    </footer>
  );
}