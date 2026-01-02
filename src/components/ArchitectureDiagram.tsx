import { motion } from "framer-motion";
import { useScrollAnimation, fadeUpVariants } from "@/hooks/useScrollAnimation";
import { Database, Cpu, Shield, Layers } from "lucide-react";

const ArchitectureDiagram = () => {
    const { ref, isInView } = useScrollAnimation();

    const components = [
        {
            id: "user",
            label: "User Layer",
            icon: Database,
            description: "dApps & Smart Contracts",
            position: "top",
        },
        {
            id: "dataloom",
            label: "DataLoom Contract",
            icon: Cpu,
            description: "Compression & Merkle Engine",
            position: "middle",
        },
        {
            id: "stylus",
            label: "Arbitrum Stylus",
            icon: Shield,
            description: "High-Performance Execution",
            position: "bottom",
        },
    ];

    const modules = [
        {
            label: "Compression",
            icon: Layers,
            color: "primary",
        },
        {
            label: "Merkle Tree",
            icon: Shield,
            color: "accent",
        },
        {
            label: "Storage",
            icon: Database,
            color: "primary",
        },
    ];

    return (
        <section className="py-32 relative overflow-hidden" ref={ref}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={fadeUpVariants}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                            <Cpu className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">System Architecture</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            How <span className="text-gradient-primary">DataLoom</span> Works
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                            A layered architecture designed for maximum efficiency and verifiability
                        </p>
                    </motion.div>

                    {/* Main architecture diagram */}
                    <div className="relative">
                        {/* Vertical connecting lines */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary opacity-30 hidden md:block" />

                        {/* Layer components */}
                        <div className="space-y-12">
                            {components.map((component, index) => (
                                <motion.div
                                    key={component.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                                    className="relative"
                                >
                                    <div className="flex items-center justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="card-premium max-w-md w-full group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Icon */}
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                                    <component.icon className="w-7 h-7 text-primary" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold mb-1 group-hover:text-gradient-primary transition-all duration-300">
                                                        {component.label}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {component.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Connection arrow */}
                                    {index < components.length - 1 && (
                                        <motion.div
                                            animate={{ y: [0, 8, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="flex justify-center my-6"
                                        >
                                            <div className="text-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 5v14m0 0l-7-7m7 7l7-7" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Data flow modules */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-20"
                    >
                        <h3 className="text-2xl font-bold text-center mb-10">
                            Internal <span className="text-gradient-accent">Data Flow</span>
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {modules.map((module, index) => (
                                <motion.div
                                    key={module.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-xl p-6 text-center group cursor-pointer"
                                >
                                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${module.color === "primary" ? "from-primary/20 to-primary/5 border border-primary/30" : "from-accent/20 to-accent/5 border border-accent/30"
                                        } flex items-center justify-center`}>
                                        <module.icon className={`w-6 h-6 ${module.color === "primary" ? "text-primary" : "text-accent"}`} />
                                    </div>
                                    <h4 className="font-semibold group-hover:text-gradient-primary transition-all duration-300">
                                        {module.label}
                                    </h4>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Data flow arrows between modules */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="hidden md:flex items-center justify-center gap-4 mt-8"
                    >
                        <div className="text-muted-foreground text-sm">Data flows through each module sequentially</div>
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-primary"
                        >
                            →
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ArchitectureDiagram;
