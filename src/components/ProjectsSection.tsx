import ProjectCard from "./ProjectCard";
import { projects, site } from "../content";

export default function ProjectsSection() {
  return (
    <section className="container section" id="projects">
      <div className="sec-head" data-reveal>
        <p className="dim">02 ALL PROJECTS · ~/projects</p>
        <h2>
          <span className="dollar">$</span> ls -al ~/projects
        </h2>
        <p className="dim">
          {projects.length} visible · synced automatically from GitHub
        </p>
      </div>

      <div className="pcards">
        {projects.map((p, i) => (
          <div
            key={p.index}
            data-reveal
            style={{ transitionDelay: `${Math.min(i, 8) * 70}ms` }}
          >
            <ProjectCard p={p} />
          </div>
        ))}
      </div>

      <p className="sec-foot" data-reveal>
        <span className="dollar">$</span> git remote -v{" "}
        <a className="dim" href={site.githubUrl} target="_blank" rel="noreferrer">
          {"// everything else on github @" + site.github + " →"}
        </a>
      </p>
    </section>
  );
}