import { motion } from "framer-motion";
import { Upload, UserPlus, ArrowLeft, Sparkles, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

const SmartEntry = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "var(--gradient-primary)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "var(--gradient-accent)" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Back to Home")}
      </motion.button>

      <div className="relative z-10 w-full max-w-2xl mx-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-6"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {t("Start Your Career, With or Without a Resume")}
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            {t("Built for students and workers across India")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Upload Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => navigate("/resume")}
              className="w-full group rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 text-left transition-all hover:border-primary/40 hover:shadow-lg"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div
                className="inline-flex items-center justify-center h-14 w-14 rounded-xl mb-5 transition-transform group-hover:scale-110"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {t("Upload Resume")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("Best results with AI-powered analysis")}
              </p>
            </button>
          </motion.div>

          {/* Continue Without Resume - highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => navigate("/no-resume")}
              className="w-full group rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-xl p-8 text-left transition-all hover:border-primary/50 hover:shadow-lg relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              {/* Subtle glow tint */}
              <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center h-14 w-14 rounded-xl mb-5 transition-transform group-hover:scale-110"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <UserPlus className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {t("No Resume? Start Here")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("For Freshers, carpenters, electricians, drivers & more")}
                </p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {[
            { icon: Target, label: "Job Recommendations" },
            { icon: TrendingUp, label: "Skill Gap Insights" },
            { icon: Sparkles, label: "Learning Roadmap" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3 w-3" />
              {t(label)}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SmartEntry;
