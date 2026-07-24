import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Lock,
  Play,
  CheckCircle2,
  Sparkles,
  Flame,
  Coins,
  MapPin,
  Trophy,
  Volume2,
  Edit3,
  Moon,
  Film,
  Mic,
  Palette,
  BookOpen,
  Gift,
  ArrowRight,
  Smile,
} from "lucide-react";
import { LevelNode, ChildProfile, ChildTab } from "../types";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, speakText } from "../utils/audio";

interface AdventureMapProps {
  levels: LevelNode[];
  profile: ChildProfile;
  onSelectLevel: (level: LevelNode) => void;
  onJumpToTab: (tab: ChildTab) => void;
  onUpdateProfile?: (profile: ChildProfile) => void;
}

// Themed Worlds configuration
const THEMED_WORLDS = [
  { name: "Rainbow Garden 🌈", bg: "from-sky-300 via-rose-100 to-amber-100", levels: [1, 2] },
  { name: "Alphabet Forest 🔤", bg: "from-emerald-200 via-teal-100 to-emerald-50", levels: [3, 4] },
  { name: "Number Mountain 🔢", bg: "from-indigo-200 via-purple-100 to-sky-100", levels: [5, 6] },
  { name: "Islamic Garden 🌙", bg: "from-emerald-300 via-teal-200 to-amber-100", levels: [7, 8] },
  { name: "Story Land 📖", bg: "from-amber-200 via-orange-100 to-rose-100", levels: [9, 10] },
  { name: "Moon Valley ✨", bg: "from-purple-300 via-indigo-200 to-sky-100", levels: [11, 12] },
];

export const AdventureMap: React.FC<AdventureMapProps> = ({
  levels,
  profile,
  onSelectLevel,
  onJumpToTab,
  onUpdateProfile,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editAge, setEditAge] = useState<number>(profile.age);
  const [editAvatar, setEditAvatar] = useState<string>(profile.avatar);
  const [editLanguage, setEditLanguage] = useState<string>(profile.language || "English");

  const [tippySpeech, setTippySpeech] = useState<string>(
    `Hello ${profile.name}! Ready for today's learning adventure?`
  );

  const activeLevel = levels.find((l) => l.unlocked && l.stars < 3) || levels[0];

  const encourages = [
    `Let me teach you something special today, ${profile.name}!`,
    `You're doing amazing! Keep earning those stars!`,
    `Ready for the next adventure? Tap Continue!`,
    `Bismillah! Let's start our fun learning step!`,
    `I'm so proud of your progress today!`,
  ];

  const handleSpeakTippy = () => {
    playPopSound();
    const randomMsg = encourages[Math.floor(Math.random() * encourages.length)];
    setTippySpeech(randomMsg);
    speakText(randomMsg, {
      lang: profile.language,
      gender: profile.voiceSettings.gender,
    });
  };

  const avatarOptions = ["🦁", "🐼", "🦄", "🚀", "🐰", "🦊", "👑", "⭐"];

  const handleSaveProfile = () => {
    playSparkleSound();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        name: editName || "Little Explorer",
        age: editAge,
        avatar: editAvatar,
        language: editLanguage as any,
      });
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 via-emerald-100 to-amber-100 relative pb-32 pt-4 px-3 sm:px-5 overflow-hidden select-none">
      {/* ANIMATED SKY & NATURE BACKGROUND WORLD */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Rainbow Arc Top */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[130%] h-48 rounded-b-full bg-gradient-to-r from-rose-400/30 via-amber-300/30 via-emerald-300/30 via-sky-300/30 to-purple-400/30 blur-sm border-b-8 border-white/40" />

        {/* Smiling Animated Sun */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-4 right-4 w-20 h-20 bg-amber-300 rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(251,191,36,0.8)] border-4 border-amber-100/80"
        >
          ☀️
        </motion.div>

        {/* Moving Fluffy Clouds */}
        <motion.div
          animate={{ x: [-50, 100, -50] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute top-6 left-4 text-6xl opacity-90 filter drop-shadow-md"
        >
          ☁️
        </motion.div>

        <motion.div
          animate={{ x: [100, -60, 100] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute top-16 right-12 text-7xl opacity-90 filter drop-shadow-md"
        >
          ☁️
        </motion.div>

        {/* Flying Birds & Butterflies */}
        <motion.div
          animate={{ x: [-20, 320], y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          className="absolute top-24 left-0 text-2xl"
        >
          🕊️
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
          className="absolute top-48 left-8 text-3xl"
        >
          🦋
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4.2 }}
          className="absolute top-72 right-8 text-3xl"
        >
          🎈
        </motion.div>

        {/* Floating Sparkles & Leaves */}
        <div className="absolute top-40 left-1/3 text-2xl animate-pulse">✨</div>
        <div className="absolute top-96 right-1/4 text-2xl animate-ping">🌟</div>
        <div className="absolute top-1/2 left-6 text-2xl animate-bounce">🍃</div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto space-y-5">
        {/* PERSONALIZED WELCOME PROFILE HEADER CARD */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-3 border-amber-300 relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-100 rounded-full opacity-50 blur-xl" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Box with Pulse Ring */}
              <button
                onClick={() => setIsEditingProfile(true)}
                className="relative group cursor-pointer"
                title="Tap to Edit Profile"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-300 via-pink-300 to-sky-300 p-1 shadow-md border-2 border-white flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                  <span>{profile.avatar}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1 rounded-full text-amber-950 border border-white shadow-xs">
                  <Edit3 className="w-3 h-3" />
                </div>
              </button>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-black text-slate-900 text-lg leading-tight">
                    👋 Hello, {profile.name}!
                  </h2>
                </div>
                <p className="text-xs font-black text-amber-600">
                  Level {profile.currentLevel} • {profile.age} Years Old
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs rounded-2xl border border-amber-300 shadow-xs flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Profile</span>
            </button>
          </div>

          {/* Stats Badges Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-center">
            <div className="bg-amber-50 rounded-2xl p-2 border border-amber-200/80 flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600 animate-bounce" />
                <span>Streak</span>
              </div>
              <span className="text-sm font-black text-slate-900 mt-0.5">
                {profile.streakDays} Days
              </span>
            </div>

            <div className="bg-amber-50 rounded-2xl p-2 border border-amber-200/80 flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Stars</span>
              </div>
              <span className="text-sm font-black text-slate-900 mt-0.5">
                {profile.totalStars}
              </span>
            </div>

            <div className="bg-sky-50 rounded-2xl p-2 border border-sky-200/80 flex flex-col items-center">
              <div className="flex items-center gap-1 text-sky-600 font-black text-xs">
                <Coins className="w-4 h-4 fill-sky-400 text-sky-600" />
                <span>Coins</span>
              </div>
              <span className="text-sm font-black text-slate-900 mt-0.5">
                {profile.coins}
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI MASCOT TIPPY OWL INTERACTIVE CARD */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-amber-300 via-sky-200 to-emerald-200 rounded-3xl p-4 shadow-xl border-3 border-white flex items-center gap-4 relative overflow-hidden"
        >
          <div className="relative w-20 h-20 shrink-0">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full h-full rounded-2xl bg-white p-1 shadow-md border-2 border-amber-400 flex items-center justify-center overflow-hidden"
            >
              <motion.img
                animate={{ scaleY: [1, 0.15, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.04, 0.08] }}
                src={APP_IMAGES.tippyOwl}
                alt="Tippy Owl"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>

            <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full border border-white shadow-sm">
              👋 Tippy Teacher
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-amber-300 shadow-sm relative">
              <p className="text-xs font-black text-slate-800 leading-snug">
                "{tippySpeech}"
              </p>
            </div>

            <button
              onClick={handleSpeakTippy}
              className="mt-1 px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-[11px] rounded-full shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 fill-amber-950" />
              <span>Tap Tippy to Speak!</span>
            </button>
          </div>
        </motion.div>

        {/* DAILY GOALS MISSION CARD */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-2 border-amber-300 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-400 animate-bounce" />
              <h3 className="font-black text-slate-900 text-sm">Today's Mission</h3>
            </div>
            <span className="bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-300">
              🎁 Reward: +50 Stars
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Mission 1: Complete 3 Lessons */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>⭐</span> Complete 3 Lessons
                </span>
                <span className="text-amber-600">2 / 3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div className="bg-amber-400 h-full rounded-full w-[66%]" />
              </div>
            </div>

            {/* Mission 2: Practice 5 Words */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>🎤</span> Practice 5 Words
                </span>
                <span className="text-purple-600">3 / 5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div className="bg-purple-500 h-full rounded-full w-[60%]" />
              </div>
            </div>

            {/* Mission 3: Read 1 Story */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>📚</span> Read 1 Story
                </span>
                <span className="text-emerald-600 flex items-center gap-1 font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" /> Done!
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div className="bg-emerald-500 h-full rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* CONTINUE LEARNING HERO CARD */}
        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-2xl border-4 border-white relative overflow-hidden">
          <div className="absolute top-2 right-4 text-4xl opacity-30 animate-pulse">✨</div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-200 border border-white/30">
                Continue Learning
              </span>
              <span className="text-xs font-black text-sky-200">
                Level {activeLevel.id}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight drop-shadow-md">
                {activeLevel.title}
              </h3>
              <p className="text-xs font-bold text-sky-100 mt-0.5">
                {activeLevel.subtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold text-white/90">
                <span>Lesson Progress</span>
                <span>73% Complete</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-3 p-0.5 border border-white/30">
                <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full w-[73%] shadow-md" />
              </div>
            </div>

            {/* Action Continue Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playPopSound();
                onSelectLevel(activeLevel);
              }}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-amber-950 ml-0.5" />
              <span>CONTINUE LESSON NOW</span>
            </motion.button>
          </div>
        </div>

        {/* QUICK ACCESS CATEGORIES GRID */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Quick Access Learning</span>
            </h3>
            <span className="text-[11px] font-black text-sky-700">Choose a World</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 🌙 Islamic Learning */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("islamic");
              }}
              className="bg-gradient-to-br from-emerald-200 via-teal-100 to-emerald-50 p-3.5 rounded-3xl border-2 border-emerald-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🌙
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Islamic</h4>
                <p className="text-[10px] font-bold text-slate-600">Duas & Kalmas</p>
              </div>
            </motion.button>

            {/* 🎬 AI Video Theater */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("videos");
              }}
              className="bg-gradient-to-br from-amber-200 via-orange-100 to-amber-50 p-3.5 rounded-3xl border-2 border-amber-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🎬
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Videos</h4>
                <p className="text-[10px] font-bold text-slate-600">3D Animations</p>
              </div>
            </motion.button>

            {/* 🎤 Speak & Voice */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("voice");
              }}
              className="bg-gradient-to-br from-purple-200 via-pink-100 to-purple-50 p-3.5 rounded-3xl border-2 border-purple-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🎤
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Speak</h4>
                <p className="text-[10px] font-bold text-slate-600">Pronunciation</p>
              </div>
            </motion.button>

            {/* 🎨 Canvas Activities */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("doodle");
              }}
              className="bg-gradient-to-br from-teal-200 via-sky-100 to-teal-50 p-3.5 rounded-3xl border-2 border-teal-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🎨
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Activities</h4>
                <p className="text-[10px] font-bold text-slate-600">Doodle & Play</p>
              </div>
            </motion.button>

            {/* 📚 AI Stories */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("story");
              }}
              className="bg-gradient-to-br from-indigo-200 via-sky-100 to-indigo-50 p-3.5 rounded-3xl border-2 border-indigo-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                📚
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Stories</h4>
                <p className="text-[10px] font-bold text-slate-600">Bedtime & Moral</p>
              </div>
            </motion.button>

            {/* 🎁 Rewards & Shop */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onJumpToTab("rewards");
              }}
              className="bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 p-3.5 rounded-3xl border-2 border-pink-300 shadow-md flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🎁
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Rewards</h4>
                <p className="text-[10px] font-bold text-slate-600">Stickers & Shop</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* THEMED WORLDS ADVENTURE TRAIL */}
        <div className="pt-4 space-y-4">
          <div className="text-center flex items-center justify-center gap-2">
            <span className="bg-sky-100 text-sky-900 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border border-sky-300 shadow-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Magical Adventure Path</span>
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-10 z-10">
            {/* Connecting Line SVG */}
            <svg
              className="absolute top-10 left-0 w-full h-[calc(100%-80px)] pointer-events-none z-0"
              preserveAspectRatio="none"
            >
              <path
                d="M 200,20 Q 280,120 200,220 T 200,420 T 200,620 T 200,820 T 200,1020"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="8"
                strokeDasharray="14 10"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            {levels.map((lvl, index) => {
              const isCurrentActive = lvl.id === activeLevel.id;
              const isCompleted = lvl.stars > 0;
              const xOffsetClass =
                index % 3 === 0
                  ? "translate-x-0"
                  : index % 3 === 1
                  ? "translate-x-8"
                  : "-translate-x-8";

              const worldTheme = THEMED_WORLDS.find((w) => w.levels.includes(index + 1));

              return (
                <React.Fragment key={lvl.id}>
                  {worldTheme && index % 2 === 0 && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className={`w-full py-2 px-4 rounded-2xl bg-gradient-to-r ${worldTheme.bg} border-2 border-white shadow-md flex items-center justify-between text-xs font-black text-slate-800 z-10 my-1`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{worldTheme.name}</span>
                      </span>
                      <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full font-bold text-slate-600">
                        World {Math.floor(index / 2) + 1}
                      </span>
                    </motion.div>
                  )}

                  <div className={`relative z-10 flex flex-col items-center transition-transform ${xOffsetClass}`}>
                    {isCurrentActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.1, 1], y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="absolute -top-12 z-20 bg-amber-400 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full border-2 border-white shadow-xl flex items-center gap-1"
                      >
                        <span>Start Here!</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-950 fill-amber-950 animate-spin" />
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={lvl.unlocked ? { scale: 1.1 } : {}}
                      whileTap={lvl.unlocked ? { scale: 0.92 } : {}}
                      onClick={() => {
                        if (lvl.unlocked) {
                          playPopSound();
                          playSparkleSound();
                          onSelectLevel(lvl);
                        } else {
                          playPopSound();
                          speakText("Complete earlier levels to unlock this step!");
                        }
                      }}
                      className={`w-24 h-24 rounded-full p-2 flex flex-col items-center justify-center relative shadow-2xl border-4 ${
                        lvl.unlocked
                          ? isCompleted
                            ? "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-white cursor-pointer ring-4 ring-amber-200/80"
                            : "bg-gradient-to-b " + lvl.color + " border-white cursor-pointer"
                          : "bg-slate-200 border-slate-300 cursor-not-allowed opacity-90"
                      }`}
                    >
                      {lvl.unlocked ? (
                        <span className="text-4xl drop-shadow-md">{lvl.icon}</span>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-slate-400/60 flex items-center justify-center text-white shadow-inner">
                            <Lock className="w-5 h-5 stroke-[3]" />
                          </div>
                          <span className="text-xs opacity-70 absolute -bottom-3">☁️</span>
                        </div>
                      )}

                      {lvl.unlocked && (
                        <div className="absolute -bottom-3 bg-white/95 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md flex items-center gap-0.5">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx <= lvl.stars
                                  ? "fill-amber-400 text-amber-500 animate-pulse"
                                  : "fill-slate-200 text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>

                    <div className="mt-4 text-center max-w-[160px]">
                      <h4 className="font-black text-slate-900 text-sm leading-tight">
                        {lvl.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-600">
                        {lvl.subtitle}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 max-w-sm w-full space-y-4 text-slate-900"
            >
              <div className="text-center space-y-1">
                <h3 className="font-black text-xl text-slate-900">Child Profile Settings</h3>
                <p className="text-xs font-extrabold text-slate-500">
                  Customize profile name, age & favorite avatar!
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700">Choose Avatar</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {avatarOptions.map((av) => (
                    <button
                      key={av}
                      onClick={() => {
                        playPopSound();
                        setEditAvatar(av);
                      }}
                      className={`w-12 h-12 text-2xl rounded-2xl flex items-center justify-center border-2 transition-transform cursor-pointer shrink-0 ${
                        editAvatar === av
                          ? "bg-amber-100 border-amber-500 scale-110 shadow-md"
                          : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Child Name */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Child's Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 rounded-2xl border-2 border-slate-200 font-bold text-sm focus:border-amber-400 focus:bg-white outline-none"
                  placeholder="Enter name..."
                />
              </div>

              {/* Child Age */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Age (Years)</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setEditAge(a)}
                      className={`flex-1 py-2 rounded-xl font-black text-xs border-2 cursor-pointer ${
                        editAge === a
                          ? "bg-amber-400 border-amber-500 text-amber-950"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Learning Language</label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 rounded-2xl border-2 border-slate-200 font-bold text-xs focus:border-amber-400 outline-none"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              {/* Save & Cancel */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-2xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
