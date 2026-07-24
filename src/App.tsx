import React, { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { TippyMascotHeader } from "./components/TippyMascotHeader";
import { AdventureMap } from "./components/AdventureMap";
import { LessonModal } from "./components/LessonModal";
import { VoicePracticeTab } from "./components/VoicePracticeTab";
import { MagicDoodleTab } from "./components/MagicDoodleTab";
import { AiStoryTab } from "./components/AiStoryTab";
import { VideosTab } from "./components/VideosTab";
import { RewardsTrophyTab } from "./components/RewardsTrophyTab";
import { IslamicLearningTab } from "./components/IslamicLearningTab";
import { ParentGateModal } from "./components/ParentGateModal";
import { ParentDashboard } from "./components/ParentDashboard";
import { CelebrationModal } from "./components/CelebrationModal";

import { AppMode, ChildTab, ChildProfile, LevelNode, Milestone } from "./types";
import { INITIAL_PROFILES, MAP_LEVELS, INITIAL_MILESTONES } from "./data/mockData";
import { APP_IMAGES } from "./assets/images";
import { playPopSound, playSparkleSound, speakText } from "./utils/audio";
import { Map, Mic, Palette, BookOpen, Gift, Film, Moon } from "lucide-react";
import { motion } from "motion/react";
import { FlyingStarsOverlay, FlyingStarParticle } from "./components/FlyingStarsOverlay";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("splash");
  const [childTab, setChildTab] = useState<ChildTab>("map");

  const [profiles, setProfiles] = useState<ChildProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>("child-1");
  const [levels, setLevels] = useState<LevelNode[]>(MAP_LEVELS);

  const [selectedLevel, setSelectedLevel] = useState<LevelNode | null>(null);
  const [isParentGateOpen, setIsParentGateOpen] = useState<boolean>(false);
  const [isMascotTipOpen, setIsMascotTipOpen] = useState<boolean>(false);
  const [activeCelebrationMilestone, setActiveCelebrationMilestone] = useState<Milestone | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Auto-check if profile has hit a milestone that hasn't been celebrated yet
  useEffect(() => {
    if (appMode !== "child") return;

    const unlocked = activeProfile.unlockedMilestoneIds || [];
    for (const m of INITIAL_MILESTONES) {
      if (unlocked.includes(m.id)) continue;

      let achieved = false;
      if (m.category === "words" && activeProfile.masteredWords.length >= m.target) achieved = true;
      if (m.category === "streak" && activeProfile.streakDays >= m.target) achieved = true;
      if (m.category === "levels" && activeProfile.currentLevel >= m.target) achieved = true;
      if (m.category === "stars" && activeProfile.totalStars >= m.target) achieved = true;

      if (achieved) {
        setActiveCelebrationMilestone(m);
        break; // Trigger one at a time
      }
    }
  }, [activeProfile.masteredWords.length, activeProfile.streakDays, activeProfile.totalStars, activeProfile.currentLevel, appMode]);

  const handleSimulateMilestoneProgress = (type: "50words" | "7streak") => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfile.id) {
          if (type === "50words") {
            const words50 = [
              "Mama", "Baba", "Bismillah", "Allah", "Apple", "Cat", "Red", "Star",
              "Dog", "Elephant", "Lion", "Giraffe", "Bear", "Duck", "Fish", "Bird",
              "Rabbit", "Banana", "Mango", "Grapes", "Orange", "Carrot", "Potato", "Tomato",
              "Eyes", "Nose", "Hands", "Feet", "Ears", "Mouth", "Soap", "Clean", "Share",
              "Peace", "Sun", "Moon", "Rain", "Tree", "Flower", "One", "Two", "Three",
              "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"
            ];
            return { ...p, masteredWords: words50 };
          } else if (type === "7streak") {
            return { ...p, streakDays: 7 };
          }
        }
        return p;
      })
    );
  };

  const [flyingStars, setFlyingStars] = useState<FlyingStarParticle[]>([]);

  const triggerFlyingStars = (count: number = 5, startPos?: { x: number; y: number }) => {
    const headerElem = document.getElementById("header-star-count");
    let targetX = window.innerWidth - 100;
    let targetY = 28;

    if (headerElem) {
      const rect = headerElem.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const originX = startPos?.x ?? window.innerWidth / 2;
    const originY = startPos?.y ?? window.innerHeight * 0.6;

    const newStars: FlyingStarParticle[] = [];
    const numStars = Math.min(Math.max(count * 2, 4), 10);

    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: `star-${Date.now()}-${i}-${Math.random()}`,
        startX: originX + (Math.random() * 80 - 40),
        startY: originY + (Math.random() * 80 - 40),
        targetX,
        targetY,
        delay: i * 0.09,
        size: 26 + Math.random() * 12,
      });
    }

    setFlyingStars((prev) => [...prev, ...newStars]);
  };

  // Handler to update stars/coins
  const handleAddStarsAndCoins = (
    starsEarned: number,
    coinsEarned: number = 20,
    startPos?: { x: number; y: number }
  ) => {
    if (starsEarned > 0) {
      triggerFlyingStars(starsEarned, startPos);
    }

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfile.id) {
          return {
            ...p,
            totalStars: p.totalStars + starsEarned,
            coins: p.coins + coinsEarned,
          };
        }
        return p;
      })
    );
  };

  // Handler for updating active profile
  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Handler for level completion
  const handleCompleteLevel = (levelId: number, starsEarned: number) => {
    setLevels((prev) =>
      prev.map((lvl) => {
        if (lvl.id === levelId) {
          return { ...lvl, stars: Math.max(lvl.stars, starsEarned) };
        }
        // Unlock next level
        if (lvl.id === levelId + 1) {
          return { ...lvl, unlocked: true };
        }
        return lvl;
      })
    );

    handleAddStarsAndCoins(starsEarned, 30);
  };

  // Avatar update
  const handleUpdateAvatar = (newAvatar: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? { ...p, avatar: newAvatar } : p))
    );
  };

  // Splash Screen view
  if (appMode === "splash") {
    return (
      <SplashScreen
        onGetStarted={() => {
          setAppMode("child");
          speakText(`Welcome, ${activeProfile.name}! Let's start learning on your TinySteps path!`, {
            lang: activeProfile.language,
            gender: activeProfile.voiceSettings.gender,
          });
        }}
      />
    );
  }

  // Parent Mode view
  if (appMode === "parent") {
    return (
      <ParentDashboard
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={(p) => setActiveProfileId(p.id)}
        onUpdateProfile={handleUpdateProfile}
        onBackToChild={() => setAppMode("child")}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col font-sans select-none max-w-lg mx-auto shadow-2xl relative overflow-x-hidden">
      {/* Persistent Header */}
      <TippyMascotHeader
        profile={activeProfile}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenMascotTip={() => setIsMascotTipOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full relative">
        {childTab === "map" && (
          <AdventureMap
            levels={levels}
            profile={activeProfile}
            onSelectLevel={(lvl) => setSelectedLevel(lvl)}
            onJumpToTab={(tab) => setChildTab(tab)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {childTab === "islamic" && (
          <IslamicLearningTab
            childName={activeProfile.name}
            childLanguage={activeProfile.language}
            voiceSettings={activeProfile.voiceSettings}
            onAddStarsAndCoins={(s, c) => handleAddStarsAndCoins(s, c)}
          />
        )}

        {childTab === "videos" && (
          <VideosTab
            childLanguage={activeProfile.language}
            voiceSettings={activeProfile.voiceSettings}
            onRewardStars={(stars) => handleAddStarsAndCoins(stars, 15)}
          />
        )}

        {childTab === "voice" && (
          <VoicePracticeTab onAddStars={(stars) => handleAddStarsAndCoins(stars, 15)} />
        )}

        {childTab === "doodle" && (
          <MagicDoodleTab onAddStars={(stars) => handleAddStarsAndCoins(stars, 20)} />
        )}

        {childTab === "story" && (
          <AiStoryTab
            childProfile={activeProfile}
            onAddStars={(stars) => handleAddStarsAndCoins(stars, 25)}
          />
        )}

        {childTab === "rewards" && (
          <RewardsTrophyTab
            profile={activeProfile}
            onUpdateAvatar={handleUpdateAvatar}
            onAddCoins={(c) => handleAddStarsAndCoins(0, c)}
            onTriggerCelebration={(m) => setActiveCelebrationMilestone(m)}
            onSimulateMilestoneProgress={handleSimulateMilestoneProgress}
          />
        )}
      </main>

      {/* Floating Glassmorphism Child Bottom Navigation Bar */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-40 px-1">
        <nav className="bg-white/90 backdrop-blur-xl border-2 border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.18)] rounded-3xl p-1.5 flex items-center justify-around relative">
          {/* 1. Learn */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("map");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "map" ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: childTab === "map" ? Infinity : 0, duration: 2 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "map"
                  ? "bg-gradient-to-tr from-sky-400 to-sky-500 text-white shadow-md ring-2 ring-sky-300/60 scale-105"
                  : "text-slate-500 hover:text-sky-600"
              }`}
            >
              <Map className={`w-5 h-5 ${childTab === "map" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Learn</span>
            </motion.div>
          </button>

          {/* 2. Islamic */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("islamic");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "islamic" ? { rotate: [-8, 8, -8] } : {}}
              transition={{ repeat: childTab === "islamic" ? Infinity : 0, duration: 2.5 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "islamic"
                  ? "bg-gradient-to-tr from-emerald-400 to-teal-500 text-white shadow-md ring-2 ring-emerald-300/60 scale-105"
                  : "text-slate-500 hover:text-emerald-600"
              }`}
            >
              <Moon className={`w-5 h-5 ${childTab === "islamic" ? "fill-white/20 stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Islamic</span>
            </motion.div>
          </button>

          {/* 3. Videos */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("videos");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "videos" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: childTab === "videos" ? Infinity : 0, duration: 2 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "videos"
                  ? "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md ring-2 ring-amber-300/60 scale-105"
                  : "text-slate-500 hover:text-amber-600"
              }`}
            >
              <Film className={`w-5 h-5 ${childTab === "videos" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Videos</span>
            </motion.div>
          </button>

          {/* 4. Speak */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("voice");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "voice" ? { scale: [1, 1.15, 1] } : {}}
              transition={{ repeat: childTab === "voice" ? Infinity : 0, duration: 1.8 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "voice"
                  ? "bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-md ring-2 ring-purple-300/60 scale-105"
                  : "text-slate-500 hover:text-purple-600"
              }`}
            >
              <Mic className={`w-5 h-5 ${childTab === "voice" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Speak</span>
            </motion.div>
          </button>

          {/* 5. Activities */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("doodle");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "doodle" ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ repeat: childTab === "doodle" ? Infinity : 0, duration: 2 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "doodle"
                  ? "bg-gradient-to-tr from-teal-400 to-emerald-500 text-white shadow-md ring-2 ring-teal-300/60 scale-105"
                  : "text-slate-500 hover:text-teal-600"
              }`}
            >
              <Palette className={`w-5 h-5 ${childTab === "doodle" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Activities</span>
            </motion.div>
          </button>

          {/* 6. Stories */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("story");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "story" ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: childTab === "story" ? Infinity : 0, duration: 2.2 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "story"
                  ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md ring-2 ring-indigo-300/60 scale-105"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              <BookOpen className={`w-5 h-5 ${childTab === "story" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Stories</span>
            </motion.div>
          </button>

          {/* 7. Rewards */}
          <button
            onClick={() => {
              playPopSound();
              setChildTab("rewards");
            }}
            className="flex flex-col items-center gap-0.5 cursor-pointer relative"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={childTab === "rewards" ? { scale: [1, 1.1, 1], rotate: [-6, 6, -6] } : {}}
              transition={{ repeat: childTab === "rewards" ? Infinity : 0, duration: 1.6 }}
              className={`px-3 py-1.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                childTab === "rewards"
                  ? "bg-gradient-to-tr from-pink-400 to-rose-500 text-white shadow-md ring-2 ring-pink-300/60 scale-105"
                  : "text-slate-500 hover:text-pink-600"
              }`}
            >
              <Gift className={`w-5 h-5 ${childTab === "rewards" ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-black">Rewards</span>
            </motion.div>
          </button>
        </nav>
      </div>

      {/* Lesson Modal */}
      {selectedLevel && (
        <LessonModal
          level={selectedLevel}
          onClose={() => setSelectedLevel(null)}
          onCompleteLevel={handleCompleteLevel}
        />
      )}

      {/* Parent Security Gate Modal */}
      {isParentGateOpen && (
        <ParentGateModal
          onClose={() => setIsParentGateOpen(false)}
          onSuccess={() => {
            setIsParentGateOpen(false);
            setAppMode("parent");
          }}
        />
      )}

      {/* Tippy Quick Speech Bubble Popup */}
      {isMascotTipOpen && (
        <div
          onClick={() => setIsMascotTipOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 max-w-xs text-center flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full border-4 border-amber-300 p-1 shadow-md bg-amber-100">
              <img src={APP_IMAGES.tippyOwl} alt="Tippy" className="w-full h-full object-cover rounded-full" />
            </div>
            <h4 className="font-extrabold text-amber-900 text-base">Tippy says:</h4>
            <p className="text-xs font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
              "Every small step you take helps your brain grow big and strong! Let's keep learning together!"
            </p>
            <span className="text-[10px] text-slate-400 font-bold">Tap anywhere to close</span>
          </div>
        </div>
      )}

      {/* Special Celebration Animation Modal featuring Tippy Owl */}
      {activeCelebrationMilestone && (
        <CelebrationModal
          milestone={activeCelebrationMilestone}
          childName={activeProfile.name}
          childLanguage={activeProfile.language}
          voiceSettings={activeProfile.voiceSettings}
          onClose={() => setActiveCelebrationMilestone(null)}
          onClaimRewards={(stars, coins) => {
            handleAddStarsAndCoins(stars, coins);
            const mId = activeCelebrationMilestone.id;
            setProfiles((prev) =>
              prev.map((p) => {
                if (p.id === activeProfile.id) {
                  const currentUnlocked = p.unlockedMilestoneIds || [];
                  if (!currentUnlocked.includes(mId)) {
                    return { ...p, unlockedMilestoneIds: [...currentUnlocked, mId] };
                  }
                }
                return p;
              })
            );
          }}
        />
      )}

      {/* Flying Stars Animation Overlay */}
      <FlyingStarsOverlay
        activeParticles={flyingStars}
        onParticleComplete={(id) => setFlyingStars((prev) => prev.filter((p) => p.id !== id))}
      />
    </div>
  );
}
