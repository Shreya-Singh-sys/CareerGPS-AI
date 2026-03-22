import { 
  LayoutDashboard, Target, Briefcase, UserCircle, 
  ChevronLeft, ChevronRight, Flame, Menu, X, Rocket, FileText, Home, Mic
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { titleKey: "Resume Analysis", path: "/resume", icon: FileText },
  { titleKey: "Skill Analyzer & Roadmap", path: "/skill-gap", icon: Target },
  { titleKey: "Jobs & Market Intel", path: "/jobs", icon: Briefcase },
  { titleKey: "Career Simulator", path: "/career-simulator", icon: Rocket },
  { titleKey: "Mock Interview", path: "/mock-interview", icon: Mic },
  { titleKey: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { titleKey: "My Profile", path: "/profile", icon: UserCircle },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between gap-2 px-4 py-5 border-b border-border">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="CareerGPS" className="h-8 w-8 rounded-lg object-contain flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-lg font-bold text-foreground whitespace-nowrap">
              Career<span className="text-gradient-primary">GPS</span>
            </motion.span>
          )}
        </button>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {(!collapsed || isMobile) && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15">
          <p className="text-xs font-semibold text-primary">{t("Demo Mode")}</p>
          <p className="text-[11px] text-muted-foreground">{t("Demo User")} · {t("Data Analyst")}</p>
        </div>
      )}

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
              {(!collapsed || isMobile) && <span className="truncate max-w-[160px]">{t(item.titleKey)}</span>}
              {active && <motion.div layoutId={isMobile ? "sidebar-active-mobile" : "sidebar-active"} className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 mb-3 space-y-3">
        {(!collapsed || isMobile) && (
          <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              <span className="text-sm font-semibold">{t("7-Day Streak! 🔥")}</span>
            </div>
            <p className="text-xs mt-1 opacity-80">{t("Keep learning to maintain it!")}</p>
          </div>
        )}
        
        <button onClick={() => navigate("/")}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 ${collapsed && !isMobile ? "justify-center" : ""}`}>
          <Home className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>{t("Home")}</span>}
        </button>

        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      {!isMobile && (
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      )}
    </>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-card border border-border shadow-lg hover:bg-muted transition-colors">
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-[260px] flex flex-col border-r border-border bg-card z-50 md:hidden shadow-2xl">
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside animate={{ width: collapsed ? 72 : 260 }} transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 h-screen hidden md:flex flex-col border-r border-border bg-card overflow-hidden z-40">
        <SidebarContent />
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
