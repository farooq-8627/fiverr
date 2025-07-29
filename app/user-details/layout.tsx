"use client";

import { GalaxyBackground } from "@/components/blocks/galaxy-interactive-hero-section";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden">
      {/* Center the galaxy background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute">
          <GalaxyBackground />
        </div>
      </div>

      {/* Center the content */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-[95%] md:max-w-[95%] lg:max-w-[92%] xl:max-w-[1200px]">
          {children}
        </div>
      </div>
    </div>
  );
}
