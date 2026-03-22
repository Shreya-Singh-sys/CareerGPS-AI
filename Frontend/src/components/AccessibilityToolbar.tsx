import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Volume2, VolumeX, Mic, MicOff, Accessibility, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation, languages } from "@/hooks/use-translation";

const voiceCommands: Record<string, string> = {
  "show job matches": "/jobs",
  "open learning roadmap": "/skill-gap",
  "analyze my resume": "/resume",
  "go to dashboard": "/dashboard",
  "open career simulator": "/career-simulator",
  "go home": "/",
  "open profile": "/profile",
  "open jobs": "/jobs",
};

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    synthRef.current.cancel();
    setIsNarrating(false);
  }, [location.pathname]);

  const handleNarrate = useCallback(() => {
    if (isNarrating) {
      synthRef.current.cancel();
      setIsNarrating(false);
      return;
    }
    const text = document.querySelector("main")?.innerText || document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 3000));
    utterance.lang = lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : lang === "ta" ? "ta-IN" : "bn-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    synthRef.current.cancel();
    synthRef.current.speak(utterance);
    setIsNarrating(true);
  }, [isNarrating, lang]);

  const handleVoiceCommand = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      for (const [command, path] of Object.entries(voiceCommands)) {
        if (transcript.includes(command)) { navigate(path); break; }
      }
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, navigate]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl min-w-[200px]"
          >
            <div className="flex items-center justify-between px-2 pb-1 border-b border-border">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Accessibility className="h-3.5 w-3.5 text-primary" />
                {t("Accessibility")}
              </span>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span>{t("Language")}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {languages.find((l) => l.code === lang)?.label}
                </span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex flex-col gap-0.5 pl-9 pr-2 pb-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                          className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${lang === l.code ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleNarrate}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isNarrating ? "bg-destructive/10 text-destructive" : "text-foreground hover:bg-muted"}`}
            >
              {isNarrating ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-primary" />}
              <span>{isNarrating ? t("Stop") : t("Read Page")}</span>
            </button>

            <button
              onClick={handleVoiceCommand}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isListening ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
            >
              {isListening ? (
                <>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Mic className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span>{t("Listening...")}</span>
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4 text-primary" />
                  <span>{t("Voice Command")}</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        aria-label="Accessibility tools"
      >
        <Accessibility className="h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default AccessibilityToolbar;
