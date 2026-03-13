/**
 * Dashboard — Main overview with real stats, recent activity, quick actions
 * Fully localized with useLanguage()
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, FileText, CreditCard, TrendingUp, MapPin,
  Clock, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, XCircle,
  Star, Users, Building2, Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { events2026, eventStats } from "@/data/events2026";

const statusIcon = (s: string) => {
  if (s === "confirmed" || s === "active") return <CheckCircle size={13} style={{ color: "var(--status-green)" }} />;
  if (s === "pending_payment") return <AlertTriangle size={13} style={{ color: "var(--status-yellow)" }} />;
  return <XCircle size={13} style={{ color: "var(--status-red)" }} />;
};

export default function Dashboard() {
  const { bookings, contracts, payments } = useAuth();
  const { t, lang, isRTL } = useLanguage();

  const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const activeBookings = bookings.filter(b => b.status !== "cancelled").length;
  const signedContracts = contracts.length;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending_payment: t("bookings.pending"),
      confirmed: t("bookings.confirmed") || (lang === "ar" ? "مؤكد" : "Confirmed"),
      active: t("bookings.active") || (lang === "ar" ? "نشط" : "Active"),
      cancelled: t("bookings.cancelled") || (lang === "ar" ? "ملغي" : "Cancelled"),
    };
    return map[s] || s;
  };

  const stats = [
    { icon: CalendarCheck, value: String(activeBookings), label: t("dash.activeBookings"), color: "var(--status-green)" },
    { icon: FileText, value: String(signedContracts), label: t("dash.contracts"), color: "var(--gold-accent)" },
    { icon: CreditCard, value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", label: t("dash.paid"), color: "var(--status-blue)" },
    { icon: TrendingUp, value: `${eventStats.openEvents}`, label: t("dash.openEvents"), color: "var(--gold-light)" },
  ];

  const quickActions = [
    { label: t("dash.bookNew"), path: "/expos", icon: MapPin },
    { label: t("dash.viewContracts"), path: "/contracts", icon: FileText },
    { label: t("dash.makePayment"), path: "/payments", icon: CreditCard },
    { label: t("dash.requestPermit"), path: "/operations", icon: Clock },
  ];

  const upcomingEvents = events2026
    .filter(e => e.status === "open" || e.status === "upcoming" || e.status === "closing_soon")
    .slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold t-primary font-['Inter']">{s.value}</p>
            <p className="text-[10px] sm:text-xs t-secondary mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h3 className="text-sm sm:text-base font-bold t-primary">{t("dash.recentBookings")}</h3>
            <Link href="/bookings">
              <span className="text-[11px] sm:text-xs t-gold flex items-center gap-1 cursor-pointer">
                {t("dash.viewAll")} <ArrowIcon size={11} />
              </span>
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {bookings.length > 0 ? bookings.slice(0, 4).map((b, i) => (
              <Link key={i} href="/bookings">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors cursor-pointer hover:bg-[var(--glass-bg-hover)]"
                  style={{ backgroundColor: "var(--glass-bg)" }}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {statusIcon(b.status)}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm t-primary truncate">{b.unitAr} — {b.expoNameAr}</p>
                      <p className="text-[9px] sm:text-[10px] t-muted font-['Inter'] truncate">{b.unitEn}</p>
                    </div>
                  </div>
                  <div className={`${isRTL ? "text-left" : "text-right"} shrink-0 ${isRTL ? "mr-2" : "ml-2"}`}>
                    <p className="text-[10px] sm:text-[11px] t-secondary font-['Inter']">{b.id}</p>
                    <p className="text-[9px] sm:text-[10px]" style={{ color: b.status === "confirmed" ? "var(--status-green)" : "var(--status-yellow)" }}>{statusLabel(b.status)}</p>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center py-6">
                <CalendarCheck size={28} className="mx-auto t-muted mb-2" style={{ opacity: 0.3 }} />
                <p className="text-xs t-tertiary">{t("dash.noBookings")}</p>
                <Link href="/expos">
                  <span className="text-[10px] t-gold cursor-pointer">{t("dash.browseStart")}</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold t-primary mb-3 sm:mb-5">{t("dash.quickActions")}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.path}>
                <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl cursor-pointer transition-colors"
                  style={{ backgroundColor: "var(--glass-bg)" }}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-subtle flex items-center justify-center shrink-0">
                    <a.icon size={14} className="t-gold" />
                  </div>
                  <p className="text-[11px] sm:text-sm t-secondary truncate">{a.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <h3 className="text-sm sm:text-base font-bold t-primary">{t("dash.upcomingEvents")}</h3>
          <Link href="/expos">
            <span className="text-[11px] sm:text-xs t-gold flex items-center gap-1 cursor-pointer">
              {t("dash.viewAll")} <ArrowIcon size={11} />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {upcomingEvents.map((e, i) => (
            <Link key={i} href="/expos">
              <div className="p-3 sm:p-4 rounded-xl cursor-pointer transition-colors group" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <div className="flex items-start gap-3 mb-2">
                  <img src={e.image} alt={e.nameAr} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold t-primary truncate">{e.nameAr}</p>
                    <p className="text-[9px] sm:text-[10px] t-gold font-['Inter'] truncate" style={{ opacity: 0.6 }}>{e.nameEn}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] t-tertiary">
                    <Calendar size={10} />
                    <span className="font-['Inter']">{e.dateStart}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px]" style={{ color: "var(--status-green)", opacity: 0.8 }}>
                    {e.availableUnits} {t("dash.unitsAvailable")}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[9px] t-muted">
                  <span className="flex items-center gap-0.5"><MapPin size={9} />{e.city}</span>
                  <span className="flex items-center gap-0.5"><Star size={9} style={{ color: "var(--gold-accent)" }} />{e.rating}</span>
                  <span className="flex items-center gap-0.5"><Users size={9} />{e.footfall.split(" ")[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
