import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const scrollToDemo = () => {
    document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Glow orb */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Help Us Weave
              <br />
              <span className="text-gradient-loom">This Fabric</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Try The Eternal Canvas. Imagine what you could build when data storage is 
              no longer a barrier. With DataLoom, the only limit is your creativity, 
              not your gas budget.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" size="xl" onClick={scrollToDemo}>
                Try The Eternal Canvas
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="glow" size="xl">
                View on GitHub
                <Github className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12"
          />

          {/* Footer content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
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
              <span className="text-lg font-bold text-foreground">
                Data<span className="text-gradient-loom">Loom</span>
              </span>
            </motion.div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Documentation", "GitHub", "Discord"].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ y: -2, color: "hsl(var(--foreground))" }}
                  className="transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5 text-muted-foreground" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-muted-foreground" />
              </motion.a>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Built with ❤️ for Arbitrum, Stylus, and every builder who dared to imagine a richer on-chain world.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
