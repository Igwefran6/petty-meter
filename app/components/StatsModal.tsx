"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart2, Lock } from "lucide-react";
import { getStats, resetStats, StatsRecord, MomentRecord } from "@/lib/statsStorage";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { ZONES } from "@/constants";
import { ConfirmModal } from "./ui/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { useSound } from "@/hooks/useSound";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewMoment?: (moment: MomentRecord) => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, onViewMoment }) => {
  const [stats, setStats] = useState<StatsRecord | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { showToast } = useToast();
  const { playClick, playPop } = useSound();

  useEffect(() => {
    if (isOpen) setStats(getStats());
  }, [isOpen]);

  const handleReset = () => {
    playClick();
    setIsConfirmOpen(true);
  };

  const confirmReset = () => {
    resetStats();
    setStats(getStats());
    showToast("Stats wiped. Fresh start! 🧹", "success");
  };

  const averageScore =
    stats && stats.totalAnalyses > 0
      ? Math.round(stats.scoreSum / stats.totalAnalyses)
      : null;

  const avgZone = averageScore !== null
    ? ZONES.find((z) => averageScore >= z.min && averageScore <= z.max)
    : null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-primary" size={22} />
                  <h2 className="text-xl font-black text-dark">My Stats</h2>
                </div>
                <button
                  onClick={() => { playPop(); onClose(); }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-6">
                {!stats || stats.totalAnalyses === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="font-bold text-dark">No data yet</p>
                    <p className="text-sm text-muted mt-1">
                      Complete an analysis to start tracking your stats.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                          Total Analyses
                        </p>
                        <p className="text-3xl font-black text-dark">
                          {stats.totalAnalyses}
                        </p>
                      </div>

                      <div
                        className="rounded-2xl p-4 border"
                        style={{
                          backgroundColor: avgZone
                            ? `${avgZone.color}18`
                            : "#f9fafb",
                          borderColor: avgZone ? `${avgZone.color}40` : "#e5e7eb",
                        }}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                          Avg Score
                        </p>
                        <p
                          className="text-3xl font-black"
                          style={{ color: avgZone?.color ?? "#374151" }}
                        >
                          {averageScore}%
                        </p>
                        {avgZone && (
                          <p className="text-[10px] font-bold text-muted mt-0.5">
                            {avgZone.label}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pettiest Moment */}
                    {stats.pettiest && (
                      <div
                        onClick={() => {
                          if (stats.pettiest?.analysis && onViewMoment) {
                            onViewMoment(stats.pettiest);
                            onClose();
                          }
                        }}
                        className={`bg-pink-50 rounded-2xl p-4 border border-pink-100 transition-all ${
                          stats.pettiest.analysis && onViewMoment
                            ? "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
                            : ""
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2 flex items-center justify-between">
                          <span>🏆 Pettiest Moment</span>
                          {stats.pettiest.analysis && onViewMoment && (
                            <span className="text-pink-300 normal-case font-bold tracking-normal">View →</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-2xl font-black shrink-0"
                            style={{ color: "#FF006E" }}
                          >
                            {stats.pettiest.score}%
                          </span>
                          <p className="text-sm text-dark font-medium italic truncate">
                            "{stats.pettiest.grievance}"
                          </p>
                        </div>
                        <p className="text-[10px] text-muted mt-1">
                          {new Date(stats.pettiest.date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Most Valid Moment */}
                    {stats.mostValid && (
                      <div
                        onClick={() => {
                          if (stats.mostValid?.analysis && onViewMoment) {
                            onViewMoment(stats.mostValid);
                            onClose();
                          }
                        }}
                        className={`bg-green-50 rounded-2xl p-4 border border-green-100 transition-all ${
                          stats.mostValid.analysis && onViewMoment
                            ? "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
                            : ""
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2 flex items-center justify-between">
                          <span>✅ Most Valid Moment</span>
                          {stats.mostValid.analysis && onViewMoment && (
                            <span className="text-green-300 normal-case font-bold tracking-normal">View →</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-green-600 shrink-0">
                            {stats.mostValid.score}%
                          </span>
                          <p className="text-sm text-dark font-medium italic truncate">
                            "{stats.mostValid.grievance}"
                          </p>
                        </div>
                        <p className="text-[10px] text-muted mt-1">
                          {new Date(stats.mostValid.date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Achievements */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">
                        Achievements ({stats.achievements.length}/{ACHIEVEMENTS.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {ACHIEVEMENTS.map((a) => {
                          const earned = stats.achievements.includes(a.id);
                          return (
                            <div
                              key={a.id}
                              className={`rounded-2xl p-3 border transition-all ${
                                earned
                                  ? "bg-orange-50 border-orange-100"
                                  : "bg-gray-50 border-gray-100 opacity-50"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">
                                  {earned ? a.emoji : <Lock size={16} className="text-gray-400" />}
                                </span>
                                <p className={`text-xs font-black ${earned ? "text-dark" : "text-gray-400"}`}>
                                  {a.name}
                                </p>
                              </div>
                              <p className="text-[10px] text-muted leading-tight">
                                {a.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 transition-colors cursor-pointer border border-red-100"
                >
                  Reset All Stats
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmReset}
        title="Wipe Your Stats?"
        message="This will permanently delete your stats and all earned achievements. There is no turning back."
        confirmText="Wipe It 🧹"
        isDangerous={true}
      />
    </>
  );
};
