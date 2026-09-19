import { githubReadMes } from "./github-readmes.gen";
import { projects, statsLine, type Project } from "./content";
import { site } from "./site";
import { chatFallback, chatTopics } from "./terminal-content";

type Intent = { keywords: string[]; lines: string[]; weight?: number };

const tokenize = (value: string) =>
  value.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);

const stem = (token: string) =>
  token.length > 3 && token.endsWith("s") && !token.endsWith("ss") && !token.includes(".")
    ? token.slice(0, -1)
    : token;

function scoreIntent(question: string, tokens: string[], intent: Intent) {
  let score = 0;
  for (const keyword of intent.keywords) {
    const normalized = stem(keyword.toLowerCase());
    if (keyword.includes(" ")) {
      if (question.includes(keyword)) score += 3;
    } else if (tokens.some((token) => token === normalized)) {
      score += 2;
    } else if (
      normalized.length >= 5 &&
      tokens.some((token) => token.length >= 3 && (token.startsWith(normalized) || normalized.startsWith(token)))
    ) {
      score += 1;
    }
  }
  return score;
}

function readMeLines(project: Project, max = 2) {
  const repoName = project.repo?.split("/").pop() || project.title;
  const digest = githubReadMes[repoName] || "";
  if (!digest) return [];
  const sentences = digest.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/);
  const lines: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current + " " + sentence).length > 220) {
      lines.push(current);
      if (lines.length === max) return lines.map((line) => "readme → " + line);
      current = sentence;
    } else {
      current = (current + " " + sentence).trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, max).map((line) => "readme → " + line);
}

const projectIntent = (project: Project): Intent => ({
  keywords: [
    project.title.toLowerCase(),
    ...Array.from(new Set([
      ...tokenize(project.title),
      ...tokenize(project.path),
      ...project.tags.map((tag) => tag.toLowerCase()),
    ])),
  ],
  lines: [
    "[" + project.index + "] " + project.title + " — " +
      [project.year, project.role].filter(Boolean).join(" · "),
    project.description,
    ...(statsLine(project) ? [statsLine(project)] : []),
    ...readMeLines(project),
    project.path + " · " +
      (/github\.com/.test(project.href || site.githubUrl) ? "code" : "live") +
      " → " + (project.href && project.href !== "#" ? project.href : site.githubUrl),
  ],
  weight: 1.25,
});

const intents: Intent[] = [
  ...chatTopics.map((topic) => ({ keywords: topic.keywords, lines: topic.answers })),
  ...projects.map(projectIntent),
];

export function answerFor(question: string) {
  const normalized = question.toLowerCase();
  const tokens = tokenize(normalized).map(stem);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = scoreIntent(normalized, tokens, intent) * (intent.weight ?? 1);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best && bestScore >= 2 ? best.lines : chatFallback;
}
