/**
 * Payments — Financial management with mobile-first design
 * NEW FLOW: Payment completion → Auto-generate contract → Multi-channel delivery
 * All text uses t() for multi-language support
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, TrendingUp, AlertTriangle, Shield, Lock,
  Sparkles, Receipt, X, Building2, Smartphone, CheckCircle,
  FileText, Send, MessageSquare, Mail, Phone, Download, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { generatePaymentsPDF, generateContractPDF } from "@/lib/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { BookingRecord } from "@/contexts/AuthContext";

export default function Payments() {
  const { t, lang, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    trader, kycData, bookings, payments,
    addPayment, updateBookingPayment, addContract, markContractSent,
    addNotification
  } = useAuth();

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedContractId, setGeneratedContractId] = useState<string | null>(null);
  const [contractSending, setContractSending] = useState(false);
  const [sentChannels, setSentChannels] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");

  const currencyLabel = currency === "SAR" ? (lang === "ar" || lang === "fa" ? "ر.س" : "SAR") : "$";
  const convertAmount = (amount: number) => {
    const val = currency === "USD" ? Math.round(amount / 3.75) : amount;
    return val.toLocaleString();
  };

  const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const pendingBookings = bookings.filter(b => b.remainingAmount > 0 && b.status !== "cancelled");
  const totalPending = pendingBookings.reduce((a, b) => a + b.remainingAmount, 0);

  const statusLabel = (status: string) => {
    if (status === "completed") return t("payments.statusCompleted");
    if (status === "pending") return t("payments.statusPending");
    if (status === "refunded") return t("payments.statusRefunded");
    return status;
  };
  const statusColor: Record<string, string> = { completed: "#4ADE80", pending: "#FBBF24", refunded: "#60A5FA" };

  const handlePay = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setPaymentSuccess(false);
    setGeneratedContractId(null);
    setSentChannels([]);
    setShowPayModal(true);
  };

  const processPayment = () => {
    if (!selectedBooking) return;
    setProcessing(true);

    setTimeout(() => {
      const paymentAmount = selectedBooking.remainingAmount;
      const newPayment = addPayment({
        bookingId: selectedBooking.id,
        amount: paymentAmount,
        method: paymentMethod === "mada" ? t("payments.mada") : paymentMethod === "credit" ? t("payments.creditCard") : paymentMethod === "apple" ? "Apple Pay" : t("payments.bankTransfer"),
        type: "full_payment",
        descAr: `${t("payments.fullPayment")} — ${selectedBooking.unitAr}`,
        descEn: `Full Payment — ${selectedBooking.unitEn}`,
      });

      updateBookingPayment(selectedBooking.id, paymentAmount);
      const newContract = addContract(selectedBooking.id, newPayment.id);

      if (newContract) {
        setGeneratedContractId(newContract.id);
        addNotification({
          type: "payment",
          titleAr: `تم الدفع بنجاح — ${selectedBooking.unitAr}`,
          titleEn: `Payment Successful — ${selectedBooking.unitEn}`,
          message: isRTL
            ? `تم سداد مبلغ ${paymentAmount.toLocaleString()} ر.س بنجاح. تم إصدار العقد رقم ${newContract.id}`
            : `Successfully paid ${paymentAmount.toLocaleString()} SAR. Contract #${newContract.id} has been issued.`,
          link: "/contracts",
        });
        addNotification({
          type: "contract",
          titleAr: `عقد جديد — ${newContract.id}`,
          titleEn: `New Contract — ${newContract.id}`,
          message: isRTL
            ? `تم إصدار عقد تشغيل ${selectedBooking.unitAr} تلقائياً بعد اكتمال الدفع.`
            : `Operations contract for ${selectedBooking.unitEn} has been automatically issued after payment completion.`,
          link: "/contracts",
        });
      }

      setProcessing(false);
      setPaymentSuccess(true);
      toast.success(t("payments.paymentSuccessToast"));
    }, 2500);
  };

  const getContractDataForPDF = () => {
    if (!selectedBooking) return null;
    return {
      contractId: generatedContractId || "—",
      bookingId: selectedBooking.id,
      expoName: selectedBooking.expoNameEn || selectedBooking.expoNameAr,
      boothNumber: selectedBooking.unitEn?.match(/[A-Z]\d+/)?.[0] || selectedBooking.unitAr,
      boothSize: selectedBooking.boothSize,
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
      totalValue: selectedBooking.price,
      deposit: selectedBooking.deposit,
      remaining: 0,
      startDate: selectedBooking.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      endDate: (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().split("T")[0]; })(),
      createdDate: new Date().toISOString().split("T")[0],
      status: "pending_signature",
    };
  };

  const handleDownloadContract = async () => {
    const data = getContractDataForPDF();
    if (!data) return;
    setContractSending(true);
    try {
      await generateContractPDF(data);
      setSentChannels(prev => [...prev, "download"]);
      if (generatedContractId) markContractSent(generatedContractId, "download");
      toast.success(t("payments.contractDownloaded"));
    } catch { toast.error(t("payments.contractDownloadError")); }
    setContractSending(false);
  };

  const handleSendEmail = () => {
    const email = kycData?.email || "";
    if (!email) { toast.error(t("payments.noEmail")); return; }
    setContractSending(true);
    setTimeout(() => {
      setSentChannels(prev => [...prev, "email"]);
      if (generatedContractId) markContractSent(generatedContractId, "email");
      toast.success(`${t("payments.contractSentTo")} ${email}`);
      setContractSending(false);
    }, 1500);
  };

  const handleSendSMS = () => {
    const phone = kycData?.phone || trader?.phone || "";
    if (!phone) { toast.error(t("payments.noPhone")); return; }
    setContractSending(true);
    setTimeout(() => {
      setSentChannels(prev => [...prev, "sms"]);
      if (generatedContractId) markContractSent(generatedContractId, "sms");
      toast.success(`${t("payments.contractLinkSent")} ${phone}`);
      setContractSending(false);
    }, 1200);
  };

  const handleSendWhatsApp = () => {
    const phone = kycData?.phone || trader?.phone || "";
    if (!phone) { toast.error(t("payments.noPhone")); return; }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const intlPhone = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `966${cleanPhone.replace(/^0/, "")}`;
    const data = getContractDataForPDF();
    if (!data) return;
    const message = encodeURIComponent(
      isRTL
        ? `*عقد تشغيل — ${data.expoName}*\n\n` +
          `رقم العقد: ${data.contractId}\nرقم الحجز: ${data.bookingId}\n` +
          `الموقع: بوث ${data.boothNumber}\nالمساحة: ${data.boothSize}\n` +
          `القيمة الإجمالية: ${data.totalValue.toLocaleString()} ريال\n` +
          `الفترة: ${data.startDate} — ${data.endDate}\n\n` +
          `— شركة مهام إكسبو لتنظيم المعارض والمؤتمرات\n0535555900 | info@maham.com.sa`
        : `*Operations Contract — ${data.expoName}*\n\n` +
          `Contract #: ${data.contractId}\nBooking #: ${data.bookingId}\n` +
          `Location: Booth ${data.boothNumber}\nArea: ${data.boothSize}\n` +
          `Total Value: ${data.totalValue.toLocaleString()} SAR\n` +
          `Period: ${data.startDate} — ${data.endDate}\n\n` +
          `— Maham Expo for Exhibitions & Conferences\n0535555900 | info@maham.com.sa`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, "_blank");
    setSentChannels(prev => [...prev, "whatsapp"]);
    if (generatedContractId) markContractSent(generatedContractId, "whatsapp");
    toast.success(t("payments.whatsappOpened"));
  };

  const bookingLabel = isRTL ? (b: BookingRecord) => `${b.unitAr} — ${b.expoNameAr}` : (b: BookingRecord) => `${b.unitEn} — ${b.expoNameEn}`;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>{t("payments.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Payments & Billing</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrency(c => c === "SAR" ? "USD" : "SAR")}
            className="glass-card px-2.5 py-1.5 rounded-lg text-[10px] t-secondary">
            {currency === "SAR" ? "SAR → $" : "$ → SAR"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#4ADE8015" }}>
              <CheckCircle size={14} style={{ color: "#4ADE80" }} />
            </div>
            <span className="text-[10px] t-tertiary">{t("payments.totalPaid")}</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(totalPaid)}</p>
          <p className="text-[9px] t-muted">{currencyLabel}</p>
        </div>
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FBBF2415" }}>
              <AlertTriangle size={14} style={{ color: "#FBBF24" }} />
            </div>
            <span className="text-[10px] t-tertiary">{t("payments.totalRemaining")}</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[var(--status-yellow)] font-['Inter']">{convertAmount(totalPending)}</p>
          <p className="text-[9px] t-muted">{currencyLabel}</p>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingBookings.length > 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[var(--status-yellow)]" />
            <h3 className="text-xs font-bold text-[var(--status-yellow)]/80">{t("payments.pendingRequired")}</h3>
          </div>
          <div className="space-y-2">
            {pendingBookings.map((bk) => (
              <div key={bk.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
                    <CreditCard size={14} className="text-[var(--status-yellow)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] t-secondary truncate">{bookingLabel(bk)}</p>
                    <p className="text-[9px] t-muted">
                      {t("payments.booking")}: <span className="font-['Inter']">{bk.id}</span>
                      {bk.paidAmount > 0 && <span className="text-[var(--status-green)]"> ({t("bookings.partiallyPaid")})</span>}
                    </p>
                  </div>
                </div>
                <div className={`shrink-0 ${isRTL ? "mr-2 text-left" : "ml-2 text-right"}`}>
                  <p className="text-sm font-bold t-gold font-['Inter']">{convertAmount(bk.remainingAmount)}</p>
                  <button onClick={() => handlePay(bk)} className="btn-gold px-3 py-1 rounded-lg text-[10px] mt-1">
                    {t("payments.payNow")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Pending */}
      {pendingBookings.length === 0 && payments.length === 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-6 text-center">
          <CreditCard size={32} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">{t("payments.noPending")}</p>
          <p className="text-[10px] t-muted">{t("payments.noPaymentsDesc")}</p>
        </div>
      )}

      {/* Revenue Split */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="t-gold" />
          <h3 className="text-xs font-bold t-secondary">{t("payments.revenueTransparency")}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { name: t("payments.investor"), pct: "70%", color: "var(--status-blue)" },
            { name: t("payments.mahamExpo"), pct: "20%", color: "var(--gold-accent)" },
            { name: t("payments.operationalFees"), pct: "10%", color: "#A78BFA" },
          ].map((r, i) => (
            <div key={i} className="p-2.5 sm:p-4 rounded-xl text-center" style={{ background: i === 1 ? "var(--gold-bg)" : "var(--glass-bg)", border: i === 1 ? "1px solid var(--gold-border)" : "1px solid var(--glass-border)" }}>
              <p className="text-[10px] t-tertiary mb-1">{r.name}</p>
              <p className="text-lg font-bold font-['Inter']" style={{ color: r.color }}>{r.pct}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions History */}
      {payments.length > 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-[var(--glass-border)]">
            <h3 className="text-sm font-bold t-primary">{t("payments.transactionHistory")}</h3>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-3 space-y-2">
            {payments.map((p, i) => {
              const sc = statusColor[p.status] || "#4ADE80";
              return (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs t-secondary truncate">{isRTL ? p.descAr : p.descEn}</p>
                      <p className="text-[9px] t-muted font-['Inter']">{p.id} · {p.date}</p>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] shrink-0"
                      style={{ backgroundColor: `${sc}15`, color: sc }}>
                      {statusLabel(p.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] t-tertiary">{p.method} · {p.bookingId}</span>
                    <span className="text-sm font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(p.amount)} {currencyLabel}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {[t("payments.transactionId"), t("payments.description"), `${t("payments.amount")} (${currencyLabel})`, t("payments.method"), t("payments.booking"), t("common.status"), t("common.date"), ""].map((h, i) => (
                    <th key={i} className={`${isRTL ? "text-right" : "text-left"} px-4 py-3 text-[11px] t-tertiary font-medium`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => {
                  const sc = statusColor[p.status] || "#4ADE80";
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)]">
                      <td className="px-4 py-3 text-xs t-gold/70 font-['Inter']">{p.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-secondary">{isRTL ? p.descAr : p.descEn}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold font-['Inter'] text-[var(--status-green)]">{convertAmount(p.amount)}</td>
                      <td className="px-4 py-3 text-[11px] t-tertiary">{p.method}</td>
                      <td className="px-4 py-3 text-[11px] t-gold/50 font-['Inter']">{p.bookingId}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${sc}12`, color: sc }}>{statusLabel(p.status)}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] t-tertiary font-['Inter']">{p.date}</td>
                      <td className="px-4 py-3">
                        <button onClick={async () => {
                          toast.info(t("payments.invoiceGenerating"));
                          try {
                            await generatePaymentsPDF({
                              payments: [{ id: p.id, date: p.date, amount: p.amount, method: p.method, status: "Completed", description: p.descEn || p.descAr }],
                              traderName: kycData?.fullName || trader?.name || "Trader",
                              traderCompany: kycData?.companyName || trader?.companyName || "Trader Company",
                              totalPaid: p.amount, totalPending: 0,
                            });
                            toast.success(t("payments.invoiceSuccess"));
                          } catch { toast.error(t("payments.invoiceError")); }
                        }} className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] t-muted hover:t-gold">
                          <Receipt size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs font-bold t-primary mb-3">{t("payments.paymentMethods")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { name: t("payments.mada"), icon: CreditCard },
            { name: t("payments.creditCard"), icon: CreditCard },
            { name: "Apple Pay", icon: Smartphone },
            { name: t("payments.bankTransfer"), icon: Building2 },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center">
              <m.icon size={18} className="t-gold/50 mx-auto mb-1.5" />
              <p className="text-[11px] t-secondary">{m.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && selectedBooking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => !processing && !paymentSuccess && setShowPayModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[95vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[90vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
                {paymentSuccess ? (
                  <div className="space-y-4">
                    <div className="text-center py-3">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                        <CheckCircle size={48} className="mx-auto text-[var(--status-green)] mb-3" />
                      </motion.div>
                      <h3 className="text-base font-bold t-primary mb-1">{t("payments.success")}</h3>
                      <p className="text-[11px] t-tertiary">{t("payments.successDesc")}</p>
                    </div>

                    <div className="rounded-xl p-3" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] t-tertiary">{t("payments.amountPaid")}</span>
                        <span className="text-sm font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(selectedBooking.remainingAmount)} {currencyLabel}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] t-tertiary">{t("payments.booking")}</span>
                        <span className="text-[11px] t-secondary font-['Inter']">{selectedBooking.id}</span>
                      </div>
                      {generatedContractId && (
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] t-tertiary">{t("payments.contractNumber")}</span>
                          <span className="text-[11px] t-gold font-bold font-['Inter']">{generatedContractId}</span>
                        </div>
                      )}
                    </div>

                    {generatedContractId && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText size={14} className="t-gold" />
                          <h4 className="text-xs font-bold t-secondary">{t("payments.sendContract")}</h4>
                        </div>
                        <div className="space-y-2">
                          <button onClick={handleDownloadContract} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("download") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("download") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))" }}>
                              <Download size={16} style={{ color: "var(--btn-gold-text)" }} />
                            </div>
                            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                              <p className="text-xs t-primary font-semibold">{t("payments.downloadPDF")}</p>
                            </div>
                            {sentChannels.includes("download") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          <button onClick={handleSendEmail} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("email") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("email") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                              {contractSending ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--status-blue)" }} /> : <Mail size={16} style={{ color: "var(--status-blue)" }} />}
                            </div>
                            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                              <p className="text-xs t-primary font-semibold">{t("payments.sendEmail")}</p>
                              <p className="text-[9px] t-muted font-['Inter']">{kycData?.email || "—"}</p>
                            </div>
                            {sentChannels.includes("email") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          <button onClick={handleSendSMS} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("sms") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("sms") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(168,85,247,0.15)" }}>
                              <Phone size={16} style={{ color: "#a855f7" }} />
                            </div>
                            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                              <p className="text-xs t-primary font-semibold">{t("payments.sendSMS")}</p>
                              <p className="text-[9px] t-muted font-['Inter']">{kycData?.phone || trader?.phone || "—"}</p>
                            </div>
                            {sentChannels.includes("sms") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          <button onClick={handleSendWhatsApp}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("whatsapp") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("whatsapp") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(37,211,102,0.15)" }}>
                              <MessageSquare size={16} style={{ color: "#25d366" }} />
                            </div>
                            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                              <p className="text-xs t-primary font-semibold">{t("payments.sendWhatsApp")}</p>
                              <p className="text-[9px] t-muted font-['Inter']">WhatsApp</p>
                            </div>
                            {sentChannels.includes("whatsapp") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>
                        </div>

                        <button onClick={() => { setShowPayModal(false); setPaymentSuccess(false); }}
                          className="w-full mt-4 glass-card py-2.5 rounded-xl text-xs t-secondary flex items-center justify-center gap-1.5">
                          <X size={14} />
                          {t("common.close")}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-[var(--status-green)]" />
                        <h3 className="text-sm font-bold t-primary">{t("payments.secureGateway")}</h3>
                      </div>
                      {!processing && (
                        <button onClick={() => setShowPayModal(false)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl p-3 mb-4" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                      <p className="text-xs t-secondary">{bookingLabel(selectedBooking)}</p>
                      <p className="text-2xl font-bold t-gold font-['Inter'] mt-2">
                        {convertAmount(selectedBooking.remainingAmount)} <span className="text-sm t-tertiary">{currencyLabel}</span>
                      </p>
                      <p className="text-[9px] t-muted font-['Inter'] mt-1">Ref: {selectedBooking.id}</p>
                    </div>

                    {kycData && (
                      <div className="rounded-xl p-3 mb-4" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-[10px] t-muted mb-2">{t("payments.traderData")}</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div><span className="t-muted">{t("payments.traderName")}: </span><span className="t-secondary">{kycData.fullName}</span></div>
                          <div><span className="t-muted">{t("payments.traderCompany")}: </span><span className="t-secondary">{kycData.companyName}</span></div>
                          <div><span className="t-muted">{t("payments.traderCR")}: </span><span className="t-secondary font-['Inter']">{kycData.crNumber}</span></div>
                          <div><span className="t-muted">{t("payments.traderPhone")}: </span><span className="t-secondary font-['Inter']">{kycData.phone}</span></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 mb-4">
                      <p className="text-[10px] t-tertiary mb-1">{t("payments.selectMethod")}</p>
                      {[
                        { id: "mada", label: `${t("payments.mada")} | Mada` },
                        { id: "credit", label: `${t("payments.creditCard")} | Credit Card` },
                        { id: "apple", label: "Apple Pay" },
                        { id: "bank", label: `${t("payments.bankTransfer")} | Bank Transfer` },
                      ].map((m) => (
                        <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === m.id ? "bg-gold-subtle border border-[var(--gold-border)]" : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                        }`}>
                          <input type="radio" name="payMethod" value={m.id} checked={paymentMethod === m.id}
                            onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#C5A55A]" />
                          <span className="text-xs t-secondary">{m.label}</span>
                        </label>
                      ))}
                    </div>

                    {(paymentMethod === "mada" || paymentMethod === "credit") && (
                      <div className="space-y-2 mb-4">
                        <input placeholder={t("payments.cardNumber")} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="MM/YY" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                          <input placeholder="CVV" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-[var(--status-green)]/5">
                      <Shield size={11} className="text-[var(--status-green)]/60 shrink-0" />
                      <span className="text-[9px] text-[var(--status-green)]/60">{t("payments.securityNotice")}</span>
                    </div>

                    <button onClick={processPayment} disabled={processing}
                      className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[var(--surface-dark)] border-t-transparent rounded-full animate-spin" />
                          {t("payments.processing")}
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          {t("payments.confirmPayment")} — {convertAmount(selectedBooking.remainingAmount)} {currencyLabel}
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
