import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

const langToSpeech: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  ur: "ur-PK",
};

const STORAGE_KEY = "careergps-narrator-prefs";

function loadPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function savePrefs(prefs: { speed: number; pitch: number; volume: number; voiceName: string; narratorLang: string }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
}

/** Split text into sentence-sized chunks for smooth narration (avoids Chrome's ~15s cutoff bug) */
function chunkText(text: string, maxLen = 200): string[] {
  const cleaned = text
    .replace(/[\n\r\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[•●▪▸►◆★☆✓✔✗✘→←↑↓⬆⬇⬅➡🔥👋●]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Split on sentence boundaries
  const sentences = cleaned.match(/[^.!?…।॥]+[.!?…।॥]?\s*/g) || [cleaned];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (current.length + trimmed.length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? " " : "") + trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Extract visible page text, cleaning out buttons/icons/noise */
function extractPageText(): string {
  const main = document.querySelector("main");
  const root = main || document.querySelector("[data-page-content]") || document.body;

  // Walk the DOM collecting text nodes, skipping nav, buttons, inputs, hidden elements
  const skipTags = new Set(["NAV", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "SVG", "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"]);
  const skipClasses = ["sr-only", "hidden", "narrator-controls"];
  const parts: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text && text.length > 1) parts.push(text);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    if (skipTags.has(el.tagName)) return;
    if (skipClasses.some(cls => el.classList.contains(cls))) return;
    if (el.getAttribute("aria-hidden") === "true") return;
    if (el.offsetParent === null && el.tagName !== "BODY") return; // hidden elements

    for (const child of Array.from(el.childNodes)) walk(child);
  }

  walk(root);
  return parts.join(". ").replace(/\.{2,}/g, ".").replace(/\s{2,}/g, " ");
}

interface NarratorState {
  isNarrating: boolean;
  isPaused: boolean;
  speed: number;
  pitch: number;
  volume: number;
  voiceName: string;
  narratorLang: string;
  availableVoices: SpeechSynthesisVoice[];
}

interface NarratorContextType extends NarratorState {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  testVoice: () => void;
  setSpeed: (s: number) => void;
  setPitch: (p: number) => void;
  setVolume: (v: number) => void;
  setVoiceName: (name: string) => void;
  setNarratorLang: (lang: string) => void;
}

const NarratorContext = createContext<NarratorContextType | null>(null);

/** Pick the best voice: prefer soothing female voices, fallback to English */
function pickVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: string,
  preferredName?: string,
): SpeechSynthesisVoice | null {
  // If user selected a specific voice, honor it
  if (preferredName) {
    const match = voices.find(v => v.name === preferredName);
    if (match) return match;
  }

  const speechLang = langToSpeech[targetLang] || "en-US";
  const langPrefix = speechLang.split("-")[0];

  // Find voices for the target language
  let langVoices = voices.filter(v => v.lang.startsWith(langPrefix));

  // Prefer smooth/soothing voices (Google, Microsoft premium voices tend to be smoother)
  const preferPatterns = [/google/i, /microsoft.*online/i, /samantha/i, /karen/i, /moira/i, /fiona/i, /rishi/i, /veena/i, /lekha/i];
  const preferred = langVoices.find(v => preferPatterns.some(p => p.test(v.name)));
  if (preferred) return preferred;

  // Fallback: any voice for the language
  if (langVoices.length > 0) return langVoices[0];

  // Final fallback: English
  if (langPrefix !== "en") {
    const enVoices = voices.filter(v => v.lang.startsWith("en"));
    const enPreferred = enVoices.find(v => preferPatterns.some(p => p.test(v.name)));
    return enPreferred || enVoices[0] || null;
  }

  return null;
}

export const NarratorProvider = ({ children }: { children: ReactNode }) => {
  const saved = useRef(loadPrefs());
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeedState] = useState(saved.current?.speed ?? 0.9);
  const [pitch, setPitchState] = useState(saved.current?.pitch ?? 1);
  const [volume, setVolumeState] = useState(saved.current?.volume ?? 1);
  const [voiceName, setVoiceNameState] = useState(saved.current?.voiceName ?? "");
  const [narratorLang, setNarratorLangState] = useState(saved.current?.narratorLang ?? "en");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef(window.speechSynthesis);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const stoppedRef = useRef(false);
  const location = useLocation();
  const { lang } = useTranslation();

  const persist = useCallback((overrides: Partial<{ speed: number; pitch: number; volume: number; voiceName: string; narratorLang: string }>) => {
    savePrefs({ speed, pitch, volume, voiceName, narratorLang, ...overrides });
  }, [speed, pitch, volume, voiceName, narratorLang]);

  const setSpeed = useCallback((s: number) => { setSpeedState(s); persist({ speed: s }); }, [persist]);
  const setPitch = useCallback((p: number) => { setPitchState(p); persist({ pitch: p }); }, [persist]);
  const setVolume = useCallback((v: number) => { setVolumeState(v); persist({ volume: v }); }, [persist]);
  const setVoiceName = useCallback((n: string) => { setVoiceNameState(n); persist({ voiceName: n }); }, [persist]);
  const setNarratorLang = useCallback((l: string) => { setNarratorLangState(l); persist({ narratorLang: l }); }, [persist]);

  // Sync narrator language with translation language
  useEffect(() => {
    setNarratorLangState(lang);
    persist({ narratorLang: lang });
  }, [lang, persist]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(synthRef.current.getVoices());
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Stop on route change
  useEffect(() => {
    stoppedRef.current = true;
    synthRef.current.cancel();
    setIsNarrating(false);
    setIsPaused(false);
  }, [location.pathname]);

  const speakChunk = useCallback((text: string, onEnd: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const speechLang = langToSpeech[narratorLang] || "en-US";
    utterance.lang = speechLang;
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = volume;

    const voice = pickVoice(availableVoices, narratorLang, voiceName || undefined);
    if (voice) utterance.voice = voice;

    utterance.onend = onEnd;
    utterance.onerror = onEnd;
    synthRef.current.speak(utterance);
  }, [narratorLang, speed, pitch, volume, voiceName, availableVoices]);

  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;
    const idx = chunkIndexRef.current;
    if (idx >= chunksRef.current.length) {
      setIsNarrating(false);
      setIsPaused(false);
      return;
    }
    speakChunk(chunksRef.current[idx], () => {
      chunkIndexRef.current = idx + 1;
      speakNext();
    });
  }, [speakChunk]);

  const play = useCallback(() => {
    stoppedRef.current = false;
    synthRef.current.cancel();
    const text = extractPageText();
    chunksRef.current = chunkText(text);
    chunkIndexRef.current = 0;
    setIsNarrating(true);
    setIsPaused(false);
    speakNext();
  }, [speakNext]);

  const testVoice = useCallback(() => {
    synthRef.current.cancel();
    const testTexts: Record<string, string> = {
      en: "Hello! I am the CareerGPS narrator. I will read this page for you in a smooth, relaxing voice.",
      hi: "नमस्ते! मैं करियरजीपीएस नैरेटर हूँ। मैं इस पेज को आपके लिए पढ़ूंगा।",
      mr: "नमस्कार! मी करिअरजीपीएस निवेदक आहे. मी हे पान तुमच्यासाठी वाचेन.",
      ta: "வணக்கம்! நான் கரியர்ஜிபிஎஸ் விவரிப்பாளர். இந்த பக்கத்தை நான் உங்களுக்காக படிக்கிறேன்.",
      bn: "নমস্কার! আমি ক্যারিয়ারজিপিএস ন্যারেটর। আমি এই পৃষ্ঠাটি আপনার জন্য পড়ব।",
      ur: "السلام علیکم! میں کیریئرجی پی ایس نریٹر ہوں۔ میں یہ صفحہ آپ کے لیے پڑھوں گا۔",
    };
    const text = testTexts[narratorLang] || testTexts.en;
    speakChunk(text, () => {});
  }, [narratorLang, speakChunk]);

  const pause = useCallback(() => { synthRef.current.pause(); setIsPaused(true); }, []);
  const resume = useCallback(() => { synthRef.current.resume(); setIsPaused(false); }, []);
  const stop = useCallback(() => {
    stoppedRef.current = true;
    synthRef.current.cancel();
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    setIsNarrating(false);
    setIsPaused(false);
  }, []);

  return (
    <NarratorContext.Provider
      value={{
        isNarrating, isPaused, speed, pitch, volume, voiceName, narratorLang, availableVoices,
        play, pause, resume, stop, testVoice,
        setSpeed, setPitch, setVolume, setVoiceName, setNarratorLang,
      }}
    >
      {children}
    </NarratorContext.Provider>
  );
};

export const useNarrator = () => {
  const ctx = useContext(NarratorContext);
  if (!ctx) throw new Error("useNarrator must be used within NarratorProvider");
  return ctx;
};
