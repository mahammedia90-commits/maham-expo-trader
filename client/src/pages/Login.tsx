/**
 * Login Page — Smooth 3-Step Trader Registration
 * Fully localized with useLanguage() — v2 updated
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, AuthStep } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  Phone, ArrowLeft, ArrowRight, CheckCircle2, Building2, User, MapPin, Briefcase,
  Sun, Moon, Loader2, ShieldCheck, Lock, Sparkles, Globe, Check
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
  { value: "makkah", ar: "مكة المكرمة", en: "Makkah", zh: "麦加", ru: "Мекка", fa: "مکه مکرمه", tr: "Mekke" },
  { value: "madinah", ar: "المدينة المنورة", en: "Madinah", zh: "麦地那", ru: "Медина", fa: "مدینه منوره", tr: "Medine" },
  { value: "qassim", ar: "القصيم", en: "Qassim", zh: "盖西姆", ru: "Касим", fa: "قصیم", tr: "Kasım" },
  { value: "eastern", ar: "المنطقة الشرقية", en: "Eastern Province", zh: "东部省", ru: "Восточная провинция", fa: "منطقه شرقی", tr: "Doğu Bölgesi" },
  { value: "asir", ar: "عسير", en: "Asir", zh: "阿西尔", ru: "Асир", fa: "عسیر", tr: "Asir" },
  { value: "tabuk", ar: "تبوك", en: "Tabuk", zh: "塔布克", ru: "Табук", fa: "تبوک", tr: "Tebük" },
  { value: "hail", ar: "حائل", en: "Hail", zh: "哈伊勒", ru: "Хаиль", fa: "حائل", tr: "Hail" },
  { value: "northern", ar: "الحدود الشمالية", en: "Northern Borders", zh: "北部边境", ru: "Северные границы", fa: "مرزهای شمالی", tr: "Kuzey Sınırları" },
  { value: "jazan", ar: "جازان", en: "Jazan", zh: "吉赞", ru: "Джизан", fa: "جازان", tr: "Cizan" },
  { value: "najran", ar: "نجران", en: "Najran", zh: "奈季兰", ru: "Наджран", fa: "نجران", tr: "Necran" },
  { value: "baha", ar: "الباحة", en: "Al-Baha", zh: "巴哈", ru: "Эль-Баха", fa: "الباحه", tr: "El-Baha" },
  { value: "jawf", ar: "الجوف", en: "Al-Jawf", zh: "焦夫", ru: "Эль-Джауф", fa: "الجوف", tr: "El-Cevf" },
];

export default function Login() {
  const { authStep, phoneNumber, setPhoneNumber, sendOTP, verifyOTP, completeRegistration, otpCode, setAuthStep } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang, isRTL, dir } = useLanguage();
  const [, navigate] = useLocation();
  const [langOpen, setLangOpen] = useState(false);

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
    if (cleaned.length < 9) { toast.error(t("auth.phone.placeholder")); return; }
    setPhoneSending(true);
    setPhoneNumber(cleaned);
    const success = await sendOTP(cleaned);
    setPhoneSending(false);
    if (success) { setResendTimer(60); toast.success(t("auth.sendOtp")); }
  }, [phoneInput, setPhoneNumber, sendOTP, t]);

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
    if (success) { toast.success(t("auth.verify")); }
    else { setOtpError(true); setOtpDigits(["", "", "", ""]); otpRefs[0].current?.focus(); }
  }, [verifyOTP, t]);

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
    toast.success(t("auth.welcome"));
    navigate("/expos");
  }, [traderName, companyName, activity, region, completeRegistration, navigate, t]);

  const stepVariants = { enter: { opacity: 0, x: isRTL ? -30 : 30 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: isRTL ? 30 : -30 } };

  const steps: { key: AuthStep; num: number; label: string }[] = [
    { key: "phone", num: 1, label: t("auth.phone") },
    { key: "otp", num: 2, label: t("auth.otp") },
    { key: "info", num: 3, label: t("auth.name") },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === authStep);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir={dir}
      style={{ background: "var(--background)" }}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, var(--gold-accent), transparent)` }} />
      </div>

      {/* Top controls: Theme + Language */}
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
          
          <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Maham Expo" className="h-14 object-contain" style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{t("auth.login.title")}</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("auth.welcome")}</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
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
                  <div className="w-8 h-[2px] rounded-full" style={{ background: i < currentStepIndex ? "var(--gold-accent)" : "var(--glass-border)" }} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Phone */}
            {authStep === "phone" && (
              <motion.div key="phone" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    <Phone size={14} className={`inline ${isRTL ? "ml-1" : "mr-1"}`} style={{ color: "var(--gold-accent)" }} />
                    {t("auth.phone")}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 rounded-xl text-sm font-medium"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)", minWidth: "70px" }}>
                      966+
                    </div>
                    <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d\s]/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                      placeholder={t("auth.phone.placeholder")}
                      className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)", direction: "ltr", textAlign: "left", letterSpacing: "1px" }}
                      autoFocus maxLength={14} />
                  </div>
                </div>
                <button onClick={handlePhoneSubmit} disabled={phoneSending || phoneInput.replace(/\s/g, "").length < 9}
                  className="w-full py-3.5 rounded-xl text-base font-semibold btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {phoneSending ? <><Loader2 size={18} className="animate-spin" /> {t("common.loading")}</> : t("auth.sendOtp")}
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 pt-5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <ShieldCheck size={12} style={{ color: "var(--gold-accent)" }} />
                    {t("auth.secure")}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <Lock size={12} style={{ color: "var(--gold-accent)" }} />
                    {t("auth.encrypted")}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <Sparkles size={12} style={{ color: "var(--gold-accent)" }} />
                    {t("auth.free")}
                  </div>
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
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("auth.otp.placeholder")}</p>
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
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("common.loading")}</span>
                  </div>
                )}
                <div className="text-center mb-4">
                  {resendTimer > 0 ? (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {t("auth.resendIn")} <span style={{ color: "var(--gold-accent)" }}>{resendTimer}</span>s
                    </p>
                  ) : (
                    <button onClick={handleResendOTP} className="text-xs font-medium" style={{ color: "var(--gold-accent)" }}>
                      {t("auth.resendCode")}
                    </button>
                  )}
                </div>
                <button onClick={() => { setAuthStep("phone"); setOtpDigits(["", "", "", ""]); }}
                  className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <BackArrow size={14} />
                  {t("auth.changePhone")}
                </button>
              </motion.div>
            )}

            {/* STEP 3: Info */}
            {authStep === "info" && (
              <motion.div key="info" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
                    <User size={24} style={{ color: "var(--gold-accent)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t("auth.complete")}</p>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <User size={12} style={{ color: "var(--gold-accent)" }} /> {t("auth.name")}
                    </label>
                    <input type="text" value={traderName} onChange={(e) => setTraderName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} autoFocus />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <Building2 size={12} style={{ color: "var(--gold-accent)" }} /> {t("auth.company")}
                    </label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <Briefcase size={12} style={{ color: "var(--gold-accent)" }} /> {t("auth.activity")}
                    </label>
                    <select value={activity} onChange={(e) => setActivity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: activity ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <option value="">{t("auth.activity")}</option>
                      {ACTIVITIES.map(a => (
                        <option key={a.value} value={a.value}>{(a as any)[lang] || a.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <MapPin size={12} style={{ color: "var(--gold-accent)" }} /> {t("auth.region")}
                    </label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: region ? "var(--text-primary)" : "var(--text-muted)" }}>
                      <option value="">{t("auth.region")}</option>
                      {REGIONS.map(r => (<option key={r.value} value={r.value}>{(r as any)[lang] || r.en}</option>))}
                    </select>
                  </div>
                </div>
                <button onClick={handleInfoSubmit}
                  disabled={infoSubmitting || !traderName.trim() || !companyName.trim() || !activity || !region}
                  className="w-full py-3.5 rounded-xl text-base font-semibold btn-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5">
                  {infoSubmitting ? <><Loader2 size={18} className="animate-spin" /> {t("common.loading")}</> : t("home.login")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-[10px] mt-4" style={{ color: "var(--text-muted)" }}>
          © 2025 Maham Expo — All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
}
