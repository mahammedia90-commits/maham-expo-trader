/**
 * Contracts — Smart e-contracts management
 * Mobile-first: stacked cards, bottom-sheet detail modal
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, PenLine, Shield, CheckCircle, Clock, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

const contracts = [
  { id: "CT-2025-001", titleAr: "عقد إيجار بوث A1 — معرض الرياض الدولي", titleEn: "Lease Contract Booth A1 — Riyadh Intl Expo", booking: "BK-2025-001", value: "45,000 ريال", status: "signed", dateCreated: "2025-03-15", dateExpiry: "2025-06-15", parties: "شركة مهام إكسبو ↔ التاجر" },
  { id: "CT-2025-002", titleAr: "عقد إيجار جناح VIP C1 — معرض الأغذية", titleEn: "Lease Contract VIP Wing C1 — Food Exhibition", booking: "BK-2025-003", value: "120,000 ريال", status: "signed", dateCreated: "2025-03-10", dateExpiry: "2025-09-10", parties: "شركة مهام إكسبو ↔ التاجر" },
  { id: "CT-2025-003", titleAr: "عقد إيجار محل B2 — مؤتمر التقنية", titleEn: "Lease Contract Shop B2 — Tech Conference", booking: "BK-2025-002", value: "42,000 ريال", status: "pending_signature", dateCreated: "2025-03-12", dateExpiry: "—", parties: "شركة مهام إكسبو ↔ التاجر" },
  { id: "CT-2025-004", titleAr: "عقد إيجار بوث A3 — مؤتمر AI السعودي", titleEn: "Lease Contract Booth A3 — Saudi AI Conf", booking: "BK-2025-006", value: "18,000 ريال", status: "draft", dateCreated: "2025-02-28", dateExpiry: "—", parties: "شركة مهام إكسبو ↔ التاجر" },
];

const statusMap: Record<string, { ar: string; en: string; color: string; icon: typeof CheckCircle }> = {
  signed: { ar: "موقّع", en: "Signed", color: "#4ADE80", icon: CheckCircle },
  pending_signature: { ar: "بانتظار التوقيع", en: "Pending Signature", color: "#FBBF24", icon: Clock },
  draft: { ar: "مسودة", en: "Draft", color: "#60A5FA", icon: AlertTriangle },
};

export default function Contracts() {
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">العقود الإلكترونية</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Smart E-Contracts</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] t-tertiary">
          <Shield size={12} className="t-gold" />
          <span className="hidden sm:inline">محمية بالتشفير | Encrypted</span>
          <span className="sm:hidden">مشفرة</span>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {contracts.map((c, i) => {
          const sc = statusMap[c.status];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedContract(c)}
              className={`glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all active:scale-[0.98] ${
                selectedContract?.id === c.id ? "border-[var(--gold-border)] shadow-[0_0_25px_rgba(197,165,90,0.06)]" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                    <FileText size={16} className="t-gold" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold t-primary truncate">{c.titleAr}</h4>
                    <p className="text-[9px] t-tertiary font-['Inter'] truncate">{c.titleEn}</p>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] shrink-0 mr-2"
                  style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                >
                  <sc.icon size={9} />
                  {sc.ar}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] t-tertiary flex-wrap">
                <span>رقم العقد: <span className="t-gold/70 font-['Inter']">{c.id}</span></span>
                <span>القيمة: <span className="t-secondary">{c.value}</span></span>
                <span className="font-['Inter']">{c.dateCreated}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legal Notice */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border-[var(--gold-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="t-gold" />
          <h4 className="text-xs font-bold t-gold">إقرار قانوني</h4>
        </div>
        <p className="text-[10px] sm:text-[11px] t-tertiary leading-relaxed">
          جميع العقود محمية بموجب أنظمة المملكة العربية السعودية. أي محاولة للالتفاف حول المنصة تعرّض الطرف المخالف لغرامة مالية قدرها ٥٠,٠٠٠ ريال سعودي.
        </p>
      </div>

      {/* Contract Detail Modal — full-screen on mobile */}
      <AnimatePresence>
        {selectedContract && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => setSelectedContract(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[500px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir="rtl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>

              <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold t-primary">تفاصيل العقد</h3>
                    <p className="text-[10px] t-gold/50 font-['Inter']">Contract Details</p>
                  </div>
                  <button onClick={() => setSelectedContract(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { labelAr: "رقم العقد", value: selectedContract.id },
                    { labelAr: "رقم الحجز", value: selectedContract.booking },
                    { labelAr: "القيمة الإجمالية", value: selectedContract.value },
                    { labelAr: "الأطراف", value: selectedContract.parties },
                    { labelAr: "تاريخ الإنشاء", value: selectedContract.dateCreated },
                    { labelAr: "تاريخ الانتهاء", value: selectedContract.dateExpiry },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                      <span className="text-[11px] t-tertiary">{d.labelAr}</span>
                      <span className="text-xs t-secondary font-medium text-left max-w-[55%]">{d.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-5 pb-2">
                  {selectedContract.status === "pending_signature" && (
                    <button onClick={() => { toast.success("تم توقيع العقد بنجاح!"); setSelectedContract(null); }}
                      className="flex-1 btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                      <PenLine size={14} />
                      توقيع العقد
                    </button>
                  )}
                  <button onClick={() => toast.info("جاري تحميل العقد...")}
                    className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-1.5">
                    <Download size={14} />
                    تحميل PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
