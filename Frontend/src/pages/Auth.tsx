import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(isLogin ? "Login" : "Signup", { email, password, name });
  //   navigate("/smart-entry");
  // };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          alert(isLogin ? "Login Success!" : "Signup Success! Now Login.");
          navigate('/smart-entry');
          localStorage.setItem("userEmail", data.user.email)
        } else {
          alert("Signup Success! Please login to continue.");
          setIsLogin(true);
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-5"
          style={{ background: "var(--gradient-primary)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center pt-8 pb-4">
            <motion.img
              src="/logo.png"
              alt="CareerGPS AI"
              className="h-14 w-14 mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />
            <span className="font-display text-xl font-bold text-foreground">
              Career<span className="text-gradient-primary">GPS</span> AI
            </span>
          </div>

          {/* Tab toggle */}
          <div className="relative mx-8 mb-6 flex rounded-xl bg-muted p-1">
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg"
              style={{ background: "var(--gradient-primary)", width: "calc(50% - 4px)" }}
              animate={{ x: isLogin ? 4 : "calc(100% + 4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors ${
                isLogin ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t("Login")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors ${
                !isLogin ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t("Sign Up")}
            </button>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAuth}
                className="flex flex-col gap-5"
              >
                {/* Name field (signup only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">
                        {t("Full Name")}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder={t("Enter your full name")}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 h-11 bg-background/50 border-border focus:border-primary transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Email Address")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-background/50 border-border focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-background/50 border-border focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-primary hover:underline">
                      {t("Forgot password?")}
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" variant="hero" className="w-full h-11 text-sm font-semibold gap-2">
                    {isLogin ? t("Login to Dashboard") : t("Create Account")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">{t("or continue with")}</span>
                  </div>
                </div>

                {/* Social logins */}
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-background/50 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-background/50 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </motion.button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          {t("By continuing, you agree to our Terms of Service and Privacy Policy.")}
        </motion.p>
      </motion.div>
      
    </div>
  );
};

export default Auth;
