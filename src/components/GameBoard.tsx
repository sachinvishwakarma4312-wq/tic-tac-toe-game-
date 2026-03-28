import { useState, useEffect } from "react";
import Square from "./Square";
import { motion } from "motion/react";

type Player = "X" | "O";

interface GameBoardProps {
  onScoreUpdate: (winner: Player | "Draw") => void;
}

export default function GameBoard({ onScoreUpdate }: GameBoardProps) {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player | "Draw" | null; line: number[] | null }>( { winner: null, line: null });
  const [isVsComputer, setIsVsComputer] = useState<boolean>(true);

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function calculateWinner(squares: (string | null)[]) {
    for (let i = 0; i < WIN_LINES.length; i++) {
      const [a, b, c] = WIN_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as Player, line: WIN_LINES[i] };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: "Draw" as const, line: null };
    }
    return null;
  }

  function getComputerMove(currentSquares: (string | null)[]) {
    // 1. Can I win?
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      const vals = [currentSquares[a], currentSquares[b], currentSquares[c]];
      if (vals.filter(v => v === 'O').length === 2 && vals.filter(v => v === null).length === 1) {
        return line[vals.indexOf(null)];
      }
    }

    // 2. Must I block?
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      const vals = [currentSquares[a], currentSquares[b], currentSquares[c]];
      if (vals.filter(v => v === 'X').length === 2 && vals.filter(v => v === null).length === 1) {
        return line[vals.indexOf(null)];
      }
    }

    // 3. Center?
    if (currentSquares[4] === null) return 4;

    // 4. Random
    const available = currentSquares.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return null;
  }

  function handleClick(i: number) {
    if (winnerInfo.winner || squares[i]) return;
    // If it's vs computer and it's O's turn, don't allow manual click
    if (isVsComputer && !xIsNext) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // Handle computer move
  useEffect(() => {
    if (isVsComputer && !xIsNext && !winnerInfo.winner) {
      const timer = setTimeout(() => {
        const move = getComputerMove(squares);
        if (move !== null) {
          const nextSquares = squares.slice();
          nextSquares[move] = "O";
          setSquares(nextSquares);
          setXIsNext(true);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, isVsComputer, squares, winnerInfo.winner]);

  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setWinnerInfo(result);
      onScoreUpdate(result.winner);
    }
  }, [squares]);

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
  }

  const status = winnerInfo.winner
    ? winnerInfo.winner === "Draw"
      ? "It's a Draw!"
      : `Winner: ${winnerInfo.winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => { setIsVsComputer(false); resetGame(); }}
          className={`px-4 py-1 text-xs uppercase tracking-widest border transition-all ${!isVsComputer ? 'border-neon-cyan text-neon-cyan glow-cyan' : 'border-white/20 text-white/40'}`}
        >
          2 Players
        </button>
        <button
          onClick={() => { setIsVsComputer(true); resetGame(); }}
          className={`px-4 py-1 text-xs uppercase tracking-widest border transition-all ${isVsComputer ? 'border-neon-cyan text-neon-cyan glow-cyan' : 'border-white/20 text-white/40'}`}
        >
          vs Computer
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-2xl font-bold uppercase tracking-widest ${
          xIsNext ? "text-neon-cyan text-glow-cyan" : "text-neon-pink text-glow-pink"
        }`}
      >
        {status}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onClick={() => handleClick(i)}
            isWinnerSquare={winnerInfo.line?.includes(i) ?? false}
          />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetGame}
        className="px-8 py-3 bg-transparent border-2 border-neon-green text-neon-green font-bold uppercase tracking-widest hover:bg-neon-green hover:text-black transition-all duration-300 glow-green"
      >
        Reset Grid
      </motion.button>
    </div>
  );
}
