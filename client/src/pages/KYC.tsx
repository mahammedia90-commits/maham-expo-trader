/**
 * KYC — Know Your Customer Verification
 * All text uses t() for multi-language support
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Shield, Upload, CheckCircle2, AlertTriangle, User,
  Building2, CreditCard, FileText, Lock,
  ChevronLeft, ChevronRight, Globe, Phone, Mail,
  MapPin, Calendar, Hash, Award, Info, Scale,
  BookOpen, Stamp, Eye, BadgeCheck, FileWarning, Gavel, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

type KYCStep = "personal" | "business" | "bank" | "documents" | "declaration" | "complete";

interface FormData {
  fullName: string; idNumber: string; phone: string; email: string; dob: string;
  nationality: string; city: string; address: string; companyName: string; crNumber: string;
  businessType: string; founded: string; employees: string; website: string; vatNumber: string;
  nationalAddress: string; bankName: string; iban: string; accountHolder: string; accountNumber: string;
}

export default function KYC() {
  const { t, lang, isRTL } = useLanguage();
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

  const { trader, completeKYC, saveKYCData } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (trader) {
      setFormData(prev => ({ ...prev, fullName: trader.name || "", phone: trader.phone || "", companyName: trader.companyName || "" }));
    }
  }, [trader]);

  useEffect(() => { if (trader?.kycStatus === "verified") setCurrentStep("complete"); }, [trader]);

  const allAgreed = agreedTerms && agreedPrivacy && agreedIP && agreedPenalty;
  useEffect(() => { if (agreedAll) { setAgreedTerms(true); setAgreedPrivacy(true); setAgreedIP(true); setAgreedPenalty(true); } }, [agreedAll]);
  useEffect(() => { setAgreedAll(allAgreed); }, [agreedTerms, agreedPrivacy, agreedIP, agreedPenalty]);

  const steps = [
    { id: "personal" as KYCStep, label: t("kyc.personalInfo"), icon: User, completed: completedSteps.includes("personal") },
    { id: "business" as KYCStep, label: t("kyc.businessInfo"), icon: Building2, completed: completedSteps.includes("business") },
    { id: "bank" as KYCStep, label: t("kyc.bankAccount"), icon: CreditCard, completed: completedSteps.includes("bank") },
    { id: "documents" as KYCStep, label: t("kyc.documents"), icon: FileText, completed: completedSteps.includes("documents") },
    { id: "declaration" as KYCStep, label: t("kyc.legalDeclaration"), icon: Shield, completed: completedSteps.includes("declaration") },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      toast.success(t("kyc.dataSaved"));
    } else {
      saveKYCData(formData);
      if (completeKYC) completeKYC();
      setCurrentStep("complete");
      toast.success(t("kyc.verificationComplete"));
    }
  };

  const handlePrev = () => { if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1].id); };
  const handleUpload = (docId: string) => { setUploadedDocs(prev => ({ ...prev, [docId]: true })); toast.success(t("kyc.docUploaded")); };
  const updateField = (field: keyof FormData, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };

  const InputField = ({ label, placeholder, icon: Icon, field, type = "text", optional = false }: {
    label: string; placeholder: string; icon: any; field: keyof FormData; type?: string; optional?: boolean;
  }) => (
    <div>
      <label className="text-[11px] t-tertiary mb-1.5 block font-medium">
        {label}
        {optional && <span className="text-[9px] t-muted mx-1">({t("kyc.optional")})</span>}
      </label>
      <div className="relative">
        <Icon size={14} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 t-muted`} />
        <input type={type} value={formData[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder}
          className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 text-sm t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] transition-colors`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-1">
      <div>
        <h2 className="text-lg sm:text-xl font-bold t-primary">{t("kyc.title")}</h2>
        <p className="text-[10px] sm:text-xs t-gold/50 font-['Inter']">Know Your Customer — Required before booking</p>
      </div>

      <div className="glass-card rounded-xl p-3 sm:p-4 border-[var(--gold-border)]/20 bg-gold-subtle">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--gold-border)]/10 flex items-center justify-center flex-shrink-0">
            <Stamp size={16} className="t-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold t-gold">{t("kyc.companyName")}</p>
            <p className="text-[9px] sm:text-[10px] t-muted font-['Inter']">Maham Company for Services and Information Technology</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary mt-1">{t("kyc.crNumber")}: 4030163376 | {t("kyc.vatRegistered")}</p>
          </div>
        </div>
      </div>

      {currentStep !== "complete" && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-1 sm:gap-2 ${step.id === currentStep ? "t-gold" : step.completed ? "text-[var(--status-green)]" : "t-muted"}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border ${step.id === currentStep ? "border-[#C5A55A] bg-gold-subtle" : step.completed ? "border-green-400/50 bg-[var(--status-green)]/10" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"}`}>
                    {step.completed ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="hidden lg:block text-[10px]">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 lg:w-16 h-px mx-1 sm:mx-2 ${step.completed ? "bg-[var(--status-green)]/30" : "bg-[var(--glass-bg)]"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[var(--glass-bg)]">
            <div className="h-full rounded-full bg-gradient-to-l from-[#C5A55A] to-[#E8D5A3] transition-all duration-500" style={{ width: `${((completedSteps.length) / steps.length) * 100}%` }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">

          {currentStep === "personal" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <User size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{t("kyc.personalInfo")}</h3>
              </div>
              <div className="bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Info size={12} className="text-[var(--status-blue)] flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-tertiary">{t("kyc.absherMatch")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={t("kyc.fullName")} placeholder={t("kyc.fullNamePlaceholder")} icon={User} field="fullName" />
                <InputField label={t("kyc.idNumber")} placeholder="1XXXXXXXXX" icon={Hash} field="idNumber" />
                <InputField label={t("kyc.phone")} placeholder="+966 5X XXX XXXX" icon={Phone} field="phone" />
                <InputField label={t("kyc.email")} placeholder="email@example.com" icon={Mail} field="email" type="email" />
                <InputField label={t("kyc.dob")} placeholder="YYYY-MM-DD" icon={Calendar} field="dob" type="date" />
                <InputField label={t("kyc.nationality")} placeholder={t("kyc.nationalityPlaceholder")} icon={Globe} field="nationality" />
                <InputField label={t("kyc.city")} placeholder={t("kyc.cityPlaceholder")} icon={MapPin} field="city" />
                <InputField label={t("kyc.address")} placeholder={t("kyc.addressPlaceholder")} icon={MapPin} field="address" />
              </div>
            </div>
          )}

          {currentStep === "business" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Building2 size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{t("kyc.businessInfo")}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={t("kyc.companyNameField")} placeholder={t("kyc.companyNamePlaceholder")} icon={Building2} field="companyName" />
                <InputField label={t("kyc.crNumberField")} placeholder="XXXXXXXXXX" icon={Hash} field="crNumber" />
                <div>
                  <label className="text-[11px] t-tertiary mb-1.5 block font-medium">{t("kyc.businessType")}</label>
                  <select value={formData.businessType} onChange={(e) => updateField("businessType", e.target.value)} className="w-full bg-[var(--modal-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm t-secondary focus:outline-none focus:border-[var(--gold-border)] transition-colors">
                    <option value="">{t("kyc.selectBusinessType")}</option>
                    <option value="food_beverage">{t("kyc.foodBeverage")}</option>
                    <option value="retail">{t("kyc.retail")}</option>
                    <option value="tech">{t("kyc.tech")}</option>
                    <option value="realestate">{t("kyc.realEstate")}</option>
                    <option value="entertainment">{t("kyc.entertainment")}</option>
                    <option value="health">{t("kyc.health")}</option>
                    <option value="fashion">{t("kyc.fashion")}</option>
                    <option value="auto">{t("kyc.automotive")}</option>
                    <option value="education">{t("kyc.education")}</option>
                    <option value="other">{t("kyc.other")}</option>
                  </select>
                </div>
                <InputField label={t("kyc.founded")} placeholder="2020" icon={Calendar} field="founded" />
                <InputField label={t("kyc.vatNumber")} placeholder="3XXXXXXXXXXXXX003" icon={Hash} field="vatNumber" />
                <InputField label={t("kyc.nationalAddress")} placeholder={t("kyc.nationalAddressPlaceholder")} icon={MapPin} field="nationalAddress" optional={true} />
                <InputField label={t("kyc.employees")} placeholder="10-50" icon={User} field="employees" />
                <InputField label={t("kyc.website")} placeholder="www.example.com" icon={Globe} field="website" />
              </div>
            </div>
          )}

          {currentStep === "bank" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <CreditCard size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{t("kyc.bankAccount")}</h3>
              </div>
              <div className="bg-gold-subtle border border-[var(--gold-border)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-gold/70">{t("kyc.bankEncryption")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={t("kyc.bankName")} placeholder={t("kyc.bankNamePlaceholder")} icon={Building2} field="bankName" />
                <InputField label={t("kyc.iban")} placeholder="SA XXXX XXXX XXXX XXXX XXXX" icon={Hash} field="iban" />
                <InputField label={t("kyc.accountHolder")} placeholder={t("kyc.accountHolderPlaceholder")} icon={User} field="accountHolder" />
                <InputField label={t("kyc.accountNumber")} placeholder="XXXXXXXXXXXX" icon={Hash} field="accountNumber" />
              </div>
              <div className="mt-4 bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3">
                <p className="text-[10px] sm:text-xs t-tertiary">{t("kyc.bankNote")}</p>
              </div>
            </div>
          )}

          {currentStep === "documents" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{t("kyc.documents")}</h3>
              </div>
              <div className="bg-[var(--status-red)]/5 border border-[var(--status-red)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FileWarning size={12} className="text-[var(--status-red)] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs t-tertiary">{t("kyc.documentsNote")}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { id: "national_id", label: t("kyc.docNationalId"), desc: t("kyc.docNationalIdDesc"), required: true },
                  { id: "cr", label: t("kyc.docCR"), desc: t("kyc.docCRDesc"), required: true },
                  { id: "vat_cert", label: t("kyc.docVAT"), desc: t("kyc.docVATDesc"), required: true },
                  { id: "auth_letter", label: t("kyc.docAuthLetter"), desc: t("kyc.docAuthLetterDesc"), required: true },
                  { id: "national_address", label: t("kyc.docNationalAddress"), desc: t("kyc.docNationalAddressDesc"), required: false },
                  { id: "bank_letter", label: t("kyc.docBankLetter"), desc: t("kyc.docBankLetterDesc"), required: false },
                  { id: "company_profile", label: t("kyc.docCompanyProfile"), desc: t("kyc.docCompanyProfileDesc"), required: true },
                  { id: "product_catalog", label: t("kyc.docProductCatalog"), desc: t("kyc.docProductCatalogDesc"), required: true },
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
                        <p className="text-[9px] t-muted mt-0.5">{doc.desc}</p>
                      </div>
                      {doc.required && !uploadedDocs[doc.id] && (
                        <span className="text-[8px] sm:text-[9px] text-[var(--status-red)] bg-[var(--status-red)]/10 px-1.5 py-0.5 rounded flex-shrink-0">{t("kyc.required")}</span>
                      )}
                      {!doc.required && !uploadedDocs[doc.id] && (
                        <span className="text-[8px] sm:text-[9px] t-muted bg-[var(--glass-bg)] px-1.5 py-0.5 rounded flex-shrink-0 border border-[var(--glass-border)]">{t("kyc.optional")}</span>
                      )}
                    </div>
                    <button onClick={() => handleUpload(doc.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] sm:text-xs transition-colors flex-shrink-0 self-end sm:self-auto ${uploadedDocs[doc.id] ? "bg-[var(--status-green)]/10 text-[var(--status-green)]" : "bg-gold-subtle t-gold hover:bg-[#C5A55A]/20"}`}>
                      {uploadedDocs[doc.id] ? (<><CheckCircle2 size={12} /> {t("kyc.uploaded")}</>) : (<><Upload size={12} /> {t("kyc.uploadFile")}</>)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === "declaration" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Gavel size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{t("kyc.legalDeclaration")}</h3>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-red)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-[var(--status-red)]/70 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-red)]/70">{t("kyc.section1Title")}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p>{t("kyc.section1Intro")}</p>
                  <p><strong>1.</strong> {t("kyc.clause1")}</p>
                  <p><strong>2.</strong> {t("kyc.clause2")}</p>
                  <p><strong>3.</strong> {t("kyc.clause3")}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--gold-border)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Scale size={14} className="t-gold flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-gold">{t("kyc.section2Title")}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>4.</strong> {t("kyc.clause4")}</p>
                  <p><strong>5.</strong> {t("kyc.clause5")}</p>
                  <p><strong>6.</strong> {t("kyc.clause6")}</p>
                  <p><strong>7.</strong> {t("kyc.clause7")}</p>
                  <p><strong>8.</strong> {t("kyc.clause8")}</p>
                  <p><strong>9.</strong> {t("kyc.clause9")}</p>
                  <p><strong>10.</strong> {t("kyc.clause10")}</p>
                  <p><strong>11.</strong> {t("kyc.clause11")}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-purple-400/10">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck size={14} className="text-purple-400 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-purple-400">{t("kyc.section3Title")}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>12.</strong> {t("kyc.clause12")}</p>
                  <p><strong>13.</strong> {t("kyc.clause13")}</p>
                  <p><strong>14.</strong> {t("kyc.clause14")}</p>
                  <p><strong>15.</strong> {t("kyc.clause15")}</p>
                  <p><strong>16.</strong> {t("kyc.clause16")}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-blue)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={14} className="text-[var(--status-blue)] flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-blue)]">{t("kyc.section4Title")}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>17.</strong> {t("kyc.clause17")}</p>
                  <p><strong>18.</strong> {t("kyc.clause18")}</p>
                  <p><strong>19.</strong> {t("kyc.clause19")}</p>
                  <p><strong>20.</strong> {t("kyc.clause20")}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="t-tertiary flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-secondary">{t("kyc.section5Title")}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>21.</strong> {t("kyc.clause21")}</p>
                  <p><strong>22.</strong> {t("kyc.clause22")}</p>
                  <p><strong>23.</strong> {t("kyc.clause23")}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <label className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-gold-subtle border-2 border-[var(--gold-border)]/30 cursor-pointer hover:border-[var(--gold-border)] transition-all">
                  <input type="checkbox" checked={agreedAll} onChange={(e) => {
                    setAgreedAll(e.target.checked);
                    setAgreedTerms(e.target.checked);
                    setAgreedPrivacy(e.target.checked);
                    setAgreedIP(e.target.checked);
                    setAgreedPenalty(e.target.checked);
                  }} className="mt-0.5 accent-[#C5A55A] w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base t-gold font-bold mb-1">{t("kyc.agreeAll")}</p>
                    <p className="text-[10px] sm:text-xs t-tertiary leading-relaxed">
                      {isRTL
                        ? "بالموافقة على هذا الإقرار، أؤكد اطلاعي الكامل على جميع الشروط والأحكام وسياسة الخصوصية وحقوق الملكية الفكرية وجدول المخالفات والجزاءات المنصوص عليها أعلاه، وأوافق على الالتزام بها جميعاً."
                        : "By agreeing, I confirm that I have fully read and understood all terms & conditions, privacy policy, intellectual property rights, and the violations & penalties schedule stated above, and I agree to comply with all of them."}
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-[var(--glass-bg)] rounded-xl p-3 sm:p-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs t-tertiary font-medium">{t("kyc.digitalSignature")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-xs t-muted">
                  <p>{t("kyc.fullName")}: <span className="t-secondary">{formData.fullName || "—"}</span></p>
                  <p>{t("kyc.idNumber")}: <span className="t-secondary">{formData.idNumber || "—"}</span></p>
                  <p>{t("kyc.phone")}: <span className="t-secondary">{formData.phone || "—"}</span></p>
                  <p>{t("common.date")}: <span className="t-secondary">{new Date().toLocaleDateString("ar-SA")}</span></p>
                  <p>IP: <span className="t-secondary font-['Inter']">{t("kyc.autoRecorded")}</span></p>
                  <p>{t("kyc.companyNameField")}: <span className="t-secondary">{formData.companyName || "—"}</span></p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="text-center py-6 sm:py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <CheckCircle2 size={56} className="mx-auto text-[var(--status-green)] mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold t-primary mb-2">{t("kyc.verifiedTitle")}</h3>
              <p className="text-xs sm:text-sm t-tertiary mb-1">{t("kyc.verifiedDesc")}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Award size={16} className="t-gold" />
                <span className="text-sm t-gold font-bold">{t("kyc.verifiedTrader")}</span>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] max-w-sm mx-auto">
                <p className="text-[10px] sm:text-xs t-muted">{t("kyc.verifiedNote")}</p>
              </div>
              <button onClick={() => navigate("/expos")} className="inline-block mt-6 btn-gold px-6 py-3 rounded-xl text-sm font-bold">
                {t("kyc.browseExposNow")}
              </button>
            </div>
          )}

          {currentStep !== "complete" && (
            <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[var(--glass-border)]">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-2 text-xs t-tertiary hover:t-secondary disabled:opacity-20 transition-colors">
                {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                {t("kyc.previous")}
              </button>
              <button onClick={handleNext} disabled={currentStep === "declaration" && !allAgreed} className="btn-gold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 disabled:opacity-30 font-bold">
                {currentIndex === steps.length - 1 ? t("kyc.confirmAndComplete") : t("kyc.saveAndNext")}
                {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
