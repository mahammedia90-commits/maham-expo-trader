/**
 * Login Page — Smooth Registration with Login/Register Tabs
 * BUG-05 to BUG-09 fixed, FEAT-05 added
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, AuthStep } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  Phone, ArrowLeft, ArrowRight, CheckCircle2, Building2, User, MapPin, Briefcase,
  Sun, Moon, Loader2, ShieldCheck, Lock, Sparkles, Globe, Check, MessageCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

const ACTIVITIES = [
  { value: "food_beverage", ar: "أغذية ومشروبات", en: "Food & Beverage", zh: "食品饮料", ru: "Еда и напитки", fa: "غذا و نوشیدنی", tr: "Yiyecek ve İçecek" },
  { value: "retail", ar: "تجارة وبيع بالتجزئة", en: "Retail Trade", zh: "零售贸易", ru: "Розничная торговля", fa: "خرده‌فروشی", tr: "Perakende Ticaret" },
  { value: "restaurants", ar: "مطاعم", en: "Restaurants", zh: "餐厅", ru: "Рестораны", fa: "رستوران‌ها", tr: "Restoranlar" },
  { value: "cafes", ar: "كافيهات ومقاهي", en: "Cafés", zh: "咖啡馆", ru: "Кафе", fa: "کافه‌ها", tr: "Kafeler" },
  { value: "technology", ar: "تقنية وابتكار", en: "Technology", zh: "科技", ru: "Технологии", fa: "فناوری", tr: "Teknoloji" },
  { value: "real_estate", ar: "عقارات واستثمار", en: "Real Estate", zh: "房地产", ru: "Недвижимость", fa: "املاک", tr: "Gayrimenkul" },
  { value: "entertainment", ar: "ترفيه وفعاليات", en: "Entertainment", zh: "娱乐", ru: "Развлечения", fa: "سرگرمی", tr: "Eğlence" },
  { value: "fashion", ar: "أزياء وملابس", en: "Fashion", zh: "时尚", ru: "Мода", fa: "مد و لباس", tr: "Moda" },
  { value: "health", ar: "صحة وجمال", en: "Health & Beauty", zh: "健康美容", ru: "Здоровье и красота", fa: "سلامت و زیبایی", tr: "Sağlık ve Güzellik" },
  { value: "automotive", ar: "سيارات ومركبات", en: "Automotive", zh: "汽车", ru: "Автомобили", fa: "خودرو", tr: "Otomotiv" },
  { value: "education", ar: "تعليم وتدريب", en: "Education", zh: "教育", ru: "Образование", fa: "آموزش", tr: "Eğitim" },
  { value: "services", ar: "خدمات عامة", en: "General Services", zh: "综合服务", ru: "Общие услуги", fa: "خدمات عمومی", tr: "Genel Hizmetler" },
  { value: "other", ar: "أخرى", en: "Other", zh: "其他", ru: "Другое", fa: "سایر", tr: "Diğer" },
];

const REGIONS = [
  { value: "riyadh", ar: "الرياض", en: "Riyadh", zh: "利雅得", ru: "Эр-Рияд", fa: "ریاض", tr: "Riyad" },
  { value: "jeddah", ar: "جدة", en: "Jeddah", zh: "吉达", ru: "Джидда", fa: "جده", tr: "Cidde" },
  { value: "dammam", ar: "الدمام", en: "Dammam", zh: "达曼", ru: "Даммам", fa: "دمام", tr: "Dammam" },
  { value: "makkah", ar: "مكة المكرمة", en: "Makkah", zh: "麦加", ru: "Мекка", fa: "مکه مکرمه", tr: "Mekke" },
  { value: "madinah", ar: "المدينة المنورة", en: "Madinah", zh: "麦地那", ru: "Медина", fa: "مدینه منوره", tr: "Medine" },
  { value: "eastern", ar: "المنطقة الشرقية", en: "Eastern Province", zh: "东部省", ru: "Восточная провинция", fa: "منطقه شرقی", tr: "Doğu Bölgesi" },
  { value: "other", ar: "أخرى", en: "Other", zh: "其他", ru: "Другое", fa: "سایر", tr: "Diğer" },
];



export default function Login() {
  const { authStep, phoneNumber, setPhoneNumber, sendOTP, verifyOTP, completeRegistration, otpCode, setAuthStep } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang, isRTL, dir } = useLanguage();
  const [, navigate] = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const isArabicLike = ["ar", "fa"].includes(lang);

  // BUG-09: Login vs Register tabs
  const [mode, setMode] = useState<"login" | "register">("login");

  const [phoneInput, setPhoneInput] = useState(phoneNumber || "");
  const [phoneSending, setPhoneSending] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [resendTimer, setResendTimer] = useState(0);
  const [traderName, setTraderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [activity, setActivity] = useState("");
  const [region, setRegion] = useState("");

  const [infoSubmitting, setInfoSubmitting] = useState(false);

  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => { if (authStep === "complete") navigate("/expos"); }, [authStep, navigate]);
  useEffect(() => { if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000); return () => clearTimeout(t); } }, [resendTimer]);
  useEffect(() => { if (authStep === "otp") setTimeout(() => otpRefs[0].current?.focus(), 300); }, [authStep]);

  const handlePhoneSubmit = useCallback(async () => {
    const cleaned = phoneInput.replace(/\s/g, "");
    if (cleaned.length < 9) { toast.error(isArabicLike ? "أدخل رقم هاتف صحيح" : "Enter a valid phone number"); return; }
    setPhoneSending(true);
    setPhoneNumber(cleaned);
    const success = await sendOTP(cleaned);
    setPhoneSending(false);
    if (success) { setResendTimer(60); toast.success(isArabicLike ? "تم إرسال رمز التحقق" : "OTP sent successfully"); }
  }, [phoneInput, setPhoneNumber, sendOTP, isArabicLike]);

  const handleOtpInput = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(false);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
    const fullCode = newDigits.join("");
    if (fullCode.length === 4) handleOtpVerify(fullCode);
  }, [otpDigits]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) otpRefs[index - 1].current?.focus();
  }, [otpDigits]);

  const handleOtpVerify = useCallback(async (code: string) => {
    setOtpVerifying(true);
    const success = await verifyOTP(code);
    setOtpVerifying(false);
    if (success) {
      toast.success(isArabicLike ? "تم التحقق بنجاح" : "Verified successfully");
      // In login mode, skip info step and go directly
      if (mode === "login") {
        completeRegistration({ name: "تاجر", companyName: "شركة", activity: "other", region: "riyadh" });
        navigate("/expos");
      }
    } else {
      setOtpError(true);
      setOtpDigits(["", "", "", ""]);
      otpRefs[0].current?.focus();
    }
  }, [verifyOTP, isArabicLike, mode, completeRegistration, navigate]);

  const handleResendOTP = useCallback(async () => {
    if (resendTimer > 0) return;
    setPhoneSending(true);
    await sendOTP();
    setPhoneSending(false);
    setResendTimer(60);
    setOtpDigits(["", "", "", ""]);
  }, [resendTimer, sendOTP]);

  const handleInfoSubmit = useCallback(async () => {
    if (!traderName.trim() || !companyName.trim() || !activity || !region) return;
    setInfoSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    completeRegistration({ name: traderName.trim(), companyName: companyName.trim(), activity, region });
    setInfoSubmitting(false);
    toast.success(isArabicLike ? "مرحباً بك!" : "Welcome!");
    navigate("/expos");
  }, [traderName, companyName, activity, region, completeRegistration, navigate, isArabicLike]);

  const stepVariants = { enter: { opacity: 0, x: isRTL ? -30 : 30 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: isRTL ? 30 : -30 } };

  // Steps differ based on mode
  const loginSteps = [
    { key: "phone" as AuthStep, num: 1, label: isArabicLike ? "رقم الجوال" : "Phone Number" },
    { key: "otp" as AuthStep, num: 2, label: isArabicLike ? "رمز التحقق" : "Verification Code" },
  ];
  const registerSteps = [
    { key: "phone" as AuthStep, num: 1, label: isArabicLike ? "رقم الجوال" : "Phone Number" },
    { key: "otp" as AuthStep, num: 2, label: isArabicLike ? "رمز التحقق" : "Verification Code" },
    { key: "info" as AuthStep, num: 3, label: isArabicLike ? "بيانات نشاطك" : "Business Info" },
  ];
  const steps = mode === "login" ? loginSteps : registerSteps;
  const currentStepIndex = steps.findIndex(s => s.key === authStep);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir={dir}
      style={{ background: "var(--background)" }}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, var(--gold-accent), transparent)` }} />
      </div>

      {/* Top controls */}
      <div className={`absolute top-5 ${isRTL ? "left-5" : "right-5"} flex items-center gap-2 z-10`}>
        <button onClick={toggleTheme} className="p-2.5 rounded-xl transition-all"
          style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)} className="p-2.5 rounded-xl flex items-center gap-1.5"
            style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <Globe size={18} />
            <span className="text-[10px] hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.flag}</span>
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setLangOpen(false)} />
              <div className="absolute top-full mt-2 right-0 z-[101] rounded-xl overflow-hidden shadow-2xl min-w-[180px]"
                style={{ background: "var(--modal-bg)", backdropFilter: "blur(40px)", border: "1px solid var(--glass-border)" }}>
                <div className="p-1.5">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${lang === l.code ? "bg-gold-subtle" : ""}`}
                      style={{ color: lang === l.code ? "var(--gold-light)" : "var(--text-secondary)" }}>
                      <span>{l.flag}</span>
                      <span className="flex-1 text-start">{l.nativeName}</span>
                      {lang === l.code && <Check size={12} style={{ color: "var(--gold-accent)" }} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl"
          style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)" }}>
          
          <div className="flex justify-center mb-5">
            <img src={LOGO_URL} alt="Maham Expo" className="h-14 object-contain" style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
          </div>

          {/* BUG-09: Login/Register Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-5" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <button
              onClick={() => { setMode("login"); if (authStep === "info") setAuthStep("phone"); }}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: mode === "login" ? "var(--gold-accent)" : "transparent",
                color: mode === "login" ? "var(--btn-gold-text)" : "var(--text-tertiary)",
              }}>
              {isArabicLike ? "دخول" : "Login"}
            </button>
            <button
              onClick={() => setMode("register")}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: mode === "register" ? "var(--gold-accent)" : "transparent",
                color: mode === "register" ? "var(--btn-gold-text)" : "var(--text-tertiary)",
              }}>
              {isArabicLike ? "حساب جديد" : "New Account"}
            </button>
          </div>

          {/* BUG-08: Progress Steps with labels */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: i <= currentStepIndex ? "var(--gold-accent)" : "var(--glass-bg)",
                      color: i <= currentStepIndex ? "var(--btn-gold-text)" : "var(--text-tertiary)",
                      border: `1px solid ${i <= currentStepIndex ? "var(--gold-accent)" : "var(--glass-border)"}`,
                    }}>
                    {i < currentStepIndex ? <CheckCircle2 size={14} /> : step.num}
                  </div>
                  <span className="text-[9px] font-medium whitespace-nowrap" style={{ color: i <= currentStepIndex ? "var(--gold-accent)" : "var(--text-muted)" }}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-[2px] rounded-full mb-4" style={{ background: i < currentStepIndex ? "var(--gold-accent)" : "var(--glass-border)" }} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Phone */}
            {authStep === "phone" && (
              <motion.div key="phone" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                {/* BUG-05: Value proposition block */}
                <div className="rounded-xl p-3 mb-5" style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                  <p className="text-[11px] font-medium mb-2" style={{ color: "var(--gold-accent)" }}>
                    {isArabicLike ? "بتسجيلك ستتمكن من:" : "By registering you can:"}
                  </p>
                  <div className="space-y-1">
                    <p className="text-[10px] flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={10} style={{ color: "var(--gold-accent)" }} />
                      {isArabicLike ? "تصفح الوحدات المتاحة الآن" : "Browse available units now"}
                    </p>
                    <p className="text-[10px] flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={10} style={{ color: "var(--gold-accent)" }} />
                      {isArabicLike ? "حجز مكانك بعربون 5% فقط" : "Book your spot with only 5% deposit"}
                    </p>
                    <p className="text-[10px] flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={10} style={{ color: "var(--gold-accent)" }} />
                      {isArabicLike ? "استلام عقد إلكتروني خلال دقائق" : "Receive an electronic contract within minutes"}
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    <Phone size={14} className={`inline ${isRTL ? "ml-1" : "mr-1"}`} style={{ color: "var(--gold-accent)" }} />
                    {isArabicLike ? "رقم الجوال" : "Phone Number"}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 rounded-xl text-sm font-medium"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)", minWidth: "70px" }}>
                      966+
                    </div>
                    <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d\s]/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                      placeholder={isArabicLike ? "5XXXXXXXX" : "5XXXXXXXX"}
                      className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)", direction: "ltr", textAlign: "left", letterSpacing: "1px" }}
                      autoFocus maxLength={14} />
                  </div>
                </div>
                <button onClick={handlePhoneSubmit} disabled={phoneSending || phoneInput.replace(/\s/g, "").length < 9}
                  className="w-full py-3.5 rounded-xl text-base font-semibold btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {phoneSending ? <><Loader2 size={18} className="animate-spin" /> {isArabicLike ? "جاري الإرسال..." : "Sending..."}</> : isArabicLike ? "إرسال رمز التحقق" : "Send Verification Code"}
                </button>
                {/* BUG-06: Arabic trust signals */}
                <div className="flex items-center justify-center gap-3 mt-5 pt-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {isArabicLike ? "🔒 تشفير بنكي 256-bit" : "🔒 256-bit encryption"}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--glass-border)" }}>·</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {isArabicLike ? "لا رسوم تسجيل" : "No registration fees"}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--glass-border)" }}>·</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {isArabicLike ? "بياناتك محمية" : "Your data is protected"}
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: OTP */}
            {authStep === "otp" && (
              <motion.div key="otp" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                    <ShieldCheck size={24} style={{ color: "var(--gold-accent)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{isArabicLike ? "أدخل رمز التحقق المرسل إلى" : "Enter the verification code sent to"}</p>
                  <p className="text-base font-bold mt-1" style={{ color: "var(--text-primary)", direction: "ltr" }}>+966 {phoneInput}</p>
                  <p className="text-[10px] mt-1 px-3 py-1 rounded-full inline-block"
                    style={{ background: "var(--gold-bg)", color: "var(--gold-accent)" }}>
                    Demo: {otpCode}
                  </p>
                </div>
                <div className="flex justify-center gap-3 mb-5" dir="ltr">
                  {otpDigits.map((digit, i) => (
                    <input key={i} ref={otpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-14 h-14 text-center text-2xl font-bold rounded-xl outline-none ${otpError ? "animate-shake" : ""}`}
                      style={{ background: "var(--glass-bg)", border: `2px solid ${otpError ? "var(--status-red)" : digit ? "var(--gold-accent)" : "var(--glass-border)"}`, color: "var(--text-primary)" }} />
                  ))}
                </div>
                {otpVerifying && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--gold-accent)" }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{isArabicLike ? "جاري التحقق..." : "Verifying..."}</span>
                  </div>
                )}
                {/* BUG-07: OTP fallback with countdown + WhatsApp */}
                <div className="text-center mb-4 space-y-2">
                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--gold-bg)", color: "var(--gold-accent)", border: "1px solid var(--gold-border)" }}>
                        {resendTimer}
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {isArabicLike ? "ثانية لإعادة الإرسال" : "seconds to resend"}
                      </p>
                    </div>
                  ) : (
                    <button onClick={handleResendOTP} className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
                      style={{ color: "var(--gold-accent)", background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                      {isArabicLike ? "إعادة الإرسال" : "Resend Code"}
                    </button>
                  )}
                  <div>
                    <a href="https://wa.me/966535555900?text=%D9%84%D9%85%20%D9%8A%D8%B5%D9%84%20%D8%B1%D9%85%D8%B2%20%D8%A7%D9%84%D8%AA%D8%AD%D9%82%D9%82"
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-medium transition-colors hover:opacity-80"
                      style={{ color: "var(--text-muted)" }}>
                      <MessageCircle size={11} />
                      {isArabicLike ? "لم يصل الرمز؟ تواصل عبر واتساب" : "Didn't receive code? Contact via WhatsApp"}
                    </a>
                  </div>
                </div>
                <button onClick={() => { setAuthStep("phone"); setOtpDigits(["", "", "", ""]); }}
                  className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <BackArrow size={14} />
                  {isArabicLike ? "تغيير رقم الهاتف" : "Change Phone Number"}
                </button>
              </motion.div>
            )}

            {/* STEP 3: Info (Register mode only) — FEAT-05 expanded */}
            {authStep === "info" && mode === "register" && (
              <motion.div key="info" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                    <User size={20} style={{ color: "var(--gold-accent)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{isArabicLike ? "أكمل بيانات نشاطك" : "Complete Your Business Info"}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
                      <User size={11} style={{ color: "var(--gold-accent)" }} /> {isArabicLike ? "الاسم الكامل" : "Full Name"} <span style={{ color: "var(--status-red)" }}>*</span>
                    </label>
                    <input type="text" value={traderName} onChange={(e) => setTraderName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} autoFocus />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
                      <Building2 size={11} style={{ color: "var(--gold-accent)" }} /> {isArabicLike ? "اسم النشاط التجاري" : "Business Name"} <span style={{ color: "var(--status-red)" }}>*</span>
                    </label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
                      <Briefcase size={11} style={{ color: "var(--gold-accent)" }} /> {isArabicLike ? "القطاع" : "Sector"} <span style={{ color: "var(--status-red)" }}>*</span>
                    </label>
                    <select value={activity} onChange={(e) => setActivity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)", color: activity ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <option value="" style={{ background: "var(--modal-bg)", color: "var(--text-muted)" }}>{isArabicLike ? "اختر القطاع" : "Select Sector"}</option>
                      {ACTIVITIES.map(a => (
                        <option key={a.value} value={a.value} style={{ background: "var(--modal-bg)", color: "var(--text-primary)" }}>{(a as any)[lang] || a.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
                      <MapPin size={11} style={{ color: "var(--gold-accent)" }} /> {isArabicLike ? "المدينة" : "City"} <span style={{ color: "var(--status-red)" }}>*</span>
                    </label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)", color: region ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <option value="" style={{ background: "var(--modal-bg)", color: "var(--text-muted)" }}>{isArabicLike ? "اختر المدينة" : "Select City"}</option>
                      {REGIONS.map(r => (<option key={r.value} value={r.value} style={{ background: "var(--modal-bg)", color: "var(--text-primary)" }}>{(r as any)[lang] || r.en}</option>))}
                    </select>
                  </div>

                </div>
                <button onClick={handleInfoSubmit}
                  disabled={infoSubmitting || !traderName.trim() || !companyName.trim() || !activity || !region}
                  className="w-full py-3 rounded-xl text-base font-semibold btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4">
                  {infoSubmitting ? <><Loader2 size={18} className="animate-spin" /> {isArabicLike ? "جاري التسجيل..." : "Registering..."}</> : isArabicLike ? "دخول لوحة التحكم" : "Enter Dashboard"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-[10px] mt-4" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Maham Expo for Exhibitions & Conferences
        </p>
      </motion.div>
    </div>
  );
}
