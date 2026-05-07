"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mode, AnalysisResult, FormData, HistoryItem } from "@/types";
import { analyzeGrievanceAction } from "../actions";
import { FormView } from "./FormView";
import { ResultView } from "./ResultView";
import { LOADING_MESSAGES } from "@/constants";
import { User, Users } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useToast } from "../context/ToastContext";

interface InteractiveMeterProps {
  onHistoryAdd: (item: HistoryItem) => void;
}

export interface InteractiveMeterHandle {
  showHistoryItem: (mode: Mode, name: string, result: AnalysisResult, grievance: string) => void;
  reset: () => void;
}

export const InteractiveMeter = forwardRef<
  InteractiveMeterHandle,
  InteractiveMeterProps
>(({ onHistoryAdd }, ref) => {
  const [mode, setMode] = useState<Mode>(Mode.SELF);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [subjectName, setSubjectName] = useState<string>("");
  const [grievance, setGrievance] = useState<string>("");
  const lastFormData = useRef<FormData | null>(null);

  const { playClick, playSuccess } = useSound();
  const { showToast } = useToast();

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

  // Expose showHistoryItem method via ref
  useImperativeHandle(ref, () => ({
    showHistoryItem: (
      selectedMode: Mode,
      selectedName: string,
      selectedResult: AnalysisResult,
      selectedGrievance: string
    ) => {
      setMode(selectedMode);
      setSubjectName(selectedName);
      setResult(selectedResult);
      setGrievance(selectedGrievance);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    reset: () => {
      handleReset();
    },
  }));

  const handleModeChange = (newMode: Mode) => {
    if (isLoading) return;
    playClick();
    setMode(newMode);
    setResult(null);
    setSubjectName("");
  };

  const handleRetry = () => {
    if (lastFormData.current) {
      setResult(null);
      handleSubmit(lastFormData.current);
    }
  };

  const handleSubmit = async (data: FormData) => {
    lastFormData.current = data;
    setIsLoading(true);
    setSubjectName(data.name);
    setGrievance(data.grievance);
    try {
      const response = await analyzeGrievanceAction(
        data.grievance,
        mode,
        data.name
      );
      setResult(response);

      if (response.category !== "Error") {
        playSuccess();
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          mode,
          name: data.name,
          grievance: data.grievance,
          result: response,
          timestamp: Date.now(),
        };
        onHistoryAdd(newItem);
      }
    } catch (e) {
      console.error(e);
      showToast(
        "Something went wrong with the pettiness council. Check your API Key.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    playClick();
    setResult(null);
    setSubjectName("");
    setGrievance("");
  };

  return (
    <>
      {/* Mode Switcher */}
      <AnimatePresence>
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 mb-8 relative max-w-sm mx-auto w-full"
          >
            <div className="grid grid-cols-2 w-full relative z-10">
              <button
                onClick={() => handleModeChange(Mode.SELF)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
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
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
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
          {!result ? (
            <FormView
              key={mode}
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
              grievance={grievance}
              onReset={handleReset}
              onRetry={handleRetry}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

InteractiveMeter.displayName = "InteractiveMeter";
