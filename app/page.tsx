"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mode, AnalysisResult, FormData, HistoryItem } from "@/types";
import { analyzeGrievance } from "@/services/geminiService";
import { FormView } from "./components/FormView";
import { ResultView } from "./components/ResultView";
import { HistoryView } from "./components/HistoryView";
import { FUN_FACTS, LOADING_MESSAGES } from "@/constants";
import { User, Users, History as HistoryIcon, X } from "lucide-react";
import { useSound } from "@/hooks/useSound";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"meter" | "history">("meter");
  const [mode, setMode] = useState<Mode>(Mode.SELF);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFact, setCurrentFact] = useState(FUN_FACTS[0]);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [subjectName, setSubjectName] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("pettiness_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  });

  const { playClick, playPop, playSuccess } = useSound();

  // Save history on change
  useEffect(() => {
    localStorage.setItem("pettiness_history", JSON.stringify(history));
  }, [history]);

  // Rotation logic for facts and messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMsg(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleModeChange = (newMode: Mode) => {
    if (isLoading) return;
    playClick();
    setMode(newMode);
    setResult(null);
    setSubjectName("");
    setActiveTab("meter");
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubjectName(data.name);
    try {
      const response = await analyzeGrievance(data.grievance, mode, data.name);
      setResult(response);
      playSuccess();

      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        mode,
        name: data.name,
        grievance: data.grievance,
        result: response,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50
    } catch (e) {
      console.error(e);
      alert(
        "Something went wrong with the pettiness council. Check your API Key."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    playClick();
    setResult(null);
    setSubjectName("");
  };

  const handleSelectHistory = (item: HistoryItem) => {
    playPop();
    setMode(item.mode);
    setSubjectName(item.name || "");
    setResult(item.result);
    setActiveTab("meter");
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

  const toggleHistory = () => {
    playPop();
    setActiveTab((prev) => (prev === "meter" ? "history" : "meter"));
  };

  return (
    <div className="min-h-screen bg-bgLight text-dark selection:bg-primary selection:text-white flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-200 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Floating History Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleHistory}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          activeTab === "history"
            ? "bg-primary text-white"
            : "bg-dark text-white"
        }`}
        title={activeTab === "meter" ? "View History" : "Back to Meter"}
      >
        <AnimatePresence mode="wait">
          {activeTab === "meter" ? (
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

        {history.length > 0 && activeTab === "meter" && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black border-2 border-white shadow-sm">
            {history.length}
          </span>
        )}
      </motion.button>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-2xl grow flex flex-col">
        {/* Header */}
        <header className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 tracking-tight cursor-pointer"
            onClick={() => {
              handleReset();
              setActiveTab("meter");
            }}
          >
            The Pettiness Meter
          </h1>
          <motion.div
            key={currentFact}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-gray-500 bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white"
          >
            💡 Fact: {currentFact}
          </motion.div>
        </header>

        {/* Sub-Tab Switcher (Mode) */}
        <AnimatePresence>
          {activeTab === "meter" && !result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 mb-8 relative max-w-sm mx-auto w-full"
            >
              <div className="grid grid-cols-2 w-full relative z-10">
                <button
                  onClick={() => handleModeChange(Mode.SELF)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
                    mode === Mode.SELF
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={18} />
                  Am I Petty?
                </button>
                <button
                  onClick={() => handleModeChange(Mode.OTHER)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
                    mode === Mode.OTHER
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Users size={18} />
                  Are They Petty?
                </button>
              </div>
              <motion.div
                className="absolute top-1 bottom-1 left-0 w-[calc(50%-4px)] bg-dark rounded-xl z-0"
                initial={false}
                animate={{
                  x: mode === Mode.SELF ? 4 : "calc(100% + 4px)",
                  backgroundColor: mode === Mode.SELF ? "#FF6B35" : "#FF006E",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="grow flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {activeTab === "history" ? (
              <HistoryView
                key="history-view"
                history={history}
                onClear={handleClearHistory}
                onSelect={handleSelectHistory}
                onDeleteOne={handleDeleteHistoryItem}
              />
            ) : !result ? (
              <FormView
                key="form"
                mode={mode}
                isLoading={isLoading}
                loadingMessage={loadingMsg}
                onSubmit={handleSubmit}
              />
            ) : (
              <ResultView
                key="result"
                result={result}
                mode={mode}
                name={subjectName}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
          <p>Francis said it's made for laughs, not legal advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
