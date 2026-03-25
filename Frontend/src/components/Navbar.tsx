import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import NavbarLanguageDropdown from "@/components/NavbarLanguageDropdown";
import NavbarReadPage from "@/components/NavbarReadPage";
import NarratorSettings from "@/components/NarratorSettings";
import { useTranslation } from "@/hooks/use-translation";
import { Users } from "lucide-react"; // Icon ke liye

const navItems = [
  { labelKey: "Features", href: "#features" },
  { labelKey: "How It Works", href: "#how-it-works" },
  { labelKey: "Dashboard", href: "#dashboard" },
  { labelKey: "Impact", href: "#impact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <img src="/logo.png" alt="CareerGPS AI" className="h-9 w-9 rounded-lg object-contain" />
          <span className="font-display text-xl font-bold text-foreground notranslate">
            Career<span className="text-gradient-primary">GPS</span> AI
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.labelKey} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t(item.labelKey)}
            </a>
          ))}
          <NavbarLanguageDropdown />
          <NavbarReadPage />
          <NarratorSettings />
          <ThemeToggle />
          <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
            {t("Get Started")}
          </Button>
        </div>
        <div className="flex gap-4">
        {/* COMMUNITY BUTTON */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/community")}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Community</span>
        </Button>
      </div>

        <div className="flex items-center gap-1 md:hidden">
          <NavbarLanguageDropdown />
          <NavbarReadPage />
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navItems.map((item) => (
                <a key={item.labelKey} href={item.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {t(item.labelKey)}
                </a>
              ))}
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                {t("Get Started")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
