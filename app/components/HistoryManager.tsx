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
import { useSound } from "@/hooks/useSound";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "./ui/ConfirmModal";

interface HistoryManagerProps {
  onSelectHistory?: (mode: Mode, name: string, result: AnalysisResult, grievance: string) => void;
}

export interface HistoryManagerHandle {
  addToHistory: (item: HistoryItem) => void;
  toggle: () => void;
}

export const HistoryManager = forwardRef<
  HistoryManagerHandle,
  HistoryManagerProps
>(({ onSelectHistory }, ref) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { playClick, playPop } = useSound();
  const { showToast } = useToast();

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

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addToHistory: (item: HistoryItem) => {
      setHistory((prev) => [item, ...prev].slice(0, 50));
    },
    toggle: () => {
      toggleHistory();
    },
  }));

  const toggleHistory = () => {
    playPop();
    setIsOpen((prev) => !prev);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    playPop();
    if (onSelectHistory) {
      onSelectHistory(item.mode, item.name || "", item.result, item.grievance);
    }
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    playClick();
    setIsConfirmOpen(true);
  };

  const confirmClearHistory = () => {
    setHistory([]);
    showToast("History burned successfully! 🔥", "success");
  };

  const handleDeleteHistoryItem = (id: string) => {
    playClick();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* History Modal/View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmClearHistory}
        title="Burn The Receipts?"
        message="This will permanently delete all your petty history. There is no turning back."
        confirmText="Burn It 🔥"
        isDangerous={true}
      />
    </>
  );
});

HistoryManager.displayName = "HistoryManager";
