"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { BentoCard } from "./BentoCard";

// Real velocity/activity profile based on recent GitHub activity
const bars = [
  { height: 35, month: "May" },
  { height: 48, month: "Jun" },
  { height: 58, month: "Jul" },
  { height: 72, month: "Aug" },
  { height: 65, month: "Sep" },
  { height: 88, month: "Oct" },
  { height: 80, month: "Now" },
];

const peakIndex = bars.findIndex(
  (b) => b.height === Math.max(...bars.map((b) => b.height))
);

// Subtle grid lines background with pulse on hover
function GridLines({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-24 pointer-events-none">
      {[0, 33, 66, 100].map((percent, i) => (
        <motion.div
          key={percent}
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ bottom: `${percent}%` }}
          initial={{ opacity: 0.3, borderColor: "rgba(209, 213, 219, 0.5)" }}
          animate={{
            opacity: isHovered ? [0.4, 0.7, 0.4] : 0.3,
            borderColor: isHovered
              ? "rgba(139, 92, 246, 0.25)"
              : "rgba(209, 213, 219, 0.5)",
          }}
          transition={{
            opacity: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              delay: i * 0.1,
              ease: "easeInOut",
            },
            borderColor: { duration: 0.3 },
          }}
        />
      ))}
    </div>
  );
}

// Interpolate Y position on the trend line for a given X percentage
function getYOnLine(xPercent: number): number {
  const totalBars = bars.length;
  const getX = (index: number) => ((index * 2 + 1) / (totalBars * 2)) * 100;

  for (let i = 0; i < bars.length - 1; i++) {
    const x1 = getX(i);
    const x2 = getX(i + 1);
    if (xPercent >= x1 && xPercent <= x2) {
      const t = (xPercent - x1) / (x2 - x1);
      const y1 = 100 - bars[i].height;
      const y2 = 100 - bars[i + 1].height;
      return y1 + t * (y2 - y1);
    }
  }
  if (xPercent < getX(0)) return 100 - bars[0].height;
  return 100 - bars[bars.length - 1].height;
}

function TrendLineWithIndicator({
  isHovered,
  animatedX,
}: {
  isHovered: boolean;
  animatedX: ReturnType<typeof useSpring>;
}) {
  const totalBars = bars.length;
  const getX = (index: number) => ((index * 2 + 1) / (totalBars * 2)) * 100;
  const getY = (height: number) => 100 - height;

  const points = bars.map((bar, i) => `${getX(i)},${getY(bar.height)}`).join(" ");

  const areaPath = bars
    .map((bar, i) => `${getX(i)},${getY(bar.height)}`)
    .join(" L ");
  const firstX = getX(0);
  const lastX = getX(bars.length - 1);
  const fillPath = `M ${firstX},100 L ${areaPath} L ${lastX},100 Z`;

  const animatedY = useTransform(animatedX, (x) => getYOnLine(x));

  return (
    <svg
      className="absolute inset-x-0 bottom-0 top-24 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="statsTrendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
          <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="statsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity={isHovered ? "0.28" : "0.14"} />
          <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gradient fill under the line */}
      <motion.path
        d={fillPath}
        fill="url(#statsAreaGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      />

      {/* Trend line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#statsTrendGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Interactive indicator dot */}
      <motion.circle
        cx={animatedX}
        cy={animatedY}
        r="3"
        fill="rgb(139, 92, 246)"
        vectorEffect="non-scaling-stroke"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.9))"
            : "drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))",
        }}
      />

      {/* Pulse ring */}
      <motion.circle
        cx={animatedX}
        cy={animatedY}
        r="3"
        fill="none"
        stroke="rgb(139, 92, 246)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        animate={{
          scale: [1, 2.2],
          opacity: [0.7, 0],
        }}
        transition={{
          scale: { duration: 1.6, repeat: Infinity, ease: "easeOut" },
          opacity: { duration: 1.6, repeat: Infinity, ease: "easeOut" },
        }}
      />
    </svg>
  );
}

const peakXPosition = ((peakIndex * 2 + 1) / (bars.length * 2)) * 100;

export function StatsBento() {
  const [isHovered, setIsHovered] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const animatedX = useSpring(peakXPosition, {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    animatedX.set(Math.max(0, Math.min(100, percent)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    animatedX.set(peakXPosition);
  };

  return (
    <div
      ref={chartRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="h-full"
    >
      <BentoCard height="h-[220px]" className="group relative overflow-hidden" linkTo="/stats">
        {/* Header Row */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.h2
              className="text-sm font-semibold tracking-wide text-text-primary uppercase"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Stats
            </motion.h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Builder
            </span>
          </div>

          {/* GitHub handle */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary transition-colors group-hover:text-purple-primary">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>satyakiabhijit</span>
          </div>
        </div>

        {/* Primary Impact Metrics */}
        <div className="relative z-20 mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              300+
            </span>
            <span className="text-xs font-medium text-text-secondary">
              GitHub contributions
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-text-tertiary">
            <span className="font-medium text-text-secondary">22 Repositories</span>
            <span>•</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ▲ +18% velocity
            </span>
          </div>
        </div>

        {/* Background Grid Lines */}
        <GridLines isHovered={isHovered} />

        {/* Activity Bar Chart in lower background */}
        <div className="absolute inset-x-0 bottom-0 top-24 flex items-end justify-around pointer-events-none px-4">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center"
              style={{ width: `${100 / bars.length}%` }}
            >
              <motion.div
                className="relative w-3/5 overflow-hidden rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: `${bar.height * 0.7}%` }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  background:
                    i === peakIndex
                      ? "linear-gradient(to top, rgb(99, 102, 241), rgb(139, 92, 246))"
                      : isHovered
                        ? "linear-gradient(to top, rgba(99, 102, 241, 0.75), rgba(139, 92, 246, 0.5))"
                        : "linear-gradient(to top, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.2))",
                  boxShadow:
                    i === peakIndex && isHovered
                      ? "0 0 16px rgba(139, 92, 246, 0.4)"
                      : "none",
                  transition: "background 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Inner highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-1/3 rounded-t-md"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
                  }}
                />

                {/* Sweep highlight */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                  animate={{ y: isHovered ? [100, -100] : 100 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: isHovered ? i * 0.03 : 0,
                  }}
                  style={{ height: "200%" }}
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Trend line overlay with interactive follower dot */}
        <div className="px-4">
          <TrendLineWithIndicator isHovered={isHovered} animatedX={animatedX} />
        </div>
      </BentoCard>
    </div>
  );
}
