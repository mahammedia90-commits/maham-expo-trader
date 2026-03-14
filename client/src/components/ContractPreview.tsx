/**
 * ContractPreview — Electronic Contract Preview Component
 * Shows full contract before payment with all legal terms
 * Allows trader to review, accept, and download as PDF
 * Maham Services & Information Technology Company
 */
import { useState, useRef } from "react";
import {
  FileText, Download, CheckCircle2, Shield, Building2, Calendar,
  MapPin, CreditCard, AlertTriangle, Phone, Mail, Globe, Stamp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, type KYCData } from "@/contexts/AuthContext";
import jsPDF from "jspdf";

interface ContractPreviewProps {
  boothCode: string;
  boothType: string;
  boothSize: string;
  boothSizeM2: number;
  boothZone: string;
  boothPrice: number;
  depositAmount: number;
  expoNameAr: string;
  expoNameEn: string;
  expoLocation: string;
  expoDate: string;
  onAccept: () => void;
  onBack: () => void;
}

export default function ContractPreview({
  boothCode, boothType, boothSize, boothSizeM2, boothPrice,
  depositAmount, expoNameAr, expoNameEn, expoLocation, expoDate,
  boothZone, onAccept, onBack
}: ContractPreviewProps) {
  const { t, lang, isRTL } = useLanguage();
  const { trader, kycData } = useAuth();
  const [contractAccepted, setContractAccepted] = useState(false);
  const [antiCircumventionAccepted, setAntiCircumventionAccepted] = useState(false);
  const [cancellationAccepted, setCancellationAccepted] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const isAr = ["ar", "fa"].includes(lang);
  const today = new Date();
  const contractDate = today.toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  const contractNumber = `CT-${today.getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
  const vatAmount = boothPrice * 0.15;
  const priceBeforeVat = boothPrice - vatAmount;
  const platformFee = boothPrice * 0.10;
  const remainingAfterDeposit = boothPrice - depositAmount;

  const traderName = kycData?.fullName || trader?.name || "—";
  const companyName = kycData?.companyName || trader?.companyName || "—";
  const crNumber = kycData?.crNumber || "—";
  const traderPhone = kycData?.phone || trader?.phone || "—";
  const traderEmail = kycData?.email || "—";
  const traderCity = kycData?.city || trader?.region || "—";

  const allAccepted = contractAccepted && antiCircumventionAccepted && cancellationAccepted;

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Simple PDF generation with basic text (Arabic support limited in jsPDF)
    doc.setFontSize(18);
    doc.text("MAHAM EXPO - Exhibition Booth Contract", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Contract No: ${contractNumber}`, 105, 30, { align: "center" });
    doc.text(`Date: ${today.toISOString().split("T")[0]}`, 105, 36, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Party 1 (Platform):", 20, 50);
    doc.setFontSize(10);
    doc.text("Maham Services & Information Technology Company", 20, 57);
    doc.text("CR: 1010XXXXXX | Riyadh, Saudi Arabia", 20, 63);
    doc.text("Phone: +966535555900 | Email: rent@mahamexpo.sa", 20, 69);

    doc.setFontSize(12);
    doc.text("Party 2 (Exhibitor):", 20, 82);
    doc.setFontSize(10);
    doc.text(`Name: ${traderName}`, 20, 89);
    doc.text(`Company: ${companyName}`, 20, 95);
    doc.text(`CR: ${crNumber}`, 20, 101);
    doc.text(`Phone: ${traderPhone} | Email: ${traderEmail}`, 20, 107);

    doc.setFontSize(12);
    doc.text("Booth Details:", 20, 120);
    doc.setFontSize(10);
    doc.text(`Exhibition: ${expoNameEn}`, 20, 127);
    doc.text(`Booth: ${boothCode} | Zone: ${boothZone} | Type: ${boothType}`, 20, 133);
    doc.text(`Size: ${boothSizeM2} sqm (${boothSize}) | Location: ${expoLocation}`, 20, 139);
    doc.text(`Date: ${expoDate}`, 20, 145);

    doc.setFontSize(12);
    doc.text("Financial Terms:", 20, 158);
    doc.setFontSize(10);
    doc.text(`Booth Price (excl. VAT): ${priceBeforeVat.toLocaleString()} SAR`, 20, 165);
    doc.text(`VAT (15%): ${vatAmount.toLocaleString()} SAR`, 20, 171);
    doc.text(`Total: ${boothPrice.toLocaleString()} SAR`, 20, 177);
    doc.text(`Non-refundable Deposit (5%): ${depositAmount.toLocaleString()} SAR`, 20, 183);
    doc.text(`Remaining: ${remainingAfterDeposit.toLocaleString()} SAR`, 20, 189);

    doc.setFontSize(12);
    doc.text("Terms & Conditions:", 20, 202);
    doc.setFontSize(9);
    const terms = [
      "1. The deposit is non-refundable and confirms the booth reservation.",
      "2. Remaining balance must be paid 30 days before the exhibition.",
      "3. Cancellation after contract signing forfeits the deposit.",
      "4. Cancellation 15+ days before: 50% refund of remaining. Less than 15 days: no refund.",
      "5. Anti-Circumvention: Direct dealing with organizer/investor outside Maham Expo",
      "   after booking creation requires full platform commission payment.",
      "6. The exhibitor must comply with all exhibition regulations and safety standards.",
      "7. Maham Expo reserves the right to reassign booths for operational reasons.",
      "8. This contract is governed by Saudi Arabian law.",
    ];
    terms.forEach((term, i) => {
      doc.text(term, 20, 209 + (i * 6));
    });

    doc.setFontSize(10);
    doc.text("Signatures:", 20, 270);
    doc.text("Platform Representative: _______________", 20, 278);
    doc.text("Exhibitor: _______________", 120, 278);

    doc.save(`Maham_Expo_Contract_${contractNumber}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Contract Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#C5A55A]" />
          <h3 className="text-sm font-bold text-[#E8D5A3]">
            {isAr ? "عقد المشاركة الإلكتروني" : "Electronic Exhibition Contract"}
          </h3>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] t-secondary hover:text-[#C5A55A] transition-colors"
          style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <Download size={12} />
          {isAr ? "تحميل PDF" : "Download PDF"}
        </button>
      </div>

      {/* Contract Document */}
      <div ref={contractRef} className="glass-card rounded-2xl p-5 space-y-5" style={{ border: "1px solid rgba(197,165,90,0.2)" }}>
        
        {/* Contract Title */}
        <div className="text-center pb-4" style={{ borderBottom: "2px solid rgba(197,165,90,0.2)" }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stamp size={20} className="text-[#C5A55A]" />
            <span className="text-xs font-bold text-[#C5A55A] tracking-wider uppercase font-['Inter']">MAHAM EXPO</span>
          </div>
          <h4 className="text-base font-bold text-[#E8D5A3]">
            {isAr ? "عقد حجز جناح معرض" : "Exhibition Booth Reservation Contract"}
          </h4>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-[10px] t-tertiary font-['Inter']">
              {isAr ? "رقم العقد" : "Contract No"}: {contractNumber}
            </span>
            <span className="text-[10px] t-tertiary">
              {isAr ? "التاريخ" : "Date"}: {contractDate}
            </span>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Party 1 - Platform */}
          <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(197,165,90,0.03)", border: "1px solid rgba(197,165,90,0.1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={12} className="text-[#C5A55A]" />
              <span className="text-[10px] font-bold text-[#C5A55A]">
                {isAr ? "الطرف الأول (المنصة)" : "Party 1 (Platform)"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] t-secondary font-semibold">
                {isAr ? "شركة محام للخدمات وتقنية المعلومات" : "Maham Services & IT Company"}
              </p>
              <p className="text-[9px] t-tertiary">
                {isAr ? "سجل تجاري: 1010XXXXXX" : "CR: 1010XXXXXX"}
              </p>
              <div className="flex items-center gap-1">
                <Phone size={8} className="t-muted" />
                <span className="text-[9px] t-tertiary font-['Inter']">+966535555900</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={8} className="t-muted" />
                <span className="text-[9px] t-tertiary font-['Inter']">rent@mahamexpo.sa</span>
              </div>
            </div>
          </div>

          {/* Party 2 - Trader */}
          <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(74,222,128,0.03)", border: "1px solid rgba(74,222,128,0.1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={12} className="text-green-400" />
              <span className="text-[10px] font-bold text-green-400">
                {isAr ? "الطرف الثاني (العارض)" : "Party 2 (Exhibitor)"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] t-secondary font-semibold">{traderName}</p>
              <p className="text-[9px] t-tertiary">{companyName}</p>
              <p className="text-[9px] t-tertiary">
                {isAr ? "سجل تجاري" : "CR"}: {crNumber}
              </p>
              <div className="flex items-center gap-1">
                <Phone size={8} className="t-muted" />
                <span className="text-[9px] t-tertiary font-['Inter']">{traderPhone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={8} className="t-muted" />
                <span className="text-[9px] t-tertiary font-['Inter']">{traderEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booth Details */}
        <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={12} className="text-[#C5A55A]" />
            <span className="text-[10px] font-bold t-secondary">
              {isAr ? "تفاصيل الجناح" : "Booth Details"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: isAr ? "المعرض" : "Exhibition", value: isAr ? expoNameAr : expoNameEn },
              { label: isAr ? "رقم الجناح" : "Booth No.", value: boothCode },
              { label: isAr ? "المنطقة" : "Zone", value: boothZone },
              { label: isAr ? "النوع" : "Type", value: boothType },
              { label: isAr ? "المساحة" : "Area", value: `${boothSizeM2} m² (${boothSize})` },
              { label: isAr ? "الموقع" : "Location", value: expoLocation },
              { label: isAr ? "التاريخ" : "Date", value: expoDate },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-[var(--glass-border)]">
                <span className="text-[9px] t-tertiary">{item.label}</span>
                <span className="text-[9px] t-secondary font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Terms */}
        <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={12} className="text-[#C5A55A]" />
            <span className="text-[10px] font-bold t-secondary">
              {isAr ? "البنود المالية" : "Financial Terms"}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-[var(--glass-border)]">
              <span className="text-[9px] t-tertiary">{isAr ? "سعر الجناح (قبل الضريبة)" : "Booth Price (excl. VAT)"}</span>
              <span className="text-[9px] t-secondary font-['Inter']">{priceBeforeVat.toLocaleString()} {t("common.sar")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--glass-border)]">
              <span className="text-[9px] t-tertiary">{isAr ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
              <span className="text-[9px] t-secondary font-['Inter']">{vatAmount.toLocaleString()} {t("common.sar")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--glass-border)]">
              <span className="text-[9px] t-secondary font-bold">{isAr ? "الإجمالي شامل الضريبة" : "Total (incl. VAT)"}</span>
              <span className="text-[9px] text-[#C5A55A] font-bold font-['Inter']">{boothPrice.toLocaleString()} {t("common.sar")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--glass-border)]">
              <span className="text-[9px] t-tertiary">{isAr ? "العربون غير المسترد (5%)" : "Non-refundable Deposit (5%)"}</span>
              <span className="text-[9px] text-green-400 font-bold font-['Inter']">{depositAmount.toLocaleString()} {t("common.sar")}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[9px] t-tertiary">{isAr ? "المبلغ المتبقي" : "Remaining Balance"}</span>
              <span className="text-[9px] t-secondary font-['Inter']">{remainingAfterDeposit.toLocaleString()} {t("common.sar")}</span>
            </div>
          </div>
          <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)" }}>
            <p className="text-[8px] t-muted">
              {isAr 
                ? "• يُدفع العربون فوراً لتأكيد الحجز. المبلغ المتبقي يُستحق قبل 30 يوماً من بداية المعرض."
                : "• Deposit is due immediately to confirm reservation. Remaining balance is due 30 days before exhibition start."}
            </p>
          </div>
        </div>

        {/* Contract Terms */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-[#C5A55A]" />
            <span className="text-[10px] font-bold t-secondary">
              {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
            </span>
          </div>
          
          <div className="space-y-2 text-[9px] t-tertiary leading-relaxed">
            <p><strong className="t-secondary">{isAr ? "1. تأكيد الحجز:" : "1. Booking Confirmation:"}</strong> {isAr ? "يُعتبر الحجز مؤكداً فقط بعد دفع العربون غير المسترد والموافقة على هذا العقد." : "Booking is confirmed only after payment of the non-refundable deposit and acceptance of this contract."}</p>
            
            <p><strong className="t-secondary">{isAr ? "2. الدفع:" : "2. Payment:"}</strong> {isAr ? "يُدفع العربون فوراً عند الحجز. المبلغ المتبقي يُستحق قبل 30 يوماً من بداية المعرض. التأخر في السداد يمنح المنصة حق إلغاء الحجز." : "Deposit is due immediately upon booking. Remaining balance is due 30 days before exhibition start. Late payment grants the platform the right to cancel the reservation."}</p>
            
            <p><strong className="t-secondary">{isAr ? "3. الإلغاء والاسترداد:" : "3. Cancellation & Refund:"}</strong> {isAr ? "العربون غير مسترد. الإلغاء قبل 15 يوماً أو أكثر من المعرض: استرداد 50% من المبلغ المتبقي المدفوع. الإلغاء قبل أقل من 15 يوماً: لا يوجد استرداد." : "Deposit is non-refundable. Cancellation 15+ days before exhibition: 50% refund of remaining paid amount. Less than 15 days: no refund."}</p>
            
            <p><strong className="t-secondary">{isAr ? "4. الالتزام:" : "4. Compliance:"}</strong> {isAr ? "يلتزم العارض بجميع أنظمة ولوائح المعرض ومعايير السلامة والأمان المعتمدة." : "The exhibitor must comply with all exhibition regulations and approved safety standards."}</p>
            
            <p><strong className="t-secondary">{isAr ? "5. إعادة التخصيص:" : "5. Reassignment:"}</strong> {isAr ? "تحتفظ Maham Expo بحق إعادة تخصيص الأجنحة لأسباب تشغيلية مع إشعار مسبق." : "Maham Expo reserves the right to reassign booths for operational reasons with prior notice."}</p>
            
            <p><strong className="t-secondary">{isAr ? "6. الخدمات التشغيلية:" : "6. Operational Services:"}</strong> {isAr ? "الخدمات التشغيلية الإضافية (تصميم، كهرباء، إنترنت، لوجستيات) تُطلب وتُدفع بشكل منفصل عبر المنصة." : "Additional operational services (design, electricity, internet, logistics) are ordered and paid separately through the platform."}</p>
            
            <p><strong className="t-secondary">{isAr ? "7. القانون الحاكم:" : "7. Governing Law:"}</strong> {isAr ? "يخضع هذا العقد لأنظمة المملكة العربية السعودية." : "This contract is governed by the laws of the Kingdom of Saudi Arabia."}</p>
          </div>
        </div>

        {/* Anti-Circumvention Clause */}
        <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-[10px] font-bold text-red-400">
              {isAr ? "بند عدم الالتفاف (إلزامي)" : "Anti-Circumvention Clause (Mandatory)"}
            </span>
          </div>
          <p className="text-[9px] t-tertiary leading-relaxed">
            {isAr
              ? "أي تعامل مباشر مع المنظم أو المستثمر خارج منصة Maham Expo بعد إنشاء طلب الحجز أو تقديم العارض من خلال المنصة يُلزم بدفع عمولة المنصة كاملة. يُعد أي تواصل مباشر بين العارض والمنظم/المستثمر خارج المنصة بعد بدء عملية الحجز انتهاكاً لهذا البند ويترتب عليه التزامات مالية وقانونية."
              : "Any direct dealing with the organizer or investor outside the Maham Expo platform after creating a booking request or submitting the exhibitor through the platform requires full payment of the platform commission. Any direct communication between the exhibitor and the organizer/investor outside the platform after initiating the booking process constitutes a violation of this clause and entails financial and legal obligations."}
          </p>
        </div>

        {/* Signatures Area */}
        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: "2px solid rgba(197,165,90,0.2)" }}>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <p className="text-[9px] t-tertiary mb-6">{isAr ? "توقيع الطرف الأول (المنصة)" : "Party 1 Signature (Platform)"}</p>
            <div className="h-8 flex items-center justify-center">
              <span className="text-[10px] text-[#C5A55A] font-bold font-['Inter']">MAHAM EXPO</span>
            </div>
            <p className="text-[8px] t-muted mt-2">{isAr ? "توقيع إلكتروني معتمد" : "Certified Digital Signature"}</p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <p className="text-[9px] t-tertiary mb-6">{isAr ? "توقيع الطرف الثاني (العارض)" : "Party 2 Signature (Exhibitor)"}</p>
            <div className="h-8 flex items-center justify-center">
              {contractAccepted ? (
                <span className="text-[10px] text-green-400 font-bold">{traderName}</span>
              ) : (
                <span className="text-[9px] t-muted italic">{isAr ? "بانتظار الموافقة..." : "Pending approval..."}</span>
              )}
            </div>
            <p className="text-[8px] t-muted mt-2">{isAr ? "توقيع إلكتروني" : "Digital Signature"}</p>
          </div>
        </div>
      </div>

      {/* Acceptance Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-xl transition-colors" style={{ backgroundColor: contractAccepted ? "rgba(74,222,128,0.03)" : "var(--glass-bg)", border: `1px solid ${contractAccepted ? "rgba(74,222,128,0.15)" : "var(--glass-border)"}` }}>
          <input
            type="checkbox"
            checked={contractAccepted}
            onChange={(e) => setContractAccepted(e.target.checked)}
            className="mt-0.5 accent-[var(--gold-accent)] w-4 h-4 rounded shrink-0"
          />
          <span className="text-[10px] t-secondary leading-relaxed">
            {isAr
              ? "أقر بأنني قرأت جميع بنود العقد أعلاه وأوافق عليها بالكامل، وأفهم أن العربون غير مسترد."
              : "I confirm that I have read all contract terms above and agree to them in full, and I understand the deposit is non-refundable."}
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-xl transition-colors" style={{ backgroundColor: antiCircumventionAccepted ? "rgba(74,222,128,0.03)" : "var(--glass-bg)", border: `1px solid ${antiCircumventionAccepted ? "rgba(74,222,128,0.15)" : "var(--glass-border)"}` }}>
          <input
            type="checkbox"
            checked={antiCircumventionAccepted}
            onChange={(e) => setAntiCircumventionAccepted(e.target.checked)}
            className="mt-0.5 accent-[var(--gold-accent)] w-4 h-4 rounded shrink-0"
          />
          <span className="text-[10px] t-secondary leading-relaxed">
            {isAr
              ? "أوافق على بند عدم الالتفاف وأتعهد بعدم التعامل مباشرة مع المنظم أو المستثمر خارج المنصة."
              : "I agree to the anti-circumvention clause and commit not to deal directly with the organizer or investor outside the platform."}
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer select-none p-3 rounded-xl transition-colors" style={{ backgroundColor: cancellationAccepted ? "rgba(74,222,128,0.03)" : "var(--glass-bg)", border: `1px solid ${cancellationAccepted ? "rgba(74,222,128,0.15)" : "var(--glass-border)"}` }}>
          <input
            type="checkbox"
            checked={cancellationAccepted}
            onChange={(e) => setCancellationAccepted(e.target.checked)}
            className="mt-0.5 accent-[var(--gold-accent)] w-4 h-4 rounded shrink-0"
          />
          <span className="text-[10px] t-secondary leading-relaxed">
            {isAr
              ? "أفهم وأوافق على سياسة الإلغاء والاسترداد المذكورة في البند الثالث من العقد."
              : "I understand and agree to the cancellation and refund policy stated in clause 3 of the contract."}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onAccept}
          disabled={!allAccepted}
          className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
            allAccepted ? "btn-gold" : "opacity-40 cursor-not-allowed bg-gray-600"
          }`}
        >
          <CheckCircle2 size={14} />
          {isAr ? "الموافقة على العقد والمتابعة للدفع" : "Accept Contract & Proceed to Payment"}
        </button>

        <button
          onClick={onBack}
          className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors"
        >
          {isAr ? "العودة للخطوة السابقة" : "Go Back"}
        </button>
      </div>
    </div>
  );
}
