/**
 * Payments — Payment management with deposit gateway
 * Design: Obsidian Glass with financial data display
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Download, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, XCircle, Wallet, Receipt } from "lucide-react";
import { toast } from "sonner";

const transactions = [
  { id: "TX-001", descAr: "عربون حجز بوث A1", descEn: "Deposit for Booth A1", amount: "+2,250", type: "deposit", status: "completed", date: "2025-03-15", method: "تحويل بنكي" },
  { id: "TX-002", descAr: "دفعة أولى — جناح VIP C1", descEn: "1st Payment — VIP Wing C1", amount: "+60,000", type: "payment", status: "completed", date: "2025-03-11", method: "بطاقة ائتمان" },
  { id: "TX-003", descAr: "عربون حجز محل B2", descEn: "Deposit for Shop B2", amount: "+2,100", type: "deposit", status: "pending", date: "2025-03-12", method: "—" },
  { id: "TX-004", descAr: "دفعة ثانية — بوث A1", descEn: "2nd Payment — Booth A1", amount: "+21,375", type: "payment", status: "completed", date: "2025-03-18", method: "تحويل بنكي" },
  { id: "TX-005", descAr: "رسوم خدمات تشغيلية", descEn: "Operational Services Fee", amount: "+3,500", type: "fee", status: "completed", date: "2025-03-20", method: "خصم تلقائي" },
  { id: "TX-006", descAr: "استرداد — كشك B3 (ملغي)", descEn: "Refund — Kiosk B3 (Cancelled)", amount: "-600", type: "refund", status: "completed", date: "2025-03-09", method: "تحويل بنكي" },
];

const summaryCards = [
  { labelAr: "إجمالي المدفوعات", labelEn: "Total Paid", value: "٨٩,٢٢٥", unit: "ريال", color: "#4ADE80", icon: ArrowUpRight },
  { labelAr: "المبالغ المعلقة", labelEn: "Pending", value: "٢,١٠٠", unit: "ريال", color: "#FBBF24", icon: Clock },
  { labelAr: "المبالغ المستردة", labelEn: "Refunded", value: "٦٠٠", unit: "ريال", color: "#F87171", icon: ArrowDownRight },
  { labelAr: "المتبقي", labelEn: "Remaining", value: "١٤١,٧٧٥", unit: "ريال", color: "#C5A55A", icon: Wallet },
];

const statusStyle: Record<string, { ar: string; color: string }> = {
  completed: { ar: "مكتمل", color: "#4ADE80" },
  pending: { ar: "معلق", color: "#FBBF24" },
  failed: { ar: "فشل", color: "#F87171" },
};

export default function Payments() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">المدفوعات والفواتير</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Payments & Invoices</p>
        </div>
        <button
          onClick={() => toast.info("جاري تحميل كشف الحساب...")}
          className="glass-card px-4 py-2 rounded-xl text-xs text-white/60 hover:text-[#C5A55A] flex items-center gap-2"
        >
          <Download size={14} />
          تحميل كشف الحساب
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
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
            <p className="text-xl font-bold text-white/90 font-['Inter']">{s.value}</p>
            <p className="text-[10px] text-white/30">{s.unit}</p>
            <p className="text-xs text-white/50 mt-1">{s.labelAr}</p>
            <p className="text-[9px] text-white/25 font-['Inter']">{s.labelEn}</p>
          </motion.div>
        ))}
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
                {["رقم المعاملة", "الوصف", "المبلغ", "طريقة الدفع", "الحالة", "التاريخ", ""].map((h, i) => (
                  <th key={i} className="text-right px-4 py-3 text-[11px] text-white/35 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const ss = statusStyle[t.status];
                const isRefund = t.amount.startsWith("-");
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
                    <td className={`px-4 py-3 text-sm font-semibold font-['Inter'] ${isRefund ? "text-red-400" : "text-green-400"}`}>
                      {t.amount} SAR
                    </td>
                    <td className="px-4 py-3 text-[11px] text-white/45">{t.method}</td>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { nameAr: "تحويل بنكي", nameEn: "Bank Transfer", desc: "IBAN: SA..." },
            { nameAr: "بطاقة ائتمان / مدى", nameEn: "Credit Card / Mada", desc: "Visa, Mastercard, Mada" },
            { nameAr: "Apple Pay / STC Pay", nameEn: "Digital Wallets", desc: "Apple Pay, STC Pay" },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={14} className="text-[#C5A55A]" />
                <span className="text-xs text-white/70 font-medium">{m.nameAr}</span>
              </div>
              <p className="text-[10px] text-white/30 font-['Inter']">{m.nameEn}</p>
              <p className="text-[10px] text-white/20 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
