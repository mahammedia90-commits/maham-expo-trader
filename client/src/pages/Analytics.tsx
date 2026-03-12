/**
 * Analytics — AI-powered analytics dashboard
 * Design: Obsidian Glass with Recharts visualizations
 */
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Eye, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

const monthlyRevenue = [
  { month: "يناير", monthEn: "Jan", value: 45000 },
  { month: "فبراير", monthEn: "Feb", value: 62000 },
  { month: "مارس", monthEn: "Mar", value: 89000 },
  { month: "أبريل", monthEn: "Apr", value: 78000 },
  { month: "مايو", monthEn: "May", value: 95000 },
  { month: "يونيو", monthEn: "Jun", value: 120000 },
];

const bookingsByZone = [
  { name: "المنطقة A", nameEn: "Zone A", value: 35, color: "#C5A55A" },
  { name: "المنطقة B", nameEn: "Zone B", value: 28, color: "#E8D5A3" },
  { name: "المنطقة C", nameEn: "Zone C", value: 20, color: "#60A5FA" },
  { name: "المنطقة D", nameEn: "Zone D", value: 17, color: "#4ADE80" },
];

const visitorTrend = [
  { day: "السبت", dayEn: "Sat", visitors: 1200 },
  { day: "الأحد", dayEn: "Sun", visitors: 1800 },
  { day: "الاثنين", dayEn: "Mon", visitors: 2400 },
  { day: "الثلاثاء", dayEn: "Tue", visitors: 2100 },
  { day: "الأربعاء", dayEn: "Wed", visitors: 3200 },
  { day: "الخميس", dayEn: "Thu", visitors: 4500 },
  { day: "الجمعة", dayEn: "Fri", visitors: 3800 },
];

const kpis = [
  { labelAr: "إجمالي الإيرادات", labelEn: "Total Revenue", value: "٤٨٩,٠٠٠", unit: "ريال", change: "+23%", up: true, icon: DollarSign, color: "#4ADE80" },
  { labelAr: "عدد الحجوزات", labelEn: "Total Bookings", value: "٤٧", unit: "حجز", change: "+15%", up: true, icon: BarChart3, color: "#C5A55A" },
  { labelAr: "نسبة الإشغال", labelEn: "Occupancy Rate", value: "٩٢%", unit: "", change: "+5%", up: true, icon: TrendingUp, color: "#60A5FA" },
  { labelAr: "إجمالي الزوار", labelEn: "Total Visitors", value: "١٩,٠٠٠", unit: "زائر", change: "-3%", up: false, icon: Users, color: "#E8D5A3" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-[var(--glass-border)]">
        <p className="text-[11px] t-secondary">{label}</p>
        <p className="text-sm font-bold t-gold">{payload[0].value?.toLocaleString()} SAR</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold t-primary">التحليلات والتقارير</h2>
        <p className="text-xs t-gold/50 font-['Inter']">Analytics & Reports — Powered by AI</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}12` }}>
                <k.icon size={16} style={{ color: k.color }} />
              </div>
              <span className={`text-[11px] font-medium flex items-center gap-0.5 ${k.up ? "text-[var(--status-green)]" : "text-[var(--status-red)]"}`}>
                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {k.change}
              </span>
            </div>
            <p className="text-xl font-bold t-primary font-['Inter']">{k.value}</p>
            <p className="text-[10px] t-tertiary">{k.unit}</p>
            <p className="text-xs t-secondary mt-1">{k.labelAr}</p>
            <p className="text-[9px] t-muted font-['Inter']">{k.labelEn}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold t-primary mb-1">الإيرادات الشهرية</h3>
          <p className="text-[10px] t-gold/50 font-['Inter'] mb-4">Monthly Revenue (SAR)</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="monthEn" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#C5A55A" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Zone Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold t-primary mb-1">توزيع الحجوزات</h3>
          <p className="text-[10px] t-gold/50 font-['Inter'] mb-4">Bookings by Zone</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingsByZone} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {bookingsByZone.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {bookingsByZone.map((z, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: z.color }} />
                  <span className="text-[11px] t-secondary">{z.name}</span>
                  <span className="text-[9px] t-muted font-['Inter']">{z.nameEn}</span>
                </div>
                <span className="text-[11px] t-secondary font-['Inter']">{z.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Visitor Trend */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-bold t-primary mb-1">حركة الزوار الأسبوعية</h3>
        <p className="text-[10px] t-gold/50 font-['Inter'] mb-4">Weekly Visitor Trend</p>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorTrend}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A55A" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C5A55A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="dayEn" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="visitors" stroke="#C5A55A" strokeWidth={2} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
