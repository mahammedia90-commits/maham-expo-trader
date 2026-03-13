/**
 * HelpCenter — Support & FAQ — Fully translated with t()
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, ChevronDown, MessageSquare, Phone, Mail, FileText, Book, Video, Shield, CreditCard, Calendar, Map, Send, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HelpCenter() {
  const { t, lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: "all", label: t("common.all") },
    { id: "booking", label: t("help.catBooking") },
    { id: "payment", label: t("help.catPayment") },
    { id: "security", label: t("help.catSecurity") },
    { id: "contracts", label: t("help.catContracts") },
    { id: "kyc", label: t("help.catKYC") },
  ];

  const faqs = [
    { id: "f1", category: "booking", question: t("help.faq1Q"), answer: t("help.faq1A") },
    { id: "f2", category: "payment", question: t("help.faq2Q"), answer: t("help.faq2A") },
    { id: "f3", category: "security", question: t("help.faq3Q"), answer: t("help.faq3A") },
    { id: "f4", category: "contracts", question: t("help.faq4Q"), answer: t("help.faq4A") },
    { id: "f5", category: "booking", question: t("help.faq5Q"), answer: t("help.faq5A") },
    { id: "f6", category: "kyc", question: t("help.faq6Q"), answer: t("help.faq6A") },
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = searchQuery === "" || f.question.includes(searchQuery) || f.answer.includes(searchQuery);
    const matchCategory = activeCategory === "all" || f.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error(t("help.fillAllFields"));
      return;
    }
    setTicketSubmitted(true);
    toast.success(t("help.ticketSent"));
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold t-primary">{t("help.title")}</h2>
        <p className="text-[10px] t-gold/50 font-['Inter']">Help Center & Support</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Phone, label: t("help.phone"), value: "+966 11 XXX XXXX" },
          { icon: Mail, label: t("help.email"), value: "support@mahamexpo.com" },
          { icon: MessageSquare, label: t("help.liveChat"), value: t("help.available247") },
          { icon: Clock, label: t("help.workHours"), value: t("help.workHoursValue") },
        ].map((c, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <c.icon size={16} className="t-gold mx-auto mb-2" />
            <p className="text-[11px] t-secondary font-medium">{c.label}</p>
            <p className="text-[9px] t-muted mt-0.5">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 t-muted`} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("help.searchPlaceholder")}
          className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 text-sm t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]`} />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-gold-subtle border border-[var(--gold-border)] t-gold-light" : "glass-card t-tertiary hover:t-secondary"}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="glass-card rounded-xl overflow-hidden">
            <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="t-gold/50 shrink-0" />
                <p className="text-xs t-secondary text-start">{faq.question}</p>
              </div>
              <ChevronDown size={14} className={`t-tertiary transition-transform shrink-0 ${expandedFaq === faq.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expandedFaq === faq.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className={`px-4 pb-4 ${isRTL ? "pr-12" : "pl-12"}`}>
                    <p className="text-xs t-tertiary leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Submit Ticket */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Send size={16} className="t-gold" />
          <h3 className="text-sm font-bold t-primary">{t("help.submitTicket")}</h3>
        </div>
        {!ticketSubmitted ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] t-tertiary mb-1.5 block">{t("help.subject")}</label>
              <input type="text" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)}
                placeholder={t("help.subjectPlaceholder")}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
            </div>
            <div>
              <label className="text-[10px] t-tertiary mb-1.5 block">{t("help.message")}</label>
              <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)}
                placeholder={t("help.messagePlaceholder")} rows={4}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] resize-none" />
            </div>
            <button onClick={handleSubmitTicket} className="btn-gold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <Send size={14} />
              {t("help.send")}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={40} className="mx-auto text-[var(--status-green)] mb-3" />
            <p className="text-sm t-secondary">{t("help.ticketSuccess")}</p>
            <p className="text-xs t-tertiary">{t("help.ticketNumber")}: #TK-2026-0847</p>
            <p className="text-[10px] t-muted font-['Inter'] mt-1">{t("help.responseTime")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
