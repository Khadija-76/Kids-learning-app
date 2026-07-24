import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  CheckCircle2,
  Film,
  Star,
  Heart,
  SkipForward,
  X,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { VideoClip, SupportedLanguage, VoiceSettings, VideoScene } from "../types";
import { INITIAL_VIDEOS } from "../data/mockData";
import {
  playPopSound,
  playSparkleSound,
  playFanfareSound,
  speakText,
  stopSpeaking,
} from "../utils/audio";
import { APP_IMAGES } from "../assets/images";

interface VideosTabProps {
  childLanguage?: SupportedLanguage;
  voiceSettings?: VoiceSettings;
  onRewardStars?: (count: number) => void;
}

// Confetti & Star Particles Component
const ConfettiExplosion: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 3.3) % 100,
    y: Math.random() * -20,
    size: 10 + (i % 5) * 6,
    color: [
      "bg-amber-400",
      "bg-rose-400",
      "bg-emerald-400",
      "bg-sky-400",
      "bg-purple-400",
      "bg-pink-400",
    ][i % 6],
    rotation: i * 25,
    duration: 1.5 + (i % 4) * 0.4,
    delay: (i % 5) * 0.05,
    shape: i % 3 === 0 ? "⭐" : i % 3 === 1 ? "🎈" : "✨",
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10%", x: `${p.x}%`, opacity: 1, scale: 0.5, rotate: 0 }}
          animate={{
            y: "110%",
            x: `${p.x + (p.id % 2 === 0 ? 10 : -10)}%`,
            opacity: [1, 1, 0],
            scale: [0.8, 1.3, 0.9],
            rotate: p.rotation + 360,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute text-xl font-black filter drop-shadow-md"
        >
          {p.shape}
        </motion.div>
      ))}
    </div>
  );
};

export const VideosTab: React.FC<VideosTabProps> = ({
  childLanguage = "English",
  voiceSettings = { gender: "female", speed: "normal" },
  onRewardStars,
}) => {
  const voiceGender: "female" | "male" = (voiceSettings?.gender as "female" | "male") || "female";
  const voiceSpeed: "slow" | "normal" = (voiceSettings?.speed as "slow" | "normal") || "normal";

  const [videosList, setVideosList] = useState<VideoClip[]>(INITIAL_VIDEOS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Video Player State
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Practice & AI Pronunciation state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<"success" | "retry" | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [tippyMood, setTippyMood] = useState<"wave" | "point" | "smile" | "lipSync" | "celebrate">(
    "wave"
  );

  const categories = [
    "All",
    "Bismillah",
    "Full Bismillah",
    "First Kalma",
    "Allah",
    "Daily Duas",
    "Mama",
    "Baba",
    "ABC",
    "Numbers",
    "Colors",
    "Animals",
    "Fruits",
    "Good Manners",
    "Stories",
  ];

  const filteredVideos = videosList.filter((v) => {
    if (showFavoritesOnly && !v.isFavorite) return false;
    if (selectedCategory === "All") return true;
    return v.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Current active video scenes
  const activeScenes: VideoScene[] = activeVideo?.scenes || [
    {
      id: "default-s1",
      sceneTitle: "Scene 1: Learning Time",
      dialogueText: `Let's watch and practice saying ${activeVideo?.targetWord || "words"}!`,
      subtitleWords: (activeVideo?.title || "Let's learn together")
        .split(" ")
        .map((w) => ({ text: w, durationMs: 350, highlight: true })),
      tippyAction: "wave",
      bgGradient: activeVideo?.color || "from-sky-300 via-amber-200 to-emerald-200",
      mainEmoji: activeVideo?.emoji || "⭐",
      secondaryEmojis: ["✨", "🌟", "🎈", "🌸"],
    },
  ];

  const currentScene = activeScenes[currentSceneIndex] || activeScenes[0];

  // Speak dialogue text with synchronized word highlight
  const speakVideoDialogue = (text: string) => {
    stopSpeaking();

    const words = text.split(" ");
    setActiveWordIndex(0);

    let wordIdx = 0;
    const interval = setInterval(() => {
      wordIdx++;
      if (wordIdx < words.length) {
        setActiveWordIndex(wordIdx);
      } else {
        clearInterval(interval);
      }
    }, 400);

    speakText(text, {
      lang: childLanguage,
      gender: voiceGender,
      speed: voiceSpeed,
      onEnd: () => {
        setActiveWordIndex(-1);
        clearInterval(interval);
      },
    });
  };

  // Start watching a video
  const handleOpenVideo = (video: VideoClip) => {
    playPopSound();
    setActiveVideo(video);
    setIsPlaying(true);
    setCurrentSceneIndex(0);
    setActiveWordIndex(-1);
    setProgressPercent(0);
    setEvaluationResult(null);
    setShowConfetti(false);
    setTippyMood(video.scenes?.[0]?.tippyAction || "wave");

    if (!isAudioMuted) {
      speakVideoDialogue(video.scenes?.[0]?.dialogueText || video.title);
    }
  };

  // Toggle favorite on video
  const handleToggleFavorite = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSparkleSound();
    setVideosList((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Automatic timeline progression
  useEffect(() => {
    let timer: any = null;
    if (activeVideo && isPlaying && !isRecording) {
      timer = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            if (currentSceneIndex < activeScenes.length - 1) {
              const nextIdx = currentSceneIndex + 1;
              setCurrentSceneIndex(nextIdx);
              setTippyMood(activeScenes[nextIdx].tippyAction);
              if (!isAudioMuted) speakVideoDialogue(activeScenes[nextIdx].dialogueText);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 5;
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [activeVideo, isPlaying, currentSceneIndex, activeScenes, isAudioMuted, isRecording]);

  // Success flow
  const handlePronunciationSuccess = () => {
    playFanfareSound();
    setShowConfetti(true);
    setEvaluationResult("success");
    setTippyMood("celebrate");
    if (onRewardStars) onRewardStars(3);

    speakText(`MashaAllah! Excellent! You pronounced ${activeVideo?.targetWord} perfectly!`, {
      lang: childLanguage,
      gender: voiceGender,
      onEnd: () => {
        setTimeout(() => setShowConfetti(false), 3000);
      },
    });
  };

  // Retry flow
  const handlePronunciationRetry = () => {
    playPopSound();
    setEvaluationResult("retry");
    setTippyMood("smile");

    speakText(`Let's try again! Listen closely: ${activeVideo?.targetWord}`, {
      lang: childLanguage,
      gender: voiceGender,
      speed: "slow",
    });
  };

  // Voice Practice Microphone Trigger
  const handleStartPractice = () => {
    if (!activeVideo) return;
    playPopSound();
    setIsRecording(true);
    setEvaluationResult(null);
    setTippyMood("lipSync");

    speakText(`Now it's YOUR turn! Say ${activeVideo.targetWord}!`, {
      lang: childLanguage,
      gender: voiceGender,
      onEnd: () => {
        setTimeout(() => {
          setIsRecording(false);
          const isSuccess = Math.random() > 0.15;
          if (isSuccess) {
            handlePronunciationSuccess();
          } else {
            handlePronunciationRetry();
          }
        }, 2200);
      },
    });
  };

  // Next video in list
  const handleNextVideo = () => {
    if (!activeVideo) return;
    const currentIndex = videosList.findIndex((v) => v.id === activeVideo.id);
    const nextVideo = videosList[(currentIndex + 1) % videosList.length];
    handleOpenVideo(nextVideo);
  };

  // Close player
  const handleClosePlayer = () => {
    playPopSound();
    stopSpeaking();
    setActiveVideo(null);
    setIsPlaying(false);
    setShowConfetti(false);
  };

  return (
    <div className="p-4 space-y-5 pb-28 max-w-2xl mx-auto select-none">
      {/* Pixar-Style Theater Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 via-amber-400 to-emerald-400 p-5 rounded-3xl text-white shadow-xl border-4 border-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-4 -left-4 text-4xl opacity-40 animate-pulse">✨</div>
        <div className="absolute -bottom-4 right-8 text-4xl opacity-40">🎈</div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Film className="w-7 h-7 text-amber-200 fill-amber-200 animate-bounce" />
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">
              TinySteps AI Theater
            </h2>
          </div>
          <p className="text-xs font-bold text-white/95">
            Full-Screen Pixar-Quality Animated Learning Videos
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => {
              playPopSound();
              setShowFavoritesOnly(!showFavoritesOnly);
            }}
            className={`px-3 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md border border-white/60 active:scale-95 transition-transform cursor-pointer ${
              showFavoritesOnly ? "bg-rose-500 text-white" : "bg-white/30 backdrop-blur-md text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-white" : ""}`} />
            <span>{showFavoritesOnly ? "Favorites" : "All"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = !showFavoritesOnly && selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                playPopSound();
                setShowFavoritesOnly(false);
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-sm border cursor-pointer ${
                isActive
                  ? "bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat === "All" ? "🌟 All Videos" : cat}
            </button>
          );
        })}
      </div>

      {/* Video Gallery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenVideo(video)}
            className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group relative"
          >
            {/* Visual Thumbnail Stage */}
            <div
              className={`relative aspect-video bg-gradient-to-tr ${video.color} p-4 flex flex-col items-center justify-center text-white overflow-hidden`}
            >
              <div className="absolute top-2 left-2 text-2xl opacity-60">☁️</div>
              <div className="absolute top-3 right-4 text-2xl opacity-60">☁️</div>

              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-6xl drop-shadow-xl group-hover:scale-110 transition-transform"
              >
                {video.emoji}
              </motion.span>

              {/* Category & Duration Badges */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-800 shadow-sm border border-white">
                {video.category}
              </div>

              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-white/30 text-white">
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>{video.durationSeconds}s</span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => handleToggleFavorite(video.id, e)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-rose-500 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    video.isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Center Play Circle */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/95 text-amber-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-amber-300">
                  <Play className="w-6 h-6 fill-amber-950 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Title & Info Footer */}
            <div className="p-3.5 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">
                  {video.title}
                </h3>
                <p className="text-[11px] font-extrabold text-amber-600 mt-0.5">
                  Target: "{video.targetWord}"
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="text-[10px] font-black text-amber-950">+3 Stars</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FULL-SCREEN IMMERSIVE VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex flex-col justify-between overflow-y-auto p-3 sm:p-5 select-none"
          >
            {/* Top Bar Navigation */}
            <div className="w-full max-w-3xl mx-auto flex items-center justify-between pt-2 px-1">
              <button
                onClick={handleClosePlayer}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black text-xs flex items-center gap-2 border border-white/20 active:scale-95 transition-transform cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Theater</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs">
                  {activeVideo.category}
                </span>

                <button
                  onClick={() => handleToggleFavorite(activeVideo.id)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 active:scale-95 transition-transform cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      activeVideo.isFavorite ? "fill-rose-500 text-rose-500" : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* IMMERSIVE 16:9 ANIMATED VIDEO STAGE */}
            <div className="w-full max-w-3xl mx-auto relative my-2">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-4 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.5)] bg-slate-900 flex flex-col justify-between">
                {showConfetti && <ConfettiExplosion />}

                {/* Dynamic Pixar Animated Sky Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${currentScene.bgGradient} transition-colors duration-1000`}
                >
                  <motion.div
                    animate={{ x: [-30, 30, -30] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="absolute top-4 left-6 text-5xl opacity-80"
                  >
                    ☁️
                  </motion.div>
                  <motion.div
                    animate={{ x: [30, -30, 30] }}
                    transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                    className="absolute top-8 right-8 text-6xl opacity-80"
                  >
                    ☁️
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="absolute top-16 left-12 text-3xl"
                  >
                    🦋
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -22, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5 }}
                    className="absolute top-12 right-16 text-3xl"
                  >
                    🎈
                  </motion.div>
                  <div className="absolute top-6 left-1/3 text-2xl animate-pulse">✨</div>
                  <div className="absolute bottom-16 right-1/4 text-2xl animate-ping">🌟</div>
                </div>

                {/* Camera Zoom & Pan Layer */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 0.4, -0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full p-4 flex flex-col justify-between"
                >
                  {/* Top Scene Title Badge */}
                  <div className="flex justify-between items-center">
                    <span className="bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-slate-800 shadow-md border border-white/80">
                      {currentScene.sceneTitle}
                    </span>

                    <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-white border border-white/20">
                      Scene {currentSceneIndex + 1} of {activeScenes.length}
                    </span>
                  </div>

                  {/* Stage Center Props & Tippy Owl AI Teacher */}
                  <div className="flex items-center justify-around my-auto px-4">
                    {/* Main Scene Animated Prop */}
                    <motion.div
                      animate={{
                        scale: [1, 1.12, 1],
                        rotate: [0, 6, -6, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="relative"
                    >
                      <span className="text-7xl sm:text-8xl filter drop-shadow-2xl">
                        {currentScene.mainEmoji}
                      </span>
                      <div className="absolute -top-3 -right-3 text-2xl animate-bounce">
                        {currentScene.secondaryEmojis[0] || "✨"}
                      </div>
                      <div className="absolute -bottom-2 -left-3 text-2xl animate-pulse">
                        {currentScene.secondaryEmojis[1] || "🌟"}
                      </div>
                    </motion.div>

                    {/* Tippy Owl Animated Teacher */}
                    <div className="relative flex flex-col items-center">
                      <motion.div
                        animate={
                          tippyMood === "celebrate"
                            ? { y: [0, -20, 0], scale: [1, 1.15, 1] }
                            : { y: [0, -6, 0] }
                        }
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2 bg-gradient-to-tr from-amber-300 via-sky-300 to-purple-300 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden"
                      >
                        {/* Tippy Avatar with Natural Blinking */}
                        <motion.img
                          animate={{ scaleY: [1, 0.15, 1] }}
                          transition={{ repeat: Infinity, duration: 3.8, times: [0, 0.04, 0.08] }}
                          src={APP_IMAGES.tippyOwl}
                          alt="Tippy Owl Teacher"
                          className="w-full h-full object-cover rounded-full"
                        />

                        {/* Waving / Pointing Hand Tag */}
                        <motion.div
                          animate={
                            tippyMood === "wave"
                              ? { rotate: [0, 25, -10, 0] }
                              : tippyMood === "celebrate"
                              ? { scale: [1, 1.3, 1] }
                              : {}
                          }
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="absolute bottom-1 right-2 bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-white shadow-md"
                        >
                          {tippyMood === "celebrate" ? "🎉 Yay!" : "👋 Tippy"}
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Synchronized Bouncing Subtitle Box */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border-2 border-amber-300 max-w-xl mx-auto w-full text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm sm:text-base font-extrabold text-slate-800">
                      {currentScene.subtitleWords.map((w, idx) => {
                        const isCurrentWord = idx === activeWordIndex;
                        return (
                          <motion.span
                            key={idx}
                            animate={isCurrentWord ? { scale: [1, 1.25, 1], y: [0, -4, 0] } : {}}
                            className={`px-2 py-0.5 rounded-xl transition-all ${
                              isCurrentWord || w.highlight
                                ? "bg-amber-400 text-amber-950 font-black shadow-md border border-amber-500 scale-105"
                                : "text-slate-800"
                            }`}
                          >
                            {w.text}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Rainbow Timeline Animated Progress Bar */}
                <div className="w-full bg-slate-800/60 h-2.5 relative overflow-hidden">
                  <motion.div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-sky-400 to-purple-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Voice Practice & Evaluation Panel */}
            <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-2 border-amber-300 my-2 text-center space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  <h4 className="font-black text-slate-900 text-sm">
                    Target Word to Practice:{" "}
                    <span className="text-amber-600 font-black text-base">
                      "{activeVideo.targetWord}"
                    </span>
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-xs font-black text-amber-950">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>Earn 3 Stars!</span>
                </div>
              </div>

              {/* Evaluation Feedback Alert */}
              <AnimatePresence>
                {evaluationResult === "success" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="p-3 bg-emerald-100 rounded-2xl border border-emerald-300 text-emerald-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>MashaAllah! Excellent Pronunciation! 3 Stars Earned! ⭐⭐⭐</span>
                  </motion.div>
                )}

                {evaluationResult === "retry" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="p-3 bg-amber-100 rounded-2xl border border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
                    <span>Let's Try Again! Tippy says: Listen closely and repeat!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Practice Mic Control Button */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() =>
                    speakText(activeVideo.targetWord, {
                      lang: childLanguage,
                      gender: voiceGender,
                    })
                  }
                  className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-sm border border-amber-300 active:scale-95 transition-transform cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Listen Word</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartPractice}
                  disabled={isRecording}
                  className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-xl border-2 border-white cursor-pointer ${
                    isRecording
                      ? "bg-rose-500 text-white animate-pulse"
                      : evaluationResult === "success"
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-purple-500 via-indigo-600 to-amber-500 text-white"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{isRecording ? "Listening to Voice..." : "Press Mic to Practice!"}</span>
                </motion.button>
              </div>
            </div>

            {/* Bottom Floating Control Bar */}
            <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-2xl border-2 border-white flex items-center justify-between mb-2 z-30">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-90 transition-transform cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-amber-950" /> : <Play className="w-5 h-5 fill-amber-950 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm active:scale-90 transition-transform cursor-pointer"
                title="Mute / Unmute"
              >
                {isAudioMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-sky-600" />}
              </button>

              <button
                onClick={handleStartPractice}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Practice</span>
              </button>

              <button
                onClick={() => handleToggleFavorite(activeVideo.id)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-rose-500 shadow-sm active:scale-90 transition-transform cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${activeVideo.isFavorite ? "fill-rose-500" : ""}`} />
              </button>

              <button
                onClick={handleNextVideo}
                className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-90 transition-transform cursor-pointer"
                title="Next Video"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleClosePlayer}
                className="p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm active:scale-90 transition-transform cursor-pointer"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
