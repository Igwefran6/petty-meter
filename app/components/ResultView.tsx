import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2, Loader2, Award, Twitter, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { AnalysisResult, Mode } from "@/types";
import { ZONES } from "@/constants";
import { Gauge } from "./Gauge";
import { useSound } from "@/hooks/useSound";
import { useToast } from "../context/ToastContext";

interface ResultViewProps {
  result: AnalysisResult;
  mode: Mode;
  name?: string;
  grievance: string;
  onReset: () => void;
  onRetry: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  mode,
  name,
  grievance,
  onReset,
  onRetry,
}) => {
  const isSelf = mode === Mode.SELF;
  const isError = result.category === "Error";
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { playClick, playError } = useSound();
  const { showToast } = useToast();

  const zone = ZONES.find((z) => result.score >= z.min && result.score <= z.max);

  const TWEET_LINES: Record<string, string> = {
    "Legitimate Concern": `I just got rated ${result.score}% petty — turns out I'm NOT the problem 😇`,
    "Minor Annoyance":    `Okay, ${result.score}% petty. Minor annoyance energy, I admit it 😤`,
    "Getting Petty":      `${result.score}% petty and I'm fully aware 👀 Petty Meter called me out`,
    "Peak Pettiness":     `Peak Pettiness unlocked 💅 ${result.score}% petty and I can't even deny it`,
    "Let It Go":          `I have been EXPOSED 💀 ${result.score}% petty. I need help.`,
  };

  const handleTwitterShare = () => {
    playClick();
    const line = zone ? TWEET_LINES[zone.label] : `I scored ${result.score}% on Petty Meter!`;
    const url = "https://pettymeter.vercel.app";
    const tweet = `${line}\n\nFind out yours 👇 ${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank"
    );
  };

  const handleCopy = async () => {
    playClick();
    const text = [
      `⚖️ Petty Meter Result`,
      `Score: ${result.score}% — ${zone?.label ?? "Unknown"}`,
      ``,
      `Complaint: "${grievance}"`,
      ``,
      `Analysis: ${result.analysis}`,
      ``,
      `Reality Check: ${result.advice}`,
      ``,
      `Try it yourself → https://pettymeter.vercel.app`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showToast("Result copied to clipboard! 📋", "success");
    } catch {
      showToast("Couldn't copy — try manually!", "error");
    }
  };

  useEffect(() => {
    if (isError) {
      playError();
      return;
    }
    if (result.score === -1) return;

    const timer = setTimeout(() => {
      if (result.score >= 80) {
        // Chaotic confetti burst for peak pettiness
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#FF006E", "#FF6B35", "#FFBE0B", "#8338EC"],
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { x: 0.2, y: 0.6 },
            colors: ["#FF006E", "#FF6B35"],
          });
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { x: 0.8, y: 0.6 },
            colors: ["#FFBE0B", "#8338EC"],
          });
        }, 200);
      } else if (result.score <= 20 && result.score >= 0) {
        // Slow gentle fall for legitimate concerns
        confetti({
          particleCount: 40,
          spread: 60,
          gravity: 0.4,
          drift: 0,
          ticks: 300,
          origin: { y: 0.3 },
          colors: ["#8AC926", "#a8d8a8", "#c8e6c8"],
          shapes: ["circle"],
        });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [result.score]);

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    playClick();
    setIsSharing(true);

    try {
      // Dynamic import of html2canvas-pro
      const html2canvas = (await import("html2canvas-pro")).default;

      // Wait a bit for any animations to settle
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher scale for peak quality
        backgroundColor: "#FFF5EB", // Match the card/background color
        logging: false,
        useCORS: true,
        allowTaint: true,
        // Exclude elements with the ignore attribute
        ignoreElements: (element) => {
          if (
            element.getAttribute &&
            element.getAttribute("data-html2canvas-ignore")
          ) {
            return true;
          }
          return false;
        },
      });

      canvas.toBlob(
        async (blob: Blob | null) => {
          if (!blob) throw new Error("Canvas to Blob failed");
          const fileName = `pettiness-meter-${Date.now()}.png`;
          const file = new File([blob], fileName, { type: "image/png" });

          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            try {
              await navigator.share({
                title: "Petty Meter",
                text: isSelf
                  ? `I just got rated ${result.score}% PETTY on Petty Meter! 💀`
                  : `I just exposed ${name || "them"} as ${
                      result.score
                    }% PETTY! 💀`,
                files: [file],
              });
            } catch (e) {
              console.log("Share dismissed", e);
            }
          } else {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Capture failed", err);
      showToast(
        "Failed to generate image. Try taking a normal screenshot!",
        "error"
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto mb-16"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-4xl shadow-2xl p-6 md:p-8 border-b-2 relative overflow-hidden flex flex-col"
        style={{ borderColor: result.score > 50 ? "#FF006E" : "#8AC926" }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center pt-6 pr-6">
          <Award className="text-primary opacity-20" size={48} />
        </div>

        <div className="text-center mb-2 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-1 block">
            Official Certificate of Drama
          </span>
          <h2 className="text-2xl font-black text-dark leading-tight">
            {isSelf
              ? "Your Pettiness Report"
              : `${name || "The Victim"}'s Exposure`}
          </h2>
        </div>

        <Gauge score={result.score} isError={isError} />

        <div className="mt-6 space-y-4 relative z-10">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              The Complaint
            </h3>
            <p className="text-dark leading-relaxed font-medium text-sm italic">
              "{grievance}"
            </p>
          </div>

          <div className="bg-bgLight p-4 rounded-2xl border border-orange-100 shadow-sm">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              The Analysis
            </h3>
            <p className="text-dark leading-relaxed font-medium text-sm">
              {result.analysis}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Reality Check
            </h3>
            <p className="text-dark leading-relaxed font-medium text-sm">
              {result.advice}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-[0.15em]">
          <span>⚖️ Pettiness Meter AI</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 mt-8 relative z-20"
          data-html2canvas-ignore="true"
        >
          {isError ? (
            <>
              <button
                onClick={() => { playClick(); onReset(); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gray-100 text-dark font-bold hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
              >
                Go Home
              </button>
              <button
                onClick={() => { playClick(); onRetry(); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-primary text-white font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200 cursor-pointer"
              >
                <RefreshCcw size={18} />
                Retry
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { playClick(); onReset(); }}
                disabled={isSharing}
                title="Try Again"
                className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-gray-100 text-dark hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCcw size={20} />
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing}
                title="Share Result"
                className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-primary text-white hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200 disabled:opacity-80 cursor-pointer"
              >
                {isSharing ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
              </button>
              <button
                onClick={handleTwitterShare}
                disabled={isSharing}
                title="Post on X"
                className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-black text-white hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={handleCopy}
                disabled={isSharing}
                title="Copy Result"
                className="flex-1 flex items-center justify-center py-4 px-4 rounded-2xl bg-gray-100 text-dark hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Copy size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
