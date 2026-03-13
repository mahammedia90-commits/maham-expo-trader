/**
 * Operations — Permits, logistics, setup, crowd management
 * Mobile-first: responsive cards and timeline
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Truck, ShieldCheck, Users, Wrench, Wifi, Zap, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const services = [
  { id: 1, nameAr: "تصريح تشغيل", nameEn: "Operating Permit", icon: ShieldCheck, status: "approved", desc: "تصريح تشغيل البوث من الجهات المختصة", cost: "مجاني" },
  { id: 2, nameAr: "خدمات لوجستية", nameEn: "Logistics Services", icon: Truck, status: "in_progress", desc: "نقل وتركيب المعدات والبضائع", cost: "3,500 ريال" },
  { id: 3, nameAr: "تجهيزات كهربائية", nameEn: "Electrical Setup", icon: Zap, status: "pending", desc: "توصيلات كهربائية وإنارة خاصة", cost: "2,000 ريال" },
  { id: 4, nameAr: "إنترنت وشبكات", nameEn: "Internet & Network", icon: Wifi, status: "approved", desc: "اتصال إنترنت عالي السرعة مخصص", cost: "1,500 ريال" },
  { id: 5, nameAr: "تجهيز وتأثيث", nameEn: "Furnishing & Setup", icon: Wrench, status: "pending", desc: "أثاث، ديكور، لافتات، وشاشات عرض", cost: "8,000 ريال" },
  { id: 6, nameAr: "إدارة حشود", nameEn: "Crowd Management", icon: Users, status: "approved", desc: "فريق أمن وتنظيم حشود متخصص", cost: "5,000 ريال" },
];

const statusMap: Record<string, { ar: string; en: string; color: string; icon: typeof CheckCircle }> = {
  approved: { ar: "معتمد", en: "Approved", color: "#4ADE80", icon: CheckCircle },
  in_progress: { ar: "قيد التنفيذ", en: "In Progress", color: "#60A5FA", icon: Clock },
  pending: { ar: "قيد الطلب", en: "Pending", color: "#FBBF24", icon: AlertTriangle },
};

const timeline = [
  { dateAr: "قبل ٣٠ يوم", dateEn: "30 days before", taskAr: "تقديم طلبات التصاريح", taskEn: "Submit permit applications", done: true },
  { dateAr: "قبل ٢٠ يوم", dateEn: "20 days before", taskAr: "تأكيد الخدمات اللوجستية", taskEn: "Confirm logistics services", done: true },
  { dateAr: "قبل ١٤ يوم", dateEn: "14 days before", taskAr: "بدء التجهيزات والتأثيث", taskEn: "Start furnishing & setup", done: false },
  { dateAr: "قبل ٧ أيام", dateEn: "7 days before", taskAr: "فحص نهائي واختبار الأنظمة", taskEn: "Final inspection & system test", done: false },
  { dateAr: "يوم الافتتاح", dateEn: "Opening day", taskAr: "تشغيل كامل وإدارة حشود", taskEn: "Full operation & crowd management", done: false },
];

export default function Operations() {
  const { t, lang, isRTL } = useLanguage();
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">الخدمات التشغيلية</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Operational Services</p>
        </div>
        <button
          onClick={() => toast.success("✅ تم إرسال طلب الخدمة بنجاح — سيتم التواصل معك خلال 24 ساعة")}
          className="btn-gold px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-1.5"
        >
          <Plus size={13} />
          طلب خدمة
        </button>
      </div>

      {/* Services Grid — 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {services.map((s, i) => {
          const sc = statusMap[s.status];
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                  <s.icon size={16} className="t-gold" />
                </div>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]"
                  style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                >
                  <sc.icon size={9} />
                  {sc.ar}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold t-primary mb-0.5">{s.nameAr}</h4>
              <p className="text-[9px] sm:text-[10px] t-gold/50 font-['Inter'] mb-1.5 sm:mb-2">{s.nameEn}</p>
              <p className="text-[10px] sm:text-[11px] t-tertiary leading-relaxed mb-2 sm:mb-3">{s.desc}</p>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[var(--glass-border)]">
                <span className="text-[11px] sm:text-xs t-secondary">التكلفة</span>
                <span className="text-[11px] sm:text-xs t-gold font-medium">{s.cost}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-bold t-primary mb-1">الجدول الزمني للتجهيز</h3>
        <p className="text-[9px] sm:text-[10px] t-gold/50 font-['Inter'] mb-4 sm:mb-6">Setup Timeline</p>
        <div className="relative">
          <div className="absolute right-3.5 sm:right-4 top-0 bottom-0 w-px bg-[var(--glass-bg-hover)]" />
          <div className="space-y-4 sm:space-y-6">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 sm:gap-4 relative"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  t.done ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30" : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                }`}>
                  {t.done ? <CheckCircle size={12} className="text-[#4ADE80]" /> : <Clock size={12} className="t-tertiary" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-0.5">
                    <span className={`text-[11px] sm:text-xs font-medium ${t.done ? "text-[#4ADE80]" : "t-secondary"}`}>{t.dateAr}</span>
                    <span className="text-[8px] sm:text-[9px] t-muted font-['Inter']">{t.dateEn}</span>
                  </div>
                  <p className={`text-xs sm:text-sm ${t.done ? "t-secondary" : "t-tertiary"}`}>{t.taskAr}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
