/**
 * Profile — Trader profile, KYC verification, settings
 * Design: Obsidian Glass with verification workflow
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, CheckCircle, Upload, FileText, Building2, Phone, Mail, Globe, MapPin, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const verificationSteps = [
  { id: 1, nameAr: "البيانات الأساسية", nameEn: "Basic Info", status: "completed" },
  { id: 2, nameAr: "السجل التجاري", nameEn: "Commercial Register", status: "completed" },
  { id: 3, nameAr: "الرخصة البلدية", nameEn: "Municipal License", status: "completed" },
  { id: 4, nameAr: "التحقق من الهوية", nameEn: "Identity Verification", status: "in_progress" },
  { id: 5, nameAr: "الموافقة النهائية", nameEn: "Final Approval", status: "pending" },
];

const profileData = {
  nameAr: "مؤسسة النور للتجارة",
  nameEn: "Al Nour Trading Est.",
  cr: "1010XXXXXX",
  type: "مؤسسة فردية",
  typeEn: "Sole Proprietorship",
  city: "الرياض",
  cityEn: "Riyadh",
  phone: "+966 5X XXX XXXX",
  email: "info@alnour-trade.sa",
  website: "www.alnour-trade.sa",
  sector: "أغذية ومشروبات",
  sectorEn: "Food & Beverage",
  joined: "2025-01-15",
  kycLevel: 3,
  kycMax: 5,
};

export default function Profile() {
  const [showSensitive, setShowSensitive] = useState(false);
  const kycPercent = (profileData.kycLevel / profileData.kycMax) * 100;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold t-primary">الملف الشخصي والتوثيق</h2>
        <p className="text-xs t-gold/50 font-['Inter']">Profile & KYC Verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center mb-4">
              <Building2 size={32} className="text-[var(--btn-gold-text)]" />
            </div>
            <h3 className="text-base font-bold t-primary">{profileData.nameAr}</h3>
            <p className="text-xs t-gold/60 font-['Inter']">{profileData.nameEn}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield size={12} className="text-[#FBBF24]" />
              <span className="text-[10px] text-[#FBBF24]">توثيق جزئي | Partial KYC</span>
            </div>
          </div>

          {/* KYC Progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] t-secondary">مستوى التوثيق</span>
              <span className="text-[11px] t-gold font-['Inter']">{profileData.kycLevel}/{profileData.kycMax}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${kycPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-l from-[#C5A55A] to-[#E8D5A3]"
              />
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3">
            {[
              { icon: MapPin, labelAr: profileData.city, labelEn: profileData.cityEn },
              { icon: Phone, labelAr: showSensitive ? profileData.phone : "•••• •••• ••••", labelEn: "" },
              { icon: Mail, labelAr: showSensitive ? profileData.email : "••••@••••.sa", labelEn: "" },
              { icon: Globe, labelAr: profileData.website, labelEn: "" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--glass-border)]">
                <item.icon size={14} className="t-gold/60 shrink-0" />
                <span className="text-xs t-secondary">{item.labelAr}</span>
                {item.labelEn && <span className="text-[9px] t-muted font-['Inter']">{item.labelEn}</span>}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="w-full mt-4 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-2"
          >
            {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSensitive ? "إخفاء البيانات الحساسة" : "إظهار البيانات الحساسة"}
          </button>
        </motion.div>

        {/* Verification Steps & Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Verification Steps */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-sm font-bold t-primary mb-1">خطوات التوثيق (KYC)</h3>
            <p className="text-[10px] t-gold/50 font-['Inter'] mb-5">Verification Steps</p>
            <div className="space-y-4">
              {verificationSteps.map((step, i) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "in_progress";
                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30" :
                      isActive ? "bg-gold-subtle border border-[#C5A55A]/30 animate-pulse" :
                      "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={16} className="text-[#4ADE80]" />
                      ) : isActive ? (
                        <span className="text-xs t-gold font-bold">{step.id}</span>
                      ) : (
                        <span className="text-xs t-tertiary">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isCompleted ? "t-secondary" : isActive ? "t-gold" : "t-tertiary"}`}>
                        {step.nameAr}
                      </p>
                      <p className="text-[9px] t-muted font-['Inter']">{step.nameEn}</p>
                    </div>
                    {isActive && (
                      <button
                        onClick={() => toast.info("يرجى رفع صورة الهوية الوطنية أو الإقامة")}
                        className="btn-gold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                      >
                        <Upload size={11} />
                        رفع المستند
                      </button>
                    )}
                    {isCompleted && <CheckCircle size={14} className="text-[#4ADE80]/50" />}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Business Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-sm font-bold t-primary mb-1">بيانات المنشأة</h3>
            <p className="text-[10px] t-gold/50 font-['Inter'] mb-5">Business Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { labelAr: "اسم المنشأة", labelEn: "Business Name", value: profileData.nameAr },
                { labelAr: "الاسم الإنجليزي", labelEn: "English Name", value: profileData.nameEn },
                { labelAr: "السجل التجاري", labelEn: "Commercial Register", value: profileData.cr },
                { labelAr: "نوع المنشأة", labelEn: "Entity Type", value: profileData.type },
                { labelAr: "القطاع", labelEn: "Sector", value: profileData.sector },
                { labelAr: "تاريخ الانضمام", labelEn: "Joined", value: profileData.joined },
              ].map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                  <p className="text-[10px] t-tertiary mb-1">{d.labelAr} <span className="t-muted font-['Inter']">({d.labelEn})</span></p>
                  <p className="text-sm t-secondary font-medium">{d.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Notice */}
          <div className="glass-card rounded-2xl p-5 border-[var(--gold-border)]">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={16} className="t-gold" />
              <h4 className="text-xs font-bold t-gold">حماية البيانات</h4>
              <span className="text-[9px] t-muted font-['Inter']">Data Protection</span>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              بياناتك محمية بتشفير AES-256 ولا يتم مشاركتها مع أي طرف ثالث. هوية التاجر محجوبة عن المستثمر والعكس صحيح حتى يتم توقيع العقد الإلكتروني رسمياً.
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-2">
              Your data is protected with AES-256 encryption and is never shared with third parties. Trader identity is hidden from investors and vice versa until the e-contract is officially signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
