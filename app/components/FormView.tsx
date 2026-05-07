import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Scale } from "lucide-react";
import { useTypewriter } from "react-simple-typewriter";
import { Mode, FormData } from "@/types";
import { useSound } from "@/hooks/useSound";

interface FormViewProps {
  mode: Mode;
  isLoading: boolean;
  onSubmit: (data: FormData) => void;
  loadingMessage: string;
}


export const FormView: React.FC<FormViewProps> = ({
  mode,
  isLoading,
  onSubmit,
  loadingMessage,
}) => {
  const [grievance, setGrievance] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { playClick } = useSound();

  const isSelf = mode === Mode.SELF;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!grievance.trim() || grievance.length < 5) {
      setError("Come on, give me a bit more drama than that!");
      return;
    }
    setError("");
    onSubmit({ grievance, name });
  };

  const placeholders = isSelf
    ? [
        "My roommate didn't refill the Brita filter...",
        "Someone took my usual parking spot...",
        "My text was left on read for 3 hours...",
      ]
    : [
        "They're mad because I didn't like their story fast enough...",
        "They cancelled plans because the restaurant didn't have valet...",
        "They're upset their coffee had too much foam...",
      ];

  const [typewriterPlaceholder] = useTypewriter({
    words: placeholders,
    loop: 0,
    typeSpeed: 50,
    deleteSpeed: 25,
    delaySpeed: 2000,
  });

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
            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            ⚖️
          </div>
        </div>
        <h3 className="text-xl font-bold text-dark mb-2 animate-pulse">
          Judging in progress...
        </h3>
        <p className="text-muted max-w-xs mx-auto">{loadingMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto space-y-6 bg-white p-6 rounded-3xl shadow-lg border border-orange-100"
      onSubmit={handleSubmit}
    >
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-primary mb-3">
          <Scale size={24} />
        </div>
        <h2 className="text-2xl font-bold text-dark">
          {isSelf ? "How Petty Are You?" : "How Ridiculous Are They?"}
        </h2>
        <p className="text-muted mt-1">
          {isSelf
            ? "Be honest... we won't tell anyone 🤫"
            : "Describe the drama and let AI judge 👨‍⚖️"}
        </p>
      </div>

      {!isSelf && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Who's being petty?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sarah, My Boss, The Ex"
            className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white transition-all outline-none font-medium"
          />
        </div>
      )}

      <div className="space-y-2 mt-4">
        <label className="text-sm font-bold text-gray-700 ml-1">
          {isSelf ? "What's bothering you?" : "What did they complain about?"}
        </label>
        <textarea
          value={grievance}
          onChange={(e) => setGrievance(e.target.value)}
          placeholder={typewriterPlaceholder}
          rows={4}
          className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white transition-all outline-none resize-none font-medium"
        />
        {error && (
          <p className="text-red-500 text-sm ml-1 font-medium">{error}</p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer
          ${
            isSelf
              ? "bg-linear-to-r from-primary to-orange-500 hover:shadow-orange-200"
              : "bg-linear-to-r from-secondary to-pink-600 hover:shadow-pink-200"
          }`}
      >
        <span>{isSelf ? "Judge My Pettiness" : "Expose Their Pettiness"}</span>
        <Send size={20} />
      </button>
    </motion.form>
  );
};
