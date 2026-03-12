/**
 * Dashboard — Main overview with stats, recent activity, quick actions
 * Design: Obsidian Glass bento grid with gold accents
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, FileText, CreditCard, TrendingUp, MapPin,
  Clock, ArrowLeft, CheckCircle, AlertTriangle, XCircle
} from "lucide-react";

const stats = [
  { icon: CalendarCheck, valueAr: "12", labelAr: "حجز نشط", labelEn: "Active Bookings", color: "#4ADE80" },
  { icon: FileText, valueAr: "8", labelAr: "عقد موقّع", labelEn: "Signed Contracts", color: "#C5A55A" },
  { icon: CreditCard, valueAr: "٤٥٠,٠٠٠", labelAr: "ريال مدفوع", labelEn: "SAR Paid", color: "#60A5FA" },
  { icon: TrendingUp, valueAr: "٩٢%", labelAr: "نسبة الإشغال", labelEn: "Occupancy Rate", color: "#E8D5A3" },
];

const recentBookings = [
  { id: "BK-2025-001", zone: "المنطقة A - بوث رقم 14", zoneEn: "Zone A - Booth #14", status: "confirmed", statusAr: "مؤكد", date: "2025-03-15" },
  { id: "BK-2025-002", zone: "المنطقة B - محل تجاري 7", zoneEn: "Zone B - Shop #7", status: "pending", statusAr: "قيد المراجعة", date: "2025-03-12" },
  { id: "BK-2025-003", zone: "المنطقة C - جناح VIP 3", zoneEn: "Zone C - VIP Wing #3", status: "confirmed", statusAr: "مؤكد", date: "2025-03-10" },
  { id: "BK-2025-004", zone: "المنطقة D - كشك 22", zoneEn: "Zone D - Kiosk #22", status: "rejected", statusAr: "مرفوض", date: "2025-03-08" },
];

const statusIcon = (s: string) => {
  if (s === "confirmed") return <CheckCircle size={14} className="text-green-400" />;
  if (s === "pending") return <AlertTriangle size={14} className="text-yellow-400" />;
  return <XCircle size={14} className="text-red-400" />;
};

const quickActions = [
  { labelAr: "حجز وحدة جديدة", labelEn: "Book New Unit", path: "/map", icon: MapPin },
  { labelAr: "عرض العقود", labelEn: "View Contracts", path: "/contracts", icon: FileText },
  { labelAr: "سداد دفعة", labelEn: "Make Payment", path: "/payments", icon: CreditCard },
  { labelAr: "طلب تصريح", labelEn: "Request Permit", path: "/operations", icon: Clock },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white/90 font-['Inter']">{s.valueAr}</p>
            <p className="text-xs text-white/50 mt-1">{s.labelAr}</p>
            <p className="text-[10px] text-white/25 font-['Inter']">{s.labelEn}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white/90">آخر الحجوزات</h3>
              <p className="text-[10px] text-[#C5A55A]/50 font-['Inter']">Recent Bookings</p>
            </div>
            <Link href="/bookings">
              <span className="text-xs text-[#C5A55A] hover:text-[#E8D5A3] flex items-center gap-1 cursor-pointer">
                عرض الكل <ArrowLeft size={12} />
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  {statusIcon(b.status)}
                  <div>
                    <p className="text-sm text-white/80">{b.zone}</p>
                    <p className="text-[10px] text-white/30 font-['Inter']">{b.zoneEn}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-white/50 font-['Inter']">{b.id}</p>
                  <p className="text-[10px] text-white/25 font-['Inter']">{b.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-bold text-white/90 mb-1">إجراءات سريعة</h3>
          <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-5">Quick Actions</p>
          <div className="space-y-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.path}>
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-[rgba(197,165,90,0.15)] border border-transparent transition-all cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-[#C5A55A]/10 flex items-center justify-center">
                    <a.icon size={16} className="text-[#C5A55A]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">{a.labelAr}</p>
                    <p className="text-[10px] text-white/25 font-['Inter']">{a.labelEn}</p>
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
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-white/90 mb-1">الفعاليات القادمة</h3>
        <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-5">Upcoming Events</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { nameAr: "معرض الرياض الدولي للتقنية", nameEn: "Riyadh International Tech Expo", date: "أبريل 2025", spots: "23 وحدة متاحة" },
            { nameAr: "مؤتمر الذكاء الاصطناعي السعودي", nameEn: "Saudi AI Conference", date: "مايو 2025", spots: "15 وحدة متاحة" },
            { nameAr: "معرض الأغذية والمشروبات", nameEn: "Food & Beverage Exhibition", date: "يونيو 2025", spots: "42 وحدة متاحة" },
          ].map((e, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-sm font-semibold text-white/80">{e.nameAr}</p>
              <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-2">{e.nameEn}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{e.date}</span>
                <span className="text-[10px] text-green-400/70">{e.spots}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
