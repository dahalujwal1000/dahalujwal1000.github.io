# My Portfolio



## Stack

- **React 18 + TypeScript + Vite**
- Plain CSS (CSS custom properties) — no UI framework
- Google Fonts → JetBrains Mono
- Deploy target: Vercel (static, free)

## Quick start

```bash
npm install
npm run dev      # local dev  → http://localhost:5173
npm run sync     # refresh GitHub data into src/github.gen.ts
npm run build    # sync + type-check + production build (dist/)
npm run preview  # preview the production build
```

## Customize

All site content (name, links, projects, terminal answers) lives in a single file:

```
src/content.ts   <- edit everything here
```

**Projects & the chatbot are fed from GitHub automatically.** `npm run sync`
(also runs before every build) harvests your public repos — description,
topics, language, stars, README digest — into `src/github.gen.ts`. Anything
found there shows up on the site and becomes chatbot knowledge. Hand-listed
projects in `content.ts` can claim a repo via `repo: "owner/name"` (stats +
README flow in, no double-listing), hide unwanted repos via `github.hide`,
and rewrite anything the machine got wrong — your words always win.

## Project structure

```
src/
  content.ts              <- edit everything here
  github.gen.ts           <- GENERATED from GitHub (npm run sync)
  App.tsx                 <- hash router (#/ · #/projects · #/about · #/contact)
  main.tsx
  index.css
  hooks/
    useHashRoute.ts       <- tiny hash router (no dependency)
    useReveal.ts          <- scroll-reveal (IntersectionObserver)
  pages/
    HomePage.tsx          <- hero + chatbot + featured project cards
    ProjectsPage.tsx      <- all projects as cards
    AboutPage.tsx         <- $ whoami (details + photo card)
    ContactPage.tsx       <- contact form
  components/
    DotBackground.tsx     <- flashlight dot grid (CSS layers + pointer-following mask)
    ProjectCard.tsx       <- shared project card
    Nav.tsx
    Hero.tsx
    Terminal.tsx          <- ~/ask-me.sh chatbot (answers generated from content.ts)
    Footer.tsx
scripts/
  sync-github.mjs         <- build-time GitHub harvester (no keys needed)
```

## Roadmap

- [x] Projects + chatbot fed automatically from GitHub (build-time sync)
- [x] Wire the contact form (Web3Forms — free; set `VITE_WEB3FORMS_ACCESS_KEY` in `.env`, see `.env.example`)
- [ ] Optional 3D hero object (Three.js / React Three Fiber)