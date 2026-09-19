import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import { selectedProjects } from "../content";
import { site } from "../site";

export default function ProjectsSection() {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = {
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      };
      setEdges((current) =>
        current.start === next.start && current.end === next.end ? current : next
      );
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", scheduleUpdate, { passive: true });
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(el);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", scheduleUpdate);
      observer.disconnect();
    };
  }, []);
  const scrollProjects = (direction: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const distance = (card?.offsetWidth ?? el.clientWidth) + 24;
    el.scrollBy({ left: direction * distance, behavior: "auto" });
  };
  return (
    <section className="container section" id="projects">
      <div className="sec-head" data-reveal>
        <p className="dim">02 SELECTED PROJECTS · ~/projects</p>
        <h2><span className="dollar">$</span> ls -al ~/projects</h2>
        <p className="dim">{selectedProjects.length} projects · explore the work and source code</p>
      </div>
      <figure className="project-spotlight">
        <a href="/projects/digital-wellbeing.png" target="_blank" rel="noreferrer" aria-label="Expand Digital Wellbeing dashboard preview">
          <img src="/projects/digital-wellbeing.png" alt="Digital Wellbeing dashboard showing an activity ring and usage statistics" width={1080} height={780} loading="lazy" />
        </a>
        <figcaption>
          <p className="dim small">A CLOSER LOOK</p>
          <h3>Digital Wellbeing</h3>
          <p>A Windows dashboard for screen time, app usage, and session history. Built with Python and SQLite.</p>
          <p className="dim small">Actual app preview · sample data. Select the image to view it full size.</p>
          <a className="btn ghost" href="https://github.com/dahalujwal1000/Digital_well-being" target="_blank" rel="noreferrer">Explore the source →</a>
        </figcaption>
      </figure>
      <div className="project-controls" aria-label="Project scroll controls">
        <button className="btn ghost" type="button" disabled={edges.start} aria-label="Previous — scroll projects left" aria-controls="project-rail" onClick={() => scrollProjects(-1)}>← Previous</button>
        <button className="btn ghost" type="button" disabled={edges.end} aria-label="Next — scroll projects right" aria-controls="project-rail" onClick={() => scrollProjects(1)}>Next →</button>
      </div>
      <div className="pcards" id="project-rail" ref={rail} role="region" aria-label="Selected projects" tabIndex={0}>
        {selectedProjects.map((p) => <div className="project-slide" key={p.path}><ProjectCard p={p} /></div>)}
      </div>
      <p className="sec-foot" data-reveal>
        <a className="btn ghost" href={site.githubUrl} target="_blank" rel="noreferrer">View more projects on GitHub ↗</a>
      </p>
    </section>
  );
}
