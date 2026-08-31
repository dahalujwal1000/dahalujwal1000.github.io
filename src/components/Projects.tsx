import { projects, site } from "../content";

export default function Projects() {
  return (
    <section className="container section" id="projects">
      <div className="sec-head" data-reveal>
        <p className="dim">02 FEATURED WORK</p>
        <h2>
          <span className="dollar">$</span> ls ~/projects
        </h2>
        <p className="dim">
          Selected projects · {" "}
          {projects.length === 1 ? "1 visible" : `${projects.length} visible`}
        </p>
      </div>

      <div className="plist">
        {projects.map((p, i) => (
          <article key={p.index} className="pcard" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="prow">
              <span className="pindex" aria-hidden="true">
                [{p.index}]
              </span>
              <div className="ptext">
                <h3 className="ptitle">
                  {p.title}
                  {p.href !== "#" && (
                    <a className="plink" href={p.href} target="_blank" rel="noreferrer" aria-label={`${p.title} — open live site`}>
                      ↗
                    </a>
                  )}
                </h3>
                <p className="pmeta dim">
                  {p.year} · {p.role}
                </p>
                <p className="pdesc">{p.description}</p>
                <p className="pdim dim" aria-hidden="true">
                  {p.path}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="sec-foot" data-reveal>
        <span className="dollar">$</span> ls -al /projects{" "}
        <a className="dim" href={site.githubUrl} target="_blank" rel="noreferrer">
          {"// view all on github @" + site.github + " →"}
        </a>
      </p>
    </section>
  );
}