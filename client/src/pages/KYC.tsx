/**
 * KYC — Know Your Customer Verification
 * Design: Obsidian Glass with step-by-step verification
 * Features: Identity verification, business license, bank account, legal declaration
 * Security: Required before any booking — prevents fraud and platform circumvention
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Upload, CheckCircle2, Clock, AlertTriangle, User,
  Building2, CreditCard, FileText, Camera, Lock, Eye, EyeOff,
  ChevronLeft, ChevronRight, Fingerprint, Globe, Phone, Mail,
  MapPin, Calendar, Hash, Award, XCircle, Info, Sparkles
} from "lucide-react";
import { toast } from "sonner";

type KYCStep = "personal" | "business" | "bank" | "documents" | "declaration" | "complete";

interface StepInfo {
  id: KYCStep;
  labelAr: string;
  labelEn: string;
  icon: any;
  completed: boolean;
}

export default function KYC() {
  const [currentStep, setCurrentStep] = useState<KYCStep>("personal");
  const [completedSteps, setCompletedSteps] = useState<KYCStep[]>([]);
  const [agreed, setAgreed] = useState(false);

  const steps: StepInfo[] = [
    { id: "personal", labelAr: "البيانات الشخصية", labelEn: "Personal Info", icon: User, completed: completedSteps.includes("personal") },
    { id: "business", labelAr: "بيانات الشركة", labelEn: "Business Info", icon: Building2, completed: completedSteps.includes("business") },
    { id: "bank", labelAr: "الحساب البنكي", labelEn: "Bank Account", icon: CreditCard, completed: completedSteps.includes("bank") },
    { id: "documents", labelAr: "المستندات", labelEn: "Documents", icon: FileText, completed: completedSteps.includes("documents") },
    { id: "declaration", labelAr: "الإقرار القانوني", labelEn: "Legal Declaration", icon: Shield, completed: completedSteps.includes("declaration") },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      toast.success("تم حفظ البيانات بنجاح");
    } else {
      setCurrentStep("complete");
      toast.success("تم إكمال التحقق من الهوية بنجاح!");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white/90">التحقق من الهوية (KYC)</h2>
        <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Know Your Customer — Required before booking</p>
      </div>

      {/* Progress */}
      {currentStep !== "complete" && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step.id === currentStep ? "text-[#C5A55A]" :
                  step.completed ? "text-green-400" : "text-white/20"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step.id === currentStep ? "border-[#C5A55A] bg-[#C5A55A]/10" :
                    step.completed ? "border-green-400/50 bg-green-400/10" : "border-white/10 bg-white/[0.02]"
                  }`}>
                    {step.completed ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="hidden md:block text-[10px]">{step.labelAr}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-px mx-2 ${
                    step.completed ? "bg-green-400/30" : "bg-white/5"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#C5A55A] to-[#E8D5A3] transition-all duration-500"
              style={{ width: `${((completedSteps.length) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-2xl p-6"
        >
          {/* Personal Info */}
          {currentStep === "personal" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User size={18} className="text-[#C5A55A]" />
                <h3 className="text-base font-bold text-white/80">البيانات الشخصية</h3>
                <span className="text-[10px] text-white/20 font-['Inter']">Personal Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "الاسم الكامل | Full Name", placeholder: "أدخل اسمك الكامل", icon: User },
                  { label: "رقم الهوية / الإقامة | ID Number", placeholder: "1XXXXXXXXX", icon: Hash },
                  { label: "رقم الجوال | Phone", placeholder: "+966 5X XXX XXXX", icon: Phone },
                  { label: "البريد الإلكتروني | Email", placeholder: "email@example.com", icon: Mail },
                  { label: "تاريخ الميلاد | Date of Birth", placeholder: "YYYY-MM-DD", icon: Calendar, type: "date" },
                  { label: "الجنسية | Nationality", placeholder: "سعودي", icon: Globe },
                  { label: "المدينة | City", placeholder: "الرياض", icon: MapPin },
                  { label: "العنوان | Address", placeholder: "العنوان التفصيلي", icon: MapPin },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-[10px] text-white/40 mb-1.5 block">{field.label}</label>
                    <div className="relative">
                      <field.icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="w-full bg-white/[0.04] border border-white/8 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Info */}
          {currentStep === "business" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Building2 size={18} className="text-[#C5A55A]" />
                <h3 className="text-base font-bold text-white/80">بيانات الشركة</h3>
                <span className="text-[10px] text-white/20 font-['Inter']">Business Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "اسم الشركة | Company Name", placeholder: "اسم الشركة التجاري" },
                  { label: "رقم السجل التجاري | CR Number", placeholder: "XXXXXXXXXX" },
                  { label: "نوع النشاط | Business Type", placeholder: "تقنية معلومات" },
                  { label: "سنة التأسيس | Founded", placeholder: "2020" },
                  { label: "عدد الموظفين | Employees", placeholder: "10-50" },
                  { label: "الموقع الإلكتروني | Website", placeholder: "www.example.com" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-[10px] text-white/40 mb-1.5 block">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Account */}
          {currentStep === "bank" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <CreditCard size={18} className="text-[#C5A55A]" />
                <h3 className="text-base font-bold text-white/80">الحساب البنكي</h3>
                <span className="text-[10px] text-white/20 font-['Inter']">Bank Account Details</span>
              </div>
              <div className="glass-card rounded-xl p-3 mb-5 bg-[#C5A55A]/5 border-[rgba(197,165,90,0.1)]">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-[#C5A55A]" />
                  <p className="text-[10px] text-[#C5A55A]/70">بيانات الحساب البنكي مشفرة ومحمية بالكامل</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "اسم البنك | Bank Name", placeholder: "البنك الأهلي السعودي" },
                  { label: "رقم الآيبان | IBAN", placeholder: "SA XXXX XXXX XXXX XXXX XXXX" },
                  { label: "اسم صاحب الحساب | Account Holder", placeholder: "الاسم كما في البنك" },
                  { label: "رقم الحساب | Account Number", placeholder: "XXXXXXXXXXXX" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-[10px] text-white/40 mb-1.5 block">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {currentStep === "documents" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText size={18} className="text-[#C5A55A]" />
                <h3 className="text-base font-bold text-white/80">رفع المستندات</h3>
                <span className="text-[10px] text-white/20 font-['Inter']">Upload Documents</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "صورة الهوية الوطنية / الإقامة", labelEn: "National ID / Iqama", required: true },
                  { label: "السجل التجاري", labelEn: "Commercial Registration", required: true },
                  { label: "شهادة الزكاة والضريبة", labelEn: "ZATCA Certificate", required: true },
                  { label: "رخصة البلدية", labelEn: "Municipal License", required: false },
                  { label: "شهادة التأمينات الاجتماعية", labelEn: "GOSI Certificate", required: false },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[rgba(197,165,90,0.15)] transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-white/30" />
                      <div>
                        <p className="text-xs text-white/60">{doc.label}</p>
                        <p className="text-[9px] text-white/20 font-['Inter']">{doc.labelEn}</p>
                      </div>
                      {doc.required && <span className="text-[8px] text-red-400/60">مطلوب</span>}
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A55A]/10 text-[10px] text-[#C5A55A] hover:bg-[#C5A55A]/20 transition-colors">
                      <Upload size={12} />
                      رفع
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Declaration */}
          {currentStep === "declaration" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Shield size={18} className="text-[#C5A55A]" />
                <h3 className="text-base font-bold text-white/80">الإقرار القانوني</h3>
                <span className="text-[10px] text-white/20 font-['Inter']">Legal Declaration</span>
              </div>

              <div className="glass-card rounded-xl p-5 mb-5 border-red-400/10 bg-red-400/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-red-400/70" />
                  <h4 className="text-xs font-bold text-red-400/70">إقرار والتزام — مهم جداً</h4>
                </div>
                <div className="space-y-3 text-xs text-white/50 leading-relaxed">
                  <p>أقر أنا الموقع أدناه بالآتي:</p>
                  <p><strong className="text-white/70">1.</strong> جميع البيانات والمستندات المقدمة صحيحة وحقيقية، وأتحمل المسؤولية القانونية الكاملة عن أي معلومات غير صحيحة.</p>
                  <p><strong className="text-white/70">2.</strong> ألتزم بعدم التواصل المباشر مع المستثمر أو منظم المعرض خارج منصة مهام إكسبو قبل توقيع العقد الإلكتروني.</p>
                  <p><strong className="text-white/70">3.</strong> أي محاولة لتجاوز المنصة أو مشاركة معلومات الاتصال المباشر تعرضني لغرامة مالية قدرها <strong className="text-red-400">50,000 ريال سعودي</strong>.</p>
                  <p><strong className="text-white/70">4.</strong> العربون المدفوع (5% من قيمة الحجز) غير مسترد في حال إلغاء الحجز من طرفي.</p>
                  <p><strong className="text-white/70">5.</strong> ألتزم بجميع شروط وأحكام منصة مهام إكسبو والقوانين المعمول بها في المملكة العربية السعودية.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/25 font-['Inter'] leading-relaxed">
                  <p>I hereby declare that all information provided is accurate. I commit to not contacting the investor directly outside the platform before e-contract signing. Any bypass attempt will result in a SAR 50,000 penalty. The 5% deposit is non-refundable upon cancellation.</p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-[rgba(197,165,90,0.15)] transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#C5A55A]"
                />
                <div>
                  <p className="text-xs text-white/60">أوافق على جميع الشروط والأحكام المذكورة أعلاه</p>
                  <p className="text-[9px] text-white/20 font-['Inter']">I agree to all terms and conditions stated above</p>
                </div>
              </label>
            </div>
          )}

          {/* Complete */}
          {currentStep === "complete" && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 size={64} className="mx-auto text-green-400 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-white/80 mb-2">تم التحقق بنجاح!</h3>
              <p className="text-sm text-white/40 mb-1">حسابك موثق ويمكنك الآن حجز الوحدات في أي معرض</p>
              <p className="text-xs text-white/20 font-['Inter']">Your account is verified. You can now book units at any expo.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Award size={16} className="text-[#C5A55A]" />
                <span className="text-sm text-[#C5A55A]">تاجر موثق — Verified Trader</span>
              </div>
              <a href="/expos" className="inline-block mt-6 btn-gold px-6 py-3 rounded-xl text-sm">
                تصفح المعارض والحجز الآن
              </a>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== "complete" && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/5">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={14} />
                السابق
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === "declaration" && !agreed}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 disabled:opacity-30"
              >
                {currentIndex === steps.length - 1 ? "إكمال التحقق" : "التالي"}
                <ChevronLeft size={14} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
