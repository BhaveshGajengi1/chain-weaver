import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import Demo from "@/components/Demo";
import Gallery from "@/components/Gallery";
import UseCases from "@/components/UseCases";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";
import WeavePattern from "@/components/WeavePattern";

const Index = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <WeavePattern />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <ArchitectureDiagram />
        <Demo />
        <Gallery />
        <UseCases />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

