import { Code2, GitBranch, Link2, Brush } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUpVariants, staggerContainer } from "@/hooks/useScrollAnimation";
import { useState } from "react";

const TechStack = () => {
  const { ref, isInView } = useScrollAnimation();
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const features = [
    {
      icon: Code2,
      emoji: "🦀",
      title: "Rust Core",
      description: "Core written in Rust for Stylus, featuring a custom compression adaptor.",
    },
    {
      icon: GitBranch,
      emoji: "🌳",
      title: "On-Chain Merkleization",
      description: "Cheap, verifiable data proofs using on-chain Merkle tree structures.",
    },
    {
      icon: Link2,
      emoji: "🔗",
      title: "Seamless Composability",
      description: "Any Stylus or EVM contract can query and use DataLoom-stored data.",
    },
    {
      icon: Brush,
      emoji: "🎨",
      title: "Full Demo dApp",
      description: "Pixel-perfect frontend interacting directly with the chain.",
    },
  ];

  const codeLines = [
    { type: "comment", content: "// Store data with automatic compression" },
    { type: "decorator", content: "#[external]" },
    { type: "function", content: "fn store_data(data: Vec<u8>) -> DataKey {" },
    { type: "code", content: "    let compressed = self.compress(&data);" },
    { type: "code", content: "    let key = self.weave(compressed);" },
    { type: "code", content: "    key" },
    { type: "function", content: "}" },
  ];

  return (
    <section className="py-24 relative" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Technical
              <span className="text-gradient-loom"> Highlights</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We use Stylus not for its speed alone, but for its computational capability 
              to solve a problem that was previously "impossible" on any EVM chain.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-300 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl mb-4"
                >
                  {feature.emoji}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Code preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-destructive/60" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-primary/60" />
                  <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-accent/60" />
                </div>
                <span className="text-sm text-muted-foreground font-mono">dataloom.rs</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-1">
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                      onMouseEnter={() => setHoveredLine(index)}
                      onMouseLeave={() => setHoveredLine(null)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        hoveredLine === index ? "bg-primary/10" : ""
                      }`}
                    >
                      {line.type === "comment" && (
                        <span className="text-accent">{line.content}</span>
                      )}
                      {line.type === "decorator" && (
                        <span className="text-primary">{line.content}</span>
                      )}
                      {line.type === "function" && (
                        <span>
                          <span className="text-foreground">{line.content.includes("fn") ? "fn " : ""}</span>
                          <span className="text-accent">{line.content.replace("fn ", "").split("(")[0]}</span>
                          <span className="text-foreground">{line.content.includes("(") ? "(" + line.content.split("(")[1] : line.content}</span>
                        </span>
                      )}
                      {line.type === "code" && (
                        <span className="text-muted-foreground">{line.content}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
