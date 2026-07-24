// Web Audio API Synthesizer for lag-free, delightful sound FX and Speech Synthesis

let audioCtx: AudioContext | null = null;
let bgMusicInterval: any = null;
let isBgMusicPlaying = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle Ambient Background Music (Soft Lullaby / Chimes for learning)
export function startSoftBackgroundMusic() {
  if (isBgMusicPlaying) return;
  isBgMusicPlaying = true;

  const notes = [261.63, 329.63, 392.0, 523.25, 440.0, 349.23]; // C4, E4, G4, C5, A4, F4
  let index = 0;

  bgMusicInterval = setInterval(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx || !isBgMusicPlaying) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[index % notes.length], ctx.currentTime);

      // Very low volume (~0.02) so it never overpowers spoken voice
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.8);

      index++;
    } catch (e) {
      // Ignore
    }
  }, 2200);
}

export function stopSoftBackgroundMusic() {
  isBgMusicPlaying = false;
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

export function toggleSoftBackgroundMusic(enabled: boolean) {
  if (enabled) {
    startSoftBackgroundMusic();
  } else {
    stopSoftBackgroundMusic();
  }
}

// 1. Cute Footprint Step Pop
export function playFootprintSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320 + Math.random() * 60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Ignore context blocked
  }
}

// 2. Star Sparkle / Chime
export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
    });
  } catch (e) {
    // Ignore
  }
}

// 3. Cute Button Bounce / Bubble Pop
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore
  }
}

// 4. Victory Level Fanfare
export function playFanfareSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const melody = [
      { freq: 440, duration: 0.12, time: 0 },
      { freq: 554.37, duration: 0.12, time: 0.12 },
      { freq: 659.25, duration: 0.12, time: 0.24 },
      { freq: 880, duration: 0.35, time: 0.36 },
    ];

    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  } catch (e) {
    // Ignore
  }
}

// 5. Instrument Play (Xylophone)
export function playXylophoneNote(noteFreq: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignore
  }
}

// Language code mapping
const LANGUAGE_CODES: Record<string, string> = {
  English: "en-US",
  Urdu: "ur-PK",
  Arabic: "ar-SA",
  Hindi: "hi-IN",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE",
  Turkish: "tr-TR",
  Chinese: "zh-CN",
  Japanese: "ja-JP",
  Korean: "ko-KR",
};

// 6. Speech Synthesis Helper (Friendly preschool teacher voice)
export function speakText(
  text: string,
  options?: {
    lang?: string;
    gender?: "female" | "male";
    speed?: "slow" | "normal";
    onEnd?: () => void;
  }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Friendly preschool teacher speech parameters
  if (options?.gender === "male") {
    utterance.pitch = 0.98; // Gentle, warm male teacher
  } else {
    utterance.pitch = 1.22; // Gentle, cheerful, warm female preschool teacher
  }

  // Rate settings for age-appropriate speaking speed
  if (options?.speed === "slow") {
    utterance.rate = 0.65; // Slow learning mode for clear word-by-word practice
  } else {
    utterance.rate = 0.88; // Normal warm preschool speaking pace
  }

  utterance.volume = 1.0;

  // Language setting
  const langKey = options?.lang || "English";
  const targetLangCode = LANGUAGE_CODES[langKey] || "en-US";
  utterance.lang = targetLangCode;

  // Find best natural voice
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = targetLangCode.toLowerCase().slice(0, 2);

  let matchedVoice = voices.find((v) => {
    const isLangMatch = v.lang.toLowerCase().replace("_", "-").startsWith(langPrefix);
    if (!isLangMatch) return false;

    const name = v.name.toLowerCase();
    if (options?.gender === "male") {
      return name.includes("male") || name.includes("david") || name.includes("george") || name.includes("mark");
    } else {
      return name.includes("female") || name.includes("samantha") || name.includes("zira") || name.includes("google") || name.includes("natural") || name.includes("karen");
    }
  });

  // Fallback to any language matched voice
  if (!matchedVoice) {
    matchedVoice = voices.find((v) =>
      v.lang.toLowerCase().replace("_", "-").startsWith(langPrefix)
    );
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
