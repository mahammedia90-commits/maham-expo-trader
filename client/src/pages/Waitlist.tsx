/**
 * Waitlist — Join waiting list for sold-out booths (FEAT-11)
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Clock, Bell, BellRing, CheckCircle, MapPin, Building2, Tag,
  X, ArrowRight, ArrowLeft, Trash2, AlertTriangle, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface WaitlistItem {
  id: string;
  expoId: string;
  expoNameAr: string;
  expoNameEn: string;
  boothCode: string;
  zone: string;
  boothType: string;
  price: number;
  dateAdded: string;
  position: number;
  status: "waiting" | "available" | "expired";
}

export default function Waitlist() {
  const { t, lang, isRTL } = useLanguage();
  const { trader } = useAuth();
  const isArabicLike = ["ar", "fa"].includes(lang);
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  // Demo waitlist data
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      id: "WL-001",
      expoId: "kafd-expo-2026",
      expoNameAr: "معرض KAFD للتقنية والابتكار 2026",
      expoNameEn: "KAFD Technology & Innovation Expo 2026",
      boothCode: "A-01",
      zone: "A",
      boothType: "island",
      price: 180000,
      dateAdded: "2026-03-10",
      position: 2,
      status: "waiting",
    },
    {
      id: "WL-002",
      expoId: "boulevard-world-2026",
      expoNameAr: "بوليفارد وورلد — موسم الرياض 2026",
      expoNameEn: "Boulevard World — Riyadh Season 2026",
      boothCode: "B-05",
      zone: "B",
      boothType: "premium",
      price: 95000,
      dateAdded: "2026-03-08",
      position: 1,
      status: "available",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<WaitlistItem | null>(null);

  const removeFromWaitlist = (id: string) => {
    setWaitlist(prev => prev.filter(w => w.id !== id));
    toast.success(isArabicLike ? "تمت الإزالة من قائمة الانتظار" : "Removed from waitlist");
    setSelectedItem(null);
  };

  const stats = useMemo(() => ({
    total: waitlist.length,
    waiting: waitlist.filter(w => w.status === "waiting").length,
    available: waitlist.filter(w => w.status === "available").length,
  }), [waitlist]);

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      waiting: isArabicLike ? "بانتظار" : "Waiting",
      available: isArabicLike ? "متاح الآن!" : "Available Now!",
      expired: isArabicLike ? "منتهي" : "Expired",
    };
    return map[status] || status;
  };

  const statusColor: Record<string, string> = {
    waiting: "#FBBF24",
    available: "#4ADE80",
    expired: "#F87171",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>
            {isArabicLike ? "قائمة الانتظار" : "Waitlist"}
          </h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Booth Waitlist Management</p>
        </div>
        <Link href="/expos">
          <button className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
            <MapPin size={13} />
            {isArabicLike ? "تصفح المعارض" : "Browse Expos"}
          </button>
        </Link>
      </div>

      {/* Available Now Banner */}
      {stats.available > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <BellRing size={18} className="text-green-400 animate-bounce shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-green-400 font-bold">
              {isArabicLike ? `${stats.available} وحدة أصبحت متاحة!` : `${stats.available} booth(s) now available!`}
            </p>
            <p className="text-[10px] t-muted">
              {isArabicLike ? "سارع بالحجز قبل نفاذ الفرصة" : "Book now before it's taken"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: isArabicLike ? "إجمالي الانتظار" : "Total Waitlist", value: stats.total, color: "#C5A55A" },
          { label: isArabicLike ? "بانتظار" : "Waiting", value: stats.waiting, color: "#FBBF24" },
          { label: isArabicLike ? "متاح الآن" : "Available", value: stats.available, color: "#4ADE80" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] t-tertiary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Waitlist Items */}
      {waitlist.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Bell size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">
            {isArabicLike ? "قائمة الانتظار فارغة" : "Your waitlist is empty"}
          </p>
          <p className="text-[10px] t-muted mb-3">
            {isArabicLike ? "يمكنك الانضمام لقائمة الانتظار من صفحة تفاصيل المعرض عند نفاذ الوحدات" : "Join the waitlist from expo details when booths are sold out"}
          </p>
          <Link href="/expos">
            <button className="btn-gold px-4 py-2 rounded-xl text-xs">
              {isArabicLike ? "تصفح المعارض" : "Browse Expos"}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlist.map((item, i) => {
            const sc = statusColor[item.status];
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="glass-card rounded-xl p-4 cursor-pointer hover:border-[#C5A55A]/20 transition-all active:scale-[0.98]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold t-primary">{item.boothCode}</p>
                      <span className="px-2 py-0.5 rounded-full text-[9px]"
                        style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <p className="text-xs t-tertiary truncate">
                      {isArabicLike ? item.expoNameAr : item.expoNameEn}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-sm font-bold text-[#C5A55A] font-['Inter']">
                      {item.price.toLocaleString()}
                    </p>
                    <p className="text-[8px] t-muted">{t("common.sar")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] t-muted">
                    <span className="flex items-center gap-1">
                      <Building2 size={10} /> {item.boothType}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> Zone {item.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {item.dateAdded}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] t-muted">
                      #{item.position} {isArabicLike ? "في القائمة" : "in queue"}
                    </span>
                  </div>
                </div>

                {item.status === "available" && (
                  <div className="mt-3 flex gap-2">
                    <Link href={`/expos/${item.expoId}`} className="flex-1">
                      <button className="w-full btn-gold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                        <Sparkles size={12} />
                        {isArabicLike ? "احجز الآن" : "Book Now"}
                      </button>
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); removeFromWaitlist(item.id); }}
                      className="glass-card px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* How Waitlist Works */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold t-secondary mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="t-gold" />
          {isArabicLike ? "كيف تعمل قائمة الانتظار؟" : "How does the waitlist work?"}
        </h3>
        <div className="space-y-2">
          {[
            { ar: "عند نفاذ وحدة معينة، يمكنك الانضمام لقائمة الانتظار", en: "When a booth is sold out, you can join the waitlist" },
            { ar: "إذا ألغى التاجر الحالي حجزه، ستتلقى إشعاراً فورياً", en: "If the current trader cancels, you'll receive an instant notification" },
            { ar: "لديك 30 دقيقة لإتمام الحجز قبل انتقال الفرصة للتالي", en: "You have 30 minutes to complete booking before it moves to the next person" },
            { ar: "ترتيبك في القائمة يعتمد على تاريخ الانضمام", en: "Your position is based on when you joined" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C5A55A]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-[#C5A55A]">{i + 1}</span>
              </div>
              <p className="text-[11px] t-tertiary leading-relaxed">
                {isArabicLike ? step.ar : step.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[80vh] z-50 overflow-y-auto rounded-t-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold t-primary">
                    {isArabicLike ? "تفاصيل الانتظار" : "Waitlist Details"}
                  </h3>
                  <button onClick={() => setSelectedItem(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-[#C5A55A]">{selectedItem.boothCode}</p>
                      <p className="text-[10px] t-muted">Zone {selectedItem.zone} · {selectedItem.boothType}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px]"
                      style={{ backgroundColor: `${statusColor[selectedItem.status]}15`, color: statusColor[selectedItem.status] }}>
                      {statusLabel(selectedItem.status)}
                    </span>
                  </div>
                  <p className="text-xs t-tertiary mb-2">
                    {isArabicLike ? selectedItem.expoNameAr : selectedItem.expoNameEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isArabicLike ? "السعر" : "Price"}</p>
                      <p className="t-secondary font-bold font-['Inter']">{selectedItem.price.toLocaleString()} {t("common.sar")}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isArabicLike ? "ترتيبك" : "Position"}</p>
                      <p className="t-secondary font-bold font-['Inter']">#{selectedItem.position}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isArabicLike ? "تاريخ الانضمام" : "Date Joined"}</p>
                      <p className="t-secondary font-['Inter']">{selectedItem.dateAdded}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isArabicLike ? "الحالة" : "Status"}</p>
                      <p style={{ color: statusColor[selectedItem.status] }}>{statusLabel(selectedItem.status)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedItem.status === "available" && (
                    <Link href={`/expos/${selectedItem.expoId}`} className="flex-1">
                      <button className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                        <Sparkles size={14} />
                        {isArabicLike ? "احجز الآن" : "Book Now"}
                      </button>
                    </Link>
                  )}
                  <button onClick={() => removeFromWaitlist(selectedItem.id)}
                    className="glass-card px-4 py-3 rounded-xl text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <Trash2 size={13} />
                    {isArabicLike ? "إزالة" : "Remove"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
