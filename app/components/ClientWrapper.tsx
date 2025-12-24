"use client";

import React, { useRef } from "react";
import { HistoryItem } from "@/types";
import { InteractiveMeter } from "./InteractiveMeter";
import { HistoryManager, HistoryManagerHandle } from "./HistoryManager";

export const ClientWrapper: React.FC = () => {
  const historyManagerRef = useRef<HistoryManagerHandle | null>(null);

  const handleHistoryAdd = (item: HistoryItem) => {
    historyManagerRef.current?.addToHistory(item);
  };

  return (
    <>
      <HistoryManager ref={historyManagerRef} />
      <InteractiveMeter onHistoryAdd={handleHistoryAdd} />
    </>
  );
};
