/**
 * CRM Pipeline — Lead management and sales pipeline
 * Stages: Lead → Contacted → Interested → Qualified → Sales → Contract → Closed Deal
 * All text uses t() for multi-language support
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Search, Filter, ChevronDown, X, Phone, Mail,
  MessageSquare, Star, Building2, MapPin, Calendar, ArrowRight,
  CheckCircle, Clock, AlertTriangle, Target, TrendingUp,
  DollarSign, FileText, Sparkles, Eye
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  source: string;
  lastContact: string;
  notes: string;
  rating: number;
  city: string;
  interest: string;
}

const STAGES = [
  { id: "lead", color: "#94A3B8", icon: Users },
  { id: "contacted", color: "#60A5FA", icon: Phone },
  { id: "interested", color: "#A78BFA", icon: Star },
  { id: "qualified", color: "#FBBF24", icon: Target },
  { id: "sales", color: "#FB923C", icon: DollarSign },
  { id: "contract", color: "#4ADE80", icon: FileText },
  { id: "closed", color: "#C5A55A", icon: CheckCircle },
];

const DEMO_LEADS: Lead[] = [
  { id: "L-001", name: "أحمد الشمري", company: "شركة النخبة للتجارة", email: "ahmed@elite-trade.sa", phone: "+966 55 123 4567", stage: "qualified", value: 45000, source: "Website", lastContact: "2026-03-12", notes: "مهتم ببوث مميز في معرض الرياض", rating: 4, city: "الرياض", interest: "بوث مميز 6×6" },
  { id: "L-002", name: "فاطمة العلي", company: "مجموعة الفجر", email: "fatima@alfajr.ae", phone: "+971 50 987 6543", stage: "interested", value: 25000, source: "Referral", lastContact: "2026-03-11", notes: "تبحث عن جناح في معرض جدة", rating: 3, city: "دبي", interest: "جناح قياسي" },
  { id: "L-003", name: "محمد القحطاني", company: "تقنيات المستقبل", email: "mohammed@futuretech.sa", phone: "+966 54 456 7890", stage: "sales", value: 75000, source: "Exhibition", lastContact: "2026-03-10", notes: "يريد جزيرة عرض + رعاية ذهبية", rating: 5, city: "الرياض", interest: "جزيرة عرض + رعاية" },
  { id: "L-004", name: "سارة المنصور", company: "دار الأزياء", email: "sara@fashionhouse.sa", phone: "+966 56 789 0123", stage: "lead", value: 15000, source: "Social Media", lastContact: "2026-03-13", notes: "استفسار أولي عن المعارض المتاحة", rating: 2, city: "جدة", interest: "بوث قياسي" },
  { id: "L-005", name: "خالد البلوشي", company: "الخليج للاستيراد", email: "khalid@gulfimport.om", phone: "+968 99 123 456", stage: "contacted", value: 35000, source: "Cold Call", lastContact: "2026-03-09", notes: "تم التواصل - ينتظر عرض الأسعار", rating: 3, city: "مسقط", interest: "بوث مميز" },
  { id: "L-006", name: "نورة الدوسري", company: "حلويات الشرق", email: "noura@sharqsweets.sa", phone: "+966 50 234 5678", stage: "contract", value: 55000, source: "Website", lastContact: "2026-03-08", notes: "تم إرسال العقد - بانتظار التوقيع", rating: 5, city: "الدمام", interest: "بوث مميز + خدمات" },
  { id: "L-007", name: "عبدالله التركي", company: "مصنع الجودة", email: "abdullah@quality.sa", phone: "+966 53 345 6789", stage: "closed", value: 95000, source: "Referral", lastContact: "2026-03-07", notes: "تم إغلاق الصفقة - جزيرة عرض كاملة", rating: 5, city: "الرياض", interest: "جزيرة عرض كاملة" },
  { id: "L-008", name: "ليلى الحربي", company: "ستايل هاوس", email: "layla@stylehouse.sa", phone: "+966 55 678 9012", stage: "lead", value: 12000, source: "Social Media", lastContact: "2026-03-14", notes: "استفسار عبر انستقرام", rating: 1, city: "الرياض", interest: "بوث قياسي" },
  { id: "L-009", name: "يوسف الكندي", company: "تجارة الشرق", email: "yousuf@easttrade.kw", phone: "+965 66 123 456", stage: "interested", value: 40000, source: "Exhibition", lastContact: "2026-03-10", notes: "التقينا في معرض الكويت - مهتم جداً", rating: 4, city: "الكويت", interest: "بوث مميز + رعاية" },
  { id: "L-010", name: "رانيا الشهري", company: "عطور الجزيرة", email: "rania@jazperfumes.sa", phone: "+966 54 890 1234", stage: "qualified", value: 30000, source: "Website", lastContact: "2026-03-11", notes: "مؤهلة - تنتظر موعد الاجتماع", rating: 4, city: "جدة", interest: "بوث مميز" },
];

export default function CRM() {
  const { t, lang, isRTL } = useLanguage();
  const isArabicLike = lang === "ar" || lang === "fa";

  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", company: "", email: "", phone: "", interest: "", notes: "" });

  const stageLabel = (stageId: string) => {
    const map: Record<string, string> = {
      lead: t("crm.lead"), contacted: t("crm.contacted"), interested: t("crm.interested"),
      qualified: t("crm.qualified"), sales: t("crm.sales"), contract: t("crm.contract"), closed: t("crm.closed"),
    };
    return map[stageId] || stageId;
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchStage = filterStage === "all" || l.stage === filterStage;
      const matchSearch = search === "" || l.name.includes(search) || l.company.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
      return matchStage && matchSearch;
    });
  }, [leads, search, filterStage]);

  const pipelineData = useMemo(() => {
    return STAGES.map(s => ({
      ...s,
      label: stageLabel(s.id),
      leads: filtered.filter(l => l.stage === s.id),
      value: filtered.filter(l => l.stage === s.id).reduce((a, l) => a + l.value, 0),
    }));
  }, [filtered, t]);

  const totalValue = leads.reduce((a, l) => a + l.value, 0);
  const closedValue = leads.filter(l => l.stage === "closed").reduce((a, l) => a + l.value, 0);
  const conversionRate = leads.length > 0 ? Math.round((leads.filter(l => l.stage === "closed").length / leads.length) * 100) : 0;

  const moveLead = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, lastContact: new Date().toISOString().split("T")[0] } : l));
    toast.success(isArabicLike ? `تم نقل العميل إلى: ${stageLabel(newStage)}` : `Lead moved to: ${stageLabel(newStage)}`);
    setSelectedLead(null);
  };

  const addLead = () => {
    if (!newLead.name.trim() || !newLead.company.trim()) {
      toast.error(isArabicLike ? "يرجى ملء الاسم والشركة" : "Please fill name and company");
      return;
    }
    const lead: Lead = {
      id: `L-${String(leads.length + 1).padStart(3, "0")}`,
      ...newLead,
      stage: "lead",
      value: 0,
      source: "Manual",
      lastContact: new Date().toISOString().split("T")[0],
      rating: 1,
      city: "—",
    };
    setLeads(prev => [lead, ...prev]);
    setNewLead({ name: "", company: "", email: "", phone: "", interest: "", notes: "" });
    setShowAddForm(false);
    toast.success(isArabicLike ? "تمت إضافة العميل المحتمل" : "Lead added successfully");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("crm.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">CRM Pipeline & Lead Management</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="btn-gold px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs flex items-center gap-1.5">
          <Plus size={13} />
          {t("crm.addLead")}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: t("crm.totalLeads"), value: leads.length.toString(), color: "#C5A55A", icon: Users },
          { label: t("crm.pipelineValue"), value: `${(totalValue / 1000).toFixed(0)}K`, color: "#60A5FA", icon: TrendingUp },
          { label: t("crm.closedDeals"), value: `${(closedValue / 1000).toFixed(0)}K`, color: "#4ADE80", icon: DollarSign },
          { label: t("crm.conversionRate"), value: `${conversionRate}%`, color: "#FBBF24", icon: Target },
        ].map((k, i) => (
          <div key={i} className="glass-card rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-2 mb-1">
              <k.icon size={13} style={{ color: k.color }} />
              <p className="text-[9px] t-muted">{k.label}</p>
            </div>
            <p className="text-lg font-bold font-['Inter']" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Search + View Toggle */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 t-muted ${isRTL ? 'right-3' : 'left-3'}`} />
          <input type="text" placeholder={t("crm.searchLeads")} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full glass-card rounded-xl py-2.5 text-xs t-primary placeholder:t-muted gold-focus ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`} style={{ backgroundColor: "var(--input-bg)" }} />
        </div>
        <button onClick={() => setViewMode(viewMode === "pipeline" ? "list" : "pipeline")}
          className="glass-card px-3 py-2 rounded-xl text-[10px] t-secondary flex items-center gap-1">
          {viewMode === "pipeline" ? "☰" : "⊞"} {viewMode === "pipeline" ? (isArabicLike ? "قائمة" : "List") : (isArabicLike ? "أنبوب" : "Pipeline")}
        </button>
      </div>

      {/* Pipeline View */}
      {viewMode === "pipeline" && (
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-3" style={{ minWidth: `${STAGES.length * 220}px` }}>
            {pipelineData.map((stage) => (
              <div key={stage.id} className="flex-1" style={{ minWidth: 200 }}>
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-[10px] font-medium t-secondary">{stage.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full t-muted" style={{ backgroundColor: "var(--glass-bg)" }}>{stage.leads.length}</span>
                  </div>
                  <span className="text-[9px] t-muted font-['Inter']">{(stage.value / 1000).toFixed(0)}K</span>
                </div>
                {/* Cards */}
                <div className="space-y-2">
                  {stage.leads.map((lead) => (
                    <motion.div key={lead.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSelectedLead(lead)}
                      className="glass-card rounded-xl p-2.5 cursor-pointer hover:border-[var(--gold-border)] transition-all"
                      style={{ border: "1px solid var(--glass-border)" }}>
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-[11px] font-medium t-primary truncate">{lead.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={7} className={i < lead.rating ? "text-[var(--gold-accent)]" : "t-muted"} fill={i < lead.rating ? "var(--gold-accent)" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[9px] t-muted truncate">{lead.company}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] t-gold font-['Inter']">{lead.value > 0 ? `${lead.value.toLocaleString()} SAR` : "—"}</span>
                        <span className="text-[8px] t-muted font-['Inter']">{lead.lastContact}</span>
                      </div>
                    </motion.div>
                  ))}
                  {stage.leads.length === 0 && (
                    <div className="glass-card rounded-xl p-4 text-center opacity-40">
                      <p className="text-[9px] t-muted">{isArabicLike ? "لا يوجد عملاء" : "No leads"}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {filtered.map((lead, i) => {
            const stage = STAGES.find(s => s.id === lead.stage)!;
            return (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedLead(lead)}
                className="glass-card rounded-xl p-3 cursor-pointer hover:border-[var(--gold-border)] transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${stage.color}15` }}>
                  <stage.icon size={14} style={{ color: stage.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium t-primary truncate">{lead.name}</p>
                    <span className="px-1.5 py-0.5 rounded-full text-[8px]" style={{ backgroundColor: `${stage.color}12`, color: stage.color }}>{stageLabel(lead.stage)}</span>
                  </div>
                  <p className="text-[9px] t-muted truncate">{lead.company} · {lead.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] t-gold font-['Inter'] font-medium">{lead.value > 0 ? `${lead.value.toLocaleString()}` : "—"}</p>
                  <p className="text-[8px] t-muted font-['Inter']">{lead.lastContact}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setSelectedLead(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[88vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold t-primary">{selectedLead.name}</h3>
                    <p className="text-[10px] t-muted">{selectedLead.company}</p>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Mail, label: t("help.email"), value: selectedLead.email },
                    { icon: Phone, label: t("help.phone"), value: selectedLead.phone },
                    { icon: MapPin, label: isArabicLike ? "المدينة" : "City", value: selectedLead.city },
                    { icon: Calendar, label: isArabicLike ? "آخر تواصل" : "Last Contact", value: selectedLead.lastContact },
                  ].map((c, i) => (
                    <div key={i} className="p-2.5 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <c.icon size={10} className="t-muted" />
                        <p className="text-[8px] t-muted">{c.label}</p>
                      </div>
                      <p className="text-[10px] t-secondary truncate">{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Stage + Value */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[8px] t-muted mb-1">{t("crm.stage")}</p>
                    <span className="px-2 py-1 rounded-full text-[10px]" style={{ backgroundColor: `${STAGES.find(s => s.id === selectedLead.stage)?.color}15`, color: STAGES.find(s => s.id === selectedLead.stage)?.color }}>
                      {stageLabel(selectedLead.stage)}
                    </span>
                  </div>
                  <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[8px] t-muted mb-1">{t("crm.dealValue")}</p>
                    <p className="text-sm font-bold t-gold font-['Inter']">{selectedLead.value.toLocaleString()} {t("common.sar")}</p>
                  </div>
                </div>

                {/* Interest + Notes */}
                <div className="p-3 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                  <p className="text-[9px] t-muted mb-1">{isArabicLike ? "الاهتمام" : "Interest"}</p>
                  <p className="text-[11px] t-secondary">{selectedLead.interest}</p>
                </div>
                {selectedLead.notes && (
                  <div className="p-3 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-[9px] t-muted mb-1">{isArabicLike ? "ملاحظات" : "Notes"}</p>
                    <p className="text-[11px] t-secondary">{selectedLead.notes}</p>
                  </div>
                )}

                {/* Move Stage */}
                {selectedLead.stage !== "closed" && (
                  <div>
                    <p className="text-[9px] t-muted mb-2">{t("crm.moveToStage")}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {STAGES.filter(s => s.id !== selectedLead.stage).map(s => (
                        <button key={s.id} onClick={() => moveLead(selectedLead.id, s.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[9px] transition-all hover:opacity-80"
                          style={{ backgroundColor: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25` }}>
                          {stageLabel(s.id)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <a href={`tel:${selectedLead.phone}`} className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary flex items-center justify-center gap-1.5">
                    <Phone size={13} /> {t("help.phone")}
                  </a>
                  <a href={`mailto:${selectedLead.email}`} className="flex-1 glass-card py-2.5 rounded-xl text-xs t-secondary flex items-center justify-center gap-1.5">
                    <Mail size={13} /> {t("help.email")}
                  </a>
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\s/g, "").replace("+", "")}`} target="_blank" rel="noopener"
                    className="flex-1 btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                    <MessageSquare size={13} /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setShowAddForm(false)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[460px] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold t-primary">{t("crm.addLead")}</h3>
                  <button onClick={() => setShowAddForm(false)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>
                {[
                  { key: "name", label: isArabicLike ? "الاسم *" : "Name *", placeholder: isArabicLike ? "اسم العميل المحتمل" : "Lead name" },
                  { key: "company", label: isArabicLike ? "الشركة *" : "Company *", placeholder: isArabicLike ? "اسم الشركة" : "Company name" },
                  { key: "email", label: isArabicLike ? "البريد الإلكتروني" : "Email", placeholder: "email@example.com" },
                  { key: "phone", label: isArabicLike ? "الهاتف" : "Phone", placeholder: "+966 5X XXX XXXX" },
                  { key: "interest", label: isArabicLike ? "الاهتمام" : "Interest", placeholder: isArabicLike ? "نوع البوث أو الخدمة" : "Booth type or service" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] t-muted mb-1 block">{f.label}</label>
                    <input type="text" value={(newLead as any)[f.key]} onChange={(e) => setNewLead(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full glass-card rounded-xl px-3 py-2.5 text-xs t-primary placeholder:t-muted gold-focus"
                      style={{ backgroundColor: "var(--input-bg)" }} />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] t-muted mb-1 block">{isArabicLike ? "ملاحظات" : "Notes"}</label>
                  <textarea value={newLead.notes} onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full glass-card rounded-xl px-3 py-2.5 text-xs t-primary placeholder:t-muted gold-focus resize-none h-16"
                    style={{ backgroundColor: "var(--input-bg)" }}
                    placeholder={isArabicLike ? "ملاحظات إضافية..." : "Additional notes..."} />
                </div>
                <button onClick={addLead} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  <Plus size={14} />
                  {t("crm.addLead")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
