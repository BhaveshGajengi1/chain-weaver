import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-loom flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
              <path d="M8 3v18M16 3v18" strokeOpacity="0.5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">
            Data<span className="text-gradient-loom">Loom</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-muted-foreground hover:text-foreground transition-colors">
            Problem
          </a>
          <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
            Solution
          </a>
          <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </a>
          <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
            Use Cases
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Docs
          </Button>
          <Button variant="hero" size="sm">
            Try Demo
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
