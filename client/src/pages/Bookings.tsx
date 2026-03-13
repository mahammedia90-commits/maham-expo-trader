/**
 * Bookings — Enhanced Booking Management with Full Flow
 * Design: Obsidian Glass table with status indicators, timeline, actions
 * Features: Booking details modal, payment links, contract generation, countdown
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, Search, Filter, Eye, Download, Plus, CheckCircle,
  AlertTriangle, XCircle, Clock, CreditCard, FileText, MapPin,
  Timer, Shield, Sparkles, ChevronDown, ExternalLink, X, Printer,
  ArrowLeft, Building2, Zap, Phone, Mail, Lock
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BookingGuard from "@/components/BookingGuard";

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
  const { canBook } = useAuth();

  const filtered = bookings.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.unitAr.includes(search) && !b.id.includes(search) && !b.event.includes(search)) return false;
    return true;
  });

  const totalValue = bookings.filter(b => b.status !== "cancelled").reduce((a, b) => a + b.price, 0);
  const totalPaid = bookings.reduce((a, b) => a + b.paidAmount, 0);
  const totalRemaining = bookings.reduce((a, b) => a + b.remainingAmount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold t-primary">إدارة الحجوزات</h2>
          <p className="text-xs t-gold/50 font-['Inter']">Booking Management — Full Lifecycle</p>
        </div>
        {canBook ? (
          <Link href="/expos">
            <button className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
              <Plus size={16} />
              حجز جديد | New Booking
            </button>
          </Link>
        ) : (
          <button onClick={() => setShowGuard(true)} className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <Plus size={16} />
            حجز جديد | New Booking
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { labelAr: "إجمالي الحجوزات", labelEn: "Total", value: bookings.length, display: bookings.length.toString(), color: "#C5A55A" },
          { labelAr: "نشطة / مؤكدة", labelEn: "Active", value: bookings.filter(b => ["confirmed", "active"].includes(b.status)).length, display: bookings.filter(b => ["confirmed", "active"].includes(b.status)).length.toString(), color: "#4ADE80" },
          { labelAr: "القيمة الإجمالية", labelEn: "Total Value", value: totalValue, display: `${(totalValue / 1000).toFixed(0)}K`, color: "#C5A55A" },
          { labelAr: "المدفوع", labelEn: "Paid", value: totalPaid, display: `${(totalPaid / 1000).toFixed(0)}K`, color: "#4ADE80" },
          { labelAr: "المتبقي", labelEn: "Remaining", value: totalRemaining, display: `${(totalRemaining / 1000).toFixed(0)}K`, color: "#FBBF24" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.display}</p>
            <p className="text-[10px] t-tertiary mt-0.5">{s.labelAr}</p>
            <p className="text-[8px] t-muted font-['Inter']">{s.labelEn}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 t-tertiary" />
          <input
            type="text"
            placeholder="ابحث برقم الحجز، اسم الوحدة، أو المعرض..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-card rounded-xl pr-10 pl-4 py-2.5 text-sm t-primary placeholder:t-muted gold-focus bg-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(statusConfig)].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-[11px] transition-all ${
                filterStatus === s ? "btn-gold" : "glass-card t-secondary"
              }`}
            >
              {s === "all" ? "الكل" : statusConfig[s].ar}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
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
                    <td className="px-4 py-3 text-xs text-[var(--status-green)]/70 font-['Inter']">{b.paidAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-['Inter']">
                      <span className={b.remainingAmount > 0 ? "text-[var(--status-yellow)]/70" : "text-[var(--status-green)]/70"}>
                        {b.remainingAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                        style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                      >
                        <sc.icon size={10} />
                        {sc.ar}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:t-gold transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={14} />
                        </button>
                        {b.status === "pending_payment" && (
                          <Link href="/payments">
                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--status-yellow)]/50 hover:text-[var(--status-yellow)] transition-colors" title="الدفع الآن">
                              <CreditCard size={14} />
                            </button>
                          </Link>
                        )}
                        {b.contractId !== "—" && (
                          <Link href="/contracts">
                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:text-purple-400 transition-colors" title="عرض العقد">
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

      {/* Booking Detail Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[85vh] modal-solid rounded-xl sm:rounded-2xl z-50 overflow-y-auto p-3 sm:p-6"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold t-primary">تفاصيل الحجز</h3>
                  <p className="text-[10px] t-gold font-['Inter']">{selectedBooking.id}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="t-tertiary hover:t-secondary">
                  <X size={18} />
                </button>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "الوحدة", value: selectedBooking.unitAr },
                    { label: "المعرض", value: selectedBooking.event },
                    { label: "نوع الوحدة", value: selectedBooking.boothType },
                    { label: "المساحة", value: selectedBooking.boothSize },
                    { label: "المنطقة", value: `Zone ${selectedBooking.zone}` },
                    { label: "تاريخ الحجز", value: selectedBooking.date },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded-xl modal-inner">
                      <p className="text-[9px] t-tertiary mb-1">{d.label}</p>
                      <p className="text-xs t-secondary">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="modal-inner rounded-xl p-4">
                  <h4 className="text-xs font-bold t-secondary mb-3">الملخص المالي | Financial Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="t-tertiary">السعر الإجمالي</span>
                      <span className="t-secondary font-['Inter']">{selectedBooking.price.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="t-tertiary">العربون (5%)</span>
                      <span className="t-secondary font-['Inter']">{selectedBooking.deposit.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="t-tertiary">المدفوع</span>
                      <span className="text-[var(--status-green)]/70 font-['Inter']">{selectedBooking.paidAmount.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-[var(--glass-border)]">
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
                    <p className="text-[10px] t-tertiary mb-2">الخدمات المشمولة</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedBooking.services.map((s, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-[var(--glass-bg)] text-[10px] t-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-3">
                  {selectedBooking.remainingAmount > 0 && (
                    <Link href="/payments" className="flex-1">
                      <button className="w-full btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                        <CreditCard size={14} />
                        الدفع الآن
                      </button>
                    </Link>
                  )}
                  {selectedBooking.contractId !== "—" && (
                    <Link href="/contracts">
                      <button className="glass-card px-4 py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center gap-1.5 transition-colors">
                        <FileText size={14} />
                        العقد
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => { toast.success("تم تحميل تفاصيل الحجز"); setSelectedBooking(null); }}
                    className="glass-card px-4 py-2.5 rounded-xl text-xs t-secondary hover:t-secondary flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    تحميل
                  </button>
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
