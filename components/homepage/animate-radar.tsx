"use client"
import { useEffect, useState } from 'react';

export default function AnimatedRadar() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[300px] h-[300px] opacity-90">
      <svg
        viewBox="0 0 200 200"
        className="absolute top-0 left-0 w-full h-full"
      >
        {/* Radar Background Circles */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        
        {/* Cross Lines */}
        <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        
        {/* Animated Radar Sweep */}
        <path
          d={`M 100 100 L 100 10 A 90 90 0 0 1 ${100 + 90 * Math.cos(Math.PI / 2 - Math.PI / 6)} ${100 - 90 * Math.sin(Math.PI / 2 - Math.PI / 6)} Z`}
          fill="currentColor"
          className="opacity-40"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 100ms linear'
          }}
        >
          <animate
            attributeName="opacity"
            values="0.6;0.2;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Brighter Blips */}
        <g className="text-blue-500">
          <circle cx="130" cy="150" r="3" className="animate-ping fill-current opacity-75" />
          <circle cx="130" cy="150" r="2" className="fill-current" />
          
          <circle cx="70" cy="60" r="3" className="animate-ping fill-current opacity-75" />
          <circle cx="70" cy="60" r="2" className="fill-current" />
          
          <circle cx="160" cy="80" r="3" className="animate-ping fill-current opacity-75" />
          <circle cx="160" cy="80" r="2" className="fill-current" />
        </g>

        {/* Additional Static Bright Points */}
        <g className="text-blue-400">
          <circle cx="140" cy="120" r="1.5" className="fill-current" />
          <circle cx="85" cy="140" r="1.5" className="fill-current" />
          <circle cx="110" cy="70" r="1.5" className="fill-current" />
        </g>
      </svg>
    </div>
  );
}