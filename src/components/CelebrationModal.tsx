import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Star, Award, Volume2, CheckCircle2, Flame, Heart } from "lucide-react";
import { Milestone, SupportedLanguage, VoiceSettings } from "../types";
import { APP_IMAGES } from "../assets/images";
import { playFanfareSound, playSparkleSound, playPopSound, speakText } from "../utils/audio";

interface CelebrationModalProps {
  milestone: Milestone;
  childName?: string;
  childLanguage?: SupportedLanguage;
  voiceSettings?: VoiceSettings;
  onClose: () => void;
  onClaimRewards?: (stars: number, coins: number) => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  milestone,
  childName = "Little Explorer",
  childLanguage = "English",
  voiceSettings = { gender: "female", speed: "normal" },
  onClose,
  onClaimRewards,
}) => {
  const voiceGender: "female" | "male" = (voiceSettings?.gender as "female" | "male") || "female";
  const voiceSpeed: "slow" | "normal" = (voiceSettings?.speed as "slow" | "normal") || "normal";

  useEffect(() => {
    // Play fanfare sound
    playFanfareSound();

    // Voice announcement from Tippy the Owl
    const message = `Yay, ${childName}! ${milestone.tippySpeech}`;
    speakText(message, {
      lang: childLanguage,
      gender: voiceGender,
      speed: voiceSpeed,
    });
  }, [milestone, childName, childLanguage, voiceGender, voiceSpeed]);

  const handleClaim = () => {
    playSparkleSound();
    if (onClaimRewards) {
      onClaimRewards(milestone.rewardStars, milestone.rewardCoins);
    }
    onClose();
  };

  const handleReplayVoice = () => {
    playPopSound();
    speakText(`${childName}, ${milestone.tippySpeech}`, {
      lang: childLanguage,
      gender: voiceGender,
      speed: voiceSpeed,
    });
  };

  // Particles generator
  const confettiColors = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6", "#ef4444"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        {/* Confetti / Particle Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}vw`,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.8 + 0.5,
              }}
              animate={{
                y: "105vh",
                rotate: 360,
                x: `${Math.random() * 100}vw`,
              }}
              transition={{
                duration: Math.random() * 3 + 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
              }}
              className="absolute w-3.5 h-3.5 rounded-full shadow-lg opacity-80"
            />
          ))}
        </div>

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-white to-purple-50 rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center space-y-5 my-auto z-10"
        >
          {/* Top Banner Ribbon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black text-xs uppercase px-6 py-2 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
            <Trophy className="w-4 h-4 fill-amber-950" />
            <span>Special Milestone Achieved!</span>
            <Trophy className="w-4 h-4 fill-amber-950" />
          </div>

          {/* Tippy Owl Mascot & Celebration Aura */}
          <div className="pt-3 flex flex-col items-center justify-center relative">
            <div className="relative">
              {/* Pulsing Light Aura */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300 via-pink-400 to-purple-400 blur-2xl opacity-60"
              />

              {/* Tippy Mascot Circle */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative w-28 h-28 rounded-full bg-white p-1.5 shadow-2xl border-4 border-amber-300 flex items-center justify-center"
              >
                <img
                  src={APP_IMAGES.tippyOwl}
                  alt="Tippy Owl"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Golden Crown Badge on Tippy */}
                <div className="absolute -top-3 -right-2 bg-amber-400 text-amber-950 rounded-full p-2 shadow-lg border-2 border-white text-xl">
                  👑
                </div>
              </motion.div>

              {/* Floating Stars */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute -inset-4 pointer-events-none"
              >
                <span className="absolute top-0 left-0 text-2xl">⭐</span>
                <span className="absolute top-0 right-0 text-2xl">🌟</span>
                <span className="absolute bottom-0 left-2 text-2xl">✨</span>
                <span className="absolute bottom-0 right-2 text-2xl">🎉</span>
              </motion.div>
            </div>

            <h2 className="text-2xl font-black text-amber-950 mt-3 tracking-tight">
              {milestone.title}
            </h2>

            <p className="text-xs font-bold text-amber-800/80 max-w-xs mt-1">
              {milestone.description}
            </p>
          </div>

          {/* Speech Bubble from Tippy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border-2 border-purple-200 shadow-md relative text-left space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🦉</span>
                <span className="font-extrabold text-xs text-purple-900">
                  Tippy Owl says:
                </span>
              </div>

              <button
                onClick={handleReplayVoice}
                className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                title="Listen to Tippy again"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>

            <p className="text-xs font-extrabold text-slate-800 italic leading-relaxed">
              "{milestone.tippySpeech}"
            </p>
          </motion.div>

          {/* Milestone Stats / Rewards Box */}
          <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 rounded-2xl p-4 border-2 border-amber-300 flex items-center justify-around shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-md font-black">
                ⭐
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-amber-900 block leading-tight">
                  Stars Earned
                </span>
                <span className="text-lg font-black text-amber-950">
                  +{milestone.rewardStars}
                </span>
              </div>
            </div>

            <div className="h-8 w-0.5 bg-amber-300" />

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-amber-950 flex items-center justify-center text-xl shadow-md font-black">
                🪙
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-amber-900 block leading-tight">
                  Coins Claimed
                </span>
                <span className="text-lg font-black text-amber-950">
                  +{milestone.rewardCoins}
                </span>
              </div>
            </div>
          </div>

          {/* Claim / Action Button */}
          <div className="pt-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClaim}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-base shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-amber-950" />
              <span>Claim Rewards & Keep Learning! 🎉</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
