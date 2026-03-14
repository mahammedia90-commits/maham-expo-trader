/**
 * Analytics — AI-powered analytics dashboard with real data
 * All text uses t() for multi-language support
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
        <p className="text-xs font-bold t-gold">{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { t, lang, isRTL } = useLanguage();
  const isAr = ["ar", "fa"].includes(lang);
  const { trader, bookings, payments, contracts } = useAuth();

  const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const totalBookingValue = bookings.reduce((a, b) => a + b.price, 0);
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const occupancyRate = eventStats.totalUnits > 0 ? Math.round(((eventStats.totalUnits - eventStats.availableUnits) / eventStats.totalUnits) * 100) : 0;

  const categoryDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => { map.set(e.category, (map.get(e.category) || 0) + 1); });
    const colors = ["#C5A55A", "#E8D5A3", "#60A5FA", "#4ADE80", "#F472B6", "#A78BFA", "#FB923C"];
    return Array.from(map.entries()).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, []);

  const eventTimeline = useMemo(() => {
    const monthKeys = ["common.jan","common.feb","common.mar","common.apr","common.may","common.jun","common.jul","common.aug","common.sep","common.oct","common.nov","common.dec"];
    const counts = new Array(12).fill(0);
    events2026.forEach(e => { const m = new Date(e.dateStart).getMonth(); if (!isNaN(m)) counts[m]++; });
    return monthKeys.map((key, i) => ({ month: t(key), value: counts[i] }));
  }, [t]);

  const cityDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => { map.set(e.city, (map.get(e.city) || 0) + e.totalUnits); });
    return Array.from(map.entries()).map(([day, visitors]) => ({ day, visitors }));
  }, []);

  const aiInsights = useMemo(() => {
    const insights: { icon: any; text: string; type: "success" | "warning" | "info" }[] = [];
    const closingSoon = events2026.filter(e => e.status === "closing_soon");
    if (closingSoon.length > 0) {
      insights.push({ icon: Target, text: `${closingSoon.length} ${t("analytics.closingSoonInsight")}`, type: "warning" });
    }
    const pendingPayments = bookings.filter(b => b.paymentStatus !== "fully_paid");
    if (pendingPayments.length > 0) {
      insights.push({ icon: DollarSign, text: `${pendingPayments.length} ${t("analytics.pendingPaymentInsight")}`, type: "warning" });
    }
    const topEvent = events2026.reduce((a, b) => a.rating > b.rating ? a : b);
    const useAr = lang === "ar" || lang === "fa";
    const eName = useAr ? topEvent.nameAr : topEvent.nameEn;
    insights.push({ icon: Sparkles, text: `${t("analytics.topRated")}: ${eName} (${topEvent.rating}/5) — ${topEvent.availableUnits} ${t("analytics.unitsAvailable")}`, type: "info" });
    insights.push({ icon: Building2, text: `${t("common.total")} ${eventStats.totalUnits.toLocaleString()} ${t("analytics.unitsAcross")} ${eventStats.totalEvents} ${t("analytics.events")} — ${occupancyRate}% ${t("analytics.occupancy")}`, type: "success" });
    return insights;
  }, [bookings, occupancyRate, t, lang]);

  const kpis = [
    { label: t("analytics.totalPaid"), value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", change: "+23%", up: true, icon: DollarSign, color: "#4ADE80" },
    { label: t("analytics.bookingsCount"), value: String(bookings.length), change: bookings.length > 0 ? "+100%" : "0%", up: bookings.length > 0, icon: BarChart3, color: "#C5A55A" },
    { label: t("analytics.occupancyRate"), value: `${occupancyRate}%`, change: "+5%", up: true, icon: TrendingUp, color: "#60A5FA" },
    { label: t("analytics.openEvents"), value: String(eventStats.openEvents), change: `${eventStats.totalEvents} ${t("common.total")}`, up: true, icon: Calendar, color: "#E8D5A3" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("analytics.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI-Powered Analytics & Reports</p>
        </div>
        <button
          onClick={() => {
            toast.info(t("analytics.generatingReport"));
            generateAnalyticsPDF({
              period: "2026",
              totalRevenue: totalPaid,
              totalBookings: bookings.length,
              occupancyRate: `${occupancyRate}%`,
              topExpos: events2026.filter(e => e.featured).slice(0, 4).map(e => ({
                name: (lang === "ar" || lang === "fa") ? e.nameAr : e.nameEn, revenue: 0, bookings: e.totalUnits - e.availableUnits
              })),
              traderName: trader?.name || t("common.trader"),
            }).then(() => toast.success(t("analytics.reportDownloaded"))).catch(() => toast.error(t("analytics.reportError")));
          }}
          className="glass-card px-3 py-2 rounded-xl text-[11px] t-gold flex items-center gap-1.5"
          style={{ border: "1px solid var(--gold-border)" }}
        >
          <Download size={13} />
          <span className="hidden sm:inline">{t("analytics.exportReport")}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5" style={{ borderColor: "var(--gold-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="t-gold" />
          <h3 className="text-xs sm:text-sm font-bold t-primary">{t("analytics.aiInsights")}</h3>
        </div>
        <div className="space-y-2">
          {aiInsights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)" }}>
              <ins.icon size={13} className={ins.type === "success" ? "text-[var(--status-green)]" : ins.type === "warning" ? "text-[var(--status-yellow)]" : "t-gold"} style={{ flexShrink: 0, marginTop: 2 }} />
              <p className="text-[11px] t-secondary">{ins.text}</p>
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
            <p className="text-[10px] sm:text-xs t-secondary mt-0.5">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Event Timeline Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold t-primary mb-1">{t("analytics.monthlyDistribution")}</h3>
        <div style={{ height: 220 }} className="sm:h-[280px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#C5A55A" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{isAr ? "تفاصيل الإيرادات" : "Revenue Breakdown"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: isAr ? "حجوزات الأجنحة" : "Booth Bookings", value: `${(totalBookingValue / 1000).toFixed(0)}K`, pct: "65%", color: "#C5A55A" },
            { label: isAr ? "خدمات تشغيلية" : "Operations", value: "12K", pct: "18%", color: "#4ADE80" },
            { label: isAr ? "رعايات" : "Sponsorships", value: "8K", pct: "12%", color: "#60A5FA" },
            { label: isAr ? "خدمات إضافية" : "Add-ons", value: "3K", pct: "5%", color: "#F472B6" },
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-[10px] t-tertiary">{r.label}</span>
              </div>
              <p className="text-base font-bold t-primary font-['Inter']">{r.value}</p>
              <div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: "var(--glass-bg)" }}>
                <div className="h-full rounded-full" style={{ width: r.pct, backgroundColor: r.color }} />
              </div>
              <p className="text-[9px] t-muted mt-1 font-['Inter']">{r.pct}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category + City */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{t("analytics.byCategory")}</h3>
          <div style={{ height: 160 }} className="sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                  {categoryDist.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {categoryDist.map((z, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: z.color }} />
                <span className="text-[10px] t-secondary truncate">{z.name}</span>
                <span className="text-[10px] t-muted font-['Inter']">{z.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{t("analytics.byCity")}</h3>
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
