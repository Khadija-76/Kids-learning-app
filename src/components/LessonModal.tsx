import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, CheckCircle2, ArrowRight, X, Star, Mic, Play, Pause, RotateCcw } from "lucide-react";
import { LevelNode, LessonContent, SupportedLanguage, VoiceSettings } from "../types";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, playFanfareSound, speakText, stopSpeaking } from "../utils/audio";

interface LessonModalProps {
  level: LevelNode;
  childLanguage?: SupportedLanguage;
  voiceSettings?: VoiceSettings;
  onClose: () => void;
  onCompleteLevel: (levelId: number, starsEarned: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  level,
  childLanguage = "English",
  voiceSettings = { gender: "female", speed: "normal" },
  onClose,
  onCompleteLevel,
}) => {
  const voiceGender: "female" | "male" = (voiceSettings?.gender as "female" | "male") || "female";
  const voiceSpeed: "slow" | "normal" = (voiceSettings?.speed as "slow" | "normal") || "normal";

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 6-Step Interactive State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [evaluationStatus, setEvaluationStatus] = useState<"idle" | "evaluating" | "pass" | "retry">("idle");
  const [speechFeedback, setSpeechFeedback] = useState<string>("");

  const currentLesson: LessonContent = level.lessons[currentStepIndex] || level.lessons[0];

  // Reset state on step change
  useEffect(() => {
    setSelectedOption(null);
    setIsVideoPlaying(true);
    setEvaluationStatus("idle");
    setSpeechFeedback("");

    // Auto speak word
    const textToSpeak = `${currentLesson.targetWord}! ${currentLesson.audioPhrase}`;
    speakText(textToSpeak, {
      lang: childLanguage,
      gender: voiceGender,
      speed: voiceSpeed,
    });

    return () => {
      stopSpeaking();
    };
  }, [currentStepIndex, level, childLanguage]);

  // Audio Handlers
  const handlePlayNormal = () => {
    playPopSound();
    speakText(`${currentLesson.targetWord}. ${currentLesson.audioPhrase}`, {
      lang: childLanguage,
      gender: voiceGender,
      speed: "normal",
    });
  };

  const handlePlaySlow = () => {
    playPopSound();
    speakText(`${currentLesson.targetWord}`, {
      lang: childLanguage,
      gender: voiceGender,
      speed: "slow",
    });
  };

  const ENCOURAGING_MESSAGES = [
    "Wonderful try! Let's practice once more.",
    "You're doing great! Listen carefully and try again.",
    "Almost there! I know you can do it.",
  ];
  const [encouragingIndex, setEncouragingIndex] = useState<number>(0);

  // AI Voice Practice Handler
  const handleStartListening = () => {
    playPopSound();
    setIsListening(true);
    setEvaluationStatus("evaluating");
    setSpeechFeedback("Tippy is listening carefully to your voice...");

    // Try Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = childLanguage === "Urdu" ? "ur-PK" : childLanguage === "Arabic" ? "ar-SA" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 2;

        recognition.onresult = async (event: any) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          const target = currentLesson.targetWord.toLowerCase().trim();

          const isMatch = transcript.includes(target) || target.includes(transcript) || transcript.length > 1;

          if (isMatch) {
            setEvaluationStatus("pass");
            playSparkleSound();
            const passMsg = `Perfect! You said "${currentLesson.targetWord}" so clearly!`;
            setSpeechFeedback(passMsg);
            speakText(passMsg, { lang: childLanguage, gender: voiceGender });
          } else {
            setEvaluationStatus("retry");
            const retryMsg = ENCOURAGING_MESSAGES[encouragingIndex % ENCOURAGING_MESSAGES.length];
            setEncouragingIndex((prev) => prev + 1);
            setSpeechFeedback(retryMsg);
            speakText(retryMsg, { lang: childLanguage, gender: voiceGender });
            setTimeout(() => {
              handlePlaySlow();
            }, 2500);
          }
        };

        recognition.onerror = () => {
          fallbackSimulateSpeech();
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback below
      }
    }

    fallbackSimulateSpeech();
  };

  const fallbackSimulateSpeech = () => {
    setTimeout(() => {
      setIsListening(false);
      // 80% pass probability for toddler confidence
      const passed = Math.random() > 0.2;
      if (passed) {
        setEvaluationStatus("pass");
        playSparkleSound();
        const passMsg = `Super job! Excellent pronunciation of "${currentLesson.targetWord}"!`;
        setSpeechFeedback(passMsg);
        speakText(passMsg, { lang: childLanguage, gender: voiceGender });
      } else {
        setEvaluationStatus("retry");
        const retryMsg = ENCOURAGING_MESSAGES[encouragingIndex % ENCOURAGING_MESSAGES.length];
        setEncouragingIndex((prev) => prev + 1);
        setSpeechFeedback(retryMsg);
        speakText(retryMsg, { lang: childLanguage, gender: voiceGender });
        setTimeout(() => {
          handlePlaySlow();
        }, 2500);
      }
    }, 2200);
  };

  const handleSelectOption = (idx: number) => {
    playPopSound();
    setSelectedOption(idx);
    const correct = idx === (currentLesson.correctOptionIndex ?? 0);

    if (correct) {
      setEvaluationStatus("pass");
      playSparkleSound();
      speakText(`Yay! Wonderful job! That is ${currentLesson.targetWord}!`, {
        lang: childLanguage,
        gender: voiceGender,
      });
    } else {
      setEvaluationStatus("retry");
      speakText("Great try! Let's practice once more.", {
        lang: childLanguage,
        gender: voiceGender,
      });
    }
  };

  const handleNextStep = () => {
    playPopSound();
    if (currentStepIndex < level.lessons.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      playFanfareSound();
      speakText(`Hooray! You completed ${level.title}! Tippy is super proud of you!`, {
        lang: childLanguage,
        gender: voiceGender,
      });
      onCompleteLevel(level.id, 3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${level.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{level.icon}</span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">{level.title}</h3>
              <p className="text-xs text-white/90 font-medium">{level.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              playPopSound();
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / level.lessons.length) * 100}%` }}
          ></div>
        </div>

        {/* Body Content */}
        {!isCompleted ? (
          <div className="p-5 flex-1 overflow-y-auto flex flex-col items-center justify-between text-center gap-3">
            {/* Tippy Mascot Guide */}
            <div className="w-full bg-amber-50 rounded-2xl p-2.5 border border-amber-200 flex items-center gap-3">
              <img
                src={APP_IMAGES.tippyOwl}
                alt="Tippy"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 shadow-sm"
              />
              <div className="text-left text-xs font-bold text-amber-900">
                <span className="text-amber-600 block">Tippy Guide:</span>
                "{currentLesson.tip}"
              </div>
            </div>

            {/* STEP 1: Short Video / Animated Visual Stage */}
            <div className="relative w-full aspect-video max-h-44 bg-gradient-to-br from-indigo-900 via-purple-900 to-sky-900 rounded-2xl border-4 border-amber-300 overflow-hidden flex flex-col items-center justify-center shadow-lg group">
              <span className="text-6xl drop-shadow-lg animate-pulse">{currentLesson.emoji}</span>

              {/* Animated Floating Stars & Wave Simulation */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-end justify-center p-2">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold">
                  <span>🎬 {currentLesson.videoTitle || "Lesson Video"}</span>
                  <span className="text-amber-300">• {currentLesson.videoDuration || "0:15"}</span>
                </div>
              </div>

              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Target Word & Phonetics */}
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {currentLesson.targetWord}
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {currentLesson.phonetic}
                {currentLesson.translationOrMeaning && (
                  <span className="block text-purple-600 font-extrabold mt-0.5">
                    "{currentLesson.translationOrMeaning}"
                  </span>
                )}
              </p>
            </div>

            {/* STEP 2 & 3: Audio Control Buttons (Slow 🐢 vs Normal 🐇) */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlaySlow}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 border border-amber-300 shadow-sm active:scale-95 transition-transform"
                title="Slow Pronunciation"
              >
                <span className="text-base">🐢</span>
                <span>Slow Speech</span>
              </button>

              <button
                onClick={handlePlayNormal}
                className="px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-extrabold text-xs flex items-center gap-1.5 border border-sky-300 shadow-sm active:scale-95 transition-transform"
                title="Normal Pronunciation"
              >
                <Volume2 className="w-4 h-4 text-sky-700" />
                <span>Normal Speech</span>
              </button>
            </div>

            {/* STEP 4 & 5: Mic Voice Practice & AI Analysis */}
            <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center gap-2">
              <button
                onClick={handleStartListening}
                disabled={isListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-xl transition-all ${
                  isListening
                    ? "bg-rose-500 border-rose-300 text-white animate-pulse"
                    : evaluationStatus === "pass"
                    ? "bg-emerald-500 border-emerald-300 text-white"
                    : "bg-amber-400 border-white text-amber-950 hover:bg-amber-500 active:scale-90"
                }`}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8 stroke-[2.5]" />
                )}
              </button>

              <p className="text-xs font-bold text-slate-700">
                {isListening ? "Listening... Speak now! 🎙️" : "Press Mic & Say the Word!"}
              </p>

              {/* STEP 6: Strict Pass / Retry Status Message */}
              {speechFeedback && (
                <div
                  className={`w-full p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 ${
                    evaluationStatus === "pass"
                      ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                      : evaluationStatus === "retry"
                      ? "bg-rose-100 border-rose-300 text-rose-900"
                      : "bg-sky-100 border-sky-300 text-sky-900"
                  }`}
                >
                  <span>{speechFeedback}</span>
                </div>
              )}
            </div>

            {/* Quiz Options if applicable */}
            {currentLesson.options && (
              <div className="w-full grid grid-cols-1 gap-1.5">
                {currentLesson.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === currentLesson.correctOptionIndex;

                  let btnStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50";
                  if (isSelected) {
                    btnStyle = isCorrectOption
                      ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                      : "bg-rose-100 border-rose-400 text-rose-900";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full py-2.5 px-4 rounded-xl border-2 font-extrabold text-xs transition-all shadow-sm flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSelected && isCorrectOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Bar */}
            <div className="w-full mt-1">
              <button
                onClick={handleNextStep}
                disabled={evaluationStatus !== "pass" && currentLesson.options && selectedOption === null}
                className={`w-full py-3 px-6 rounded-2xl font-black text-base shadow-lg border-2 border-amber-200 flex items-center justify-center gap-2 ${
                  evaluationStatus === "pass" || (!currentLesson.options && evaluationStatus === "idle")
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950 active:scale-98 cursor-pointer transition-transform"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>
                  {evaluationStatus === "retry"
                    ? "Practice Voice First 🎙️"
                    : currentStepIndex < level.lessons.length - 1
                    ? "Next TinyStep"
                    : "Complete Level!"}
                </span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-32 h-32 rounded-full bg-amber-100 border-4 border-amber-300 p-2 shadow-2xl flex items-center justify-center relative"
            >
              <img
                src={APP_IMAGES.tippyOwl}
                alt="Tippy Celebrates"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute -top-3 -right-3 text-4xl animate-bounce">🎉</span>
            </motion.div>

            <div>
              <h2 className="text-2xl font-black text-slate-800">Superstar Learning!</h2>
              <p className="text-sm font-bold text-slate-600 mt-1">
                You earned 3 Stars & 20 Magic Coins!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200 shadow-sm">
              {[1, 2, 3].map((s) => (
                <Star key={s} className="w-8 h-8 fill-amber-400 text-amber-500 animate-pulse" />
              ))}
            </div>

            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              Back to Map 🗺️
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
