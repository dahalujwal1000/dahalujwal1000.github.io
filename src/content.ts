// ==========================================================================
//  EDIT ME — every string on the site is sourced from this file.
//  Change your name, links, projects, and the terminal answers here.
//  TODO: replace placeholders with your real details before deploying.
// ==========================================================================

import { githubRepos, type GithubRepo } from "./github.gen";

// A project YOU list by hand. Optional `repo: "owner/name"` links the entry
// to a GitHub repo — it then absorbs that repo's stats + README digest (the
// chatbot can talk about it) and won't be double-listed by auto-discovery.
// Public repos NOT listed here are discovered automatically on every sync.
export type ProjectInput = {
  title: string;
  year?: string;
  role?: string;
  description: string;
  // keywords the ask-me.sh bot matches questions against — add words people
  // might use when asking about this project (lowercase, no punctuation)
  tags: string[];
  href?: string; // live demo / homepage — "#" or omitted means none
  path?: string; // decorative ~/projects/slug
  repo?: string; // "owner/name"
};

// What the site + chatbot actually consume after the GitHub merge below.
export type Project = {
  index: string;
  title: string;
  year: string;
  role: string;
  description: string;
  tags: string[];
  href: string;
  path: string;
  repo?: string;
  stars?: number;
  language?: string;
  updatedAt?: string;
  source: "manual" | "github";
};

// GitHub auto-discovery policy. The sync (`npm run sync`, also runs before
// every build) harvests public repos into src/github.gen.ts; this config
// decides what shows up. hide/featured use repo names (case-insensitive).
export const github = {
  user: "dahalujwal1000",
  // repos kept off the site. Add a solid GitHub description/README to any of
  // these and delete its line — it will appear on the next sync automatically.
  hide: [
    "project_zero_delay",
    "-nepal-gamer-voice_ZERO_DELAY",
    "Wheather_mobile_app",
    "URL_Shortner",
    "portfolio",
    "dahalujwal1000.github.io",
    "My_Portfolio",
    "dahalujwal1000",
    "E-commerce",
    "College-Website",
    "hckathon_practice",
    "new_practice",
    "Practice-06-11",
  ],
  featured: [] as string[],
  maxRepos: 8,
};

// Your hand-listed projects — shown first, in this order. A `repo` slug
// links an entry to GitHub (stats + README flow into the chatbot); entries
// whose repo doesn't exist yet simply stay manual-only until it does.
export const projectInputs: ProjectInput[] = [
  {
    title: "Norvic Hospital",
    year: "2026",
    role: "Fullstack Developer",
    description:
      "Hospital management web app — appointment booking, patient records, and an admin dashboard, built end-to-end with React and Node.",
    tags: [
      "norvic",
      "hospital",
      "hospitals",
      "medical",
      "healthcare",
      "health",
      "appointment",
      "appointments",
      "patient",
      "patients",
      "records",
      "dashboard",
      "admin",
      "fullstack",
      "clinic",
      "management",
      "app",
    ],
    href: "#",
    path: "~/projects/norvic-hospital",
    repo: "dahalujwal1000/norvic-hospital",
  },
  {
    title: "WeatherApp",
    year: "2025",
    role: "Frontend Developer",
    description:
      "A weather forecast app with live location data, hourly and weekly views, and a fast, minimal UI.",
    tags: [
      "weatherapp",
      "weather",
      "forecast",
      "climate",
      "rain",
      "temperature",
      "geolocation",
      "location",
      "api",
      "frontend",
      "ui",
      "app",
      "application",
    ],
    href: "#",
    path: "~/projects/weatherapp",
    repo: "dahalujwal1000/Wheather_App", // note: the repo name has a typo ("Wheather")
  },
  {
    title: "3D Web Experiments",
    year: "2025",
    role: "WebGL / React Three Fiber",
    description:
      "An ongoing Three.js / React Three Fiber playground — particles, custom glows, parallax scenes and shader sketches.",
    tags: [
      "3d",
      "three",
      "threejs",
      "webgl",
      "r3f",
      "fiber",
      "particle",
      "particles",
      "shader",
      "shaders",
      "parallax",
      "scene",
      "scenes",
      "experiments",
      "playground",
      "graphics",
      "js",
    ],
    href: "#",
    path: "~/projects/three-experiments",
    repo: "dahalujwal1000/three-experiments",
  },
  {
    title: "Notes SaaS",
    year: "2026",
    role: "Backend Developer",
    description:
      "Notion-style notes SaaS — JWT auth, workspaces, autosave editor, Kanban boards and email verification. Live on Render.",
    tags: [
      "notes",
      "saas",
      "notes-saas",
      "notessaas",
      "api",
      "backend",
      "python",
      "jwt",
      "auth",
      "kanban",
      "notion",
      "rest",
      "app",
      "application",
    ],
    href: "https://notes-saas-001-final.onrender.com",
    path: "~/projects/notes-saas",
    repo: "dahalujwal1000/Notes_SaaS",
  },
  {
    title: "This Website",
    year: "2026",
    role: "Design + Build",
    description:
      "The site you're reading — React + TypeScript terminal-style portfolio with a GitHub-fed project list, an ~/ask-me.sh chatbot, a flashlight dot grid and dark/light theming.",
    tags: [
      "portfolio",
      "website",
      "site",
      "react",
      "typescript",
      "vite",
      "terminal",
      "chatbot",
      "css",
    ],
    href: "#",
    path: "~/projects/this-website",
    repo: "dahalujwal1000/My_Portfolio",
  },
];

// ==========================================================================
//  GitHub merge — manual entries absorb their repo's live data (stats +
//  README digest), and everything else discovered on GitHub is appended
//  unless hidden, capped at github.maxRepos. The snapshot lives in
//  src/github.gen.ts (npm run sync · also runs before every build). If the
//  API is down the last snapshot persists — the site never breaks.
// ==========================================================================

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function timeAgo(iso?: string): string {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function statsLine(p: Project): string {
  return [
    p.stars != null && p.stars > 0 ? `★ ${p.stars}` : "",
    p.language || "",
    p.updatedAt ? `updated ${timeAgo(p.updatedAt)}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function fromRepo(r: GithubRepo): Project {
  return {
    index: "",
    title: r.name,
    year: r.pushedAt.slice(0, 4),
    role: r.language || "Open Source",
    description:
      r.description || "No description yet — dive into the code on GitHub.",
    tags: Array.from(
      new Set(
        [r.name, ...r.topics, r.language]
          .filter(Boolean)
          .map((t) => t.toLowerCase())
      )
    ),
    href: r.homepage || r.url,
    path: `~/projects/${r.name.toLowerCase()}`,
    stars: r.stars,
    language: r.language,
    updatedAt: r.pushedAt,
    source: "github",
  };
}

const byRepo = new Map(githubRepos.map((r) => [norm(r.name), r]));
const claimed = new Set<string>();

const manual: Project[] = projectInputs.map((p) => {
  const key = norm((p.repo ?? p.title).split("/").pop() || p.title);
  const repo = byRepo.get(key);
  if (repo) claimed.add(norm(repo.name));
  return {
    index: "",
    title: p.title,
    year: p.year || (repo?.pushedAt ? repo.pushedAt.slice(0, 4) : ""),
    role: p.role || repo?.language || "",
    description: p.description,
    tags: p.tags,
    href:
      p.href && p.href !== "#" ? p.href : repo?.homepage || repo?.url || "#",
    path: p.path || `~/projects/${key}`,
    repo: repo ? `${github.user}/${repo.name}` : p.repo,
    stars: repo?.stars,
    language: repo?.language,
    updatedAt: repo?.pushedAt,
    source: "manual" as const,
  };
});

const hidden = new Set(github.hide.map(norm));
const rest = githubRepos
  .filter(
    (r) => !claimed.has(norm(r.name)) && !hidden.has(norm(r.name))
  )
  .map(fromRepo)
  .sort(
    (a, b) =>
      (b.stars ?? 0) - (a.stars ?? 0) ||
      (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );

const featured = github.featured
  .map((name) => rest.find((p) => norm(p.title) === norm(name)))
  .filter((p): p is Project => Boolean(p));

const auto: Project[] = [
  ...featured,
  ...rest.filter((p) => !featured.includes(p)),
].slice(0, github.maxRepos);

export const projects: Project[] = [...manual, ...auto].map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, "0"),
}));

// Explicit selection; summaries below are grounded in the repository READMEs.
const selected = [
  { name: "Digital_well-being", title: "Digital Wellbeing", description: "A Windows screen-time tracker with a system-tray engine, app and website usage, session history, and a Python dashboard." },
  { name: "norvic-hospital", title: "Norvic Hospital" },
  { name: "Wheather_App", title: "WeatherApp" },
  { name: "Research_Agent", title: "Research Agent", description: "A Python research pipeline that searches the web, extracts sources, and produces a structured Markdown report." },
  { name: "QAgent", title: "Security & QA Agent", description: "An agent that runs security scanners, dependency audits, link checks, and tests, then ranks their findings." },
  { name: "StudyMate-AI-Platform", title: "StudyMate AI", description: "An academic assistant for document summaries, questions with citations, quizzes, study planning, and progress tracking." },
];
export const selectedProjects: Project[] = selected.flatMap((item) => {
  const repo = byRepo.get(norm(item.name));
  if (!repo) return [];
  const project = manual.find((p) => norm(p.repo?.split("/").pop() ?? "") === norm(item.name)) ?? fromRepo(repo);
  return [{ ...project, title: item.title, description: item.description ?? project.description }];
}).map((p, i) => ({ ...p, index: String(i + 1).padStart(2, "0") }));
