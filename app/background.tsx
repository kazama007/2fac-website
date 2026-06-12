"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const DOT_SPACING = 36;
    const DOT_RADIUS = 1.1;
    const GLOW_RADIUS = 90;
    const mouse = { x: -9999, y: -9999 };

    const staticCanvas = document.createElement("canvas");
    staticCanvas.width = width;
    staticCanvas.height = height;
    const sCtx = staticCanvas.getContext("2d")!;

    const drawStatic = () => {
      sCtx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      sCtx.fillStyle = "rgba(100,120,180,0.3)";
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          sCtx.beginPath();
          sCtx.arc(col * DOT_SPACING, row * DOT_SPACING, DOT_RADIUS, 0, Math.PI * 2);
          sCtx.fill();
        }
      }
    };
    drawStatic();

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animId: number;
    let lastTime = 0;
    const interval = 1000 / 20;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (now - lastTime < interval) return;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(staticCanvas, 0, 0);

      const glowX = mouse.x;
      const glowY = mouse.y;
      const startCol = Math.max(0, Math.floor((glowX - GLOW_RADIUS) / DOT_SPACING));
      const endCol = Math.min(Math.ceil(width / DOT_SPACING), Math.ceil((glowX + GLOW_RADIUS) / DOT_SPACING));
      const startRow = Math.max(0, Math.floor((glowY - GLOW_RADIUS) / DOT_SPACING));
      const endRow = Math.min(Math.ceil(height / DOT_SPACING), Math.ceil((glowY + GLOW_RADIUS) / DOT_SPACING));

      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          const x = col * DOT_SPACING;
          const y = row * DOT_SPACING;
          const dx = glowX - x;
          const dy = glowY - y;
          const distSq = dx * dx + dy * dy;
          if (distSq < GLOW_RADIUS * GLOW_RADIUS) {
            const intensity = 1 - Math.sqrt(distSq) / GLOW_RADIUS;
            ctx.beginPath();
            ctx.arc(x, y, DOT_RADIUS + intensity * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124,58,237,${0.3 + intensity * 0.55})`;
            ctx.fill();
          }
        }
      }
    };

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      staticCanvas.width = width;
      staticCanvas.height = height;
      drawStatic();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted, isMobile]);

  // Server + mobile dono pe null return karo
  if (!mounted || isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}