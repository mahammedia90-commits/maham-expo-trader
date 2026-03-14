/**
 * Browse — Public Exhibition Browsing (No Login Required)
 * FEAT-02: Guest can browse exhibitions without registration
 * Shows expo cards with CTA to register for booking
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";
import {
  Search, Filter, MapPin, Calendar, Users, Star, ArrowLeft, ArrowRight,
  Building2, Mic2, ShoppingBag, Cpu, Heart, Sparkles, Eye, Tag,
  Sun, Moon, Globe, Check, Lock, LogIn
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";
const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

type ExpoCategory = "all" | "exhibition" | "conference" | "event" | "festival";

interface Expo {
  id: string; nameAr: string; nameEn: string; descAr: string; descEn: string;
  category: ExpoCategory; cityAr: string; cityEn: string; venue: string;
  dateStart: string; dateEnd: string; totalBooths: number; availableBooths: number;
  priceFrom: number; priceTo: number; rating: number; visitors: string;
  image: string; featured: boolean; aiRecommended: boolean; organizer: string; tags: string[];
}

const expos: Expo[] = [
  { id: "expo-001", nameAr: "ليالي رمضان في كافد KAFD", nameEn: "Ramadan Nights at KAFD", descAr: "فعالية رمضانية مميزة في ساحة الوادي بمركز الملك عبدالله المالي", descEn: "Premium Ramadan experience at KAFD Al Wadi Square", category: "event", cityAr: "الرياض", cityEn: "Riyadh", venue: "KAFD — Al Wadi Square", dateStart: "2026-03-01", dateEnd: "2026-03-29", totalBooths: 120, availableBooths: 35, priceFrom: 8000, priceTo: 45000, rating: 4.9, visitors: "50,000 – 80,000", image: EXPO_HALL, featured: true, aiRecommended: true, organizer: "Maham Expo + KAFD", tags: ["رمضان", "أغذية", "ترفيه"] },
  { id: "expo-002", nameAr: "فعالية عيد الفطر في كافد KAFD", nameEn: "Eid Al-Fitr Activation at KAFD", descAr: "احتفالية عيد الفطر المبارك في ساحة الوادي", descEn: "Eid Al-Fitr celebration at Al Wadi Square", category: "festival", cityAr: "الرياض", cityEn: "Riyadh", venue: "KAFD — Al Wadi Square", dateStart: "2026-03-30", dateEnd: "2026-04-01", totalBooths: 80, availableBooths: 22, priceFrom: 6000, priceTo: 35000, rating: 4.8, visitors: "30,000 – 60,000", image: CONFERENCE, featured: true, aiRecommended: true, organizer: "Maham Expo + KAFD", tags: ["عيد", "ترفيه", "عائلات"] },
  { id: "expo-003", nameAr: "مهرجان الطعام KAFD Time Out Food Festival", nameEn: "KAFD Time Out Food Festival", descAr: "مهرجان الطعام الأكبر في الرياض بالتعاون مع Time Out", descEn: "Riyadh's largest food festival in partnership with Time Out", category: "exhibition", cityAr: "الرياض", cityEn: "Riyadh", venue: "KAFD — Al Wadi Square", dateStart: "2026-04-15", dateEnd: "2026-05-15", totalBooths: 150, availableBooths: 48, priceFrom: 10000, priceTo: 55000, rating: 4.7, visitors: "20,000 – 40,000", image: EXPO_HALL, featured: true, aiRecommended: true, organizer: "Maham Expo + KAFD", tags: ["أغذية", "مشروبات", "مطاعم"] },
  { id: "expo-004", nameAr: "موسم الرياض — بوليفارد وورلد", nameEn: "Riyadh Season — Boulevard World", descAr: "أكبر فعالية ترفيهية في الشرق الأوسط", descEn: "The largest entertainment destination in the Middle East", category: "festival", cityAr: "الرياض", cityEn: "Riyadh", venue: "بوليفارد وورلد — موسم الرياض", dateStart: "2026-10-01", dateEnd: "2027-03-31", totalBooths: 500, availableBooths: 180, priceFrom: 15000, priceTo: 200000, rating: 4.8, visitors: "500,000+", image: CONFERENCE, featured: true, aiRecommended: true, organizer: "Maham Expo + GEA", tags: ["ترفيه", "مطاعم", "تجزئة"] },
  { id: "expo-005", nameAr: "مشروع على خطاه — Ala Khutah Project", nameEn: "Ala Khutah Project — On His Steps", descAr: "مشروع تشغيل مواقع البيع بالتجزئة والأغذية والمشروبات ضمن موسم الرياض", descEn: "Retail & F&B site operations within Riyadh Season", category: "event", cityAr: "الرياض", cityEn: "Riyadh", venue: "مشروع على خطاه — موسم الرياض", dateStart: "2026-01-20", dateEnd: "2026-07-20", totalBooths: 200, availableBooths: 64, priceFrom: 5000, priceTo: 80000, rating: 4.6, visitors: "200,000+", image: EXPO_HALL, featured: false, aiRecommended: true, organizer: "Maham Expo + One May", tags: ["تجزئة", "أغذية", "موسم الرياض"] },
  { id: "expo-006", nameAr: "معرض الفنون والثقافة في كافد KAFD", nameEn: "KAFD Art Shows & Cultural Parades", descAr: "معارض فنية وعروض ثقافية في المساحات العامة لمركز الملك عبدالله المالي", descEn: "Art exhibitions & cultural parades across KAFD public spaces", category: "exhibition", cityAr: "الرياض", cityEn: "Riyadh", venue: "KAFD Public Spaces", dateStart: "2026-01-01", dateEnd: "2026-12-31", totalBooths: 60, availableBooths: 28, priceFrom: 4000, priceTo: 25000, rating: 4.5, visitors: "10,000 – 30,000", image: CONFERENCE, featured: false, aiRecommended: false, organizer: "Maham Expo + KAFD", tags: ["فنون", "ثقافة", "معارض"] },
];

export default function Browse() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, isRTL, dir } = useLanguage();
  const isDark = theme === "dark";
  const isArabicLike = ["ar", "fa"].includes(lang);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExpoCategory>("all");
  const [langOpen, setLangOpen] = useState(false);

  const getExpoName = (e: Expo) => isArabicLike ? e.nameAr : e.nameEn;
  const getExpoDesc = (e: Expo) => isArabicLike ? e.descAr : e.descEn;
  const getExpoCity = (e: Expo) => isArabicLike ? e.cityAr : e.cityEn;

  const getCategoryLabel = (cat: ExpoCategory): string => {
    const map: Record<ExpoCategory, string> = {
      all: isArabicLike ? "الكل" : "All",
      exhibition: isArabicLike ? "معارض" : "Exhibitions",
      conference: isArabicLike ? "مؤتمرات" : "Conferences",
      event: isArabicLike ? "فعاليات" : "Events",
      festival: isArabicLike ? "مهرجانات" : "Festivals",
    };
    return map[cat];
  };

  const categories: { value: ExpoCategory; icon: any }[] = [
    { value: "all", icon: Building2 }, { value: "exhibition", icon: ShoppingBag },
    { value: "conference", icon: Mic2 }, { value: "event", icon: Cpu }, { value: "festival", icon: Heart },
  ];

  const filtered = useMemo(() => {
    return expos.filter((e) => {
      const matchSearch = search === "" || e.nameAr.includes(search) || e.nameEn.toLowerCase().includes(search.toLowerCase()) || e.tags.some(tg => tg.includes(search));
      const matchCategory = category === "all" || e.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }} dir={dir}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{ background: isDark ? "rgba(10,10,18,0.85)" : "rgba(250,250,245,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src={LOGO_URL} alt="Maham Expo" className="h-8 object-contain cursor-pointer" style={{ filter: isDark ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="p-2 rounded-lg flex items-center gap-1" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <Globe size={16} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-[100]" onClick={() => setLangOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 z-[101] rounded-xl overflow-hidden shadow-2xl min-w-[160px]" style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)" }}>
                    <div className="p-1.5">
                      {[{ code: "ar", flag: "🇸🇦", name: "العربية" }, { code: "en", flag: "🇺🇸", name: "English" }, { code: "zh", flag: "🇨🇳", name: "中文" }, { code: "ru", flag: "🇷🇺", name: "Русский" }, { code: "fa", flag: "🇮🇷", name: "فارسی" }, { code: "tr", flag: "🇹🇷", name: "Türkçe" }].map(l => (
                        <button key={l.code} onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                          style={{ color: lang === l.code ? "var(--gold-light)" : "var(--text-secondary)" }}>
                          <span>{l.flag}</span><span className="flex-1 text-start">{l.name}</span>
                          {lang === l.code && <Check size={12} style={{ color: "var(--gold-accent)" }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link href="/login">
              <button className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <LogIn size={14} />
                {isArabicLike ? "تسجيل الدخول" : "Login"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2">
            {isArabicLike ? "استعرض المعارض والفعاليات" : "Browse Exhibitions & Events"}
          </h1>
          <p className="text-sm" style={{ color: isDark ? "var(--text-tertiary)" : "#4A4A65" }}>
            {isArabicLike ? "تصفح بحرية — سجّل عندما تكون جاهزاً للحجز" : "Browse freely — register when you're ready to book"}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search size={16} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} style={{ color: "var(--text-muted)" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabicLike ? "ابحث عن معرض أو فعالية..." : "Search for an exhibition or event..."}
              className={`w-full rounded-xl ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm outline-none`}
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 justify-center">
          {categories.map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all"
              style={{
                background: category === c.value ? "rgba(197,165,90,0.15)" : "var(--glass-bg)",
                border: `1px solid ${category === c.value ? "rgba(197,165,90,0.3)" : "var(--glass-border)"}`,
                color: category === c.value ? "var(--gold-accent)" : "var(--text-secondary)",
              }}>
              <c.icon size={14} />
              <span>{getCategoryLabel(c.value)}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          {isArabicLike ? `عرض ${filtered.length} نتيجة` : `Showing ${filtered.length} results`}
        </p>

        {/* Expo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((expo, i) => (
            <motion.div key={expo.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl overflow-hidden group" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <div className="relative h-40 overflow-hidden">
                <img src={expo.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,18,0.8), transparent)" }} />
                <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex gap-1.5`}>
                  {expo.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] flex items-center gap-1" style={{ background: "rgba(197,165,90,0.2)", border: "1px solid rgba(197,165,90,0.3)", color: "#E8D5A3" }}>
                      <Star size={9} /> {isArabicLike ? "مميز" : "Featured"}
                    </span>
                  )}
                </div>
                <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                  <span className="px-2 py-0.5 rounded-md text-[9px]" style={{ background: "rgba(10,10,18,0.8)", color: "var(--text-secondary)" }}>
                    {getCategoryLabel(expo.category)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold mb-1 line-clamp-1" style={{ color: "var(--text-primary)" }}>{getExpoName(expo)}</h3>
                <p className="text-[11px] mb-3 line-clamp-2 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{getExpoDesc(expo)}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} style={{ color: "var(--gold-accent)", opacity: 0.6 }} />
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{getExpoCity(expo)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} style={{ color: "var(--gold-accent)", opacity: 0.6 }} />
                    <span className="text-[10px] font-['Inter']" style={{ color: "var(--text-secondary)" }}>{expo.dateStart}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={11} style={{ color: "var(--gold-accent)", opacity: 0.6 }} />
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{expo.visitors}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={11} style={{ color: "#FBBF24" }} />
                    <span className="text-[10px] font-['Inter']" style={{ color: "var(--text-secondary)" }}>{expo.rating}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {expo.tags.map((tag, ti) => (
                    <span key={ti} className="px-1.5 py-0.5 rounded text-[8px] flex items-center gap-0.5" style={{ background: "var(--glass-bg)", color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}>
                      <Tag size={7} /> {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 mb-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div>
                    <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{isArabicLike ? "يبدأ من" : "Starting from"}</p>
                    <p className="text-sm font-bold font-['Inter']" style={{ color: "var(--gold-accent)" }}>{expo.priceFrom.toLocaleString()} <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{isArabicLike ? "ريال" : "SAR"}</span></p>
                  </div>
                  <p className="text-[10px]" style={{ color: "#22c55e" }}>{expo.availableBooths} {isArabicLike ? "وحدة متاحة" : "units available"}</p>
                </div>
                <Link href="/login">
                  <button className="w-full btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Lock size={12} />
                    {isArabicLike ? "سجّل للحجز" : "Register to Book"}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{isArabicLike ? "لا توجد نتائج" : "No results found"}</p>
          </div>
        )}

        {/* Register CTA */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl p-8 max-w-lg mx-auto" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
            <Sparkles size={24} className="mx-auto mb-3" style={{ color: "var(--gold-accent)" }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--gold-accent)" }}>
              {isArabicLike ? "جاهز للحجز؟" : "Ready to Book?"}
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
              {isArabicLike ? "سجّل الآن واحصل على وصول كامل للخريطة التفاعلية والحجز الفوري" : "Register now and get full access to interactive maps and instant booking"}
            </p>
            <Link href="/login">
              <button className="btn-gold px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto">
                <LogIn size={16} />
                {isArabicLike ? "إنشاء حساب مجاني" : "Create Free Account"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 mt-8" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <p className="text-center text-[10px]" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Maham Expo for Exhibitions & Conferences — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
