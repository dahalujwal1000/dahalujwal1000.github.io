import { statsLine, type Project } from "../content";

/** One project card — used on the home (featured) and projects pages. */
export default function ProjectCard({ p }: { p: Project }) {
  const stats = statsLine(p);
  const isLink = p.href !== "#";
  const label = /github\.com/.test(p.href) ? "code" : "live";
  return (
    <article className="pcard">
      <span className="pnum" aria-hidden="true">
        [{p.index}]
      </span>
      <h3 className="ptitle">
        {p.title}
        {isLink && (
          <a
            className="plink"
            href={p.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.title} — open ${label}`}
          >
            ↗
          </a>
        )}
      </h3>
      <p className="pmeta dim">{[p.year, p.role].filter(Boolean).join(" · ")}</p>
      <p className="pdesc">{p.description}</p>
      {stats && <p className="pstats">{stats}</p>}
      <div className="pcard-foot">
        <span className="dim">{p.path}</span>
        {isLink && (
          <span className="dim">{label === "live" ? "↗ live" : "→ code"}</span>
        )}
      </div>
    </article>
  );
}