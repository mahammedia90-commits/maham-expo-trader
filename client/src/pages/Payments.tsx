/**
 * Payments — Financial management with mobile-first design
 * Mobile: Cards layout, full-screen modals
 * Desktop: Table layout, centered modals
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, TrendingUp, AlertTriangle, Shield, Lock,
  Sparkles, Receipt, X, Building2, Smartphone, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { generatePaymentsPDF } from "@/lib/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  descAr: string;
  descEn: string;
  amount: number;
  method: string;
  booking: string;
  status: "completed" | "pending" | "refunded";
  date: string;
}

interface PendingPayment {
  id: string;
  descAr: string;
  descEn: string;
  amount: number;
  dueDate: string;
  bookingId: string;
  overdue: boolean;
}

const transactions: Transaction[] = [
  { id: "TX-001", descAr: "عربون حجز بوث A21", descEn: "Deposit — Booth A21", amount: 2250, method: "مدى", booking: "BK-2025-001", status: "completed", date: "2025-03-15" },
  { id: "TX-002", descAr: "قسط أول — بوث A21", descEn: "1st Installment — Booth A21", amount: 20250, method: "تحويل بنكي", booking: "BK-2025-001", status: "completed", date: "2025-03-20" },
  { id: "TX-003", descAr: "عربون حجز محل B12", descEn: "Deposit — Shop B12", amount: 2100, method: "Apple Pay", booking: "BK-2025-002", status: "completed", date: "2025-03-12" },
  { id: "TX-004", descAr: "دفعة كاملة — جناح VIP D01", descEn: "Full Payment — VIP Wing D01", amount: 120000, method: "تحويل بنكي", booking: "BK-2025-003", status: "completed", date: "2025-03-10" },
  { id: "TX-005", descAr: "عربون حجز كشك B33", descEn: "Deposit — Kiosk B33", amount: 600, method: "مدى", booking: "BK-2025-004", status: "pending", date: "2025-03-08" },
];

const pendingPayments: PendingPayment[] = [
  { id: "PP-001", descAr: "قسط ثاني — بوث A21", descEn: "2nd Installment — Booth A21", amount: 22500, dueDate: "2025-04-01", bookingId: "BK-2025-001", overdue: false },
  { id: "PP-002", descAr: "قسط أول — محل B12", descEn: "1st Installment — Shop B12", amount: 39900, dueDate: "2025-03-20", bookingId: "BK-2025-002", overdue: true },
];

const statusStyle: Record<string, { ar: string; color: string }> = {
  completed: { ar: "مكتمل", color: "#4ADE80" },
  pending: { ar: "معلّق", color: "#FBBF24" },
  refunded: { ar: "مسترد", color: "#60A5FA" },
};

export default function Payments() {
  const { trader } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [processing, setProcessing] = useState(false);
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");

  const currencyLabel = currency === "SAR" ? "ر.س" : "$";
  const convertAmount = (amount: number) => {
    const val = currency === "USD" ? Math.round(amount / 3.75) : amount;
    return val.toLocaleString();
  };

  const totalPaid = transactions.filter(t => t.status === "completed").reduce((a, t) => a + t.amount, 0);
  const totalPending = pendingPayments.reduce((a, p) => a + p.amount, 0);

  const handlePay = (pp: PendingPayment) => {
    setSelectedPayment(pp);
    setShowPayModal(true);
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPayModal(false);
      toast.success("تم الدفع بنجاح! — Payment Successful");
    }, 2000);
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

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border-[rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[var(--status-yellow)]" />
            <h3 className="text-xs font-bold text-[var(--status-yellow)]/80">مدفوعات مطلوبة</h3>
          </div>
          <div className="space-y-2">
            {pendingPayments.map((pp) => (
              <div key={pp.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
                    <CreditCard size={14} className="text-[var(--status-yellow)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] t-secondary truncate">{pp.descAr}</p>
                    <p className="text-[9px] t-muted">
                      الاستحقاق: <span className="font-['Inter']">{pp.dueDate}</span>
                      {pp.overdue && <span className="text-[var(--status-red)] mr-1">متأخر!</span>}
                    </p>
                  </div>
                </div>
                <div className="text-left shrink-0 mr-2">
                  <p className="text-sm font-bold t-gold font-['Inter']">{convertAmount(pp.amount)}</p>
                  <button onClick={() => handlePay(pp)} className="btn-gold px-3 py-1 rounded-lg text-[10px] mt-1">
                    ادفع الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
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

      {/* Transactions — Mobile: Cards, Desktop: Table */}
      <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-[var(--glass-border)]">
          <h3 className="text-sm font-bold t-primary">سجل المعاملات</h3>
          <p className="text-[9px] t-gold/50 font-['Inter']">Transaction History</p>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-3 space-y-2">
          {transactions.map((t, i) => {
            const ss = statusStyle[t.status];
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
                  <span className="text-[10px] t-tertiary">{t.method} · {t.booking}</span>
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
              {transactions.map((t, i) => {
                const ss = statusStyle[t.status];
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
                    <td className="px-4 py-3 text-[11px] t-gold/50 font-['Inter']">{t.booking}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${ss.color}12`, color: ss.color }}>{ss.ar}</span>
                    </td>
                    <td className="px-4 py-3 text-[11px] t-tertiary font-['Inter']">{t.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={async () => {
                        toast.info("جاري إنشاء الفاتورة...");
                        try {
                          await generatePaymentsPDF({
                            payments: [{
                              id: t.id,
                              date: t.date,
                              amount: t.amount,
                              method: t.method,
                              status: t.status === "completed" ? "Completed" : t.status === "pending" ? "Pending" : t.status,
                              description: t.descEn || t.descAr,
                            }],
                            traderName: trader?.name || "Trader",
                            traderCompany: trader?.companyName || "Trader Company",
                            totalPaid: t.status === "completed" ? t.amount : 0,
                            totalPending: t.status === "pending" ? t.amount : 0,
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
        {showPayModal && selectedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => !processing && setShowPayModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[480px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir="rtl"
            >
              {/* Drag handle on mobile */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
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
                  <p className="text-xs t-secondary">{selectedPayment.descAr}</p>
                  <p className="text-2xl font-bold t-gold font-['Inter'] mt-2">
                    {convertAmount(selectedPayment.amount)} <span className="text-sm t-tertiary">{currencyLabel}</span>
                  </p>
                  <p className="text-[9px] t-muted font-['Inter'] mt-1">Ref: {selectedPayment.bookingId}</p>
                </div>

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
                  <span className="text-[9px] text-[var(--status-green)]/60">الدفع مشفر ومحمي بتقنية SSL</span>
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
                      تأكيد الدفع — {convertAmount(selectedPayment.amount)} {currencyLabel}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
