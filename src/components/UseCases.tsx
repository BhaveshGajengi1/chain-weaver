import { Gamepad2, MessageCircle, Brain, ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUpVariants, staggerContainer } from "@/hooks/useScrollAnimation";

const UseCases = () => {
  const { ref, isInView } = useScrollAnimation();

  const useCases = [
    {
      icon: Gamepad2,
      title: "On-Chain Games",
      subtitle: "Autonomous Worlds",
      description: "Store game assets, maps, and player states entirely on-chain. Build persistent virtual worlds that live forever.",
    },
    {
      icon: MessageCircle,
      title: "Social Feeds",
      subtitle: "Rich Media",
      description: "Enable decentralized social platforms with images, videos, and rich content stored verifiably on-chain.",
    },
    {
      icon: Brain,
      title: "ML Datasets",
      subtitle: "Training Data",
      description: "Store and share machine learning datasets with provenance and verifiability built in.",
    },
    {
      icon: ScrollText,
      title: "Protocol Logs",
      subtitle: "Audit Trails",
      description: "Cheap, verifiable log storage for DeFi protocols, DAOs, and any application requiring audit trails.",
    },
  ];

  return (
    <section id="use-cases" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
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
              Expanding The Frontier
              <br />
              <span className="text-muted-foreground">of What's Possible</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DataLoom isn't just another dApp. It's a fundamental primitive that unlocks 
              entirely new verticals for the Arbitrum ecosystem.
            </p>
          </motion.div>

          {/* Use case grid */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-colors duration-300 overflow-hidden"
              >
                {/* Hover effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                />
                
                {/* Icon glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors"
                    >
                      <useCase.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold">{useCase.title}</h3>
                      <span className="text-sm text-primary font-mono">{useCase.subtitle}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
