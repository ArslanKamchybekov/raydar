"use client";
import { useEffect, useState } from "react";

export default function AnimatedRadar() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setRotation((prev) => (prev + 1) % 360);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative w-[300px] h-[300px]">
      <svg viewBox="0 0 200 200" className="absolute top-0 left-0 w-full h-full">
        {/* Radar Background Glow */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="rgba(0, 140, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 140, 255, 0)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#glow)" className="opacity-50" />

        {/* Grid & Circles */}
        {[90, 60, 30].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(0,140,255,0.3)" strokeWidth="1" />
        ))}
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,140,255,0.3)" strokeWidth="1" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,140,255,0.3)" strokeWidth="1" />

        {/* Radar Sweep */}
        <defs>
          <radialGradient id="sweepGradient">
            <stop offset="0%" stopColor="rgba(0,140,255,0.6)" />
            <stop offset="100%" stopColor="rgba(0,140,255,0)" />
          </radialGradient>
        </defs>
        <path
          d="M100,100 L100,10 A90,90 0 0,1 190,100 Z"
          fill="url(#sweepGradient)"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: "transform 50ms linear",
          }}
        />

        {/* Blips */}
        <g className="text-blue-500">
          {[{ x: 130, y: 150 }, { x: 70, y: 60 }, { x: 160, y: 80 }].map((blip, i) => (
            <g key={i}>
              <circle cx={blip.x} cy={blip.y} r="3" className="animate-ping fill-current opacity-75" />
              <circle cx={blip.x} cy={blip.y} r="2" className="fill-current" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
