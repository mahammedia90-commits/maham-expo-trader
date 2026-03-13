/**
 * Dashboard — Main overview with stats, recent activity, quick actions
 * Mobile-first: responsive grids and compact layout
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, FileText, CreditCard, TrendingUp, MapPin,
  Clock, ArrowLeft, CheckCircle, AlertTriangle, XCircle
} from "lucide-react";

const stats = [
  { icon: CalendarCheck, valueAr: "12", labelAr: "حجز نشط", labelEn: "Active Bookings", color: "var(--status-green)" },
  { icon: FileText, valueAr: "8", labelAr: "عقد موقّع", labelEn: "Signed Contracts", color: "var(--gold-accent)" },
  { icon: CreditCard, valueAr: "٤٥٠K", labelAr: "ريال مدفوع", labelEn: "SAR Paid", color: "var(--status-blue)" },
  { icon: TrendingUp, valueAr: "٩٢%", labelAr: "نسبة الإشغال", labelEn: "Occupancy", color: "var(--gold-light)" },
];

const recentBookings = [
  { id: "BK-2025-001", zone: "المنطقة A - بوث 14", zoneEn: "Zone A - Booth #14", status: "confirmed", statusAr: "مؤكد", date: "2025-03-15" },
  { id: "BK-2025-002", zone: "المنطقة B - محل 7", zoneEn: "Zone B - Shop #7", status: "pending", statusAr: "قيد المراجعة", date: "2025-03-12" },
  { id: "BK-2025-003", zone: "المنطقة C - جناح VIP 3", zoneEn: "Zone C - VIP Wing #3", status: "confirmed", statusAr: "مؤكد", date: "2025-03-10" },
  { id: "BK-2025-004", zone: "المنطقة D - كشك 22", zoneEn: "Zone D - Kiosk #22", status: "rejected", statusAr: "مرفوض", date: "2025-03-08" },
];

const statusIcon = (s: string) => {
  if (s === "confirmed") return <CheckCircle size={13} style={{ color: "var(--status-green)" }} />;
  if (s === "pending") return <AlertTriangle size={13} style={{ color: "var(--status-yellow)" }} />;
  return <XCircle size={13} style={{ color: "var(--status-red)" }} />;
};

const quickActions = [
  { labelAr: "حجز وحدة جديدة", labelEn: "Book New Unit", path: "/expos", icon: MapPin },
  { labelAr: "عرض العقود", labelEn: "View Contracts", path: "/contracts", icon: FileText },
  { labelAr: "سداد دفعة", labelEn: "Make Payment", path: "/payments", icon: CreditCard },
  { labelAr: "طلب تصريح", labelEn: "Request Permit", path: "/operations", icon: Clock },
];

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold t-primary font-['Inter']">{s.valueAr}</p>
            <p className="text-[10px] sm:text-xs t-secondary mt-0.5">{s.labelAr}</p>
            <p className="text-[8px] sm:text-[10px] t-muted font-['Inter']">{s.labelEn}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings + Quick Actions — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold t-primary">آخر الحجوزات</h3>
              <p className="text-[9px] sm:text-[10px] t-gold font-['Inter']" style={{ opacity: 0.6 }}>Recent Bookings</p>
            </div>
            <Link href="/bookings">
              <span className="text-[11px] sm:text-xs t-gold flex items-center gap-1 cursor-pointer">
                عرض الكل <ArrowLeft size={11} />
              </span>
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentBookings.map((b, i) => (
              <Link key={i} href="/bookings">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors cursor-pointer hover:bg-[var(--glass-bg-hover)]"
                  style={{ backgroundColor: "var(--glass-bg)" }}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {statusIcon(b.status)}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm t-primary truncate">{b.zone}</p>
                      <p className="text-[9px] sm:text-[10px] t-muted font-['Inter'] truncate">{b.zoneEn}</p>
                    </div>
                  </div>
                  <div className="text-left shrink-0 mr-2">
                    <p className="text-[10px] sm:text-[11px] t-secondary font-['Inter']">{b.id}</p>
                    <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">{b.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions — horizontal scroll on mobile, vertical on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6"
        >
          <h3 className="text-sm sm:text-base font-bold t-primary mb-1">إجراءات سريعة</h3>
          <p className="text-[9px] sm:text-[10px] t-gold font-['Inter'] mb-3 sm:mb-5" style={{ opacity: 0.6 }}>Quick Actions</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.path}>
                <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl cursor-pointer transition-colors"
                  style={{ backgroundColor: "var(--glass-bg)" }}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-subtle flex items-center justify-center shrink-0">
                    <a.icon size={14} className="t-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-sm t-secondary truncate">{a.labelAr}</p>
                    <p className="text-[8px] sm:text-[10px] t-muted font-['Inter'] truncate">{a.labelEn}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6"
      >
        <h3 className="text-sm sm:text-base font-bold t-primary mb-1">الفعاليات القادمة</h3>
        <p className="text-[9px] sm:text-[10px] t-gold font-['Inter'] mb-3 sm:mb-5" style={{ opacity: 0.6 }}>Upcoming Events</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {[
            { nameAr: "معرض الرياض الدولي للتقنية", nameEn: "Riyadh International Tech Expo", date: "أبريل 2025", spots: "23 وحدة متاحة" },
            { nameAr: "مؤتمر الذكاء الاصطناعي السعودي", nameEn: "Saudi AI Conference", date: "مايو 2025", spots: "15 وحدة متاحة" },
            { nameAr: "معرض الأغذية والمشروبات", nameEn: "Food & Beverage Exhibition", date: "يونيو 2025", spots: "42 وحدة متاحة" },
          ].map((e, i) => (
            <Link key={i} href="/expos">
              <div className="p-3 sm:p-4 rounded-xl cursor-pointer transition-colors" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <p className="text-xs sm:text-sm font-semibold t-primary truncate">{e.nameAr}</p>
                <p className="text-[9px] sm:text-[10px] t-gold font-['Inter'] mb-1.5 sm:mb-2" style={{ opacity: 0.6 }}>{e.nameEn}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs t-tertiary">{e.date}</span>
                  <span className="text-[9px] sm:text-[10px]" style={{ color: "var(--status-green)", opacity: 0.8 }}>{e.spots}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
