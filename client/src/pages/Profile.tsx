/**
 * Profile — Trader Profile with real data from AuthContext
 * Includes: Personal info, business info, KYC status, logout
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import {
  User, Shield, CheckCircle, Building2, Phone, Mail, Globe, MapPin,
  Lock, Eye, EyeOff, LogOut, Award, Calendar, Hash, Briefcase,
  ArrowRight, Edit3, ShieldCheck, AlertTriangle, ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { trader, logout, canBook } = useAuth();
  const [, navigate] = useLocation();
  const [showSensitive, setShowSensitive] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const traderName = trader?.name || "—";
  const traderCompany = trader?.companyName || "—";
  const traderPhone = trader?.phone || "—";
  const traderActivity = trader?.activity || "—";
  const traderRegion = trader?.region || "—";
  const traderKYC = trader?.kycStatus || "none";
  const traderRegistered = trader?.registeredAt ? new Date(trader.registeredAt).toLocaleDateString("ar-SA") : "—";
  const isVerified = traderKYC === "verified";

  const kycStatusMap: Record<string, { ar: string; en: string; color: string; icon: any }> = {
    none: { ar: "غير مكتمل", en: "Not Started", color: "var(--status-red)", icon: AlertTriangle },
    pending: { ar: "قيد المراجعة", en: "Pending Review", color: "var(--status-yellow)", icon: Shield },
    verified: { ar: "موثق بالكامل", en: "Fully Verified", color: "var(--status-green)", icon: ShieldCheck },
    rejected: { ar: "مرفوض", en: "Rejected", color: "var(--status-red)", icon: AlertTriangle },
  };

  const kycInfo = kycStatusMap[traderKYC] || kycStatusMap.none;
  const KYCIcon = kycInfo.icon;

  const activityLabels: Record<string, string> = {
    food_beverage: "أغذية ومشروبات",
    retail: "تجارة وبيع بالتجزئة",
    restaurants: "مطاعم",
    cafes: "كافيهات ومقاهي",
    technology: "تقنية وابتكار",
    real_estate: "عقارات واستثمار",
    entertainment: "ترفيه وفعاليات",
    fashion: "أزياء وملابس",
    health: "صحة وجمال",
    automotive: "سيارات ومركبات",
    education: "تعليم وتدريب",
    services: "خدمات عامة",
    other: "أخرى",
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("تم تسجيل الخروج بنجاح");
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">الملف التعريفي للتاجر</h2>
          <p className="text-[10px] sm:text-xs t-gold/50 font-['Inter']">Trader Profile & Account Settings</p>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
          style={{ color: "var(--status-red)", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-light)] flex items-center justify-center mb-4">
              <User size={32} style={{ color: "var(--btn-gold-text)" }} />
            </div>
            <h3 className="text-base font-bold t-primary">{traderName}</h3>
            <p className="text-xs t-gold/60 font-['Inter'] mt-0.5">{traderCompany}</p>
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full" style={{ background: `color-mix(in srgb, ${kycInfo.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${kycInfo.color} 20%, transparent)` }}>
              <KYCIcon size={12} style={{ color: kycInfo.color }} />
              <span className="text-[10px] font-medium" style={{ color: kycInfo.color }}>{kycInfo.ar}</span>
            </div>
            {isVerified && (
              <div className="flex items-center gap-1 mt-2">
                <Award size={12} className="t-gold" />
                <span className="text-[10px] t-gold font-bold">تاجر موثق</span>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="space-y-2.5">
            {[
              { icon: Phone, label: "الجوال", value: showSensitive ? traderPhone : "•••• •••• ••••" },
              { icon: MapPin, label: "المنطقة", value: traderRegion },
              { icon: Briefcase, label: "النشاط", value: activityLabels[traderActivity] || traderActivity },
              { icon: Calendar, label: "تاريخ التسجيل", value: traderRegistered },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass-border)]">
                <item.icon size={14} className="t-gold/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] t-muted">{item.label}</p>
                  <p className="text-xs t-secondary truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="w-full mt-4 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-2 transition-colors"
          >
            {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSensitive ? "إخفاء البيانات الحساسة" : "إظهار البيانات الحساسة"}
          </button>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* KYC Status Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold t-primary">حالة التوثيق (KYC)</h3>
                <p className="text-[10px] t-gold/50 font-['Inter']">Verification Status</p>
              </div>
              {!isVerified && (
                <Link href="/kyc">
                  <button className="btn-gold px-4 py-2 rounded-xl text-[11px] flex items-center gap-1.5">
                    <Shield size={12} />
                    إكمال التوثيق
                  </button>
                </Link>
              )}
            </div>

            {/* Status Progress */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "تسجيل الحساب", en: "Registration", done: true },
                { label: "رفع المستندات", en: "Documents", done: trader?.documentsUploaded || false },
                { label: "التحقق من الهوية", en: "KYC", done: isVerified },
                { label: "توثيق الحساب", en: "Verified", done: trader?.accountVerified || false },
              ].map((step, i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background: step.done ? "color-mix(in srgb, var(--status-green) 8%, transparent)" : "var(--glass-bg)", border: `1px solid ${step.done ? "color-mix(in srgb, var(--status-green) 20%, transparent)" : "var(--glass-border)"}` }}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${step.done ? "bg-[var(--status-green)]/15" : "bg-[var(--glass-bg)]"}`}>
                    {step.done ? <CheckCircle size={14} style={{ color: "var(--status-green)" }} /> : <span className="text-xs t-muted">{i + 1}</span>}
                  </div>
                  <p className="text-[10px] font-medium" style={{ color: step.done ? "var(--status-green)" : "var(--text-tertiary)" }}>{step.label}</p>
                  <p className="text-[8px] t-muted font-['Inter']">{step.en}</p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${isVerified ? 100 : trader?.documentsUploaded ? 50 : 25}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: isVerified ? "var(--status-green)" : "linear-gradient(90deg, var(--gold-accent), var(--gold-light))" }}
              />
            </div>

            {!isVerified && (
              <div className="mt-3 p-3 rounded-xl bg-[var(--status-yellow)]/5 border border-[var(--status-yellow)]/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} style={{ color: "var(--status-yellow)" }} />
                  <p className="text-[10px] sm:text-xs" style={{ color: "var(--status-yellow)" }}>يجب إكمال التوثيق لتتمكن من حجز الوحدات التجارية في المعارض</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Business Details */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold t-primary">بيانات المنشأة</h3>
                <p className="text-[10px] t-gold/50 font-['Inter']">Business Details</p>
              </div>
              <Link href="/kyc">
                <button className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-tertiary hover:t-gold flex items-center gap-1 transition-colors">
                  <Edit3 size={10} />
                  تعديل
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { labelAr: "اسم التاجر", labelEn: "Trader Name", value: traderName, icon: User },
                { labelAr: "اسم المنشأة", labelEn: "Company Name", value: traderCompany, icon: Building2 },
                { labelAr: "النشاط التجاري", labelEn: "Business Activity", value: activityLabels[traderActivity] || traderActivity, icon: Briefcase },
                { labelAr: "المنطقة", labelEn: "Region", value: traderRegion, icon: MapPin },
                { labelAr: "رقم الجوال", labelEn: "Phone", value: showSensitive ? traderPhone : "•••• •••• ••••", icon: Phone },
                { labelAr: "تاريخ التسجيل", labelEn: "Registered", value: traderRegistered, icon: Calendar },
              ].map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <d.icon size={10} className="t-gold/50" />
                    <p className="text-[9px] t-muted">{d.labelAr} <span className="font-['Inter']">({d.labelEn})</span></p>
                  </div>
                  <p className="text-sm t-secondary font-medium">{d.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "تصفح المعارض", en: "Browse Expos", icon: Building2, path: "/expos", color: "var(--gold-accent)" },
              { label: "الحجوزات", en: "Bookings", icon: Calendar, path: "/bookings", color: "var(--status-blue)" },
              { label: "المساعدة", en: "Help Center", icon: Globe, path: "/help", color: "var(--status-green)" },
              { label: "التوثيق", en: "KYC", icon: Shield, path: "/kyc", color: "var(--status-yellow)" },
            ].map((action, i) => (
              <Link key={i} href={action.path}>
                <div className="glass-card rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:border-[var(--gold-border)] transition-all">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${action.color} 10%, transparent)` }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <p className="text-[11px] t-secondary font-medium">{action.label}</p>
                  <p className="text-[8px] t-muted font-['Inter']">{action.en}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Security Notice */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border-[var(--gold-border)]/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-gold">حماية البيانات</h4>
              <span className="text-[9px] t-muted font-['Inter']">Data Protection</span>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              بياناتك محمية بتشفير AES-256 ولا يتم مشاركتها مع أي طرف ثالث. هوية التاجر محجوبة عن المستثمر والعكس صحيح حتى يتم توقيع العقد الإلكتروني رسمياً.
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-1.5">
              Your data is protected with AES-256 encryption and is never shared with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "var(--modal-overlay)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)" }}
          >
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(248,113,113,0.1)" }}>
                <LogOut size={24} style={{ color: "var(--status-red)" }} />
              </div>
              <h3 className="text-base font-bold t-primary mb-1">تسجيل الخروج</h3>
              <p className="text-xs t-tertiary">هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟</p>
              <p className="text-[10px] t-muted font-['Inter'] mt-1">Are you sure you want to sign out?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: "var(--status-red)", color: "#fff" }}
              >
                <LogOut size={14} />
                تسجيل الخروج
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
