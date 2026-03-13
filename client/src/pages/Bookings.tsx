/**
 * Bookings — Enhanced Booking Management with Full Flow
 * Mobile-first: Cards on mobile, table on desktop
 * Features: Booking details modal (full-screen on mobile), payment links, contract generation
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, Search, Eye, Download, Plus, CheckCircle,
  AlertTriangle, XCircle, Clock, CreditCard, FileText, MapPin,
  Shield, ChevronDown, X, Building2, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BookingGuard from "@/components/BookingGuard";
import { generateBookingPDF } from "@/lib/pdfGenerator";

interface Booking {
  id: string;
  unitAr: string;
  unitEn: string;
  zone: string;
  event: string;
  eventEn: string;
  price: number;
  status: string;
  date: string;
  deposit: number;
  paidAmount: number;
  remainingAmount: number;
  nextPaymentDate: string;
  boothType: string;
  boothSize: string;
  contractId: string;
  services: string[];
}

const bookings: Booking[] = [
  {
    id: "BK-2025-001", unitAr: "بوث رئيسي A21", unitEn: "Main Booth A21", zone: "A",
    event: "معرض الرياض الدولي للتقنية", eventEn: "Riyadh Intl Tech Expo",
    price: 45000, status: "confirmed", date: "2025-03-15", deposit: 2250,
    paidAmount: 22500, remainingAmount: 22500, nextPaymentDate: "2025-04-01",
    boothType: "زاوية — Corner", boothSize: "4×4 م²", contractId: "CT-2025-001",
    services: ["كهرباء 3 فاز", "إنترنت فائق", "تكييف مركزي"],
  },
  {
    id: "BK-2025-002", unitAr: "محل تجاري B12", unitEn: "Shop B12", zone: "B",
    event: "مؤتمر التقنية والابتكار", eventEn: "Tech & Innovation Conference",
    price: 42000, status: "pending_payment", date: "2025-03-12", deposit: 2100,
    paidAmount: 2100, remainingAmount: 39900, nextPaymentDate: "2025-03-20",
    boothType: "مميز — Premium", boothSize: "4×3 م²", contractId: "CT-2025-002",
    services: ["كهرباء", "إنترنت", "موقع مميز"],
  },
  {
    id: "BK-2025-003", unitAr: "جناح VIP D01", unitEn: "VIP Wing D01", zone: "D",
    event: "معرض الأغذية والمشروبات", eventEn: "F&B Exhibition",
    price: 120000, status: "confirmed", date: "2025-03-10", deposit: 6000,
    paidAmount: 120000, remainingAmount: 0, nextPaymentDate: "—",
    boothType: "جزيرة — Island", boothSize: "6×4 م²", contractId: "CT-2025-003",
    services: ["كهرباء 3 فاز", "إنترنت فائق", "تكييف مركزي", "شاشة LED", "تنظيف يومي"],
  },
  {
    id: "BK-2025-004", unitAr: "كشك B33", unitEn: "Kiosk B33", zone: "B",
    event: "معرض الرياض الدولي للتقنية", eventEn: "Riyadh Intl Tech Expo",
    price: 12000, status: "pending_review", date: "2025-03-08", deposit: 600,
    paidAmount: 600, remainingAmount: 11400, nextPaymentDate: "—",
    boothType: "قياسي — Standard", boothSize: "3×3 م²", contractId: "—",
    services: ["كهرباء", "إنترنت"],
  },
  {
    id: "BK-2025-005", unitAr: "منطقة F&B D15", unitEn: "F&B Area D15", zone: "D",
    event: "موسم الرياض — بوليفارد وورلد", eventEn: "Riyadh Season — Boulevard World",
    price: 55000, status: "cancelled", date: "2025-03-05", deposit: 0,
    paidAmount: 0, remainingAmount: 0, nextPaymentDate: "—",
    boothType: "مميز — Premium", boothSize: "4×3 م²", contractId: "—",
    services: [],
  },
  {
    id: "BK-2025-006", unitAr: "بوث A31", unitEn: "Booth A31", zone: "A",
    event: "مؤتمر الذكاء الاصطناعي السعودي", eventEn: "Saudi AI Conference",
    price: 18000, status: "active", date: "2025-02-28", deposit: 900,
    paidAmount: 18000, remainingAmount: 0, nextPaymentDate: "—",
    boothType: "قياسي — Standard", boothSize: "3×3 م²", contractId: "CT-2025-006",
    services: ["كهرباء", "إنترنت"],
  },
];

const statusConfig: Record<string, { ar: string; en: string; color: string; icon: any }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "#4ADE80", icon: CheckCircle },
  active: { ar: "نشط", en: "Active", color: "#60A5FA", icon: Zap },
  pending_payment: { ar: "بانتظار الدفع", en: "Pending Payment", color: "#FBBF24", icon: Clock },
  pending_review: { ar: "قيد المراجعة", en: "Under Review", color: "#A78BFA", icon: AlertTriangle },
  cancelled: { ar: "ملغي", en: "Cancelled", color: "#F87171", icon: XCircle },
};

export default function Bookings() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showGuard, setShowGuard] = useState(false);
  const { canBook, trader } = useAuth();

  const filtered = bookings.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.unitAr.includes(search) && !b.id.includes(search) && !b.event.includes(search)) return false;
    return true;
  });

  const totalValue = bookings.filter(b => b.status !== "cancelled").reduce((a, b) => a + b.price, 0);
  const totalPaid = bookings.reduce((a, b) => a + b.paidAmount, 0);
  const totalRemaining = bookings.reduce((a, b) => a + b.remainingAmount, 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">إدارة الحجوزات</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Booking Management</p>
        </div>
        {canBook ? (
          <Link href="/expos">
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
              <Plus size={14} />
              <span className="hidden sm:inline">حجز جديد</span>
              <span className="sm:hidden">حجز</span>
            </button>
          </Link>
        ) : (
          <button onClick={() => setShowGuard(true)} className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
            <Plus size={14} />
            <span className="hidden sm:inline">حجز جديد</span>
            <span className="sm:hidden">حجز</span>
          </button>
        )}
      </div>

      {/* Summary Cards — 3 cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {[
          { labelAr: "الحجوزات", labelEn: "Total", display: bookings.length.toString(), color: "#C5A55A" },
          { labelAr: "نشطة", labelEn: "Active", display: bookings.filter(b => ["confirmed", "active"].includes(b.status)).length.toString(), color: "#4ADE80" },
          { labelAr: "القيمة", labelEn: "Value", display: `${(totalValue / 1000).toFixed(0)}K`, color: "#C5A55A" },
          { labelAr: "المدفوع", labelEn: "Paid", display: `${(totalPaid / 1000).toFixed(0)}K`, color: "#4ADE80" },
          { labelAr: "المتبقي", labelEn: "Remaining", display: `${(totalRemaining / 1000).toFixed(0)}K`, color: "#FBBF24" },
        ].map((s, i) => (
          <div key={i} className={`glass-card rounded-xl p-2 sm:p-3 text-center ${i >= 3 ? "hidden lg:block" : ""}`}>
            <p className="text-base sm:text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.display}</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary mt-0.5">{s.labelAr}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 t-tertiary" />
          <input
            type="text"
            placeholder="ابحث برقم الحجز أو المعرض..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-card rounded-xl pr-9 pl-3 py-2.5 text-xs t-primary placeholder:t-muted gold-focus bg-transparent"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["all", ...Object.keys(statusConfig)].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${
                filterStatus === s ? "btn-gold" : "glass-card t-secondary"
              }`}
            >
              {s === "all" ? "الكل" : statusConfig[s].ar}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Cards View */}
      <div className="lg:hidden space-y-3">
        {filtered.map((b, i) => {
          const sc = statusConfig[b.status] || statusConfig.confirmed;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedBooking(b)}
              className="glass-card rounded-xl p-3 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold t-primary truncate">{b.unitAr}</p>
                  <p className="text-[10px] t-muted font-['Inter']">{b.id} · Zone {b.zone}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] shrink-0 mr-2"
                  style={{ backgroundColor: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}25` }}
                >
                  <sc.icon size={9} />
                  {sc.ar}
                </span>
              </div>
              <p className="text-[11px] t-tertiary truncate mb-2">{b.event}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[9px] t-muted">السعر</p>
                    <p className="text-xs font-semibold t-secondary font-['Inter']">{b.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] t-muted">المدفوع</p>
                    <p className="text-xs font-semibold text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</p>
                  </div>
                  {b.remainingAmount > 0 && (
                    <div>
                      <p className="text-[9px] t-muted">المتبقي</p>
                      <p className="text-xs font-semibold text-[var(--status-yellow)] font-['Inter']">{b.remainingAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <Eye size={14} className="t-tertiary" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--glass-border)]">
                {["رقم الحجز", "الوحدة", "المعرض", "السعر", "المدفوع", "المتبقي", "الحالة", "إجراءات"].map((h, i) => (
                  <th key={i} className="text-right px-4 py-3 text-[11px] t-tertiary font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = statusConfig[b.status] || statusConfig.confirmed;
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs t-gold font-['Inter'] font-medium">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs t-primary">{b.unitAr}</p>
                      <p className="text-[9px] t-tertiary font-['Inter']">{b.unitEn} · Zone {b.zone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs t-secondary line-clamp-1">{b.event}</p>
                      <p className="text-[9px] t-muted font-['Inter'] line-clamp-1">{b.eventEn}</p>
                    </td>
                    <td className="px-4 py-3 text-xs t-secondary font-['Inter']">{b.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-['Inter']">
                      <span className={b.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}>
                        {b.remainingAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                        style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                        <sc.icon size={10} />
                        {sc.ar}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:t-gold transition-colors" title="عرض التفاصيل">
                          <Eye size={14} />
                        </button>
                        {b.status === "pending_payment" && (
                          <Link href="/payments">
                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--status-yellow)] transition-colors" title="الدفع">
                              <CreditCard size={14} />
                            </button>
                          </Link>
                        )}
                        {b.contractId !== "—" && (
                          <Link href="/contracts">
                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:text-purple-400 transition-colors" title="العقد">
                              <FileText size={14} />
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal — full-screen on mobile */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[560px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir="rtl"
            >
              <div style={{ background: "var(--modal-bg)" }}>
                {/* Drag handle on mobile */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
                </div>

                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10" style={{ background: "var(--modal-bg)", borderBottom: "1px solid var(--glass-border)" }}>
                  <div>
                    <h3 className="text-base font-bold t-primary">تفاصيل الحجز</h3>
                    <p className="text-[10px] t-gold font-['Inter']">{selectedBooking.id}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="px-4 sm:px-6 py-4 space-y-4">
                  {/* Unit + Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold t-primary">{selectedBooking.unitAr}</p>
                      <p className="text-[10px] t-muted font-['Inter']">{selectedBooking.unitEn} · Zone {selectedBooking.zone}</p>
                      <p className="text-xs t-tertiary mt-1">{selectedBooking.event}</p>
                    </div>
                    {(() => {
                      const sc = statusConfig[selectedBooking.status] || statusConfig.confirmed;
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] shrink-0"
                          style={{ backgroundColor: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                          <sc.icon size={10} />
                          {sc.ar}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Details Grid — 2 cols */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "نوع الوحدة", value: selectedBooking.boothType },
                      { label: "المساحة", value: selectedBooking.boothSize },
                      { label: "تاريخ الحجز", value: selectedBooking.date },
                      { label: "العقد", value: selectedBooking.contractId },
                    ].map((d, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-[9px] t-muted mb-0.5">{d.label}</p>
                        <p className="text-xs t-secondary font-medium">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Financial Summary */}
                  <div className="rounded-xl p-3" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <h4 className="text-[11px] font-bold t-secondary mb-2">الملخص المالي</h4>
                    <div className="space-y-1.5">
                      {[
                        { label: "السعر الإجمالي", value: `${selectedBooking.price.toLocaleString()} ر.س`, color: "var(--text-secondary)" },
                        { label: "العربون (5%)", value: `${selectedBooking.deposit.toLocaleString()} ر.س`, color: "var(--text-secondary)" },
                        { label: "المدفوع", value: `${selectedBooking.paidAmount.toLocaleString()} ر.س`, color: "var(--status-green)" },
                      ].map((f, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="t-tertiary">{f.label}</span>
                          <span className="font-['Inter']" style={{ color: f.color }}>{f.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-1.5 mt-1.5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="t-secondary font-bold">المتبقي</span>
                        <span className={`font-bold font-['Inter'] ${selectedBooking.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}`}>
                          {selectedBooking.remainingAmount.toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  {selectedBooking.services.length > 0 && (
                    <div>
                      <p className="text-[10px] t-tertiary mb-1.5">الخدمات المشمولة</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedBooking.services.map((s, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg text-[10px] t-secondary" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 pb-2">
                    {selectedBooking.remainingAmount > 0 && (
                      <Link href="/payments" className="flex-1">
                        <button className="w-full btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                          <CreditCard size={14} />
                          الدفع الآن
                        </button>
                      </Link>
                    )}
                    {selectedBooking.contractId !== "—" && (
                      <Link href="/contracts">
                        <button className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5">
                          <FileText size={13} />
                          العقد
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        toast.info("جاري إنشاء التقرير...");
                        try {
                          await generateBookingPDF({
                            bookingId: selectedBooking.id,
                            expoName: selectedBooking.eventEn || selectedBooking.event,
                            boothNumber: selectedBooking.unitEn.match(/[A-Z]\d+/)?.[0] || selectedBooking.unitEn,
                            boothType: selectedBooking.boothType.split("—")[1]?.trim() || selectedBooking.boothType.split(" — ")[1] || selectedBooking.boothType,
                            boothSize: selectedBooking.boothSize.replace("م²", "sqm"),
                            status: statusConfig[selectedBooking.status]?.en || selectedBooking.status,
                            startDate: selectedBooking.date,
                            endDate: selectedBooking.nextPaymentDate,
                            totalCost: selectedBooking.price,
                            paidAmount: selectedBooking.paidAmount,
                            remaining: selectedBooking.remainingAmount,
                            services: selectedBooking.services.map(s => {
                              const map: Record<string,string> = {'كهرباء 3 فاز':'3-Phase Power','إنترنت فائق':'High-Speed Internet','تكييف مركزي':'Central AC','كهرباء':'Electricity','إنترنت':'Internet','موقع مميز':'Premium Location','شاشة LED':'LED Screen','تنظيف يومي':'Daily Cleaning'};
                              return map[s] || s;
                            }),
                            traderName: trader?.name || "Trader",
                            traderCompany: trader?.companyName || "Trader Company",
                          });
                          toast.success("تم تحميل تقرير الحجز بنجاح!");
                        } catch { toast.error("حدث خطأ في إنشاء التقرير"); }
                      }}
                      className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      تحميل
                    </button>
                  </div>
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
