/**
 * ExpoList — Browse Exhibitions, Conferences & Events
 * Design: Obsidian Glass with filterable cards, AI recommendations
 * Features: Search, filter by category/date/city, AI-recommended expos
 * Fully localized via useLanguage()
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Search, Filter, MapPin, Calendar, Users, Star, ArrowLeft, ArrowRight,
  Building2, Mic2, ShoppingBag, Cpu, Heart, Sparkles,
  Eye, Bookmark, BookmarkCheck, Tag
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const EXPO_HALL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-expo-hall-m4YgR74uTYE4NetFPntQ7y.webp";
const CONFERENCE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-conference-4KK48Bkfs9akEJfJ3nqc96.webp";

type ExpoCategory = "all" | "exhibition" | "conference" | "event" | "festival";

interface Expo {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  category: ExpoCategory;
  cityAr: string;
  cityEn: string;
  venue: string;
  dateStart: string;
  dateEnd: string;
  totalBooths: number;
  availableBooths: number;
  priceFrom: number;
  priceTo: number;
  rating: number;
  visitors: string;
  image: string;
  featured: boolean;
  aiRecommended: boolean;
  organizer: string;
  tags: string[];
}

const expos: Expo[] = [
  {
    id: "expo-001",
    nameAr: "معرض الرياض الدولي للتقنية والابتكار",
    nameEn: "Riyadh International Tech & Innovation Expo",
    descAr: "أكبر معرض تقني في المنطقة يجمع أكثر من 500 شركة عالمية ومحلية في مجالات التقنية والذكاء الاصطناعي والأمن السيبراني",
    descEn: "The largest tech expo in the region bringing together 500+ global and local companies",
    category: "exhibition",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    venue: "مركز الرياض الدولي للمؤتمرات والمعارض",
    dateStart: "2025-04-15",
    dateEnd: "2025-04-19",
    totalBooths: 350,
    availableBooths: 87,
    priceFrom: 8000,
    priceTo: 75000,
    rating: 4.8,
    visitors: "45,000+",
    image: EXPO_HALL,
    featured: true,
    aiRecommended: true,
    organizer: "Maham Expo",
    tags: ["تقنية", "ذكاء اصطناعي", "أمن سيبراني"],
  },
  {
    id: "expo-002",
    nameAr: "مؤتمر الذكاء الاصطناعي السعودي",
    nameEn: "Saudi AI Conference 2025",
    descAr: "مؤتمر متخصص في تطبيقات الذكاء الاصطناعي في القطاعات الحكومية والخاصة مع ورش عمل تفاعلية",
    descEn: "Specialized conference on AI applications in government and private sectors",
    category: "conference",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    venue: "فندق الفيصلية",
    dateStart: "2025-05-10",
    dateEnd: "2025-05-12",
    totalBooths: 120,
    availableBooths: 34,
    priceFrom: 12000,
    priceTo: 50000,
    rating: 4.9,
    visitors: "8,000+",
    image: CONFERENCE,
    featured: true,
    aiRecommended: true,
    organizer: "Maham Expo",
    tags: ["ذكاء اصطناعي", "تعلم آلي", "بيانات"],
  },
  {
    id: "expo-003",
    nameAr: "معرض الأغذية والمشروبات الدولي",
    nameEn: "International Food & Beverage Exhibition",
    descAr: "معرض متخصص في صناعة الأغذية والمشروبات يضم أكثر من 200 علامة تجارية محلية ودولية",
    descEn: "Specialized F&B exhibition featuring 200+ local and international brands",
    category: "exhibition",
    cityAr: "جدة",
    cityEn: "Jeddah",
    venue: "مركز جدة للمعارض",
    dateStart: "2025-06-01",
    dateEnd: "2025-06-05",
    totalBooths: 200,
    availableBooths: 42,
    priceFrom: 5000,
    priceTo: 45000,
    rating: 4.6,
    visitors: "30,000+",
    image: EXPO_HALL,
    featured: false,
    aiRecommended: false,
    organizer: "One May Events",
    tags: ["أغذية", "مشروبات", "مطاعم"],
  },
  {
    id: "expo-004",
    nameAr: "فعالية موسم الرياض — بوليفارد وورلد",
    nameEn: "Riyadh Season — Boulevard World",
    descAr: "أكبر فعالية ترفيهية في الشرق الأوسط تضم مناطق ترفيهية ومطاعم ومحلات تجارية من جميع أنحاء العالم",
    descEn: "The largest entertainment event in the Middle East with global dining and retail",
    category: "festival",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    venue: "بوليفارد وورلد",
    dateStart: "2025-10-01",
    dateEnd: "2026-03-31",
    totalBooths: 500,
    availableBooths: 156,
    priceFrom: 15000,
    priceTo: 200000,
    rating: 4.7,
    visitors: "500,000+",
    image: CONFERENCE,
    featured: true,
    aiRecommended: true,
    organizer: "Maham Expo + GEA",
    tags: ["ترفيه", "مطاعم", "تجزئة"],
  },
  {
    id: "expo-005",
    nameAr: "معرض الصحة والجمال",
    nameEn: "Health & Beauty Expo",
    descAr: "معرض متخصص في منتجات العناية الشخصية والصحة والجمال مع عروض حصرية",
    descEn: "Specialized expo for personal care, health and beauty products",
    category: "exhibition",
    cityAr: "الدمام",
    cityEn: "Dammam",
    venue: "مركز الظهران للمعارض",
    dateStart: "2025-07-20",
    dateEnd: "2025-07-24",
    totalBooths: 150,
    availableBooths: 68,
    priceFrom: 4000,
    priceTo: 30000,
    rating: 4.4,
    visitors: "20,000+",
    image: EXPO_HALL,
    featured: false,
    aiRecommended: false,
    organizer: "Maham Expo",
    tags: ["صحة", "جمال", "عناية"],
  },
  {
    id: "expo-006",
    nameAr: "مؤتمر ريادة الأعمال والاستثمار",
    nameEn: "Entrepreneurship & Investment Conference",
    descAr: "مؤتمر يجمع رواد الأعمال والمستثمرين وصناديق رأس المال الجريء لبناء شراكات استراتيجية",
    descEn: "Conference bringing together entrepreneurs, investors and VCs for strategic partnerships",
    category: "conference",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    venue: "مركز الملك عبدالعزيز الدولي",
    dateStart: "2025-09-05",
    dateEnd: "2025-09-07",
    totalBooths: 80,
    availableBooths: 23,
    priceFrom: 10000,
    priceTo: 60000,
    rating: 4.5,
    visitors: "5,000+",
    image: CONFERENCE,
    featured: false,
    aiRecommended: true,
    organizer: "Maham Expo",
    tags: ["ريادة أعمال", "استثمار", "شراكات"],
  },
];

export default function ExpoList() {
  const { t, lang, isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExpoCategory>("all");
  const [city, setCity] = useState("all");
  const [savedExpos, setSavedExpos] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const isArabicLike = lang === "ar" || lang === "fa";

  const getExpoName = (e: Expo) => isArabicLike ? e.nameAr : e.nameEn;
  const getExpoDesc = (e: Expo) => isArabicLike ? e.descAr : e.descEn;
  const getExpoCity = (e: Expo) => isArabicLike ? e.cityAr : e.cityEn;

  const getCategoryLabel = (cat: ExpoCategory): string => {
    const map: Record<ExpoCategory, string> = {
      all: t("common.all"),
      exhibition: t("expoList.exhibitions"),
      conference: t("expoList.conferences"),
      event: t("expoList.events"),
      festival: t("expoList.festivals"),
    };
    return map[cat];
  };

  const categories: { value: ExpoCategory; icon: any }[] = [
    { value: "all", icon: Building2 },
    { value: "exhibition", icon: ShoppingBag },
    { value: "conference", icon: Mic2 },
    { value: "event", icon: Cpu },
    { value: "festival", icon: Heart },
  ];

  const filtered = useMemo(() => {
    return expos.filter((e) => {
      const matchSearch = search === "" ||
        e.nameAr.includes(search) ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some(tg => tg.includes(search));
      const matchCategory = category === "all" || e.category === category;
      const matchCity = city === "all" ||
        e.cityAr === city ||
        e.cityEn.toLowerCase() === city.toLowerCase();
      return matchSearch && matchCategory && matchCity;
    });
  }, [search, category, city]);

  const aiRecommended = expos.filter(e => e.aiRecommended);

  const toggleSave = (id: string) => {
    setSavedExpos(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    toast.success(savedExpos.includes(id) ? t("expoList.removed") : t("expoList.saved"));
  };

  const DetailArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold t-primary">{t("expoList.browseTitle")}</h2>
      </div>

      {/* AI Recommendations Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 border-[rgba(197,165,90,0.15)]"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#C5A55A]" />
          <h3 className="text-sm font-bold text-[#C5A55A]">{t("expoList.aiRecommendations")}</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {aiRecommended.map((e) => (
            <Link key={e.id} href={`/expo/${e.id}`}>
              <div className="min-w-[220px] p-3 rounded-xl bg-[var(--glass-bg)] border border-[rgba(197,165,90,0.1)] hover:border-[rgba(197,165,90,0.25)] transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={10} className="text-[#C5A55A]" />
                  <span className="text-[10px] text-[#C5A55A]">{t("expoList.aiRecommendedForYou")}</span>
                </div>
                <p className="text-xs font-bold t-primary mb-1 line-clamp-1">{getExpoName(e)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] t-tertiary">{getExpoCity(e)}</span>
                  <span className="text-[10px] text-green-400/70">{e.availableBooths} {t("expoList.unitsAvailable")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 t-tertiary`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("expoList.searchPlaceholder")}
              className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm t-secondary placeholder:t-muted focus:outline-none gold-focus`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`glass-card px-4 rounded-xl flex items-center gap-2 text-sm transition-colors ${showFilters ? "text-[#C5A55A] border-[rgba(197,165,90,0.25)]" : "t-secondary"}`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">{t("expoList.filter")}</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                category === c.value
                  ? "bg-[#C5A55A]/15 border border-[rgba(197,165,90,0.3)] text-[#E8D5A3]"
                  : "glass-card t-secondary hover:t-secondary"
              }`}
            >
              <c.icon size={14} />
              <span>{getCategoryLabel(c.value)}</span>
            </button>
          ))}
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] t-tertiary mb-1.5 block">{t("expoList.cityFilter")}</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
                  >
                    <option value="all" className="bg-[#0A0A12]">{t("common.all")}</option>
                    <option value="الرياض" className="bg-[#0A0A12]">{isArabicLike ? "الرياض" : "Riyadh"}</option>
                    <option value="جدة" className="bg-[#0A0A12]">{isArabicLike ? "جدة" : "Jeddah"}</option>
                    <option value="الدمام" className="bg-[#0A0A12]">{isArabicLike ? "الدمام" : "Dammam"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] t-tertiary mb-1.5 block">{t("expoList.priceFrom")}</label>
                  <input type="number" placeholder={`0 ${t("common.sar")}`} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus" />
                </div>
                <div>
                  <label className="text-[10px] t-tertiary mb-1.5 block">{t("expoList.priceTo")}</label>
                  <input type="number" placeholder={`200,000 ${t("common.sar")}`} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus" />
                </div>
                <div>
                  <label className="text-[10px] t-tertiary mb-1.5 block">{t("expoList.dateFilter")}</label>
                  <input type="date" className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs t-tertiary">
          {t("expoList.showingResults")} <span className="text-[#C5A55A] font-['Inter']">{filtered.length}</span>
        </p>
      </div>

      {/* Expo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((expo, i) => (
          <motion.div
            key={expo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img src={expo.image} alt={expo.nameEn} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-transparent to-transparent" />
              
              {/* Badges */}
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex gap-2`}>
                {expo.featured && (
                  <span className="px-2 py-1 rounded-lg bg-[#C5A55A]/20 border border-[rgba(197,165,90,0.3)] text-[9px] text-[#E8D5A3] flex items-center gap-1">
                    <Star size={10} /> {t("expoList.featured")}
                  </span>
                )}
                {expo.aiRecommended && (
                  <span className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-[9px] text-purple-300 flex items-center gap-1">
                    <Sparkles size={10} /> AI
                  </span>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={(e) => { e.preventDefault(); toggleSave(expo.id); }}
                className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors`}
              >
                {savedExpos.includes(expo.id) ? (
                  <BookmarkCheck size={14} className="text-[#C5A55A]" />
                ) : (
                  <Bookmark size={14} className="t-secondary" />
                )}
              </button>

              {/* Category Badge */}
              <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                <span className="px-2.5 py-1 rounded-lg bg-[#0A0A12]/80 text-[10px] t-secondary">
                  {getCategoryLabel(expo.category)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-bold t-primary mb-1 line-clamp-1">{getExpoName(expo)}</h3>
              <p className="text-xs t-tertiary mb-4 line-clamp-2 leading-relaxed">{getExpoDesc(expo)}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#C5A55A]/60" />
                  <span className="text-[11px] t-secondary">{getExpoCity(expo)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-[#C5A55A]/60" />
                  <span className="text-[11px] t-secondary font-['Inter']">{expo.dateStart}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-[#C5A55A]/60" />
                  <span className="text-[11px] t-secondary">{expo.visitors} {t("expoList.visitor")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-[#FBBF24]" />
                  <span className="text-[11px] t-secondary font-['Inter']">{expo.rating}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {expo.tags.map((tag, ti) => (
                  <span key={ti} className="px-2 py-0.5 rounded-md bg-[var(--glass-bg)] text-[9px] t-tertiary flex items-center gap-1">
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>

              {/* Price & Availability */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                <div>
                  <p className="text-[10px] t-tertiary">{t("expoList.startingFrom")}</p>
                  <p className="text-base font-bold text-[#C5A55A] font-['Inter']">
                    {expo.priceFrom.toLocaleString()} <span className="text-xs t-tertiary">{t("common.sar")}</span>
                  </p>
                </div>
                <div className={isRTL ? "text-left" : "text-right"}>
                  <p className="text-[10px] text-green-400/70">{expo.availableBooths} {t("expoList.unitsAvailable")}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Link href={`/expo/${expo.id}`} className="flex-1">
                  <button className="w-full btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                    {t("expoList.viewDetails")}
                    <DetailArrow size={14} />
                  </button>
                </Link>
                <Link href={`/expo/${expo.id}`}>
                  <button className="glass-card px-4 py-2.5 rounded-xl text-xs t-secondary hover:text-[#C5A55A] flex items-center gap-1.5 transition-colors">
                    <Eye size={14} />
                    {t("expoList.viewMap")}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto t-muted mb-4" />
          <p className="text-sm t-tertiary">{t("expoList.noResults")}</p>
        </div>
      )}
    </div>
  );
}
