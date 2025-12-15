import { Code2, GitBranch, Link2, Brush } from "lucide-react";

const TechStack = () => {
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

  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Technical
              <span className="text-gradient-loom"> Highlights</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We use Stylus not for its speed alone, but for its computational capability 
              to solve a problem that was previously "impossible" on any EVM chain.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Code preview */}
          <div className="mt-16">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                </div>
                <span className="text-sm text-muted-foreground font-mono">dataloom.rs</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <code>
                    <span className="text-accent">// Store data with automatic compression</span>{"\n"}
                    <span className="text-primary">#[external]</span>{"\n"}
                    <span className="text-foreground">fn </span>
                    <span className="text-accent">store_data</span>
                    <span className="text-foreground">(data: </span>
                    <span className="text-primary">Vec&lt;u8&gt;</span>
                    <span className="text-foreground">) -&gt; </span>
                    <span className="text-primary">DataKey</span>
                    <span className="text-foreground"> {"{"}</span>{"\n"}
                    <span className="text-foreground">    </span>
                    <span className="text-muted-foreground">let</span>
                    <span className="text-foreground"> compressed = </span>
                    <span className="text-accent">self</span>
                    <span className="text-foreground">.compress(&data);</span>{"\n"}
                    <span className="text-foreground">    </span>
                    <span className="text-muted-foreground">let</span>
                    <span className="text-foreground"> key = </span>
                    <span className="text-accent">self</span>
                    <span className="text-foreground">.weave(compressed);</span>{"\n"}
                    <span className="text-foreground">    key</span>{"\n"}
                    <span className="text-foreground">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
