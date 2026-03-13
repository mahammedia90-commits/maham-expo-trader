/**
 * AIAssistant — AI-powered chat assistant for traders
 * Design: Obsidian Glass chat interface with gold accents
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, MessageSquare, Lightbulb, HelpCircle, FileText, MapPin } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  contentAr: string;
  contentEn: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    contentAr: "مرحباً بك في المساعد الذكي لمهام إكسبو! أنا هنا لمساعدتك في كل ما يتعلق بحجوزاتك، عقودك، وخدماتك التشغيلية. كيف يمكنني مساعدتك اليوم؟",
    contentEn: "Welcome to Maham Expo AI Assistant! I'm here to help you with your bookings, contracts, and operational services. How can I help you today?",
    time: "10:00",
  },
];

const suggestions = [
  { textAr: "ما هي الوحدات المتاحة حالياً؟", textEn: "What units are currently available?", icon: MapPin },
  { textAr: "أريد معرفة حالة حجوزاتي", textEn: "I want to check my booking status", icon: FileText },
  { textAr: "ما هي أفضل منطقة للأغذية والمشروبات؟", textEn: "What's the best zone for F&B?", icon: Lightbulb },
  { textAr: "كيف أقدم طلب تصريح تشغيل؟", textEn: "How do I apply for an operating permit?", icon: HelpCircle },
];

const aiResponses: Record<string, { ar: string; en: string }> = {
  "default": {
    ar: "شكراً لسؤالك! بناءً على تحليل بياناتك، أنصحك بالتواصل مع فريق الدعم للحصول على معلومات أكثر تفصيلاً. يمكنني أيضاً مساعدتك في استعراض الخيارات المتاحة.",
    en: "Thank you for your question! Based on your data analysis, I recommend contacting the support team for more detailed information. I can also help you explore available options."
  },
  "units": {
    ar: "حالياً لدينا ٦ وحدات متاحة للحجز:\n• بوث رئيسي A1 (٦×٦ م) — ٤٥,٠٠٠ ريال\n• بوث A3 (٣×٣ م) — ١٨,٠٠٠ ريال\n• محل تجاري B2 (٦×٤ م) — ٤٢,٠٠٠ ريال\n• كشك B3 (٢×٢ م) — ١٢,٠٠٠ ريال\n• جناح C2 (٨×٦ م) — ٨٥,٠٠٠ ريال\n• منطقة F&B D1 (٥×٥ م) — ٥٥,٠٠٠ ريال\n\nأنصحك بالمنطقة A إذا كنت تبحث عن أعلى حركة زوار.",
    en: "Currently we have 6 units available for booking:\n• Main Booth A1 (6×6m) — 45,000 ر.س\n• Booth A3 (3×3m) — 18,000 ر.س\n• Shop B2 (6×4m) — 42,000 ر.س\n• Kiosk B3 (2×2m) — 12,000 ر.س\n• Wing C2 (8×6m) — 85,000 ر.س\n• F&B Area D1 (5×5m) — 55,000 ر.س\n\nI recommend Zone A for highest foot traffic."
  },
  "bookings": {
    ar: "لديك حالياً ٣ حجوزات نشطة:\n✅ BK-2025-001 — بوث A1 (مؤكد)\n⏳ BK-2025-002 — محل B2 (بانتظار الدفع)\n✅ BK-2025-003 — جناح VIP C1 (مؤكد)\n\nالحجز BK-2025-002 يحتاج لسداد العربون خلال ٤٨ ساعة.",
    en: "You currently have 3 active bookings:\n✅ BK-2025-001 — Booth A1 (Confirmed)\n⏳ BK-2025-002 — Shop B2 (Pending Payment)\n✅ BK-2025-003 — VIP Wing C1 (Confirmed)\n\nBooking BK-2025-002 requires deposit payment within 48 hours."
  },
  "food": {
    ar: "بناءً على تحليل بيانات الزوار، المنطقة D هي الأفضل للأغذية والمشروبات:\n• أعلى حركة مرور في أوقات الذروة (١٢-٢ ظهراً و ٧-٩ مساءً)\n• قربها من مناطق الترفيه والمسرح الرئيسي\n• متوسط إنفاق الزائر: ٤٥ ريال\n\nالوحدة D1 (٥×٥ م) متاحة بسعر ٥٥,٠٠٠ ريال — موقع استراتيجي ممتاز.",
    en: "Based on visitor data analysis, Zone D is best for F&B:\n• Highest foot traffic during peak hours (12-2 PM & 7-9 PM)\n• Close to entertainment areas and main stage\n• Average visitor spend: 45 ر.س\n\nUnit D1 (5×5m) is available at 55,000 ر.س — excellent strategic location."
  },
  "permit": {
    ar: "لتقديم طلب تصريح تشغيل:\n١. اذهب إلى قسم 'العمليات' من القائمة الجانبية\n٢. اضغط على 'طلب خدمة'\n٣. اختر 'تصريح تشغيل'\n٤. أرفق المستندات المطلوبة (سجل تجاري، رخصة بلدية)\n٥. سيتم مراجعة الطلب خلال ٣-٥ أيام عمل\n\nالخدمة مجانية ومشمولة في عقد الإيجار.",
    en: "To apply for an operating permit:\n1. Go to 'Operations' section from the sidebar\n2. Click 'Request Service'\n3. Select 'Operating Permit'\n4. Attach required documents (CR, municipal license)\n5. Review takes 3-5 business days\n\nThis service is free and included in your lease contract."
  },
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAIResponse = (query: string): { ar: string; en: string } => {
    const q = query.toLowerCase();
    if (q.includes("وحد") || q.includes("متاح") || q.includes("unit") || q.includes("available")) return aiResponses.units;
    if (q.includes("حجز") || q.includes("حالة") || q.includes("booking") || q.includes("status")) return aiResponses.bookings;
    if (q.includes("أغذ") || q.includes("مشروب") || q.includes("food") || q.includes("f&b")) return aiResponses.food;
    if (q.includes("تصريح") || q.includes("permit")) return aiResponses.permit;
    return aiResponses.default;
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      contentAr: msg,
      contentEn: msg,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        contentAr: response.ar,
        contentEn: response.en,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
          <Bot size={20} className="text-[var(--btn-gold-text)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold t-primary">المساعد الذكي</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI Smart Assistant — Powered by MAHAM AI</p>
        </div>
        <div className="mr-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse" />
          <span className="text-[10px] text-[var(--status-green)]/70">متصل | Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                m.role === "user"
                  ? "bg-gold-subtle border border-[#C5A55A]/15"
                  : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              }`}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="t-gold" />
                    <span className="text-[10px] t-gold/70 font-['Inter']">MAHAM AI</span>
                  </div>
                )}
                <p className="text-sm t-primary whitespace-pre-line leading-relaxed">{m.contentAr}</p>
                {m.role === "assistant" && (
                  <p className="text-[11px] t-muted font-['Inter'] mt-2 whitespace-pre-line">{m.contentEn}</p>
                )}
                <p className="text-[9px] t-muted font-['Inter'] mt-2 text-left">{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
            <div className="bg-[var(--glass-bg)] rounded-2xl px-4 py-3 border border-[var(--glass-border)]">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="t-gold animate-pulse" />
                <span className="text-xs t-tertiary">جاري التفكير...</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.textAr)}
              className="glass-card rounded-xl p-3 text-right hover:bg-[var(--glass-bg)] hover:border-[var(--gold-border)] transition-all"
            >
              <s.icon size={14} className="t-gold mb-1.5" />
              <p className="text-[11px] t-secondary">{s.textAr}</p>
              <p className="text-[9px] t-muted font-['Inter']">{s.textEn}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب سؤالك هنا... | Type your question..."
          className="flex-1 bg-transparent text-sm t-primary placeholder:t-muted outline-none"
          dir="rtl"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={16} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
