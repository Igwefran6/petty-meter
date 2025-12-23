import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ZONES } from "@/constants";
import { useSound } from "@/hooks/useSound";

interface GaugeProps {
  score: number;
}

export const Gauge: React.FC<GaugeProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const { playTink } = useSound();
  const validScore = Math.max(0, Math.min(100, score === -1 ? 0 : score));

  useEffect(() => {
    if (score >= 0) {
      setDisplayScore(validScore);
      // Subtle sound when score settles
      const timer = setTimeout(() => {
        playTink();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [score, validScore, playTink]);

  const currentZone =
    ZONES.find((z) => validScore >= z.min && validScore <= z.max) || ZONES[0];
  const rotation = (validScore / 100) * 180 - 90;

  // SVG Arc constants
  const size = 280;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <div className="relative w-full max-w-[300px] mx-auto flex flex-col items-center justify-center mt-6 mb-2">
      {/* SVG Gauge Background */}
      <div className="relative w-[280px] h-[140px] overflow-hidden">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute top-0 left-0"
        >
          {/* Gray Background Track */}
          <path
            d={`M ${strokeWidth / 2},${center} A ${radius},${radius} 0 0,1 ${
              size - strokeWidth / 2
            },${center}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {ZONES.map((zone, i) => {
            const startAngle = (zone.min / 100) * 180 + 180;
            const endAngle = (zone.max / 100) * 180 + 180;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            return (
              <path
                key={zone.label}
                d={`M ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2}`}
                fill="none"
                stroke={zone.color}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </svg>
      </div>

      {/* Needle Container */}
      <motion.div
        className="absolute top-[130px] w-full flex justify-center"
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        style={{ transformOrigin: "center bottom" }}
      >
        <div className="relative w-[280px] h-0 flex justify-center">
          <div className="absolute bottom-0 h-[115px] w-[6px] bg-dark rounded-t-full origin-bottom"></div>
          <div className="absolute bottom-[-10px] w-[20px] h-[20px] bg-dark rounded-full border-4 border-white shadow-sm"></div>
        </div>
      </motion.div>

      {/* Score Display */}
      <div className="mt-8 text-center">
        <motion.div
          className="text-6xl font-bold tracking-tighter"
          key={displayScore}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ color: currentZone.color }}
        >
          {score === -1 ? "?" : `${displayScore}%`}
        </motion.div>
        <div className="text-xl font-bold text-dark mt-1">
          {score === -1 ? "Invalid Input" : currentZone.label}
        </div>
        <div className="text-xs text-muted font-black uppercase tracking-[0.2em] mt-1">
          {score === -1 ? "Try Again" : currentZone.message}
        </div>
      </div>
    </div>
  );
};
