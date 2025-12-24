import React from "react";
import { FUN_FACTS } from "@/constants";
import { ClientWrapper } from "./components/ClientWrapper";

export default function Home() {
  // Server-side: Pick a random fact for initial render
  const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];

  return (
    <div className="min-h-screen bg-bgLight text-dark selection:bg-primary selection:text-white flex flex-col pt-16">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-200 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-6 pb-24 max-w-2xl grow flex flex-col">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2 tracking-tight cursor-pointer">
            Petty Meter
          </h1>
          <div className="text-sm font-medium text-gray-500 bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white">
            💡 Fact: {randomFact}
          </div>
        </header>

        {/* Client-side Interactive Components */}
        <ClientWrapper />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
          <p>Francis said it's made for laughs, not legal advice.</p>
        </footer>
      </div>
    </div>
  );
}
