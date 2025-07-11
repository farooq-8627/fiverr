"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CursorLightProps {
  className?: string;
  size?: number;
}

export function CursorLight({ className, size = 400 }: CursorLightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition duration-300",
        className
      )}
    >
      <div
        className="pointer-events-none absolute bg-gradient-radial from-white/60 to-transparent rounded-full blur-2xl"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
        }}
      />
    </div>
  );
}
