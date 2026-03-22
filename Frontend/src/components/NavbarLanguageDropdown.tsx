import { Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation, languages } from "@/hooks/use-translation";
import { useCallback } from "react";

// Google Translate language codes mapping
const gtLangMap: Record<string, string> = {
  en: "en",
  hi: "hi",
  mr: "mr",
  ta: "ta",
  bn: "bn",
  ur: "ur",
};

function triggerGoogleTranslate(langCode: string) {
  const gtCode = gtLangMap[langCode] || "en";

  // Find the Google Translate select element and change it
  const frame = document.querySelector<HTMLIFrameElement>(".goog-te-menu-frame");
  if (frame?.contentDocument) {
    const items = frame.contentDocument.querySelectorAll<HTMLAnchorElement>(".goog-te-menu2-item a");
    for (const item of items) {
      if (item.textContent?.toLowerCase().includes(gtCode)) {
        item.click();
        return;
      }
    }
  }

  // Fallback: use the select combo
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = gtCode;
    select.dispatchEvent(new Event("change"));
  }
}

const NavbarLanguageDropdown = () => {
  const { lang, setLang } = useTranslation();

  const handleLangChange = useCallback((code: typeof lang) => {
    setLang(code);

    if (code === "en") {
      // Reset to original — remove Google Translate
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = "en";
        select.dispatchEvent(new Event("change"));
      }
      // Also try the cookie approach
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
      // Wait briefly then reload translate to English
      setTimeout(() => {
        const s = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (s) { s.value = "en"; s.dispatchEvent(new Event("change")); }
      }, 100);
    } else {
      // Small delay to let Google Translate widget initialize
      setTimeout(() => triggerGoogleTranslate(code), 300);
    }
  }, [setLang]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors notranslate"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-2 notranslate" align="end">
        <div className="flex flex-col gap-0.5">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLangChange(l.code)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                lang === l.code
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NavbarLanguageDropdown;
