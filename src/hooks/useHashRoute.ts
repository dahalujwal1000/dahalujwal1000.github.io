import { useEffect, useState } from "react";

export type Route = "home" | "about";

// "#/..." hashes are page routes; plain "#section" hashes are in-page
// anchors on the home page and don't change the route.
const parse = (hash: string): Route | null => {
  if (!hash.startsWith("#/")) return null;
  const h = hash.slice(2).replace(/\/+$/, "").toLowerCase();
  return h === "about" ? "about" : "home";
};

/**
 * Tiny hash router — home at #/, about at #/about. Anchor hashes
 * (#projects, #contact) scroll within the home page untouched.
 */
export default function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(
    () => parse(window.location.hash) ?? "home"
  );

  useEffect(() => {
    const onChange = () => {
      const next = parse(window.location.hash);
      if (!next || next === route) return; // anchor scroll — not a page change
      setRoute(next);
      // jump to the top of the new page — bypass CSS smooth scrolling
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, [route]);

  return route;
}