/**
 * Contracts — Smart e-contracts management
 * Design: Obsidian Glass with document-style cards
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, PenLine, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const contracts = [
  { id: "CT-2025-001", titleAr: "عقد إيجار بوث A1 — معرض الرياض الدولي", titleEn: "Lease Contract Booth A1 — Riyadh Intl Expo", booking: "BK-2025-001", value: "45,000 ريال", status: "signed", dateCreated: "2025-03-15", dateExpiry: "2025-06-15", parties: "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات ↔ التاجر" },
  { id: "CT-2025-002", titleAr: "عقد إيجار جناح VIP C1 — معرض الأغذية", titleEn: "Lease Contract VIP Wing C1 — Food Exhibition", booking: "BK-2025-003", value: "120,000 ريال", status: "signed", dateCreated: "2025-03-10", dateExpiry: "2025-09-10", parties: "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات ↔ التاجر" },
  { id: "CT-2025-003", titleAr: "عقد إيجار محل B2 — مؤتمر التقنية", titleEn: "Lease Contract Shop B2 — Tech Conference", booking: "BK-2025-002", value: "42,000 ريال", status: "pending_signature", dateCreated: "2025-03-12", dateExpiry: "—", parties: "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات ↔ التاجر" },
  { id: "CT-2025-004", titleAr: "عقد إيجار بوث A3 — مؤتمر AI السعودي", titleEn: "Lease Contract Booth A3 — Saudi AI Conf", booking: "BK-2025-006", value: "18,000 ريال", status: "draft", dateCreated: "2025-02-28", dateExpiry: "—", parties: "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات ↔ التاجر" },
];

const statusMap: Record<string, { ar: string; en: string; color: string; icon: typeof CheckCircle }> = {
  signed: { ar: "موقّع", en: "Signed", color: "#4ADE80", icon: CheckCircle },
  pending_signature: { ar: "بانتظار التوقيع", en: "Pending Signature", color: "#FBBF24", icon: Clock },
  draft: { ar: "مسودة", en: "Draft", color: "#60A5FA", icon: AlertTriangle },
};

export default function Contracts() {
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold t-primary">العقود الإلكترونية</h2>
          <p className="text-xs t-gold/50 font-['Inter']">Smart E-Contracts</p>
        </div>
        <div className="flex items-center gap-2 text-xs t-tertiary">
          <Shield size={14} className="t-gold" />
          <span>محمية بالتشفير | Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contracts List */}
        <div className="lg:col-span-2 space-y-3">
          {contracts.map((c, i) => {
            const sc = statusMap[c.status];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedContract(c)}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedContract?.id === c.id ? "border-[var(--gold-border)] shadow-[0_0_25px_rgba(197,165,90,0.06)]" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center">
                      <FileText size={18} className="t-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold t-primary">{c.titleAr}</h4>
                      <p className="text-[10px] t-tertiary font-['Inter']">{c.titleEn}</p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] shrink-0"
                    style={{ backgroundColor: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}25` }}
                  >
                    <sc.icon size={10} />
                    {sc.ar}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-[11px] t-tertiary">
                  <span>رقم العقد: <span className="t-gold/70 font-['Inter']">{c.id}</span></span>
                  <span>القيمة: <span className="t-secondary">{c.value}</span></span>
                  <span className="font-['Inter']">{c.dateCreated}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contract Detail */}
        <div className="space-y-4">
          {selectedContract ? (
            <motion.div
              key={selectedContract.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-base font-bold t-primary mb-1">تفاصيل العقد</h3>
              <p className="text-[10px] t-gold/50 font-['Inter'] mb-5">Contract Details</p>
              
              <div className="space-y-3">
                {[
                  { labelAr: "رقم العقد", labelEn: "Contract ID", value: selectedContract.id },
                  { labelAr: "رقم الحجز", labelEn: "Booking ID", value: selectedContract.booking },
                  { labelAr: "القيمة الإجمالية", labelEn: "Total Value", value: selectedContract.value },
                  { labelAr: "الأطراف", labelEn: "Parties", value: selectedContract.parties },
                  { labelAr: "تاريخ الإنشاء", labelEn: "Created", value: selectedContract.dateCreated },
                  { labelAr: "تاريخ الانتهاء", labelEn: "Expiry", value: selectedContract.dateExpiry },
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                    <div>
                      <span className="text-[11px] t-secondary">{d.labelAr}</span>
                      <span className="text-[9px] t-muted font-['Inter'] mr-1">({d.labelEn})</span>
                    </div>
                    <span className="text-xs t-secondary font-medium">{d.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                {selectedContract.status === "pending_signature" && (
                  <button
                    onClick={() => toast.success("تم توقيع العقد بنجاح!")}
                    className="flex-1 btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <PenLine size={14} />
                    توقيع العقد
                  </button>
                )}
                <button
                  onClick={() => toast.info("جاري تحميل العقد...")}
                  className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  تحميل PDF
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center">
              <FileText size={32} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-tertiary">اختر عقداً لعرض التفاصيل</p>
              <p className="text-[10px] t-muted font-['Inter']">Select a contract to view details</p>
            </div>
          )}

          {/* Legal Notice */}
          <div className="glass-card rounded-2xl p-5 border-[var(--gold-border)]">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="t-gold" />
              <h4 className="text-xs font-bold t-gold">إقرار قانوني</h4>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              جميع العقود محمية بموجب أنظمة المملكة العربية السعودية. أي محاولة للالتفاف حول المنصة تعرّض الطرف المخالف لغرامة مالية قدرها ٥٠,٠٠٠ ريال سعودي.
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-2">
              All contracts are protected under Saudi Arabian regulations. Any attempt to bypass the platform subjects the violating party to a fine of 50,000 ر.س.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
