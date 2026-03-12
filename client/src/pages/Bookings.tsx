/**
 * Bookings — Manage all booth/unit reservations
 * Design: Obsidian Glass table with status indicators
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Search, Filter, Eye, Download, Plus, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const bookings = [
  { id: "BK-2025-001", unitAr: "بوث رئيسي A1", unitEn: "Main Booth A1", zone: "A", event: "معرض الرياض الدولي", eventEn: "Riyadh Intl Expo", price: "45,000", status: "confirmed", date: "2025-03-15", deposit: "2,250" },
  { id: "BK-2025-002", unitAr: "محل تجاري B2", unitEn: "Shop B2", zone: "B", event: "مؤتمر التقنية", eventEn: "Tech Conference", price: "42,000", status: "pending_payment", date: "2025-03-12", deposit: "2,100" },
  { id: "BK-2025-003", unitAr: "جناح VIP C1", unitEn: "VIP Wing C1", zone: "C", event: "معرض الأغذية", eventEn: "Food Exhibition", price: "120,000", status: "confirmed", date: "2025-03-10", deposit: "6,000" },
  { id: "BK-2025-004", unitAr: "كشك B3", unitEn: "Kiosk B3", zone: "B", event: "معرض الرياض الدولي", eventEn: "Riyadh Intl Expo", price: "12,000", status: "pending_review", date: "2025-03-08", deposit: "600" },
  { id: "BK-2025-005", unitAr: "منطقة F&B D1", unitEn: "F&B Area D1", zone: "D", event: "موسم الرياض", eventEn: "Riyadh Season", price: "55,000", status: "cancelled", date: "2025-03-05", deposit: "—" },
  { id: "BK-2025-006", unitAr: "بوث A3", unitEn: "Booth A3", zone: "A", event: "مؤتمر AI السعودي", eventEn: "Saudi AI Conf", price: "18,000", status: "confirmed", date: "2025-02-28", deposit: "900" },
];

const statusConfig: Record<string, { ar: string; en: string; color: string; icon: typeof CheckCircle }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "#4ADE80", icon: CheckCircle },
  pending_payment: { ar: "بانتظار الدفع", en: "Pending Payment", color: "#FBBF24", icon: Clock },
  pending_review: { ar: "قيد المراجعة", en: "Under Review", color: "#60A5FA", icon: AlertTriangle },
  cancelled: { ar: "ملغي", en: "Cancelled", color: "#F87171", icon: XCircle },
};

export default function Bookings() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.unitAr.includes(search) && !b.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white/90">إدارة الحجوزات</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Booking Management</p>
        </div>
        <button
          onClick={() => toast.info("سيتم توجيهك لخريطة المعرض لاختيار وحدة جديدة")}
          className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          حجز جديد | New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="ابحث برقم الحجز أو اسم الوحدة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-card rounded-xl pr-10 pl-4 py-2.5 text-sm text-white/80 placeholder:text-white/25 gold-focus bg-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(statusConfig)].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-[11px] transition-all ${
                filterStatus === s ? "btn-gold" : "glass-card text-white/50"
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
              <tr className="border-b border-white/5">
                {["رقم الحجز", "الوحدة", "الفعالية", "السعر (ريال)", "العربون", "الحالة", "التاريخ", "إجراء"].map((h, i) => (
                  <th key={i} className="text-right px-4 py-3 text-[11px] text-white/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = statusConfig[b.status];
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[#C5A55A] font-['Inter'] font-medium">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white/80">{b.unitAr}</p>
                      <p className="text-[9px] text-white/30 font-['Inter']">{b.unitEn} · Zone {b.zone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white/60">{b.event}</p>
                      <p className="text-[9px] text-white/25 font-['Inter']">{b.eventEn}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/70 font-['Inter']">{b.price}</td>
                    <td className="px-4 py-3 text-xs text-white/50 font-['Inter']">{b.deposit}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                        style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                      >
                        <sc.icon size={10} />
                        {sc.ar}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-white/40 font-['Inter']">{b.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toast.info(`عرض تفاصيل الحجز ${b.id}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-[#C5A55A] transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { labelAr: "إجمالي الحجوزات", labelEn: "Total Bookings", value: bookings.length, color: "#C5A55A" },
          { labelAr: "مؤكدة", labelEn: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#4ADE80" },
          { labelAr: "قيد الانتظار", labelEn: "Pending", value: bookings.filter(b => b.status.startsWith("pending")).length, color: "#FBBF24" },
          { labelAr: "ملغاة", labelEn: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, color: "#F87171" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-white/50 mt-1">{s.labelAr}</p>
            <p className="text-[9px] text-white/25 font-['Inter']">{s.labelEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
