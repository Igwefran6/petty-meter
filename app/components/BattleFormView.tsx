"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { useTypewriter } from "react-simple-typewriter";
import { BattleFormData } from "@/types";
import { useSound } from "@/hooks/useSound";
import { BATTLE_LOADING_MESSAGES } from "@/constants";

interface BattleFormViewProps {
  isLoading: boolean;
  loadingMessage: string;
  onSubmit: (data: BattleFormData) => void;
}

export const BattleFormView: React.FC<BattleFormViewProps> = ({
  isLoading,
  loadingMessage,
  onSubmit,
}) => {
  const [p1Grievance, setP1Grievance] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p2Grievance, setP2Grievance] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [error, setError] = useState("");
  const { playClick } = useSound();

  const [p1Placeholder] = useTypewriter({
    words: [
      "They always take the last slice without asking...",
      "They reply 'k' to every paragraph I send...",
      "They never replace the toilet paper roll...",
    ],
    loop: 0,
    typeSpeed: 50,
    deleteSpeed: 25,
    delaySpeed: 2000,
  });

  const [p2Placeholder] = useTypewriter({
    words: [
      "They borrowed money and completely forgot...",
      "They cancel plans via text 5 minutes before...",
      "They eat smelly food in a shared space...",
    ],
    loop: 0,
    typeSpeed: 50,
    deleteSpeed: 25,
    delaySpeed: 2500,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!p1Grievance.trim() || p1Grievance.length < 5) {
      setError("Contender 1 needs more drama than that!");
      return;
    }
    if (!p2Grievance.trim() || p2Grievance.length < 5) {
      setError("Contender 2 needs more drama than that!");
      return;
    }
    setError("");
    onSubmit({
      player1Grievance: p1Grievance,
      player1Name: p1Name || undefined,
      player2Grievance: p2Grievance,
      player2Name: p2Name || undefined,
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="relative w-24 h-24 mb-8">
          <motion.div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <motion.div
            className="absolute inset-0 border-4 border-petty rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">⚔️</div>
        </div>
        <h3 className="text-xl font-bold text-dark mb-2 animate-pulse">Battle in progress...</h3>
        <p className="text-muted max-w-xs mx-auto">{loadingMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto space-y-5 bg-white p-6 rounded-3xl shadow-lg border border-purple-100"
      onSubmit={handleSubmit}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-petty mb-3">
          <Swords size={24} />
        </div>
        <h2 className="text-2xl font-bold text-dark">Who&apos;s More Petty?</h2>
        <p className="text-muted mt-1">Two enter. One is judged pettier. 🏟️</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Contender 1 */}
        <div className="space-y-3 bg-orange-50 rounded-2xl p-4 border border-orange-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Contender 1</p>
          <input
            type="text"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            placeholder="Name (optional)"
            className="w-full p-3 rounded-xl bg-white border-2 border-orange-100 focus:border-primary transition-all outline-none font-medium text-sm"
          />
          <textarea
            value={p1Grievance}
            onChange={(e) => setP1Grievance(e.target.value)}
            placeholder={p1Placeholder}
            rows={4}
            className="w-full p-3 rounded-xl bg-white border-2 border-orange-100 focus:border-primary transition-all outline-none resize-none font-medium text-sm"
          />
        </div>

        {/* VS divider */}
        <div className="hidden sm:flex items-center justify-center pt-10">
          <div className="w-10 h-10 rounded-full bg-petty text-white font-black text-xs flex items-center justify-center shadow-lg shrink-0">
            VS
          </div>
        </div>
        <div className="sm:hidden flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-black text-petty">VS</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Contender 2 */}
        <div className="space-y-3 bg-purple-50 rounded-2xl p-4 border border-purple-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-petty">Contender 2</p>
          <input
            type="text"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            placeholder="Name (optional)"
            className="w-full p-3 rounded-xl bg-white border-2 border-purple-100 focus:border-petty transition-all outline-none font-medium text-sm"
          />
          <textarea
            value={p2Grievance}
            onChange={(e) => setP2Grievance(e.target.value)}
            placeholder={p2Placeholder}
            rows={4}
            className="w-full p-3 rounded-xl bg-white border-2 border-purple-100 focus:border-petty transition-all outline-none resize-none font-medium text-sm"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-petty to-purple-600 hover:shadow-purple-200"
      >
        <Swords size={20} />
        <span>Start Battle</span>
      </button>
    </motion.form>
  );
};

// Re-export for use in InteractiveMeter loading message cycling
export { BATTLE_LOADING_MESSAGES };
