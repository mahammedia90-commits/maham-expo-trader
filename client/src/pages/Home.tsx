/**
 * Home — Smart Trader Portal Landing Page
 * Comprehensive, convincing landing page for traders
 * Covers: F&B, Retail, Cafes, Restaurants, Real Estate, Tech, Events, Crowd Management
 * Theme-aware: supports Light/Dark mode
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft, Shield, Map, FileText, BarChart3, Bot, Zap, Sun, Moon,
  CheckCircle, Star, Users, Building2, CreditCard, Lock, Clock,
  TrendingUp, Globe, Award, Utensils, Coffee, ShoppingBag, Landmark,
  Cpu, PartyPopper, MapPin, Phone, Mail, ChevronDown, Sparkles,
  Eye, MessageSquare, Bell, CalendarCheck, Layers, Target, Rocket
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-hero-bg-JwfvFA4x7SXBrMwAN4Sjpa.webp";
const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

/* ─── Data ─── */
const stats = [
  { value: "500+", labelAr: "عارض ومستثمر", labelEn: "Exhibitors & Investors" },
  { value: "50+", labelAr: "معرض وفعالية", labelEn: "Exhibitions & Events" },
  { value: "10K+", labelAr: "وحدة تجارية", labelEn: "Commercial Units" },
  { value: "98%", labelAr: "رضا العملاء", labelEn: "Client Satisfaction" },
];

const sectors = [
  { icon: Utensils, nameAr: "المطاعم", nameEn: "Restaurants", descAr: "مساحات مجهزة بالكامل لتشغيل المطاعم داخل المعارض والفعاليات مع بنية تحتية متكاملة" },
  { icon: Coffee, nameAr: "الكافيهات", nameEn: "Cafés", descAr: "مواقع استراتيجية للكافيهات مع توصيلات كهرباء ومياه وتكييف مركزي" },
  { icon: ShoppingBag, nameAr: "البيع بالتجزئة", nameEn: "Retail", descAr: "بوثات ومحلات تجارية بمساحات مرنة للعلامات التجارية والمنتجات" },
  { icon: Landmark, nameAr: "العقارات والاستثمار", nameEn: "Real Estate", descAr: "أجنحة عرض فاخرة للمطورين العقاريين وشركات الاستثمار" },
  { icon: Cpu, nameAr: "التقنية والابتكار", nameEn: "Technology", descAr: "مساحات عرض تقنية مع شاشات LED وبنية تحتية رقمية متقدمة" },
  { icon: PartyPopper, nameAr: "الترفيه والفعاليات", nameEn: "Entertainment", descAr: "مناطق ترفيهية ومساحات تفاعلية لموسم الرياض والفعاليات الكبرى" },
];

const features = [
  { icon: Map, titleAr: "خريطة تفاعلية ذكية", titleEn: "Smart Interactive Map", descAr: "استعرض جميع الوحدات المتاحة على خريطة تفاعلية — اختر موقعك واحجز فوراً بضغطة واحدة مع عرض الأسعار والمساحات والحالة الحية" },
  { icon: Lock, titleAr: "حجز فوري آمن", titleEn: "Instant Secure Booking", descAr: "نظام حجز مؤقت 30 دقيقة مع عربون إلزامي غير مسترد — يضمن جدية التاجر ويحمي حقوق جميع الأطراف" },
  { icon: Shield, titleAr: "حماية كاملة للمعاملات", titleEn: "Full Transaction Protection", descAr: "هوية التاجر والمستثمر محجوبة حتى توقيع العقد الإلكتروني — لا تواصل مباشر خارج المنصة مع غرامة 50,000 ريال" },
  { icon: FileText, titleAr: "عقود إلكترونية ذكية", titleEn: "Smart E-Contracts", descAr: "توقيع رقمي معتمد مع إقرارات قانونية — متوافق مع أنظمة المملكة العربية السعودية وحماية كاملة للطرفين" },
  { icon: CreditCard, titleAr: "بوابة دفع متعددة", titleEn: "Multi-Payment Gateway", descAr: "ادفع بمدى، فيزا، ماستركارد، Apple Pay، أو تحويل بنكي — مع نظام أقساط مرن وفواتير إلكترونية" },
  { icon: BarChart3, titleAr: "تحليلات AI متقدمة", titleEn: "AI-Powered Analytics", descAr: "تقارير أداء فورية، تحليل ROI، توقعات ذكية للمبيعات، ومقارنة أداء المعارض — كل شيء بالذكاء الاصطناعي" },
  { icon: Bot, titleAr: "مساعد ذكي MAHAM AI", titleEn: "MAHAM AI Assistant", descAr: "مساعد شخصي يعمل بالذكاء الاصطناعي — يوصي بأفضل المواقع، يحلل الأسعار، ويساعدك في اتخاذ القرار الأمثل" },
  { icon: Zap, titleAr: "خدمات تشغيلية متكاملة", titleEn: "Integrated Operations", descAr: "تصاريح تشغيل، لوجستيات، تجهيزات كهربائية، إنترنت، تأثيث، إدارة حشود — كل شيء من مكان واحد" },
  { icon: MessageSquare, titleAr: "تواصل آمن عبر المنصة", titleEn: "Secure Platform Messaging", descAr: "نظام رسائل داخلي مشفر — لا يسمح بمشاركة أرقام الهواتف أو البريد الإلكتروني قبل توقيع العقد" },
  { icon: Star, titleAr: "نظام تقييم شفاف", titleEn: "Transparent Rating System", descAr: "قيّم تجربتك بعد كل معرض — تقييم متعدد المحاور يشمل التنظيم، الموقع، الخدمات، وعائد الاستثمار" },
  { icon: Bell, titleAr: "إشعارات ذكية فورية", titleEn: "Smart Real-time Alerts", descAr: "تنبيهات فورية لكل تحديث — حجوزات، مدفوعات، عقود، تصاريح، وتوصيات AI مخصصة لك" },
  { icon: Eye, titleAr: "شفافية كاملة في التسعير", titleEn: "Full Pricing Transparency", descAr: "توزيع واضح للإيرادات (70% مالك الموقع، 20% المنظم، 10% المنصة) — لا رسوم مخفية أبداً" },
];

const traderBenefits = [
  "حجز وحدتك التجارية في أقل من 5 دقائق",
  "مقارنة الأسعار والمواقع بين المعارض المختلفة",
  "عقود إلكترونية محمية بالقانون السعودي",
  "دفع آمن بأقساط مرنة بدون فوائد",
  "تقارير أداء وتحليل ROI بعد كل معرض",
  "دعم فني على مدار الساعة عبر المنصة",
  "تصاريح تشغيل وخدمات لوجستية بضغطة واحدة",
  "مساعد ذكي AI يوصي بأفضل الفرص المناسبة لك",
];

const howItWorks = [
  { step: "01", titleAr: "تصفح المعارض", titleEn: "Browse Expos", descAr: "استعرض المعارض والفعاليات المتاحة — فلتر حسب القطاع، الموقع، والميزانية", icon: Building2 },
  { step: "02", titleAr: "اختر وحدتك", titleEn: "Select Your Unit", descAr: "استخدم الخريطة التفاعلية لاختيار الموقع المثالي — بوث، محل، جناح VIP، أو منطقة F&B", icon: MapPin },
  { step: "03", titleAr: "احجز وادفع", titleEn: "Book & Pay", descAr: "احجز فوراً بعربون 5-10% واختر خطة الدفع المناسبة — أقساط مرنة بدون فوائد", icon: CreditCard },
  { step: "04", titleAr: "وقّع العقد", titleEn: "Sign Contract", descAr: "وقّع العقد الإلكتروني رقمياً — محمي بالقانون السعودي مع ضمانات كاملة", icon: FileText },
  { step: "05", titleAr: "جهّز وانطلق", titleEn: "Setup & Launch", descAr: "اطلب خدمات التجهيز والتشغيل — كهرباء، إنترنت، تأثيث، تصاريح، وإدارة حشود", icon: Rocket },
];

const testimonials = [
  { name: "أحمد المالكي", role: "مالك سلسلة مطاعم", text: "المنصة غيّرت طريقة تعاملنا مع المعارض — من البحث للحجز للتشغيل، كل شيء في مكان واحد", rating: 5 },
  { name: "سارة العتيبي", role: "مديرة تسويق — علامة تجارية", text: "الخريطة التفاعلية ونظام الحجز الفوري وفّرا علينا أسابيع من التفاوض والتنسيق", rating: 5 },
  { name: "خالد الحربي", role: "مستثمر عقاري", text: "شفافية التسعير والعقود الإلكترونية أعطتنا ثقة كاملة في التعامل مع المنصة", rating: 5 },
];

const fadeUp = { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const bg = isDark ? "#0A0A12" : "#FAFAF5";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "كيف أحجز وحدة تجارية في المعرض؟", a: "تصفح المعارض المتاحة، اختر الوحدة من الخريطة التفاعلية، ادفع العربون (5-10%)، ووقّع العقد الإلكتروني. العملية كاملة تتم في أقل من 5 دقائق." },
    { q: "هل يمكنني التواصل مع المنظم مباشرة؟", a: "لحماية جميع الأطراف، يتم التواصل عبر نظام الرسائل الداخلي فقط. لا يُسمح بمشاركة أرقام الهواتف أو البريد الإلكتروني قبل توقيع العقد." },
    { q: "ما هي طرق الدفع المتاحة؟", a: "ندعم مدى، فيزا، ماستركارد، Apple Pay، والتحويل البنكي. كما نوفر نظام أقساط مرن بدون فوائد." },
    { q: "هل العقود محمية قانونياً؟", a: "نعم، جميع العقود الإلكترونية محمية بموجب أنظمة المملكة العربية السعودية مع توقيع رقمي معتمد وإقرارات قانونية ملزمة." },
    { q: "ما هي القطاعات المدعومة؟", a: "ندعم جميع القطاعات: مطاعم، كافيهات، بيع بالتجزئة، تقنية، عقارات، ترفيه، أغذية ومشروبات، وأي نشاط تجاري مناسب للمعارض والفعاليات." },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: bg }} dir="rtl">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 p-3 rounded-full"
        style={{
          color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)",
          backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          border: "1px solid var(--glass-border)"
        }}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

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
              <span className="text-gold-gradient">بوابة التاجر الذكية</span>
            </h1>
            <p className="text-base sm:text-lg mb-2 font-['Inter'] font-light tracking-wide t-secondary">
              Smart Trader Portal
            </p>
            <p className="text-sm sm:text-base max-w-3xl mx-auto mb-4 leading-relaxed" style={{ color: isDark ? 'var(--text-tertiary)' : '#2D2D48' }}>
              منصة متكاملة لإدارة حجوزاتك في المعارض والمؤتمرات والفعاليات الكبرى — مدعومة بالذكاء الاصطناعي
            </p>
            <p className="text-xs max-w-2xl mx-auto mb-8 font-['Inter']" style={{ color: isDark ? 'var(--text-muted)' : '#4A4A65' }}>
              A comprehensive AI-powered platform for managing your exhibition, conference & event bookings — from browsing to booking to operations
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/login">
              <button className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                دخول لوحة التحكم
                <ArrowLeft size={18} />
              </button>
            </Link>
            <Link href="/expos">
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0">
                <Building2 size={16} />
                تصفح المعارض
              </button>
            </Link>
            <Link href="/map">
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0">
                <Map size={16} />
                استعراض الخريطة
              </button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gold-gradient font-['Inter']">{s.value}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: isDark ? 'var(--text-secondary)' : '#1A1A30' }}>{s.labelAr}</p>
                <p className="text-[9px] font-['Inter']" style={{ color: isDark ? 'var(--text-muted)' : '#5A5A72' }}>{s.labelEn}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: "var(--gold-accent)", opacity: 0.6 }} />
          </div>
        </motion.div>
      </section>

      {/* ═══════ SECTORS SECTION ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">Supported Sectors</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">القطاعات المدعومة</h2>
            <p className="text-sm t-tertiary max-w-xl mx-auto">نوفر مساحات تجارية مجهزة لجميع القطاعات — من المطاعم والكافيهات إلى التقنية والعقارات</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sectors.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 text-center group hover:border-[var(--gold-border)] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <s.icon size={24} className="t-gold" />
                </div>
                <h3 className="text-sm font-bold t-primary mb-0.5">{s.nameAr}</h3>
                <p className="text-[10px] t-gold font-['Inter'] mb-2" style={{ opacity: isDark ? 0.6 : 0.8 }}>{s.nameEn}</p>
                <p className="text-[11px] t-tertiary leading-relaxed">{s.descAr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">كيف يعمل النظام؟</h2>
            <p className="text-sm t-tertiary max-w-xl mx-auto">من التصفح إلى التشغيل — 5 خطوات بسيطة لبدء نشاطك التجاري في أي معرض</p>
          </motion.div>

          <div className="space-y-4">
            {howItWorks.map((h, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 flex items-start gap-5"
              >
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gold-subtle flex items-center justify-center">
                  <span className="text-lg font-bold text-gold-gradient font-['Inter']">{h.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h.icon size={16} className="t-gold" style={{ opacity: 0.7 }} />
                    <h3 className="text-sm font-bold t-primary">{h.titleAr}</h3>
                    <span className="text-[10px] t-muted font-['Inter']">· {h.titleEn}</span>
                  </div>
                  <p className="text-[12px] t-tertiary leading-relaxed">{h.descAr}</p>
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
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">Platform Features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-sm t-tertiary max-w-xl mx-auto">12 ميزة متقدمة تجعل تجربتك في المعارض والفعاليات سلسة واحترافية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gold-subtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <f.icon size={20} className="t-gold" />
                </div>
                <h3 className="text-[13px] font-bold t-primary mb-0.5">{f.titleAr}</h3>
                <p className="text-[9px] t-gold font-['Inter'] mb-2" style={{ opacity: isDark ? 0.5 : 0.8 }}>{f.titleEn}</p>
                <p className="text-[11px] t-tertiary leading-relaxed">{f.descAr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRADER BENEFITS ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div {...fadeUp}>
              <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">Trader Benefits</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-4">لماذا تختار منصة مهام إكسبو؟</h2>
              <p className="text-sm t-tertiary mb-6 leading-relaxed">
                منصة مصممة خصيصاً للتاجر — تمنحك السيطرة الكاملة على حجوزاتك وعقودك ومدفوعاتك مع حماية قانونية شاملة وشفافية تامة في التسعير
              </p>
              <div className="space-y-3">
                {traderBenefits.map((b, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle size={16} className="t-gold shrink-0 mt-0.5" />
                    <p className="text-sm t-secondary">{b}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-4">
              <div className="glass-card rounded-2xl overflow-hidden">
                <img src={EXPO_HALL} alt="Exhibition Hall" className="w-full h-44 object-cover" style={{ opacity: isDark ? 0.8 : 0.9 }} />
                <div className="p-5">
                  <h3 className="text-base font-bold t-primary mb-1">معارض عالمية المستوى</h3>
                  <p className="text-[10px] t-gold font-['Inter'] mb-2" style={{ opacity: isDark ? 0.5 : 0.8 }}>World-Class Exhibitions</p>
                  <p className="text-xs t-tertiary">إدارة احترافية لأكبر المعارض والمؤتمرات في المملكة — معرض الرياض الدولي، مؤتمر LEAP، معارض الأغذية والمشروبات</p>
                </div>
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <img src={CONFERENCE} alt="Events" className="w-full h-44 object-cover" style={{ opacity: isDark ? 0.8 : 0.9 }} />
                <div className="p-5">
                  <h3 className="text-base font-bold t-primary mb-1">فعاليات ضخمة وإدارة حشود</h3>
                  <p className="text-[10px] t-gold font-['Inter'] mb-2" style={{ opacity: isDark ? 0.5 : 0.8 }}>Mega Events & Crowd Management</p>
                  <p className="text-xs t-tertiary">خبرة تشغيلية في بوليفارد وورلد، بوليفارد سيتي، موسم الرياض — إدارة حشود وتنظيم فعاليات بمعايير عالمية</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ REVENUE SPLIT TRANSPARENCY ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">Revenue Transparency</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">شفافية كاملة في التسعير</h2>
            <p className="text-sm t-tertiary max-w-xl mx-auto">نؤمن بالشفافية المطلقة — كل ريال تدفعه يتم توزيعه بوضوح تام</p>
          </motion.div>

          <motion.div {...fadeUp} className="glass-card rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { pct: "70%", labelAr: "مالك الموقع", labelEn: "Venue Owner", color: "var(--gold-accent)" },
                { pct: "20%", labelAr: "المنظم", labelEn: "Organizer", color: "var(--status-blue)" },
                { pct: "10%", labelAr: "رسوم المنصة", labelEn: "Platform Fee", color: "var(--status-green)" },
              ].map((r, i) => (
                <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                  <p className="text-3xl font-bold font-['Inter']" style={{ color: r.color }}>{r.pct}</p>
                  <p className="text-sm t-primary mt-1 font-medium">{r.labelAr}</p>
                  <p className="text-[10px] t-muted font-['Inter']">{r.labelEn}</p>
                </div>
              ))}
            </div>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="h-full" style={{ width: "70%", backgroundColor: "var(--gold-accent)" }} />
              <div className="h-full" style={{ width: "20%", backgroundColor: "var(--status-blue)" }} />
              <div className="h-full" style={{ width: "10%", backgroundColor: "var(--status-green)" }} />
            </div>
            <p className="text-[10px] t-muted text-center mt-3 font-['Inter']">
              No hidden fees — Full transparency in every transaction
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">ماذا يقول عملاؤنا؟</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} style={{ color: "var(--gold-accent)", fill: "var(--gold-accent)" }} />
                  ))}
                </div>
                <p className="text-sm t-secondary leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-xs font-bold t-primary">{t.name}</p>
                  <p className="text-[10px] t-muted">{t.role}</p>
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
            <p className="text-xs t-gold font-['Inter'] uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">الأسئلة الشائعة</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-right"
                >
                  <span className="text-sm font-medium t-primary">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className="t-tertiary shrink-0 transition-transform"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-4">ابدأ رحلتك التجارية الآن</h2>
            <p className="text-sm t-tertiary mb-8 max-w-xl mx-auto leading-relaxed">
              انضم لأكثر من 500 تاجر ومستثمر يستخدمون منصة مهام إكسبو لإدارة أعمالهم في المعارض والفعاليات
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="btn-gold px-10 py-4 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                  <Sparkles size={18} />
                  ابدأ الآن مجاناً
                </button>
              </Link>
              <Link href="/expos">
                <button className="glass-card px-10 py-4 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0">
                  <Building2 size={16} />
                  تصفح المعارض المتاحة
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-10 px-6" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={LOGO_URL} alt="Maham Expo" className="h-10 mb-3 object-contain" style={{ filter: isDark ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
              <p className="text-xs t-tertiary leading-relaxed">
                منصة مهام إكسبو — الحل المتكامل لإدارة المعارض والمؤتمرات والفعاليات في المملكة العربية السعودية
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">الخدمات</h4>
              <div className="space-y-2">
                {["حجز الوحدات التجارية", "العقود الإلكترونية", "الخدمات التشغيلية", "التحليلات والتقارير"].map((s, i) => (
                  <p key={i} className="text-[11px] t-tertiary">{s}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">القطاعات</h4>
              <div className="space-y-2">
                {["مطاعم وكافيهات", "بيع بالتجزئة", "تقنية وابتكار", "عقارات واستثمار"].map((s, i) => (
                  <p key={i} className="text-[11px] t-tertiary">{s}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">تواصل معنا</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary font-['Inter']">info@mahamexpo.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary font-['Inter']" dir="ltr">+966 50 000 0000</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
            <p className="text-[10px] t-muted">
              © 2025 Maham Expo — Powered by MAHAM AI | جميع الحقوق محفوظة
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-1" style={{ opacity: isDark ? 0.5 : 0.7 }}>
              Exhibitions · Conferences · Events · Crowd Management · F&B · Retail · Real Estate · Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
