import { useEffect, useState, type MouseEvent } from "react";
import { site } from "../site";
import useHashRoute from "../hooks/useHashRoute";

const SECTION_IDS = ["home", "projects", "contact"];

const LINKS: { href: string; id?: string; label: string }[] = [
  { href: "#/", label: "home", id: "home" },
  { href: "#projects", label: "projects", id: "projects" },
  { href: "#contact", label: "contact", id: "contact" },
  { href: "#/about", label: "about" },
];

type Theme = "dark" | "light";

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Nav() {
  // the inline script in index.html has already applied any saved theme
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark"
  );
  const route = useHashRoute();
  const [active, setActive] = useState("home");

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — theme just won't persist */
    }
  };

  // scroll-spy across the home-page sections; ~/about owns its own page
  useEffect(() => {
    if (route !== "home") {
      setActive("about");
      return;
    }
    const observers = SECTION_IDS.flatMap((id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      return [obs];
    });
    // at the very bottom of the page, mark the last section active
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4
        ) {
          setActive((current) => current === "contact" ? current : "contact");
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [route]);

  // logo: scroll to top when already home; from ~/about the default
  // navigation to #/ happens and useHashRoute jumps to the top
  const onBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (route === "home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // section links scroll in-page on home; from another page they go home first
  const onNavClick = (id?: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!id) return; // ~/about — normal page navigation
    if (route !== "home") {
      e.preventDefault();
      window.location.hash = "#/";
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else if (id === "home") {
      // hash is already #/ — no event fires, so scroll manually
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [brandName, ...brandTld] = site.domain.split(".");

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a
          className="brand"
          href="#/"
          onClick={onBrandClick}
          aria-label={site.domain + " — go to home"}
        >
          <span className="dot" aria-hidden="true" />
          {brandName}
          {brandTld.length > 0 && (
            <span className="brand-tld dim">.{brandTld.join(".")}</span>
          )}
        </a>
        <nav className="nav-links" aria-label="Pages">
          {LINKS.map((link) => {
            const isActive =
              link.id ? active === link.id && route === "home" : route === "about";
            return (
              <a
                key={link.label}
                href={link.href}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavClick(link.id)}
              >
                <span className="tilde" aria-hidden="true">
                  ~/
                </span>
                {link.label}
              </a>
            );
          })}
        </nav>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
