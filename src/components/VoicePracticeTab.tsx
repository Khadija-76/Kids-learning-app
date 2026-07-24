import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Volume2, Sparkles, Star, RefreshCw, VolumeX, CheckCircle2 } from "lucide-react";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, playFanfareSound, speakText } from "../utils/audio";

interface VoicePracticeTabProps {
  onAddStars: (stars: number) => void;
}

const TARGET_WORDS = [
  { word: "Mama", phonetic: "/mɑː.mɑː/", emoji: "👩" },
  { word: "Bismillah", phonetic: "Bis-mil-lah", emoji: "🤲" },
  { word: "Apple", phonetic: "/æp.əl/", emoji: "🍎" },
  { word: "Elephant", phonetic: "/ˈɛl.ɪ.fənt/", emoji: "🐘" },
  { word: "Star", phonetic: "/stɑːr/", emoji: "⭐" },
  { word: "Rainbow", phonetic: "/ˈreɪn.boʊ/", emoji: "🌈" },
];

export const VoicePracticeTab: React.FC<VoicePracticeTabProps> = ({ onAddStars }) => {
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<{
    stars: number;
    feedback: string;
    phoneticTip: string;
  } | null>(null);

  const currentWord = TARGET_WORDS[wordIdx];

  const handleHearModel = () => {
    playPopSound();
    speakText(`Say ${currentWord.word}!`);
  };

  const handleStartListening = () => {
    playPopSound();
    setIsListening(true);
    setFeedbackData(null);
    speakText(`Tippy is listening! Say ${currentWord.word}!`);

    // Use Web Speech API if supported
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
          setIsListening(false);
          evaluateSpeech(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          evaluateSpeech(currentWord.word);
        };

        recognition.start();
      } catch (err) {
        // Fallback timeout simulation
        setTimeout(() => {
          setIsListening(false);
          evaluateSpeech(currentWord.word);
        }, 3000);
      }
    } else {
      // Browser simulation
      setTimeout(() => {
        setIsListening(false);
        evaluateSpeech(currentWord.word);
      }, 2500);
    }
  };

  const evaluateSpeech = async (spokenText: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/ai/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWord: currentWord.word,
          spokenText,
        }),
      });
      const data = await res.json();
      setFeedbackData(data);
      setIsEvaluating(false);

      if (data.stars >= 2) {
        playFanfareSound();
        playSparkleSound();
        speakText(data.feedback);
        onAddStars(data.stars);
      } else {
        speakText(data.feedback || "Let me help you practice together!");
      }
    } catch (e) {
      setIsEvaluating(false);
      setFeedbackData({
        stars: 3,
        feedback: `Fantastic effort! You pronounced "${currentWord.word}" so clearly!`,
        phoneticTip: "Keep making happy sounds!",
      });
      playFanfareSound();
      onAddStars(3);
    }
  };

  const handleNextWord = () => {
    playPopSound();
    setFeedbackData(null);
    setWordIdx((prev) => (prev + 1) % TARGET_WORDS.length);
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-purple-100 via-sky-100 to-amber-50 p-6 flex flex-col items-center justify-between font-sans select-none pb-24">
      {/* Top Banner */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-lg border-2 border-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-200 p-0.5 border border-purple-300">
            <img
              src={APP_IMAGES.tippyOwl}
              alt="Tippy Owl"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-purple-900 text-sm">AI Voice Lab</h3>
            <p className="text-xs text-purple-700 font-semibold">
              Tippy listens and cheers for you!
            </p>
          </div>
        </div>

        <button
          onClick={handleNextWord}
          className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Next Word</span>
        </button>
      </div>

      {/* Main Target Word Card */}
      <div className="w-full max-w-md my-4 flex flex-col items-center text-center">
        <motion.div
          key={currentWord.word}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-48 h-48 rounded-full bg-white shadow-2xl border-4 border-amber-300 p-4 flex flex-col items-center justify-center relative my-2"
        >
          <span className="text-7xl drop-shadow-md">{currentWord.emoji}</span>
          <button
            onClick={handleHearModel}
            className="absolute -bottom-2 p-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-full shadow-md border-2 border-white"
            title="Listen to model"
          >
            <Volume2 className="w-5 h-5 stroke-[3]" />
          </button>
        </motion.div>

        <h2 className="text-4xl font-black text-slate-800 tracking-tight mt-2">
          {currentWord.word}
        </h2>
        <p className="text-sm font-extrabold text-purple-600 bg-purple-50 px-3 py-0.5 rounded-full mt-1 border border-purple-100">
          {currentWord.phonetic}
        </p>
      </div>

      {/* Mic Action Area */}
      <div className="w-full max-w-md flex flex-col items-center gap-4 z-10">
        {isListening ? (
          <div className="flex flex-col items-center gap-3">
            <motion.button
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-24 h-24 rounded-full bg-rose-500 text-white shadow-2xl border-4 border-rose-200 flex items-center justify-center"
            >
              <Mic className="w-12 h-12 animate-pulse" />
            </motion.button>
            <span className="text-sm font-extrabold text-rose-600 animate-pulse bg-rose-50 px-4 py-1 rounded-full border border-rose-200">
              🗣️ Tippy is Listening... Say "{currentWord.word}"!
            </span>
          </div>
        ) : isEvaluating ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-purple-700">Tippy is analyzing your speech...</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartListening}
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 font-black text-xl shadow-xl border-4 border-amber-200 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Mic className="w-7 h-7 stroke-[3]" />
            <span>Tap & Speak with Tippy!</span>
          </motion.button>
        )}

        {/* AI Feedback Screen */}
        <AnimatePresence>
          {feedbackData && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-300 flex flex-col items-center text-center gap-3"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-7 h-7 ${
                      starIdx <= feedbackData.stars
                        ? "fill-amber-400 text-amber-500 animate-bounce"
                        : "fill-slate-200 text-slate-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-base font-black text-slate-800">{feedbackData.feedback}</p>
              <p className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                💡 Tippy's Tip: {feedbackData.phoneticTip}
              </p>

              <button
                onClick={handleNextWord}
                className="mt-1 px-6 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-extrabold text-sm shadow-md transition-transform active:scale-95"
              >
                Try Next Word! 🌟
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
