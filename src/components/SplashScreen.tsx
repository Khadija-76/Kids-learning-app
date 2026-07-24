import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Volume2, VolumeX, RotateCcw, ArrowRight } from "lucide-react";
import { APP_IMAGES } from "../assets/images";
import { playFootprintSound, playSparkleSound, playFanfareSound, speakText, stopSpeaking } from "../utils/audio";

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  const [step, setStep] = useState<number>(0);
  const [footprints, setFootprints] = useState<{ id: number; x: number; y: number; color: string; rotation: number }[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVoiceSpoken, setIsVoiceSpoken] = useState<boolean>(false);

  // Generate floating bubbles and tiny sparkles
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 14 + (i % 5) * 8,
    left: (i * 8.5) % 90 + 5,
    duration: 6 + (i % 4) * 2,
    delay: i * 0.5,
  }));

  // Footprint sequence simulation
  useEffect(() => {
    setFootprints([]);
    setStep(0);
    setIsVoiceSpoken(false);

    const footprintColors = ["#F472B6", "#38BDF8", "#FBBF24", "#34D399", "#C084FC", "#FB923C"];
    
    // Animate footprints one by one across screen
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount < 6) {
        currentCount++;
        const newX = 15 + currentCount * 12; // percentage across
        const newY = 62 + (currentCount % 2 === 0 ? -4 : 4); // walking wave
        const newFootprint = {
          id: currentCount,
          x: newX,
          y: newY,
          color: footprintColors[(currentCount - 1) % footprintColors.length],
          rotation: currentCount % 2 === 0 ? 15 : -15,
        };

        setFootprints((prev) => [...prev, newFootprint]);
        if (!isAudioMuted) playFootprintSound();
        setStep(currentCount);
      } else {
        clearInterval(interval);
        // Mascot arrived at center!
        setTimeout(() => {
          setStep(7); // Show logo & tagline
          if (!isAudioMuted) playSparkleSound();

          // Spoken voice greeting - Warm Assalamu Alaikum welcome
          setTimeout(() => {
            if (!isAudioMuted) {
              speakText("Assalamu Alaikum! Welcome to TinySteps AI. Let's learn together.", {
                onEnd: () => setIsVoiceSpoken(true),
              });
            } else {
              setIsVoiceSpoken(true);
            }
            if (!isAudioMuted) playFanfareSound();
            setStep(8); // Show Get Started
          }, 600);
        }, 500);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      stopSpeaking();
    };
  }, [isAudioMuted]);

  const handleReplay = () => {
    stopSpeaking();
    setStep(0);
    setFootprints([]);
  };

  const handleStart = () => {
    if (!isAudioMuted) playSparkleSound();
    stopSpeaking();
    onGetStarted();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 via-amber-100 to-emerald-100 flex flex-col justify-between items-center font-sans select-none pb-8">
      {/* Top Bar Controls */}
      <div className="z-30 w-full max-w-md px-4 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/80">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-black text-sky-900 tracking-wide">TinySteps AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-sky-700 shadow-md hover:bg-white active:scale-95 transition-transform cursor-pointer"
            title="Toggle Sound"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-sky-600" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-sky-700 shadow-md hover:bg-white active:scale-95 transition-transform cursor-pointer"
            title="Replay Splash Scene"
          >
            <RotateCcw className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Sky Scene Magical Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Sunrise Sun Glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-b from-amber-300 via-orange-200 to-transparent rounded-full blur-3xl opacity-70"
        />

        {/* Floating Bubbles */}
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: "105vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
            style={{ left: `${b.left}%`, width: b.size, height: b.size }}
            className="absolute rounded-full bg-white/40 border border-white/60 shadow-xs backdrop-blur-2xs"
          />
        ))}

        {/* Sparkling Rainbow Arch */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[130%] max-w-lg h-52 opacity-90">
          <div className="w-full h-full rounded-t-full border-[18px] border-t-rose-400/80 border-x-transparent border-b-transparent relative">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 left-1/4 text-xl"
            >
              ✨
            </motion.div>
            <div className="w-full h-full rounded-t-full border-[14px] border-t-amber-300/85 border-x-transparent border-b-transparent mt-1">
              <div className="w-full h-full rounded-t-full border-[12px] border-t-emerald-300/85 border-x-transparent border-b-transparent mt-1">
                <div className="w-full h-full rounded-t-full border-[10px] border-t-sky-300/85 border-x-transparent border-b-transparent mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Fluffy Moving Clouds */}
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-12 left-4 text-white/95 text-6xl drop-shadow-lg"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [30, -30, 30] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute top-16 right-6 text-white/95 text-7xl drop-shadow-lg"
        >
          ☁️
        </motion.div>

        {/* Floating Balloons */}
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-32 left-8 text-4xl filter drop-shadow-md"
        >
          🎈
        </motion.div>
        <motion.div
          initial={{ y: 350, opacity: 0 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{ duration: 8, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-28 right-10 text-4xl filter drop-shadow-md"
        >
          🎈
        </motion.div>

        {/* Butterflies & Birds Flying Naturally */}
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 16, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="absolute top-44 left-1/4 text-3xl"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{ y: [0, -22, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, delay: 0.5, ease: "easeInOut" }}
          className="absolute top-40 right-1/4 text-3xl"
        >
          🐦
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-md px-6 flex-1 flex flex-col items-center justify-center relative my-auto">
        {/* Footprint Trail */}
        <div className="absolute inset-x-0 bottom-24 h-24 pointer-events-none">
          {footprints.map((fp) => (
            <motion.div
              key={fp.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              style={{
                left: `${fp.x}%`,
                top: `${fp.y}%`,
                transform: `rotate(${fp.rotation}deg)`,
                color: fp.color,
              }}
              className="absolute text-2xl drop-shadow-sm font-bold"
            >
              🐾
            </motion.div>
          ))}
        </div>

        {/* Mascot Center Stage with Tippy Waving */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: step >= 6 ? 1 : 0.95, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative my-3 flex flex-col items-center justify-center"
        >
          {/* Glowing Sun Rays Aura */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-300/50 via-sky-300/30 to-purple-300/40 rounded-full blur-2xl animate-pulse"></div>

          {/* Sparkles around image */}
          {step >= 6 && (
            <>
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute -top-6 -left-4 text-3xl text-amber-400 z-20"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 text-3xl text-pink-400 z-20"
              >
                🌟
              </motion.div>
            </>
          )}

          {/* Tippy Owl Avatar Card */}
          <div className="relative z-10 w-56 h-56 rounded-full p-2 bg-gradient-to-tr from-sky-400 via-amber-300 to-purple-400 shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden">
            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              src={APP_IMAGES.tippyOwl}
              alt="Tippy Owl Mascot"
              className="w-full h-full object-cover rounded-full shadow-inner"
            />

            {/* Waving Hand / Sparkle Tag */}
            <motion.div
              animate={{ rotate: [0, 20, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-2 right-4 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1"
            >
              <span>👋 Hi!</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Logo & Tagline reveal */}
        <AnimatePresence>
          {step >= 7 && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center text-center mt-2 z-20"
            >
              {/* Colorful Logo Header */}
              <div className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border-2 border-amber-300">
                <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
                <h1 className="text-3xl font-black tracking-tight">
                  <span className="text-sky-500">Tiny</span>
                  <span className="text-amber-500">Steps</span>{" "}
                  <span className="text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-2xl border border-purple-200 text-2xl font-black">
                    AI
                  </span>
                </h1>
                <Sparkles className="w-6 h-6 text-purple-500 animate-bounce" />
              </div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex items-center gap-2 text-xs font-black text-slate-800 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 shadow-sm"
              >
                <span className="text-sky-600">Learn</span>
                <span className="text-amber-500">•</span>
                <span className="text-emerald-600">Play</span>
                <span className="text-amber-500">•</span>
                <span className="text-purple-600">Grow</span>
              </motion.div>

              {/* Spoken greeting subtitle balloon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="mt-3 px-4 py-2.5 bg-white/95 rounded-2xl shadow-lg border-2 border-purple-300 max-w-xs text-xs font-extrabold text-sky-950 flex items-center gap-2"
              >
                <span className="text-2xl">🗣️</span>
                <span>"Assalamu Alaikum! Welcome to TinySteps AI. Let's learn together!"</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Rolling Hills & Blooming Flowers Ground */}
      <div className="relative w-full z-20 mt-auto">
        {/* Rolling Hills SVG Background */}
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-20 text-emerald-400">
            <path
              d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        {/* Green Ground Container */}
        <div className="w-full bg-emerald-400 pt-2 pb-8 px-6 flex flex-col items-center justify-center relative">
          {/* Blooming Flowers Softly Moving */}
          <div className="absolute -top-6 inset-x-0 flex justify-around px-8 pointer-events-none text-2xl">
            <motion.span animate={{ rotate: [-6, 6, -6], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              🌸
            </motion.span>
            <motion.span animate={{ rotate: [6, -6, 6], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3, delay: 0.3 }}>
              🌼
            </motion.span>
            <motion.span animate={{ rotate: [-8, 8, -8], scale: [0.95, 1.15, 0.95] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }}>
              🌻
            </motion.span>
            <motion.span animate={{ rotate: [5, -5, 5], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3.2, delay: 0.9 }}>
              🌷
            </motion.span>
          </div>

          {/* Glowing Get Started Button with Soft Bounce Animation */}
          <div className="w-full max-w-xs mt-2 z-30">
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 font-black text-xl shadow-2xl hover:shadow-amber-300/50 border-4 border-white flex items-center justify-center gap-3 tracking-wide cursor-pointer group"
            >
              <span>Get Started</span>
              <div className="w-9 h-9 rounded-full bg-amber-950/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-6 h-6 text-amber-950 stroke-[3]" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

