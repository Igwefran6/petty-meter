import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2, Loader2, Award } from "lucide-react";
import { AnalysisResult, Mode } from "@/types";
import { Gauge } from "./Gauge";
import { useSound } from "@/hooks/useSound";
// @ts-ignore
import html2canvas from "html2canvas";

interface ResultViewProps {
  result: AnalysisResult;
  mode: Mode;
  name?: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  mode,
  name,
  onReset,
}) => {
  const isSelf = mode === Mode.SELF;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { playClick } = useSound();

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    playClick();
    setIsSharing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#FFF5EB",
        logging: false,
        useCORS: true,
        allowTaint: true,
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
      alert("Failed to generate image. Try taking a normal screenshot!");
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
        className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border-b-8 relative overflow-hidden flex flex-col"
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

        <Gauge score={result.score} />

        <div className="mt-6 space-y-4 relative z-10">
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
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
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
          <button
            onClick={() => {
              playClick();
              onReset();
            }}
            disabled={isSharing}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gray-100 text-dark font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-primary text-white font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200 disabled:opacity-80 cursor-pointer"
          >
            {isSharing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Share2 size={18} />
            )}
            {isSharing ? "Capturing..." : "Share Result"}
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest opacity-40">
        Strictly for entertainment & tea-sipping purposes
      </p>
    </motion.div>
  );
};
