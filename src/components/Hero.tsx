import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Built for Arbitrum Stylus
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up animation-delay-200">
            Weaving Rich Data Into
            <br />
            <span className="text-gradient-loom">The Blockchain</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-400">
            DataLoom is a Stylus-native storage primitive that enables dApps to store, 
            compress, and verifiably retrieve large datasets directly on Arbitrum—making 
            fully on-chain worlds finally practical.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-600">
            <Button variant="hero" size="xl">
              Try The Eternal Canvas
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glow" size="xl">
              Read Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/50">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-loom">10x</div>
              <div className="text-sm text-muted-foreground mt-1">Storage Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-loom">100%</div>
              <div className="text-sm text-muted-foreground mt-1">On-Chain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-loom">∞</div>
              <div className="text-sm text-muted-foreground mt-1">Composability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
