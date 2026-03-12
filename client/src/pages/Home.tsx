/**
 * Home — Landing Page for Maham Expo Trader Portal
 * Theme-aware: supports Light/Dark mode
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Shield, Map, FileText, BarChart3, Bot, Zap, Sun, Moon } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-hero-bg-JwfvFA4x7SXBrMwAN4Sjpa.webp";
const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

const features = [
  { icon: Map, titleAr: "خريطة تفاعلية ذكية", titleEn: "Smart Interactive Map", descAr: "استعرض المواقع المتاحة على خريطة ثلاثية الأبعاد واحجز وحدتك مباشرة", descEn: "Browse available locations on a 3D map and book your unit directly" },
  { icon: Shield, titleAr: "حماية كاملة للمعاملات", titleEn: "Full Transaction Protection", descAr: "نظام عقود إلكترونية ذكية مع حجب الهوية وبوابة عربون إلزامية", descEn: "Smart e-contracts with identity masking and mandatory deposit gateway" },
  { icon: FileText, titleAr: "عقود إلكترونية ذكية", titleEn: "Smart E-Contracts", descAr: "توقيع رقمي معتمد مع إقرارات قانونية وغرامات على الالتفاف", descEn: "Certified digital signatures with legal disclaimers" },
  { icon: BarChart3, titleAr: "تحليلات متقدمة بالذكاء الاصطناعي", titleEn: "AI-Powered Analytics", descAr: "تقارير أداء فورية وتوقعات ذكية لتحسين قراراتك الاستثمارية", descEn: "Real-time performance reports and smart predictions" },
  { icon: Bot, titleAr: "مساعد ذكي AI", titleEn: "AI Smart Assistant", descAr: "مساعد شخصي يعمل بالذكاء الاصطناعي يساعدك في كل خطوة", descEn: "Personal AI assistant to help you at every step" },
  { icon: Zap, titleAr: "خدمات تشغيلية متكاملة", titleEn: "Integrated Operations", descAr: "تصاريح، لوجستيات، تجهيزات، وإدارة حشود — كل شيء في مكان واحد", descEn: "Permits, logistics, setup, crowd management — all in one place" },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: isDark ? "#0A0A12" : "#FAFAF5" }} dir="rtl">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 p-3 rounded-full glass-card"
        style={{ color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)" }}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" style={{ opacity: isDark ? 0.4 : 0.2 }} />
          <div className="absolute inset-0" style={{
            background: isDark
              ? "linear-gradient(to bottom, rgba(10,10,18,0.6), rgba(10,10,18,0.4), rgba(10,10,18,1))"
              : "linear-gradient(to bottom, rgba(250,250,245,0.7), rgba(250,250,245,0.5), rgba(250,250,245,1))"
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src={LOGO_URL} alt="Maham Expo" className="h-16 sm:h-20 mx-auto mb-8 object-contain" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-gold-gradient">بوابة التاجر الذكية</span>
            </h1>
            <p className="text-lg sm:text-xl mb-2 font-['Inter'] font-light tracking-wide t-secondary">
              Smart Trader Portal
            </p>
            <p className="text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed t-tertiary">
              منصة متكاملة لإدارة حجوزاتك في المعارض والمؤتمرات والفعاليات — مدعومة بالذكاء الاصطناعي
              <br />
              <span className="font-['Inter'] t-muted text-xs">
                A comprehensive platform for managing your exhibition, conference & event bookings — powered by AI
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <button className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                دخول لوحة التحكم
                <ArrowLeft size={18} />
              </button>
            </Link>
            <Link href="/map">
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0">
                <Map size={16} />
                استعراض الخريطة
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: "var(--gold-accent)", opacity: 0.6 }} />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-sm t-muted font-['Inter']">Everything you need in one place</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-subtle flex items-center justify-center mb-4">
                  <f.icon size={22} className="t-gold" />
                </div>
                <h3 className="text-base font-bold t-primary mb-1">{f.titleAr}</h3>
                <p className="text-[11px] t-gold font-['Inter'] mb-2" style={{ opacity: 0.6 }}>{f.titleEn}</p>
                <p className="text-sm t-tertiary leading-relaxed">{f.descAr}</p>
                <p className="text-[11px] t-muted font-['Inter'] mt-1">{f.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img src={EXPO_HALL} alt="Exhibition Hall" className="w-full h-48 object-cover" style={{ opacity: isDark ? 0.8 : 0.9 }} />
            <div className="p-6">
              <h3 className="text-lg font-bold t-primary mb-1">معارض عالمية المستوى</h3>
              <p className="text-[11px] t-gold font-['Inter'] mb-2" style={{ opacity: 0.6 }}>World-Class Exhibitions</p>
              <p className="text-sm t-tertiary">إدارة احترافية لأكبر المعارض والمؤتمرات في المملكة العربية السعودية</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img src={CONFERENCE} alt="Events" className="w-full h-48 object-cover" style={{ opacity: isDark ? 0.8 : 0.9 }} />
            <div className="p-6">
              <h3 className="text-lg font-bold t-primary mb-1">فعاليات ضخمة وإدارة حشود</h3>
              <p className="text-[11px] t-gold font-['Inter'] mb-2" style={{ opacity: 0.6 }}>Mega Events & Crowd Management</p>
              <p className="text-sm t-tertiary">خبرة تشغيلية في بوليفارد وورلد، بوليفارد سيتي، أوت ليت، ومشاريع هيئة الترفيه</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <img src={LOGO_URL} alt="Maham Expo" className="h-8 mx-auto mb-3" style={{ opacity: 0.6 }} />
        <p className="text-xs t-muted">
          © 2025 Maham Expo — Powered by MAHAM AI
        </p>
        <p className="text-[10px] t-muted font-['Inter'] mt-1" style={{ opacity: 0.5 }}>
          Exhibitions · Conferences · Events · Crowd Management
        </p>
      </footer>
    </div>
  );
}
