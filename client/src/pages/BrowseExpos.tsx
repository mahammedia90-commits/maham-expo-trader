/**
 * BrowseExpos — Explore available exhibitions and events
 * Theme-aware: uses CSS variables for Light/Dark mode
 * All buttons, modals, and filters are fully functional
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Building2, Search, MapPin, Calendar, Star,
  Clock, X, Grid3X3, List, Sparkles, CreditCard, Map
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BookingGuard from "@/components/BookingGuard";

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

const categories = ["الكل", "تقنية", "أغذية", "ترفيه", "عقارات"];

export default function BrowseExpos() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExpo, setSelectedExpo] = useState<Expo | null>(null);
  const [showGuard, setShowGuard] = useState(false);
  const { canBook } = useAuth();

  const filtered = expos.filter(e => {
    const matchSearch = search === "" || e.nameAr.includes(search) || e.nameEn.toLowerCase().includes(search.toLowerCase()) || e.descAr.includes(search);
    const matchCategory = activeCategory === "الكل" || e.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const getStatusStyle = (status: string) => {
    const map: Record<string, { ar: string; color: string }> = {
      open: { ar: "متاح للحجز", color: "var(--status-green)" },
      closing_soon: { ar: "يغلق قريباً", color: "var(--status-yellow)" },
      full: { ar: "مكتمل", color: "var(--status-red)" },
      upcoming: { ar: "قريباً", color: "var(--status-blue)" },
    };
    return map[status] || { ar: status, color: "var(--text-tertiary)" };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold t-primary">تصفح المعارض والفعاليات</h2>
          <p className="text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>Browse Exhibitions & Events — {expos.length} Available</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 t-muted" />
          <input
            type="text"
            placeholder="ابحث عن معرض أو فعالية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-card rounded-xl pr-10 pl-4 py-2.5 text-sm t-primary placeholder:t-muted gold-focus"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-[11px] transition-all ${
                activeCategory === cat ? "btn-gold" : "glass-card t-secondary"
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
          { label: "معارض متاحة", value: expos.filter(e => e.status === "open").length, color: "var(--status-green)" },
          { label: "يغلق قريباً", value: expos.filter(e => e.status === "closing_soon").length, color: "var(--status-yellow)" },
          { label: "إجمالي الوحدات", value: expos.reduce((a, e) => a + e.totalUnits, 0), color: "var(--gold-accent)" },
          { label: "وحدات متاحة", value: expos.reduce((a, e) => a + e.availableUnits, 0), color: "var(--status-blue)" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] t-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Expo Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        {filtered.map((expo, i) => {
          const sc = getStatusStyle(expo.status);
          return (
            <motion.div
              key={expo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => setSelectedExpo(expo)}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={expo.image}
                  alt={expo.nameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), transparent, transparent)" }} />
                <span
                  className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md"
                  style={{ backgroundColor: `color-mix(in srgb, ${sc.color} 15%, transparent)`, color: sc.color, border: `1px solid color-mix(in srgb, ${sc.color} 25%, transparent)` }}
                >
                  {sc.ar}
                </span>
                {expo.featured && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] bg-gold-subtle border-gold flex items-center gap-1"
                    style={{ color: "var(--gold-light)", border: "1px solid var(--gold-border)" }}>
                    <Sparkles size={10} />
                    مميز
                  </span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <Star size={10} style={{ color: "var(--gold-accent)", fill: "var(--gold-accent)" }} />
                  <span className="text-[10px] text-white font-['Inter']">{expo.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-bold t-primary mb-0.5">{expo.nameAr}</h3>
                <p className="text-[10px] t-gold font-['Inter'] mb-2" style={{ opacity: 0.6 }}>{expo.nameEn}</p>
                <p className="text-[11px] t-tertiary line-clamp-2 mb-3">{expo.descAr}</p>

                <div className="flex items-center gap-4 text-[10px] t-muted mb-3">
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
                    <p className="text-[9px] t-muted">الوحدات المتاحة</p>
                    <p className="text-sm font-bold font-['Inter']">
                      <span style={{ color: expo.availableUnits > 0 ? "var(--status-green)" : "var(--status-red)" }}>{expo.availableUnits}</span>
                      <span className="t-muted text-[10px]"> / {expo.totalUnits}</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] t-muted">نطاق الأسعار (SAR)</p>
                    <p className="text-xs t-gold font-['Inter']">{expo.priceRange}</p>
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
              className="fixed inset-0 z-50 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              onClick={() => setSelectedExpo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] md:max-h-[85vh] modal-solid rounded-2xl z-50 overflow-y-auto"
              dir="rtl"
            >
              <div className="relative h-48">
                <img src={selectedExpo.image} alt={selectedExpo.nameAr} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), color-mix(in srgb, var(--surface-dark) 50%, transparent), transparent)" }} />
                <button
                  onClick={() => setSelectedExpo(null)}
                  className="absolute top-4 left-4 p-2 rounded-full t-secondary"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 right-6">
                  <h3 className="text-lg font-bold t-primary">{selectedExpo.nameAr}</h3>
                  <p className="text-xs t-gold font-['Inter']" style={{ opacity: 0.7 }}>{selectedExpo.nameEn}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-xs t-tertiary leading-relaxed">{selectedExpo.descAr}</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MapPin, label: "الموقع", value: selectedExpo.location },
                    { icon: Calendar, label: "الفترة", value: `${selectedExpo.dateStart} — ${selectedExpo.dateEnd}` },
                    { icon: Building2, label: "المنظم", value: selectedExpo.organizer },
                    { icon: Star, label: "التصنيف", value: selectedExpo.category },
                    { icon: Building2, label: "الوحدات المتاحة", value: `${selectedExpo.availableUnits} / ${selectedExpo.totalUnits}` },
                    { icon: CreditCard, label: "نطاق الأسعار", value: `${selectedExpo.priceRange} SAR` },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded-xl modal-inner">
                      <div className="flex items-center gap-1.5 mb-1">
                        <d.icon size={12} className="t-gold" style={{ opacity: 0.6 }} />
                        <span className="text-[9px] t-muted">{d.label}</span>
                      </div>
                      <p className="text-xs t-secondary">{d.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-[10px] t-muted mb-1.5">
                    <span>نسبة الإشغال</span>
                    <span className="font-['Inter']">{Math.round(((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100}%`,
                        backgroundColor: selectedExpo.availableUnits === 0 ? "var(--status-red)" : "var(--gold-accent)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedExpo.availableUnits > 0 ? (
                    <>
                      {canBook ? (
                        <Link href="/map" className="flex-1">
                          <button className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                            <Map size={16} />
                            عرض الخريطة والحجز
                          </button>
                        </Link>
                      ) : (
                        <button onClick={() => { setSelectedExpo(null); setShowGuard(true); }} className="flex-1 btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                          <Map size={16} />
                          عرض الخريطة والحجز
                        </button>
                      )}
                      <Link href="/messages">
                        <button className="glass-card px-4 py-3 rounded-xl text-xs t-secondary transition-colors">
                          استفسار
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => { toast.info("سيتم إشعارك عند توفر وحدات | You'll be notified"); setSelectedExpo(null); }}
                      className="w-full glass-card py-3 rounded-xl text-sm t-tertiary flex items-center justify-center gap-2"
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

      {/* Booking Guard — blocks booking without KYC */}
      <BookingGuard isOpen={showGuard} onClose={() => setShowGuard(false)} onProceedToKYC={() => setShowGuard(false)} />
    </div>
  );
}
