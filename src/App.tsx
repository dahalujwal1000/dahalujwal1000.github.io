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
      <Nav />
      <main>{route === "home" ? <HomePage /> : <AboutPage />}</main>
      <Footer />
    </>
  );
}