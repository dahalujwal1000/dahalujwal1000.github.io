import DotBackground from "./components/DotBackground";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import useReveal from "./hooks/useReveal";
import useHashRoute from "./hooks/useHashRoute";

export default function App() {
  const route = useHashRoute();
  // re-run the reveal observer whenever the page changes
  useReveal(route);

  return (
    <>
      <DotBackground />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav />
      <main id="main-content" tabIndex={-1}>{route === "home" ? <HomePage /> : <AboutPage />}</main>
      <Footer />
    </>
  );
}