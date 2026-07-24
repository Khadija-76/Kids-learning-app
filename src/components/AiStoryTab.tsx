import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Volume2, ArrowLeft, ArrowRight, Wand2, Star, Play } from "lucide-react";
import { StoryItem, ChildProfile, SupportedLanguage, VoiceSettings } from "../types";
import { DEFAULT_STORIES } from "../data/mockData";
import { APP_IMAGES } from "../assets/images";
import { playPopSound, playSparkleSound, playFanfareSound, speakText, stopSpeaking } from "../utils/audio";

interface AiStoryTabProps {
  childProfile?: ChildProfile;
  onAddStars: (stars: number) => void;
}

export const AiStoryTab: React.FC<AiStoryTabProps> = ({ childProfile, onAddStars }) => {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [pageIdx, setPageIdx] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // AI Story Prompt Form
  const [topic, setTopic] = useState<string>("Friendly Baby Elephant & Owl");
  const [theme, setTheme] = useState<string>("Rainbow Hills");
  const [selectedWords, setSelectedWords] = useState<string[]>(
    childProfile?.masteredWords.slice(0, 3) || ["Mama", "Bismillah", "Apple"]
  );

  const lang: SupportedLanguage = childProfile?.language || "English";
  const voice: VoiceSettings = childProfile?.voiceSettings || { gender: "female", speed: "normal" };

  const handleReadStory = (st: StoryItem) => {
    playPopSound();
    setSelectedStory(st);
    setPageIdx(0);
    speakText(`${st.title}! Page 1. ${st.pages[0].text}`, {
      lang,
      gender: voice.gender,
      speed: voice.speed,
    });
  };

  const handlePageChange = (newIdx: number) => {
    if (!selectedStory) return;
    playPopSound();
    setPageIdx(newIdx);
    speakText(`Page ${newIdx + 1}. ${selectedStory.pages[newIdx].text}`, {
      lang,
      gender: voice.gender,
      speed: voice.speed,
    });

    if (newIdx === selectedStory.pages.length - 1) {
      playFanfareSound();
      onAddStars(3);
    }
  };

  const toggleWord = (word: string) => {
    playPopSound();
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleGenerateAiStory = async () => {
    playPopSound();
    setIsGenerating(true);
    speakText(`Tippy is crafting a magic story using your learned words!`, {
      lang,
      gender: voice.gender,
    });

    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `${topic} featuring ${selectedWords.join(", ")}`,
          theme,
          ageGroup: `${childProfile?.age || 3}-${(childProfile?.age || 3) + 1}`,
        }),
      });
      const data = await res.json();
      setIsGenerating(false);

      const newStory: StoryItem = {
        id: `ai-st-${Date.now()}`,
        title: data.title || `The Adventures of ${selectedWords[0] || "Tippy"}`,
        moral: data.moral || "Learning together brings warmth and joy!",
        theme,
        ageGroup: `${childProfile?.age || 3}`,
        coverImage: APP_IMAGES.storyMagic,
        pages: data.pages || [
          {
            text: `Once upon a time, ${selectedWords.join(" and ")} created a bright rainbow in ${theme}!`,
            illustrationPrompt: "Friendly cartoon mascot on green hills",
          },
        ],
      };

      setStories((prev) => [newStory, ...prev]);
      handleReadStory(newStory);
    } catch (err) {
      setIsGenerating(false);
      handleReadStory(stories[0]);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-sky-100 via-purple-100 to-amber-50 p-4 flex flex-col items-center justify-between font-sans select-none pb-24 max-w-xl mx-auto">
      {/* Top Banner */}
      <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-purple-200 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 p-0.5 border border-purple-300">
            <img src={APP_IMAGES.tippyOwl} alt="Tippy" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h3 className="font-extrabold text-purple-900 text-sm">AI Bedtime Storybook</h3>
            <p className="text-[11px] text-purple-700 font-semibold">
              Language: {lang} • Stories with Learned Words!
            </p>
          </div>
        </div>

        {selectedStory && (
          <button
            onClick={() => {
              playPopSound();
              stopSpeaking();
              setSelectedStory(null);
            }}
            className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Library</span>
          </button>
        )}
      </div>

      {/* Story Player or Story Library */}
      {selectedStory ? (
        <div className="w-full flex-1 flex flex-col justify-between my-2">
          {/* Active Story Card */}
          <div className="bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 flex flex-col items-center text-center gap-4 flex-1 justify-between">
            {/* Page Illustration */}
            <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-inner border-2 border-sky-100 bg-sky-50">
              <img
                src={selectedStory.coverImage || APP_IMAGES.storyMagic}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  speakText(`Page ${pageIdx + 1}. ${selectedStory.pages[pageIdx].text}`, {
                    lang,
                    gender: voice.gender,
                    speed: voice.speed,
                  })
                }
                className="absolute bottom-3 right-3 p-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-full shadow-lg border-2 border-white cursor-pointer active:scale-95"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Narration Text */}
            <div className="my-2">
              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Page {pageIdx + 1} of {selectedStory.pages.length}
              </span>
              <p className="text-base font-extrabold text-slate-800 leading-relaxed mt-3 px-2">
                "{selectedStory.pages[pageIdx].text}"
              </p>
            </div>

            {/* Moral Lesson Footer if last page */}
            {pageIdx === selectedStory.pages.length - 1 && (
              <div className="w-full bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Moral: {selectedStory.moral}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="w-full flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handlePageChange(pageIdx - 1)}
                disabled={pageIdx === 0}
                className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center gap-1 ${
                  pageIdx === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200 active:scale-95 cursor-pointer"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => handlePageChange(pageIdx + 1)}
                disabled={pageIdx === selectedStory.pages.length - 1}
                className={`py-3 px-5 rounded-2xl font-extrabold text-sm flex items-center gap-1 shadow-md ${
                  pageIdx === selectedStory.pages.length - 1
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-400 hover:bg-amber-500 text-amber-950 active:scale-95 cursor-pointer"
                }`}
              >
                <span>{pageIdx === selectedStory.pages.length - 1 ? "Completed! 🎉" : "Next Page"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Library & AI Creator */
        <div className="w-full flex flex-col gap-4 my-2">
          {/* AI Generator Box */}
          <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-300 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <span>Generate AI Story from Today's Words</span>
            </div>

            {/* Mastered Words Selector */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                Tap Words to Include in Story:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(childProfile?.masteredWords || ["Mama", "Bismillah", "Apple", "Cat"]).map((w) => {
                  const isSel = selectedWords.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => toggleWord(w)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
                        isSel
                          ? "bg-purple-600 border-purple-700 text-white shadow-sm"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {isSel ? `✓ ${w}` : `+ ${w}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">
                  Main Character
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                >
                  <option value="Baby Elephant & Tippy Owl">Baby Elephant & Tippy Owl 🐘</option>
                  <option value="Friendly Dragon">Baby Dragon 🐲</option>
                  <option value="Cute Unicorn">Rainbow Unicorn 🦄</option>
                  <option value="Smiling Lion Cub">Lion Cub 🦁</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">
                  Story Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                >
                  <option value="Cloud Kingdom">Cloud Kingdom ☁️</option>
                  <option value="Jungle Safari">Jungle Safari 🌴</option>
                  <option value="Rainbow Meadow">Rainbow Meadow 🌈</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAiStory}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-sm shadow-md hover:scale-102 active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Tippy is Writing Your Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Magic AI Story</span>
                </>
              )}
            </button>
          </div>

          {/* Story List */}
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-slate-800 text-sm px-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Available Storybooks ({stories.length})</span>
            </h4>

            {stories.map((st) => (
              <div
                key={st.id}
                onClick={() => handleReadStory(st)}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border border-sky-100 hover:border-amber-300 transition-all cursor-pointer flex items-center gap-3 active:scale-98"
              >
                <img
                  src={st.coverImage || APP_IMAGES.storyMagic}
                  alt={st.title}
                  className="w-16 h-16 rounded-xl object-cover border border-amber-200 shrink-0"
                />
                <div className="flex-1">
                  <h5 className="font-extrabold text-slate-800 text-sm">{st.title}</h5>
                  <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 inline-block mt-1">
                    Theme: {st.theme}
                  </span>
                </div>
                <div className="p-2 rounded-full bg-amber-400 text-amber-950 font-bold">
                  <Play className="w-4 h-4 fill-amber-950" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
