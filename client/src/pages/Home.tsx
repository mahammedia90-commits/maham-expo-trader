/**
 * Home — Landing Page for Maham Expo Trader Portal
 * Design: Obsidian Glass with cinematic hero, glass cards, gold accents
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield, Map, FileText, BarChart3, Bot, Zap } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-[#0A0A12] overflow-hidden" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A12]/60 via-[#0A0A12]/40 to-[#0A0A12]" />
        </div>

        {/* Content */}
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
            <p className="text-lg sm:text-xl text-white/60 mb-2 font-['Inter'] font-light tracking-wide">
              Smart Trader Portal
            </p>
            <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة متكاملة لإدارة حجوزاتك في المعارض والمؤتمرات والفعاليات — مدعومة بالذكاء الاصطناعي
              <br />
              <span className="font-['Inter'] text-white/30 text-xs">
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
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm text-white/70 hover:text-[#E8D5A3] flex items-center gap-2 mx-auto sm:mx-0">
                <Map size={16} />
                استعراض الخريطة
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-[#C5A55A]/60" />
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
            <p className="text-sm text-white/30 font-['Inter']">Everything you need in one place</p>
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
                <div className="w-12 h-12 rounded-xl bg-[#C5A55A]/10 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-white/90 mb-1">{f.titleAr}</h3>
                <p className="text-[11px] text-[#C5A55A]/50 font-['Inter'] mb-2">{f.titleEn}</p>
                <p className="text-sm text-white/40 leading-relaxed">{f.descAr}</p>
                <p className="text-[11px] text-white/20 font-['Inter'] mt-1">{f.descEn}</p>
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
            <img src={EXPO_HALL} alt="Exhibition Hall" className="w-full h-48 object-cover opacity-80" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-white/90 mb-1">معارض عالمية المستوى</h3>
              <p className="text-[11px] text-[#C5A55A]/50 font-['Inter'] mb-2">World-Class Exhibitions</p>
              <p className="text-sm text-white/40">إدارة احترافية لأكبر المعارض والمؤتمرات في المملكة العربية السعودية</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img src={CONFERENCE} alt="Events" className="w-full h-48 object-cover opacity-80" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-white/90 mb-1">فعاليات ضخمة وإدارة حشود</h3>
              <p className="text-[11px] text-[#C5A55A]/50 font-['Inter'] mb-2">Mega Events & Crowd Management</p>
              <p className="text-sm text-white/40">خبرة تشغيلية في بوليفارد وورلد، بوليفارد سيتي، أوت ليت، ومشاريع هيئة الترفيه</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <img src={LOGO_URL} alt="Maham Expo" className="h-8 mx-auto mb-3 opacity-60" />
        <p className="text-xs text-white/20">
          © 2025 Maham Expo — Powered by MAHAM AI
        </p>
        <p className="text-[10px] text-white/10 font-['Inter'] mt-1">
          Exhibitions · Conferences · Events · Crowd Management
        </p>
      </footer>
    </div>
  );
}
