"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HistoryItem, Mode, AnalysisResult } from "@/types";
import { FUN_FACTS } from "@/constants";
import { InteractiveMeter, InteractiveMeterHandle } from "./InteractiveMeter";
import { HistoryManager, HistoryManagerHandle } from "./HistoryManager";
import { ToastProvider } from "../context/ToastContext";
import { Navigation } from "./Navigation";

export const ClientWrapper: React.FC<{ randomFact: string }> = ({
  randomFact,
}) => {
  const initialIndex = FUN_FACTS.indexOf(randomFact);
  const safeInitial = initialIndex === -1 ? 0 : initialIndex;
  const [factIndex, setFactIndex] = useState(safeInitial);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const cooldown = useRef<number[]>([safeInitial]);
  const historyManagerRef = useRef<HistoryManagerHandle | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const allIndices = FUN_FACTS.map((_, i) => i);
      const eligible = allIndices.filter((i) => !cooldown.current.includes(i));
      const pool = eligible.length > 0 ? eligible : allIndices;
      const next = pool[Math.floor(Math.random() * pool.length)];
      cooldown.current = [next, ...cooldown.current].slice(0, 3);
      setFactIndex(next);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const interactiveMeterRef = useRef<InteractiveMeterHandle | null>(null);

  const handleHistoryAdd = (item: HistoryItem) => {
    historyManagerRef.current?.addToHistory(item);
  };

  const handleSelectHistory = (
    mode: Mode,
    name: string,
    result: AnalysisResult,
    grievance: string
  ) => {
    interactiveMeterRef.current?.showHistoryItem(mode, name, result, grievance);
  };

  const handleNavHome = () => {
    interactiveMeterRef.current?.reset();
  };

  const handleNavHistory = () => {
    historyManagerRef.current?.toggle();
  };

  const handleNavCoffee = () => {
    window.open("https://buymeacoffee.com/igwefran6", "_blank");
  };

  return (
    <ToastProvider>
      <header className="text-center mb-10">
        <h1
          onClick={handleNavHome}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2 tracking-tight cursor-pointer"
        >
          Petty Meter
        </h1>
        <div className="relative inline-block">
          <div
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            className="text-sm font-medium text-gray-500 bg-white/50 inline-flex items-center gap-1 px-4 py-1 rounded-full backdrop-blur-sm border border-white overflow-hidden w-72 sm:w-96 cursor-default"
          >
            <span className="shrink-0">💡 Fact:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={factIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="truncate"
              >
                {FUN_FACTS[factIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {tooltipOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-white border border-orange-100 shadow-xl rounded-2xl px-4 py-3 text-sm text-gray-600 font-medium w-72 text-center pointer-events-none"
              >
                <span className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">Did you know?</span>
                {FUN_FACTS[factIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <HistoryManager
        ref={historyManagerRef}
        onSelectHistory={handleSelectHistory}
      />
      <InteractiveMeter
        ref={interactiveMeterRef}
        onHistoryAdd={handleHistoryAdd}
      />
      <Navigation
        onHome={handleNavHome}
        onHistory={handleNavHistory}
        onCoffee={handleNavCoffee}
      />
    </ToastProvider>
  );
};
