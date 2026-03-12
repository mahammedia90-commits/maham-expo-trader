/**
 * Operations — Permits, logistics, setup, crowd management
 * Design: Obsidian Glass with operational workflow cards
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Truck, ShieldCheck, Users, Wrench, Wifi, Zap, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

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
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">الخدمات التشغيلية</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Operational Services</p>
        </div>
        <button
          onClick={() => toast.info("طلب خدمة جديدة — سيتم التواصل معك خلال ٢٤ ساعة")}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus size={14} />
          طلب خدمة
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => {
          const sc = statusMap[s.status];
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A55A]/10 flex items-center justify-center">
                  <s.icon size={18} className="text-[#C5A55A]" />
                </div>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                  style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                >
                  <sc.icon size={9} />
                  {sc.ar}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white/85 mb-0.5">{s.nameAr}</h4>
              <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-2">{s.nameEn}</p>
              <p className="text-[11px] text-white/40 leading-relaxed mb-3">{s.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-white/50">التكلفة</span>
                <span className="text-xs text-[#C5A55A] font-medium">{s.cost}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-bold text-white/90 mb-1">الجدول الزمني للتجهيز</h3>
        <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-6">Setup Timeline</p>
        <div className="relative">
          <div className="absolute right-4 top-0 bottom-0 w-px bg-white/8" />
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  t.done ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30" : "bg-white/5 border border-white/10"
                }`}>
                  {t.done ? <CheckCircle size={14} className="text-[#4ADE80]" /> : <Clock size={14} className="text-white/30" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs font-medium ${t.done ? "text-[#4ADE80]" : "text-white/50"}`}>{t.dateAr}</span>
                    <span className="text-[9px] text-white/20 font-['Inter']">{t.dateEn}</span>
                  </div>
                  <p className={`text-sm ${t.done ? "text-white/70" : "text-white/40"}`}>{t.taskAr}</p>
                  <p className="text-[10px] text-white/20 font-['Inter']">{t.taskEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
