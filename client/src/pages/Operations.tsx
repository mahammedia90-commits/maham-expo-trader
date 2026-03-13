/**
 * Operations — Permits, logistics, setup, crowd management
 * All text uses t() for multi-language support
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Truck, ShieldCheck, Users, Wrench, Wifi, Zap, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Operations() {
  const { t, lang, isRTL } = useLanguage();

  const services = [
    { id: 1, name: t("ops.operatingPermit"), icon: ShieldCheck, status: "approved", desc: t("ops.operatingPermitDesc"), cost: t("ops.free") },
    { id: 2, name: t("ops.logistics"), icon: Truck, status: "in_progress", desc: t("ops.logisticsDesc"), cost: "3,500 " + t("common.sar") },
    { id: 3, name: t("ops.electrical"), icon: Zap, status: "pending", desc: t("ops.electricalDesc"), cost: "2,000 " + t("common.sar") },
    { id: 4, name: t("ops.internet"), icon: Wifi, status: "approved", desc: t("ops.internetDesc"), cost: "1,500 " + t("common.sar") },
    { id: 5, name: t("ops.furnishing"), icon: Wrench, status: "pending", desc: t("ops.furnishingDesc"), cost: "8,000 " + t("common.sar") },
    { id: 6, name: t("ops.crowdMgmt"), icon: Users, status: "approved", desc: t("ops.crowdMgmtDesc"), cost: "5,000 " + t("common.sar") },
  ];

  const statusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    approved: { label: t("ops.statusApproved"), color: "#4ADE80", icon: CheckCircle },
    in_progress: { label: t("ops.statusInProgress"), color: "#60A5FA", icon: Clock },
    pending: { label: t("ops.statusPending"), color: "#FBBF24", icon: AlertTriangle },
  };

  const timeline = [
    { date: t("ops.days30"), task: t("ops.task30"), done: true },
    { date: t("ops.days20"), task: t("ops.task20"), done: true },
    { date: t("ops.days14"), task: t("ops.task14"), done: false },
    { date: t("ops.days7"), task: t("ops.task7"), done: false },
    { date: t("ops.openingDay"), task: t("ops.taskOpening"), done: false },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("ops.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Operational Services</p>
        </div>
        <button
          onClick={() => toast.success(t("ops.requestSent"))}
          className="btn-gold px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-1.5"
        >
          <Plus size={13} />
          {t("ops.requestService")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {services.map((s, i) => {
          const sc = statusMap[s.status];
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                  <s.icon size={16} className="t-gold" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]"
                  style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                  <sc.icon size={9} />
                  {sc.label}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold t-primary mb-1.5 sm:mb-2">{s.name}</h4>
              <p className="text-[10px] sm:text-[11px] t-tertiary leading-relaxed mb-2 sm:mb-3">{s.desc}</p>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[var(--glass-border)]">
                <span className="text-[11px] sm:text-xs t-secondary">{t("ops.cost")}</span>
                <span className="text-[11px] sm:text-xs t-gold font-medium">{s.cost}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-bold t-primary mb-1">{t("ops.setupTimeline")}</h3>
        <p className="text-[9px] sm:text-[10px] t-gold/50 font-['Inter'] mb-4 sm:mb-6">Setup Timeline</p>
        <div className="relative">
          <div className={`absolute ${isRTL ? "right-3.5 sm:right-4" : "left-3.5 sm:left-4"} top-0 bottom-0 w-px bg-[var(--glass-bg-hover)]`} />
          <div className="space-y-4 sm:space-y-6">
            {timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 sm:gap-4 relative">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  item.done ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30" : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                }`}>
                  {item.done ? <CheckCircle size={12} className="text-[#4ADE80]" /> : <Clock size={12} className="t-tertiary" />}
                </div>
                <div className="flex-1 pb-1">
                  <span className={`text-[11px] sm:text-xs font-medium ${item.done ? "text-[#4ADE80]" : "t-secondary"}`}>{item.date}</span>
                  <p className={`text-xs sm:text-sm ${item.done ? "t-secondary" : "t-tertiary"}`}>{item.task}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
