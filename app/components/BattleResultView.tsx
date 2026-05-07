"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2, Loader2, Twitter, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { BattleResult } from "@/types";
import { ZONES } from "@/constants";
import { useSound } from "@/hooks/useSound";
import { useToast } from "../context/ToastContext";

interface BattleResultViewProps {
  result: BattleResult;
  player1Name?: string;
  player2Name?: string;
  player1Grievance: string;
  player2Grievance: string;
  onReset: () => void;
}

export const BattleResultView: React.FC<BattleResultViewProps> = ({
  result,
  player1Name,
  player2Name,
  player1Grievance,
  player2Grievance,
  onReset,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { playClick } = useSound();
  const { showToast } = useToast();

  const p1Name = player1Name || "Contender 1";
  const p2Name = player2Name || "Contender 2";
  const winnerName = result.winner === 1 ? p1Name : p2Name;

  const p1Zone = ZONES.find((z) => result.player1Score >= z.min && result.player1Score <= z.max);
  const p2Zone = ZONES.find((z) => result.player2Score >= z.min && result.player2Score <= z.max);

  useEffect(() => {
    const t = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#8338EC", "#FF006E", "#FFBE0B", "#FF6B35"],
      });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    playClick();
    const text = [
      `⚔️ Petty Meter — Battle Mode`,
      ``,
      `${p1Name}: ${result.player1Score}% petty`,
      `"${player1Grievance}"`,
      result.player1Analysis,
      ``,
      `${p2Name}: ${result.player2Score}% petty`,
      `"${player2Grievance}"`,
      result.player2Analysis,
      ``,
      `🏆 Winner: ${winnerName}`,
      `Verdict: ${result.verdict}`,
      ``,
      `Find out yours → https://pettymeter.vercel.app`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showToast("Battle result copied! 📋", "success");
    } catch {
      showToast("Couldn't copy — try manually!", "error");
    }
  };

  const handleTwitterShare = () => {
    playClick();
    const tweet = `⚔️ BATTLE: ${p1Name} (${result.player1Score}%) vs ${p2Name} (${result.player2Score}%)\n\n🏆 ${winnerName} wins the pettiness crown\n\n"${result.verdict.slice(0, 120)}..."\n\nSettle your drama 👇 https://pettymeter.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  };

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    playClick();
    setIsSharing(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      await new Promise((r) => setTimeout(r, 300));
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#FFF5EB",
        logging: false,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (el) => !!el.getAttribute?.("data-html2canvas-ignore"),
      });
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Blob failed");
        const file = new File([blob], `petty-battle-${Date.now()}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: "Petty Meter Battle", files: [file] });
        } else {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = file.name;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }, "image/png", 1.0);
    } catch {
      showToast("Failed to capture. Try a screenshot!", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const PlayerCard = ({
    name, score, analysis, grievance, isWinner, zone,
  }: {
    name: string; score: number; analysis: string; grievance: string;
    isWinner: boolean; zone: typeof ZONES[0] | undefined;
  }) => (
    <div className={`rounded-2xl p-5 border-2 flex flex-col gap-3 transition-all ${
      isWinner
        ? "border-petty bg-purple-50 shadow-lg shadow-purple-100"
        : "border-gray-100 bg-gray-50 opacity-70"
    }`}>
      <div className="flex items-center justify-between">
        <p className="font-black text-dark text-sm truncate">{name}</p>
        <span className="text-2xl">{isWinner ? "👑" : "💀"}</span>
      </div>
      <div className="text-center">
        <p className="text-5xl font-black tabular-nums" style={{ color: zone?.color ?? "#374151" }}>
          {score}%
        </p>
        {zone && (
          <p className="text-[10px] font-bold mt-1" style={{ color: zone.color }}>
            {zone.label}
          </p>
        )}
      </div>
      <p className="text-xs text-muted italic line-clamp-2">&quot;{grievance}&quot;</p>
      <p className="text-sm text-dark font-medium leading-relaxed">{analysis}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto mb-16"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-4xl shadow-2xl p-6 md:p-8 border-b-2 border-petty relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted block mb-1">
            Official Pettiness Battle
          </span>
          <h2 className="text-2xl font-black text-dark">
            {p1Name} <span className="text-petty">⚔️</span> {p2Name}
          </h2>
        </div>

        {/* Player cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
          <PlayerCard
            name={p1Name}
            score={result.player1Score}
            analysis={result.player1Analysis}
            grievance={player1Grievance}
            isWinner={result.winner === 1}
            zone={p1Zone}
          />
          <PlayerCard
            name={p2Name}
            score={result.player2Score}
            analysis={result.player2Analysis}
            grievance={player2Grievance}
            isWinner={result.winner === 2}
            zone={p2Zone}
          />
        </div>

        {/* Verdict */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-6 relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-petty mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-petty animate-pulse inline-block" />
            The Verdict
          </h3>
          <p className="text-dark font-medium leading-relaxed">{result.verdict}</p>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-[0.15em] mb-6">
          <span>⚔️ Pettiness Meter AI — Battle Mode</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 relative z-20" data-html2canvas-ignore="true">
          <button
            onClick={() => { playClick(); onReset(); }}
            title="Try Again"
            className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-gray-100 text-dark hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCcw size={20} />
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing}
            title="Share Image"
            className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-petty text-white hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-200 disabled:opacity-80 cursor-pointer"
          >
            {isSharing ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
          </button>
          <button
            onClick={handleTwitterShare}
            title="Post on X"
            className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-black text-white hover:bg-gray-900 transition-all active:scale-95 cursor-pointer"
          >
            <Twitter size={20} />
          </button>
          <button
            onClick={handleCopy}
            title="Copy Result"
            className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-gray-100 text-dark hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
