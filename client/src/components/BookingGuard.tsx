/**
 * BookingGuard — Modal that blocks booking if KYC not verified
 * Shows clear steps for the trader to complete verification
 */
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowLeft, X } from "lucide-react";

interface BookingGuardProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToKYC: () => void;
}

export default function BookingGuard({ isOpen, onClose, onProceedToKYC }: BookingGuardProps) {
  const { trader } = useAuth();
  const [, navigate] = useLocation();

  if (!isOpen) return null;

  const kycStatus = trader?.kycStatus || "none";
  const docsUploaded = trader?.documentsUploaded || false;
  const accountVerified = trader?.accountVerified || false;

  const steps = [
    { label: "تسجيل الحساب", labelEn: "Account Registration", done: true, icon: CheckCircle2 },
    { label: "رفع المستندات", labelEn: "Upload Documents", done: docsUploaded, icon: FileText },
    { label: "التحقق من الهوية (KYC)", labelEn: "Identity Verification", done: kycStatus === "verified", icon: ShieldCheck },
    { label: "توثيق الحساب", labelEn: "Account Verification", done: accountVerified, icon: CheckCircle2 },
  ];

  const completedSteps = steps.filter(s => s.done).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "var(--modal-overlay)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(251, 191, 36, 0.15)" }}>
              <AlertTriangle size={20} style={{ color: "var(--status-yellow)" }} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>يجب إكمال التوثيق أولاً</h3>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Complete verification to proceed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Message */}
        <div className="rounded-xl p-4 mb-5" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            لإتمام عملية الحجز وتوقيع العقد، يجب أن يكون حسابك <strong style={{ color: "var(--gold-accent)" }}>موثّقاً بالكامل</strong>. 
            هذا يضمن حماية حقوقك وحقوق جميع الأطراف.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>تقدم التوثيق</span>
            <span className="text-xs font-bold" style={{ color: "var(--gold-accent)" }}>{completedSteps}/{steps.length}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-bg)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, var(--gold-accent), var(--gold-light))` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2.5 mb-5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{ background: step.done ? "var(--gold-bg)" : "var(--glass-bg)", border: `1px solid ${step.done ? "var(--gold-border)" : "var(--glass-border)"}` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: step.done ? "var(--gold-accent)" : "var(--glass-bg)", border: step.done ? "none" : "1px solid var(--glass-border)" }}>
                <step.icon size={13} style={{ color: step.done ? "var(--btn-gold-text)" : "var(--text-muted)" }} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium" style={{ color: step.done ? "var(--gold-accent)" : "var(--text-secondary)" }}>
                  {step.label}
                </span>
                <span className="text-[9px] block" style={{ color: "var(--text-muted)" }}>{step.labelEn}</span>
              </div>
              {step.done && <CheckCircle2 size={14} style={{ color: "var(--status-green)" }} />}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
            <ArrowLeft size={14} />
            لاحقاً
          </button>
          <button onClick={() => { onClose(); navigate("/kyc"); }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all btn-gold flex items-center justify-center gap-2">
            <ShieldCheck size={14} />
            إكمال التوثيق
          </button>
        </div>
      </div>
    </div>
  );
}
