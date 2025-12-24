"use client";

import React, { useRef } from "react";
import { HistoryItem, Mode, AnalysisResult } from "@/types";
import { InteractiveMeter, InteractiveMeterHandle } from "./InteractiveMeter";
import { HistoryManager, HistoryManagerHandle } from "./HistoryManager";
import { ToastProvider } from "../context/ToastContext";
import { Navigation } from "./Navigation";

export const ClientWrapper: React.FC = () => {
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
