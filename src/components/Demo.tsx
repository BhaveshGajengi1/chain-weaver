import { Button } from "@/components/ui/button";
import { ExternalLink, Palette, RotateCcw } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation, fadeUpVariants } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

const Demo = () => {
  const { ref, isInView } = useScrollAnimation();
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<{ x: number; y: number; color: string; id: number }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#E9A23B");
  const pixelIdRef = useRef(0);

  const colors = ["#E9A23B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B"];

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  const addPixel = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / 10) * 10;
    const y = Math.floor((clientY - rect.top) / 10) * 10;

    // Avoid duplicates
    if (!pixels.some((p) => p.x === x && p.y === y)) {
      pixelIdRef.current += 1;
      setPixels((prev) => [...prev, { x, y, color: selectedColor, id: pixelIdRef.current }]);
    }
  }, [pixels, selectedColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    addPixel(e.clientX, e.clientY);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    addPixel(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    addPixel(touch.clientX, touch.clientY);
  };

  const handleClear = () => {
    setPixels([]);
    toast.success("Canvas cleared");
  };

  return (
    <section id="demo" className="py-24 relative" ref={ref}>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Palette className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">Live Demo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              The Eternal Canvas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              An infinite, persistent drawing board that lives 100% on-chain. Every pixel 
              is stored via DataLoom. No off-chain server, no IPFS, no admin key. 
              Art that lives by the consensus of the chain, forever.
            </p>
          </motion.div>

          {/* Demo canvas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Outer glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"
            />
            
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden">
              {/* Canvas header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                    <div className="w-3 h-3 rounded-full bg-accent/60" />
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">
                    eternal-canvas.arb
                  </span>
                </div>
                <motion.div
                  key={pixels.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {pixels.length} pixels drawn
                  </span>
                </motion.div>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-secondary/30">
                <span className="text-sm text-muted-foreground">Color:</span>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-6 h-6 rounded-full transition-all ${
                        selectedColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Drawing area */}
              <div
                ref={canvasRef}
                className="relative h-80 bg-background/50 cursor-crosshair select-none touch-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onTouchStart={() => setIsDrawing(true)}
                onTouchEnd={() => setIsDrawing(false)}
                onTouchMove={handleTouchMove}
              >
                {/* Grid pattern */}
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

                {/* Pixels */}
                <AnimatePresence>
                  {pixels.map((pixel) => (
                    <motion.div
                      key={pixel.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-2.5 h-2.5 rounded-sm"
                      style={{
                        left: pixel.x,
                        top: pixel.y,
                        backgroundColor: pixel.color,
                        boxShadow: `0 0 8px ${pixel.color}`,
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Placeholder text */}
                <AnimatePresence>
                  {pixels.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <p className="text-muted-foreground text-sm">
                        Click and drag to draw on the eternal canvas
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-accent"
                    />
                    <span className="text-xs text-muted-foreground">Connected to Arbitrum</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" size="lg">
                Launch Full Demo
                <ExternalLink className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
