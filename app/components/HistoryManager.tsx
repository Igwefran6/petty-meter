"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HistoryItem, Mode, AnalysisResult } from "@/types";
import { getHistoryAction, saveHistoryAction } from "../actions";
import { HistoryView } from "./HistoryView";
import { History as HistoryIcon, X } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface HistoryManagerProps {
  onSelectHistory?: (mode: Mode, name: string, result: AnalysisResult) => void;
}

export interface HistoryManagerHandle {
  addToHistory: (item: HistoryItem) => void;
}

export const HistoryManager = forwardRef<
  HistoryManagerHandle,
  HistoryManagerProps
>(({ onSelectHistory }, ref) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { playClick, playPop } = useSound();

  // Load history from server on mount
  useEffect(() => {
    getHistoryAction().then(setHistory).catch(console.error);
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      saveHistoryAction(history).catch(console.error);
    }
  }, [history]);

  // Expose addToHistory method via ref
  useImperativeHandle(ref, () => ({
    addToHistory: (item: HistoryItem) => {
      setHistory((prev) => [item, ...prev].slice(0, 50));
    },
  }));

  const toggleHistory = () => {
    playPop();
    setIsOpen((prev) => !prev);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    playPop();
    if (onSelectHistory) {
      onSelectHistory(item.mode, item.name || "", item.result);
    }
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    playClick();
    if (confirm("Burn all the receipts? This cannot be undone.")) {
      setHistory([]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    playClick();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Floating History Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleHistory}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? "bg-primary text-white" : "bg-dark text-white"
        }`}
        title={isOpen ? "Close History" : "View History"}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="history-icon"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <HistoryIcon size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <X size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black border-2 border-white shadow-sm">
            {history.length}
          </span>
        )}
      </motion.button>

      {/* History Modal/View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={toggleHistory}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bgLight rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <HistoryView
                history={history}
                onClear={handleClearHistory}
                onSelect={handleSelectHistory}
                onDeleteOne={handleDeleteHistoryItem}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

HistoryManager.displayName = "HistoryManager";
