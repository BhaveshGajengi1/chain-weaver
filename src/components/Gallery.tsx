import { motion } from "framer-motion";
import { useScrollAnimation, fadeUpVariants } from "@/hooks/useScrollAnimation";
import { useGallery } from "@/hooks/useDataLoom";
import { Image, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const { ref, isInView } = useScrollAnimation();
  const { canvases, isLoading, isContractDeployed, totalCount } = useGallery();

  return (
    <section id="gallery" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Image className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">On-Chain Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Eternal Artworks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse pixel art stored forever on Arbitrum via DataLoom. Each piece is 
              compressed, verified, and retrievable directly from the blockchain.
            </p>
          </motion.div>

          {/* Gallery content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!isContractDeployed ? (
              /* Contract not deployed state */
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"
                />
                <div className="relative bg-card rounded-2xl border border-border p-12 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                  >
                    <AlertCircle className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">Contract Deployment Pending</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    The DataLoom contract is being deployed to Arbitrum Sepolia testnet. 
                    Once deployed, stored artworks will appear here.
                  </p>
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    <code className="px-3 py-1.5 rounded-lg bg-secondary font-mono text-xs">
                      src/lib/contracts.ts
                    </code>
                    <span>← Update contract address here</span>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              /* Loading state */
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : canvases.length === 0 ? (
              /* Empty state */
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"
                />
                <div className="relative bg-card rounded-2xl border border-border p-12 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                  >
                    <Image className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">No Artworks Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Be the first to create eternal pixel art! Draw on the canvas above 
                    and store your masterpiece on-chain.
                  </p>
                  <Button
                    variant="hero"
                    onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Create Artwork
                  </Button>
                </div>
              </div>
            ) : (
              /* Gallery grid */
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    {totalCount} artwork{totalCount !== 1 ? 's' : ''} stored on-chain
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {canvases.map((canvas, index) => (
                    <motion.div
                      key={canvas.id.toString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      {/* Canvas preview */}
                      <div className="relative aspect-square bg-background/50">
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                            `,
                            backgroundSize: "10px 10px",
                          }}
                        />
                        {canvas.pixels.map((pixel, i) => (
                          <div
                            key={i}
                            className="absolute w-2.5 h-2.5 rounded-sm"
                            style={{
                              left: pixel.x,
                              top: pixel.y,
                              backgroundColor: pixel.color,
                              boxShadow: `0 0 4px ${pixel.color}`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Canvas info */}
                      <div className="p-4 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Canvas #{canvas.id.toString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {canvas.pixels.length} pixels
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-mono">
                            {canvas.creator.slice(0, 6)}...{canvas.creator.slice(-4)}
                          </span>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            View TX
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
