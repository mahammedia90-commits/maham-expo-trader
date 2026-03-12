/**
 * HelpCenter — Support & FAQ
 * Design: Obsidian Glass with searchable FAQ, ticket system
 * Features: FAQ, submit ticket, live chat link, guides
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, ChevronDown, MessageSquare, Phone, Mail,
  FileText, Book, Video, Shield, CreditCard, Calendar, Map,
  Send, CheckCircle2, Clock, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "f1", category: "حجز",
    questionAr: "كيف أحجز وحدة في المعرض؟",
    questionEn: "How do I book a unit at an expo?",
    answerAr: "يمكنك تصفح المعارض المتاحة من صفحة 'تصفح المعارض'، ثم اختيار المعرض المناسب وعرض خريطة الوحدات التفاعلية. اختر الوحدة المتاحة واضغط 'تثبيت الوحدة' لحجزها مؤقتاً لمدة 30 دقيقة، ثم أكمل عملية الدفع.",
  },
  {
    id: "f2", category: "دفع",
    questionAr: "ما هي طرق الدفع المتاحة؟",
    questionEn: "What payment methods are available?",
    answerAr: "نقبل بطاقات الائتمان (Visa, Mastercard)، مدى، Apple Pay، والتحويل البنكي. يتم دفع عربون 5% عند الحجز (غير مسترد)، والباقي حسب جدول الأقساط المتفق عليه في العقد.",
  },
  {
    id: "f3", category: "أمان",
    questionAr: "لماذا لا يمكنني التواصل مع المستثمر مباشرة؟",
    questionEn: "Why can't I contact the investor directly?",
    answerAr: "لحماية جميع الأطراف، يتم التواصل عبر المنصة فقط حتى توقيع العقد الإلكتروني. هذا يضمن حقوقك ويمنع أي تلاعب. بعد توقيع العقد، يتم الكشف عن معلومات الاتصال تلقائياً.",
  },
  {
    id: "f4", category: "عقود",
    questionAr: "كيف يعمل العقد الإلكتروني؟",
    questionEn: "How does the e-contract work?",
    answerAr: "بعد تأكيد الحجز ودفع العربون، يتم إنشاء عقد إلكتروني ذكي يحتوي على جميع التفاصيل. يمكنك مراجعته وتوقيعه إلكترونياً. العقد ملزم قانونياً ومعتمد.",
  },
  {
    id: "f5", category: "حجز",
    questionAr: "هل يمكنني إلغاء الحجز واسترداد المبلغ؟",
    questionEn: "Can I cancel and get a refund?",
    answerAr: "العربون (5%) غير مسترد في جميع الحالات. بالنسبة للمبالغ الأخرى، تعتمد سياسة الاسترداد على توقيت الإلغاء وشروط العقد. يرجى مراجعة شروط العقد أو التواصل مع الدعم.",
  },
  {
    id: "f6", category: "تحقق",
    questionAr: "ما هي متطلبات التحقق من الهوية (KYC)؟",
    questionEn: "What are the KYC requirements?",
    answerAr: "يجب تقديم: صورة الهوية الوطنية أو الإقامة، السجل التجاري، شهادة الزكاة والضريبة، وبيانات الحساب البنكي. التحقق مطلوب مرة واحدة فقط قبل أول حجز.",
  },
];

const categories = ["الكل", "حجز", "دفع", "أمان", "عقود", "تحقق"];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = searchQuery === "" || f.questionAr.includes(searchQuery) || f.answerAr.includes(searchQuery);
    const matchCategory = activeCategory === "الكل" || f.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    setTicketSubmitted(true);
    toast.success("تم إرسال طلب الدعم بنجاح! سنرد خلال 24 ساعة.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white/90">مركز المساعدة</h2>
        <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Help Center — Support & FAQ</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: MessageSquare, label: "محادثة مباشرة", labelEn: "Live Chat", color: "text-blue-400", bg: "bg-blue-400/10" },
          { icon: Phone, label: "اتصل بنا", labelEn: "Call Us", color: "text-green-400", bg: "bg-green-400/10" },
          { icon: Mail, label: "بريد إلكتروني", labelEn: "Email", color: "text-purple-400", bg: "bg-purple-400/10" },
          { icon: Book, label: "دليل المستخدم", labelEn: "User Guide", color: "text-[#C5A55A]", bg: "bg-[#C5A55A]/10" },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => toast.info("سيتم تفعيل هذه الخدمة قريباً | Coming soon")}
            className="glass-card rounded-xl p-4 text-center hover:bg-white/[0.04] transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-2`}>
              <action.icon size={18} className={action.color} />
            </div>
            <p className="text-xs text-white/60">{action.label}</p>
            <p className="text-[8px] text-white/20 font-['Inter']">{action.labelEn}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الأسئلة الشائعة... | Search FAQ..."
          className="w-full bg-white/[0.04] border border-white/8 rounded-xl pr-11 pl-4 py-3 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-[#C5A55A]/15 border border-[rgba(197,165,90,0.3)] text-[#E8D5A3]"
                : "glass-card text-white/40 hover:text-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 text-right"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-[#C5A55A]/50 shrink-0" />
                <div>
                  <p className="text-xs text-white/70">{faq.questionAr}</p>
                  <p className="text-[9px] text-white/20 font-['Inter']">{faq.questionEn}</p>
                </div>
              </div>
              <ChevronDown size={14} className={`text-white/30 transition-transform shrink-0 ${expandedFaq === faq.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expandedFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pr-12">
                    <p className="text-xs text-white/45 leading-relaxed">{faq.answerAr}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Submit Ticket */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Send size={16} className="text-[#C5A55A]" />
          <h3 className="text-sm font-bold text-white/80">إرسال طلب دعم</h3>
          <span className="text-[10px] text-white/20 font-['Inter']">Submit Support Ticket</span>
        </div>

        {!ticketSubmitted ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 mb-1.5 block">الموضوع | Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="موضوع الاستفسار..."
                className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1.5 block">الرسالة | Message</label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="اشرح مشكلتك أو استفسارك بالتفصيل..."
                rows={4}
                className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)] resize-none"
              />
            </div>
            <button
              onClick={handleSubmitTicket}
              className="btn-gold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              <Send size={14} />
              إرسال
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={40} className="mx-auto text-green-400 mb-3" />
            <p className="text-sm text-white/70">تم إرسال طلبك بنجاح!</p>
            <p className="text-xs text-white/30">رقم التذكرة: #TK-2025-0847</p>
            <p className="text-[10px] text-white/20 font-['Inter'] mt-1">We'll respond within 24 hours</p>
          </div>
        )}
      </div>
    </div>
  );
}
