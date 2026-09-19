import { projects } from "./content";
import { site } from "./site";

export type ChatTopic = { keywords: string[]; answers: string[] };

export const chatTopics: ChatTopic[] = [
  {
    keywords: ["stack", "tech", "technologies", "tool", "tools", "language", "languages", "framework", "frameworks", "typescript", "react", "node", "postgres", "vite"],
    answers: [
      "Core: TypeScript / React / Node / Postgres.",
      "3D & graphics: Three.js + React Three Fiber.",
      "Tooling: Vite, git — plus whatever the job needs.",
    ],
  },
  {
    keywords: ["hire", "hiring", "available", "availability", "freelance", "job", "jobs", "role", "roles", "opportunity", "opportunities", "recruit", "recruiter", "open to work"],
    answers: [
      "Yes — " + site.status.toLowerCase() + " · " + site.statusNote + ".",
      "Fastest route → " + site.email + " (replies in < 24h).",
    ],
  },
  {
    keywords: ["contact", "email", "mail", "reach", "message", "touch", "linkedin", "call", "dm"],
    answers: [
      "The form is right below this chat 👇",
      "Or mail " + site.email + " directly — replies < 24h.",
      "LinkedIn: " + site.linkedinUrl,
    ],
  },
  {
    keywords: ["site", "website", "portfolio", "built", "build", "deploy", "deployed", "deploying", "hosting", "host", "hosted", "vercel", "source", "made"],
    answers: [
      "React + TypeScript on Vite — no UI framework, hand-rolled CSS.",
      "The dot grid and this terminal are built from scratch.",
      "Deployed on Vercel: git push → auto deploy.",
    ],
  },
  {
    keywords: ["who", "about", "yourself", "intro", "introduce", "background", "bio", "ujwal", "location", "based", "where"],
    answers: [
      site.name + " — " + site.role + ".",
      "Based in " + site.location + " (" + site.tz + "). " + site.tagline,
    ],
  },
  {
    keywords: ["project", "projects", "recent", "latest", "showcase", "featured"],
    answers: [
      "Featured work — " + projects.length + " on this site:",
      ...projects.map((project) =>
        "[" + project.index + "] " + project.title + " — " +
        [project.year, project.role].filter(Boolean).join(" · ")
      ),
      "Ask about one by name. More on github → @" + site.github + ".",
    ],
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "sup", "thanks", "thank", "cool", "awesome", "nice"],
    answers: ["👋 hey. Ask about the projects, the stack — or how to hire me."],
  },
];

export const chatFallback = [
  "// command not found — I'm a small terminal, not an LLM (yet).",
  "Try the chips below, or ask about a project by name.",
];
