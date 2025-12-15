import { Button } from "@/components/ui/button";
import { ExternalLink, Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Demo = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<{ x: number; y: number; color: string }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#E9A23B");

  const colors = ["#E9A23B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B"];

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 10) * 10;
    const y = Math.floor((e.clientY - rect.top) / 10) * 10;

    // Avoid duplicates
    if (!pixels.some((p) => p.x === x && p.y === y)) {
      setPixels((prev) => [...prev, { x, y, color: selectedColor }]);
    }
  };

  return (
    <section id="demo" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
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
          </div>

          {/* Demo canvas */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
            
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {pixels.length} pixels drawn
                  </span>
                </div>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-secondary/30">
                <span className="text-sm text-muted-foreground">Color:</span>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
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
                className="relative h-80 bg-background/50 cursor-crosshair select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
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
                {pixels.map((pixel, i) => (
                  <div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-sm transition-all duration-200"
                    style={{
                      left: pixel.x,
                      top: pixel.y,
                      backgroundColor: pixel.color,
                      boxShadow: `0 0 8px ${pixel.color}`,
                    }}
                  />
                ))}

                {/* Placeholder text */}
                {pixels.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Click and drag to draw on the eternal canvas
                    </p>
                  </div>
                )}
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs text-muted-foreground">Connected to Arbitrum</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPixels([])}
                  className="text-xs"
                >
                  Clear Canvas
                </Button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Button variant="hero" size="lg">
              Launch Full Demo
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
