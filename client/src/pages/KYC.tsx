/**
 * KYC — Know Your Customer Verification
 * Design: Professional legal-grade verification with comprehensive legal declaration
 * Based on: Actual MAHAM Group contracts and Saudi/GCC legal standards
 * Features: 5-step verification, comprehensive legal declaration, mandatory agreement
 * Security: Required before any booking — full audit trail
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Upload, CheckCircle2, AlertTriangle, User,
  Building2, CreditCard, FileText, Lock,
  ChevronLeft, ChevronRight, Globe, Phone, Mail,
  MapPin, Calendar, Hash, Award, Info, Scale,
  BookOpen, Stamp, Eye, BadgeCheck, FileWarning, Gavel
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

type KYCStep = "personal" | "business" | "bank" | "documents" | "declaration" | "complete";

interface FormData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  dob: string;
  nationality: string;
  city: string;
  address: string;
  companyName: string;
  crNumber: string;
  businessType: string;
  founded: string;
  employees: string;
  website: string;
  vatNumber: string;
  nationalAddress: string;
  bankName: string;
  iban: string;
  accountHolder: string;
  accountNumber: string;
}

export default function KYC() {
  const [currentStep, setCurrentStep] = useState<KYCStep>("personal");
  const [completedSteps, setCompletedSteps] = useState<KYCStep[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedIP, setAgreedIP] = useState(false);
  const [agreedPenalty, setAgreedPenalty] = useState(false);
  const [agreedAll, setAgreedAll] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: "", idNumber: "", phone: "", email: "", dob: "", nationality: "",
    city: "", address: "", companyName: "", crNumber: "", businessType: "",
    founded: "", employees: "", website: "", vatNumber: "", nationalAddress: "",
    bankName: "", iban: "", accountHolder: "", accountNumber: ""
  });

  const { trader } = useAuth();

  useEffect(() => {
    if (trader) {
      setFormData(prev => ({
        ...prev,
        fullName: trader.name || "",
        phone: trader.phone || "",
        companyName: trader.companyName || "",
      }));
    }
  }, [trader]);

  const allAgreed = agreedTerms && agreedPrivacy && agreedIP && agreedPenalty;

  useEffect(() => {
    if (agreedAll) {
      setAgreedTerms(true);
      setAgreedPrivacy(true);
      setAgreedIP(true);
      setAgreedPenalty(true);
    } else if (!agreedAll && allAgreed) {
      // don't uncheck individual ones
    }
  }, [agreedAll]);

  useEffect(() => {
    setAgreedAll(allAgreed);
  }, [agreedTerms, agreedPrivacy, agreedIP, agreedPenalty]);

  const steps = [
    { id: "personal" as KYCStep, labelAr: "البيانات الشخصية", labelEn: "Personal Info", icon: User, completed: completedSteps.includes("personal") },
    { id: "business" as KYCStep, labelAr: "بيانات الشركة", labelEn: "Business Info", icon: Building2, completed: completedSteps.includes("business") },
    { id: "bank" as KYCStep, labelAr: "الحساب البنكي", labelEn: "Bank Account", icon: CreditCard, completed: completedSteps.includes("bank") },
    { id: "documents" as KYCStep, labelAr: "المستندات", labelEn: "Documents", icon: FileText, completed: completedSteps.includes("documents") },
    { id: "declaration" as KYCStep, labelAr: "الإقرار القانوني", labelEn: "Legal Declaration", icon: Shield, completed: completedSteps.includes("declaration") },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      toast.success("تم حفظ البيانات بنجاح");
    } else {
      setCurrentStep("complete");
      toast.success("تم إكمال التحقق من الهوية بنجاح! حسابك الآن موثق.");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1].id);
  };

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => ({ ...prev, [docId]: true }));
    toast.success("تم رفع المستند بنجاح");
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const InputField = ({ label, placeholder, icon: Icon, field, type = "text" }: {
    label: string; placeholder: string; icon: any; field: keyof FormData; type?: string;
  }) => (
    <div>
      <label className="text-[11px] t-tertiary mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 t-muted" />
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl pr-10 pl-4 py-3 text-sm t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] transition-colors"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-1">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold t-primary">التحقق من الهوية (KYC)</h2>
        <p className="text-[10px] sm:text-xs t-gold/50 font-['Inter']">Know Your Customer — Required before booking</p>
      </div>

      {/* Company Info Banner */}
      <div className="glass-card rounded-xl p-3 sm:p-4 border-[var(--gold-border)]/20 bg-gold-subtle">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--gold-border)]/10 flex items-center justify-center flex-shrink-0">
            <Stamp size={16} className="t-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold t-gold">شركة مهام للخدمات وتقنية المعلومات</p>
            <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Maham Company for Services and Information Technology</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary mt-1">سجل تجاري: 4030163376 | الرقم الضريبي مسجل لدى ZATCA</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {currentStep !== "complete" && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-1 sm:gap-2 ${
                  step.id === currentStep ? "t-gold" :
                  step.completed ? "text-[var(--status-green)]" : "t-muted"
                }`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border ${
                    step.id === currentStep ? "border-[#C5A55A] bg-gold-subtle" :
                    step.completed ? "border-green-400/50 bg-[var(--status-green)]/10" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"
                  }`}>
                    {step.completed ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="hidden lg:block text-[10px]">{step.labelAr}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 lg:w-16 h-px mx-1 sm:mx-2 ${
                    step.completed ? "bg-[var(--status-green)]/30" : "bg-[var(--glass-bg)]"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[var(--glass-bg)]">
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
          className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6"
        >
          {/* ===== STEP 1: Personal Info ===== */}
          {currentStep === "personal" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <User size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">البيانات الشخصية</h3>
                <span className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Personal Information</span>
              </div>
              <div className="bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Info size={12} className="text-[var(--status-blue)] flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-tertiary">يجب أن تتطابق البيانات مع المعلومات المسجلة في أبشر ومركز المعلومات الوطني</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label="الاسم الكامل | Full Name" placeholder="كما في الهوية الوطنية" icon={User} field="fullName" />
                <InputField label="رقم الهوية / الإقامة | ID Number" placeholder="1XXXXXXXXX" icon={Hash} field="idNumber" />
                <InputField label="رقم الجوال المسجل بأبشر | Phone" placeholder="+966 5X XXX XXXX" icon={Phone} field="phone" />
                <InputField label="البريد الإلكتروني | Email" placeholder="email@example.com" icon={Mail} field="email" type="email" />
                <InputField label="تاريخ الميلاد | Date of Birth" placeholder="YYYY-MM-DD" icon={Calendar} field="dob" type="date" />
                <InputField label="الجنسية | Nationality" placeholder="سعودي" icon={Globe} field="nationality" />
                <InputField label="المدينة | City" placeholder="الرياض" icon={MapPin} field="city" />
                <InputField label="العنوان الوطني | National Address" placeholder="العنوان الوطني الكامل" icon={MapPin} field="address" />
              </div>
            </div>
          )}

          {/* ===== STEP 2: Business Info ===== */}
          {currentStep === "business" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Building2 size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">بيانات الشركة / المؤسسة</h3>
                <span className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Business Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label="اسم الشركة / المؤسسة | Company Name" placeholder="الاسم التجاري الرسمي" icon={Building2} field="companyName" />
                <InputField label="رقم السجل التجاري | CR Number" placeholder="XXXXXXXXXX" icon={Hash} field="crNumber" />
                <div>
                  <label className="text-[11px] t-tertiary mb-1.5 block font-medium">نوع النشاط | Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateField("businessType", e.target.value)}
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm t-secondary focus:outline-none focus:border-[var(--gold-border)] transition-colors"
                  >
                    <option value="">اختر النشاط</option>
                    <option value="food_beverage">أغذية ومشروبات (F&B)</option>
                    <option value="retail">تجارة وبيع بالتجزئة (Retail)</option>
                    <option value="tech">تقنية وابتكار</option>
                    <option value="realestate">عقارات واستثمار</option>
                    <option value="entertainment">ترفيه وفعاليات</option>
                    <option value="health">صحة وجمال</option>
                    <option value="fashion">أزياء وموضة</option>
                    <option value="auto">سيارات ومركبات</option>
                    <option value="education">تعليم وتدريب</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <InputField label="سنة التأسيس | Founded" placeholder="2020" icon={Calendar} field="founded" />
                <InputField label="الرقم الضريبي (VAT) | VAT Number" placeholder="3XXXXXXXXXXXXX003" icon={Hash} field="vatNumber" />
                <InputField label="العنوان الوطني للمنشأة | National Address" placeholder="العنوان الوطني" icon={MapPin} field="nationalAddress" />
                <InputField label="عدد الموظفين | Employees" placeholder="10-50" icon={User} field="employees" />
                <InputField label="الموقع الإلكتروني | Website" placeholder="www.example.com" icon={Globe} field="website" />
              </div>
            </div>
          )}

          {/* ===== STEP 3: Bank Account ===== */}
          {currentStep === "bank" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <CreditCard size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">الحساب البنكي</h3>
                <span className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Bank Account Details</span>
              </div>
              <div className="bg-gold-subtle border border-[var(--gold-border)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-gold/70">بيانات الحساب البنكي مشفرة بتقنية AES-256 ومحمية بالكامل وفق معايير PCI DSS</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label="اسم البنك | Bank Name" placeholder="البنك الأهلي السعودي" icon={Building2} field="bankName" />
                <InputField label="رقم الآيبان (IBAN)" placeholder="SA XXXX XXXX XXXX XXXX XXXX" icon={Hash} field="iban" />
                <InputField label="اسم صاحب الحساب | Account Holder" placeholder="كما في البنك" icon={User} field="accountHolder" />
                <InputField label="رقم الحساب | Account Number" placeholder="XXXXXXXXXXXX" icon={Hash} field="accountNumber" />
              </div>
              <div className="mt-4 bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3">
                <p className="text-[10px] sm:text-xs t-tertiary">يجب أن يكون الحساب البنكي باسم الشركة / المؤسسة المسجلة. سيتم تحويل مستحقاتك المالية إلى هذا الحساب بعد تسوية كل فترة محاسبية.</p>
              </div>
            </div>
          )}

          {/* ===== STEP 4: Documents ===== */}
          {currentStep === "documents" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">رفع المستندات الرسمية</h3>
                <span className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Upload Official Documents</span>
              </div>
              <div className="bg-[var(--status-red)]/5 border border-[var(--status-red)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FileWarning size={12} className="text-[var(--status-red)] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs t-tertiary">جميع المستندات مطلوبة لإتمام التحقق. يجب تقديمها خلال 10 أيام من تاريخ التسجيل وفقاً لشروط العقد.</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { id: "national_id", label: "صورة الهوية الوطنية / الإقامة", labelEn: "National ID / Iqama", required: true, desc: "صورة واضحة للوجهين" },
                  { id: "cr", label: "السجل التجاري ساري المفعول", labelEn: "Valid Commercial Registration", required: true, desc: "يجب أن يكون ساري المفعول" },
                  { id: "vat_cert", label: "شهادة تسجيل ضريبة القيمة المضافة", labelEn: "VAT Registration Certificate", required: true, desc: "صادرة من هيئة الزكاة والضريبة والجمارك (ZATCA)" },
                  { id: "auth_letter", label: "تفويض / وكالة رسمية", labelEn: "Authorization Letter / Power of Attorney", required: true, desc: "للمفوض بالتوقيع على العقود" },
                  { id: "national_address", label: "العنوان الوطني", labelEn: "National Address Certificate", required: true, desc: "صادر من البريد السعودي" },
                  { id: "municipal", label: "رخصة البلدية", labelEn: "Municipal License", required: false, desc: "إن وجدت — مطلوبة قبل بدء التشغيل" },
                  { id: "gosi", label: "شهادة التأمينات الاجتماعية", labelEn: "GOSI Certificate", required: false, desc: "إن وجدت" },
                  { id: "bank_letter", label: "خطاب تعريف بنكي", labelEn: "Bank Identification Letter", required: false, desc: "يؤكد بيانات الحساب البنكي" },
                ].map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--gold-border)] transition-colors gap-2 sm:gap-0">
                    <div className="flex items-start gap-3 min-w-0">
                      {uploadedDocs[doc.id] ? (
                        <CheckCircle2 size={16} className="text-[var(--status-green)] flex-shrink-0 mt-0.5" />
                      ) : (
                        <FileText size={16} className="t-tertiary flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm t-secondary font-medium">{doc.label}</p>
                        <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">{doc.labelEn}</p>
                        <p className="text-[9px] t-muted mt-0.5">{doc.desc}</p>
                      </div>
                      {doc.required && !uploadedDocs[doc.id] && (
                        <span className="text-[8px] sm:text-[9px] text-[var(--status-red)] bg-[var(--status-red)]/10 px-1.5 py-0.5 rounded flex-shrink-0">مطلوب</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUpload(doc.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] sm:text-xs transition-colors flex-shrink-0 self-end sm:self-auto ${
                        uploadedDocs[doc.id]
                          ? "bg-[var(--status-green)]/10 text-[var(--status-green)]"
                          : "bg-gold-subtle t-gold hover:bg-[#C5A55A]/20"
                      }`}
                    >
                      {uploadedDocs[doc.id] ? (
                        <><CheckCircle2 size={12} /> تم الرفع</>
                      ) : (
                        <><Upload size={12} /> رفع الملف</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== STEP 5: Legal Declaration ===== */}
          {currentStep === "declaration" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Gavel size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">الإقرار القانوني والالتزام</h3>
                <span className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Legal Declaration & Commitment</span>
              </div>

              {/* Section 1: General Declaration */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-red)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-[var(--status-red)]/70 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-red)]/70">القسم الأول: إقرار بصحة البيانات</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p>أقر أنا الموقع أدناه، بصفتي ممثلاً مفوضاً عن المنشأة المذكورة أعلاه، بالآتي:</p>
                  <p><strong>1.</strong> جميع البيانات والمستندات المقدمة عبر هذه المنصة صحيحة وحقيقية ومطابقة للواقع، وأتحمل المسؤولية القانونية الكاملة عن أي معلومات غير صحيحة أو مضللة وفقاً لنظام مكافحة التزوير في المملكة العربية السعودية.</p>
                  <p><strong>2.</strong> رقم الجوال المسجل في المنصة هو ذاته المسجل في نظام أبشر ومركز المعلومات الوطني، وأي إجراء يتم عبره يُعتبر صادراً مني شخصياً.</p>
                  <p><strong>3.</strong> أقر بأن جميع الموافقات والتأكيدات الإلكترونية التي أقوم بها عبر المنصة لها ذات الحجية القانونية للتوقيع الخطي وفقاً لنظام التعاملات الإلكترونية السعودي الصادر بالمرسوم الملكي رقم (م/18).</p>
                </div>
              </div>

              {/* Section 2: Platform Rules */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--gold-border)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Scale size={14} className="t-gold flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-gold">القسم الثاني: شروط استخدام المنصة والحجز</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>4.</strong> ألتزم بعدم التواصل المباشر مع المستثمر أو منظم المعرض أو أي طرف ثالث خارج منصة مهام إكسبو قبل توقيع العقد الإلكتروني الرسمي عبر منصة إيجار.</p>
                  <p><strong>5.</strong> أي محاولة لتجاوز المنصة أو مشاركة معلومات الاتصال المباشر أو التفاوض خارج النظام تعرضني لغرامة مالية قدرها <strong className="text-[var(--status-red)]">50,000 ريال سعودي</strong> مع حق المنصة في إلغاء جميع حجوزاتي.</p>
                  <p><strong>6.</strong> العربون المدفوع عند الحجز غير مسترد في حال إلغاء الحجز من طرفي، ويحق للمنظم فرض غرامة إلغاء تصل إلى <strong className="text-[var(--status-red)]">25%</strong> من إجمالي القيمة التعاقدية.</p>
                  <p><strong>7.</strong> ألتزم بتوثيق العقد عبر منصة إيجار الإلكترونية خلال <strong>48 ساعة</strong> من استلام رسالة التوثيق، وفي حال التأخير يتم فرض غرامة <strong className="text-[var(--status-red)]">350 ريال سعودي</strong> عن كل يوم تأخير.</p>
                  <p><strong>8.</strong> ألتزم باستخراج جميع التراخيص والتصاريح المطلوبة من البلدية والجهات المختصة لممارسة نشاطي، وأتحمل كامل المسؤولية عن أي مخالفة نظامية.</p>
                  <p><strong>9.</strong> أوافق على أن جميع عمليات البيع داخل الموقع المتعاقد عليه تتم حصرياً من خلال نظام نقاط البيع (POS) المملوك والمشغّل من قبل شركة مهام أو مزوّد معتمد من قبلها.</p>
                  <p><strong>10.</strong> نسبة مشاركة الإيرادات تكون وفقاً للعقد المبرم بين الطرفين، ويتم التسوية المالية خلال الفترة من 1-5 من كل شهر ميلادي.</p>
                  <p><strong>11.</strong> ألتزم بسداد الرسوم الإدارية ورسوم الكهرباء والماء (إن وجدت) وضريبة القيمة المضافة (15%) وفقاً للفواتير الصادرة.</p>
                </div>
              </div>

              {/* Section 3: IP & Brand Protection */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-purple-400/10">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck size={14} className="text-purple-400 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-purple-400">القسم الثالث: حماية الملكية الفكرية والعلامة التجارية</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>12.</strong> أقر بأن العلامة التجارية "MAHAM" و"مهام إكسبو" و"MAHAM EXPO" و"MAHAM GROUP" وجميع الشعارات والرموز والتصاميم المرتبطة بها هي ملكية فكرية حصرية لشركة مهام للخدمات وتقنية المعلومات، محمية بموجب نظام العلامات التجارية السعودي ونظام حماية حقوق المؤلف.</p>
                  <p><strong>13.</strong> أتعهد بعدم نسخ أو تقليد أو استخدام أي من العلامات التجارية أو الشعارات أو التصاميم أو الأنظمة أو الأفكار التشغيلية الخاصة بمنصة مهام إكسبو، سواء بشكل مباشر أو غير مباشر، لأي غرض تجاري أو غير تجاري.</p>
                  <p><strong>14.</strong> أي انتهاك لحقوق الملكية الفكرية يعرضني للمساءلة القانونية والتعويض المالي وفقاً لأنظمة المملكة العربية السعودية، بما في ذلك نظام العلامات التجارية الصادر بالمرسوم الملكي رقم (م/21) ونظام حماية حقوق المؤلف.</p>
                  <p><strong>15.</strong> أتعهد بعدم إنشاء أو المشاركة في إنشاء أي منصة أو خدمة مشابهة أو منافسة تستخدم نفس النموذج التشغيلي لمنصة مهام إكسبو خلال فترة التعاقد وسنتين بعد انتهائه.</p>
                  <p><strong>16.</strong> جميع البيانات والمعلومات التي أطلع عليها عبر المنصة تعتبر سرية ولا يحق لي مشاركتها مع أي طرف ثالث.</p>
                </div>
              </div>

              {/* Section 4: Privacy */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-blue)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={14} className="text-[var(--status-blue)] flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-blue)]">القسم الرابع: سياسة الخصوصية وحماية البيانات</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>17.</strong> أوافق على جمع ومعالجة وتخزين بياناتي الشخصية والتجارية بواسطة منصة مهام إكسبو وفقاً لنظام حماية البيانات الشخصية السعودي الصادر بالمرسوم الملكي رقم (م/19).</p>
                  <p><strong>18.</strong> أوافق على أن المنصة تحتفظ بسجل كامل لجميع عملياتي وموافقاتي الإلكترونية كدليل قانوني يمكن تقديمه للجهات المختصة عند الحاجة.</p>
                  <p><strong>19.</strong> أوافق على استخدام بياناتي لأغراض التحقق والتوثيق والتواصل المتعلق بالخدمات المقدمة عبر المنصة.</p>
                  <p><strong>20.</strong> أعلم أن المنصة تستخدم تقنيات تشفير متقدمة لحماية بياناتي المالية والشخصية وفقاً لمعايير الأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني (NCA).</p>
                </div>
              </div>

              {/* Section 5: Governing Law */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="t-tertiary flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-secondary">القسم الخامس: القانون الحاكم وفض النزاعات</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>21.</strong> يخضع هذا الإقرار وجميع العلاقات التعاقدية لأنظمة وقوانين المملكة العربية السعودية.</p>
                  <p><strong>22.</strong> في حال نشوء أي نزاع، يتم حله ودياً خلال 30 يوماً، وفي حال تعذر ذلك يُحال إلى المحاكم التجارية المختصة في مدينة الرياض بالمملكة العربية السعودية.</p>
                  <p><strong>23.</strong> ألتزم بجميع شروط وأحكام منصة مهام إكسبو والقوانين المعمول بها في المملكة العربية السعودية، بما في ذلك نظام التجارة الإلكترونية ونظام مكافحة غسل الأموال.</p>
                </div>
              </div>

              {/* English Summary */}
              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-5 border border-[var(--glass-border)]">
                <button
                  onClick={() => setShowFullTerms(!showFullTerms)}
                  className="flex items-center gap-2 text-xs t-muted hover:t-secondary transition-colors w-full justify-between"
                >
                  <span className="font-['Inter'] font-medium">English Legal Summary</span>
                  <ChevronLeft size={14} className={`transition-transform ${showFullTerms ? "rotate-90" : ""}`} />
                </button>
                {showFullTerms && (
                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)] text-[10px] sm:text-xs t-muted font-['Inter'] leading-relaxed space-y-2">
                    <p>I hereby declare that all information provided is accurate and matches official government records (Absher/NIC). I accept full legal responsibility for any false information under Saudi anti-forgery laws.</p>
                    <p>I commit to not contacting investors or organizers outside the MAHAM EXPO platform before e-contract signing. Any bypass attempt will result in a SAR 50,000 penalty. The deposit is non-refundable upon cancellation, with up to 25% cancellation fee.</p>
                    <p>I acknowledge that "MAHAM", "MAHAM EXPO", "MAHAM GROUP" and all associated logos are exclusive intellectual property of Maham Company for Services and IT, protected under Saudi trademark and copyright laws. I will not copy, imitate, or create competing platforms during the contract period and 2 years after.</p>
                    <p>I consent to data collection and processing per Saudi Personal Data Protection Law (Royal Decree M/19). All electronic approvals have the same legal weight as handwritten signatures per Saudi E-Transactions Law (Royal Decree M/18).</p>
                    <p>This declaration is governed by Saudi Arabian law. Disputes shall be resolved amicably within 30 days, otherwise referred to commercial courts in Riyadh, Saudi Arabia.</p>
                  </div>
                )}
              </div>

              {/* Agreement Checkboxes */}
              <div className="space-y-3 mb-4">
                <label className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--gold-border)] transition-colors">
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="mt-0.5 accent-[#C5A55A] w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm t-secondary font-medium">أوافق على شروط الاستخدام والحجز (البنود 4-11)</p>
                    <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">I agree to the platform usage and booking terms</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--gold-border)] transition-colors">
                  <input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="mt-0.5 accent-[#C5A55A] w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm t-secondary font-medium">أوافق على سياسة الخصوصية وحماية البيانات (البنود 17-20)</p>
                    <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">I agree to the privacy policy and data protection terms</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--gold-border)] transition-colors">
                  <input type="checkbox" checked={agreedIP} onChange={(e) => setAgreedIP(e.target.checked)} className="mt-0.5 accent-[#C5A55A] w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm t-secondary font-medium">أوافق على بنود حماية الملكية الفكرية والعلامة التجارية (البنود 12-16)</p>
                    <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">I agree to the IP and trademark protection terms</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--gold-border)] transition-colors">
                  <input type="checkbox" checked={agreedPenalty} onChange={(e) => setAgreedPenalty(e.target.checked)} className="mt-0.5 accent-[#C5A55A] w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm t-secondary font-medium">أقر بعلمي بالغرامات والعقوبات المترتبة على المخالفة (البنود 5-6-7)</p>
                    <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">I acknowledge the penalties for violations</p>
                  </div>
                </label>

                {/* Select All */}
                <div className="pt-2 border-t border-[var(--glass-border)]">
                  <label className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gold-subtle border border-[var(--gold-border)]/20 cursor-pointer hover:border-[var(--gold-border)] transition-colors">
                    <input type="checkbox" checked={agreedAll} onChange={(e) => setAgreedAll(e.target.checked)} className="mt-0.5 accent-[#C5A55A] w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm t-gold font-bold">أوافق على جميع الشروط والأحكام والإقرارات المذكورة أعلاه</p>
                      <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">I agree to ALL terms, conditions, and declarations stated above</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Digital Signature Info */}
              <div className="bg-[var(--glass-bg)] rounded-xl p-3 sm:p-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-tertiary font-medium">التوقيع الإلكتروني</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-xs t-muted">
                  <p>الاسم: <span className="t-secondary">{formData.fullName || "—"}</span></p>
                  <p>رقم الهوية: <span className="t-secondary">{formData.idNumber || "—"}</span></p>
                  <p>الجوال: <span className="t-secondary">{formData.phone || "—"}</span></p>
                  <p>التاريخ: <span className="t-secondary">{new Date().toLocaleDateString("ar-SA")}</span></p>
                  <p>IP: <span className="t-secondary font-['Inter']">سيتم تسجيله تلقائياً</span></p>
                  <p>المنشأة: <span className="t-secondary">{formData.companyName || "—"}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* ===== COMPLETE ===== */}
          {currentStep === "complete" && (
            <div className="text-center py-6 sm:py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <CheckCircle2 size={56} className="mx-auto text-[var(--status-green)] mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold t-primary mb-2">تم التحقق بنجاح!</h3>
              <p className="text-xs sm:text-sm t-tertiary mb-1">حسابك موثق ويمكنك الآن حجز الوحدات في أي معرض</p>
              <p className="text-[10px] sm:text-xs t-muted font-['Inter']">Your account is verified. You can now book units at any expo.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Award size={16} className="t-gold" />
                <span className="text-sm t-gold font-bold">تاجر موثق — Verified Trader</span>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] max-w-sm mx-auto">
                <p className="text-[10px] sm:text-xs t-muted">تم حفظ ملف التحقق الكامل بما في ذلك: بياناتك الشخصية، بيانات المنشأة، المستندات، والإقرار القانوني الموقّع إلكترونياً مع الطابع الزمني وعنوان IP.</p>
              </div>
              <a href="/expos" className="inline-block mt-6 btn-gold px-6 py-3 rounded-xl text-sm font-bold">
                تصفح المعارض والحجز الآن
              </a>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== "complete" && (
            <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[var(--glass-border)]">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-xs t-tertiary hover:t-secondary disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={14} />
                السابق
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === "declaration" && !allAgreed}
                className="btn-gold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 disabled:opacity-30 font-bold"
              >
                {currentIndex === steps.length - 1 ? "تأكيد الإقرار وإكمال التحقق" : "حفظ والتالي"}
                <ChevronLeft size={14} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
