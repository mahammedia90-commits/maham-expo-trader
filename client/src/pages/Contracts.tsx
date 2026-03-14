/**
 * Contracts — Smart e-contracts management
 * CRITICAL RULE: Contracts appear ONLY after full payment is completed
 * All text uses t() for multi-language support
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, PenLine, Shield, CheckCircle, Clock, AlertTriangle, X, Send, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { generateContractPDF } from "@/lib/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { ContractRecord } from "@/contexts/AuthContext";
import ContractShare from "@/components/ContractShare";

export default function Contracts() {
  const { t, lang, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { trader, kycData, contracts, bookings, markContractSent } = useAuth();
  const [selectedContract, setSelectedContract] = useState<ContractRecord | null>(null);
  const [shareContract, setShareContract] = useState<ContractRecord | null>(null);

  const statusLabel = (status: string) => {
    if (status === "signed") return t("contracts.signed");
    if (status === "pending_signature") return t("contracts.pendingSignature");
    if (status === "draft") return t("contracts.draft");
    return status;
  };
  const statusColor: Record<string, string> = { signed: "#4ADE80", pending_signature: "#FBBF24", draft: "#60A5FA" };
  const StatusIcon: Record<string, typeof CheckCircle> = { signed: CheckCircle, pending_signature: Clock, draft: AlertTriangle };

  function getContractData(c: ContractRecord) {
    const booking = bookings.find(b => b.id === c.bookingId);
    return {
      contractId: c.id, bookingId: c.bookingId,
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
      totalValue: c.totalValue, deposit: c.deposit, remaining: c.remaining,
      startDate: c.createdAt, endDate: c.expiresAt, createdDate: c.createdAt, status: c.status,
    };
  }

  const channelLabel = (ch: string) => {
    if (ch === "email") return t("payments.sendEmail").replace(/إرسال عبر |Send via |通过|Отправить через |ارسال از طریق |ile Gönder/g, "").trim() || "Email";
    if (ch === "sms") return "SMS";
    if (ch === "whatsapp") return "WhatsApp";
    if (ch === "download") return "PDF";
    return ch;
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{t("contracts.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Smart E-Contracts</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] t-tertiary">
          <Shield size={12} className="t-gold" />
          <span className="hidden sm:inline">Encrypted</span>
        </div>
      </div>

      {/* Notice */}
      <div className="glass-card rounded-xl p-3 sm:p-4 border-[var(--gold-border)]">
        <div className="flex items-start gap-2">
          <Lock size={14} className="t-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] t-gold font-semibold mb-1">{t("contracts.noContractsDesc")}</p>
            <div className="text-[10px] t-tertiary leading-relaxed space-y-0.5">
              <p>{t("contracts.step1")} → {t("contracts.step2")} → {t("contracts.step3")} → {t("contracts.step4")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {contracts.length > 0 ? (
        <div className="space-y-3">
          {contracts.map((c, i) => {
            const sc = statusColor[c.status] || "#FBBF24";
            const SIcon = StatusIcon[c.status] || Clock;
            const booking = bookings.find(b => b.id === c.bookingId);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedContract(c)}
                className={`glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedContract?.id === c.id ? "border-[var(--gold-border)] shadow-[0_0_25px_rgba(197,165,90,0.06)]" : ""
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                      <FileText size={16} className="t-gold" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold t-primary truncate">
                        {t("contracts.booth")} {c.boothNumber} — {isRTL ? (c.expoNameAr || c.expoName) : c.expoName}
                      </h4>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] shrink-0"
                    style={{ backgroundColor: `${sc}12`, color: sc, border: `1px solid ${sc}25` }}>
                    <SIcon size={9} />
                    {statusLabel(c.status)}
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] t-tertiary flex-wrap">
                  <span>{t("contracts.contractId")}: <span className="t-gold/70 font-['Inter']">{c.id}</span></span>
                  <span>{t("contracts.value")}: <span className="t-secondary font-['Inter']">{c.totalValue.toLocaleString()} {t("expos.sar")}</span></span>
                  <span className="font-['Inter']">{c.createdAt}</span>
                </div>
                {c.sentVia.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] t-muted">{t("contracts.sentVia")}:</span>
                    {c.sentVia.map(ch => (
                      <span key={ch} className="text-[8px] px-1.5 py-0.5 rounded bg-[var(--status-green)]/10 text-[var(--status-green)]">
                        {channelLabel(ch)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl sm:rounded-2xl p-8 text-center">
          <FileText size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">{t("contracts.noContracts")}</p>
          <p className="text-[10px] t-muted mb-3">{t("contracts.noContractsDesc")}</p>
          <div className="flex items-center justify-center gap-2 text-[10px] t-gold">
            <CreditCard size={12} />
            <span>{t("contracts.step3")}</span>
          </div>
        </div>
      )}

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setSelectedContract(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>

              <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold t-primary">{t("contracts.viewDetails")}</h3>
                  <button onClick={() => setSelectedContract(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: t("contracts.contractId"), value: selectedContract.id },
                    { label: t("bookings.bookingId"), value: selectedContract.bookingId },
                    { label: t("contracts.expoName"), value: isRTL ? (selectedContract.expoNameAr || selectedContract.expoName) : selectedContract.expoName },
                    { label: t("contracts.booth"), value: `${selectedContract.boothNumber} — ${selectedContract.boothSize}` },
                    { label: t("contracts.value"), value: `${selectedContract.totalValue.toLocaleString()} ${t("expos.sar")}` },
                    { label: t("contracts.issuedDate"), value: selectedContract.createdAt },
                    { label: t("contracts.expiry"), value: selectedContract.expiresAt },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                      <span className="text-[11px] t-tertiary">{d.label}</span>
                      <span className="text-xs t-secondary font-medium max-w-[55%]">{d.value}</span>
                    </div>
                  ))}
                </div>

                {kycData && (
                  <div className="mt-4 rounded-xl p-3" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[10px] t-gold font-semibold mb-2">{t("payments.traderData")}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div><span className="t-muted">{t("payments.traderName")}: </span><span className="t-secondary">{kycData.fullName}</span></div>
                      <div><span className="t-muted">{t("payments.traderCompany")}: </span><span className="t-secondary">{kycData.companyName}</span></div>
                      <div><span className="t-muted">{t("payments.traderCR")}: </span><span className="t-secondary font-['Inter']">{kycData.crNumber}</span></div>
                      <div><span className="t-muted">{t("payments.traderPhone")}: </span><span className="t-secondary font-['Inter']">{kycData.phone}</span></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-5 pb-2">
                  {selectedContract.status === "pending_signature" && (
                    <button onClick={() => { toast.success(t("common.success")); setSelectedContract(null); }}
                      className="flex-1 btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                      <PenLine size={14} />
                      {t("contracts.signNow")}
                    </button>
                  )}
                  <button onClick={async () => {
                    try {
                      await generateContractPDF(getContractData(selectedContract));
                      toast.success(t("payments.contractDownloaded"));
                    } catch(e) { console.error('PDF ERROR:', e); toast.error(t("payments.contractDownloadError")); }
                  }}
                    className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-1.5">
                    <Download size={14} />
                    {t("contracts.download")}
                  </button>
                  <button onClick={() => { setShareContract(selectedContract); setSelectedContract(null); }}
                    className="flex-1 glass-card py-2.5 rounded-xl text-xs t-gold flex items-center justify-center gap-1.5" style={{ border: "1px solid var(--gold-border)" }}>
                    <Send size={14} />
                    {t("contracts.share")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {shareContract && (
        <ContractShare isOpen={!!shareContract} onClose={() => setShareContract(null)} contractData={getContractData(shareContract)} />
      )}
    </div>
  );
}
