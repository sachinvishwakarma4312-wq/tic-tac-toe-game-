import { useState } from "react";
import GameBoard from "./components/GameBoard";
import MusicPlayer from "./components/MusicPlayer";
import { motion } from "motion/react";

export default function App() {
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const handleScoreUpdate = (winner: "X" | "O" | "Draw") => {
    if (winner === "X") {
      setScores((prev) => ({ ...prev, X: prev.X + 1 }));
    } else if (winner === "O") {
      setScores((prev) => ({ ...prev, O: prev.O + 1 }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen pt-12">
      <header className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white mb-4"
        >
          Neon <span className="text-neon-cyan text-glow-cyan">Pulse</span>
        </motion.h1>
        
        <div className="flex gap-8 justify-center items-center mt-6">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-white/40 mb-1">Player X</span>
            <span className="text-3xl font-mono text-neon-cyan text-glow-cyan">{scores.X}</span>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-white/40 mb-1">Player O</span>
            <span className="text-3xl font-mono text-neon-pink text-glow-pink">{scores.O}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center w-full px-4 mb-24">
        <GameBoard onScoreUpdate={handleScoreUpdate} />
      </main>

      <footer className="fixed bottom-0 w-full flex justify-center z-50">
        <MusicPlayer />
      </footer>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
