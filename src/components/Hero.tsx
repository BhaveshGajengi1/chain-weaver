import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Database, Zap, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToDemo = () => {
    document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Enhanced gradient background with mesh */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 animate-blob"
        style={{
          background: "radial-gradient(circle, hsl(38, 92%, 55%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 animate-blob animation-delay-400"
        style={{
          background: "radial-gradient(circle, hsl(200, 80%, 50%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: -mousePosition.x * 1.5,
          y: -mousePosition.y * 1.5,
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-[350px] h-[350px] rounded-full opacity-25 animate-blob animation-delay-700"
        style={{
          background: "radial-gradient(circle, hsl(280, 70%, 50%) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Built for Arbitrum Stylus
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              DataLoom
              <br />
              <span className="text-gradient-primary">
                The On-Chain Data Fabric
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Cost-effective, verifiable, fully on-chain data storage and compression.
              Making rich, persistent worlds on Arbitrum finally practical.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToDemo}
                className="btn-premium text-background flex items-center gap-2"
              >
                Try The Eternal Canvas
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="glass border-glow">
                  Read Documentation
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Database, label: "Rust/WASM Compression" },
                { icon: Shield, label: "Merkle Proofs" },
                { icon: Zap, label: "Fast Retrieval" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="p-2 rounded-lg glass">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              className="relative z-10"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src="/hero-data-fabric.png"
                alt="Data Fabric Visualization"
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Glow effect behind image */}
              <div className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full scale-75 animate-pulse-glow" />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/30 max-w-3xl mx-auto"
        >
          {[
            { value: "10x", label: "Storage Savings" },
            { value: "100%", label: "On-Chain" },
            { value: "∞", label: "Composability" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-gradient-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

