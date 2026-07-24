import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Music,
  RotateCcw,
  Star,
  ChevronRight,
  Heart,
  Award,
} from "lucide-react";
import { IslamicLesson, SupportedLanguage, VoiceSettings } from "../types";
import { ISLAMIC_LESSONS } from "../data/mockData";
import { APP_IMAGES } from "../assets/images";
import {
  playPopSound,
  playSparkleSound,
  playFanfareSound,
  speakText,
  toggleSoftBackgroundMusic,
} from "../utils/audio";

interface IslamicLearningTabProps {
  childName?: string;
  childLanguage?: SupportedLanguage;
  voiceSettings?: VoiceSettings;
  onAddStarsAndCoins: (stars: number, coins: number) => void;
}

export const IslamicLearningTab: React.FC<IslamicLearningTabProps> = ({
  childName = "Little Friend",
  childLanguage = "English",
  voiceSettings = { gender: "female", speed: "normal" },
  onAddStarsAndCoins,
}) => {
  // Local state for lessons & unlocks
  const [lessons, setLessons] = useState<IslamicLesson[]>(() => {
    // Check localStorage or default mock
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tinysteps_islamic_progress");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return ISLAMIC_LESSONS;
  });

  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [activeKalmaSubStepIndex, setActiveKalmaSubStepIndex] = useState<number>(0);

  // Audio / Voice mode state
  const [voiceSpeed, setVoiceSpeed] = useState<"slow" | "normal">(
    voiceSettings.speed || "normal"
  );
  const [voiceGender, setVoiceGender] = useState<"female" | "male">(
    voiceSettings.gender || "female"
  );
  const [isBgMusicOn, setIsBgMusicOn] = useState<boolean>(false);

  // Video Animation Stage State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [videoTimerSeconds, setVideoTimerSeconds] = useState<number>(0);

  // Microphone / Speech Evaluation State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [evaluationState, setEvaluationState] = useState<"idle" | "listening" | "success" | "retry">("idle");
  const [aiFeedbackText, setAiFeedbackText] = useState<string>("");

  // Step 1 Story Mode for Bismillah
  const [showBismillahStory, setShowBismillahStory] = useState<boolean>(false);
  const [storyStep, setStoryStep] = useState<number>(0);

  // Active word highlight index during audio playback
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  // Encouraging speech retry messages
  const ENCOURAGING_MESSAGES = [
    "Wonderful try! Let's practice once more.",
    "You're doing great! Listen carefully and try again.",
    "Almost there! I know you can do it.",
  ];
  const [encouragingIndex, setEncouragingIndex] = useState<number>(0);

  // Bismillah Story Scenes
  const BISMILLAH_STORY_SCENES = [
    {
      emoji: "🍎",
      title: "Before Eating Yummy Food",
      text: "Tippy always says 'Bismillahir Rahmanir Rahim' before eating a sweet red apple! It brings blessings to our food.",
    },
    {
      emoji: "🥛",
      title: "Before Drinking Refreshing Water",
      text: "Before drinking clean water, we say 'Bismillahir Rahmanir Rahim' with a big happy smile!",
    },
    {
      emoji: "🎨",
      title: "Before Drawing & Learning",
      text: "Before painting a colorful rainbow or reading a storybook, we say 'Bismillahir Rahmanir Rahim'!",
    },
    {
      emoji: "🚲",
      title: "Before Playing & Riding",
      text: "Before riding our bicycle or playing tag with friends, we say 'Bismillahir Rahmanir Rahim' to start with Allah's name!",
    },
  ];

  // Word-by-word active highlight trigger
  const triggerWordHighlight = (phrase: string) => {
    const words = phrase.split(" ");
    setActiveWordIndex(0);
    words.forEach((_, idx) => {
      setTimeout(() => {
        setActiveWordIndex(idx);
      }, (idx + 1) * 600);
    });
    setTimeout(() => {
      setActiveWordIndex(-1);
    }, (words.length + 1) * 600);
  };

  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const isKalmaLesson = currentLesson?.orderNumber === 10;
  const currentKalmaSubStep = isKalmaLesson && currentLesson?.subSteps
    ? currentLesson.subSteps[activeKalmaSubStepIndex]
    : null;

  // Persist lessons to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tinysteps_islamic_progress", JSON.stringify(lessons));
    }
  }, [lessons]);

  // Handle video timer loop
  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoTimerSeconds((prev) => {
          const maxSec = currentLesson.videoDurationSeconds || 15;
          if (prev >= maxSec) {
            return 0; // loop
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoPlaying, currentLesson]);

  // Initial welcome voice when lesson changes
  useEffect(() => {
    const wordToSpeak = currentKalmaSubStep
      ? `${currentKalmaSubStep.phrase}. ${currentKalmaSubStep.audioPhrase}`
      : `${currentLesson.title}. ${currentLesson.audioPhrase}`;

    speakText(wordToSpeak, {
      lang: childLanguage,
      gender: voiceGender,
      speed: voiceSpeed,
    });
    setEvaluationState("idle");
    setAiFeedbackText("");
    setSpokenTranscript("");
    setVideoTimerSeconds(0);
  }, [activeLessonIndex, activeKalmaSubStepIndex, voiceGender, voiceSpeed]);

  const handleReplayPronunciation = (speedOverride?: "slow" | "normal") => {
    playPopSound();
    const speedToUse = speedOverride || voiceSpeed;
    const phraseToSpeak = currentKalmaSubStep
      ? currentKalmaSubStep.phrase
      : currentLesson.arabicText || currentLesson.title;

    triggerWordHighlight(phraseToSpeak);

    speakText(`${phraseToSpeak}! ${currentKalmaSubStep ? currentKalmaSubStep.meaning : currentLesson.meaning}`, {
      lang: childLanguage,
      gender: voiceGender,
      speed: speedToUse,
    });
  };

  const handleToggleBgMusic = () => {
    playPopSound();
    const nextState = !isBgMusicOn;
    setIsBgMusicOn(nextState);
    toggleSoftBackgroundMusic(nextState);
  };

  // Start Mic Recording & Speech Evaluation
  const handleStartMicPractice = () => {
    playPopSound();
    setIsListening(true);
    setEvaluationState("listening");
    setSpokenTranscript("");
    setAiFeedbackText("Tippy is listening carefully... Speak now!");

    const targetPhrase = currentKalmaSubStep
      ? currentKalmaSubStep.phrase
      : currentLesson.title.replace(/^\d+\.\s*/, "");

    // Check SpeechRecognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpokenTranscript(transcript);
          evaluateChildSpeech(transcript, targetPhrase);
        };

        recognition.onerror = () => {
          // Simulation fallback on error or noise
          simulateMicEvaluation(targetPhrase);
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback
      }
    }

    // Fallback simulation for devices without Web Speech API
    simulateMicEvaluation(targetPhrase);
  };

  const simulateMicEvaluation = (targetPhrase: string) => {
    setTimeout(() => {
      setSpokenTranscript(targetPhrase);
      evaluateChildSpeech(targetPhrase, targetPhrase);
    }, 2200);
  };

  const evaluateChildSpeech = (spoken: string, target: string) => {
    setIsListening(false);
    const cleanSpoken = spoken.toLowerCase().trim();
    const cleanTarget = target.toLowerCase().trim();

    // Check match or high similarity
    const isMatched =
      cleanSpoken.includes(cleanTarget) ||
      cleanTarget.includes(cleanSpoken) ||
      cleanSpoken.length > 2;

    if (isMatched) {
      playSparkleSound();
      playFanfareSound();
      setEvaluationState("success");

      const successMsg = `MashaAllah ${childName}! Excellent pronunciation of ${target}!`;
      setAiFeedbackText(successMsg);

      speakText(successMsg, {
        lang: childLanguage,
        gender: voiceGender,
        speed: "normal",
      });

      onAddStarsAndCoins(3, 25);

      // Unlock next step or lesson
      setTimeout(() => {
        if (isKalmaLesson && currentLesson.subSteps && activeKalmaSubStepIndex < currentLesson.subSteps.length - 1) {
          // Advance kalma sub-step
          setActiveKalmaSubStepIndex((prev) => prev + 1);
        } else {
          // Unlock next lesson in list
          setLessons((prev) =>
            prev.map((l, idx) => {
              if (idx === activeLessonIndex) return { ...l, unlocked: true };
              if (idx === activeLessonIndex + 1) return { ...l, unlocked: true };
              return l;
            })
          );

          if (activeLessonIndex < lessons.length - 1) {
            setActiveLessonIndex((prev) => prev + 1);
            setActiveKalmaSubStepIndex(0);
          }
        }
      }, 2500);
    } else {
      setEvaluationState("retry");
      const retryMsg = ENCOURAGING_MESSAGES[encouragingIndex % ENCOURAGING_MESSAGES.length];
      setEncouragingIndex((prev) => prev + 1);
      setAiFeedbackText(retryMsg);

      speakText(retryMsg, {
        lang: childLanguage,
        gender: voiceGender,
        speed: voiceSpeed,
      });

      // Auto replay pronunciation after gentle message
      setTimeout(() => {
        handleReplayPronunciation("slow");
      }, 2500);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-teal-50 via-sky-50 to-emerald-100 p-4 pb-24 max-w-xl mx-auto font-sans select-none space-y-4">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-xl border-4 border-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 p-1 shadow-md border-2 border-white flex items-center justify-center text-2xl">
            🌙
          </div>
          <div>
            <h2 className="font-black text-emerald-950 text-base flex items-center gap-1.5">
              <span>Islamic Learning Journey</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                10 Step Journey
              </span>
            </h2>
            <p className="text-xs font-bold text-emerald-800/80">
              Respectful, cheerful step-by-step lessons for toddlers
            </p>
          </div>
        </div>

        {/* Soft Background Music Toggle */}
        <button
          onClick={handleToggleBgMusic}
          className={`p-2.5 rounded-2xl font-black text-xs flex items-center gap-1 shadow-md border cursor-pointer active:scale-95 transition-transform ${
            isBgMusicOn
              ? "bg-emerald-400 text-emerald-950 border-emerald-300"
              : "bg-slate-100 text-slate-600 border-slate-300"
          }`}
          title="Toggle soft background music"
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px] hidden sm:inline">
            {isBgMusicOn ? "Music On" : "Music Off"}
          </span>
        </button>
      </div>

      {/* Voice Controls Bar (Male/Female & Speed Toggle) */}
      <div className="bg-white/80 rounded-2xl p-3 border-2 border-teal-200 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-extrabold text-slate-700">Teacher Voice:</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Female / Male Voice Switch */}
          <div className="flex bg-teal-100 p-0.5 rounded-xl border border-teal-200 text-xs font-black">
            <button
              onClick={() => {
                playPopSound();
                setVoiceGender("female");
              }}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                voiceGender === "female"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-emerald-900"
              }`}
            >
              👩 Female
            </button>
            <button
              onClick={() => {
                playPopSound();
                setVoiceGender("male");
              }}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                voiceGender === "male"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-emerald-900"
              }`}
            >
              👨 Male
            </button>
          </div>

          {/* Normal vs Slow Mode */}
          <button
            onClick={() => {
              playPopSound();
              setVoiceSpeed((prev) => (prev === "slow" ? "normal" : "slow"));
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black border shadow-xs cursor-pointer active:scale-95 ${
              voiceSpeed === "slow"
                ? "bg-amber-400 text-amber-950 border-amber-300"
                : "bg-sky-100 text-sky-900 border-sky-200"
            }`}
          >
            {voiceSpeed === "slow" ? "🐢 Slow Mode" : "🐰 Normal Mode"}
          </button>
        </div>
      </div>

      {/* Active Lesson Display & Video Stage */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl border-4 border-emerald-300 space-y-4 relative overflow-hidden">
        {/* Lesson Title Header & Bismillah Story Modal Trigger */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
              Lesson {currentLesson.orderNumber} of 10
            </span>
            <h3 className="text-xl font-black text-emerald-950">
              {currentLesson.title}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700 font-serif">
              {currentLesson.arabicText}
            </span>
            <p className="text-[11px] font-bold text-slate-500">
              {currentLesson.transliteration}
            </p>
          </div>
        </div>

        {/* Special Bismillah Story Banner if Lesson 2 or 3 */}
        {(currentLesson.orderNumber === 2 || currentLesson.orderNumber === 3) && (
          <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 rounded-2xl p-3 border-2 border-amber-300 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <div>
                <h4 className="text-xs font-black text-amber-950">
                  Step 1: Animated Bismillah Story
                </h4>
                <p className="text-[10px] font-bold text-amber-800">
                  Discover why we say Bismillah before eating, drinking & playing!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playPopSound();
                setShowBismillahStory(true);
                setStoryStep(0);
              }}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md border border-white cursor-pointer active:scale-95"
            >
              Watch Story ➔
            </button>
          </div>
        )}

        {/* First Kalma Sub-Step Banner if Kalma Lesson */}
        {isKalmaLesson && currentLesson.subSteps && (
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <span>✨ Step-by-Step Kalma Learning</span>
                <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full text-[10px]">
                  Part {activeKalmaSubStepIndex + 1} of {currentLesson.subSteps.length}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {currentLesson.subSteps.map((sub, idx) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    playPopSound();
                    setActiveKalmaSubStepIndex(idx);
                  }}
                  className={`py-1.5 px-1 rounded-xl font-black text-[10px] text-center border transition-transform cursor-pointer ${
                    activeKalmaSubStepIndex === idx
                      ? "bg-amber-400 text-amber-950 border-amber-500 scale-105 shadow-sm"
                      : "bg-white text-slate-600 border-amber-200"
                  }`}
                >
                  Part {sub.stepNumber}
                </button>
              ))}
            </div>

            {currentKalmaSubStep && (
              <div className="bg-white rounded-xl p-2.5 border border-amber-200 text-center">
                <span className="text-base font-black text-amber-950 block">
                  "{currentKalmaSubStep.phrase}"
                </span>
                <span className="text-xs font-extrabold text-amber-800">
                  Meaning: {currentKalmaSubStep.meaning}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Cute Animated Video Stage (10-20s Animated Canvas Simulation) */}
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-b from-sky-400 via-teal-400 to-emerald-500 p-4 shadow-inner overflow-hidden border-2 border-emerald-200 flex flex-col justify-between">
          {/* Floating Stars & Clouds Animation */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <motion.div
              animate={{ x: [-20, 300], y: [10, 20, 10] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute top-2 left-0 text-3xl"
            >
              ☁️
            </motion.div>
            <motion.div
              animate={{ x: [300, -20] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute top-8 right-0 text-2xl"
            >
              ✨
            </motion.div>
          </div>

          {/* Video Header Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-black flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {currentKalmaSubStep
                  ? currentKalmaSubStep.videoTitle
                  : currentLesson.videoTitle}
              </span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-[11px] font-black border border-white/20">
              {videoTimerSeconds}s / {currentLesson.videoDurationSeconds}s
            </div>
          </div>

          {/* Animated Mascot & Character Mouth Movement Guide */}
          <div className="my-auto text-center z-10 space-y-1">
            <motion.div
              animate={
                activeWordIndex >= 0
                  ? { scale: [1, 1.15, 1], rotate: [-2, 2, -2] }
                  : { y: [0, -6, 0] }
              }
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block relative"
            >
              <div className="w-18 h-18 mx-auto rounded-full bg-white/95 p-1 shadow-xl border-4 border-amber-300 flex items-center justify-center relative">
                <img
                  src={APP_IMAGES.tippyOwl}
                  alt="Tippy"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* Character Mouth Shape Guide Overlay */}
                <motion.div
                  animate={activeWordIndex >= 0 ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  className="absolute -bottom-1 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[9px] font-black border border-white shadow-xs"
                >
                  {activeWordIndex >= 0 ? "👄 Mouth: Round & Open" : "👄 Mouth Guide"}
                </motion.div>
              </div>
            </motion.div>

            {/* Word-by-Word Active Highlighting Display */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {(currentKalmaSubStep
                ? currentKalmaSubStep.phrase
                : currentLesson.arabicText
              )
                .split(" ")
                .map((word, wIdx) => {
                  const isHighlighted = activeWordIndex === wIdx;
                  return (
                    <motion.span
                      key={wIdx}
                      animate={isHighlighted ? { scale: 1.25, y: -3 } : { scale: 1, y: 0 }}
                      className={`text-2xl font-black font-serif px-2 py-0.5 rounded-xl transition-colors ${
                        isHighlighted
                          ? "bg-amber-300 text-amber-950 shadow-md border border-white"
                          : "text-white drop-shadow-md"
                      }`}
                    >
                      {word}
                    </motion.span>
                  );
                })}
            </div>

            <p className="text-xs font-black text-teal-100 drop-shadow-sm">
              {currentKalmaSubStep
                ? currentKalmaSubStep.transliteration
                : currentLesson.transliteration}
            </p>
          </div>

          {/* Video Control Bar */}
          <div className="flex items-center justify-between z-10 pt-1">
            <button
              onClick={() => {
                playPopSound();
                setIsVideoPlaying((prev) => !prev);
              }}
              className="bg-white/90 text-slate-800 p-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:bg-white cursor-pointer active:scale-95"
            >
              {isVideoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Video</span>
                </>
              )}
            </button>

            {/* Unlimited Replay Button */}
            <button
              onClick={() => handleReplayPronunciation()}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md border border-white flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen Pronunciation</span>
            </button>
          </div>
        </div>

        {/* Audio Speeds & Practice Options */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleReplayPronunciation("normal")}
            className="py-2.5 px-3 bg-sky-100 hover:bg-sky-200 text-sky-950 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border border-sky-300 cursor-pointer active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4 text-sky-700" />
            <span>Normal Speed (0.88x)</span>
          </button>

          <button
            onClick={() => handleReplayPronunciation("slow")}
            className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border border-amber-300 cursor-pointer active:scale-95 transition-transform"
          >
            <span>🐢 Slow Practice Mode (0.65x)</span>
          </button>
        </div>

        {/* Microphone Practice Section */}
        <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200 text-center space-y-3">
          <span className="text-xs font-extrabold text-emerald-900 block">
            🎙️ Practice Speaking with Tippy the Owl:
          </span>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartMicPractice}
            disabled={isListening}
            className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-emerald-950"
            }`}
          >
            <Mic className="w-5 h-5 fill-emerald-950" />
            <span>
              {isListening
                ? "Listening... Say the word!"
                : `Tap Mic & Say "${currentKalmaSubStep ? currentKalmaSubStep.phrase : currentLesson.title.replace(/^\d+\.\s*/, "")}"`}
            </span>
          </motion.button>

          {/* Spoken Transcript & Feedback */}
          {aiFeedbackText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-2xl text-xs font-black border ${
                evaluationState === "success"
                  ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                  : evaluationState === "retry"
                  ? "bg-amber-100 text-amber-950 border-amber-300"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <p>{aiFeedbackText}</p>
              {spokenTranscript && (
                <p className="text-[11px] font-bold opacity-80 mt-1">
                  You said: "{spokenTranscript}"
                </p>
              )}
            </motion.div>
          )}

          <p className="text-[11px] font-bold text-slate-500 italic">
            💡 Tippy unlocks the next lesson once pronunciation is complete!
          </p>
        </div>
      </div>

      {/* Sequential Journey Path List (1 through 10) */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-4 border-emerald-300 space-y-3">
        <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
          <span>🌙 10-Step Sequential Path</span>
        </h3>

        <div className="space-y-2">
          {lessons.map((lesson, idx) => {
            const isSelected = idx === activeLessonIndex;
            const isUnlocked = lesson.unlocked || idx === 0;

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  if (isUnlocked) {
                    playPopSound();
                    setActiveLessonIndex(idx);
                    setActiveKalmaSubStepIndex(0);
                  } else {
                    playPopSound();
                    speakText("Complete the previous lesson first to unlock this one!");
                  }
                }}
                disabled={!isUnlocked}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-100 border-emerald-400 shadow-md scale-[1.01]"
                    : isUnlocked
                    ? "bg-slate-50 border-slate-200 hover:bg-emerald-50"
                    : "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-xs ${
                      isSelected
                        ? "bg-emerald-500 text-white"
                        : isUnlocked
                        ? "bg-emerald-200 text-emerald-950"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {isUnlocked ? `#${lesson.orderNumber}` : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="text-left">
                    <h4 className="font-black text-xs text-slate-800">
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] font-extrabold text-slate-500">
                      {lesson.meaning}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isUnlocked && (
                    <span className="text-xs text-emerald-600 font-extrabold">
                      Ready
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isSelected ? "text-emerald-700" : "text-slate-400"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Animated Bismillah Story Modal */}
      <AnimatePresence>
        {showBismillahStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 space-y-4 relative overflow-hidden text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowBismillahStory(false);
                }}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-slate-600 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="bg-amber-200 text-amber-950 px-3 py-1 rounded-full text-xs font-black">
                  📖 Bismillah Animated Story • Scene {storyStep + 1} of 4
                </span>
                <h3 className="text-xl font-black text-amber-950 pt-2">
                  {BISMILLAH_STORY_SCENES[storyStep].title}
                </h3>
              </div>

              {/* Animated Story Illustration Frame */}
              <div className="w-full h-44 rounded-2xl bg-white border-2 border-amber-200 shadow-inner flex flex-col items-center justify-center p-4 space-y-2">
                <motion.div
                  key={storyStep}
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="text-6xl"
                >
                  {BISMILLAH_STORY_SCENES[storyStep].emoji}
                </motion.div>

                <p className="text-sm font-bold text-amber-950 max-w-sm">
                  {BISMILLAH_STORY_SCENES[storyStep].text}
                </p>
              </div>

              {/* Read Aloud Button */}
              <button
                onClick={() => {
                  playPopSound();
                  speakText(BISMILLAH_STORY_SCENES[storyStep].text, {
                    lang: childLanguage,
                    gender: voiceGender,
                    speed: voiceSpeed,
                  });
                }}
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 rounded-2xl font-black text-xs shadow-md border border-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read Story Aloud</span>
              </button>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={storyStep === 0}
                  onClick={() => {
                    playPopSound();
                    setStoryStep((prev) => Math.max(0, prev - 1));
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-xs border ${
                    storyStep === 0
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-800 border-amber-300 hover:bg-amber-50 cursor-pointer"
                  }`}
                >
                  ◀ Previous
                </button>

                {storyStep < BISMILLAH_STORY_SCENES.length - 1 ? (
                  <button
                    onClick={() => {
                      playPopSound();
                      setStoryStep((prev) => prev + 1);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer"
                  >
                    Next Scene ➔
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSparkleSound();
                      setShowBismillahStory(false);
                      speakText("MashaAllah! Now let's practice saying Bismillahir Rahmanir Rahim together!", {
                        lang: childLanguage,
                        gender: voiceGender,
                      });
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer"
                  >
                    Practice Bismillah Now ✨
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
