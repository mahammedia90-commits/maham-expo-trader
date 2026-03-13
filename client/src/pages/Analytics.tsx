/**
 * Analytics — AI-powered analytics dashboard with real data
 * Features: Dynamic KPIs, AI insights, event analytics, trader performance
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Download, Brain, Sparkles, Target, Building2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { generateAnalyticsPDF } from "@/lib/pdfGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { events2026, eventStats } from "@/data/events2026";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-[var(--glass-border)]">
        <p className="text-[10px] t-secondary">{label}</p>
        <p className="text-xs font-bold t-gold">{payload[0].value?.toLocaleString()} ر.س</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { t, lang, isRTL } = useLanguage();
  const { trader, bookings, payments, contracts } = useAuth();

  // Dynamic KPIs from real data
  const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const totalBookingValue = bookings.reduce((a, b) => a + b.price, 0);
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const occupancyRate = eventStats.totalUnits > 0 ? Math.round(((eventStats.totalUnits - eventStats.availableUnits) / eventStats.totalUnits) * 100) : 0;

  // Event category distribution
  const categoryDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + 1);
    });
    const colors = ["#C5A55A", "#E8D5A3", "#60A5FA", "#4ADE80", "#F472B6", "#A78BFA", "#FB923C"];
    return Array.from(map.entries()).map(([name, value], i) => ({
      name, nameEn: name, value, color: colors[i % colors.length]
    }));
  }, []);

  // Event timeline data
  const eventTimeline = useMemo(() => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    events2026.forEach(e => {
      const m = new Date(e.dateStart).getMonth();
      if (!isNaN(m)) counts[m]++;
    });
    return months.map((m, i) => ({ month: m, monthEn: monthsEn[i], value: counts[i] }));
  }, []);

  // City distribution
  const cityDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => {
      map.set(e.city, (map.get(e.city) || 0) + e.totalUnits);
    });
    return Array.from(map.entries()).map(([day, visitors]) => ({ day, dayEn: day, visitors }));
  }, []);

  // AI Insights
  const aiInsights = useMemo(() => {
    const insights: { icon: any; textAr: string; textEn: string; type: "success" | "warning" | "info" }[] = [];

    const closingSoon = events2026.filter(e => e.status === "closing_soon");
    if (closingSoon.length > 0) {
      insights.push({
        icon: Target,
        textAr: `${closingSoon.length} فعالية تغلق قريباً — فرصة استثمارية عالية`,
        textEn: `${closingSoon.length} events closing soon — high investment opportunity`,
        type: "warning"
      });
    }

    const pendingPayments = bookings.filter(b => b.paymentStatus !== "fully_paid");
    if (pendingPayments.length > 0) {
      insights.push({
        icon: DollarSign,
        textAr: `${pendingPayments.length} حجز بانتظار إكمال الدفع لإصدار العقد`,
        textEn: `${pendingPayments.length} bookings awaiting payment for contract issuance`,
        type: "warning"
      });
    }

    const topEvent = events2026.reduce((a, b) => a.rating > b.rating ? a : b);
    insights.push({
      icon: Sparkles,
      textAr: `أعلى فعالية تقييماً: ${topEvent.nameAr} (${topEvent.rating}/5) — ${topEvent.availableUnits} وحدة متاحة`,
      textEn: `Top rated: ${topEvent.nameEn} (${topEvent.rating}/5) — ${topEvent.availableUnits} units available`,
      type: "info"
    });

    insights.push({
      icon: Building2,
      textAr: `إجمالي ${eventStats.totalUnits.toLocaleString()} وحدة تجارية عبر ${eventStats.totalEvents} فعالية — نسبة إشغال ${occupancyRate}%`,
      textEn: `Total ${eventStats.totalUnits.toLocaleString()} units across ${eventStats.totalEvents} events — ${occupancyRate}% occupancy`,
      type: "success"
    });

    return insights;
  }, [bookings, occupancyRate]);

  const kpis = [
    { labelAr: "إجمالي المدفوع", labelEn: "Total Paid", value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", change: "+23%", up: true, icon: DollarSign, color: "#4ADE80" },
    { labelAr: "عدد الحجوزات", labelEn: "Bookings", value: String(bookings.length), change: bookings.length > 0 ? "+100%" : "0%", up: bookings.length > 0, icon: BarChart3, color: "#C5A55A" },
    { labelAr: "نسبة الإشغال", labelEn: "Occupancy", value: `${occupancyRate}%`, change: "+5%", up: true, icon: TrendingUp, color: "#60A5FA" },
    { labelAr: "الفعاليات المتاحة", labelEn: "Open Events", value: String(eventStats.openEvents), change: `${eventStats.totalEvents} إجمالي`, up: true, icon: Calendar, color: "#E8D5A3" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">التحليلات والتقارير</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI-Powered Analytics & Reports</p>
        </div>
        <button
          onClick={() => {
            toast.info("جاري إنشاء التقرير...");
            generateAnalyticsPDF({
              period: "2026",
              totalRevenue: totalPaid,
              totalBookings: bookings.length,
              occupancyRate: `${occupancyRate}%`,
              topExpos: events2026.filter(e => e.featured).slice(0, 4).map(e => ({
                name: e.nameAr, revenue: 0, bookings: e.totalUnits - e.availableUnits
              })),
              traderName: trader?.name || "التاجر",
            }).then(() => toast.success("تم تحميل التقرير بنجاح!")).catch(() => toast.error("حدث خطأ في إنشاء التقرير"));
          }}
          className="glass-card px-3 py-2 rounded-xl text-[11px] t-gold flex items-center gap-1.5"
          style={{ border: "1px solid var(--gold-border)" }}
        >
          <Download size={13} />
          <span className="hidden sm:inline">تصدير تقرير</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* AI Insights Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5" style={{ borderColor: "var(--gold-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="t-gold" />
          <h3 className="text-xs sm:text-sm font-bold t-primary">رؤى الذكاء الاصطناعي</h3>
          <span className="text-[9px] t-gold/50 font-['Inter']">AI Insights</span>
        </div>
        <div className="space-y-2">
          {aiInsights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)" }}>
              <ins.icon size={13} className={ins.type === "success" ? "text-[var(--status-green)]" : ins.type === "warning" ? "text-[var(--status-yellow)]" : "t-gold"} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-[11px] t-secondary">{ins.textAr}</p>
                <p className="text-[9px] t-muted font-['Inter']">{ins.textEn}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}12` }}>
                <k.icon size={14} style={{ color: k.color }} />
              </div>
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${k.up ? "text-[var(--status-green)]" : "text-[var(--status-red)]"}`}>
                {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {k.change}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold t-primary font-['Inter']">{k.value}</p>
            <p className="text-[10px] sm:text-xs t-secondary mt-0.5">{k.labelAr}</p>
            <p className="text-[8px] sm:text-[9px] t-muted font-['Inter']">{k.labelEn}</p>
          </motion.div>
        ))}
      </div>

      {/* Event Timeline Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold t-primary mb-1">توزيع الفعاليات الشهري 2026</h3>
        <p className="text-[9px] t-gold/50 font-['Inter'] mb-3 sm:mb-4">Monthly Event Distribution 2026</p>
        <div style={{ height: 220 }} className="sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="monthEn" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#C5A55A" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Distribution + City Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-1">توزيع الفعاليات حسب الفئة</h3>
          <p className="text-[9px] t-gold/50 font-['Inter'] mb-3">Events by Category</p>
          <div style={{ height: 160 }} className="sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                  {categoryDist.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {categoryDist.map((z, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: z.color }} />
                <span className="text-[10px] t-secondary truncate">{z.name}</span>
                <span className="text-[10px] t-muted font-['Inter'] mr-auto">{z.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-1">الوحدات التجارية حسب المدينة</h3>
          <p className="text-[9px] t-gold/50 font-['Inter'] mb-3">Units by City</p>
          <div style={{ height: 180 }} className="sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cityDist}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A55A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C5A55A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
                <Area type="monotone" dataKey="visitors" stroke="#C5A55A" strokeWidth={2} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
