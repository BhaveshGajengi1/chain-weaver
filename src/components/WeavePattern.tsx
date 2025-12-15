import { useEffect, useRef } from "react";

const WeavePattern = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const threads: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      hue: number;
    }> = [];

    // Initialize threads
    for (let i = 0; i < 15; i++) {
      threads.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        length: 100 + Math.random() * 200,
        hue: 38 + Math.random() * 10,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(10, 12, 20, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      threads.forEach((thread, i) => {
        // Update position
        thread.x += thread.vx;
        thread.y += thread.vy;

        // Bounce off edges
        if (thread.x < 0 || thread.x > canvas.width) thread.vx *= -1;
        if (thread.y < 0 || thread.y > canvas.height) thread.vy *= -1;

        // Draw connections between nearby threads
        threads.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - thread.x;
          const dy = other.y - thread.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 300) {
            const opacity = (1 - dist / 300) * 0.15;
            ctx.beginPath();
            ctx.moveTo(thread.x, thread.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${thread.hue}, 92%, 55%, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw thread node
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${thread.hue}, 92%, 55%, 0.6)`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-60"
      style={{ zIndex: 0 }}
    />
  );
};

export default WeavePattern;
