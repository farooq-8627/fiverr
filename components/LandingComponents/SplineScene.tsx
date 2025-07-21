"use client";

import { SplineScene } from "@/components/UI/splite";
import { Card } from "@/components/UI/card";
import { CursorLight } from "@/components/UI/cursor-light";

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-screen bg-black/[0.96] relative overflow-hidden border-0">
      <CursorLight className="opacity-75 z-0" size={400} />

      <div className="flex flex-col md:flex-row h-full">
        {/* Left content - full height on mobile */}
        <div className="flex-1 h-[50%] md:h-full md:min-h-0 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-7xl font-bold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive 3D
          </h1>
          <div className="mt-4 text-neutral-300 max-w-lg text-center md:text-left">
            Bring your UI to life with beautiful 3D scenes. Create immersive
            experiences that capture attention and enhance your design.
          </div>
        </div>

        {/* Right content - SplineScene */}
        <div className="flex-1 relative h-[50%] md:h-full md:min-h-screen z-10">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full z-10"
          />
        </div>
      </div>
    </Card>
  );
}
