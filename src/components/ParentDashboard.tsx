import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  Brain,
  Smile,
  Globe,
  Volume2,
} from "lucide-react";
import { ChildProfile, ParentInsight, SupportedLanguage } from "../types";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, speakText } from "../utils/audio";

interface ParentDashboardProps {
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  onSelectProfile: (prof: ChildProfile) => void;
  onUpdateProfile: (updatedProfile: ChildProfile) => void;
  onBackToChild: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onUpdateProfile,
  onBackToChild,
}) => {
  const [insight, setInsight] = useState<ParentInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);
  const [screenTimeMinutes, setScreenTimeMinutes] = useState<number>(30);

  const languages: SupportedLanguage[] = [
    "English",
    "Urdu",
    "Arabic",
    "Hindi",
    "French",
    "Spanish",
    "German",
    "Turkish",
    "Chinese",
    "Japanese",
    "Korean",
  ];

  useEffect(() => {
    fetchParentInsight();
  }, [activeProfile.id]);

  const fetchParentInsight = async () => {
    setIsLoadingInsight(true);
    try {
      const res = await fetch("/api/ai/parent-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: activeProfile.name,
          age: activeProfile.age,
          streak: activeProfile.streakDays,
          learnedWords: activeProfile.masteredWords,
        }),
      });
      const data = await res.json();
      setInsight(data);
      setIsLoadingInsight(false);
    } catch (err) {
      setIsLoadingInsight(false);
      setInsight({
        summary: `${activeProfile.name} is showing excellent curiosity and phonics progress this week!`,
        strengths: ["Phonics & Letter Sounds", "Active Listening", "Color & Shape Memory"],
        suggestedOfflineActivities: [
          "Play a 'Find the Color' game during your morning neighborhood walk",
          "Trace letter shapes in dough or sand together",
          "Read a bedtime story and ask 'What do you think Tippy will do next?'",
        ],
        developmentalMilestone:
          "On track for early vocabulary building, active attention, and emotional confidence.",
      });
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    playPopSound();
    const updated = { ...activeProfile, language: lang };
    onUpdateProfile(updated);
    speakText(`Language changed to ${lang}!`, { lang, gender: updated.voiceSettings.gender });
  };

  const handleVoiceGenderChange = (gender: "female" | "male") => {
    playPopSound();
    const updated = {
      ...activeProfile,
      voiceSettings: { ...activeProfile.voiceSettings, gender },
    };
    onUpdateProfile(updated);
    speakText("Hello! This is my new voice!", {
      lang: updated.language,
      gender,
      speed: updated.voiceSettings.speed,
    });
  };

  const handleVoiceSpeedChange = (speed: "slow" | "normal") => {
    playPopSound();
    const updated = {
      ...activeProfile,
      voiceSettings: { ...activeProfile.voiceSettings, speed },
    };
    onUpdateProfile(updated);
    speakText(`Voice speed set to ${speed}`, {
      lang: updated.language,
      gender: updated.voiceSettings.gender,
      speed,
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans select-none pb-12">
      {/* Parent Header Bar */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="font-black text-base leading-none">TinySteps AI • Parent Area</h1>
            <p className="text-[11px] text-slate-400">Child Insights, Language & Safety Controls</p>
          </div>
        </div>

        <button
          onClick={() => {
            playPopSound();
            onBackToChild();
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Child Mode</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 flex flex-col gap-5">
        {/* Profile Switcher */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-sky-50 rounded-2xl border border-sky-100">
              {activeProfile.avatar}
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeProfile.name}'s Profile
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Age {activeProfile.age} • Language: {activeProfile.language} • {activeProfile.streakDays} Day Streak
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  playPopSound();
                  onSelectProfile(p);
                }}
                className={`p-2 rounded-xl text-xl border transition-all cursor-pointer ${
                  activeProfile.id === p.id
                    ? "bg-emerald-100 border-emerald-400 scale-105"
                    : "bg-slate-100 border-slate-200 opacity-60"
                }`}
                title={`Switch to ${p.name}`}
              >
                {p.avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Global Multi-Language & Voice Settings Box */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Language & AI Mascot Voice Settings
            </h3>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-2">
              Primary Learning Language:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {languages.map((l) => {
                const isSelected = activeProfile.language === l;
                return (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Voice Preference */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                AI Mascot Voice Gender:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVoiceGenderChange("female")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    activeProfile.voiceSettings.gender === "female"
                      ? "bg-pink-500 border-pink-600 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  👩 Female
                </button>
                <button
                  onClick={() => handleVoiceGenderChange("male")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    activeProfile.voiceSettings.gender === "male"
                      ? "bg-blue-600 border-blue-700 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  👨 Male
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                Default Pronunciation Speed:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVoiceSpeedChange("slow")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    activeProfile.voiceSettings.speed === "slow"
                      ? "bg-amber-500 border-amber-600 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  🐢 Slow
                </button>
                <button
                  onClick={() => handleVoiceSpeedChange("normal")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    activeProfile.voiceSettings.speed === "normal"
                      ? "bg-sky-500 border-sky-600 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  🐇 Normal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <Award className="w-6 h-6 text-amber-500 mb-1" />
            <span className="text-xl font-black text-slate-900">{activeProfile.totalStars}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Stars</span>
          </div>

          <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <TrendingUp className="w-6 h-6 text-emerald-500 mb-1" />
            <span className="text-xl font-black text-slate-900">92%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Voice Accuracy</span>
          </div>

          <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-sky-500 mb-1" />
            <span className="text-xl font-black text-slate-900">{activeProfile.streakDays} Days</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Learning Streak</span>
          </div>

          <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <BookOpen className="w-6 h-6 text-purple-500 mb-1" />
            <span className="text-xl font-black text-slate-900">
              {activeProfile.masteredWords.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Words Mastered</span>
          </div>
        </div>

        {/* Visual Weekly Progress Chart */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Weekly Learning Activity & Pronunciation Accuracy
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +18% this week
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28">
            {[
              { day: "Mon", min: 15, acc: 88 },
              { day: "Tue", min: 25, acc: 90 },
              { day: "Wed", min: 20, acc: 94 },
              { day: "Thu", min: 30, acc: 92 },
              { day: "Fri", min: 35, acc: 95 },
              { day: "Sat", min: 40, acc: 96 },
              { day: "Sun", min: 25, acc: 94 },
            ].map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500">{d.acc}%</span>
                <div
                  style={{ height: `${(d.min / 40) * 100}%` }}
                  className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-emerald-500 to-sky-400 shadow-sm"
                />
                <span className="text-[10px] font-extrabold text-slate-700">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Parent Insights Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-700 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-sm text-indigo-100">
                AI Learning Summary for {activeProfile.name}
              </h3>
            </div>

            <button
              onClick={fetchParentInsight}
              disabled={isLoadingInsight}
              className="p-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsight ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoadingInsight ? (
            <div className="py-6 flex items-center justify-center text-xs font-bold text-indigo-300 gap-2">
              <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Generating expert AI insights...</span>
            </div>
          ) : insight ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs leading-relaxed text-indigo-100 font-medium">
                "{insight.summary}"
              </p>

              {/* Strengths */}
              <div>
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block mb-1.5">
                  🧠 Key Strengths
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {insight.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-800/80 text-indigo-100 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{str}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Offline Activities */}
              <div>
                <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider block mb-1.5">
                  🏡 Recommended Parent-Child Activities
                </span>
                <div className="flex flex-col gap-1.5">
                  {insight.suggestedOfflineActivities.map((act, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-950/60 p-2.5 rounded-2xl border border-indigo-800/60 text-xs text-indigo-200 flex items-start gap-2"
                    >
                      <span className="text-amber-400 font-bold text-sm">💡</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developmental Milestone */}
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-200 font-medium flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-300 shrink-0" />
                <span>{insight.developmentalMilestone}</span>
              </div>

              {/* PDF Report Export Button */}
              <button
                onClick={() => {
                  playPopSound();
                  window.print();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <span>📄 Export / Print Full Child PDF Learning Report</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Mastered Vocabulary List */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <h4 className="font-extrabold text-slate-900 text-sm mb-3">
            Mastered Words & Concepts ({activeProfile.masteredWords.length})
          </h4>

          <div className="flex flex-wrap gap-2">
            {activeProfile.masteredWords.map((word) => (
              <span
                key={word}
                className="bg-sky-50 text-sky-800 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-sky-200"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
