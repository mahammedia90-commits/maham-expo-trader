/**
 * BrowseExpos — Explore available exhibitions and events
 * Design: Obsidian Glass cards with filtering, search, and booking flow
 * Features: Expo catalog, filters, unit availability, quick book
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Building2, Search, Filter, MapPin, Calendar, Users, Star,
  ChevronDown, Eye, Zap, Clock, CheckCircle, X, ArrowLeft,
  Grid3X3, List, Tag, Shield, Sparkles, CreditCard, Map
} from "lucide-react";
import { toast } from "sonner";

interface Expo {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  totalUnits: number;
  availableUnits: number;
  priceRange: string;
  category: string;
  rating: number;
  featured: boolean;
  status: "open" | "closing_soon" | "full" | "upcoming";
  image: string;
  organizer: string;
}

const expos: Expo[] = [
  {
    id: "EX-001", nameAr: "معرض الرياض الدولي للتقنية", nameEn: "Riyadh International Tech Expo",
    descAr: "أكبر معرض تقني في المنطقة — أكثر من 500 عارض و200 وحدة تجارية متاحة للتجار",
    location: "الرياض — مركز المعارض الدولي", dateStart: "2025-05-01", dateEnd: "2025-05-10",
    totalUnits: 200, availableUnits: 47, priceRange: "12,000 - 120,000", category: "تقنية",
    rating: 4.8, featured: true, status: "open",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    organizer: "Maham Expo Group",
  },
  {
    id: "EX-002", nameAr: "مؤتمر التقنية والابتكار", nameEn: "Tech & Innovation Conference",
    descAr: "مؤتمر متخصص في الابتكار والتقنيات الناشئة — فرص استثمارية وتجارية",
    location: "الرياض — فندق الفيصلية", dateStart: "2025-04-15", dateEnd: "2025-04-18",
    totalUnits: 80, availableUnits: 12, priceRange: "18,000 - 65,000", category: "تقنية",
    rating: 4.6, featured: false, status: "closing_soon",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop",
    organizer: "One May Events",
  },
  {
    id: "EX-003", nameAr: "معرض الأغذية والمشروبات", nameEn: "Food & Beverage Exhibition",
    descAr: "معرض متخصص في قطاع الأغذية والمشروبات — مطاعم، كافيهات، موردين",
    location: "الرياض — بوليفارد وورلد", dateStart: "2025-06-01", dateEnd: "2025-06-15",
    totalUnits: 150, availableUnits: 89, priceRange: "15,000 - 180,000", category: "أغذية",
    rating: 4.9, featured: true, status: "open",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    organizer: "Maham Expo Group",
  },
  {
    id: "EX-004", nameAr: "مؤتمر الذكاء الاصطناعي السعودي", nameEn: "Saudi AI Conference",
    descAr: "مؤتمر عالمي للذكاء الاصطناعي — عروض حية وفرص شراكة",
    location: "الرياض — مركز الملك عبدالعزيز", dateStart: "2025-07-10", dateEnd: "2025-07-13",
    totalUnits: 60, availableUnits: 60, priceRange: "20,000 - 90,000", category: "تقنية",
    rating: 4.7, featured: false, status: "upcoming",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    organizer: "Maham AI",
  },
  {
    id: "EX-005", nameAr: "موسم الرياض — بوليفارد وورلد", nameEn: "Riyadh Season — Boulevard World",
    descAr: "أكبر فعالية ترفيهية في المملكة — مساحات تجارية Retail و F&B",
    location: "الرياض — بوليفارد وورلد", dateStart: "2025-10-01", dateEnd: "2026-03-31",
    totalUnits: 300, availableUnits: 0, priceRange: "25,000 - 500,000", category: "ترفيه",
    rating: 5.0, featured: true, status: "full",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
    organizer: "Boulevard World Project",
  },
  {
    id: "EX-006", nameAr: "معرض العقارات والاستثمار", nameEn: "Real Estate & Investment Expo",
    descAr: "معرض متخصص في العقارات والاستثمار العقاري — فرص حصرية",
    location: "جدة — مركز المعارض", dateStart: "2025-08-20", dateEnd: "2025-08-25",
    totalUnits: 100, availableUnits: 73, priceRange: "10,000 - 75,000", category: "عقارات",
    rating: 4.5, featured: false, status: "open",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    organizer: "Maham Group",
  },
];

const statusConfig: Record<string, { ar: string; en: string; color: string }> = {
  open: { ar: "متاح للحجز", en: "Open", color: "#4ADE80" },
  closing_soon: { ar: "يغلق قريباً", en: "Closing Soon", color: "#FBBF24" },
  full: { ar: "مكتمل", en: "Full", color: "#F87171" },
  upcoming: { ar: "قريباً", en: "Upcoming", color: "#60A5FA" },
};

const categories = ["الكل", "تقنية", "أغذية", "ترفيه", "عقارات"];

export default function BrowseExpos() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExpo, setSelectedExpo] = useState<Expo | null>(null);

  const filtered = expos.filter(e => {
    const matchSearch = search === "" || e.nameAr.includes(search) || e.nameEn.toLowerCase().includes(search.toLowerCase()) || e.descAr.includes(search);
    const matchCategory = activeCategory === "الكل" || e.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white/90">تصفح المعارض والفعاليات</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Browse Exhibitions & Events — {expos.length} Available</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#C5A55A]/15 text-[#C5A55A]" : "glass-card text-white/30"}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#C5A55A]/15 text-[#C5A55A]" : "glass-card text-white/30"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="ابحث عن معرض أو فعالية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-card rounded-xl pr-10 pl-4 py-2.5 text-sm text-white/80 placeholder:text-white/25 gold-focus bg-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-[11px] transition-all ${
                activeCategory === cat ? "btn-gold" : "glass-card text-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "معارض متاحة", value: expos.filter(e => e.status === "open").length, color: "#4ADE80" },
          { label: "يغلق قريباً", value: expos.filter(e => e.status === "closing_soon").length, color: "#FBBF24" },
          { label: "إجمالي الوحدات", value: expos.reduce((a, e) => a + e.totalUnits, 0), color: "#C5A55A" },
          { label: "وحدات متاحة", value: expos.reduce((a, e) => a + e.availableUnits, 0), color: "#60A5FA" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-white/35">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Expo Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        {filtered.map((expo, i) => {
          const sc = statusConfig[expo.status];
          return (
            <motion.div
              key={expo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-colors group cursor-pointer"
              onClick={() => setSelectedExpo(expo)}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={expo.image}
                  alt={expo.nameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-transparent to-transparent" />
                {/* Status Badge */}
                <span
                  className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md"
                  style={{ backgroundColor: `${sc.color}20`, color: sc.color, border: `1px solid ${sc.color}30` }}
                >
                  {sc.ar}
                </span>
                {expo.featured && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] bg-[#C5A55A]/20 text-[#E8D5A3] border border-[rgba(197,165,90,0.3)] flex items-center gap-1">
                    <Sparkles size={10} />
                    مميز
                  </span>
                )}
                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5">
                  <Star size={10} className="text-[#C5A55A] fill-[#C5A55A]" />
                  <span className="text-[10px] text-white/80 font-['Inter']">{expo.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-white/80 mb-0.5">{expo.nameAr}</h3>
                <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-2">{expo.nameEn}</p>
                <p className="text-[11px] text-white/35 line-clamp-2 mb-3">{expo.descAr}</p>

                <div className="flex items-center gap-4 text-[10px] text-white/30 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {expo.location.split("—")[0]}
                  </span>
                  <span className="flex items-center gap-1 font-['Inter']">
                    <Calendar size={10} />
                    {expo.dateStart}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-white/20">الوحدات المتاحة</p>
                    <p className="text-sm font-bold font-['Inter']">
                      <span className={expo.availableUnits > 0 ? "text-green-400" : "text-red-400"}>{expo.availableUnits}</span>
                      <span className="text-white/20 text-[10px]"> / {expo.totalUnits}</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] text-white/20">نطاق الأسعار (SAR)</p>
                    <p className="text-xs text-[#C5A55A] font-['Inter']">{expo.priceRange}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expo Detail Modal */}
      <AnimatePresence>
        {selectedExpo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSelectedExpo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] md:max-h-[85vh] glass-card rounded-2xl z-50 overflow-y-auto"
              dir="rtl"
            >
              {/* Header Image */}
              <div className="relative h-48">
                <img src={selectedExpo.image} alt={selectedExpo.nameAr} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/50 to-transparent" />
                <button
                  onClick={() => setSelectedExpo(null)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 right-6">
                  <h3 className="text-lg font-bold text-white/90">{selectedExpo.nameAr}</h3>
                  <p className="text-xs text-[#C5A55A]/70 font-['Inter']">{selectedExpo.nameEn}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-xs text-white/45 leading-relaxed">{selectedExpo.descAr}</p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MapPin, label: "الموقع", value: selectedExpo.location },
                    { icon: Calendar, label: "الفترة", value: `${selectedExpo.dateStart} — ${selectedExpo.dateEnd}` },
                    { icon: Building2, label: "المنظم", value: selectedExpo.organizer },
                    { icon: Tag, label: "التصنيف", value: selectedExpo.category },
                    { icon: Users, label: "الوحدات المتاحة", value: `${selectedExpo.availableUnits} / ${selectedExpo.totalUnits}` },
                    { icon: CreditCard, label: "نطاق الأسعار", value: `${selectedExpo.priceRange} SAR` },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <d.icon size={12} className="text-[#C5A55A]/50" />
                        <span className="text-[9px] text-white/25">{d.label}</span>
                      </div>
                      <p className="text-xs text-white/60">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Availability Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                    <span>نسبة الإشغال</span>
                    <span className="font-['Inter']">{Math.round(((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100}%`,
                        backgroundColor: selectedExpo.availableUnits === 0 ? "#F87171" : "#C5A55A",
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedExpo.availableUnits > 0 ? (
                    <>
                      <Link href="/map" className="flex-1">
                        <button className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                          <Map size={16} />
                          عرض الخريطة والحجز
                        </button>
                      </Link>
                      <Link href="/messages">
                        <button className="glass-card px-4 py-3 rounded-xl text-xs text-white/50 hover:text-[#C5A55A] transition-colors">
                          استفسار
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => toast.info("سيتم إشعارك عند توفر وحدات | You'll be notified")}
                      className="w-full glass-card py-3 rounded-xl text-sm text-white/40 flex items-center justify-center gap-2"
                    >
                      <Clock size={16} />
                      انضم لقائمة الانتظار
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
