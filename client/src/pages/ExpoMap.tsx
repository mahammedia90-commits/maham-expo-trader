/**
 * ExpoMap — Interactive exhibition map with booth selection
 * Design: Obsidian Glass with gold-highlighted zones
 * Fully localized via useLanguage()
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, ShoppingCart, Info } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const MAP_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/maham-map-overlay-5pDgnRKWBGMyWUThxqDPGn.webp";

type BoothStatus = "available" | "reserved" | "booked";

interface Booth {
  id: string;
  nameAr: string;
  nameEn: string;
  zone: string;
  size: string;
  price: string;
  status: BoothStatus;
  x: number;
  y: number;
}

const booths: Booth[] = [
  { id: "A-01", nameAr: "بوث رئيسي A1", nameEn: "Main Booth A1", zone: "A", size: "6×6 م", price: "45,000", status: "available", x: 15, y: 20 },
  { id: "A-02", nameAr: "بوث A2", nameEn: "Booth A2", zone: "A", size: "4×4 م", price: "28,000", status: "reserved", x: 25, y: 20 },
  { id: "A-03", nameAr: "بوث A3", nameEn: "Booth A3", zone: "A", size: "3×3 م", price: "18,000", status: "available", x: 35, y: 20 },
  { id: "B-01", nameAr: "محل تجاري B1", nameEn: "Shop B1", zone: "B", size: "8×5 م", price: "65,000", status: "booked", x: 15, y: 45 },
  { id: "B-02", nameAr: "محل تجاري B2", nameEn: "Shop B2", zone: "B", size: "6×4 م", price: "42,000", status: "available", x: 30, y: 45 },
  { id: "B-03", nameAr: "كشك B3", nameEn: "Kiosk B3", zone: "B", size: "2×2 م", price: "12,000", status: "available", x: 45, y: 45 },
  { id: "C-01", nameAr: "جناح VIP C1", nameEn: "VIP Wing C1", zone: "C", size: "10×8 م", price: "120,000", status: "reserved", x: 60, y: 25 },
  { id: "C-02", nameAr: "جناح C2", nameEn: "Wing C2", zone: "C", size: "8×6 م", price: "85,000", status: "available", x: 75, y: 25 },
  { id: "D-01", nameAr: "منطقة F&B D1", nameEn: "F&B Area D1", zone: "D", size: "5×5 م", price: "55,000", status: "available", x: 60, y: 60 },
  { id: "D-02", nameAr: "منطقة F&B D2", nameEn: "F&B Area D2", zone: "D", size: "4×4 م", price: "38,000", status: "booked", x: 75, y: 60 },
];

const statusColors: Record<BoothStatus, string> = {
  available: "#4ADE80",
  reserved: "#FBBF24",
  booked: "#F87171",
};

export default function ExpoMap() {
  const { t, lang, isRTL } = useLanguage();
  const [selected, setSelected] = useState<Booth | null>(null);
  const [filter, setFilter] = useState<BoothStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusLabels: Record<BoothStatus, string> = {
    available: t("expoMap.statusAvailable"),
    reserved: t("expoMap.statusReserved"),
    booked: t("expoMap.statusBooked"),
  };

  const filtered = booths.filter(b => {
    if (filter !== "all" && b.status !== filter) return false;
    if (searchQuery && !b.nameAr.includes(searchQuery) && !b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) && !b.id.includes(searchQuery)) return false;
    return true;
  });

  const getBoothName = (b: Booth) => lang === "ar" || lang === "fa" ? b.nameAr : b.nameEn;

  const handleBook = (booth: Booth) => {
    if (booth.status !== "available") {
      toast.error(t("expoMap.unitNotAvailable"));
      return;
    }
    toast.success(`${t("expoMap.addedToCart")} — ${getBoothName(booth)}`);
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 t-tertiary`} />
          <input
            type="text"
            placeholder={t("expoMap.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full glass-card rounded-xl ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm t-primary placeholder:t-muted gold-focus bg-transparent`}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "available", "reserved", "booked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs transition-all ${
                filter === f ? "btn-gold" : "glass-card t-secondary hover:t-secondary"
              }`}
            >
              {f === "all" ? t("common.all") : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map Area */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden relative" style={{ minHeight: "300px" }}>
          <img src={MAP_BG} alt={t("expoMap.title")} className="w-full h-full object-cover absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12]/80 to-transparent" />
          
          {/* Booth Markers */}
          {filtered.map((b) => (
            <motion.button
              key={b.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelected(b)}
              className="absolute z-10 group"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all"
                style={{
                  backgroundColor: `${statusColors[b.status]}20`,
                  border: `2px solid ${statusColors[b.status]}`,
                  boxShadow: selected?.id === b.id ? `0 0 20px ${statusColors[b.status]}40` : "none",
                }}
              >
                <MapPin size={14} style={{ color: statusColors[b.status] }} />
              </div>
              <div className="absolute top-full mt-1 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-card rounded-lg px-2 py-1 whitespace-nowrap">
                  <p className="text-[10px] t-primary">{b.id}</p>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Legend */}
          <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} glass-card rounded-xl p-3`}>
            <p className="text-[10px] t-secondary mb-2">{t("expoMap.legend")}</p>
            <div className="space-y-1.5">
              {(["available", "reserved", "booked"] as BoothStatus[]).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors[key] }} />
                  <span className="text-[10px] t-secondary">{statusLabels[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booth Details Panel */}
        <div className="space-y-4">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold t-primary">{getBoothName(selected)}</h3>
                  <p className="text-xs t-gold/60 font-['Inter']">{selected.id}</p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: `${statusColors[selected.status]}15`,
                    color: statusColors[selected.status],
                    border: `1px solid ${statusColors[selected.status]}30`,
                  }}
                >
                  {statusLabels[selected.status]}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: t("expoMap.unitId"), value: selected.id },
                  { label: t("expoMap.zone"), value: `${t("expoMap.zone")} ${selected.zone}` },
                  { label: t("expoMap.size"), value: selected.size },
                  { label: t("expoMap.price"), value: `${selected.price} ${t("common.sar")}` },
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-xs t-secondary">{d.label}</span>
                    <span className="text-sm t-primary font-medium">{d.value}</span>
                  </div>
                ))}
              </div>

              {selected.status === "available" ? (
                <button
                  onClick={() => handleBook(selected)}
                  className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  {t("expoMap.bookUnit")}
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl text-sm text-center t-tertiary bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                  {t("expoMap.unitNotAvailable")}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center">
              <Info size={32} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-tertiary">{t("expoMap.selectUnit")}</p>
            </div>
          )}

          {/* Available Units List */}
          <div className="glass-card rounded-2xl p-5">
            <h4 className="text-sm font-bold t-primary mb-1">{t("expoMap.availableUnits")}</h4>
            <p className="text-[10px] t-gold/50 font-['Inter'] mb-3">({filtered.filter(b => b.status === "available").length})</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filtered.filter(b => b.status === "available").map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} flex items-center justify-between p-3 rounded-xl transition-all ${
                    selected?.id === b.id ? "bg-gold-subtle border border-[#C5A55A]/20" : "bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)] border border-transparent"
                  }`}
                >
                  <div>
                    <p className="text-xs t-secondary">{getBoothName(b)}</p>
                    <p className="text-[9px] t-tertiary font-['Inter']">{b.size}</p>
                  </div>
                  <span className="text-xs t-gold font-['Inter']">{b.price} {t("common.sar")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
