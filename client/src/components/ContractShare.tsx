/**
 * ContractShare — Share contract via Email, SMS, WhatsApp, or Download
 * Professional modal with animated options
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, MessageSquare, Phone, Download, CheckCircle,
  Send, Copy, ExternalLink, FileText, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateContractPDF, type ContractData } from "@/lib/pdfGenerator";

interface ContractShareProps {
  isOpen: boolean;
  onClose: () => void;
  contractData: ContractData;
}

export default function ContractShare({ isOpen, onClose, contractData }: ContractShareProps) {
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [email, setEmail] = useState(contractData.traderEmail || "");
  const [phone, setPhone] = useState(contractData.traderPhone || "");

  const handleDownload = () => {
    setSending("download");
    setTimeout(() => {
      generateContractPDF(contractData);
      setSending(null);
      setSent(prev => [...prev, "download"]);
      toast.success("تم تحميل العقد بنجاح");
    }, 800);
  };

  const handleEmail = () => {
    if (!email) { toast.error("يرجى إدخال البريد الإلكتروني"); return; }
    setSending("email");
    // Simulate sending — in production this would call an API
    setTimeout(() => {
      setSending(null);
      setSent(prev => [...prev, "email"]);
      toast.success(`تم إرسال العقد إلى ${email}`);
    }, 1500);
  };

  const handleSMS = () => {
    if (!phone) { toast.error("يرجى إدخال رقم الجوال"); return; }
    setSending("sms");
    setTimeout(() => {
      setSending(null);
      setSent(prev => [...prev, "sms"]);
      toast.success(`تم إرسال رابط العقد عبر SMS إلى ${phone}`);
    }, 1200);
  };

  const handleWhatsApp = () => {
    if (!phone) { toast.error("يرجى إدخال رقم الجوال"); return; }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const intlPhone = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `966${cleanPhone.replace(/^0/, "")}`;
    const message = encodeURIComponent(
      `📋 *عقد تشغيل — ${contractData.expoName}*\n\n` +
      `🔹 رقم العقد: ${contractData.contractId}\n` +
      `🔹 رقم الحجز: ${contractData.bookingId}\n` +
      `🔹 الموقع: بوث ${contractData.boothNumber}\n` +
      `🔹 المساحة: ${contractData.boothSize}\n` +
      `🔹 القيمة الإجمالية: ${contractData.totalValue.toLocaleString()} ريال\n` +
      `🔹 العربون: ${contractData.deposit.toLocaleString()} ريال\n` +
      `🔹 الفترة: ${contractData.startDate} — ${contractData.endDate}\n\n` +
      `✅ يرجى مراجعة العقد والتوقيع خلال 7 أيام.\n\n` +
      `— شركة مهام إكسبو لتنظيم المعارض والمؤتمرات\n` +
      `📞 0535555900 | 📧 info@maham.com.sa`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, "_blank");
    setSent(prev => [...prev, "whatsapp"]);
    toast.success("تم فتح واتساب لإرسال العقد");
  };

  const handleCopyLink = () => {
    const link = `https://mahamexpo.sa/contracts/${contractData.contractId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("تم نسخ رابط العقد");
    }).catch(() => {
      toast.error("تعذر نسخ الرابط");
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: "var(--modal-overlay)" }}
            onClick={onClose}
          />

          {/* Modal — bottom-sheet on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-[61] left-0 right-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              maxHeight: "90vh",
            }}
          >
            <div className="overflow-y-auto max-h-[90vh]" style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold-subtle">
                    <FileText size={18} className="t-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold t-primary">إرسال العقد الإلكتروني</h3>
                    <p className="text-[10px] t-gold font-['Inter']" style={{ opacity: 0.6 }}>Share Contract — {contractData.contractId}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Contract Summary */}
              <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="glass-card rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">المعرض</span>
                    <span className="text-[11px] t-primary font-semibold">{contractData.expoName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">البوث</span>
                    <span className="text-[11px] t-primary font-['Inter']">{contractData.boothNumber} — {contractData.boothSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] t-secondary">القيمة</span>
                    <span className="text-[11px] t-gold font-bold font-['Inter']">{contractData.totalValue.toLocaleString()} SAR</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 space-y-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div>
                  <label className="text-[10px] t-secondary block mb-1">البريد الإلكتروني — Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs t-primary font-['Inter']"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                    placeholder="trader@example.com"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-[10px] t-secondary block mb-1">رقم الجوال — Mobile</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs t-primary font-['Inter']"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                    placeholder="+966 5XX XXX XXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Share Options */}
              <div className="p-4 space-y-2">
                <p className="text-[10px] t-muted mb-2">اختر طريقة الإرسال — Choose delivery method</p>

                {/* Download PDF */}
                <button
                  onClick={handleDownload}
                  disabled={sending === "download"}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: sent.includes("download") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)",
                    border: `1px solid ${sent.includes("download") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))" }}>
                    {sending === "download" ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--btn-gold-text)" }} /> : <Download size={16} style={{ color: "var(--btn-gold-text)" }} />}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs t-primary font-semibold">تحميل نسخة PDF</p>
                    <p className="text-[9px] t-muted font-['Inter']">Download PDF Copy</p>
                  </div>
                  {sent.includes("download") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                </button>

                {/* Email */}
                <button
                  onClick={handleEmail}
                  disabled={sending === "email"}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: sent.includes("email") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)",
                    border: `1px solid ${sent.includes("email") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                    {sending === "email" ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--status-blue)" }} /> : <Mail size={16} style={{ color: "var(--status-blue)" }} />}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs t-primary font-semibold">إرسال عبر البريد الإلكتروني</p>
                    <p className="text-[9px] t-muted font-['Inter']">Send via Email</p>
                  </div>
                  {sent.includes("email") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                </button>

                {/* SMS */}
                <button
                  onClick={handleSMS}
                  disabled={sending === "sms"}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: sent.includes("sms") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)",
                    border: `1px solid ${sent.includes("sms") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(168,85,247,0.15)" }}>
                    {sending === "sms" ? <Loader2 size={16} className="animate-spin" style={{ color: "#a855f7" }} /> : <Phone size={16} style={{ color: "#a855f7" }} />}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs t-primary font-semibold">إرسال رابط عبر SMS</p>
                    <p className="text-[9px] t-muted font-['Inter']">Send Link via SMS</p>
                  </div>
                  {sent.includes("sms") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: sent.includes("whatsapp") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)",
                    border: `1px solid ${sent.includes("whatsapp") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(37,211,102,0.15)" }}>
                    <MessageSquare size={16} style={{ color: "#25d366" }} />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs t-primary font-semibold">إرسال عبر واتساب</p>
                    <p className="text-[9px] t-muted font-['Inter']">Send via WhatsApp</p>
                  </div>
                  {sent.includes("whatsapp") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(var(--gold-accent-rgb, 197,165,90), 0.1)" }}>
                    <Copy size={16} className="t-gold" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs t-primary font-semibold">نسخ رابط العقد</p>
                    <p className="text-[9px] t-muted font-['Inter']">Copy Contract Link</p>
                  </div>
                  <ExternalLink size={14} className="t-muted" />
                </button>
              </div>

              {/* Footer Note */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl" style={{ background: "rgba(var(--gold-accent-rgb, 197,165,90), 0.06)", border: "1px solid rgba(var(--gold-accent-rgb, 197,165,90), 0.12)" }}>
                  <p className="text-[10px] t-gold text-center" style={{ opacity: 0.8 }}>
                    ⚡ العقد الإلكتروني يعتبر بمثابة الأصل — التوقيع الإلكتروني ملزم قانونياً
                  </p>
                  <p className="text-[8px] t-muted text-center font-['Inter'] mt-1">
                    Electronic contracts are legally binding under Saudi regulations
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
