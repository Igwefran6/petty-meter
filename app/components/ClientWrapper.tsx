"use client";

import React, { useRef } from "react";
import { HistoryItem, Mode, AnalysisResult } from "@/types";
import { InteractiveMeter, InteractiveMeterHandle } from "./InteractiveMeter";
import { HistoryManager, HistoryManagerHandle } from "./HistoryManager";
import { ToastProvider } from "../context/ToastContext";
import { Navigation } from "./Navigation";

export const ClientWrapper: React.FC<{ randomFact: string }> = ({
  randomFact,
}) => {
  const historyManagerRef = useRef<HistoryManagerHandle | null>(null);
  const interactiveMeterRef = useRef<InteractiveMeterHandle | null>(null);

  const handleHistoryAdd = (item: HistoryItem) => {
    historyManagerRef.current?.addToHistory(item);
  };

  const handleSelectHistory = (
    mode: Mode,
    name: string,
    result: AnalysisResult
  ) => {
    interactiveMeterRef.current?.showHistoryItem(mode, name, result);
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
        <div className="text-sm font-medium text-gray-500 bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white">
          💡 Fact: {randomFact}
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
