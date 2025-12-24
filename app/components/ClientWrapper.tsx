"use client";

import React, { useRef } from "react";
import { HistoryItem, Mode, AnalysisResult } from "@/types";
import { InteractiveMeter, InteractiveMeterHandle } from "./InteractiveMeter";
import { HistoryManager, HistoryManagerHandle } from "./HistoryManager";
import { ToastProvider } from "../context/ToastContext";

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
    </ToastProvider>
  );
};
