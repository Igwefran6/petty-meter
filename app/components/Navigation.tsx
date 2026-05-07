"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ScrollText, Coffee, Info, X, Menu, Trophy } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface NavigationProps {
  onHome: () => void;
  onHistory: () => void;
  onCoffee: () => void;
  onStats: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onHome,
  onHistory,
  onCoffee,
  onStats,
}) => {
  const { playClick, playPop } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Items ordered from BOTTOM to TOP (visually when stacked)
  const navItems = [
    {
      id: "coffee",
      icon: <Coffee size={20} />,
      label: "Fuel Me",
      action: () => {
        playClick();
        onCoffee();
      },
      className: "bg-white",
    },
    {
      id: "stats",
      icon: <Trophy size={20} />,
      label: "My Stats",
      action: () => {
        playClick();
        onStats();
      },
      className: "bg-white text-yellow-500",
    },
    {
      id: "info",
      icon: <Info size={20} />,
      label: "The Tea",
      action: () => {
        playClick();
        setShowInfo(true);
      },
      className: "bg-white text-gray-600",
    },
    {
      id: "history",
      icon: <ScrollText size={20} />,
      label: "Receipts",
      action: () => {
        playPop();
        onHistory();
      },
      className: "bg-white text-gray-600",
    },
    {
      id: "home",
      icon: <Home size={20} />,
      label: "New Audit",
      action: () => {
        playClick();
        onHome();
      },
      className: "bg-white text-primary",
    },
  ];

  const toggleMenu = () => {
    playPop();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0 },
                },
                hidden: {
                  opacity: 0,
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
              className="flex flex-col items-end gap-3 mb-2"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    visible: { opacity: 1, y: 0, scale: 1 },
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-[10px] font-bold bg-white/90 backdrop-blur text-dark py-1 px-3 rounded-lg shadow-sm">
                    {item.label}
                  </span>
                  <button
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${item.className}`}
                  >
                    {item.icon}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors cursor-pointer z-50 ${
            isOpen ? "bg-dark text-white" : "bg-primary text-white"
          }`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm relative overflow-hidden"
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  💅
                </div>
                <h3 className="text-xl font-black text-dark mb-2">
                  Petty Meter AI
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                  We use advanced AI algorithms (and a bit of attitude) to
                  analyze your grievances. Scores are scientific*, but strictly
                  for entertainment.
                  <br />
                  <span className="text-[10px] opacity-70 italic block mt-2">
                    Source: Just trust me
                  </span>
                </p>

                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  v0.1.1 • Made with ☕
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
