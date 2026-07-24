export type AppMode = "splash" | "child" | "parent";

export type ChildTab = "map" | "islamic" | "videos" | "voice" | "doodle" | "story" | "rewards" | "parent_gate";

export interface IslamicSubStep {
  id: string;
  stepNumber: number;
  phrase: string;
  transliteration: string;
  meaning: string;
  audioPhrase: string;
  videoTitle: string;
}

export interface IslamicLesson {
  id: string;
  orderNumber: number;
  title: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  audioPhrase: string;
  tip: string;
  videoTitle: string;
  videoDurationSeconds: number;
  subSteps?: IslamicSubStep[]; // specifically for Kalma step-by-step
  unlocked: boolean;
}

export type SupportedLanguage =
  | "English"
  | "Urdu"
  | "Arabic"
  | "Hindi"
  | "French"
  | "Spanish"
  | "German"
  | "Turkish"
  | "Chinese"
  | "Japanese"
  | "Korean";

export interface VoiceSettings {
  gender: "female" | "male";
  speed: "slow" | "normal";
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number; // 2 to 6
  avatar: string; // emoji or icon
  language: SupportedLanguage;
  voiceSettings: VoiceSettings;
  totalStars: number;
  coins: number;
  currentLevel: number;
  streakDays: number;
  masteredWords: string[];
  badges: Badge[];
  unlockedMilestoneIds?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: "words" | "streak" | "levels" | "stars";
  target: number;
  icon: string;
  rewardStars: number;
  rewardCoins: number;
  tippySpeech: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface VideoSubtitleWord {
  text: string;
  durationMs: number;
  highlight?: boolean;
}

export interface VideoScene {
  id: string;
  sceneTitle: string;
  dialogueText: string;
  subtitleWords: VideoSubtitleWord[];
  tippyAction: "wave" | "point" | "smile" | "lipSync" | "celebrate";
  bgGradient: string;
  mainEmoji: string;
  secondaryEmojis: string[];
  contextIllustration?: string;
}

export interface VideoClip {
  id: string;
  title: string;
  durationSeconds: number;
  category: string;
  targetWord: string;
  emoji: string;
  color: string;
  videoUrl?: string;
  unlocked: boolean;
  isFavorite?: boolean;
  scenes?: VideoScene[];
}

export interface LessonContent {
  id?: string;
  targetWord: string;
  phonetic: string;
  translationOrMeaning?: string;
  emoji: string;
  audioPhrase: string;
  tip: string;
  options?: string[]; // for quiz
  correctOptionIndex?: number;
  videoTitle?: string;
  videoDuration?: string;
}

export type CategoryType =
  | "welcome"
  | "allah"
  | "bismillah"
  | "kalma"
  | "family"
  | "abc"
  | "urdu"
  | "numbers"
  | "colors"
  | "shapes"
  | "animals"
  | "fruits"
  | "vegetables"
  | "body"
  | "habits"
  | "islamic"
  | "videos"
  | "science"
  | "phonics"
  | "emotions";

export interface LevelNode {
  id: number;
  title: string;
  subtitle: string;
  category: CategoryType;
  stars: number; // 0 to 3
  unlocked: boolean;
  color: string;
  icon: string;
  xOffset?: number; // path alignment percentage
  lessons: LessonContent[];
}

export interface StoryPage {
  text: string;
  illustrationPrompt: string;
  soundEffect?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  moral: string;
  pages: StoryPage[];
  theme: string;
  ageGroup: string;
  coverImage?: string;
  language?: SupportedLanguage;
}

export interface SafariCard {
  id: string;
  letter: string;
  word: string;
  phonetic: string;
  category: "family" | "greetings" | "animals" | "fruits" | "objects" | "colors";
  emoji: string;
  bgGradient: string;
}

export interface SongItem {
  id: string;
  title: string;
  lyrics: string;
  tempo: number;
  color: string;
  emoji: string;
}

export interface ParentInsight {
  summary: string;
  strengths: string[];
  suggestedOfflineActivities: string[];
  developmentalMilestone: string;
}

