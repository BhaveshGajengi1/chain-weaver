import { Zap, GitBranch, Layers, ArrowDown } from "lucide-react";

const Solution = () => {
  const steps = [
    {
      icon: Zap,
      step: "01",
      title: "Compress",
      description: "Efficiently compress large data (images, maps, models) using Rust/WASM-powered algorithms directly on-chain.",
      color: "primary",
    },
    {
      icon: GitBranch,
      step: "02",
      title: "Weave",
      description: "Stitch compressed data into a verifiable Merkle tapestry stored permanently on Arbitrum.",
      color: "accent",
    },
    {
      icon: Layers,
      step: "03",
      title: "Unspool",
      description: "Retrieve and decompress data on-demand for other contracts within a single transaction.",
      color: "primary",
    },
  ];

  return (
    <section id="solution" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">The Solution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              What if You Could
              <br />
              <span className="text-gradient-loom">Compress Reality</span>
              <br />
              Before Stitching It Into The Chain?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DataLoom is a high-performance Rust/WASM smart contract that acts as a 
              programmable data loom—active, verifiable, and composable data infrastructure 
              native to Arbitrum.
            </p>
          </div>

          {/* Process steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary opacity-30 hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div
                    className={`flex flex-col lg:flex-row items-center gap-8 ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-mono mb-4 ${
                          step.color === "primary"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        STEP {step.step}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground max-w-md">{step.description}</p>
                    </div>

                    {/* Icon */}
                    <div className="relative">
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                          step.color === "primary"
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-accent/10 border border-accent/30"
                        }`}
                      >
                        <step.icon
                          className={`w-8 h-8 ${
                            step.color === "primary" ? "text-primary" : "text-accent"
                          }`}
                        />
                      </div>
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${
                          step.color === "primary" ? "bg-primary" : "bg-accent"
                        }`}
                      />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden lg:block" />
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-6 lg:hidden">
                      <ArrowDown className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
