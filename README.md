# Ujwal's portfolio

React + TypeScript portfolio with a terminal-style interface, six curated projects, a local project Q&A widget, and a Web3Forms contact form.

## Development

Use Node 20.19+ or 22.12+ (Node 24 works).

    npm ci
    npm run dev
    npm run check
    npm run build
    npm run preview
    npm audit

Build refreshes public GitHub metadata, checks TypeScript, and writes static files to dist/. A failed metadata fetch preserves the existing snapshot. Build does not publish anything. Deployment and custom-domain changes are on hold.

## Content

- src/content.ts: identity, About copy, projects, and local Q&A answers.
- selectedProjects: explicit six-project selection, grounded in repository descriptions/READMEs.
- src/github.gen.ts: generated snapshot; refresh with npm run sync.
- public/projects/digital-wellbeing.png: actual app preview captured with sample data; not a usage claim.
- Set about.photo to a real image path to show a portrait. Without one, About uses a text layout.
- Set site.linkedinUrl only after verifying your own profile URL.

## Contact form

Set VITE_WEB3FORMS_ACCESS_KEY in .env (see .env.example). The Web3Forms access key is public by design; never put secret credentials in VITE_ variables.

The form uses Web3Forms' documented shared hCaptcha site key. Enable hCaptcha as the spam-blocking method in your Web3Forms dashboard to require verification on the server. The frontend sends the token and blocks empty CAPTCHA submissions, but dashboard enforcement cannot be configured in this repository.

Failed requests preserve the visitor's draft. Requests time out after 20 seconds; an uncertain delivery is described as unconfirmed. Without an access key, the form opens a populated email draft instead of claiming success.

References:
- https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha
- https://docs.web3forms.com/getting-started/faq

## Structure

    src/pages/HomePage.tsx       Hero, project rail, contact
    src/pages/AboutPage.tsx      About page
    src/components/Terminal.tsx  Local keyword-based Q&A (not an LLM)
    src/hooks/useHashRoute.ts    Home/About hash navigation
    src/index.css               Theme, layout, responsive styles
    scripts/sync-github.mjs      Public repository metadata fetch

Dependabot configuration is included for weekly dependency updates once pushed. No deployment workflow is enabled by these changes.

## Browser regression checks

Run npm test with Chrome installed (or set BROWSER_CHANNEL=msedge for Edge). The check starts and stops an isolated local server on port 5181. CAPTCHA and form delivery are stubbed; it never sends mail. It checks responsive layouts, carousel limits, CAPTCHA resets, form failures, draft preservation, and navigation.
