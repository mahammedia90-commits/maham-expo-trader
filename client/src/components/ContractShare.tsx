/**
 * ContractShare — Share contract via Email, SMS, WhatsApp, or Download — Fully translated
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageSquare, Phone, Download, CheckCircle, Send, Copy, ExternalLink, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateContractPDF, type ContractData } from "@/lib/pdfGenerator";

interface ContractShareProps { isOpen: boolean; onClose: () => void; contractData: ContractData; }

export default function ContractShare({ isOpen, onClose, contractData }: ContractShareProps) {
  const { t, lang, isRTL } = useLanguage();
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [email, setEmail] = useState(contractData.traderEmail || "");
  const [phone, setPhone] = useState(contractData.traderPhone || "");

  const handleDownload = () => {
    setSending("download");
    setTimeout(() => { generateContractPDF(contractData); setSending(null); setSent(prev => [...prev, "download"]); toast.success(t("share.downloadSuccess")); }, 800);
  };

  const handleEmail = () => {
    if (!email) { toast.error(t("share.enterEmail")); return; }
    setSending("email");
    setTimeout(() => { setSending(null); setSent(prev => [...prev, "email"]); toast.success(t("share.emailSent") + " " + email); }, 1500);
  };

  const handleSMS = () => {
    if (!phone) { toast.error(t("share.enterPhone")); return; }
    setSending("sms");
    setTimeout(() => { setSending(null); setSent(prev => [...prev, "sms"]); toast.success(t("share.smsSent") + " " + phone); }, 1200);
  };

  const handleWhatsApp = () => {
    if (!phone) { toast.error(t("share.enterPhone")); return; }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const intlPhone = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `966${cleanPhone.replace(/^0/, "")}`;
    const message = encodeURIComponent(
      `📋 *${t("share.contractTitle")} — ${contractData.expoName}*\n\n` +
      `🔹 ${t("contracts.contractNumber")}: ${contractData.contractId}\n` +
      `🔹 ${t("contracts.bookingNumber")}: ${contractData.bookingId}\n` +
      `🔹 ${t("share.booth")}: ${contractData.boothNumber}\n` +
      `🔹 ${t("share.area")}: ${contractData.boothSize}\n` +
      `🔹 ${t("share.totalValue")}: ${contractData.totalValue.toLocaleString()} SAR\n` +
      `🔹 ${t("share.deposit")}: ${contractData.deposit.toLocaleString()} SAR\n` +
      `🔹 ${t("share.period")}: ${contractData.startDate} — ${contractData.endDate}\n\n` +
      `✅ ${t("share.reviewSign")}\n\n` +
      `— Maham Expo\n📞 0535555900 | 📧 info@maham.com.sa`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, "_blank");
    setSent(prev => [...prev, "whatsapp"]);
    toast.success(t("share.whatsappOpened"));
  };

  const handleCopyLink = () => {
    const link = `https://mahamexpo.sa/contracts/${contractData.contractId}`;
    navigator.clipboard.writeText(link).then(() => toast.success(t("share.linkCopied"))).catch(() => toast.error(t("share.linkCopyFail")));
  };

  if (!isOpen) return null;

  const shareOptions = [
    { key: "download", label: t("share.downloadPDF"), icon: Download, color: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))", textColor: "var(--btn-gold-text)", handler: handleDownload },
    { key: "email", label: t("share.sendEmail"), icon: Mail, color: "rgba(59,130,246,0.15)", textColor: "var(--status-blue)", handler: handleEmail },
    { key: "sms", label: t("share.sendSMS"), icon: Phone, color: "rgba(168,85,247,0.15)", textColor: "#a855f7", handler: handleSMS },
    { key: "whatsapp", label: t("share.sendWhatsApp"), icon: MessageSquare, color: "rgba(37,211,102,0.15)", textColor: "#25d366", handler: handleWhatsApp },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]" style={{ backgroundColor: "var(--modal-overlay)" }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-[61] left-0 right-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden"
            style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)", maxHeight: "90vh" }}>
            <div className="overflow-y-auto max-h-[90vh]" style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold-subtle"><FileText size={18} className="t-gold" /></div>
                  <div>
                    <h3 className="text-sm font-bold t-primary">{t("share.title")}</h3>
                    <p className="text-[10px] t-gold font-['Inter']" style={{ opacity: 0.6 }}>{contractData.contractId}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}><X size={16} /></button>
              </div>

              {/* Summary */}
              <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="glass-card rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">{t("expos.expo")}</span>
                    <span className="text-[11px] t-primary font-semibold">{contractData.expoName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">{t("share.booth")}</span>
                    <span className="text-[11px] t-primary font-['Inter']">{contractData.boothNumber} — {contractData.boothSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">{t("share.totalValue")}</span>
                    <span className="text-[11px] t-gold font-bold font-['Inter']">{contractData.totalValue.toLocaleString()} SAR</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 space-y-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div>
                  <label className="text-[10px] t-secondary block mb-1">{t("share.emailLabel")}</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs t-primary font-['Inter']"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }} placeholder="trader@example.com" dir="ltr" />
                </div>
                <div>
                  <label className="text-[10px] t-secondary block mb-1">{t("share.phoneLabel")}</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs t-primary font-['Inter']"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }} placeholder="+966 5XX XXX XXXX" dir="ltr" />
                </div>
              </div>

              {/* Share Options */}
              <div className="p-4 space-y-2">
                <p className="text-[10px] t-muted mb-2">{t("share.chooseMethod")}</p>
                {shareOptions.map((opt) => (
                  <button key={opt.key} onClick={opt.handler} disabled={sending === opt.key}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background: sent.includes(opt.key) ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sent.includes(opt.key) ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: opt.color }}>
                      {sending === opt.key ? <Loader2 size={16} className="animate-spin" style={{ color: opt.textColor }} /> : <opt.icon size={16} style={{ color: opt.textColor }} />}
                    </div>
                    <div className="flex-1 text-start"><p className="text-xs t-primary font-semibold">{opt.label}</p></div>
                    {sent.includes(opt.key) && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                  </button>
                ))}

                {/* Copy Link */}
                <button onClick={handleCopyLink} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(197,165,90,0.1)" }}><Copy size={16} className="t-gold" /></div>
                  <div className="flex-1 text-start"><p className="text-xs t-primary font-semibold">{t("share.copyLink")}</p></div>
                  <ExternalLink size={14} className="t-muted" />
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl" style={{ background: "rgba(197,165,90,0.06)", border: "1px solid rgba(197,165,90,0.12)" }}>
                  <p className="text-[10px] t-gold text-center" style={{ opacity: 0.8 }}>{t("share.legalNote")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
