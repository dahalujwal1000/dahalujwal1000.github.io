// ==========================================================================
//  EDIT ME — every string on the site is sourced from this file.
//  Change your name, links, projects, and the terminal answers here.
//  TODO: replace placeholders with your real details before deploying.
// ==========================================================================

export const site = {
  // TODO: pick the domain you will actually deploy to
  domain: "ujwal.dev",
  name: "Ujwal",
  role: "Full-Stack Developer | 3D Web Explorer | Remote",
  tagline:
    "I build and ship software end-to-end — web and mobile. From real-time dashboards to design systems, I care about fast, clean, well-crafted products. You are reading the source of this site right now.",
  location: "Kathmandu, Nepal",
  tz: "GMT+5:45",
  email: "dahal.ujwal1000@gmail.com",
  github: "dahalujwal1000",
  githubUrl: "https://github.com/dahalujwal1000",
  // TODO: replace with a real LinkedIn handle
  linkedin: "in/ujwal",
  linkedinUrl: "https://www.linkedin.com/in/ujwal",
  status: "AVAILABLE",
  statusNote: "open to roles & freelance",
  stack: ["TS", "React", "Node", "Postgres", "Three.js", "Vite"],
};

// About page — your "$ whoami" details. Edit freely.
export const about = {
  accent: "Full-stack developer",
  intro:
    "who can't rest until I understand what's under the hood — whether that's a codebase, a system, or something I'm building in the garage.",
  // TODO: adjust to your languages
  speaks: "Nepali (native), English (fluent), Hindi",
  // drop a photo into public/ (e.g. portrait.jpg) and set photo: "/portrait.jpg"
  photo: "",
};

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
  readMe?: string;
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
    p.stars != null ? `★ ${p.stars}` : "",
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
    readMe: r.readMe,
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
    readMe: repo?.readMe,
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

export const terminalIntroduction = `// connected to ${site.domain} — ask anything.`;

// ==========================================================================
//  ~/ask-me.sh — the chatbot "fine-tunes" itself from this file.
//  - Project Q&A is generated automatically from the `projects` array above
//    (title + tags + description) — edit those and the bot learns instantly.
//  - Everything else lives in `chatTopics` below: add a topic (keywords +
//    answer lines) to teach the bot something new.
//  Matching is loose: single words hit as tokens, multi-word phrases must
//  appear verbatim, and trailing "s" is stemmed away on both sides.
// ==========================================================================

export type ChatTopic = { keywords: string[]; answers: string[] };

// The suggestion chips rendered above the input, like the reference site.
export const chatChips: string[] = [
  "what is your stack?",
  "are you available for hire?",
  "tell me about a recent project",
  "how was this site built?",
];

export const chatTopics: ChatTopic[] = [
  {
    keywords: [
      "stack",
      "tech",
      "technologies",
      "tool",
      "tools",
      "language",
      "languages",
      "framework",
      "frameworks",
      "typescript",
      "react",
      "node",
      "postgres",
      "vite",
    ],
    answers: [
      "Core: TypeScript / React / Node / Postgres.",
      "3D & graphics: Three.js + React Three Fiber.",
      "Tooling: Vite, git — plus whatever the job needs.",
    ],
  },
  {
    keywords: [
      "hire",
      "hiring",
      "available",
      "availability",
      "freelance",
      "job",
      "jobs",
      "role",
      "roles",
      "opportunity",
      "opportunities",
      "recruit",
      "recruiter",
      "open to work",
    ],
    answers: [
      `Yes — ${site.status.toLowerCase()} · ${site.statusNote}.`,
      `Fastest route → ${site.email} (replies in < 24h).`,
    ],
  },
  {
    keywords: [
      "contact",
      "email",
      "mail",
      "reach",
      "message",
      "touch",
      "linkedin",
      "call",
      "dm",
    ],
    answers: [
      "The form is right below this chat 👇",
      `Or mail ${site.email} directly — replies < 24h.`,
      `LinkedIn: ${site.linkedinUrl}`,
    ],
  },
  {
    keywords: [
      "site",
      "website",
      "portfolio",
      "built",
      "build",
      "deploy",
      "deployed",
      "deploying",
      "hosting",
      "host",
      "hosted",
      "vercel",
      "source",
      "made",
    ],
    answers: [
      "React + TypeScript on Vite — no UI framework, hand-rolled CSS.",
      "The dot grid and this terminal are built from scratch.",
      "Deployed on Vercel: git push → auto deploy.",
    ],
  },
  {
    keywords: [
      "who",
      "about",
      "yourself",
      "intro",
      "introduce",
      "background",
      "bio",
      "ujwal",
      "location",
      "based",
      "where",
    ],
    answers: [
      `${site.name} — ${site.role}.`,
      `Based in ${site.location} (${site.tz}). ${site.tagline}`,
    ],
  },
  {
    keywords: [
      "project",
      "projects",
      "recent",
      "latest",
      "showcase",
      "featured",
    ],
    answers: [
      `Featured work — ${projects.length} on this site:`,
      ...projects.map(
        (p) =>
          `[${p.index}] ${p.title} — ${[p.year, p.role]
            .filter(Boolean)
            .join(" · ")}`
      ),
      `Ask about one by name — e.g. "tell me about ${projects[0].title
        .split(" ")[0]
        .toLowerCase()}". More on github → @${site.github}.`,
    ],
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "sup", "thanks", "thank", "cool", "awesome", "nice"],
    answers: ["👋 hey. Ask about the projects, the stack — or how to hire me."],
  },
];

export const chatFallback: string[] = [
  "// command not found — I'm a small terminal, not an LLM (yet).",
  "Try the chips below, or ask about a project by name.",
];