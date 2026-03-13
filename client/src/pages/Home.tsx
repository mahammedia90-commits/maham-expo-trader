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
