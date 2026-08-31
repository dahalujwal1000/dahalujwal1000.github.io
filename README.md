# My Portfolio

> Portfolio site — dark terminal/CLI aesthetic, inspired by [akkila.dev](https://akkila.dev/#top).

## Stack

- **React 18 + TypeScript + Vite**
- Plain CSS (CSS custom properties) — no UI framework
- Google Fonts → JetBrains Mono
- Deploy target: Vercel (static, free)

## Quick start

```bash
npm install
npm run dev      # local dev  → http://localhost:5173
npm run build    # type-check + production build (dist/)
npm run preview  # preview the production build
```

## Customize

All site content (name, links, projects, terminal answers) lives in a single file:

```
src/content.ts   <- edit everything here
```

## Project structure

```
src/
  content.ts              <- edit everything here
  App.tsx
  main.tsx
  index.css
  hooks/useReveal.ts      <- scroll-reveal (IntersectionObserver)
  components/
    DotBackground.tsx     <- interactive cursor-repel dot grid (full-page canvas)
    Nav.tsx
    Hero.tsx
    Terminal.tsx          <- interactive ~/ask-me.sh widget
    Projects.tsx
    Contact.tsx
    Footer.tsx
```

## Roadmap

- [ ] Replace placeholder projects with real work
- [ ] Wire the contact form to a backend (Formspree / Resend)
- [ ] Optional 3D hero object (Three.js / React Three Fiber)