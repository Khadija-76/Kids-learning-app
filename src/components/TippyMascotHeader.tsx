import React from "react";
import { Star, Flame, Award, Volume2, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { ChildProfile } from "../types";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, speakText } from "../utils/audio";

interface TippyMascotHeaderProps {
  profile: ChildProfile;
  onOpenParentGate: () => void;
  onOpenMascotTip: () => void;
}

export const TippyMascotHeader: React.FC<TippyMascotHeaderProps> = ({
  profile,
  onOpenParentGate,
  onOpenMascotTip,
}) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5 shadow-sm border-b border-sky-100 flex items-center justify-between">
      {/* Child Avatar & Name */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-400 p-0.5 shadow-md flex items-center justify-center text-2xl">
            <span className="bg-white/90 w-full h-full rounded-[14px] flex items-center justify-center">
              {profile.avatar}
            </span>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-sm">
            Lv.{profile.currentLevel}
          </span>
        </div>

        <div>
          <h2 className="font-extrabold text-slate-800 text-base leading-tight flex items-center gap-1">
            {profile.name}
            <span className="text-xs font-bold text-sky-500 bg-sky-50 px-1.5 py-0.5 rounded-full border border-sky-100">
              Age {profile.age}
            </span>
          </h2>
          {/* Daily Streak */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{profile.streakDays} Day Streak!</span>
          </div>
        </div>
      </div>

      {/* Stats (Stars & Coins) */}
      <div className="flex items-center gap-2">
        <div
          id="header-star-count"
          className="flex items-center gap-1 bg-amber-100/90 text-amber-800 font-extrabold px-3 py-1 rounded-full text-xs border border-amber-200 shadow-sm transition-all duration-300 transform-gpu"
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
          <span className="tabular-nums">{profile.totalStars}</span>
        </div>

        <div className="flex items-center gap-1 bg-purple-100/90 text-purple-800 font-extrabold px-3 py-1 rounded-full text-xs border border-purple-200 shadow-sm">
          <span className="text-sm">🪙</span>
          <span>{profile.coins}</span>
        </div>

        {/* Tippy Quick Mascot Button */}
        <button
          onClick={() => {
            playPopSound();
            speakText(`Hi ${profile.name}! Tippy is here to help you learn and grow!`);
            onOpenMascotTip();
          }}
          className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 via-sky-300 to-purple-300 p-0.5 shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
          title="Talk with Tippy the Owl!"
        >
          <img
            src={APP_IMAGES.tippyOwl}
            alt="Tippy the Owl Mascot"
            className="w-full h-full object-cover rounded-full"
          />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
        </button>

        {/* Parent Lock Gate Button */}
        <button
          onClick={() => {
            playPopSound();
            onOpenParentGate();
          }}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs font-bold"
          title="Parents Dashboard Area"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Parents</span>
        </button>
      </div>
    </div>
  );
};
