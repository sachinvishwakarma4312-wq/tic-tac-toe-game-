import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Cyber Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan",
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-purple",
  },
  {
    id: 3,
    title: "Digital Waves",
    artist: "Binary Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-pink",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (newProgress / 100) * duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md border-t border-white/10 p-6 flex flex-col md:flex-row items-center gap-6 rounded-t-3xl shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-4 flex-1">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center
            ${currentTrack.color === "neon-cyan" ? "border-neon-cyan text-neon-cyan glow-cyan" : ""}
            ${currentTrack.color === "neon-purple" ? "border-neon-purple text-neon-purple glow-purple" : ""}
            ${currentTrack.color === "neon-pink" ? "border-neon-pink text-neon-pink glow-pink" : ""}
          `}
        >
          <Music2 size={32} />
        </motion.div>

        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-lg font-bold tracking-tight"
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <p className="text-sm text-white/50">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 flex-1 w-full">
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${currentTrack.color === "neon-cyan" ? "bg-neon-cyan text-black glow-cyan" : ""}
              ${currentTrack.color === "neon-purple" ? "bg-neon-purple text-white glow-purple" : ""}
              ${currentTrack.color === "neon-pink" ? "bg-neon-pink text-white glow-pink" : ""}
            `}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 text-white/50">
        <Volume2 size={20} />
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-white/30"></div>
        </div>
      </div>
    </div>
  );
}
