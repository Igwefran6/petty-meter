import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ChevronRight, Calendar } from "lucide-react";
import { HistoryItem, Mode } from "@/types";
import { ZONES } from "@/constants";

interface HistoryViewProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClear,
  onSelect,
  onDeleteOne,
}) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center bg-bg-light p-6 rounded-2xl"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <History size={32} />
        </div>
        <h3 className="text-xl font-bold text-dark mb-2">No receipts found</h3>
        <p className="text-muted max-w-xs">
          You haven't analyzed any drama yet. Your history will appear here once
          you do.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 bg-bg-light p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base md:text-2xl font-black text-dark flex items-center gap-2">
          <History className="text-primary" />
          Drama Archive
        </h2>
        <button
          onClick={onClear}
          className="text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={12} />
          Burn Receipts
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 py-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {history.map((item, index) => {
            const isBattle = item.mode === Mode.BATTLE;
            const zone = isBattle
              ? null
              : ZONES.find((z) => item.result.score >= z.min && item.result.score <= z.max) || ZONES[0];
            const date = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: "short", day: "numeric",
            });
            const p1Name = item.battle?.player1Name || "Contender 1";
            const p2Name = item.battle?.player2Name || "Contender 2";
            const winnerName = item.battle
              ? (item.battle.result.winner === 1 ? p1Name : p2Name)
              : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
                onClick={() => onSelect(item)}
              >
                {/* Score Badge */}
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 text-white font-black shadow-sm"
                  style={{ backgroundColor: isBattle ? "#8338EC" : zone?.color }}
                >
                  {isBattle ? (
                    <>
                      <span className="text-xl">⚔️</span>
                      <span className="text-[7px] uppercase tracking-tighter opacity-80 leading-none">
                        Battle
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">{item.result.score}%</span>
                      <span className="text-[7px] uppercase tracking-tighter opacity-80 leading-none">
                        Petty
                      </span>
                    </>
                  )}
                </div>

                {/* Content Summary */}
                <div className="grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        isBattle
                          ? "bg-purple-100 text-petty"
                          : item.mode === "self"
                          ? "bg-orange-100 text-primary"
                          : "bg-pink-100 text-secondary"
                      }`}
                    >
                      {isBattle ? "⚔️ Battle" : item.mode === "self" ? "Self" : "Other"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                      <Calendar size={10} />
                      {date}
                    </span>
                  </div>
                  <h4 className="font-bold text-dark truncate">
                    {isBattle
                      ? `${p1Name} vs ${p2Name}`
                      : item.mode === "self"
                      ? "Your Grievance"
                      : `${item.name || "Someone"}'s Drama`}
                  </h4>
                  <p className="text-xs text-muted truncate italic">
                    {isBattle
                      ? winnerName ? `👑 ${winnerName} wins` : ""
                      : `"${item.grievance}"`}
                  </p>
                </div>

                {/* Action / Icon */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteOne(item.id); }}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight
                    className="text-gray-200 group-hover:text-primary transition-colors"
                    size={20}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
