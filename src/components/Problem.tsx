import { AlertTriangle, Server, DollarSign, Lock } from "lucide-react";

const Problem = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "Prohibitive Costs",
      description: "Storing just 1KB on Ethereum can cost $10+. Rich applications are economically impossible.",
    },
    {
      icon: Server,
      title: "Forced Centralization",
      description: "Developers resort to off-chain storage, sacrificing the decentralization they came for.",
    },
    {
      icon: Lock,
      title: "Broken Composability",
      description: "Off-chain data can't be verified or accessed by other smart contracts.",
    },
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">The Problem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              The On-Chain Data
              <br />
              <span className="text-muted-foreground">Dilemma</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Imagine building the next great on-chain game, a decentralized social network, 
              or an autonomous virtual world. Then you hit the wall: storing that universe is 
              impossibly expensive.
            </p>
          </div>

          {/* Problem cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-destructive/30 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    <problem.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual separator */}
          <div className="mt-20 flex items-center justify-center">
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
