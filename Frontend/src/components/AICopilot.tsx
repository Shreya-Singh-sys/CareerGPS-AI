import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const mockResponses: Record<string, string> = {
  default: `I can help you with career planning, skill analysis, and job matching. Here are some things you can ask me:

• "What should I learn next?"
• "What skills do I need for Data Scientist?"
• "How can I improve my resume?"
• "What career paths match my skills?"
• "Show me trending skills in tech"`,

  learn: `Improving **Advanced SQL** and **Power BI** will raise your readiness for Data Analyst roles from **72% to about 90%**.

**Recommended learning path:**
1. Month 1 → Advanced SQL (window functions, CTEs, optimization)
2. Month 2 → Power BI (dashboards, DAX, data modeling)
3. Month 3 → Data Visualization Projects
4. Month 4 → Portfolio Building

Your current roadmap progress is **30%** — keep going!`,

  skills: `You are about **72% ready** for Data Analyst roles.

**Recommended skills to improve:**
• Advanced SQL — *Critical*
• Power BI — *Critical*
• Data Warehousing — *Moderate*
• A/B Testing — *Optional*

Improving these could raise your readiness to **~90%**.`,

  resume: `Here are some tips to improve your resume:

1. **Add quantifiable achievements** — Use numbers to demonstrate impact
2. **Include relevant keywords** — Match job descriptions for better ATS scores
3. **Keep it concise** — Aim for 1-2 pages maximum
4. **Use action verbs** — Start bullet points with strong verbs

Your current ATS score is **74/100**. Following these tips could boost it to **88+**.

**Resume Insights:**
• Strong analytical foundation with Python and Excel
• Needs improvement in advanced SQL and BI tools`,

  career: `Based on your current skills (Python, SQL, Excel, Pandas, Data Viz, Statistics), here are recommended career paths:

1. **Data Analyst** — 82% match (Flipkart, ₹9 LPA)
   - Key skills needed: Advanced SQL, Power BI

2. **Product Data Analyst** — 78% match (Swiggy, ₹10 LPA)
   - Key skills needed: A/B Testing, Product Metrics

3. **BI Analyst** — 76% match (Amazon, ₹11 LPA)
   - Key skills needed: Power BI, Data Modeling

4. **Junior Data Scientist** — 71% match (Zomato, ₹12 LPA)
   - Key skills needed: Machine Learning, Advanced Statistics`,

  trending: `**Top Skills in Demand (2026):**

📈 **High Demand:**
• Python — 95% demand index
• Machine Learning — 88% demand index
• Cloud Computing — 82% demand index
• SQL — 80% demand index
• Data Engineering — 76% demand index

📊 **Emerging:**
• Cybersecurity
• Prompt Engineering
• AI Safety & Ethics`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("learn next") || lower.includes("what should") || lower.includes("recommend")) return mockResponses.learn;
  if (lower.includes("skill") || lower.includes("ready") || lower.includes("gap")) return mockResponses.skills;
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("ats")) return mockResponses.resume;
  if (lower.includes("career") || lower.includes("path") || lower.includes("role") || lower.includes("job")) return mockResponses.career;
  if (lower.includes("trend") || lower.includes("demand") || lower.includes("market")) return mockResponses.trending;
  return mockResponses.default;
}

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hello! I'm your **AI Career Copilot**. Ask me about skills, career paths, resume tips, or job market trends." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Try backend first, fall back to mock
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userSkills: [], careerGoal: "" }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.response }]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Backend unavailable — use mock
    }

    // Mock fallback with simulated delay
    setTimeout(() => {
      const response = getMockResponse(text);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input]);

  const clearChat = () => {
    setMessages([
      { id: "welcome", role: "assistant", content: "Hello! I'm your **AI Career Copilot**. Ask me about skills, career paths, resume tips, or job market trends." },
    ]);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-20 z-50 h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        aria-label="Open AI Career Copilot"
      >
        <Sparkles className="h-5 w-5" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="AI Career Copilot chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">AI Career Copilot</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Clear conversation">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Close copilot">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content.split("\n").map((line, i) => {
                      // Simple markdown bold rendering
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {parts.map((part, j) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={j}>{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 h-9 text-sm"
                  disabled={isTyping}
                  aria-label="Chat message input"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isTyping || !input.trim()} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICopilot;
