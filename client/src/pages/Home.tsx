/**
 * Home — Smart Trader Portal Landing Page
 * Fully localized with useLanguage() — supports 6 languages
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  ArrowLeft, ArrowRight, Shield, Map, FileText, BarChart3, Bot, Zap, Sun, Moon,
  CheckCircle, Star, Users, Building2, CreditCard, Lock, Clock,
  TrendingUp, Globe, Award, Utensils, Coffee, ShoppingBag, Landmark,
  Cpu, PartyPopper, MapPin, Phone, Mail, ChevronDown, Sparkles,
  Eye, MessageSquare, Bell, CalendarCheck, Layers, Target, Rocket, Check
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-hero-bg-JwfvFA4x7SXBrMwAN4Sjpa.webp";
const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

const fadeUp = { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang, isRTL, dir } = useLanguage();
  const isDark = theme === "dark";
  const isArabicLike = ["ar", "fa"].includes(lang);
  const bg = isDark ? "#0A0A12" : "#FAFAF5";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const stats = [
    { value: "500+", label: t("home.stat.exhibitors") },
    { value: "50+", label: t("home.stat.events") },
    { value: "10K+", label: t("home.stat.units") },
    { value: "98%", label: t("home.stat.satisfaction") },
  ];

  const sectors = [
    { icon: Utensils, name: t("home.sector.restaurants") },
    { icon: Coffee, name: t("home.sector.cafes") },
    { icon: ShoppingBag, name: t("home.sector.retail") },
    { icon: Landmark, name: t("home.sector.realEstate") },
    { icon: Cpu, name: t("home.sector.technology") },
    { icon: PartyPopper, name: t("home.sector.entertainment") },
  ];

  const howItWorks = [
    { step: "01", title: t("home.step.browse"), icon: Building2 },
    { step: "02", title: t("home.step.select"), icon: MapPin },
    { step: "03", title: t("home.step.book"), icon: CreditCard },
    { step: "04", title: t("home.step.sign"), icon: FileText },
    { step: "05", title: t("home.step.launch"), icon: Rocket },
  ];

  const features = [
    { icon: Map, title: t("home.feature.map") },
    { icon: Lock, title: t("home.feature.booking") },
    { icon: Shield, title: t("home.feature.protection") },
    { icon: FileText, title: t("home.feature.contracts") },
    { icon: CreditCard, title: t("home.feature.payment") },
    { icon: Bot, title: t("home.feature.ai") },
  ];

  const faqs = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: isArabicLike ? "\u0645\u0627 \u0647\u064a \u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u0625\u0644\u063a\u0627\u0621 \u0648\u0627\u0644\u0627\u0633\u062a\u0631\u062f\u0627\u062f\u061f" : "What is the cancellation and refund policy?", a: isArabicLike ? "\u0627\u0644\u0639\u0631\u0628\u0648\u0646 (5%) \u063a\u064a\u0631 \u0645\u0633\u062a\u0631\u062f. \u0627\u0644\u0625\u0644\u063a\u0627\u0621 \u0642\u0628\u0644 15 \u064a\u0648\u0645\u0627\u064b \u0623\u0648 \u0623\u0643\u062b\u0631 \u0645\u0646 \u0627\u0644\u0645\u0639\u0631\u0636: \u0627\u0633\u062a\u0631\u062f\u0627\u062f 50% \u0645\u0646 \u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u0645\u062a\u0628\u0642\u064a. \u0627\u0644\u0625\u0644\u063a\u0627\u0621 \u0642\u0628\u0644 \u0623\u0642\u0644 \u0645\u0646 15 \u064a\u0648\u0645\u0627\u064b: \u0644\u0627 \u064a\u0648\u062c\u062f \u0627\u0633\u062a\u0631\u062f\u0627\u062f." : "The deposit (5%) is non-refundable. Cancellation 15+ days before the exhibition: 50% refund of remaining amount. Less than 15 days: no refund." },
    { q: isArabicLike ? "\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0648\u0642\u0639 \u0627\u0644\u062c\u0646\u0627\u062d \u0628\u0646\u0641\u0633\u064a\u061f" : "Can I choose my booth location?", a: isArabicLike ? "\u0646\u0639\u0645\u060c \u0627\u0644\u0645\u0646\u0635\u0629 \u062a\u0648\u0641\u0631 \u062e\u0631\u064a\u0637\u0629 \u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0644\u0643\u0644 \u0645\u0639\u0631\u0636 \u062a\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u062c\u0646\u062d\u0629 \u0627\u0644\u0645\u062a\u0627\u062d\u0629 \u0645\u0639 \u0623\u0633\u0639\u0627\u0631\u0647\u0627 \u0648\u0645\u0633\u0627\u062d\u0627\u062a\u0647\u0627. \u064a\u0645\u0643\u0646\u0643 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0648\u062a\u062b\u0628\u064a\u062a\u0647 \u0644\u0645\u062f\u0629 30 \u062f\u0642\u064a\u0642\u0629." : "Yes, the platform provides an interactive map for each exhibition showing all available booths with prices and sizes. You can choose your preferred location and hold it for 30 minutes." },
    { q: isArabicLike ? "\u0645\u0627 \u0647\u064a \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0627\u0644\u0645\u062a\u0627\u062d\u0629\u061f" : "What operational services are available?", a: isArabicLike ? "\u0646\u0648\u0641\u0631 \u062e\u062f\u0645\u0627\u062a \u0634\u0627\u0645\u0644\u0629: \u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0628\u0648\u062b\u060c \u0643\u0647\u0631\u0628\u0627\u0621 \u0648\u062a\u0643\u064a\u064a\u0641\u060c \u0625\u0646\u062a\u0631\u0646\u062a \u0648\u0627\u062a\u0635\u0627\u0644\u0627\u062a\u060c \u0644\u0648\u062c\u0633\u062a\u064a\u0627\u062a \u0648\u0646\u0642\u0644\u060c \u0637\u0628\u0627\u0639\u0629 \u0648\u0644\u0627\u0641\u062a\u0627\u062a\u060c \u0623\u0645\u0646 \u0648\u0633\u0644\u0627\u0645\u0629\u060c \u062a\u0646\u0638\u064a\u0641 \u0648\u0635\u064a\u0627\u0646\u0629\u060c \u0648\u062a\u0642\u0646\u064a\u0629 \u0648\u0634\u0627\u0634\u0627\u062a. \u062c\u0645\u064a\u0639\u0647\u0627 \u062a\u064f\u0637\u0644\u0628 \u0648\u062a\u064f\u062f\u0641\u0639 \u0639\u0628\u0631 \u0627\u0644\u0645\u0646\u0635\u0629." : "We provide comprehensive services: booth design, electricity & AC, internet & telecom, logistics & transport, printing & signage, security, cleaning & maintenance, and tech & AV. All ordered and paid through the platform." },
    { q: isArabicLike ? "\u0647\u0644 \u064a\u0648\u062c\u062f \u0639\u0642\u062f \u0631\u0633\u0645\u064a\u061f" : "Is there an official contract?", a: isArabicLike ? "\u0646\u0639\u0645\u060c \u064a\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0639\u0642\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0631\u0633\u0645\u064a \u064a\u062a\u0636\u0645\u0646 \u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u0646\u0648\u062f \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629. \u064a\u062c\u0628 \u0639\u0644\u0649 \u0627\u0644\u062a\u0627\u062c\u0631 \u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0639\u0642\u062f \u0648\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u064a\u0647 \u0642\u0628\u0644 \u0627\u0644\u062f\u0641\u0639. \u064a\u0645\u0643\u0646 \u062a\u062d\u0645\u064a\u0644 \u0646\u0633\u062e\u0629 PDF \u0641\u064a \u0623\u064a \u0648\u0642\u062a." : "Yes, an official electronic contract is generated with all financial and legal terms. The trader must review and accept the contract before payment. A PDF copy can be downloaded anytime." },
    { q: isArabicLike ? "\u0643\u064a\u0641 \u0623\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062f\u0639\u0645\u061f" : "How do I contact support?", a: isArabicLike ? "\u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f: info@mahamexpo.sa \u0623\u0648 rent@mahamexpo.sa\u060c \u0623\u0648 \u0627\u0644\u0647\u0627\u062a\u0641: +966535555900 \u0623\u0648 +966534778899\u060c \u0623\u0648 \u0639\u0628\u0631 \u0627\u0644\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0630\u0643\u064a \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0646\u0635\u0629." : "Contact us via email: info@mahamexpo.sa or rent@mahamexpo.sa, phone: +966535555900 or +966534778899, or through the AI assistant inside the platform." },
  ];

  const whyMaham = [
    { icon: Shield, title: isArabicLike ? "\u062d\u0645\u0627\u064a\u0629 \u0643\u0627\u0645\u0644\u0629" : "Full Protection", desc: isArabicLike ? "\u0639\u0642\u0648\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0645\u0639\u062a\u0645\u062f\u0629 + \u0628\u0646\u062f \u0639\u062f\u0645 \u0627\u0644\u0627\u0644\u062a\u0641\u0627\u0641" : "Certified e-contracts + anti-circumvention clause" },
    { icon: Globe, title: isArabicLike ? "\u0648\u0635\u0648\u0644 \u0639\u0627\u0644\u0645\u064a" : "Global Reach", desc: isArabicLike ? "\u0645\u0639\u0627\u0631\u0636 \u0641\u064a 6 \u062f\u0648\u0644 + \u062f\u0639\u0645 6 \u0644\u063a\u0627\u062a" : "Exhibitions in 6 countries + 6 language support" },
    { icon: Zap, title: isArabicLike ? "\u062d\u062c\u0632 \u0641\u0648\u0631\u064a" : "Instant Booking", desc: isArabicLike ? "\u0627\u062e\u062a\u0631 \u062c\u0646\u0627\u062d\u0643 \u0645\u0646 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0648\u0627\u062d\u062c\u0632 \u0641\u064a \u062f\u0642\u0627\u0626\u0642" : "Choose from map & book in minutes" },
    { icon: BarChart3, title: isArabicLike ? "\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0630\u0643\u064a\u0629" : "Smart Analytics", desc: isArabicLike ? "\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 \u0645\u062a\u0642\u062f\u0645\u0629 \u0645\u0639 \u0645\u0633\u0627\u0639\u062f AI" : "Advanced dashboard with AI assistant" },
    { icon: CreditCard, title: isArabicLike ? "\u062f\u0641\u0639 \u0645\u0631\u0646" : "Flexible Payment", desc: isArabicLike ? "\u0639\u0631\u0628\u0648\u0646 5% + \u0623\u0642\u0633\u0627\u0637 \u0645\u0631\u064a\u062d\u0629" : "5% deposit + comfortable installments" },
    { icon: Target, title: isArabicLike ? "\u062e\u062f\u0645\u0627\u062a \u0645\u062a\u0643\u0627\u0645\u0644\u0629" : "Integrated Services", desc: isArabicLike ? "\u062a\u0635\u0645\u064a\u0645 + \u0643\u0647\u0631\u0628\u0627\u0621 + \u0644\u0648\u062c\u0633\u062a\u064a\u0627\u062a + \u0637\u0628\u0627\u0639\u0629" : "Design + electricity + logistics + printing" },
  ];

  const successStories = [
    { name: isArabicLike ? "\u0634\u0631\u0643\u0629 \u0627\u0644\u0646\u062e\u0628\u0629 \u0644\u0644\u0623\u063a\u0630\u064a\u0629" : "Al Nukhba Foods Co.", result: isArabicLike ? "\u0632\u064a\u0627\u062f\u0629 \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a 340%" : "340% sales increase", desc: isArabicLike ? "\u0634\u0627\u0631\u0643\u062a \u0641\u064a 3 \u0645\u0639\u0627\u0631\u0636 \u0639\u0628\u0631 \u0627\u0644\u0645\u0646\u0635\u0629 \u0648\u062d\u0642\u0642\u062a \u0646\u0645\u0648\u0627\u064b \u0627\u0633\u062a\u062b\u0646\u0627\u0626\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a \u0648\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062c\u062f\u062f" : "Participated in 3 expos via the platform and achieved exceptional growth in sales and new clients", icon: TrendingUp },
    { name: isArabicLike ? "\u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u0644\u0648\u0627\u062d\u0629 \u0627\u0644\u062a\u0642\u0646\u064a\u0629" : "Oasis Tech Group", result: isArabicLike ? "47 \u0639\u0642\u062f \u062c\u062f\u064a\u062f" : "47 new contracts", desc: isArabicLike ? "\u0627\u0633\u062a\u062e\u062f\u0645\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0630\u0643\u064a \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0623\u0641\u0636\u0644 \u0645\u0648\u0642\u0639 \u0648\u062d\u0642\u0642\u062a 47 \u0639\u0642\u062f\u0627\u064b \u062c\u062f\u064a\u062f\u0627\u064b \u0641\u064a \u0645\u0639\u0631\u0636 \u0648\u0627\u062d\u062f" : "Used AI assistant to choose the best location and secured 47 new contracts in a single expo", icon: Award },
    { name: isArabicLike ? "\u0645\u0642\u0647\u0649 \u0627\u0644\u0631\u064a\u062d\u0627\u0646\u0629" : "Al Rayhana Cafe", result: isArabicLike ? "\u0639\u0627\u0626\u062f \u0627\u0633\u062a\u062b\u0645\u0627\u0631 850%" : "850% ROI", desc: isArabicLike ? "\u0628\u062f\u0623\u062a \u0628\u062c\u0646\u0627\u062d \u0635\u063a\u064a\u0631 \u0648\u0627\u0644\u0622\u0646 \u062a\u062d\u062c\u0632 3 \u0623\u062c\u0646\u062d\u0629 \u0641\u064a \u0643\u0644 \u0645\u0639\u0631\u0636 \u0628\u0641\u0636\u0644 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0627\u0633\u062a\u062b\u0646\u0627\u0626\u064a\u0629" : "Started with a small booth, now books 3 booths per expo thanks to exceptional results", icon: Rocket },
  ];

  const testimonials = [
    { name: t("home.testimonial.name1"), role: t("home.testimonial.role1"), text: t("home.testimonial.text1") },
    { name: t("home.testimonial.name2"), role: t("home.testimonial.role2"), text: t("home.testimonial.text2") },
    { name: t("home.testimonial.name3"), role: t("home.testimonial.role3"), text: t("home.testimonial.text3") },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: bg }} dir={dir}>
      {/* Top bar: Theme + Language */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full"
          style={{
            color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)",
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            border: "1px solid var(--glass-border)"
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="p-3 rounded-full flex items-center gap-2"
            style={{
              color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)",
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              border: "1px solid var(--glass-border)"
            }}
          >
            <Globe size={18} />
            <span className="text-xs hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.nativeName}</span>
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setLangOpen(false)} />
              <div className="absolute top-full mt-2 left-0 z-[101] rounded-xl overflow-hidden shadow-2xl min-w-[200px]"
                style={{ background: isDark ? "rgba(15,15,25,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(40px)", border: "1px solid var(--glass-border)" }}>
                <div className="p-2">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${lang === l.code ? "bg-gold-subtle" : ""}`}
                      style={lang === l.code ? { border: "1px solid var(--gold-border)" } : { border: "1px solid transparent" }}>
                      <span className="text-base">{l.flag}</span>
                      <span className="text-xs font-medium flex-1 text-start" style={{ color: lang === l.code ? "var(--gold-light)" : isDark ? "var(--text-secondary)" : "#333" }}>{l.nativeName}</span>
                      {lang === l.code && <Check size={14} style={{ color: "var(--gold-accent)" }} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" style={{ opacity: isDark ? 0.35 : 0.15 }} />
          <div className="absolute inset-0" style={{
            background: isDark
              ? `linear-gradient(to bottom, rgba(10,10,18,0.5), rgba(10,10,18,0.3), ${bg})`
              : `linear-gradient(to bottom, rgba(250,250,245,0.6), rgba(250,250,245,0.4), ${bg})`
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img src={LOGO_URL} alt="Maham Expo" className="h-16 sm:h-20 mx-auto mb-6 object-contain" style={{ filter: isDark ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
              <span className="text-gold-gradient">{t("home.title")}</span>
            </h1>
            <p className="text-sm sm:text-base max-w-3xl mx-auto mb-4 leading-relaxed" style={{ color: isDark ? 'var(--text-tertiary)' : '#2D2D48' }}>
              {t("home.desc")}
            </p>
            <p className="text-xs max-w-2xl mx-auto mb-8" style={{ color: isDark ? 'var(--text-muted)' : '#4A4A65' }}>
              {t("home.desc2")}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <button className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                {t("home.login")}
                <ArrowIcon size={18} />
              </button>
            </Link>
            <Link href="/login">
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0">
                <Building2 size={16} />
                {t("home.browse")}
              </button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gold-gradient font-['Inter']">{s.value}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: isDark ? 'var(--text-secondary)' : '#1A1A30' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: "var(--gold-accent)", opacity: 0.6 }} />
          </div>
        </motion.div>
      </section>

      {/* ═══════ SECTORS SECTION ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {t("home.sectionTitle.sectors")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sectors.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 text-center group hover:border-[var(--gold-border)] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <s.icon size={24} className="t-gold" />
                </div>
                <h3 className="text-sm font-bold t-primary">{s.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {t("home.sectionTitle.howItWorks")}
            </h2>
          </motion.div>
          <div className="space-y-4">
            {howItWorks.map((h, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gold-subtle flex items-center justify-center">
                  <span className="text-lg font-bold text-gold-gradient font-['Inter']">{h.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h.icon size={16} className="t-gold" style={{ opacity: 0.7 }} />
                    <h3 className="text-sm font-bold t-primary">{h.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {t("home.sectionTitle.features")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5 group">
                <div className="w-11 h-11 rounded-xl bg-gold-subtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <f.icon size={20} className="t-gold" />
                </div>
                <h3 className="text-[13px] font-bold t-primary">{f.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {t("home.sectionTitle.testimonials")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((tm, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} style={{ color: "var(--gold-accent)", fill: "var(--gold-accent)" }} />
                  ))}
                </div>
                <p className="text-sm t-secondary leading-relaxed mb-4">"{tm.text}"</p>
                <div>
                  <p className="text-xs font-bold t-primary">{tm.name}</p>
                  <p className="text-[10px] t-muted">{tm.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY MAHAM EXPO ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {isArabicLike ? "لماذا Maham Expo؟" : "Why Maham Expo?"}
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
              {isArabicLike ? "منصة متكاملة تجمع بين التقنية والخبرة لتقديم أفضل تجربة معارض" : "An integrated platform combining technology and expertise for the best exhibition experience"}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyMaham.map((w, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 group hover:border-[var(--gold-border)] transition-all">
                <div className="w-11 h-11 rounded-xl bg-gold-subtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <w.icon size={20} className="t-gold" />
                </div>
                <h3 className="text-[13px] font-bold t-primary mb-1">{w.title}</h3>
                <p className="text-[11px] t-tertiary">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SUCCESS STORIES ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {isArabicLike ? "قصص نجاح" : "Success Stories"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {successStories.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center">
                    <s.icon size={18} className="t-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold t-primary">{s.name}</h4>
                    <p className="text-lg font-bold text-gold-gradient font-['Inter']">{s.result}</p>
                  </div>
                </div>
                <p className="text-[11px] t-tertiary leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ POLICIES ═══════ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {isArabicLike ? "السياسات والأحكام" : "Policies & Terms"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div {...fadeUp} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "سياسة الدفع" : "Payment Policy"}</h4>
              </div>
              <div className="space-y-1.5 text-[10px] t-tertiary">
                <p>{isArabicLike ? "• عربون 5% غير مسترد لتأكيد الحجز" : "• 5% non-refundable deposit to confirm booking"}</p>
                <p>{isArabicLike ? "• المتبقي يُستحق قبل 30 يوماً من المعرض" : "• Remaining due 30 days before exhibition"}</p>
                <p>{isArabicLike ? "• ندعم: بطاقات ائتمان، مدى، Apple Pay، تحويل بنكي" : "• We support: Credit cards, Mada, Apple Pay, Bank transfer"}</p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "سياسة الإلغاء" : "Cancellation Policy"}</h4>
              </div>
              <div className="space-y-1.5 text-[10px] t-tertiary">
                <p>{isArabicLike ? "• العربون غير مسترد في جميع الحالات" : "• Deposit is non-refundable in all cases"}</p>
                <p>{isArabicLike ? "• إلغاء قبل 15+ يوماً: استرداد 50% من المتبقي" : "• Cancel 15+ days before: 50% refund of remaining"}</p>
                <p>{isArabicLike ? "• إلغاء قبل أقل من 15 يوماً: لا يوجد استرداد" : "• Cancel <15 days: no refund"}</p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "الخصوصية والأمان" : "Privacy & Security"}</h4>
              </div>
              <div className="space-y-1.5 text-[10px] t-tertiary">
                <p>{isArabicLike ? "• بياناتك محمية وفق أنظمة المملكة" : "• Your data is protected under Saudi regulations"}</p>
                <p>{isArabicLike ? "• تشفير كامل لجميع المعاملات المالية" : "• Full encryption for all financial transactions"}</p>
                <p>{isArabicLike ? "• لا نشارك بياناتك مع أطراف ثالثة" : "• We never share your data with third parties"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {t("home.sectionTitle.faq")}
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between p-4 ${isRTL ? "text-right" : "text-left"}`}>
                  <span className="text-sm font-medium t-primary">{faq.q}</span>
                  <ChevronDown size={16} className="t-tertiary shrink-0 transition-transform"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-xs t-tertiary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-4">
              {t("home.cta.title")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/login">
                <button className="btn-gold px-10 py-4 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                  <Sparkles size={18} />
                  {t("home.cta.button")}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-10 px-6" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src={LOGO_URL} alt="Maham Expo" className="h-10 mb-3 object-contain" style={{ filter: isDark ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
              <p className="text-xs t-tertiary leading-relaxed">
                {t("home.footer.about")}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">{t("common.services")}</h4>
              <div className="space-y-2">
                {[t("nav.bookings"), t("nav.contracts"), t("nav.operations"), t("nav.analytics")].map((s, i) => (
                  <p key={i} className="text-[11px] t-tertiary">{s}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">
                {t("common.contactUs")}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary font-['Inter']">info@mahamexpo.sa</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary font-['Inter']" dir="ltr">+966 53 555 5900</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary">
                    {t("home.footer.location")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
            <p className="text-[10px] t-muted">
              © 2025 Maham Expo for Exhibitions & Conferences — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
