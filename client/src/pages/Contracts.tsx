/**
 * Contracts — Smart e-contracts management
 * CRITICAL RULE: Contracts appear ONLY after full payment is completed
 * Contract data is built from real KYC + booking data
 * Mobile-first: stacked cards, bottom-sheet detail modal
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, PenLine, Shield, CheckCircle, Clock, AlertTriangle, X, Send, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { generateContractPDF } from "@/lib/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ContractRecord } from "@/contexts/AuthContext";
import ContractShare from "@/components/ContractShare";

const statusMap: Record<string, { ar: string; en: string; color: string; icon: typeof CheckCircle }> = {
  signed: { ar: "موقّع", en: "Signed", color: "#4ADE80", icon: CheckCircle },
  pending_signature: { ar: "بانتظار التوقيع", en: "Pending Signature", color: "#FBBF24", icon: Clock },
  draft: { ar: "مسودة", en: "Draft", color: "#60A5FA", icon: AlertTriangle },
};

export default function Contracts() {
  const { t, lang, isRTL } = useLanguage();
  const { trader, kycData, contracts, bookings, markContractSent } = useAuth();
  const [selectedContract, setSelectedContract] = useState<ContractRecord | null>(null);
  const [shareContract, setShareContract] = useState<ContractRecord | null>(null);

  /** Build contract data for PDF from real KYC + booking data */
  function getContractData(c: ContractRecord) {
    const booking = bookings.find(b => b.id === c.bookingId);
    return {
      contractId: c.id,
      bookingId: c.bookingId,
      expoName: c.expoName || booking?.expoNameEn || "—",
      boothNumber: c.boothNumber || "—",
      boothSize: c.boothSize || booking?.boothSize || "—",
      traderName: kycData?.fullName || trader?.name || "—",
      traderCompany: kycData?.companyName || trader?.companyName || "—",
      traderCR: kycData?.crNumber || "—",
      traderPhone: kycData?.phone || trader?.phone || "—",
      traderEmail: kycData?.email || "—",
      traderVAT: kycData?.vatNumber || "—",
      traderIBAN: kycData?.iban || "—",
      traderBankName: kycData?.bankName || "—",
      traderNationalAddress: kycData?.nationalAddress || kycData?.address || "—",
      traderIdNumber: kycData?.idNumber || "—",
      totalValue: c.totalValue,
      deposit: c.deposit,
      remaining: c.remaining,
      startDate: c.createdAt,
      endDate: c.expiresAt,
      createdDate: c.createdAt,
      status: c.status,
    };
  }

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

      {/* Important Notice: Contract generation requires payment */}
      <div className="glass-card rounded-xl p-3 sm:p-4 border-[var(--gold-border)]">
        <div className="flex items-start gap-2">
          <Lock size={14} className="t-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] t-gold font-semibold mb-1">العقود تُصدر تلقائياً بعد اكتمال الدفع فقط</p>
            <p className="text-[10px] t-tertiary leading-relaxed">
              لا يمكن إصدار عقد تشغيل إلا بعد إتمام عملية الدفع بنجاح. يتم بناء العقد من بيانات التاجر الموثقة (KYC) وبيانات الحجز المؤكد.
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-1">
              Contracts are auto-generated only after successful payment completion.
            </p>
          </div>
        </div>
      </div>

      {/* Contracts List — ONLY from real data (after payment) */}
      {contracts.length > 0 ? (
        <div className="space-y-3">
          {contracts.map((c, i) => {
            const sc = statusMap[c.status] || statusMap.pending_signature;
            const booking = bookings.find(b => b.id === c.bookingId);
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
                      <h4 className="text-xs sm:text-sm font-semibold t-primary truncate">
                        عقد تشغيل {c.boothNumber} — {c.expoNameAr || c.expoName}
                      </h4>
                      <p className="text-[9px] t-tertiary font-['Inter'] truncate">
                        Lease Contract {c.boothNumber} — {c.expoName}
                      </p>
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
                  <span>القيمة: <span className="t-secondary font-['Inter']">{c.totalValue.toLocaleString()} ريال</span></span>
                  <span className="font-['Inter']">{c.createdAt}</span>
                </div>
                {/* Sent via indicators */}
                {c.sentVia.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] t-muted">تم الإرسال عبر:</span>
                    {c.sentVia.map(ch => (
                      <span key={ch} className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--status-green)]/10 text-[var(--status-green)]">
                        {ch === "email" ? "بريد" : ch === "sms" ? "SMS" : ch === "whatsapp" ? "واتساب" : ch === "download" ? "PDF" : ch}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-xl sm:rounded-2xl p-8 text-center">
          <FileText size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">لا توجد عقود حالياً</p>
          <p className="text-[10px] t-muted mb-3">العقود تُصدر تلقائياً بعد إتمام الدفع بنجاح</p>
          <div className="flex items-center justify-center gap-2 text-[10px] t-gold">
            <CreditCard size={12} />
            <span>قم بالدفع من صفحة المدفوعات لإصدار العقد</span>
          </div>
        </div>
      )}

      {/* Legal Notice */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border-[var(--gold-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="t-gold" />
          <h4 className="text-xs font-bold t-gold">إقرار قانوني</h4>
        </div>
        <p className="text-[10px] sm:text-[11px] t-tertiary leading-relaxed">
          جميع العقود محمية بموجب أنظمة المملكة العربية السعودية. العقد يُبنى من بيانات التاجر الموثقة ولا يصدر إلا بعد اكتمال الدفع. أي محاولة للالتفاف حول المنصة تعرّض الطرف المخالف لغرامة مالية قدرها ٥٠,٠٠٠ ريال سعودي.
        </p>
      </div>

      {/* Contract Detail Modal */}
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
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir="rtl"
            >
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

                {/* Contract Info */}
                <div className="space-y-2.5">
                  {[
                    { labelAr: "رقم العقد", value: selectedContract.id },
                    { labelAr: "رقم الحجز", value: selectedContract.bookingId },
                    { labelAr: "المعرض", value: selectedContract.expoNameAr || selectedContract.expoName },
                    { labelAr: "البوث / الوحدة", value: `${selectedContract.boothNumber} — ${selectedContract.boothSize}` },
                    { labelAr: "القيمة الإجمالية", value: `${selectedContract.totalValue.toLocaleString()} ريال` },
                    { labelAr: "العربون المدفوع", value: `${selectedContract.deposit.toLocaleString()} ريال` },
                    { labelAr: "المتبقي", value: `${selectedContract.remaining.toLocaleString()} ريال` },
                    { labelAr: "تاريخ الإنشاء", value: selectedContract.createdAt },
                    { labelAr: "تاريخ الانتهاء", value: selectedContract.expiresAt },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                      <span className="text-[11px] t-tertiary">{d.labelAr}</span>
                      <span className="text-xs t-secondary font-medium text-left max-w-[55%]">{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Trader Info from KYC */}
                {kycData && (
                  <div className="mt-4 rounded-xl p-3" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[10px] t-gold font-semibold mb-2">بيانات التاجر (من التوثيق)</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div><span className="t-muted">الاسم: </span><span className="t-secondary">{kycData.fullName}</span></div>
                      <div><span className="t-muted">الشركة: </span><span className="t-secondary">{kycData.companyName}</span></div>
                      <div><span className="t-muted">السجل: </span><span className="t-secondary font-['Inter']">{kycData.crNumber}</span></div>
                      <div><span className="t-muted">الضريبي: </span><span className="t-secondary font-['Inter']">{kycData.vatNumber}</span></div>
                      <div><span className="t-muted">الهوية: </span><span className="t-secondary font-['Inter']">{kycData.idNumber}</span></div>
                      <div><span className="t-muted">الجوال: </span><span className="t-secondary font-['Inter']">{kycData.phone}</span></div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-5 pb-2">
                  {selectedContract.status === "pending_signature" && (
                    <button onClick={() => { toast.success("تم توقيع العقد بنجاح!"); setSelectedContract(null); }}
                      className="flex-1 btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                      <PenLine size={14} />
                      توقيع العقد
                    </button>
                  )}
                  <button onClick={async () => {
                    toast.info("جاري إنشاء العقد...");
                    try {
                      await generateContractPDF(getContractData(selectedContract));
                      toast.success("تم تحميل العقد بنجاح!");
                    } catch(e) { console.error('PDF ERROR:', e); toast.error("حدث خطأ في إنشاء العقد"); }
                  }}
                    className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-1.5">
                    <Download size={14} />
                    تحميل PDF
                  </button>
                  <button onClick={() => { setShareContract(selectedContract); setSelectedContract(null); }}
                    className="flex-1 glass-card py-2.5 rounded-xl text-xs t-gold flex items-center justify-center gap-1.5" style={{ border: "1px solid var(--gold-border)" }}>
                    <Send size={14} />
                    إرسال العقد
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contract Share Modal */}
      {shareContract && (
        <ContractShare
          isOpen={!!shareContract}
          onClose={() => setShareContract(null)}
          contractData={getContractData(shareContract)}
        />
      )}
    </div>
  );
}
