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
  location: "Hyderabad, IN",
  tz: "GMT+5:30",
  // TODO: replace with a real email
  email: "you@example.com",
  github: "dahalujwal1000",
  githubUrl: "https://github.com/dahalujwal1000",
  // TODO: replace with a real LinkedIn handle
  linkedin: "in/ujwal",
  linkedinUrl: "https://www.linkedin.com/in/ujwal",
  status: "AVAILABLE",
  statusNote: "open to roles & freelance",
  stack: ["TS", "React", "Node", "Postgres", "Three.js", "Vite"],
};

export type Project = {
  index: string;
  title: string;
  year: string;
  role: string;
  description: string;
  href: string;
  path: string;
};

// TODO: replace the placeholder projects below with your real work.
export const projects: Project[] = [
  {
    index: "01",
    title: "Norvic Hospital",
    year: "2026",
    role: "Fullstack Developer",
    description:
      "Hospital management web app — appointments, patient records, and admin dashboards. (Replace with a real project + description.)",
    href: "#",
    path: "~/projects/norvic-hospital",
  },
  {
    index: "02",
    title: "WeatherApp",
    year: "2025",
    role: "Frontend Developer",
    description:
      "A weather forecast app with live location data and a clean, fast UI. (Replace with a real project + description.)",
    href: "#",
    path: "~/projects/weatherapp",
  },
  {
    index: "03",
    title: "3D Web Experiments",
    year: "2025",
    role: "WebGL / React Three Fiber",
    description:
      "An ongoing playground of Three.js scenes — particles, glows, parallax. (Replace with a real project + description.)",
    href: "#",
    path: "~/projects/three-experiments",
  },
];

export const terminalIntroduction = `// system connected to ${site.domain} — ask anything.`;

// Answers the interactive ~/ask-me.sh terminal widget understands.
// Match is loose: any question containing the keyword triggers it.
export const terminalAnswers: Record<string, string[]> = {
  stack: [
    "Core: TypeScript / React / Node / Postgres.",
    "Tooling: Vite · Three.js for webgl · Docker for deploys.",
  ],
  hire: [
    "Yes — open to full-time roles & freelance (Q3 2026).",
    `Replies in < 24h → ${site.email}`,
  ],
  available: [
    "Yes — open to full-time roles & freelance (Q3 2026).",
    `Replies in < 24h → ${site.email}`,
  ],
  projects: [
    "Run `$ ls -al /projects` below 👇",
    "3 featured — more on GitHub @dahalujwal1000.",
  ],
  contact: [
    "Use the form below, or mail me directly:",
    `${site.email}`,
  ],
  host: [
    "Deployed on Vercel — git push → auto deploy. Free & fast.",
  ],
  fallback: [
    "I don't know that one yet 🤖",
    "Try: stack / hire / projects / contact / host",
  ],
};