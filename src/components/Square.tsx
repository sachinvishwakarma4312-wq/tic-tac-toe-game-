import React from "react";
import { motion } from "motion/react";

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinnerSquare: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinnerSquare }) => {
  const isX = value === "X";
  const isO = value === "O";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 border-2 flex items-center justify-center text-4xl font-bold transition-all duration-300
        ${isWinnerSquare ? "bg-white/10" : "bg-transparent"}
        ${isX ? "border-neon-cyan text-neon-cyan glow-cyan" : ""}
        ${isO ? "border-neon-pink text-neon-pink glow-pink" : ""}
        ${!value ? "border-white/20 hover:border-white/50" : ""}
      `}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
};

export default Square;
