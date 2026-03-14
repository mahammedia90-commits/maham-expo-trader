/**
 * Home — Smart Trader Portal Landing Page
 * LUXURY REDESIGN — Immersive parallax, premium animations, AI-powered feel
 * Fully localized with useLanguage() — supports 6 languages
 */
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  ArrowLeft, ArrowRight, Shield, Map, FileText, BarChart3, Bot, Zap, Sun, Moon,
  CheckCircle, Star, Users, Building2, CreditCard, Lock, Clock,
  TrendingUp, Globe, Award, Utensils, Coffee, ShoppingBag, Landmark,
  Cpu, PartyPopper, MapPin, Phone, Mail, ChevronDown, Sparkles,
  Eye, MessageSquare, Bell, CalendarCheck, Layers, Target, Rocket, Check,
  Calculator, Search, Percent, DollarSign
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-hero-bg-JwfvFA4x7SXBrMwAN4Sjpa.webp";
const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

/* Stagger children animation */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang, isRTL, dir } = useLanguage();
  const isDark = theme === "dark";
  const isArabicLike = ["ar", "fa"].includes(lang);
  const bg = isDark ? "#0A0A12" : "#FAF9F5";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  // ROI Calculator state
  const [roiCost, setRoiCost] = useState(25000);
  const [roiDays, setRoiDays] = useState(5);
  const [roiDaily, setRoiDaily] = useState(8000);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Parallax for hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // ROI calculations
  const roiTotalRevenue = roiDays * roiDaily;
  const roiNetProfit = roiTotalRevenue - roiCost;
  const roiBreakeven = roiDaily > 0 ? Math.ceil(roiCost / roiDaily) : 0;
  const roiPercent = roiCost > 0 ? Math.round((roiNetProfit / roiCost) * 100) : 0;

  const sectors = [
    { icon: Utensils, name: t("home.sector.restaurants") },
    { icon: Coffee, name: t("home.sector.cafes") },
    { icon: ShoppingBag, name: t("home.sector.retail") },
    { icon: Landmark, name: t("home.sector.realEstate") },
    { icon: Cpu, name: t("home.sector.technology") },
    { icon: PartyPopper, name: t("home.sector.entertainment") },
  ];

  const howItWorks = [
    { step: "01", title: isArabicLike ? "تصفح المعارض" : "Browse Exhibitions", icon: Search, desc: isArabicLike ? "ابحث بالموقع أو القطاع أو السعر. خريطة تفاعلية تُظهر المتاح والمحجوز." : "Search by location, sector, or price. Interactive map shows available and booked units.", time: isArabicLike ? "دقيقتان" : "2 minutes" },
    { step: "02", title: isArabicLike ? "اختر وحدتك" : "Select Your Unit", icon: MapPin, desc: isArabicLike ? "قارن بين الوحدات واستشر مساعد MAHAM AI لأفضل توصية تناسب نشاطك." : "Compare units and consult MAHAM AI assistant for the best recommendation for your business.", time: isArabicLike ? "5 دقائق" : "5 minutes" },
    { step: "03", title: isArabicLike ? "احجز وادفع" : "Book & Pay", icon: CreditCard, desc: isArabicLike ? "عربون 5% فقط لتأكيد مكانك. الباقي قبل 30 يوماً من الفعالية." : "Only 5% deposit to confirm your spot. Remaining due 30 days before the event.", time: isArabicLike ? "أقل من 5 دقائق" : "Less than 5 minutes" },
    { step: "04", title: isArabicLike ? "وقّع العقد" : "Sign Contract", icon: FileText, desc: isArabicLike ? "عقد إلكتروني معتمد يُولَّد تلقائياً. وقّع رقمياً واستلم نسختك فوراً." : "An approved electronic contract is auto-generated. Sign digitally and receive your copy instantly.", time: isArabicLike ? "دقيقة واحدة" : "1 minute" },
    { step: "05", title: isArabicLike ? "جهّز وانطلق" : "Prepare & Launch", icon: Rocket, desc: isArabicLike ? "تلقَّ إشعارات موعد التجهيز وتابع أداءك عبر لوحة التحكم الذكية." : "Receive setup date notifications and track your performance via the smart dashboard.", time: isArabicLike ? "مستمر" : "Ongoing" },
  ];

  const features = [
    { icon: Map, title: t("home.feature.map"), desc: isArabicLike ? "خريطة ثلاثية الأبعاد تفاعلية" : "Interactive 3D floor map" },
    { icon: Lock, title: t("home.feature.booking"), desc: isArabicLike ? "حجز فوري ومضمون" : "Instant guaranteed booking" },
    { icon: Shield, title: t("home.feature.protection"), desc: isArabicLike ? "حماية قانونية شاملة" : "Comprehensive legal protection" },
    { icon: FileText, title: t("home.feature.contracts"), desc: isArabicLike ? "عقود إلكترونية ذكية" : "Smart electronic contracts" },
    { icon: CreditCard, title: t("home.feature.payment"), desc: isArabicLike ? "دفع آمن ومتعدد" : "Secure multi-payment" },
    { icon: Bot, title: t("home.feature.ai"), desc: isArabicLike ? "مساعد ذكاء اصطناعي" : "AI-powered assistant" },
  ];

  const faqs = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: isArabicLike ? "ما هي سياسة الإلغاء والاسترداد؟" : "What is the cancellation and refund policy?", a: isArabicLike ? "العربون (5%) غير مسترد. الإلغاء قبل 15 يوماً أو أكثر من المعرض: استرداد 50% من المبلغ المتبقي. الإلغاء قبل أقل من 15 يوماً: لا يوجد استرداد." : "The deposit (5%) is non-refundable. Cancellation 15+ days before the exhibition: 50% refund of remaining amount. Less than 15 days: no refund." },
    { q: isArabicLike ? "هل يمكنني اختيار موقع الجناح بنفسي؟" : "Can I choose my booth location?", a: isArabicLike ? "نعم، المنصة توفر خريطة تفاعلية لكل معرض تعرض جميع الأجنحة المتاحة مع أسعارها ومساحاتها. يمكنك اختيار الموقع المناسب وتثبيته لمدة 30 دقيقة." : "Yes, the platform provides an interactive map for each exhibition showing all available booths with prices and sizes. You can choose your preferred location and hold it for 30 minutes." },
    { q: isArabicLike ? "ما هي الخدمات التشغيلية المتاحة؟" : "What operational services are available?", a: isArabicLike ? "نوفر خدمات شاملة: تصميم البوث، كهرباء وتكييف، إنترنت واتصالات، لوجستيات ونقل، طباعة ولافتات، أمن وسلامة، تنظيف وصيانة، وتقنية وشاشات. جميعها تُطلب وتُدفع عبر المنصة." : "We provide comprehensive services: booth design, electricity & AC, internet & telecom, logistics & transport, printing & signage, security, cleaning & maintenance, and tech & AV. All ordered and paid through the platform." },
    { q: isArabicLike ? "هل يوجد عقد رسمي؟" : "Is there an official contract?", a: isArabicLike ? "نعم، يتم إنشاء عقد إلكتروني رسمي يتضمن جميع البنود المالية والقانونية. يجب على التاجر مراجعة العقد والموافقة عليه قبل الدفع. يمكن تحميل نسخة PDF في أي وقت." : "Yes, an official electronic contract is generated with all financial and legal terms. The trader must review and accept the contract before payment. A PDF copy can be downloaded anytime." },
    { q: isArabicLike ? "كيف أتواصل مع الدعم؟" : "How do I contact support?", a: isArabicLike ? "يمكنك التواصل عبر البريد: info@mahamexpo.sa أو rent@mahamexpo.sa، أو الهاتف: +966535555900 أو +966534778899، أو عبر المساعد الذكي داخل المنصة." : "Contact us via email: info@mahamexpo.sa or rent@mahamexpo.sa, phone: +966535555900 or +966534778899, or through the AI assistant inside the platform." },
    { q: isArabicLike ? "ماذا لو كانت الفعالية مخيّبة للتوقعات؟" : "What if the event doesn't meet expectations?", a: isArabicLike ? "نسعى دائماً لضمان أعلى معايير الجودة في الفعاليات التي نتعاون معها. في حال لم تلبِّ الفعالية التوقعات، نُتيح التواصل المباشر مع المنظّم عبر المنصة لمناقشة التعويض. كما يمكنك تقييم تجربتك لمساعدة التجار الآخرين." : "We always strive to ensure the highest quality standards in the events we partner with. If the event doesn't meet expectations, we facilitate direct communication with the organizer through the platform to discuss compensation. You can also rate your experience to help other traders." },
    { q: isArabicLike ? "هل يوجد ضمان لحد أدنى من الزوار؟" : "Is there a minimum visitor guarantee?", a: isArabicLike ? "لا تضمن مهام إكسبو عدداً محدداً من الزوار، إذ تعتمد الزيارة على الجهة المنظّمة للفعالية. لكننا نُوفّر إحصائيات الإقبال من النسخ السابقة لكل فعالية لمساعدتك في اتخاذ قرار مدروس قبل الحجز." : "Maham Expo does not guarantee a specific number of visitors, as attendance depends on the event organizer. However, we provide attendance statistics from previous editions of each event to help you make an informed decision before booking." },
    { q: isArabicLike ? "كيف تتم تسوية النزاعات بين التاجر والمنظّم؟" : "How are disputes between traders and organizers resolved?", a: isArabicLike ? "في حال نشأ خلاف، تتدخل مهام إكسبو كوسيط محايد بين الطرفين. العقد الإلكتروني الموقّع يُشكّل المرجع القانوني للنزاع. للحالات المعقدة، يمكن رفع تذكرة دعم رسمية يُتابعها فريقنا القانوني." : "In case of a dispute, Maham Expo intervenes as a neutral mediator between both parties. The signed electronic contract serves as the legal reference for the dispute. For complex cases, a formal support ticket can be raised and followed up by our legal team." },
  ];

  const whyMaham = [
    { icon: Shield, title: isArabicLike ? "حماية كاملة" : "Full Protection", desc: isArabicLike ? "عقود إلكترونية معتمدة + بند عدم الالتفاف" : "Certified e-contracts + anti-circumvention clause" },
    { icon: Globe, title: isArabicLike ? "وصول عالمي" : "Global Reach", desc: isArabicLike ? "معارض في 6 دول + دعم 6 لغات" : "Exhibitions in 6 countries + 6 language support" },
    { icon: Zap, title: isArabicLike ? "حجز فوري" : "Instant Booking", desc: isArabicLike ? "اختر جناحك من الخريطة واحجز في دقائق" : "Choose from map & book in minutes" },
    { icon: BarChart3, title: isArabicLike ? "تحليلات ذكية" : "Smart Analytics", desc: isArabicLike ? "لوحة تحكم متقدمة مع مساعد AI" : "Advanced dashboard with AI assistant" },
    { icon: CreditCard, title: isArabicLike ? "دفع مرن" : "Flexible Payment", desc: isArabicLike ? "عربون 5% + أقساط مريحة" : "5% deposit + comfortable installments" },
    { icon: Target, title: isArabicLike ? "خدمات متكاملة" : "Integrated Services", desc: isArabicLike ? "تصميم + كهرباء + لوجستيات + طباعة" : "Design + electricity + logistics + printing" },
  ];

  return (
    <div className="min-h-screen overflow-hidden luxury-bg-pattern" style={{ backgroundColor: bg }} dir={dir}>
      {/* ═══════ TOP BAR ═══════ */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 rounded-2xl backdrop-blur-xl"
          style={{
            color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)",
            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: "1px solid var(--glass-border)"
          }}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.button>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
            onClick={() => setLangOpen(!langOpen)}
            className="p-3 rounded-2xl flex items-center gap-2 backdrop-blur-xl"
            style={{
              color: isDark ? "var(--text-tertiary)" : "var(--text-secondary)",
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: "1px solid var(--glass-border)"
            }}>
            <Globe size={17} />
            <span className="text-xs hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.nativeName}</span>
          </motion.button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setLangOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 left-0 z-[101] rounded-2xl overflow-hidden min-w-[200px]"
                style={{ background: isDark ? "rgba(12,12,24,0.96)" : "rgba(255,255,255,0.97)", backdropFilter: "blur(60px)", border: "1px solid var(--glass-border)", boxShadow: "var(--glow-gold)" }}>
                <div className="p-2">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${lang === l.code ? "bg-gold-subtle" : ""}`}
                      style={lang === l.code ? { border: "1px solid var(--gold-border)" } : { border: "1px solid transparent" }}>
                      <span className="text-base">{l.flag}</span>
                      <span className="text-xs font-medium flex-1 text-start" style={{ color: lang === l.code ? "var(--gold-light)" : isDark ? "var(--text-secondary)" : "#333" }}>{l.nativeName}</span>
                      {lang === l.code && <Check size={14} style={{ color: "var(--gold-accent)" }} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* ═══════ HERO — Immersive Parallax ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" style={{ opacity: isDark ? 0.30 : 0.12 }} />
        </motion.div>
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? `radial-gradient(ellipse at 50% 30%, rgba(197,165,90,0.06) 0%, transparent 60%), linear-gradient(to bottom, rgba(8,8,18,0.4), rgba(8,8,18,0.2), ${bg})`
            : `radial-gradient(ellipse at 50% 30%, rgba(139,105,20,0.04) 0%, transparent 60%), linear-gradient(to bottom, rgba(250,249,245,0.5), rgba(250,249,245,0.3), ${bg})`
        }} />
        {/* Floating gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{
                width: 3 + i * 1.5,
                height: 3 + i * 1.5,
                background: `radial-gradient(circle, ${isDark ? 'rgba(197,165,90,0.4)' : 'rgba(139,105,20,0.2)'}, transparent)`,
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <motion.img
              src={LOGO_URL} alt="Maham Expo"
              className="h-16 sm:h-20 mx-auto mb-8 object-contain"
              style={{ filter: isDark ? 'drop-shadow(0 0 30px rgba(197,165,90,0.15))' : 'brightness(0.25) contrast(1.2)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight">
              <span className="text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>{t("home.title")}</span>
            </h1>
            <motion.p
              className="text-sm sm:text-lg max-w-3xl mx-auto mb-4 leading-relaxed"
              style={{ color: isDark ? 'var(--text-tertiary)' : '#2D2D48' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {t("home.desc")}
            </motion.p>
            <motion.p
              className="text-xs sm:text-sm max-w-2xl mx-auto mb-10"
              style={{ color: isDark ? 'var(--text-muted)' : '#4A4A65' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {t("home.desc2")}
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-gold px-10 py-4 rounded-2xl text-base font-bold flex items-center gap-3 mx-auto sm:mx-0">
                <Sparkles size={18} />
                {isArabicLike ? "احجز وحدتك الآن" : "Book Your Unit Now"}
                <ArrowIcon size={18} />
              </motion.button>
            </Link>
            <Link href="/browse">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="glass-card px-8 py-4 rounded-2xl text-sm t-secondary flex items-center gap-3 mx-auto sm:mx-0 hover:border-[var(--gold-border)]">
                <Eye size={16} />
                {isArabicLike ? "استعرض المعارض بدون تسجيل" : "Browse Exhibitions Without Registration"}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-7 h-11 rounded-full flex items-start justify-center p-2" style={{ border: `1px solid ${isDark ? 'rgba(197,165,90,0.2)' : 'rgba(139,105,20,0.15)'}` }}>
            <motion.div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: "var(--gold-accent)" }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════ SECTORS ═══════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "القطاعات" : "SECTORS"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {t("home.sectionTitle.sectors")}
            </h2>
          </SectionReveal>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {sectors.map((s, i) => (
              <motion.div key={i} variants={staggerItem}
                className="glass-card rounded-2xl p-6 text-center group shimmer">
                <div className="w-16 h-16 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500"
                  style={{ boxShadow: isDark ? '0 0 30px rgba(197,165,90,0.08)' : 'none' }}>
                  <s.icon size={26} className="t-gold" />
                </div>
                <h3 className="text-sm font-bold t-primary">{s.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS — Timeline ═══════ */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: isDark ? "rgba(197,165,90,0.015)" : "rgba(139,105,20,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "كيف يعمل" : "HOW IT WORKS"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {t("home.sectionTitle.howItWorks")}
            </h2>
          </SectionReveal>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 hidden md:block" style={{
              [isRTL ? 'right' : 'left']: '39px',
              width: '1px',
              background: `linear-gradient(to bottom, transparent, var(--gold-accent), transparent)`,
              opacity: 0.2
            }} />
            <div className="space-y-5">
              {howItWorks.map((h, i) => (
                <SectionReveal key={i}>
                  <div className="glass-card rounded-2xl p-6 flex items-start gap-5 group shimmer">
                    <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center relative"
                      style={{ background: `linear-gradient(135deg, var(--gold-bg), transparent)`, border: '1px solid var(--gold-border)' }}>
                      <span className="text-lg font-black text-gold-gradient font-['Playfair_Display']">{h.step}</span>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-2xl pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h.icon size={16} className="t-gold" />
                        <h3 className="text-sm sm:text-base font-bold t-primary">{h.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm t-tertiary leading-relaxed mb-3">{h.desc}</p>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                        <Clock size={11} style={{ color: "var(--gold-accent)" }} />
                        <span className="text-[10px] font-bold" style={{ color: "var(--gold-accent)" }}>{h.time}</span>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES — Bento Grid ═══════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "المميزات" : "FEATURES"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {t("home.sectionTitle.features")}
            </h2>
          </SectionReveal>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} variants={staggerItem}
                className="glass-card rounded-2xl p-6 group gradient-border">
                <div className="w-12 h-12 rounded-xl bg-gold-subtle flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500"
                  style={{ boxShadow: isDark ? '0 0 20px rgba(197,165,90,0.06)' : 'none' }}>
                  <f.icon size={22} className="t-gold" />
                </div>
                <h3 className="text-sm font-bold t-primary mb-1">{f.title}</h3>
                <p className="text-[11px] t-tertiary">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ WHY MAHAM EXPO ═══════ */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: isDark ? "rgba(197,165,90,0.015)" : "rgba(139,105,20,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "لماذا نحن" : "WHY US"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient mb-3" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {isArabicLike ? "لماذا Maham Expo؟" : "Why Maham Expo?"}
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
              {isArabicLike ? "منصة متكاملة تجمع بين التقنية والخبرة لتقديم أفضل تجربة معارض" : "An integrated platform combining technology and expertise for the best exhibition experience"}
            </p>
          </SectionReveal>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyMaham.map((w, i) => (
              <motion.div key={i} variants={staggerItem}
                className="glass-card rounded-2xl p-6 group shimmer">
                <div className="w-12 h-12 rounded-xl bg-gold-subtle flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500">
                  <w.icon size={22} className="t-gold" />
                </div>
                <h3 className="text-sm font-bold t-primary mb-2">{w.title}</h3>
                <p className="text-[11px] t-tertiary leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ ROI CALCULATOR ═══════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "حاسبة العائد" : "ROI CALCULATOR"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient mb-3" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {isArabicLike ? "حاسبة العائد على الاستثمار" : "ROI Calculator"}
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
              {isArabicLike ? "احسب العائد المتوقع من مشاركتك في المعرض" : "Calculate the expected return from your exhibition participation"}
            </p>
          </SectionReveal>
          <SectionReveal>
            <div className="glass-card rounded-3xl p-7 sm:p-10 gradient-border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 mb-10">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold t-primary mb-3">
                    <DollarSign size={14} className="t-gold" />
                    {isArabicLike ? "تكلفة الوحدة (ريال)" : "Unit Cost (SAR)"}
                  </label>
                  <input type="number" value={roiCost} onChange={e => setRoiCost(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none gold-focus"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                  <input type="range" min={5000} max={200000} step={1000} value={roiCost} onChange={e => setRoiCost(Number(e.target.value))}
                    className="w-full mt-3 accent-[var(--gold-accent)]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold t-primary mb-3">
                    <CalendarCheck size={14} className="t-gold" />
                    {isArabicLike ? "عدد أيام الفعالية" : "Event Days"}
                  </label>
                  <input type="number" value={roiDays} onChange={e => setRoiDays(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none gold-focus"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                  <input type="range" min={1} max={30} step={1} value={roiDays} onChange={e => setRoiDays(Number(e.target.value))}
                    className="w-full mt-3 accent-[var(--gold-accent)]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold t-primary mb-3">
                    <TrendingUp size={14} className="t-gold" />
                    {isArabicLike ? "إيراد يومي متوقع (ريال)" : "Expected Daily Revenue (SAR)"}
                  </label>
                  <input type="number" value={roiDaily} onChange={e => setRoiDaily(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none gold-focus"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                  <input type="range" min={500} max={100000} step={500} value={roiDaily} onChange={e => setRoiDaily(Number(e.target.value))}
                    className="w-full mt-3 accent-[var(--gold-accent)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl p-5 text-center" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                  <p className="text-[10px] font-bold mb-2" style={{ color: "var(--gold-accent)" }}>{isArabicLike ? "إجمالي الإيراد" : "Total Revenue"}</p>
                  <p className="text-xl font-black text-gold-gradient font-['Playfair_Display']">{roiTotalRevenue.toLocaleString()}</p>
                  <p className="text-[9px] t-muted mt-1">{isArabicLike ? "ريال" : "SAR"}</p>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: roiNetProfit >= 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${roiNetProfit >= 0 ? "rgba(34,197,94,0.20)" : "rgba(239,68,68,0.20)"}` }}>
                  <p className="text-[10px] font-bold mb-2" style={{ color: roiNetProfit >= 0 ? "#22c55e" : "#ef4444" }}>{isArabicLike ? "صافي الربح" : "Net Profit"}</p>
                  <p className="text-xl font-black font-['Playfair_Display']" style={{ color: roiNetProfit >= 0 ? "#22c55e" : "#ef4444" }}>{roiNetProfit.toLocaleString()}</p>
                  <p className="text-[9px] t-muted mt-1">{isArabicLike ? "ريال" : "SAR"}</p>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <p className="text-[10px] font-bold mb-2 t-tertiary">{isArabicLike ? "نقطة التعادل" : "Break-even"}</p>
                  <p className="text-xl font-black t-primary font-['Playfair_Display']">{isArabicLike ? `اليوم ${roiBreakeven}` : `Day ${roiBreakeven}`}</p>
                  <p className="text-[9px] t-muted mt-1">{isArabicLike ? "من أيام الفعالية" : "of event days"}</p>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: roiPercent >= 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${roiPercent >= 0 ? "rgba(34,197,94,0.20)" : "rgba(239,68,68,0.20)"}` }}>
                  <p className="text-[10px] font-bold mb-2" style={{ color: roiPercent >= 0 ? "#22c55e" : "#ef4444" }}>{isArabicLike ? "العائد على الاستثمار" : "ROI"}</p>
                  <p className="text-xl font-black font-['Playfair_Display']" style={{ color: roiPercent >= 0 ? "#22c55e" : "#ef4444" }}>{roiPercent}%</p>
                </div>
              </div>
              <p className="text-[10px] t-muted text-center mt-5">
                {isArabicLike ? "هذا تقدير استرشادي — الأداء الفعلي يعتمد على طبيعة نشاطك" : "This is an indicative estimate — actual performance depends on your business nature"}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 px-6" style={{ backgroundColor: isDark ? "rgba(197,165,90,0.015)" : "rgba(139,105,20,0.02)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <div className="glass-card rounded-3xl p-10 sm:p-14 gradient-border relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(197,165,90,0.06) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(139,105,20,0.03) 0%, transparent 70%)'
              }} />
              <div className="relative z-10">
                <div className="w-18 h-18 rounded-3xl bg-gold-subtle flex items-center justify-center mx-auto mb-8"
                  style={{ width: 72, height: 72, boxShadow: isDark ? '0 0 40px rgba(197,165,90,0.12)' : 'none' }}>
                  <Rocket size={32} className="t-gold" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient mb-4" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
                  {isArabicLike ? "كن أول قصة نجاح" : "Be the First Success Story"}
                </h2>
                <p className="text-sm max-w-xl mx-auto mb-10" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
                  {isArabicLike ? "احجز وحدتك اليوم وابدأ رحلتك معنا" : "Book your unit today and start your journey with us"}
                </p>
                <Link href="/login">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="btn-gold px-12 py-4.5 rounded-2xl text-base font-bold flex items-center gap-3 mx-auto">
                    <Sparkles size={18} />
                    {isArabicLike ? "ابدأ الآن" : "Start Now"}
                    <ArrowIcon size={18} />
                  </motion.button>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════ POLICIES ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "السياسات" : "POLICIES"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {isArabicLike ? "السياسات والأحكام" : "Policies & Terms"}
            </h2>
          </SectionReveal>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "سياسة الدفع" : "Payment Policy"}</h4>
              </div>
              <div className="space-y-2 text-[11px] t-tertiary leading-relaxed">
                <p>{isArabicLike ? "• عربون 5% غير مسترد لتأكيد الحجز" : "• 5% non-refundable deposit to confirm booking"}</p>
                <p>{isArabicLike ? "• المتبقي يُستحق قبل 30 يوماً من المعرض" : "• Remaining due 30 days before exhibition"}</p>
                <p>{isArabicLike ? "• ندعم: بطاقات ائتمان، مدى، Apple Pay، تحويل بنكي" : "• We support: Credit cards, Mada, Apple Pay, Bank transfer"}</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "سياسة الإلغاء" : "Cancellation Policy"}</h4>
              </div>
              <div className="space-y-2 text-[11px] t-tertiary leading-relaxed">
                <p>{isArabicLike ? "• العربون غير مسترد في جميع الحالات" : "• Deposit is non-refundable in all cases"}</p>
                <p>{isArabicLike ? "• إلغاء قبل 15+ يوماً: استرداد 50% من المتبقي" : "• Cancel 15+ days before: 50% refund of remaining"}</p>
                <p>{isArabicLike ? "• إلغاء قبل أقل من 15 يوماً: لا يوجد استرداد" : "• Cancel <15 days: no refund"}</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="t-gold" />
                <h4 className="text-xs font-bold t-primary">{isArabicLike ? "الخصوصية والأمان" : "Privacy & Security"}</h4>
              </div>
              <div className="space-y-2 text-[11px] t-tertiary leading-relaxed">
                <p>{isArabicLike ? "• بياناتك محمية وفق أنظمة المملكة" : "• Your data is protected under Saudi regulations"}</p>
                <p>{isArabicLike ? "• تشفير كامل لجميع المعاملات المالية" : "• Full encryption for all financial transactions"}</p>
                <p>{isArabicLike ? "• لا نشارك بياناتك مع أطراف ثالثة" : "• We never share your data with third parties"}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-24 px-6" style={{ backgroundColor: isDark ? "rgba(197,165,90,0.015)" : "rgba(139,105,20,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "الأسئلة الشائعة" : "FAQ"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {t("home.sectionTitle.faq")}
            </h2>
          </SectionReveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <SectionReveal key={i}>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex items-center justify-between p-5 ${isRTL ? "text-right" : "text-left"}`}>
                    <span className="text-sm font-semibold t-primary">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={16} className="t-tertiary shrink-0" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <div className="h-px mb-4" style={{ background: "var(--glass-border)" }} />
                      <p className="text-xs t-tertiary leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-2xl sm:text-4xl font-bold text-gold-gradient mb-5" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
              {t("home.cta.title")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-gold px-12 py-4.5 rounded-2xl text-base font-bold flex items-center gap-3 mx-auto sm:mx-0">
                  <Sparkles size={18} />
                  {t("home.cta.button")}
                </motion.button>
              </Link>
              <Link href="/browse">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="glass-card px-8 py-4 rounded-2xl text-sm t-secondary flex items-center gap-3 mx-auto sm:mx-0 hover:border-[var(--gold-border)]">
                  <Eye size={16} />
                  {isArabicLike ? "تصفح بدون تسجيل" : "Browse Without Registration"}
                </motion.button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={LOGO_URL} alt="Maham Expo" className="h-12 mb-4 object-contain" style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(197,165,90,0.1))' : 'brightness(0.25) contrast(1.2)' }} />
              <p className="text-xs t-tertiary leading-relaxed">
                {t("home.footer.about")}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-4">{t("common.services")}</h4>
              <div className="space-y-2.5">
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.bookings")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.contracts")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.operations")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.analytics")}</span></Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-4">{t("common.contactUs")}</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="t-gold" />
                  <a href="mailto:info@mahamexpo.sa" className="text-[11px] t-tertiary font-['Inter'] hover:text-[var(--gold-accent)] transition-colors">info@mahamexpo.sa</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={12} className="t-gold" />
                  <a href="mailto:rent@mahamexpo.sa" className="text-[11px] t-tertiary font-['Inter'] hover:text-[var(--gold-accent)] transition-colors">rent@mahamexpo.sa</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="t-gold" />
                  <a href="tel:+966535555900" className="text-[11px] t-tertiary font-['Inter'] hover:text-[var(--gold-accent)] transition-colors" dir="ltr">+966 53 555 5900</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="t-gold" />
                  <a href="tel:+966534778899" className="text-[11px] t-tertiary font-['Inter'] hover:text-[var(--gold-accent)] transition-colors" dir="ltr">+966 53 477 8899</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="t-gold" />
                  <p className="text-[11px] t-tertiary">{t("home.footer.location")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
            <p className="text-[10px] t-muted">
              © {new Date().getFullYear()} Maham Expo for Exhibitions & Conferences — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
