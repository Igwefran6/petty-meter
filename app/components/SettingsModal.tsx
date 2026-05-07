"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";
import { PersonaId } from "@/types";
import { PERSONAS } from "@/constants";
import { useSound } from "@/hooks/useSound";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaId;
  onPersonaChange: (id: PersonaId) => void;
}

const PERSONA_COLORS: Record<PersonaId, { active: string; ring: string }> = {
  judge:    { active: "bg-dark text-white border-dark",          ring: "ring-dark" },
  bestie:   { active: "bg-secondary text-white border-secondary", ring: "ring-secondary" },
  therapist:{ active: "bg-petty text-white border-petty",         ring: "ring-petty" },
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  persona,
  onPersonaChange,
}) => {
  const { playClick, playPop } = useSound();

  return (
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="text-primary" size={22} />
                <h2 className="text-xl font-black text-dark">Settings</h2>
              </div>
              <button
                onClick={() => { playPop(); onClose(); }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Persona Section */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                  Who&apos;s Judging You?
                </p>
                <p className="text-xs text-muted mb-4">
                  Choose the personality that delivers your verdict.
                </p>
                <div className="flex flex-col gap-3">
                  {PERSONAS.map((p) => {
                    const isActive = persona === p.id;
                    const colors = PERSONA_COLORS[p.id];
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => { playClick(); onPersonaChange(p.id); }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isActive
                            ? `${colors.active} shadow-md`
                            : "bg-gray-50 border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-3xl shrink-0">{p.emoji}</span>
                        <div>
                          <p className={`font-black text-sm ${isActive ? "text-white" : "text-dark"}`}>
                            {p.name}
                          </p>
                          <p className={`text-xs mt-0.5 ${isActive ? "text-white/70" : "text-muted"}`}>
                            {p.description}
                          </p>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="persona-check"
                            className="ml-auto text-white text-base font-black shrink-0"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
