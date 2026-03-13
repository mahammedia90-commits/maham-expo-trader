/**
 * Payments — Financial management with mobile-first design
 * NEW FLOW: Payment completion → Auto-generate contract → Multi-channel delivery
 * Mobile: Cards layout, full-screen modals
 * Desktop: Table layout, centered modals
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
import type { BookingRecord } from "@/contexts/AuthContext";

const statusStyle: Record<string, { ar: string; color: string }> = {
  completed: { ar: "مكتمل", color: "#4ADE80" },
  pending: { ar: "معلّق", color: "#FBBF24" },
  refunded: { ar: "مسترد", color: "#60A5FA" },
};

export default function Payments() {
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

  const currencyLabel = currency === "SAR" ? "ر.س" : "$";
  const convertAmount = (amount: number) => {
    const val = currency === "USD" ? Math.round(amount / 3.75) : amount;
    return val.toLocaleString();
  };

  // Calculate totals from real data
  const totalPaid = payments.filter(t => t.status === "completed").reduce((a, t) => a + t.amount, 0);
  const pendingBookings = bookings.filter(b => b.remainingAmount > 0 && b.status !== "cancelled");
  const totalPending = pendingBookings.reduce((a, b) => a + b.remainingAmount, 0);

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
      // 1. Record the payment
      const paymentAmount = selectedBooking.remainingAmount;
      const newPayment = addPayment({
        bookingId: selectedBooking.id,
        amount: paymentAmount,
        method: paymentMethod === "mada" ? "مدى" : paymentMethod === "credit" ? "بطاقة ائتمان" : paymentMethod === "apple" ? "Apple Pay" : "تحويل بنكي",
        type: "full_payment",
        descAr: `دفعة كاملة — ${selectedBooking.unitAr}`,
        descEn: `Full Payment — ${selectedBooking.unitEn}`,
      });

      // 2. Update booking payment status
      updateBookingPayment(selectedBooking.id, paymentAmount);

      // 3. Auto-generate contract after successful payment
      const newContract = addContract(selectedBooking.id, newPayment.id);

      if (newContract) {
        setGeneratedContractId(newContract.id);

        // 4. Add notifications
        addNotification({
          type: "payment",
          titleAr: `تم الدفع بنجاح — ${selectedBooking.unitAr}`,
          titleEn: `Payment Successful — ${selectedBooking.unitEn}`,
          message: `تم سداد مبلغ ${paymentAmount.toLocaleString()} ر.س بنجاح. تم إصدار العقد رقم ${newContract.id}`,
          link: "/contracts",
        });

        addNotification({
          type: "contract",
          titleAr: `عقد جديد — ${newContract.id}`,
          titleEn: `New Contract — ${newContract.id}`,
          message: `تم إصدار عقد تشغيل ${selectedBooking.unitAr} تلقائياً بعد اكتمال الدفع. يرجى مراجعة العقد والتوقيع.`,
          link: "/contracts",
        });
      }

      setProcessing(false);
      setPaymentSuccess(true);
      toast.success("تم الدفع بنجاح! تم إصدار العقد تلقائياً");
    }, 2500);
  };

  /** Build contract data for PDF generation */
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
      toast.success("تم تحميل العقد بنجاح");
    } catch { toast.error("حدث خطأ في تحميل العقد"); }
    setContractSending(false);
  };

  const handleSendEmail = () => {
    const email = kycData?.email || "";
    if (!email) { toast.error("لا يوجد بريد إلكتروني مسجل"); return; }
    setContractSending(true);
    setTimeout(() => {
      setSentChannels(prev => [...prev, "email"]);
      if (generatedContractId) markContractSent(generatedContractId, "email");
      toast.success(`تم إرسال العقد إلى ${email}`);
      setContractSending(false);
    }, 1500);
  };

  const handleSendSMS = () => {
    const phone = kycData?.phone || trader?.phone || "";
    if (!phone) { toast.error("لا يوجد رقم جوال مسجل"); return; }
    setContractSending(true);
    setTimeout(() => {
      setSentChannels(prev => [...prev, "sms"]);
      if (generatedContractId) markContractSent(generatedContractId, "sms");
      toast.success(`تم إرسال رابط العقد عبر SMS إلى ${phone}`);
      setContractSending(false);
    }, 1200);
  };

  const handleSendWhatsApp = () => {
    const phone = kycData?.phone || trader?.phone || "";
    if (!phone) { toast.error("لا يوجد رقم جوال مسجل"); return; }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const intlPhone = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `966${cleanPhone.replace(/^0/, "")}`;
    const data = getContractDataForPDF();
    if (!data) return;
    const message = encodeURIComponent(
      `*عقد تشغيل — ${data.expoName}*\n\n` +
      `رقم العقد: ${data.contractId}\n` +
      `رقم الحجز: ${data.bookingId}\n` +
      `الموقع: بوث ${data.boothNumber}\n` +
      `المساحة: ${data.boothSize}\n` +
      `القيمة الإجمالية: ${data.totalValue.toLocaleString()} ريال\n` +
      `الفترة: ${data.startDate} — ${data.endDate}\n\n` +
      `تم إصدار العقد بعد اكتمال الدفع بنجاح.\n` +
      `يرجى مراجعة العقد والتوقيع خلال 7 أيام.\n\n` +
      `— شركة مهام إكسبو لتنظيم المعارض والمؤتمرات\n` +
      `0535555900 | info@maham.com.sa`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, "_blank");
    setSentChannels(prev => [...prev, "whatsapp"]);
    if (generatedContractId) markContractSent(generatedContractId, "whatsapp");
    toast.success("تم فتح واتساب لإرسال العقد");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">المدفوعات</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Payments & Billing</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrency(c => c === "SAR" ? "USD" : "SAR")}
            className="glass-card px-2.5 py-1.5 rounded-lg text-[10px] t-secondary"
          >
            {currency === "SAR" ? "ر.س → $" : "$ → ر.س"}
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
            <span className="text-[10px] t-tertiary">إجمالي المدفوع</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(totalPaid)}</p>
          <p className="text-[9px] t-muted">{currencyLabel} · Paid</p>
        </div>
        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FBBF2415" }}>
              <AlertTriangle size={14} style={{ color: "#FBBF24" }} />
            </div>
            <span className="text-[10px] t-tertiary">مطلوب دفعه</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[var(--status-yellow)] font-['Inter']">{convertAmount(totalPending)}</p>
          <p className="text-[9px] t-muted">{currencyLabel} · Pending</p>
        </div>
      </div>

      {/* Pending Payments from Real Bookings */}
      {pendingBookings.length > 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border-[rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[var(--status-yellow)]" />
            <h3 className="text-xs font-bold text-[var(--status-yellow)]/80">مدفوعات مطلوبة — حجوزات بانتظار الدفع</h3>
          </div>
          <div className="space-y-2">
            {pendingBookings.map((bk) => (
              <div key={bk.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
                    <CreditCard size={14} className="text-[var(--status-yellow)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] t-secondary truncate">{bk.unitAr} — {bk.expoNameAr}</p>
                    <p className="text-[9px] t-muted">
                      الحجز: <span className="font-['Inter']">{bk.id}</span>
                      {bk.paidAmount > 0 && <span className="text-[var(--status-green)] mr-1"> (مدفوع جزئياً)</span>}
                    </p>
                  </div>
                </div>
                <div className="text-left shrink-0 mr-2">
                  <p className="text-sm font-bold t-gold font-['Inter']">{convertAmount(bk.remainingAmount)}</p>
                  <button onClick={() => handlePay(bk)} className="btn-gold px-3 py-1 rounded-lg text-[10px] mt-1">
                    ادفع الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Pending Payments Message */}
      {pendingBookings.length === 0 && payments.length === 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-6 text-center">
          <CreditCard size={32} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">لا توجد مدفوعات حالياً</p>
          <p className="text-[10px] t-muted">قم بحجز وحدة في أحد المعارض وسيظهر هنا رابط الدفع</p>
        </div>
      )}

      {/* Revenue Split */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="t-gold" />
          <h3 className="text-xs font-bold t-secondary">شفافية توزيع الإيرادات</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { nameAr: "المستثمر", pct: "70%", color: "var(--status-blue)" },
            { nameAr: "مهام إكسبو", pct: "20%", color: "var(--gold-accent)" },
            { nameAr: "رسوم تشغيلية", pct: "10%", color: "#A78BFA" },
          ].map((r, i) => (
            <div key={i} className="p-2.5 sm:p-4 rounded-xl text-center" style={{ background: i === 1 ? "var(--gold-bg)" : "var(--glass-bg)", border: i === 1 ? "1px solid var(--gold-border)" : "1px solid var(--glass-border)" }}>
              <p className="text-[10px] t-tertiary mb-1">{r.nameAr}</p>
              <p className="text-lg font-bold font-['Inter']" style={{ color: r.color }}>{r.pct}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions History — from real payments */}
      {payments.length > 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-[var(--glass-border)]">
            <h3 className="text-sm font-bold t-primary">سجل المعاملات</h3>
            <p className="text-[9px] t-gold/50 font-['Inter']">Transaction History</p>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-3 space-y-2">
            {payments.map((t, i) => {
              const ss = statusStyle[t.status] || statusStyle.completed;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs t-secondary truncate">{t.descAr}</p>
                      <p className="text-[9px] t-muted font-['Inter']">{t.id} · {t.date}</p>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] shrink-0 mr-2"
                      style={{ backgroundColor: `${ss.color}15`, color: ss.color }}>
                      {ss.ar}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] t-tertiary">{t.method} · {t.bookingId}</span>
                    <span className="text-sm font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(t.amount)} {currencyLabel}</span>
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
                  {["رقم المعاملة", "الوصف", `المبلغ (${currencyLabel})`, "طريقة الدفع", "الحجز", "الحالة", "التاريخ", ""].map((h, i) => (
                    <th key={i} className="text-right px-4 py-3 text-[11px] t-tertiary font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((t, i) => {
                  const ss = statusStyle[t.status] || statusStyle.completed;
                  return (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)]">
                      <td className="px-4 py-3 text-xs t-gold/70 font-['Inter']">{t.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-secondary">{t.descAr}</p>
                        <p className="text-[9px] t-muted font-['Inter']">{t.descEn}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold font-['Inter'] text-[var(--status-green)]">{convertAmount(t.amount)}</td>
                      <td className="px-4 py-3 text-[11px] t-tertiary">{t.method}</td>
                      <td className="px-4 py-3 text-[11px] t-gold/50 font-['Inter']">{t.bookingId}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${ss.color}12`, color: ss.color }}>{ss.ar}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] t-tertiary font-['Inter']">{t.date}</td>
                      <td className="px-4 py-3">
                        <button onClick={async () => {
                          toast.info("جاري إنشاء الفاتورة...");
                          try {
                            await generatePaymentsPDF({
                              payments: [{ id: t.id, date: t.date, amount: t.amount, method: t.method, status: "Completed", description: t.descEn || t.descAr }],
                              traderName: kycData?.fullName || trader?.name || "Trader",
                              traderCompany: kycData?.companyName || trader?.companyName || "Trader Company",
                              totalPaid: t.amount,
                              totalPending: 0,
                            });
                            toast.success("تم تحميل الفاتورة بنجاح!");
                          } catch { toast.error("حدث خطأ في إنشاء الفاتورة"); }
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
        <h3 className="text-xs font-bold t-primary mb-3">طرق الدفع المعتمدة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { nameAr: "مدى", icon: CreditCard },
            { nameAr: "بطاقة ائتمان", icon: CreditCard },
            { nameAr: "Apple Pay", icon: Smartphone },
            { nameAr: "تحويل بنكي", icon: Building2 },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center">
              <m.icon size={18} className="t-gold/50 mx-auto mb-1.5" />
              <p className="text-[11px] t-secondary">{m.nameAr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal — full-screen on mobile */}
      <AnimatePresence>
        {showPayModal && selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => !processing && !paymentSuccess && setShowPayModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[95vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[90vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir="rtl"
            >
              {/* Drag handle on mobile */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
                {/* ═══ PAYMENT SUCCESS + CONTRACT DELIVERY ═══ */}
                {paymentSuccess ? (
                  <div className="space-y-4">
                    {/* Success Header */}
                    <div className="text-center py-3">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                        <CheckCircle size={48} className="mx-auto text-[var(--status-green)] mb-3" />
                      </motion.div>
                      <h3 className="text-base font-bold t-primary mb-1">تم الدفع بنجاح!</h3>
                      <p className="text-[11px] t-tertiary">تم سداد المبلغ وإصدار العقد تلقائياً</p>
                    </div>

                    {/* Payment Summary */}
                    <div className="rounded-xl p-3" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] t-tertiary">المبلغ المدفوع</span>
                        <span className="text-sm font-bold text-[var(--status-green)] font-['Inter']">{convertAmount(selectedBooking.remainingAmount)} {currencyLabel}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] t-tertiary">الحجز</span>
                        <span className="text-[11px] t-secondary font-['Inter']">{selectedBooking.id}</span>
                      </div>
                      {generatedContractId && (
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] t-tertiary">رقم العقد</span>
                          <span className="text-[11px] t-gold font-bold font-['Inter']">{generatedContractId}</span>
                        </div>
                      )}
                    </div>

                    {/* Contract Delivery Section */}
                    {generatedContractId && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText size={14} className="t-gold" />
                          <h4 className="text-xs font-bold t-secondary">إرسال العقد الإلكتروني</h4>
                        </div>

                        <div className="space-y-2">
                          {/* Download */}
                          <button onClick={handleDownloadContract} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("download") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("download") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))" }}>
                              <Download size={16} style={{ color: "var(--btn-gold-text)" }} />
                            </div>
                            <div className="flex-1 text-right">
                              <p className="text-xs t-primary font-semibold">تحميل نسخة PDF</p>
                              <p className="text-[9px] t-muted font-['Inter']">Download PDF Copy</p>
                            </div>
                            {sentChannels.includes("download") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          {/* Email */}
                          <button onClick={handleSendEmail} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("email") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("email") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                              {contractSending ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--status-blue)" }} /> : <Mail size={16} style={{ color: "var(--status-blue)" }} />}
                            </div>
                            <div className="flex-1 text-right">
                              <p className="text-xs t-primary font-semibold">إرسال عبر البريد الإلكتروني</p>
                              <p className="text-[9px] t-muted font-['Inter']">{kycData?.email || "—"}</p>
                            </div>
                            {sentChannels.includes("email") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          {/* SMS */}
                          <button onClick={handleSendSMS} disabled={contractSending}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("sms") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("sms") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(168,85,247,0.15)" }}>
                              <Phone size={16} style={{ color: "#a855f7" }} />
                            </div>
                            <div className="flex-1 text-right">
                              <p className="text-xs t-primary font-semibold">إرسال رابط عبر SMS</p>
                              <p className="text-[9px] t-muted font-['Inter']">{kycData?.phone || trader?.phone || "—"}</p>
                            </div>
                            {sentChannels.includes("sms") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>

                          {/* WhatsApp */}
                          <button onClick={handleSendWhatsApp}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{ background: sentChannels.includes("whatsapp") ? "rgba(34,197,94,0.08)" : "var(--glass-bg)", border: `1px solid ${sentChannels.includes("whatsapp") ? "rgba(34,197,94,0.3)" : "var(--glass-border)"}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(37,211,102,0.15)" }}>
                              <MessageSquare size={16} style={{ color: "#25d366" }} />
                            </div>
                            <div className="flex-1 text-right">
                              <p className="text-xs t-primary font-semibold">إرسال عبر واتساب</p>
                              <p className="text-[9px] t-muted font-['Inter']">WhatsApp</p>
                            </div>
                            {sentChannels.includes("whatsapp") && <CheckCircle size={16} style={{ color: "var(--status-green)" }} />}
                          </button>
                        </div>

                        {/* Close Button */}
                        <button onClick={() => { setShowPayModal(false); setPaymentSuccess(false); }}
                          className="w-full mt-4 glass-card py-2.5 rounded-xl text-xs t-secondary flex items-center justify-center gap-1.5">
                          <X size={14} />
                          إغلاق
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ═══ PAYMENT FORM ═══ */
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-[var(--status-green)]" />
                        <h3 className="text-sm font-bold t-primary">بوابة الدفع الآمنة</h3>
                      </div>
                      {!processing && (
                        <button onClick={() => setShowPayModal(false)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Payment Details */}
                    <div className="rounded-xl p-3 mb-4" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                      <p className="text-xs t-secondary">{selectedBooking.unitAr} — {selectedBooking.expoNameAr}</p>
                      <p className="text-2xl font-bold t-gold font-['Inter'] mt-2">
                        {convertAmount(selectedBooking.remainingAmount)} <span className="text-sm t-tertiary">{currencyLabel}</span>
                      </p>
                      <p className="text-[9px] t-muted font-['Inter'] mt-1">Ref: {selectedBooking.id}</p>
                    </div>

                    {/* Trader Info from KYC */}
                    {kycData && (
                      <div className="rounded-xl p-3 mb-4" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-[10px] t-muted mb-2">بيانات التاجر (من التوثيق)</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div><span className="t-muted">الاسم: </span><span className="t-secondary">{kycData.fullName}</span></div>
                          <div><span className="t-muted">الشركة: </span><span className="t-secondary">{kycData.companyName}</span></div>
                          <div><span className="t-muted">السجل: </span><span className="t-secondary font-['Inter']">{kycData.crNumber}</span></div>
                          <div><span className="t-muted">الجوال: </span><span className="t-secondary font-['Inter']">{kycData.phone}</span></div>
                        </div>
                      </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-[10px] t-tertiary mb-1">اختر طريقة الدفع</p>
                      {[
                        { id: "mada", label: "مدى | Mada" },
                        { id: "credit", label: "بطاقة ائتمان | Credit Card" },
                        { id: "apple", label: "Apple Pay" },
                        { id: "bank", label: "تحويل بنكي | Bank Transfer" },
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

                    {/* Card Input */}
                    {(paymentMethod === "mada" || paymentMethod === "credit") && (
                      <div className="space-y-2 mb-4">
                        <input placeholder="رقم البطاقة" className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="MM/YY" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                          <input placeholder="CVV" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                        </div>
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-[var(--status-green)]/5">
                      <Shield size={11} className="text-[var(--status-green)]/60 shrink-0" />
                      <span className="text-[9px] text-[var(--status-green)]/60">الدفع مشفر ومحمي بتقنية SSL — العقد يصدر تلقائياً بعد الدفع</span>
                    </div>

                    {/* Pay Button */}
                    <button onClick={processPayment} disabled={processing}
                      className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[var(--surface-dark)] border-t-transparent rounded-full animate-spin" />
                          جاري المعالجة...
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          تأكيد الدفع — {convertAmount(selectedBooking.remainingAmount)} {currencyLabel}
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
