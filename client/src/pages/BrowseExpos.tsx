/**
 * BrowseExpos — Explore real 2026 Saudi exhibitions and events
 * RULES:
 * 1. Anyone can browse — no restrictions
 * 2. Only KYC-verified traders can book a unit
 * 3. Booking creates a real record in AuthContext (pending_payment)
 * 4. Payment → Contract flow handled in Payments page
 * 5. Investor/organizer info is NEVER shown to traders
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Building2, Search, MapPin, Calendar, Star,
  Clock, X, Grid3X3, List, Sparkles, CreditCard, Map,
  Users, TrendingUp, Filter, ChevronDown, Eye
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingGuard from "@/components/BookingGuard";
import { events2026, eventCategories, eventStats, type ExpoEvent, type ExpoUnit } from "@/data/events2026";

export default function BrowseExpos() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExpo, setSelectedExpo] = useState<ExpoEvent | null>(null);
  const [showGuard, setShowGuard] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price" | "rating" | "availability">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState("الكل");
  const { canBook, addNotification, addPendingBooking, addBooking } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const cities = useMemo(() => {
    const set = new Set(events2026.map(e => e.city));
    return ["الكل", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let result = events2026.filter(e => {
      const matchSearch = search === "" ||
        e.nameAr.includes(search) ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.descAr.includes(search) ||
        e.venue.includes(search) ||
        e.categoryEn.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "الكل" || e.category === activeCategory;
      const matchCity = cityFilter === "الكل" || e.city === cityFilter;
      return matchSearch && matchCategory && matchCity;
    });

    // Sort
    switch (sortBy) {
      case "date":
        result.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
        break;
      case "price":
        result.sort((a, b) => {
          const pa = parseInt(a.priceRange.replace(/[^0-9]/g, ""));
          const pb = parseInt(b.priceRange.replace(/[^0-9]/g, ""));
          return pa - pb;
        });
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "availability":
        result.sort((a, b) => b.availableUnits - a.availableUnits);
        break;
    }
    return result;
  }, [search, activeCategory, cityFilter, sortBy]);

  const getStatusStyle = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      open: { label: t("expos.open"), color: "var(--status-green)" },
      closing_soon: { label: t("expos.closingSoon"), color: "var(--status-yellow)" },
      full: { label: t("expos.full"), color: "var(--status-red)" },
      upcoming: { label: t("expos.upcoming"), color: "var(--status-blue)" },
    };
    return map[status] || { label: status, color: "var(--text-tertiary)" };
  };

  /** Book a specific unit — creates real booking record */
  const handleBookUnit = (expo: ExpoEvent, unit: ExpoUnit) => {
    if (!canBook) {
      setSelectedExpo(null);
      setShowUnitPicker(false);
      setShowGuard(true);
      return;
    }

    const newBooking = addBooking({
      expoId: expo.id,
      expoNameAr: expo.nameAr,
      expoNameEn: expo.nameEn,
      unitAr: unit.nameAr,
      unitEn: unit.nameEn,
      zone: unit.zone,
      boothType: unit.type,
      boothSize: unit.size,
      price: unit.price,
      deposit: unit.deposit,
      services: unit.services,
      location: expo.location,
    });

    addPendingBooking();
    addNotification({
      type: "booking",
      titleAr: `حجز جديد — ${unit.nameAr}`,
      titleEn: `New Booking — ${unit.nameEn}`,
      message: `تم إنشاء حجز ${unit.nameAr} في ${expo.nameAr}. رقم الحجز: ${newBooking.id}. يرجى إكمال الدفع لتأكيد الحجز وإصدار العقد.`,
      link: "/payments",
    });

    setSelectedExpo(null);
    setShowUnitPicker(false);
    toast.success(`تم إنشاء الحجز ${newBooking.id} بنجاح! انتقل للمدفوعات لإكمال الدفع وإصدار العقد`);
    navigate("/payments");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("expos.title")}</h2>
          <p className="text-[10px] sm:text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>{events2026.length} {t("expos.eventsAvailable")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <Filter size={16} />
          </button>
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
        <div className="flex-1 relative">
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 t-muted ${isRTL ? 'right-3' : 'left-3'}`} />
          <input type="text" placeholder={t("expos.search")} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full glass-card rounded-xl py-2.5 text-xs sm:text-sm t-primary placeholder:t-muted gold-focus ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`} style={{ backgroundColor: "var(--input-bg)" }} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {eventCategories.slice(0, 8).map((cat) => (
            <button key={cat.ar} onClick={() => setActiveCategory(cat.ar)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${activeCategory === cat.ar ? "btn-gold" : "glass-card t-secondary"}`}>
              {cat.ar}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card rounded-xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] t-muted mb-1 block">{t("expos.city")}</label>
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-2 py-1.5 text-xs t-secondary">
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] t-muted mb-1 block">{t("expos.sortBy")}</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-2 py-1.5 text-xs t-secondary">
                  <option value="date">{t("expos.sort.date")}</option>
                  <option value="price">{t("expos.sort.price")}</option>
                  <option value="rating">{t("expos.sort.rating")}</option>
                  <option value="availability">{t("expos.sort.availability")}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] t-muted mb-1 block">{t("expos.remainingCategories")}</label>
                <div className="flex gap-1 flex-wrap">
                  {eventCategories.slice(8).map(cat => (
                    <button key={cat.ar} onClick={() => setActiveCategory(cat.ar)}
                      className={`px-1.5 py-0.5 rounded text-[9px] ${activeCategory === cat.ar ? "btn-gold" : "glass-card t-muted"}`}>
                      {cat.ar}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setActiveCategory("الكل"); setCityFilter("الكل"); setSortBy("date"); }}
                  className="text-[10px] t-gold underline">{t("expos.resetFilters")}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: t("expos.eventsAvailable"), value: eventStats.openEvents, color: "var(--status-green)", icon: Building2 },
          { label: t("expos.closingSoonCount"), value: eventStats.closingSoon, color: "var(--status-yellow)", icon: Clock },
          { label: t("expos.totalUnits"), value: eventStats.totalUnits.toLocaleString(), color: "var(--gold-accent)", icon: TrendingUp },
          { label: t("expos.availableUnitsCount"), value: eventStats.availableUnits.toLocaleString(), color: "var(--status-blue)", icon: Users },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-2 sm:p-3 text-center">
            <s.icon size={14} className="mx-auto mb-1" style={{ color: s.color, opacity: 0.7 }} />
            <p className="text-base sm:text-lg font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] t-muted">{filtered.length} {t("expos.results")} {search && `${t("expos.for")} "${search}"`}</p>
      </div>

      {/* Expo Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" : "space-y-3"}>
        {filtered.map((expo, i) => {
          const sc = getStatusStyle(expo.status);
          return (
            <motion.div key={expo.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setSelectedExpo(expo)}>
              <div className="relative h-36 sm:h-44 overflow-hidden">
                <img src={expo.image} alt={expo.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), transparent, transparent)" }} />
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md"
                  style={{ backgroundColor: `color-mix(in srgb, ${sc.color} 15%, transparent)`, color: sc.color, border: `1px solid color-mix(in srgb, ${sc.color} 25%, transparent)` }}>
                  {sc.label}
                </span>
                {expo.featured && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] bg-gold-subtle border-gold flex items-center gap-1"
                    style={{ color: "var(--gold-light)", border: "1px solid var(--gold-border)" }}>
                    <Sparkles size={10} /> {t("expos.featured")}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <Star size={10} style={{ color: "var(--gold-accent)", fill: "var(--gold-accent)" }} />
                  <span className="text-[10px] text-white font-['Inter']">{expo.rating}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <Eye size={10} className="text-white/70" />
                  <span className="text-[10px] text-white/70 font-['Inter']">{expo.footfall.split(" ")[0]}</span>
                </div>
              </div>
              <div className="p-3 sm:p-4 overflow-hidden">
                <h3 className="text-sm font-bold t-primary mb-0.5 truncate">{expo.nameAr}</h3>
                <p className="text-[10px] t-gold font-['Inter'] mb-2 truncate" style={{ opacity: 0.6 }}>{expo.nameEn}</p>
                <p className="text-[11px] t-tertiary line-clamp-2 mb-3 break-words">{expo.descAr}</p>
                <div className="flex items-center gap-3 text-[10px] t-muted mb-3 flex-wrap">
                  <span className="flex items-center gap-1 shrink-0"><MapPin size={10} />{expo.city}</span>
                  <span className="flex items-center gap-1 font-['Inter'] shrink-0"><Calendar size={10} />{expo.dateStart}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="shrink-0">
                    <p className="text-[9px] t-muted">{t("expos.availableUnits")}</p>
                    <p className="text-sm font-bold font-['Inter']">
                      <span style={{ color: expo.availableUnits > 0 ? "var(--status-green)" : "var(--status-red)" }}>{expo.availableUnits}</span>
                      <span className="t-muted text-[10px]"> / {expo.totalUnits}</span>
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-[9px] t-muted">{t("expos.priceRange")} ({t("expos.sar")})</p>
                    <p className="text-xs t-gold font-['Inter']">{expo.priceRange}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <Search size={40} className="mx-auto t-muted mb-3" style={{ opacity: 0.3 }} />
          <p className="text-sm t-tertiary">{t("expos.noResults")}</p>
          <p className="text-[10px] t-muted mt-1">{t("expos.tryDifferent")}</p>
        </div>
      )}

      {/* Expo Detail Modal */}
      <AnimatePresence>
        {selectedExpo && !showUnitPicker && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setSelectedExpo(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[600px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }} dir="rtl">
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="relative h-36 sm:h-48">
                <img src={selectedExpo.image} alt={selectedExpo.nameAr} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), color-mix(in srgb, var(--surface-dark) 50%, transparent), transparent)" }} />
                <button onClick={() => setSelectedExpo(null)} className="absolute top-4 left-4 p-2 rounded-full t-secondary" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 right-6">
                  <h3 className="text-lg font-bold t-primary">{selectedExpo.nameAr}</h3>
                  <p className="text-xs t-gold font-['Inter']" style={{ opacity: 0.7 }}>{selectedExpo.nameEn}</p>
                </div>
              </div>

              <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
                <p className="text-xs t-tertiary leading-relaxed">{selectedExpo.descAr}</p>
                <p className="text-[10px] t-muted font-['Inter'] leading-relaxed">{selectedExpo.descEn}</p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { icon: MapPin, label: t("expos.location"), value: selectedExpo.location },
                    { icon: Calendar, label: t("expos.period"), value: `${selectedExpo.dateStart} — ${selectedExpo.dateEnd}` },
                    { icon: Building2, label: t("expos.venue"), value: selectedExpo.venue },
                    { icon: Star, label: t("expos.category"), value: `${selectedExpo.category} · ${selectedExpo.categoryEn}` },
                    { icon: Users, label: t("expos.visitors"), value: selectedExpo.footfall },
                    { icon: CreditCard, label: t("expos.priceRange"), value: `${selectedExpo.priceRange} ${t("expos.sar")}` },
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
                    <span>{t("expos.occupancy")}</span>
                    <span className="font-['Inter']">{Math.round(((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100}%`, backgroundColor: selectedExpo.availableUnits === 0 ? "var(--status-red)" : "var(--gold-accent)" }} />
                  </div>
                  <div className="flex justify-between text-[9px] t-muted mt-1">
                    <span>{t("expos.availableUnits")}: {selectedExpo.availableUnits}</span>
                    <span>{t("expos.total")}: {selectedExpo.totalUnits}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-2">
                  {selectedExpo.availableUnits > 0 && (selectedExpo.status === "open" || selectedExpo.status === "closing_soon") ? (
                    <>
                      <Link href="/map" className="flex-1">
                        <button className="w-full btn-gold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
                          <Map size={15} /> {t("expos.viewMap")}
                        </button>
                      </Link>
                      <button onClick={() => {
                        if (!canBook) { setSelectedExpo(null); setShowGuard(true); return; }
                        setShowUnitPicker(true);
                      }} className="glass-card px-3 py-2.5 sm:py-3 rounded-xl text-xs t-gold transition-colors flex items-center justify-center gap-1.5">
                        <CreditCard size={14} /> {t("expos.bookNow")}
                      </button>
                    </>
                  ) : selectedExpo.status === "upcoming" ? (
                    <button onClick={() => { toast.info("سيتم إشعارك عند فتح باب الحجز"); setSelectedExpo(null); }}
                      className="w-full glass-card py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm t-tertiary flex items-center justify-center gap-2">
                      <Clock size={15} /> {t("expos.notifyOpen")}
                    </button>
                  ) : (
                    <button onClick={() => { toast.info("سيتم إشعارك عند توفر وحدات"); setSelectedExpo(null); }}
                      className="w-full glass-card py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm t-tertiary flex items-center justify-center gap-2">
                      <Clock size={15} /> {t("expos.waitlist")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unit Picker Modal — select which unit to book */}
      <AnimatePresence>
        {showUnitPicker && selectedExpo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setShowUnitPicker(false)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }} dir="rtl">
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold t-primary">{t("expos.selectUnit")}</h3>
                    <p className="text-[10px] t-gold/50 font-['Inter']">{selectedExpo.nameEn}</p>
                  </div>
                  <button onClick={() => setShowUnitPicker(false)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>

                {/* KYC Requirement Notice */}
                {!canBook && (
                  <div className="p-3 rounded-xl mb-3 bg-[var(--status-red)]/5 border border-[var(--status-red)]/10">
                    <p className="text-[11px] text-[var(--status-red)]">{t("expos.kycRequired")}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedExpo.units.filter(u => u.available).map((unit) => (
                    <div key={unit.id} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--gold-border)] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs t-primary font-semibold">{unit.nameAr}</p>
                          <p className="text-[9px] t-muted font-['Inter']">{unit.nameEn} · Zone {unit.zone}</p>
                        </div>
                        <p className="text-sm font-bold t-gold font-['Inter']">{unit.price.toLocaleString()} <span className="text-[9px] t-muted">ر.س</span></p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] t-tertiary mb-2">
                        <span>{unit.type}</span>
                        <span>{unit.size}</span>
                        <span>{t("expos.deposit")}: {unit.deposit.toLocaleString()} {t("expos.sar")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {unit.services.map((s, j) => (
                          <span key={j} className="px-1.5 py-0.5 rounded text-[8px] t-muted" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>{s}</span>
                        ))}
                      </div>
                      <button onClick={() => handleBookUnit(selectedExpo, unit)}
                        className="w-full btn-gold py-2 rounded-lg text-[11px] flex items-center justify-center gap-1.5">
                        <CreditCard size={12} /> {t("expos.bookUnit")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BookingGuard isOpen={showGuard} onClose={() => setShowGuard(false)} onProceedToKYC={() => setShowGuard(false)} />
    </div>
  );
}
