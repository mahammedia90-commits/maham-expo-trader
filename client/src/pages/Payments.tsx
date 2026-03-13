/**
 * Payments — Enhanced Payment Gateway with Revenue Split & Installments
 * Design: Obsidian Glass with financial dashboard, payment gateway, installment tracker
 * Features: Pay now, installment plan, invoice download, revenue split display
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  CreditCard, Download, ArrowUpRight, ArrowDownRight, CheckCircle,
  Clock, XCircle, Wallet, Receipt, Shield, Lock, Zap, AlertTriangle,
  ChevronDown, X, Smartphone, Building2, Globe, FileText, Sparkles, DollarSign
} from "lucide-react";
import { toast } from "sonner";

// World currencies with symbols
const CURRENCIES = [
  { code: "SAR", symbol: "\u0631.\u0633", nameAr: "\u0631\u064a\u0627\u0644 \u0633\u0639\u0648\u062f\u064a", nameEn: "Saudi Riyal", rate: 1 },
  { code: "USD", symbol: "$", nameAr: "\u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a", nameEn: "US Dollar", rate: 0.2667 },
  { code: "EUR", symbol: "\u20ac", nameAr: "\u064a\u0648\u0631\u0648", nameEn: "Euro", rate: 0.2450 },
  { code: "GBP", symbol: "\u00a3", nameAr: "\u062c\u0646\u064a\u0647 \u0625\u0633\u062a\u0631\u0644\u064a\u0646\u064a", nameEn: "British Pound", rate: 0.2120 },
  { code: "AED", symbol: "\u062f.\u0625", nameAr: "\u062f\u0631\u0647\u0645 \u0625\u0645\u0627\u0631\u0627\u062a\u064a", nameEn: "UAE Dirham", rate: 0.9793 },
  { code: "KWD", symbol: "\u062f.\u0643", nameAr: "\u062f\u064a\u0646\u0627\u0631 \u0643\u0648\u064a\u062a\u064a", nameEn: "Kuwaiti Dinar", rate: 0.0819 },
  { code: "BHD", symbol: "\u062f.\u0628", nameAr: "\u062f\u064a\u0646\u0627\u0631 \u0628\u062d\u0631\u064a\u0646\u064a", nameEn: "Bahraini Dinar", rate: 0.1005 },
  { code: "QAR", symbol: "\u0631.\u0642", nameAr: "\u0631\u064a\u0627\u0644 \u0642\u0637\u0631\u064a", nameEn: "Qatari Riyal", rate: 0.9707 },
  { code: "OMR", symbol: "\u0631.\u0639", nameAr: "\u0631\u064a\u0627\u0644 \u0639\u0645\u0627\u0646\u064a", nameEn: "Omani Rial", rate: 0.1027 },
  { code: "EGP", symbol: "\u062c.\u0645", nameAr: "\u062c\u0646\u064a\u0647 \u0645\u0635\u0631\u064a", nameEn: "Egyptian Pound", rate: 13.07 },
  { code: "TRY", symbol: "\u20ba", nameAr: "\u0644\u064a\u0631\u0629 \u062a\u0631\u0643\u064a\u0629", nameEn: "Turkish Lira", rate: 9.60 },
  { code: "CNY", symbol: "\u00a5", nameAr: "\u064a\u0648\u0627\u0646 \u0635\u064a\u0646\u064a", nameEn: "Chinese Yuan", rate: 1.9360 },
  { code: "JPY", symbol: "\u00a5", nameAr: "\u064a\u0646 \u064a\u0627\u0628\u0627\u0646\u064a", nameEn: "Japanese Yen", rate: 39.87 },
  { code: "INR", symbol: "\u20b9", nameAr: "\u0631\u0648\u0628\u064a\u0629 \u0647\u0646\u062f\u064a\u0629", nameEn: "Indian Rupee", rate: 22.40 },
  { code: "CAD", symbol: "C$", nameAr: "\u062f\u0648\u0644\u0627\u0631 \u0643\u0646\u062f\u064a", nameEn: "Canadian Dollar", rate: 0.3640 },
  { code: "AUD", symbol: "A$", nameAr: "\u062f\u0648\u0644\u0627\u0631 \u0623\u0633\u062a\u0631\u0627\u0644\u064a", nameEn: "Australian Dollar", rate: 0.4100 },
  { code: "CHF", symbol: "CHF", nameAr: "\u0641\u0631\u0646\u0643 \u0633\u0648\u064a\u0633\u0631\u064a", nameEn: "Swiss Franc", rate: 0.2340 },
  { code: "SGD", symbol: "S$", nameAr: "\u062f\u0648\u0644\u0627\u0631 \u0633\u0646\u063a\u0627\u0641\u0648\u0631\u064a", nameEn: "Singapore Dollar", rate: 0.3560 },
  { code: "MYR", symbol: "RM", nameAr: "\u0631\u064a\u0646\u063a\u064a\u062a \u0645\u0627\u0644\u064a\u0632\u064a", nameEn: "Malaysian Ringgit", rate: 1.1840 },
  { code: "JOD", symbol: "\u062f.\u0623", nameAr: "\u062f\u064a\u0646\u0627\u0631 \u0623\u0631\u062f\u0646\u064a", nameEn: "Jordanian Dinar", rate: 0.1893 },
];

const transactions = [
  { id: "TX-001", descAr: "عربون حجز بوث A21", descEn: "Deposit for Booth A21", amount: 2250, type: "deposit", status: "completed", date: "2025-03-15", method: "مدى", booking: "BK-2025-001" },
  { id: "TX-002", descAr: "دفعة أولى — جناح VIP D01", descEn: "1st Payment — VIP Wing D01", amount: 60000, type: "payment", status: "completed", date: "2025-03-11", method: "بطاقة ائتمان", booking: "BK-2025-003" },
  { id: "TX-003", descAr: "عربون حجز محل B12", descEn: "Deposit for Shop B12", amount: 2100, type: "deposit", status: "pending", date: "2025-03-12", method: "—", booking: "BK-2025-002" },
  { id: "TX-004", descAr: "دفعة ثانية — بوث A21", descEn: "2nd Payment — Booth A21", amount: 20250, type: "payment", status: "completed", date: "2025-03-18", method: "تحويل بنكي", booking: "BK-2025-001" },
  { id: "TX-005", descAr: "رسوم خدمات تشغيلية", descEn: "Operational Services Fee", amount: 3500, type: "fee", status: "completed", date: "2025-03-20", method: "خصم تلقائي", booking: "BK-2025-001" },
  { id: "TX-006", descAr: "دفعة ثانية — جناح VIP D01", descEn: "2nd Payment — VIP Wing D01", amount: 54000, type: "payment", status: "completed", date: "2025-03-22", method: "Apple Pay", booking: "BK-2025-003" },
];

interface PendingPayment {
  id: string;
  bookingId: string;
  descAr: string;
  descEn: string;
  amount: number;
  dueDate: string;
  type: string;
  overdue: boolean;
}

const pendingPayments: PendingPayment[] = [
  { id: "PP-001", bookingId: "BK-2025-002", descAr: "عربون حجز محل B12", descEn: "Deposit for Shop B12", amount: 2100, dueDate: "2025-03-20", type: "deposit", overdue: false },
  { id: "PP-002", bookingId: "BK-2025-001", descAr: "القسط الثالث — بوث A21", descEn: "3rd Installment — Booth A21", amount: 22500, dueDate: "2025-04-01", type: "installment", overdue: false },
];

const statusStyle: Record<string, { ar: string; en: string; color: string }> = {
  completed: { ar: "مكتمل", en: "Completed", color: "#4ADE80" },
  pending: { ar: "معلق", en: "Pending", color: "#FBBF24" },
  failed: { ar: "فشل", en: "Failed", color: "#F87171" },
};

export default function Payments() {
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [processing, setProcessing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("SAR");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const convertAmount = (amountSAR: number) => {
    const converted = amountSAR * currentCurrency.rate;
    return converted < 100 ? converted.toFixed(2) : Math.round(converted).toLocaleString();
  };
  const currencyLabel = currentCurrency.code === "SAR" ? "\u0631.\u0633" : currentCurrency.symbol;

  const totalPaid = transactions.filter(t => t.status === "completed" && t.type !== "refund").reduce((a, t) => a + t.amount, 0);
  const totalPending = pendingPayments.reduce((a, p) => a + p.amount, 0);

  const handlePay = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowPayModal(true);
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPayModal(false);
      toast.success("تم الدفع بنجاح! | Payment successful!");
    }, 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold t-primary">المدفوعات والفواتير</h2>
          <p className="text-xs t-gold/50 font-['Inter']">Payments, Invoices & Revenue Split</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
              className="glass-card px-3 py-2 rounded-xl text-xs t-secondary hover:t-gold flex items-center gap-2 transition-colors"
            >
              <Globe size={14} />
              <span className="font-['Inter']">{currentCurrency.code}</span>
              <span className="text-[10px] t-muted">{currentCurrency.symbol}</span>
              <ChevronDown size={12} />
            </button>
            {showCurrencyPicker && (
              <div className="absolute left-0 top-full mt-1 modal-solid rounded-xl shadow-2xl z-50 w-72 max-h-80 overflow-y-auto" dir="rtl">
                <div className="p-2 border-b border-[var(--glass-border)]">
                  <p className="text-[10px] t-muted px-2 py-1">اختر العملة | Select Currency</p>
                </div>
                <div className="p-1">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setSelectedCurrency(c.code); setShowCurrencyPicker(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        selectedCurrency === c.code ? "bg-gold-subtle t-gold" : "t-secondary hover:bg-[var(--glass-bg)]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-['Inter'] font-bold w-8">{c.symbol}</span>
                        <span>{c.nameAr}</span>
                      </div>
                      <span className="font-['Inter'] text-[10px] t-muted">{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => toast.success("جاري تحميل كشف الحساب...")}
            className="glass-card px-4 py-2 rounded-xl text-xs t-secondary hover:t-gold flex items-center gap-2 transition-colors"
          >
            <Download size={14} />
            كشف الحساب
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { labelAr: "إجمالي المدفوعات", labelEn: "Total Paid", value: totalPaid, color: "#4ADE80", icon: ArrowUpRight },
          { labelAr: "المبالغ المعلقة", labelEn: "Pending", value: totalPending, color: "#FBBF24", icon: Clock },
          { labelAr: "عدد المعاملات", labelEn: "Transactions", value: transactions.length, color: "#60A5FA", icon: Receipt },
          { labelAr: "طرق الدفع", labelEn: "Methods", value: "4", color: "#C5A55A", icon: CreditCard },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-xl font-bold t-primary font-['Inter']">
              {typeof s.value === "number" ? convertAmount(s.value) : s.value}
              {typeof s.value === "number" && <span className="text-xs t-muted mr-1">{currencyLabel}</span>}
            </p>
            <p className="text-xs t-secondary mt-1">{s.labelAr}</p>
            <p className="text-[9px] t-muted font-['Inter']">{s.labelEn}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Payments — Action Required */}
      {pendingPayments.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border-[rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-[var(--status-yellow)]" />
            <h3 className="text-sm font-bold text-[var(--status-yellow)]/80">مدفوعات مطلوبة</h3>
            <span className="text-[9px] t-muted font-['Inter']">Action Required — Pending Payments</span>
          </div>
          <div className="space-y-3">
            {pendingPayments.map((pp) => (
              <div key={pp.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                    <CreditCard size={16} className="text-[var(--status-yellow)]" />
                  </div>
                  <div>
                    <p className="text-xs t-secondary">{pp.descAr}</p>
                    <p className="text-[9px] t-muted font-['Inter']">{pp.descEn}</p>
                    <p className="text-[9px] t-muted mt-0.5">
                      الاستحقاق: <span className="font-['Inter']">{pp.dueDate}</span>
                      {pp.overdue && <span className="text-[var(--status-red)] mr-2">متأخر!</span>}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base font-bold t-gold font-['Inter']">{convertAmount(pp.amount)} <span className="text-xs t-tertiary">{currencyLabel}</span></p>
                  <button
                    onClick={() => handlePay(pp)}
                    className="btn-gold px-4 py-1.5 rounded-lg text-[10px] mt-1"
                  >
                    ادفع الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Split Transparency */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="t-gold" />
          <h3 className="text-sm font-bold t-secondary">شفافية توزيع الإيرادات</h3>
          <span className="text-[9px] t-muted font-['Inter']">Revenue Split Transparency</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[var(--glass-bg)] text-center">
            <p className="text-[10px] t-tertiary mb-1">المستثمر (المنظم)</p>
            <p className="text-lg font-bold text-[var(--status-blue)] font-['Inter']">70%</p>
            <p className="text-[8px] t-muted font-['Inter']">Investor / Organizer</p>
          </div>
          <div className="p-4 rounded-xl bg-gold-subtle text-center border border-[rgba(197,165,90,0.1)]">
            <p className="text-[10px] t-gold/70 mb-1">مهام إكسبو (المشرف)</p>
            <p className="text-lg font-bold t-gold font-['Inter']">20%</p>
            <p className="text-[8px] t-muted font-['Inter']">Maham Expo / Supervisor</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--glass-bg)] text-center">
            <p className="text-[10px] t-tertiary mb-1">رسوم تشغيلية</p>
            <p className="text-lg font-bold text-purple-400 font-['Inter']">10%</p>
            <p className="text-[8px] t-muted font-['Inter']">Operational Fees</p>
          </div>
        </div>
        <p className="text-[9px] t-muted mt-3 text-center">
          يتم تقسيم المبالغ تلقائياً عبر نظام الدفع الذكي — لا يمكن التلاعب بالنسب
        </p>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--glass-border)]">
          <h3 className="text-sm font-bold t-primary">سجل المعاملات</h3>
          <p className="text-[10px] t-gold/50 font-['Inter']">Transaction History</p>
        </div>
        <div className="overflow-x-auto">
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
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)]"
                  >
                    <td className="px-4 py-3 text-xs t-gold/70 font-['Inter']">{t.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs t-secondary">{t.descAr}</p>
                      <p className="text-[9px] t-muted font-['Inter']">{t.descEn}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold font-['Inter'] text-[var(--status-green)]">
                      {convertAmount(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-[11px] t-tertiary">{t.method}</td>
                    <td className="px-4 py-3 text-[11px] t-gold/50 font-['Inter']">{t.booking}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${ss.color}12`, color: ss.color }}>
                        {ss.ar}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] t-tertiary font-['Inter']">{t.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toast.info(`عرض فاتورة ${t.id}`)} className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] t-muted hover:t-gold">
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
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold t-primary mb-1">طرق الدفع المعتمدة</h3>
        <p className="text-[10px] t-gold/50 font-['Inter'] mb-4">Accepted Payment Methods</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { nameAr: "مدى", nameEn: "Mada", icon: CreditCard },
            { nameAr: "بطاقة ائتمان", nameEn: "Credit Card", icon: CreditCard },
            { nameAr: "Apple Pay", nameEn: "Apple Pay", icon: Smartphone },
            { nameAr: "تحويل بنكي", nameEn: "Bank Transfer", icon: Building2 },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center">
              <m.icon size={20} className="t-gold/50 mx-auto mb-2" />
              <p className="text-xs t-secondary">{m.nameAr}</p>
              <p className="text-[9px] t-muted font-['Inter']">{m.nameEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] md:max-h-[90vh] modal-solid rounded-xl sm:rounded-2xl z-50 p-3 sm:p-6 overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[var(--status-green)]" />
                  <h3 className="text-base font-bold t-primary">بوابة الدفع الآمنة</h3>
                </div>
                {!processing && (
                  <button onClick={() => setShowPayModal(false)} className="t-tertiary hover:t-secondary">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Payment Details */}
              <div className="modal-inner rounded-xl p-4 mb-5">
                <p className="text-xs t-secondary">{selectedPayment.descAr}</p>
                <p className="text-2xl font-bold t-gold font-['Inter'] mt-2">
                  {convertAmount(selectedPayment.amount)} <span className="text-sm t-tertiary">{currencyLabel}</span>
                </p>
                <p className="text-[9px] t-muted font-['Inter'] mt-1">Ref: {selectedPayment.bookingId}</p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2 mb-5">
                <p className="text-[10px] t-tertiary">اختر طريقة الدفع | Select Payment Method</p>
                {[
                  { id: "mada", label: "مدى | Mada" },
                  { id: "credit", label: "بطاقة ائتمان | Credit Card" },
                  { id: "apple", label: "Apple Pay" },
                  { id: "bank", label: "تحويل بنكي | Bank Transfer" },
                ].map((m) => (
                  <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === m.id ? "bg-gold-subtle border border-[var(--gold-border)]" : "bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
                  }`}>
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C5A55A]"
                    />
                    <span className="text-xs t-secondary">{m.label}</span>
                  </label>
                ))}
              </div>

              {/* Card Input (for credit/mada) */}
              {(paymentMethod === "mada" || paymentMethod === "credit") && (
                <div className="space-y-3 mb-5">
                  <input placeholder="رقم البطاقة | Card Number" className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                    <input placeholder="CVV" className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 mb-5 p-2 rounded-lg bg-[var(--status-green)]/5">
                <Shield size={12} className="text-[var(--status-green)]/60" />
                <span className="text-[9px] text-[var(--status-green)]/60">الدفع مشفر ومحمي بتقنية SSL — متوافق مع PCI DSS</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={processPayment}
                disabled={processing}
                className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
