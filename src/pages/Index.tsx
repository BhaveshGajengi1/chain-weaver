import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Demo from "@/components/Demo";
import UseCases from "@/components/UseCases";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";
import WeavePattern from "@/components/WeavePattern";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <WeavePattern />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Demo />
        <UseCases />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
