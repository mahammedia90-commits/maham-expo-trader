/**
 * AIAssistant — Advanced AI-powered assistant for traders
 * All text uses t() for multi-language support
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Bot, Send, Sparkles, MessageSquare, Lightbulb, HelpCircle,
  FileText, MapPin, TrendingUp, Shield, CreditCard, Building2,
  Calendar, Star, Users, BarChart3, Zap, Brain, Target,
  CheckCircle, AlertTriangle, Clock, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { events2026, eventStats, type ExpoEvent } from "@/data/events2026";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  actions?: { label: string; path: string }[];
  analysis?: { label: string; value: string; color: string }[];
}

export default function AIAssistant() {
  const { t, lang, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState<"general" | "analysis" | "recommendation">("general");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { trader, canBook, bookings, payments, contracts, kycData } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const name = trader?.name || t("common.trader");
    const kycStatus = trader?.kycStatus === "verified" ? t("ai.verified") : t("ai.notVerified");
    const bookingCount = bookings.length;
    const pendingPayments = bookings.filter(b => b.paymentStatus === "unpaid" || b.paymentStatus === "deposit_paid").length;

    setMessages([{
      id: 1, role: "assistant",
      content: `${t("ai.welcomeMsg")} ${name}! ${t("ai.welcomeIntro")}\n\n📊 ${t("ai.accountSummary")}:\n• ${t("ai.verificationStatus")}: ${kycStatus}\n• ${t("nav.bookings")}: ${bookingCount}\n• ${t("ai.pendingPayments")}: ${pendingPayments}\n• ${t("nav.contracts")}: ${contracts.length}\n• ${t("ai.availableEvents")}: ${eventStats.openEvents}\n\n${t("ai.howCanIHelp")}`,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    }]);
  }, [trader, bookings, contracts, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // EVENTS
    if (q.includes("فعالي") || q.includes("معرض") || q.includes("event") || q.includes("expo") || q.includes("متاح") || q.includes("活动") || q.includes("мероприят") || q.includes("etkinlik") || q.includes("رویداد")) {
      const openEvents = events2026.filter(e => e.status === "open" || e.status === "closing_soon");
      const closingSoon = events2026.filter(e => e.status === "closing_soon");
      const featured = events2026.filter(e => e.featured);
      const eName = (e: ExpoEvent) => lang === "ar" || lang === "fa" ? e.nameAr : e.nameEn;
      let eventList = openEvents.slice(0, 5).map(e => `• ${eName(e)} — ${e.city} | ${e.availableUnits} ${t("ai.unitsAvail")} | ${e.priceRange} ${t("common.sar")}`).join("\n");

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `📊 ${t("ai.eventsAnalysis")}:\n\n🟢 ${t("ai.openForBooking")}: ${openEvents.length}\n🟡 ${t("ai.closingSoon")}: ${closingSoon.length}\n⭐ ${t("ai.featured")}: ${featured.length}\n📍 ${t("ai.totalAvailUnits")}: ${eventStats.availableUnits.toLocaleString()}\n\n${t("ai.topEvents")}:\n${eventList}\n\n💡 ${t("ai.aiRecommendation")}: ${closingSoon.length > 0 ? `${closingSoon.length} ${t("ai.closingSoonAdvice")}` : t("ai.allAvailable")}`,
        actions: [
          { label: t("nav.browseExpos"), path: "/expos" },
          { label: t("ai.viewMap"), path: "/map" },
        ],
      };
    }

    // BOOKINGS
    if (q.includes("حجز") || q.includes("حجوز") || q.includes("booking") || q.includes("status") || q.includes("预订") || q.includes("бронир") || q.includes("rezerv") || q.includes("رزرو")) {
      if (bookings.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          content: `📋 ${t("ai.noBookings")}\n\n💡 ${t("ai.aiRecommendation")}: ${t("ai.startBrowsing")} ${eventStats.openEvents} ${t("ai.openEventsCount")}`,
          actions: [{ label: t("nav.browseExpos"), path: "/expos" }],
        };
      }
      const pending = bookings.filter(b => b.paymentStatus === "unpaid");
      const confirmed = bookings.filter(b => b.status === "confirmed");
      const totalValue = bookings.reduce((a, b) => a + b.price, 0);

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `📊 ${t("ai.bookingsAnalysis")}:\n\n📋 ${t("common.total")}: ${bookings.length}\n✅ ${t("ai.confirmed")}: ${confirmed.length}\n⏳ ${t("ai.pendingPayment")}: ${pending.length}\n💰 ${t("ai.totalValue")}: ${totalValue.toLocaleString()} ${t("common.sar")}\n\n${pending.length > 0 ? `⚠️ ${t("ai.pendingAlert")}: ${pending.length} ${t("ai.pendingAdvice")}` : `✅ ${t("ai.allConfirmed")}`}`,
        actions: [
          { label: t("nav.bookings"), path: "/bookings" },
          ...(pending.length > 0 ? [{ label: t("ai.completePayment"), path: "/payments" }] : []),
        ],
        analysis: [
          { label: t("common.total"), value: String(bookings.length), color: "var(--status-blue)" },
          { label: t("ai.confirmed"), value: String(confirmed.length), color: "var(--status-green)" },
          { label: t("ai.pending"), value: String(pending.length), color: "var(--status-yellow)" },
          { label: t("ai.totalValue"), value: `${(totalValue / 1000).toFixed(0)}K`, color: "var(--gold-accent)" },
        ],
      };
    }

    // PAYMENTS
    if (q.includes("دفع") || q.includes("مدفوع") || q.includes("سداد") || q.includes("payment") || q.includes("pay") || q.includes("付款") || q.includes("оплат") || q.includes("ödeme") || q.includes("پرداخت")) {
      const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
      const pendingBookings = bookings.filter(b => b.paymentStatus !== "fully_paid");
      const totalRemaining = pendingBookings.reduce((a, b) => a + b.remainingAmount, 0);

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `💳 ${t("ai.paymentAnalysis")}:\n\n✅ ${t("ai.totalPaid")}: ${totalPaid.toLocaleString()} ${t("common.sar")}\n⏳ ${t("ai.remaining")}: ${totalRemaining.toLocaleString()} ${t("common.sar")}\n📋 ${t("ai.transactions")}: ${payments.length}\n\n${pendingBookings.length > 0 ? `⚠️ ${pendingBookings.length} ${t("ai.needsPayment")}\n\n💡 ${t("ai.contractAfterPayment")}` : `✅ ${t("ai.allPaymentsComplete")}`}`,
        actions: [{ label: t("nav.payments"), path: "/payments" }],
      };
    }

    // CONTRACTS
    if (q.includes("عقد") || q.includes("عقود") || q.includes("contract") || q.includes("合同") || q.includes("договор") || q.includes("sözleşme") || q.includes("قرارداد")) {
      if (contracts.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          content: `📄 ${t("ai.noContracts")}\n\n💡 ${t("ai.contractSteps")}:\n1. ${t("ai.step1KYC")}\n2. ${t("ai.step2Book")}\n3. ${t("ai.step3Pay")}\n\n${t("ai.contractAutoSend")}`,
          actions: [{ label: t("nav.contracts"), path: "/contracts" }],
        };
      }
      const eName = (c: any) => lang === "ar" || lang === "fa" ? c.expoNameAr : c.expoNameEn;
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `📄 ${t("ai.contractsIssued")}: ${contracts.length}\n\n${contracts.map(c => `• ${c.id} — ${eName(c)}\n  ${t("ai.booth")}: ${c.boothNumber} | ${t("ai.totalValue")}: ${c.totalValue.toLocaleString()} ${t("common.sar")}\n  ${t("common.status")}: ${c.status === "signed" ? t("ai.signed") + " ✅" : t("ai.awaitingSign") + " ⏳"}`).join("\n\n")}`,
        actions: [{ label: t("nav.contracts"), path: "/contracts" }],
      };
    }

    // KYC
    if (q.includes("توثيق") || q.includes("kyc") || q.includes("تحقق") || q.includes("verif") || q.includes("认证") || q.includes("верификац") || q.includes("doğrulama") || q.includes("احراز")) {
      const isVerified = trader?.kycStatus === "verified";
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: isVerified
          ? `✅ ${t("ai.accountVerified")}!\n\n📋 ${t("ai.registeredData")}:\n• ${t("kyc.fullName")}: ${kycData?.fullName || trader?.name || "—"}\n• ${t("kyc.companyName")}: ${kycData?.companyName || trader?.companyName || "—"}\n• ${t("kyc.crNumber")}: ${kycData?.crNumber || "—"}\n• ${t("kyc.vatNumber")}: ${kycData?.vatNumber || "—"}\n\n${t("ai.canBookNow")}`
          : `⚠️ ${t("ai.accountNotVerified")}!\n\n${t("ai.verifyNeeded")}:\n1. ✅ ${t("kyc.personalInfo")}\n2. ✅ ${t("kyc.companyInfo")}\n3. ✅ ${t("kyc.bankInfo")}\n4. ✅ ${t("kyc.documents")}\n5. ✅ ${t("kyc.declaration")}\n\n💡 ${t("ai.noBookWithoutKYC")}`,
        actions: isVerified ? [{ label: t("nav.browseExpos"), path: "/expos" }] : [{ label: t("nav.kyc"), path: "/kyc" }],
      };
    }

    // RECOMMENDATIONS
    if (q.includes("نصيح") || q.includes("توصي") || q.includes("أفضل") || q.includes("recommend") || q.includes("best") || q.includes("suggest") || q.includes("推荐") || q.includes("рекоменд") || q.includes("öneri") || q.includes("پیشنهاد")) {
      const recommended = events2026.filter(e => e.featured).slice(0, 4);
      const eName = (e: ExpoEvent) => lang === "ar" || lang === "fa" ? e.nameAr : e.nameEn;
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `🤖 ${t("ai.aiRecommendations")}:\n\n${recommended.map((e, i) => `${i + 1}. ${eName(e)}\n   📍 ${e.venue} | 📅 ${e.dateStart}\n   👥 ${e.footfall} | ⭐ ${e.rating}\n   💰 ${e.priceRange} ${t("common.sar")} | 🏢 ${e.availableUnits} ${t("ai.unitsAvail")}`).join("\n\n")}\n\n💡 ${t("ai.chooseClosest")}`,
        actions: [{ label: t("nav.browseExpos"), path: "/expos" }],
      };
    }

    // HELP
    if (q.includes("مساعد") || q.includes("help") || q.includes("دعم") || q.includes("support") || q.includes("帮助") || q.includes("помощ") || q.includes("yardım") || q.includes("کمک")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `🤝 ${t("ai.helpCenter")}:\n\n${t("ai.canHelpWith")}:\n\n1. 🏢 ${t("ai.helpEvents")}\n2. 📋 ${t("ai.helpBookings")}\n3. 💳 ${t("ai.helpPayments")}\n4. 📄 ${t("ai.helpContracts")}\n5. 🔐 ${t("ai.helpKYC")}\n6. 🤖 ${t("ai.helpRecommendations")}\n7. 📊 ${t("ai.helpAnalytics")}\n8. 🔧 ${t("ai.helpOperations")}`,
        actions: [{ label: t("nav.help"), path: "/help" }],
      };
    }

    // DEFAULT
    return {
      id: Date.now() + 1, role: "assistant", time,
      content: `${t("ai.thankYou")}\n\n${!canBook ? `⚠️ ${t("ai.needsVerification")}\n\n` : ""}📌 ${t("ai.usefulInfo")}:\n• ${eventStats.openEvents} ${t("ai.openEventsCount")}\n• ${eventStats.availableUnits.toLocaleString()} ${t("ai.unitsAvail")}\n• ${bookings.filter(b => b.paymentStatus !== "fully_paid").length} ${t("ai.needsPayment")}\n\n${t("ai.askAbout")}:\n• ${t("ai.helpEvents")}\n• ${t("ai.helpBookings")}\n• ${t("ai.helpRecommendations")}\n• ${t("ai.helpContracts")}`,
      actions: [
        { label: t("nav.browseExpos"), path: "/expos" },
        { label: t("nav.bookings"), path: "/bookings" },
      ],
    };
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = {
      id: Date.now(), role: "user", content: msg,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(msg);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const suggestions = [
    { text: t("ai.suggestEvents"), icon: Building2 },
    { text: t("ai.suggestBookings"), icon: FileText },
    { text: t("ai.suggestRecommend"), icon: Target },
    { text: t("ai.suggestPayments"), icon: BarChart3 },
    { text: t("ai.suggestKYC"), icon: Shield },
    { text: t("ai.suggestAnalytics"), icon: Brain },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
          <Bot size={20} className="text-[var(--btn-gold-text)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold t-primary">{t("ai.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI Smart Assistant — Powered by MAHAM AI</p>
        </div>
        <div className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-1.5`}>
          <div className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse" />
          <span className="text-[10px] text-[var(--status-green)]/70">{t("ai.online")}</span>
        </div>
      </div>

      {/* AI Mode Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "general" as const, label: t("ai.modeGeneral"), icon: MessageSquare },
          { id: "analysis" as const, label: t("ai.modeAnalysis"), icon: BarChart3 },
          { id: "recommendation" as const, label: t("ai.modeRecommend"), icon: Target },
        ].map(mode => (
          <button key={mode.id} onClick={() => setAiMode(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap ${aiMode === mode.id ? "btn-gold" : "glass-card t-tertiary"}`}>
            <mode.icon size={12} />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
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
                <p className="text-sm t-primary whitespace-pre-line leading-relaxed">{m.content}</p>

                {m.analysis && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {m.analysis.map((a, i) => (
                      <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-sm font-bold font-['Inter']" style={{ color: a.color }}>{a.value}</p>
                        <p className="text-[8px] t-muted">{a.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {m.actions && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {m.actions.map((a, i) => (
                      <button key={i} onClick={() => navigate(a.path)}
                        className="px-3 py-1.5 rounded-lg text-[10px] bg-gold-subtle t-gold border border-[#C5A55A]/20 hover:bg-[#C5A55A]/20 transition-colors flex items-center gap-1">
                        {isRTL ? <ArrowLeft size={10} /> : null}
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[9px] t-muted font-['Inter'] mt-2">{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
            <div className="bg-[var(--glass-bg)] rounded-2xl px-4 py-3 border border-[var(--glass-border)]">
              <div className="flex items-center gap-1.5">
                <Brain size={12} className="t-gold animate-pulse" />
                <span className="text-xs t-tertiary">{t("ai.analyzing")}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSend(s.text)}
              className="glass-card rounded-xl p-3 hover:bg-[var(--glass-bg)] hover:border-[var(--gold-border)] transition-all text-start">
              <s.icon size={14} className="t-gold mb-1.5" />
              <p className="text-[11px] t-secondary">{s.text}</p>
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
          placeholder={t("ai.inputPlaceholder")}
          className="flex-1 bg-transparent text-sm t-primary placeholder:t-muted outline-none"
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button onClick={() => handleSend()} disabled={!input.trim()}
          className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">
          <Send size={16} className={isRTL ? "rotate-180" : ""} />
        </button>
      </div>
    </div>
  );
}
