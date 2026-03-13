/**
 * Bookings — Enhanced Booking Management with Full Flow
 * All text uses t() for multi-language support
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  CalendarCheck, Search, Eye, Download, Plus, CheckCircle,
  AlertTriangle, XCircle, Clock, CreditCard, FileText, MapPin,
  Shield, ChevronDown, X, Building2, Zap, Lock
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingGuard from "@/components/BookingGuard";
import { generateBookingPDF } from "@/lib/pdfGenerator";

export default function Bookings() {
  const { t, lang, isRTL } = useLanguage();
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showGuard, setShowGuard] = useState(false);
  const { canBook, trader, bookings, contracts, kycData } = useAuth();

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      confirmed: t("bookings.confirmed"), active: t("bookings.active"),
      pending_payment: t("bookings.pendingPayment"), pending_review: t("bookings.underReview"),
      cancelled: t("bookings.cancelled"),
    };
    return map[status] || status;
  };
  const statusColor: Record<string, string> = {
    confirmed: "#4ADE80", active: "#60A5FA", pending_payment: "#FBBF24",
    pending_review: "#A78BFA", cancelled: "#F87171",
  };
  const StatusIcon: Record<string, any> = {
    confirmed: CheckCircle, active: Zap, pending_payment: Clock,
    pending_review: AlertTriangle, cancelled: XCircle,
  };

  const filtered = bookings.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.unitAr.includes(search) && !b.unitEn?.toLowerCase().includes(search.toLowerCase()) && !b.id.includes(search) && !b.expoNameAr.includes(search)) return false;
    return true;
  });

  const totalValue = bookings.filter(b => b.status !== "cancelled").reduce((a, b) => a + b.price, 0);
  const totalPaid = bookings.reduce((a, b) => a + b.paidAmount, 0);
  const totalRemaining = bookings.reduce((a, b) => a + b.remainingAmount, 0);
  const getContract = (bookingId: string) => contracts.find(c => c.bookingId === bookingId);

  const unitLabel = (b: any) => isRTL ? b.unitAr : (b.unitEn || b.unitAr);
  const expoLabel = (b: any) => isRTL ? b.expoNameAr : (b.expoNameEn || b.expoNameAr);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("bookings.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Booking Management</p>
        </div>
        {canBook ? (
          <Link href="/expos">
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
              <Plus size={14} />
              <span>{t("bookings.newBooking")}</span>
            </button>
          </Link>
        ) : (
          <button onClick={() => setShowGuard(true)} className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
            <Plus size={14} />
            <span>{t("bookings.newBooking")}</span>
          </button>
        )}
      </div>

      {/* KYC Notice */}
      {!canBook && (
        <div className="glass-card rounded-xl p-3 border-[var(--status-yellow)]/20">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[var(--status-yellow)] shrink-0" />
            <p className="text-[11px] text-[var(--status-yellow)]">{t("bookings.kycRequired")}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: t("bookings.title"), display: bookings.length.toString(), color: "#C5A55A" },
          { label: t("bookings.active"), display: bookings.filter(b => ["confirmed", "active"].includes(b.status)).length.toString(), color: "#4ADE80" },
          { label: t("contracts.value"), display: totalValue > 0 ? `${(totalValue / 1000).toFixed(0)}K` : "0", color: "#C5A55A" },
          { label: t("payments.totalPaid"), display: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", color: "#4ADE80" },
          { label: t("payments.totalRemaining"), display: totalRemaining > 0 ? `${(totalRemaining / 1000).toFixed(0)}K` : "0", color: "#FBBF24" },
        ].map((s, i) => (
          <div key={i} className={`glass-card rounded-xl p-2 sm:p-3 text-center ${i >= 3 ? "hidden lg:block" : ""}`}>
            <p className="text-base sm:text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.display}</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
        <div className="flex-1 relative">
          <Search size={14} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 t-tertiary`} />
          <input type="text" placeholder={t("common.search") + "..."} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full glass-card rounded-xl ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} py-2.5 text-xs t-primary placeholder:t-muted gold-focus bg-transparent`} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["all", "confirmed", "active", "pending_payment", "pending_review", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${filterStatus === s ? "btn-gold" : "glass-card t-secondary"}`}>
              {s === "all" ? t("common.all") : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-8 text-center">
          <CalendarCheck size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">{t("bookings.noBookings")}</p>
          <p className="text-[10px] t-muted mb-3">{t("bookings.noBookingsDesc")}</p>
          <Link href="/expos">
            <button className="btn-gold px-4 py-2 rounded-xl text-xs">{t("expos.browseExpos")}</button>
          </Link>
        </div>
      )}

      {/* Mobile: Cards View */}
      <div className="lg:hidden space-y-3">
        {filtered.map((b, i) => {
          const sc = statusColor[b.status] || "#FBBF24";
          const SIcon = StatusIcon[b.status] || Clock;
          const contract = getContract(b.id);
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedBooking(b)} className="glass-card rounded-xl p-3 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold t-primary truncate">{unitLabel(b)}</p>
                  <p className="text-[10px] t-muted font-['Inter']">{b.id} · Zone {b.zone}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] shrink-0"
                  style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                  <SIcon size={9} /> {statusLabel(b.status)}
                </span>
              </div>
              <p className="text-[11px] t-tertiary truncate mb-2">{expoLabel(b)}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[9px] t-muted">{t("common.price")}</p>
                    <p className="text-xs font-semibold t-secondary font-['Inter']">{b.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] t-muted">{t("payments.totalPaid")}</p>
                    <p className="text-xs font-semibold text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</p>
                  </div>
                  {b.remainingAmount > 0 && (
                    <div>
                      <p className="text-[9px] t-muted">{t("payments.totalRemaining")}</p>
                      <p className="text-xs font-semibold text-[var(--status-yellow)] font-['Inter']">{b.remainingAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {contract && <FileText size={12} className="t-gold" />}
                  <Eye size={14} className="t-tertiary" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Table View */}
      {filtered.length > 0 && (
        <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {[t("bookings.bookingId"), t("bookings.unit"), t("bookings.expo"), t("common.price"), t("payments.totalPaid"), t("payments.totalRemaining"), t("common.status"), t("contracts.title"), t("common.actions")].map((h, i) => (
                    <th key={i} className={`${isRTL ? "text-right" : "text-left"} px-4 py-3 text-[11px] t-tertiary font-medium`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const sc = statusColor[b.status] || "#FBBF24";
                  const SIcon = StatusIcon[b.status] || Clock;
                  const contract = getContract(b.id);
                  return (
                    <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)] transition-colors">
                      <td className="px-4 py-3 text-xs t-gold font-['Inter'] font-medium">{b.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-primary">{unitLabel(b)}</p>
                        <p className="text-[9px] t-tertiary font-['Inter']">Zone {b.zone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-secondary line-clamp-1">{expoLabel(b)}</p>
                      </td>
                      <td className="px-4 py-3 text-xs t-secondary font-['Inter']">{b.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-['Inter']">
                        <span className={b.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}>
                          {b.remainingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                          style={{ backgroundColor: `${sc}12`, color: sc, border: `1px solid ${sc}25` }}>
                          <SIcon size={10} /> {statusLabel(b.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {contract ? (
                          <Link href="/contracts">
                            <span className="text-[10px] t-gold underline cursor-pointer">{contract.id}</span>
                          </Link>
                        ) : (
                          <span className="text-[10px] t-muted">{t("bookings.afterPayment")}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedBooking(b)} className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:t-gold transition-colors">
                            <Eye size={14} />
                          </button>
                          {b.status === "pending_payment" && (
                            <Link href="/payments">
                              <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--status-yellow)] transition-colors">
                                <CreditCard size={14} />
                              </button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[560px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div style={{ background: "var(--modal-bg)" }}>
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
                </div>
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10"
                  style={{ background: "var(--modal-bg)", borderBottom: "1px solid var(--glass-border)" }}>
                  <div>
                    <h3 className="text-base font-bold t-primary">{t("bookings.details")}</h3>
                    <p className="text-[10px] t-gold font-['Inter']">{selectedBooking.id}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="px-4 sm:px-6 py-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold t-primary">{unitLabel(selectedBooking)}</p>
                      <p className="text-[10px] t-muted font-['Inter']">Zone {selectedBooking.zone}</p>
                      <p className="text-xs t-tertiary mt-1">{expoLabel(selectedBooking)}</p>
                    </div>
                    {(() => {
                      const sc = statusColor[selectedBooking.status] || "#FBBF24";
                      const SIcon = StatusIcon[selectedBooking.status] || Clock;
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] shrink-0"
                          style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                          <SIcon size={10} /> {statusLabel(selectedBooking.status)}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: t("common.type"), value: selectedBooking.boothType },
                      { label: t("common.size"), value: selectedBooking.boothSize },
                      { label: t("common.date"), value: selectedBooking.date },
                      { label: t("contracts.title"), value: getContract(selectedBooking.id)?.id || t("bookings.afterPayment") },
                    ].map((d, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-[9px] t-muted mb-0.5">{d.label}</p>
                        <p className="text-xs t-secondary font-medium">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-3" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <h4 className="text-[11px] font-bold t-secondary mb-2">{t("bookings.financialSummary")}</h4>
                    <div className="space-y-1.5">
                      {[
                        { label: t("bookings.totalPrice"), value: `${selectedBooking.price.toLocaleString()} ${t("expos.sar")}`, color: "var(--text-secondary)" },
                        { label: t("bookings.deposit"), value: `${selectedBooking.deposit.toLocaleString()} ${t("expos.sar")}`, color: "var(--text-secondary)" },
                        { label: t("payments.totalPaid"), value: `${selectedBooking.paidAmount.toLocaleString()} ${t("expos.sar")}`, color: "var(--status-green)" },
                      ].map((f, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="t-tertiary">{f.label}</span>
                          <span className="font-['Inter']" style={{ color: f.color }}>{f.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-1.5 mt-1.5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="t-secondary font-bold">{t("payments.totalRemaining")}</span>
                        <span className={`font-bold font-['Inter'] ${selectedBooking.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}`}>
                          {selectedBooking.remainingAmount.toLocaleString()} {t("expos.sar")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const contract = getContract(selectedBooking.id);
                    if (contract) {
                      return (
                        <div className="rounded-xl p-3 bg-[var(--status-green)]/5 border border-[var(--status-green)]/10">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-[var(--status-green)]" />
                            <div>
                              <p className="text-[11px] text-[var(--status-green)] font-semibold">{t("bookings.contractIssued")}</p>
                              <p className="text-[9px] t-muted font-['Inter']">{contract.id}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (selectedBooking.status === "pending_payment") {
                      return (
                        <div className="rounded-xl p-3 bg-[var(--status-yellow)]/5 border border-[var(--status-yellow)]/10">
                          <div className="flex items-center gap-2">
                            <Lock size={14} className="text-[var(--status-yellow)]" />
                            <p className="text-[11px] text-[var(--status-yellow)]">{t("bookings.contractAfterPayment")}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {selectedBooking.services?.length > 0 && (
                    <div>
                      <p className="text-[10px] t-tertiary mb-1.5">{t("common.services")}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedBooking.services.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 rounded-lg text-[10px] t-secondary" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 pb-2">
                    {selectedBooking.remainingAmount > 0 && (
                      <Link href="/payments" className="flex-1">
                        <button className="w-full btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                          <CreditCard size={14} /> {t("payments.payNow")}
                        </button>
                      </Link>
                    )}
                    {getContract(selectedBooking.id) && (
                      <Link href="/contracts">
                        <button className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5">
                          <FileText size={13} /> {t("contracts.title")}
                        </button>
                      </Link>
                    )}
                    <button onClick={async () => {
                      toast.info(t("common.loading") + "...");
                      try {
                        await generateBookingPDF({
                          bookingId: selectedBooking.id,
                          expoName: selectedBooking.expoNameEn || selectedBooking.expoNameAr,
                          boothNumber: selectedBooking.unitEn?.match(/[A-Z]\d+/)?.[0] || selectedBooking.unitEn || "—",
                          boothType: selectedBooking.boothType?.split("—")[1]?.trim() || selectedBooking.boothType || "—",
                          boothSize: selectedBooking.boothSize?.replace("م²", "sqm") || "—",
                          status: statusLabel(selectedBooking.status),
                          startDate: selectedBooking.date, endDate: "—",
                          totalCost: selectedBooking.price, paidAmount: selectedBooking.paidAmount,
                          remaining: selectedBooking.remainingAmount,
                          services: (selectedBooking.services || []),
                          traderName: kycData?.fullName || trader?.name || "Trader",
                          traderCompany: kycData?.companyName || trader?.companyName || "—",
                        });
                        toast.success(t("common.success"));
                      } catch { toast.error(t("common.error")); }
                    }} className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5">
                      <Download size={13} /> {t("common.download")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BookingGuard isOpen={showGuard} onClose={() => setShowGuard(false)} onProceedToKYC={() => setShowGuard(false)} />
    </div>
  );
}
