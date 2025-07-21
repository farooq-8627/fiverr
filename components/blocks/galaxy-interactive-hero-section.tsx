"use client";

import React from "react";
import { lazy } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

export const GalaxyBackground = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "120vh",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
    >
      <Spline
        style={{
          width: "100%",
          height: "120vh",
          pointerEvents: "auto",
        }}
        scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export const HeroSection = () => {
  return (
    <div className="relative">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <GalaxyBackground />
        </div>
      </div>
    </div>
  );
};
