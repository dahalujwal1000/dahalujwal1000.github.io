import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import ProjectsSection from "../components/ProjectsSection";

const ContactSection = lazy(() => import("../components/ContactSection"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>
    </>
  );
}
