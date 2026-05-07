"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mode, AnalysisResult, FormData, HistoryItem, PersonaId,
  BattleResult, BattleFormData, BattleHistoryData,
} from "@/types";
import { analyzeGrievanceAction, analyzeBattleAction } from "../actions";
import { FormView } from "./FormView";
import { ResultView } from "./ResultView";
import { BattleFormView } from "./BattleFormView";
import { BattleResultView } from "./BattleResultView";
import { LOADING_MESSAGES, BATTLE_LOADING_MESSAGES } from "@/constants";
import { User, Users, Swords } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useToast } from "../context/ToastContext";
import { updateStats, unlockAchievement } from "@/lib/statsStorage";
import { checkNewAchievements } from "@/lib/achievements";

interface InteractiveMeterProps {
  onHistoryAdd: (item: HistoryItem) => void;
  persona: PersonaId;
}

export interface InteractiveMeterHandle {
  showHistoryItem: (mode: Mode, name: string, result: AnalysisResult, grievance: string) => void;
  showBattleItem: (data: BattleHistoryData) => void;
  reset: () => void;
}

export const InteractiveMeter = forwardRef<InteractiveMeterHandle, InteractiveMeterProps>(
  ({ onHistoryAdd, persona }, ref) => {
    const [mode, setMode] = useState<Mode>(Mode.SELF);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    const [battleFormData, setBattleFormData] = useState<BattleFormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
    const [subjectName, setSubjectName] = useState("");
    const [grievance, setGrievance] = useState("");
    const lastFormData = useRef<FormData | null>(null);

    const { playClick, playSuccess } = useSound();
    const { showToast } = useToast();

    useEffect(() => {
      if (!isLoading) return;
      const msgs = mode === Mode.BATTLE ? BATTLE_LOADING_MESSAGES : LOADING_MESSAGES;
      const interval = setInterval(() => {
        setLoadingMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }, [isLoading, mode]);

    useImperativeHandle(ref, () => ({
      showHistoryItem: (m, name, res, g) => {
        setMode(m);
        setSubjectName(name);
        setResult(res);
        setGrievance(g);
        setBattleResult(null);
        setBattleFormData(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      showBattleItem: (data) => {
        setMode(Mode.BATTLE);
        setBattleResult(data.result);
        setBattleFormData({
          player1Grievance: data.player1Grievance,
          player1Name: data.player1Name,
          player2Grievance: data.player2Grievance,
          player2Name: data.player2Name,
        });
        setResult(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      reset: () => handleReset(),
    }));

    const handleModeChange = (newMode: Mode) => {
      if (isLoading) return;
      playClick();
      setMode(newMode);
      setResult(null);
      setBattleResult(null);
      setBattleFormData(null);
      setSubjectName("");
      setGrievance("");
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
        const response = await analyzeGrievanceAction(data.grievance, mode, data.name, persona);
        setResult(response);

        if (response.category !== "Error" && response.score >= 0) {
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

          const { prev, next } = updateStats(response.score, data.grievance, mode, {
            analysis: response.analysis,
            advice: response.advice,
            category: response.category,
            name: data.name,
          });
          checkNewAchievements(prev, next).forEach((badge) => {
            unlockAchievement(badge.id);
            setTimeout(() => {
              showToast(`${badge.emoji} Achievement unlocked: ${badge.name}!`, "success");
            }, 1800);
          });
        }
      } catch (e) {
        console.error(e);
        showToast("Something went wrong with the pettiness council.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const handleBattleSubmit = async (data: BattleFormData) => {
      setIsLoading(true);
      setBattleFormData(data);
      try {
        const response = await analyzeBattleAction(data);
        setBattleResult(response);
        playSuccess();

        const winnerScore = response.winner === 1 ? response.player1Score : response.player2Score;
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          mode: Mode.BATTLE,
          grievance: data.player1Grievance,
          result: {
            score: winnerScore,
            category: "Battle",
            analysis: response.verdict,
            advice: "",
          },
          timestamp: Date.now(),
          battle: {
            result: response,
            player1Name: data.player1Name,
            player1Grievance: data.player1Grievance,
            player2Name: data.player2Name,
            player2Grievance: data.player2Grievance,
          },
        };
        onHistoryAdd(newItem);
      } catch (e) {
        console.error(e);
        showToast("Battle arena is down. Try again!", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const handleReset = () => {
      playClick();
      setResult(null);
      setBattleResult(null);
      setBattleFormData(null);
      setSubjectName("");
      setGrievance("");
    };

    const isBattle = mode === Mode.BATTLE;
    const hasResult = isBattle ? !!battleResult : !!result;
    const showSwitcher = !hasResult && !isLoading;

    const slideX =
      mode === Mode.SELF ? 4
        : mode === Mode.OTHER ? "calc(100% + 4px)"
          : "calc(200% + 4px)";
    const slideColor =
      mode === Mode.SELF ? "#FF6B35"
        : mode === Mode.OTHER ? "#FF006E"
          : "#8338EC";

    return (
      <>
        {/* Mode Switcher */}
        <AnimatePresence>
          {showSwitcher && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 mb-8 relative max-w-sm mx-auto w-full"
            >
              <div className="grid grid-cols-3 w-full relative z-10">
                {[
                  { m: Mode.SELF,   icon: <User size={16} />,   label: "Am I Petty?" },
                  { m: Mode.OTHER,  icon: <Users size={16} />,  label: "Are They?" },
                  { m: Mode.BATTLE, icon: <Swords size={16} />, label: "Battle" },
                ].map(({ m, icon, label }) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      mode === m ? "text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
              <motion.div
                className="absolute top-1 bottom-1 left-0 w-[calc(33.333%-2.67px)] rounded-xl z-0"
                initial={false}
                animate={{ x: slideX, backgroundColor: slideColor }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grow flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {isBattle ? (
              battleResult && battleFormData ? (
                <BattleResultView
                  key="battle-result"
                  result={battleResult}
                  player1Name={battleFormData.player1Name}
                  player2Name={battleFormData.player2Name}
                  player1Grievance={battleFormData.player1Grievance}
                  player2Grievance={battleFormData.player2Grievance}
                  onReset={handleReset}
                />
              ) : (
                <BattleFormView
                  key="battle-form"
                  isLoading={isLoading}
                  loadingMessage={loadingMsg}
                  onSubmit={handleBattleSubmit}
                />
              )
            ) : !result ? (
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
  }
);

InteractiveMeter.displayName = "InteractiveMeter";
