import { Archive, GitBranch, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUpVariants } from "@/hooks/useScrollAnimation";

const Solution = () => {
  const { ref, isInView } = useScrollAnimation();

  const features = [
    {
      icon: Archive,
      title: "Compression Engine",
      description: "Efficient Rust/WASM-powered compression for on-chain data. Reduce storage costs by up to 10x while maintaining full verifiability.",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      borderColor: "border-primary/30",
    },
    {
      icon: GitBranch,
      title: "Merkle Fabric",
      description: "Chunked Merkle structure for proof-driven storage. Every byte is verifiable with cryptographic guarantees.",
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
      borderColor: "border-accent/30",
    },
    {
      icon: Zap,
      title: "Proof Retrieval",
      description: "Fast, secure decompression with on-chain proofs. Access your data within a single transaction with zero trust assumptions.",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      borderColor: "border-primary/30",
    },
  ];

  return (
    <section id="solution" className="py-32 relative overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Product Overview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Three Core Pillars of
              <br />
              <span className="text-gradient-primary">On-Chain Data Storage</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              DataLoom combines compression, verification, and retrieval into a seamless
              on-chain experience. Built with Rust and Stylus for maximum performance.
            </p>
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group"
              >
                <div className="card-premium h-full flex flex-col">
                  {/* Icon container with animated background */}
                  <div className="relative mb-6">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} flex items-center justify-center relative z-10`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </motion.div>
                    {/* Animated glow */}
                    <motion.div
                      className={`absolute inset-0 ${feature.iconColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-30 blur-2xl rounded-2xl transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient-primary transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${feature.iconColor.replace('text-', 'bg-')} animate-pulse`} />
                      <span>Fully On-Chain</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass">
              <span className="text-sm text-muted-foreground">
                Powered by Arbitrum Stylus for maximum efficiency
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Solution;

