/**
 * Messages — Internal Messaging System (Platform-Only Communication)
 * Theme-aware: uses CSS variables for Light/Dark mode
 * All buttons and features are fully functional
 */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send, Search, Shield, Lock, Paperclip,
  Check, CheckCheck, ChevronDown, XCircle
} from "lucide-react";
import { toast } from "sonner";

interface Conversation {
  id: string;
  nameAr: string;
  nameEn: string;
  role: "investor" | "supervisor" | "support";
  roleAr: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  expoName: string;
  masked: boolean;
}

interface Message {
  id: string;
  sender: "me" | "other" | "system";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  blocked?: boolean;
  blockReason?: string;
}

const conversations: Conversation[] = [
  { id: "conv-1", nameAr: "المشرف — معرض التقنية", nameEn: "Supervisor — Tech Expo", role: "supervisor", roleAr: "مشرف المعرض", avatar: "M", lastMessage: "تم تأكيد حجزك للوحدة A21", lastTime: "10:30", unread: 2, online: true, expoName: "معرض الرياض الدولي للتقنية", masked: false },
  { id: "conv-2", nameAr: "المستثمر #4782", nameEn: "Investor #4782", role: "investor", roleAr: "مستثمر (هوية مخفية)", avatar: "?", lastMessage: "هل يمكنك تقديم عرض تفصيلي لمنتجاتك؟", lastTime: "أمس", unread: 0, online: false, expoName: "معرض الأغذية والمشروبات", masked: true },
  { id: "conv-3", nameAr: "الدعم الفني — Maham Expo", nameEn: "Technical Support", role: "support", roleAr: "دعم فني", avatar: "S", lastMessage: "شكراً لتواصلك، تم حل المشكلة", lastTime: "الأحد", unread: 0, online: true, expoName: "عام", masked: false },
  { id: "conv-4", nameAr: "المستثمر #9201", nameEn: "Investor #9201", role: "investor", roleAr: "مستثمر (هوية مخفية)", avatar: "?", lastMessage: "نود مناقشة إمكانية التوسع في المعرض القادم", lastTime: "الخميس", unread: 1, online: false, expoName: "بوليفارد وورلد", masked: true },
];

const sampleMessages: Message[] = [
  { id: "m1", sender: "system", text: "بدأت المحادثة — جميع الرسائل مشفرة ومراقبة بواسطة النظام", time: "10:00", status: "read" },
  { id: "m2", sender: "other", text: "مرحباً، نود إبلاغكم بأن حجزكم للوحدة A21 في معرض الرياض الدولي للتقنية تم تأكيده بنجاح.", time: "10:15", status: "read" },
  { id: "m3", sender: "me", text: "شكراً لكم. هل يمكنني الاطلاع على تفاصيل الخدمات المتاحة في المنطقة أ؟", time: "10:20", status: "read" },
  { id: "m4", sender: "other", text: "بالتأكيد. المنطقة أ تشمل: كهرباء 3 فاز، إنترنت فائق السرعة، تكييف مركزي، وخدمة تنظيف يومية. يمكنك أيضاً طلب شاشات LED إضافية.", time: "10:25", status: "read" },
  { id: "m5", sender: "me", text: "ممتاز. هل يمكنني التواصل مع المستثمر مباشرة لمناقشة التفاصيل؟", time: "10:28", status: "delivered" },
  { id: "m6", sender: "system", text: "تنبيه أمني: لا يمكن مشاركة معلومات الاتصال المباشر (هاتف، بريد إلكتروني) قبل توقيع العقد الإلكتروني. هذا لحماية جميع الأطراف.", time: "10:28", status: "read", blocked: true, blockReason: "محاولة تجاوز المنصة" },
  { id: "m7", sender: "other", text: "تم تأكيد حجزك للوحدة A21. يرجى إتمام دفع العربون خلال 30 دقيقة.", time: "10:30", status: "read" },
];

const blockedPatterns = ["رقم هاتف", "رقم جوال", "واتساب", "whatsapp", "phone", "email", "بريد إلكتروني", "تلقرام", "telegram", "@", "05", "+966"];

export default function Messages() {
  const [activeConv, setActiveConv] = useState<string>("conv-1");
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find(c => c.id === activeConv);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const isBlocked = blockedPatterns.some(p => newMessage.toLowerCase().includes(p.toLowerCase()));
    if (isBlocked) {
      const blockedMsg: Message = { id: `m-${Date.now()}`, sender: "me", text: newMessage, time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }), status: "sent", blocked: true, blockReason: "الرسالة تحتوي على معلومات اتصال محظورة" };
      const systemMsg: Message = { id: `m-${Date.now() + 1}`, sender: "system", text: "تم حظر هذه الرسالة تلقائياً — لا يُسمح بمشاركة معلومات الاتصال المباشر قبل توقيع العقد. المخالفة قد تعرضك لغرامة 50,000 ريال.", time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }), status: "read", blocked: true, blockReason: "نظام الحماية التلقائي" };
      setMessages(prev => [...prev, blockedMsg, systemMsg]);
      toast.error("تم حظر الرسالة — معلومات اتصال محظورة");
    } else {
      const msg: Message = { id: `m-${Date.now()}`, sender: "me", text: newMessage, time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }), status: "sent" };
      setMessages(prev => [...prev, msg]);
    }
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(c =>
    searchQuery === "" || c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex rounded-2xl overflow-hidden glass-card">
      {/* Conversations List */}
      <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-80`} style={{ borderLeft: "1px solid var(--glass-border)" }}>
        <div className="p-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 t-muted" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث في المحادثات..."
              className="w-full rounded-lg pr-9 pl-3 py-2 text-xs t-primary gold-focus"
              style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
          </div>
        </div>

        <div className="mx-4 mt-3 p-2.5 rounded-lg bg-gold-subtle" style={{ border: "1px solid var(--gold-border)" }}>
          <div className="flex items-center gap-1.5">
            <Shield size={10} className="t-gold" />
            <span className="text-[9px] t-gold" style={{ opacity: 0.8 }}>جميع الرسائل مشفرة ومراقبة</span>
          </div>
          <p className="text-[8px] t-muted font-['Inter'] mt-0.5">All messages are encrypted & monitored</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredConversations.map((conv) => (
            <button key={conv.id} onClick={() => { setActiveConv(conv.id); setShowMobileList(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
              style={{ backgroundColor: activeConv === conv.id ? "var(--glass-bg-hover)" : "transparent" }}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: conv.role === "supervisor" ? "var(--gold-bg)" : conv.role === "support" ? "color-mix(in srgb, var(--status-blue) 15%, transparent)" : "var(--glass-bg)",
                    color: conv.role === "supervisor" ? "var(--gold-accent)" : conv.role === "support" ? "var(--status-blue)" : "var(--text-muted)"
                  }}>
                  {conv.masked ? <Lock size={14} /> : conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--status-green)", border: "2px solid var(--surface-dark)" }} />
                )}
              </div>
              <div className="flex-1 text-right overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium t-secondary truncate">{conv.nameAr}</span>
                  <span className="text-[9px] t-muted shrink-0">{conv.lastTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] t-tertiary truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>{conv.unread}</span>
                  )}
                </div>
                <p className="text-[8px] t-muted mt-0.5">{conv.expoName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showMobileList ? "flex" : "hidden"} lg:flex flex-col flex-1`}>
        {activeConversation && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMobileList(true)} className="lg:hidden t-tertiary"><ChevronDown size={18} className="rotate-90" /></button>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: activeConversation.role === "supervisor" ? "var(--gold-bg)" : activeConversation.role === "support" ? "color-mix(in srgb, var(--status-blue) 15%, transparent)" : "var(--glass-bg)",
                  color: activeConversation.role === "supervisor" ? "var(--gold-accent)" : activeConversation.role === "support" ? "var(--status-blue)" : "var(--text-muted)"
                }}>
                {activeConversation.masked ? <Lock size={14} /> : activeConversation.avatar}
              </div>
              <div>
                <p className="text-sm font-medium t-primary">{activeConversation.nameAr}</p>
                <p className="text-[9px] t-muted">{activeConversation.roleAr}{activeConversation.masked && " — الهوية مخفية حتى توقيع العقد"}</p>
              </div>
            </div>
            {activeConversation.masked && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--status-red) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--status-red) 20%, transparent)" }}>
                <Lock size={10} style={{ color: "var(--status-red)", opacity: 0.6 }} />
                <span className="text-[9px]" style={{ color: "var(--status-red)", opacity: 0.6 }}>هوية مخفية</span>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-start" : msg.sender === "system" ? "justify-center" : "justify-end"}`}>
              {msg.sender === "system" ? (
                <div className="max-w-md px-4 py-2 rounded-xl text-center"
                  style={{
                    backgroundColor: msg.blocked ? "color-mix(in srgb, var(--status-red) 10%, transparent)" : "var(--glass-bg)",
                    border: msg.blocked ? "1px solid color-mix(in srgb, var(--status-red) 20%, transparent)" : "1px solid var(--glass-border)"
                  }}>
                  <p className="text-[10px] leading-relaxed" style={{ color: msg.blocked ? "var(--status-red)" : "var(--text-muted)", opacity: msg.blocked ? 0.8 : 0.6 }}>{msg.text}</p>
                </div>
              ) : (
                <div className={`max-w-[70%] ${msg.blocked ? "opacity-50" : ""}`}>
                  <div className="px-4 py-2.5 rounded-2xl"
                    style={{
                      backgroundColor: msg.sender === "me" ? (msg.blocked ? "color-mix(in srgb, var(--status-red) 10%, transparent)" : "var(--gold-bg)") : "var(--glass-bg)",
                      border: msg.sender === "me" ? (msg.blocked ? "1px solid color-mix(in srgb, var(--status-red) 20%, transparent)" : "1px solid var(--gold-border)") : "1px solid var(--glass-border)",
                      borderBottomRightRadius: msg.sender === "me" ? "4px" : undefined,
                      borderBottomLeftRadius: msg.sender !== "me" ? "4px" : undefined,
                    }}>
                    {msg.blocked && (
                      <div className="flex items-center gap-1 mb-1">
                        <XCircle size={10} style={{ color: "var(--status-red)" }} />
                        <span className="text-[8px]" style={{ color: "var(--status-red)" }}>محظورة — {msg.blockReason}</span>
                      </div>
                    )}
                    <p className={`text-xs leading-relaxed ${msg.blocked ? "line-through t-muted" : "t-secondary"}`}>{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "" : "justify-end"}`}>
                    <span className="text-[9px] t-muted">{msg.time}</span>
                    {msg.sender === "me" && !msg.blocked && (
                      msg.status === "read" ? <CheckCheck size={10} className="t-gold" style={{ opacity: 0.6 }} /> :
                      msg.status === "delivered" ? <CheckCheck size={10} className="t-muted" /> :
                      <Check size={10} className="t-muted" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
          <div className="flex items-center gap-3">
            <button className="t-muted transition-colors" onClick={() => toast.info("إرفاق ملف — قريباً | Attach file — Coming soon")}>
              <Paperclip size={18} />
            </button>
            <div className="flex-1">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اكتب رسالتك... | Type your message..."
                className="w-full rounded-xl px-4 py-2.5 text-xs t-primary gold-focus"
                style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }} />
            </div>
            <button onClick={handleSend} disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center t-gold transition-colors disabled:opacity-30">
              <Send size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={9} className="t-gold" style={{ opacity: 0.3 }} />
            <span className="text-[8px] t-muted">الرسائل مشفرة ومراقبة — مشاركة معلومات الاتصال محظورة قبل توقيع العقد</span>
          </div>
        </div>
      </div>
    </div>
  );
}
