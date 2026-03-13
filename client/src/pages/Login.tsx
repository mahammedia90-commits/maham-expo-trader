/**
 * Login Page — Smooth 3-Step Trader Registration
 * Step 1: Phone Number (Saudi format)
 * Step 2: OTP Verification (4 digits)
 * Step 3: Trader Info (Name, Company, Activity, Region)
 * Design: Ultra-smooth, no friction, beautiful transitions
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, AuthStep } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Phone, ArrowLeft, CheckCircle2, Building2, User, MapPin, Briefcase,
  Sun, Moon, Loader2, ShieldCheck, Lock, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

const ACTIVITIES = [
  { value: "food_beverage", label: "أغذية ومشروبات", labelEn: "Food & Beverage" },
  { value: "retail", label: "تجارة وبيع بالتجزئة", labelEn: "Retail Trade" },
  { value: "restaurants", label: "مطاعم", labelEn: "Restaurants" },
  { value: "cafes", label: "كافيهات ومقاهي", labelEn: "Cafés" },
  { value: "technology", label: "تقنية وابتكار", labelEn: "Technology" },
  { value: "real_estate", label: "عقارات واستثمار", labelEn: "Real Estate" },
  { value: "entertainment", label: "ترفيه وفعاليات", labelEn: "Entertainment" },
  { value: "fashion", label: "أزياء وملابس", labelEn: "Fashion" },
  { value: "health", label: "صحة وجمال", labelEn: "Health & Beauty" },
  { value: "automotive", label: "سيارات ومركبات", labelEn: "Automotive" },
  { value: "education", label: "تعليم وتدريب", labelEn: "Education" },
  { value: "services", label: "خدمات عامة", labelEn: "General Services" },
  { value: "other", label: "أخرى", labelEn: "Other" },
];

const REGIONS = [
  "الرياض", "مكة المكرمة", "المدينة المنورة", "القصيم", "المنطقة الشرقية",
  "عسير", "تبوك", "حائل", "الحدود الشمالية", "جازان",
  "نجران", "الباحة", "الجوف",
];

export default function Login() {
  const { authStep, phoneNumber, setPhoneNumber, sendOTP, verifyOTP, completeRegistration, otpCode, setAuthStep } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  // Phone step
  const [phoneInput, setPhoneInput] = useState(phoneNumber || "");
  const [phoneSending, setPhoneSending] = useState(false);

  // OTP step
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [resendTimer, setResendTimer] = useState(0);

  // Info step
  const [traderName, setTraderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [activity, setActivity] = useState("");
  const [region, setRegion] = useState("");
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (authStep === "complete") {
      navigate("/dashboard");
    }
  }, [authStep, navigate]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (authStep === "otp") {
      setTimeout(() => otpRefs[0].current?.focus(), 300);
    }
  }, [authStep]);

  const handlePhoneSubmit = useCallback(async () => {
    const cleaned = phoneInput.replace(/\s/g, "");
    if (cleaned.length < 9) {
      toast.error("يرجى إدخال رقم جوال صحيح");
      return;
    }
    setPhoneSending(true);
    setPhoneNumber(cleaned);
    const success = await sendOTP(cleaned);
    setPhoneSending(false);
    if (success) {
      setResendTimer(60);
      toast.success("تم إرسال رمز التحقق بنجاح");
    } else {
      toast.error("فشل إرسال رمز التحقق");
    }
  }, [phoneInput, setPhoneNumber, sendOTP]);

  const handleOtpInput = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(false);

    // Auto-focus next
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-verify when all 4 digits entered
    const fullCode = newDigits.join("");
    if (fullCode.length === 4) {
      handleOtpVerify(fullCode);
    }
  }, [otpDigits]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  }, [otpDigits]);

  const handleOtpVerify = useCallback(async (code: string) => {
    setOtpVerifying(true);
    const success = await verifyOTP(code);
    setOtpVerifying(false);
    if (success) {
      toast.success("تم التحقق بنجاح!");
    } else {
      setOtpError(true);
      setOtpDigits(["", "", "", ""]);
      otpRefs[0].current?.focus();
      toast.error("رمز التحقق غير صحيح");
    }
  }, [verifyOTP]);

  const handleResendOTP = useCallback(async () => {
    if (resendTimer > 0) return;
    setPhoneSending(true);
    await sendOTP();
    setPhoneSending(false);
    setResendTimer(60);
    setOtpDigits(["", "", "", ""]);
    toast.success("تم إعادة إرسال رمز التحقق");
  }, [resendTimer, sendOTP]);

  const handleInfoSubmit = useCallback(async () => {
    if (!traderName.trim()) { toast.error("يرجى إدخال اسم التاجر"); return; }
    if (!companyName.trim()) { toast.error("يرجى إدخال اسم المؤسسة أو الشركة"); return; }
    if (!activity) { toast.error("يرجى اختيار النشاط التجاري"); return; }
    if (!region) { toast.error("يرجى اختيار المنطقة"); return; }

    setInfoSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    completeRegistration({
      name: traderName.trim(),
      companyName: companyName.trim(),
      activity,
      region,
    });
    setInfoSubmitting(false);
    toast.success(`مرحباً ${traderName}! تم تسجيلك بنجاح`);
    navigate("/dashboard");
  }, [traderName, companyName, activity, region, completeRegistration, navigate]);

  const stepVariants = {
    enter: { opacity: 0, x: -30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  };

  const steps: { key: AuthStep; num: number; label: string }[] = [
    { key: "phone", num: 1, label: "رقم الجوال" },
    { key: "otp", num: 2, label: "رمز التحقق" },
    { key: "info", num: 3, label: "بيانات التاجر" },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === authStep);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir="rtl"
      style={{ background: "var(--background)" }}>
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, var(--gold-accent), transparent)` }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, var(--gold-accent), transparent)` }} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 left-5 p-2.5 rounded-xl transition-all z-10"
        style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl"
          style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)" }}>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Maham Expo" className="h-14 object-contain" style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              بوابة التاجر
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              سجّل دخولك للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i <= currentStepIndex ? "" : ""
                }`}
                  style={{
                    background: i <= currentStepIndex ? "var(--gold-accent)" : "var(--glass-bg)",
                    color: i <= currentStepIndex ? "var(--btn-gold-text)" : "var(--text-tertiary)",
                    border: `1px solid ${i <= currentStepIndex ? "var(--gold-accent)" : "var(--glass-border)"}`,
                  }}>
                  {i < currentStepIndex ? <CheckCircle2 size={14} /> : step.num}
                </div>
                <span className="text-[10px] hidden sm:block" style={{ color: i <= currentStepIndex ? "var(--gold-accent)" : "var(--text-muted)" }}>
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 h-[2px] rounded-full transition-all duration-300"
                    style={{ background: i < currentStepIndex ? "var(--gold-accent)" : "var(--glass-border)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Phone Number */}
            {authStep === "phone" && (
              <motion.div key="phone" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    <Phone size={14} className="inline ml-1" style={{ color: "var(--gold-accent)" }} />
                    رقم الجوال
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 rounded-xl text-sm font-medium"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)", minWidth: "70px" }}>
                      966+
                    </div>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d\s]/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                      placeholder="5XX XXX XXXX"
                      className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-primary)",
                        direction: "ltr",
                        textAlign: "left",
                        letterSpacing: "1px",
                      }}
                      autoFocus
                      maxLength={14}
                    />
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    <Lock size={10} className="inline ml-1" />
                    سيتم إرسال رمز تحقق SMS إلى هذا الرقم
                  </p>
                </div>

                <button
                  onClick={handlePhoneSubmit}
                  disabled={phoneSending || phoneInput.replace(/\s/g, "").length < 9}
                  className="w-full py-3.5 rounded-xl text-base font-semibold transition-all btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {phoneSending ? (
                    <><Loader2 size={18} className="animate-spin" /> جاري الإرسال...</>
                  ) : (
                    <>إرسال رمز التحقق</>
                  )}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <ShieldCheck size={12} style={{ color: "var(--gold-accent)" }} />
                    تسجيل آمن
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <Lock size={12} style={{ color: "var(--gold-accent)" }} />
                    بيانات مشفرة
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <Sparkles size={12} style={{ color: "var(--gold-accent)" }} />
                    مجاني 100%
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: OTP Verification */}
            {authStep === "otp" && (
              <motion.div key="otp" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                    <ShieldCheck size={24} style={{ color: "var(--gold-accent)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    أدخل رمز التحقق المرسل إلى
                  </p>
                  <p className="text-base font-bold mt-1" style={{ color: "var(--text-primary)", direction: "ltr" }}>
                    +966 {phoneInput}
                  </p>
                  <p className="text-[10px] mt-1 px-3 py-1 rounded-full inline-block"
                    style={{ background: "var(--gold-bg)", color: "var(--gold-accent)" }}>
                    رمز التجربة: {otpCode}
                  </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-5" dir="ltr">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-14 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all ${
                        otpError ? "animate-shake" : ""
                      }`}
                      style={{
                        background: "var(--glass-bg)",
                        border: `2px solid ${otpError ? "var(--status-red)" : digit ? "var(--gold-accent)" : "var(--glass-border)"}`,
                        color: "var(--text-primary)",
                      }}
                    />
                  ))}
                </div>

                {otpVerifying && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--gold-accent)" }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>جاري التحقق...</span>
                  </div>
                )}

                {/* Resend */}
                <div className="text-center mb-4">
                  {resendTimer > 0 ? (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      إعادة الإرسال بعد <span style={{ color: "var(--gold-accent)" }}>{resendTimer}</span> ثانية
                    </p>
                  ) : (
                    <button onClick={handleResendOTP} className="text-xs font-medium transition-colors"
                      style={{ color: "var(--gold-accent)" }}>
                      إعادة إرسال الرمز
                    </button>
                  )}
                </div>

                {/* Back */}
                <button
                  onClick={() => { setAuthStep("phone"); setOtpDigits(["", "", "", ""]); }}
                  className="w-full py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                >
                  <ArrowLeft size={14} />
                  تغيير رقم الجوال
                </button>
              </motion.div>
            )}

            {/* STEP 3: Trader Information */}
            {authStep === "info" && (
              <motion.div key="info" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                    <User size={24} style={{ color: "var(--gold-accent)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    أهلاً بك! أكمل بياناتك
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    خطوة أخيرة للوصول إلى لوحة التحكم
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Trader Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <User size={12} style={{ color: "var(--gold-accent)" }} />
                      اسم التاجر
                    </label>
                    <input
                      type="text"
                      value={traderName}
                      onChange={(e) => setTraderName(e.target.value)}
                      placeholder="مثال: أحمد المالكي"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-primary)",
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <Building2 size={12} style={{ color: "var(--gold-accent)" }} />
                      اسم المؤسسة أو الشركة
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="مثال: شركة المالكي للتجارة"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  {/* Activity */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <Briefcase size={12} style={{ color: "var(--gold-accent)" }} />
                      النشاط التجاري
                    </label>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: activity ? "var(--text-primary)" : "var(--text-muted)",
                      }}
                    >
                      <option value="">اختر النشاط التجاري</option>
                      {ACTIVITIES.map(a => (
                        <option key={a.value} value={a.value}>{a.label} — {a.labelEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <MapPin size={12} style={{ color: "var(--gold-accent)" }} />
                      المنطقة
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: region ? "var(--text-primary)" : "var(--text-muted)",
                      }}
                    >
                      <option value="">اختر المنطقة</option>
                      {REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleInfoSubmit}
                  disabled={infoSubmitting || !traderName.trim() || !companyName.trim() || !activity || !region}
                  className="w-full py-3.5 rounded-xl text-base font-semibold transition-all btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
                >
                  {infoSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> جاري التسجيل...</>
                  ) : (
                    <>دخول لوحة التحكم</>
                  )}
                </button>

                <p className="text-[10px] text-center mt-3" style={{ color: "var(--text-muted)" }}>
                  بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-4" style={{ color: "var(--text-muted)" }}>
          © 2025 Maham Expo — جميع الحقوق محفوظة
        </p>
      </motion.div>
    </div>
  );
}
