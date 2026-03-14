/**
 * Home — Smart Trader Portal Landing Page
 * Fully localized with useLanguage() — supports 6 languages
 * Updated: BUG-01 to BUG-04 fixed, FEAT-01/03/04/12 added
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
  Eye, MessageSquare, Bell, CalendarCheck, Layers, Target, Rocket, Check,
  Calculator, Search, Percent, DollarSign
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

  // ROI Calculator state (FEAT-12)
  const [roiCost, setRoiCost] = useState(25000);
  const [roiDays, setRoiDays] = useState(5);
  const [roiDaily, setRoiDaily] = useState(8000);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
    {
      step: "01", title: isArabicLike ? "تصفح المعارض" : "Browse Exhibitions", icon: Search,
      desc: isArabicLike ? "ابحث بالموقع أو القطاع أو السعر. خريطة تفاعلية تُظهر المتاح والمحجوز." : "Search by location, sector, or price. Interactive map shows available and booked units.",
      time: isArabicLike ? "دقيقتان" : "2 minutes"
    },
    {
      step: "02", title: isArabicLike ? "اختر وحدتك" : "Select Your Unit", icon: MapPin,
      desc: isArabicLike ? "قارن بين الوحدات واستشر مساعد MAHAM AI لأفضل توصية تناسب نشاطك." : "Compare units and consult MAHAM AI assistant for the best recommendation for your business.",
      time: isArabicLike ? "5 دقائق" : "5 minutes"
    },
    {
      step: "03", title: isArabicLike ? "احجز وادفع" : "Book & Pay", icon: CreditCard,
      desc: isArabicLike ? "عربون 5% فقط لتأكيد مكانك. الباقي قبل 30 يوماً من الفعالية." : "Only 5% deposit to confirm your spot. Remaining due 30 days before the event.",
      time: isArabicLike ? "أقل من 5 دقائق" : "Less than 5 minutes"
    },
    {
      step: "04", title: isArabicLike ? "وقّع العقد" : "Sign Contract", icon: FileText,
      desc: isArabicLike ? "عقد إلكتروني معتمد يُولَّد تلقائياً. وقّع رقمياً واستلم نسختك فوراً." : "An approved electronic contract is auto-generated. Sign digitally and receive your copy instantly.",
      time: isArabicLike ? "دقيقة واحدة" : "1 minute"
    },
    {
      step: "05", title: isArabicLike ? "جهّز وانطلق" : "Prepare & Launch", icon: Rocket,
      desc: isArabicLike ? "تلقَّ إشعارات موعد التجهيز وتابع أداءك عبر لوحة التحكم الذكية." : "Receive setup date notifications and track your performance via the smart dashboard.",
      time: isArabicLike ? "مستمر" : "Ongoing"
    },
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
    { q: isArabicLike ? "ما هي سياسة الإلغاء والاسترداد؟" : "What is the cancellation and refund policy?", a: isArabicLike ? "العربون (5%) غير مسترد. الإلغاء قبل 15 يوماً أو أكثر من المعرض: استرداد 50% من المبلغ المتبقي. الإلغاء قبل أقل من 15 يوماً: لا يوجد استرداد." : "The deposit (5%) is non-refundable. Cancellation 15+ days before the exhibition: 50% refund of remaining amount. Less than 15 days: no refund." },
    { q: isArabicLike ? "هل يمكنني اختيار موقع الجناح بنفسي؟" : "Can I choose my booth location?", a: isArabicLike ? "نعم، المنصة توفر خريطة تفاعلية لكل معرض تعرض جميع الأجنحة المتاحة مع أسعارها ومساحاتها. يمكنك اختيار الموقع المناسب وتثبيته لمدة 30 دقيقة." : "Yes, the platform provides an interactive map for each exhibition showing all available booths with prices and sizes. You can choose your preferred location and hold it for 30 minutes." },
    { q: isArabicLike ? "ما هي الخدمات التشغيلية المتاحة؟" : "What operational services are available?", a: isArabicLike ? "نوفر خدمات شاملة: تصميم البوث، كهرباء وتكييف، إنترنت واتصالات، لوجستيات ونقل، طباعة ولافتات، أمن وسلامة، تنظيف وصيانة، وتقنية وشاشات. جميعها تُطلب وتُدفع عبر المنصة." : "We provide comprehensive services: booth design, electricity & AC, internet & telecom, logistics & transport, printing & signage, security, cleaning & maintenance, and tech & AV. All ordered and paid through the platform." },
    { q: isArabicLike ? "هل يوجد عقد رسمي؟" : "Is there an official contract?", a: isArabicLike ? "نعم، يتم إنشاء عقد إلكتروني رسمي يتضمن جميع البنود المالية والقانونية. يجب على التاجر مراجعة العقد والموافقة عليه قبل الدفع. يمكن تحميل نسخة PDF في أي وقت." : "Yes, an official electronic contract is generated with all financial and legal terms. The trader must review and accept the contract before payment. A PDF copy can be downloaded anytime." },
    { q: isArabicLike ? "كيف أتواصل مع الدعم؟" : "How do I contact support?", a: isArabicLike ? "يمكنك التواصل عبر البريد: info@mahamexpo.sa أو rent@mahamexpo.sa، أو الهاتف: +966535555900 أو +966534778899، أو عبر المساعد الذكي داخل المنصة." : "Contact us via email: info@mahamexpo.sa or rent@mahamexpo.sa, phone: +966535555900 or +966534778899, or through the AI assistant inside the platform." },
    // 3 new FAQs (FEAT-04)
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

          {/* CTA Buttons — FEAT-01: added guest browse */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <button className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto sm:mx-0">
                <Sparkles size={18} />
                {isArabicLike ? "احجز وحدتك الآن" : "Book Your Unit Now"}
                <ArrowIcon size={18} />
              </button>
            </Link>
            <Link href="/browse">
              <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0 hover:border-[var(--gold-border)] transition-all">
                <Eye size={16} />
                {isArabicLike ? "استعرض المعارض بدون تسجيل" : "Browse Exhibitions Without Registration"}
              </button>
            </Link>
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

      {/* ═══════ HOW IT WORKS — FEAT-03 ═══════ */}
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
                  <p className="text-xs t-tertiary leading-relaxed mb-2">{h.desc}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} style={{ color: "var(--gold-accent)", opacity: 0.6 }} />
                    <span className="text-[10px] font-medium" style={{ color: "var(--gold-accent)", opacity: 0.8 }}>{h.time}</span>
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

      {/* ═══════ WHY MAHAM EXPO ═══════ */}
      <section className="py-20 px-6">
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

      {/* ═══════ ROI CALCULATOR — FEAT-12 ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
              {isArabicLike ? "حاسبة العائد على الاستثمار" : "ROI Calculator"}
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
              {isArabicLike ? "احسب العائد المتوقع من مشاركتك في المعرض" : "Calculate the expected return from your exhibition participation"}
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold t-primary mb-2">
                  <DollarSign size={13} className="t-gold" />
                  {isArabicLike ? "تكلفة الوحدة (ريال)" : "Unit Cost (SAR)"}
                </label>
                <input type="number" value={roiCost} onChange={e => setRoiCost(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                <input type="range" min={5000} max={200000} step={1000} value={roiCost} onChange={e => setRoiCost(Number(e.target.value))}
                  className="w-full mt-2 accent-[var(--gold-accent)]" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold t-primary mb-2">
                  <CalendarCheck size={13} className="t-gold" />
                  {isArabicLike ? "عدد أيام الفعالية" : "Event Days"}
                </label>
                <input type="number" value={roiDays} onChange={e => setRoiDays(Number(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                <input type="range" min={1} max={30} step={1} value={roiDays} onChange={e => setRoiDays(Number(e.target.value))}
                  className="w-full mt-2 accent-[var(--gold-accent)]" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold t-primary mb-2">
                  <TrendingUp size={13} className="t-gold" />
                  {isArabicLike ? "إيراد يومي متوقع (ريال)" : "Expected Daily Revenue (SAR)"}
                </label>
                <input type="number" value={roiDaily} onChange={e => setRoiDaily(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                <input type="range" min={500} max={100000} step={500} value={roiDaily} onChange={e => setRoiDaily(Number(e.target.value))}
                  className="w-full mt-2 accent-[var(--gold-accent)]" />
              </div>
            </div>
            {/* Results */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: "var(--gold-accent)" }}>{isArabicLike ? "إجمالي الإيراد" : "Total Revenue"}</p>
                <p className="text-lg font-bold text-gold-gradient font-['Inter']">{roiTotalRevenue.toLocaleString()}</p>
                <p className="text-[9px] t-muted">{isArabicLike ? "ريال" : "SAR"}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: roiNetProfit >= 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${roiNetProfit >= 0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: roiNetProfit >= 0 ? "#22c55e" : "#ef4444" }}>{isArabicLike ? "صافي الربح" : "Net Profit"}</p>
                <p className="text-lg font-bold font-['Inter']" style={{ color: roiNetProfit >= 0 ? "#22c55e" : "#ef4444" }}>{roiNetProfit.toLocaleString()}</p>
                <p className="text-[9px] t-muted">{isArabicLike ? "ريال" : "SAR"}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <p className="text-[10px] font-medium mb-1 t-tertiary">{isArabicLike ? "نقطة التعادل" : "Break-even"}</p>
                <p className="text-lg font-bold t-primary font-['Inter']">{isArabicLike ? `اليوم ${roiBreakeven}` : `Day ${roiBreakeven}`}</p>
                <p className="text-[9px] t-muted">{isArabicLike ? "من أيام الفعالية" : "of event days"}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: roiPercent >= 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${roiPercent >= 0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                <p className="text-[10px] font-medium mb-1" style={{ color: roiPercent >= 0 ? "#22c55e" : "#ef4444" }}>{isArabicLike ? "العائد على الاستثمار" : "ROI"}</p>
                <p className="text-lg font-bold font-['Inter']" style={{ color: roiPercent >= 0 ? "#22c55e" : "#ef4444" }}>{roiPercent}%</p>
              </div>
            </div>
            <p className="text-[10px] t-muted text-center mt-4">
              {isArabicLike ? "هذا تقدير استرشادي — الأداء الفعلي يعتمد على طبيعة نشاطك" : "This is an indicative estimate — actual performance depends on your business nature"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA — BUG-04: replaced success stories with CTA ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="glass-card rounded-2xl p-8 sm:p-12" style={{ border: "1px solid var(--gold-border)" }}>
              <div className="w-16 h-16 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-6">
                <Rocket size={28} className="t-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">
                {isArabicLike ? "كن أول قصة نجاح" : "Be the First Success Story"}
              </h2>
              <p className="text-sm max-w-xl mx-auto mb-8" style={{ color: isDark ? 'var(--text-tertiary)' : '#4A4A65' }}>
                {isArabicLike ? "احجز وحدتك اليوم وابدأ رحلتك معنا" : "Book your unit today and start your journey with us"}
              </p>
              <Link href="/login">
                <button className="btn-gold px-10 py-4 rounded-xl text-base font-semibold flex items-center gap-2 mx-auto">
                  <Sparkles size={18} />
                  {isArabicLike ? "ابدأ الآن" : "Start Now"}
                  <ArrowIcon size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ POLICIES ═══════ */}
      <section className="py-16 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
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

      {/* ═══════ FAQ — FEAT-04 ═══════ */}
      <section className="py-20 px-6">
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

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 px-6" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
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
              <Link href="/browse">
                <button className="glass-card px-8 py-3.5 rounded-xl text-sm t-secondary flex items-center gap-2 mx-auto sm:mx-0 hover:border-[var(--gold-border)] transition-all">
                  <Eye size={16} />
                  {isArabicLike ? "تصفح بدون تسجيل" : "Browse Without Registration"}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER — BUG-02 + BUG-03 fixed ═══════ */}
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
                {/* BUG-03: Made footer links real <Link> tags */}
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.bookings")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.contracts")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.operations")}</span></Link>
                <Link href="/expos"><span className="text-[11px] t-tertiary hover:text-[var(--gold-accent)] transition-colors cursor-pointer block">{t("nav.analytics")}</span></Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold t-primary mb-3">
                {t("common.contactUs")}
              </h4>
              <div className="space-y-2">
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
                  <p className="text-[11px] t-tertiary">
                    {t("home.footer.location")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
            {/* BUG-02: Dynamic year */}
            <p className="text-[10px] t-muted">
              © {new Date().getFullYear()} Maham Expo for Exhibitions & Conferences — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
