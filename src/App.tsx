import DotBackground from "./components/DotBackground";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import useReveal from "./hooks/useReveal";

export default function App() {
  useReveal();

  return (
    <>
      <DotBackground />
      <Nav />
      <main id="top">
        <Hero />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}