import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trophy, Award, Flame, Gift, Sparkles, CheckCircle2, ChevronRight, Play } from "lucide-react";
import { ChildProfile, Milestone } from "../types";
import { INITIAL_MILESTONES } from "../data/mockData";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, playFanfareSound, speakText } from "../utils/audio";

interface RewardsTrophyTabProps {
  profile: ChildProfile;
  onUpdateAvatar: (newAvatar: string) => void;
  onAddCoins: (coins: number) => void;
  onTriggerCelebration: (milestone: Milestone) => void;
  onSimulateMilestoneProgress?: (type: "50words" | "7streak") => void;
}

const AVATARS = [
  { emoji: "🐘", name: "Baby Elephant" },
  { emoji: "🧸", name: "Teddy Bear" },
  { emoji: "🐰", name: "Fluffy Bunny" },
  { emoji: "🐼", name: "Panda Friend" },
  { emoji: "🦁", name: "Lion Cub" },
  { emoji: "🐦", name: "Little Bird" },
  { emoji: "🦉", name: "Tippy Owl" },
];

export const RewardsTrophyTab: React.FC<RewardsTrophyTabProps> = ({
  profile,
  onUpdateAvatar,
  onAddCoins,
  onTriggerCelebration,
  onSimulateMilestoneProgress,
}) => {
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [chestReward, setChestReward] = useState<number | null>(null);

  const handleOpenChest = () => {
    if (isChestOpen) return;
    playPopSound();
    playFanfareSound();
    playSparkleSound();

    const bonusCoins = 50;
    setIsChestOpen(true);
    setChestReward(bonusCoins);
    onAddCoins(bonusCoins);
    speakText("Hooray! You opened the magical surprise chest and won 50 coins!");
  };

  const calculateProgress = (m: Milestone) => {
    let current = 0;
    if (m.category === "words") current = profile.masteredWords.length;
    else if (m.category === "streak") current = profile.streakDays;
    else if (m.category === "levels") current = profile.currentLevel;
    else if (m.category === "stars") current = profile.totalStars;

    const percent = Math.min(100, Math.round((current / m.target) * 100));
    const isCompleted = current >= m.target;
    return { current, percent, isCompleted };
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-amber-100 via-sky-100 to-purple-100 p-4 flex flex-col items-center justify-between font-sans select-none pb-24 max-w-xl mx-auto">
      {/* Top Banner */}
      <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-amber-300 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 p-0.5 border border-amber-300">
            <img src={APP_IMAGES.tippyOwl} alt="Tippy" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-900 text-sm">Trophy & Milestone Kingdom</h3>
            <p className="text-[11px] text-amber-700 font-semibold">Track & Celebrate Your TinySteps!</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 font-black text-xs text-amber-900">
          <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>{profile.badges.length} Badges</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* Milestone Tracker Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-amber-300 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h4 className="font-black text-slate-800 text-base">Milestone Progress</h4>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {profile.masteredWords.length} Words • {profile.streakDays} Day Streak
            </span>
          </div>

          {/* Special Quick Test Simulation Buttons */}
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center space-y-2">
            <span className="text-xs font-extrabold text-amber-950 block">
              ✨ Test Tippy's Celebration Animation:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playPopSound();
                  if (onSimulateMilestoneProgress) onSimulateMilestoneProgress("50words");
                  const m50 = INITIAL_MILESTONES.find((m) => m.id === "m-words-50");
                  if (m50) onTriggerCelebration(m50);
                }}
                className="flex-1 py-2 px-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-xs rounded-xl shadow-md border border-amber-300 active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>🏆 50 Words Celebration</span>
              </button>

              <button
                onClick={() => {
                  playPopSound();
                  if (onSimulateMilestoneProgress) onSimulateMilestoneProgress("7streak");
                  const m7 = INITIAL_MILESTONES.find((m) => m.id === "m-streak-7");
                  if (m7) onTriggerCelebration(m7);
                }}
                className="flex-1 py-2 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md border border-purple-300 active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>👑 7-Day Streak</span>
              </button>
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-3">
            {INITIAL_MILESTONES.map((m) => {
              const { current, percent, isCompleted } = calculateProgress(m);
              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isCompleted
                      ? "bg-amber-50/90 border-amber-300 shadow-sm"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                      {m.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-extrabold text-xs text-slate-800 truncate">
                          {m.title}
                        </h5>
                        <span className="text-[11px] font-black text-amber-700">
                          {current}/{m.target}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                              : "bg-sky-400"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Celebration Trigger Button */}
                  <button
                    onClick={() => {
                      playPopSound();
                      onTriggerCelebration(m);
                    }}
                    className={`py-2 px-3 rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shrink-0 ${
                      isCompleted
                        ? "bg-amber-400 hover:bg-amber-500 text-amber-950 font-black"
                        : "bg-purple-100 hover:bg-purple-200 text-purple-800"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
                        <span>Celebrate!</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-purple-800" />
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treasure Chest Interactive Box */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-amber-300 text-center flex flex-col items-center gap-3 relative overflow-hidden">
          <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            🎁 Daily Surprise Treasure Chest
          </span>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChest}
            className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-300 via-orange-300 to-amber-400 p-2 shadow-2xl border-4 border-white flex items-center justify-center cursor-pointer my-2 relative"
          >
            <span className="text-6xl">{isChestOpen ? "🔓" : "🎁"}</span>
            {!isChestOpen && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-bounce shadow-sm">
                Tap Me!
              </span>
            )}
          </motion.div>

          {chestReward ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-700 font-black text-base bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200"
            >
              🎉 You unlocked +{chestReward} Magic Coins!
            </motion.div>
          ) : (
            <p className="text-xs font-bold text-slate-600">
              Tap the chest every day to claim bonus learning coins!
            </p>
          )}
        </div>

        {/* Badges Collection */}
        <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-sky-200">
          <h4 className="font-extrabold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Unlocked Badges ({profile.badges.length})</span>
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {profile.badges.map((b) => (
              <div
                key={b.id}
                className="bg-purple-50/80 rounded-2xl p-2.5 border border-purple-100 flex items-center gap-2"
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-xs">{b.title}</h5>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avatar Selection Showcase */}
        <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-purple-200">
          <h4 className="font-extrabold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <span>✨ Select Your Learning Avatar</span>
          </h4>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {AVATARS.map((av) => (
              <button
                key={av.emoji}
                onClick={() => {
                  playPopSound();
                  onUpdateAvatar(av.emoji);
                  speakText(`Avatar updated to ${av.name}!`);
                }}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 shrink-0 transition-transform cursor-pointer ${
                  profile.avatar === av.emoji
                    ? "bg-amber-100 border-amber-400 scale-105 shadow-md"
                    : "bg-slate-50 border-slate-200 hover:bg-sky-50"
                }`}
              >
                <span className="text-3xl">{av.emoji}</span>
                <span className="text-[10px] font-extrabold text-slate-700">{av.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
