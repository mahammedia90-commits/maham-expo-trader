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
  ChevronDown, X, Smartphone, Building2, Globe, FileText, Sparkles
} from "lucide-react";
import { toast } from "sonner";

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">المدفوعات والفواتير</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Payments, Invoices & Revenue Split</p>
        </div>
        <button
          onClick={() => toast.success("جاري تحميل كشف الحساب...")}
          className="glass-card px-4 py-2 rounded-xl text-xs text-white/60 hover:text-[#C5A55A] flex items-center gap-2 transition-colors"
        >
          <Download size={14} />
          كشف الحساب
        </button>
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
            <p className="text-xl font-bold text-white/90 font-['Inter']">
              {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
            </p>
            <p className="text-xs text-white/50 mt-1">{s.labelAr}</p>
            <p className="text-[9px] text-white/25 font-['Inter']">{s.labelEn}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Payments — Action Required */}
      {pendingPayments.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border-[rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-yellow-400/80">مدفوعات مطلوبة</h3>
            <span className="text-[9px] text-white/20 font-['Inter']">Action Required — Pending Payments</span>
          </div>
          <div className="space-y-3">
            {pendingPayments.map((pp) => (
              <div key={pp.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                    <CreditCard size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">{pp.descAr}</p>
                    <p className="text-[9px] text-white/25 font-['Inter']">{pp.descEn}</p>
                    <p className="text-[9px] text-white/20 mt-0.5">
                      الاستحقاق: <span className="font-['Inter']">{pp.dueDate}</span>
                      {pp.overdue && <span className="text-red-400 mr-2">متأخر!</span>}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-[#C5A55A] font-['Inter']">{pp.amount.toLocaleString()} <span className="text-xs text-white/30">SAR</span></p>
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
          <Sparkles size={16} className="text-[#C5A55A]" />
          <h3 className="text-sm font-bold text-white/70">شفافية توزيع الإيرادات</h3>
          <span className="text-[9px] text-white/20 font-['Inter']">Revenue Split Transparency</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] text-center">
            <p className="text-[10px] text-white/30 mb-1">المستثمر (المنظم)</p>
            <p className="text-lg font-bold text-blue-400 font-['Inter']">70%</p>
            <p className="text-[8px] text-white/15 font-['Inter']">Investor / Organizer</p>
          </div>
          <div className="p-4 rounded-xl bg-[#C5A55A]/5 text-center border border-[rgba(197,165,90,0.1)]">
            <p className="text-[10px] text-[#C5A55A]/70 mb-1">مهام إكسبو (المشرف)</p>
            <p className="text-lg font-bold text-[#C5A55A] font-['Inter']">20%</p>
            <p className="text-[8px] text-white/15 font-['Inter']">Maham Expo / Supervisor</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] text-center">
            <p className="text-[10px] text-white/30 mb-1">رسوم تشغيلية</p>
            <p className="text-lg font-bold text-purple-400 font-['Inter']">10%</p>
            <p className="text-[8px] text-white/15 font-['Inter']">Operational Fees</p>
          </div>
        </div>
        <p className="text-[9px] text-white/15 mt-3 text-center">
          يتم تقسيم المبالغ تلقائياً عبر نظام الدفع الذكي — لا يمكن التلاعب بالنسب
        </p>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white/80">سجل المعاملات</h3>
          <p className="text-[10px] text-[#C5A55A]/50 font-['Inter']">Transaction History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["رقم المعاملة", "الوصف", "المبلغ (SAR)", "طريقة الدفع", "الحجز", "الحالة", "التاريخ", ""].map((h, i) => (
                  <th key={i} className="text-right px-4 py-3 text-[11px] text-white/35 font-medium">{h}</th>
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
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 text-xs text-[#C5A55A]/70 font-['Inter']">{t.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white/75">{t.descAr}</p>
                      <p className="text-[9px] text-white/25 font-['Inter']">{t.descEn}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold font-['Inter'] text-green-400">
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-white/45">{t.method}</td>
                    <td className="px-4 py-3 text-[11px] text-[#C5A55A]/50 font-['Inter']">{t.booking}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${ss.color}12`, color: ss.color }}>
                        {ss.ar}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-white/35 font-['Inter']">{t.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toast.info(`عرض فاتورة ${t.id}`)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/25 hover:text-[#C5A55A]">
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
        <h3 className="text-sm font-bold text-white/80 mb-1">طرق الدفع المعتمدة</h3>
        <p className="text-[10px] text-[#C5A55A]/50 font-['Inter'] mb-4">Accepted Payment Methods</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { nameAr: "مدى", nameEn: "Mada", icon: CreditCard },
            { nameAr: "بطاقة ائتمان", nameEn: "Credit Card", icon: CreditCard },
            { nameAr: "Apple Pay", nameEn: "Apple Pay", icon: Smartphone },
            { nameAr: "تحويل بنكي", nameEn: "Bank Transfer", icon: Building2 },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <m.icon size={20} className="text-[#C5A55A]/50 mx-auto mb-2" />
              <p className="text-xs text-white/60">{m.nameAr}</p>
              <p className="text-[9px] text-white/20 font-['Inter']">{m.nameEn}</p>
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
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => !processing && setShowPayModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] glass-card rounded-2xl z-50 p-6"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-green-400" />
                  <h3 className="text-base font-bold text-white/80">بوابة الدفع الآمنة</h3>
                </div>
                {!processing && (
                  <button onClick={() => setShowPayModal(false)} className="text-white/30 hover:text-white/60">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Payment Details */}
              <div className="glass-card rounded-xl p-4 mb-5">
                <p className="text-xs text-white/50">{selectedPayment.descAr}</p>
                <p className="text-2xl font-bold text-[#C5A55A] font-['Inter'] mt-2">
                  {selectedPayment.amount.toLocaleString()} <span className="text-sm text-white/30">SAR</span>
                </p>
                <p className="text-[9px] text-white/20 font-['Inter'] mt-1">Ref: {selectedPayment.bookingId}</p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2 mb-5">
                <p className="text-[10px] text-white/40">اختر طريقة الدفع | Select Payment Method</p>
                {[
                  { id: "mada", label: "مدى | Mada" },
                  { id: "credit", label: "بطاقة ائتمان | Credit Card" },
                  { id: "apple", label: "Apple Pay" },
                  { id: "bank", label: "تحويل بنكي | Bank Transfer" },
                ].map((m) => (
                  <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === m.id ? "bg-[#C5A55A]/10 border border-[rgba(197,165,90,0.3)]" : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]"
                  }`}>
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C5A55A]"
                    />
                    <span className="text-xs text-white/60">{m.label}</span>
                  </label>
                ))}
              </div>

              {/* Card Input (for credit/mada) */}
              {(paymentMethod === "mada" || paymentMethod === "credit") && (
                <div className="space-y-3 mb-5">
                  <input placeholder="رقم البطاقة | Card Number" className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]" />
                    <input placeholder="CVV" className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]" />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 mb-5 p-2 rounded-lg bg-green-400/5">
                <Shield size={12} className="text-green-400/60" />
                <span className="text-[9px] text-green-400/60">الدفع مشفر ومحمي بتقنية SSL — متوافق مع PCI DSS</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={processPayment}
                disabled={processing}
                className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0A0A12] border-t-transparent rounded-full animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    تأكيد الدفع — {selectedPayment.amount.toLocaleString()} SAR
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
