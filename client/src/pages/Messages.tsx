/**
 * Messages — Internal Messaging System (Platform-Only Communication)
 * Design: Obsidian Glass chat interface with identity masking
 * Features: Encrypted messages, no phone/email sharing, auto-moderation
 * Security: Identity masking between trader and investor until contract signing
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Search, Shield, Lock, AlertTriangle,
  Image, Paperclip, Smile, Check, CheckCheck, Clock, Bell,
  ChevronDown, Filter, Star, Archive, Trash2, MoreVertical,
  Phone, Mail, XCircle, Info, Bot
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
  {
    id: "conv-1",
    nameAr: "المشرف — معرض التقنية",
    nameEn: "Supervisor — Tech Expo",
    role: "supervisor",
    roleAr: "مشرف المعرض",
    avatar: "M",
    lastMessage: "تم تأكيد حجزك للوحدة A21",
    lastTime: "10:30",
    unread: 2,
    online: true,
    expoName: "معرض الرياض الدولي للتقنية",
    masked: false,
  },
  {
    id: "conv-2",
    nameAr: "المستثمر #4782",
    nameEn: "Investor #4782",
    role: "investor",
    roleAr: "مستثمر (هوية مخفية)",
    avatar: "?",
    lastMessage: "هل يمكنك تقديم عرض تفصيلي لمنتجاتك؟",
    lastTime: "أمس",
    unread: 0,
    online: false,
    expoName: "معرض الأغذية والمشروبات",
    masked: true,
  },
  {
    id: "conv-3",
    nameAr: "الدعم الفني — Maham Expo",
    nameEn: "Technical Support",
    role: "support",
    roleAr: "دعم فني",
    avatar: "S",
    lastMessage: "شكراً لتواصلك، تم حل المشكلة",
    lastTime: "الأحد",
    unread: 0,
    online: true,
    expoName: "عام",
    masked: false,
  },
  {
    id: "conv-4",
    nameAr: "المستثمر #9201",
    nameEn: "Investor #9201",
    role: "investor",
    roleAr: "مستثمر (هوية مخفية)",
    avatar: "?",
    lastMessage: "نود مناقشة إمكانية التوسع في المعرض القادم",
    lastTime: "الخميس",
    unread: 1,
    online: false,
    expoName: "بوليفارد وورلد",
    masked: true,
  },
];

const sampleMessages: Message[] = [
  { id: "m1", sender: "system", text: "بدأت المحادثة — جميع الرسائل مشفرة ومراقبة بواسطة النظام", time: "10:00", status: "read" },
  { id: "m2", sender: "other", text: "مرحباً، نود إبلاغكم بأن حجزكم للوحدة A21 في معرض الرياض الدولي للتقنية تم تأكيده بنجاح.", time: "10:15", status: "read" },
  { id: "m3", sender: "me", text: "شكراً لكم. هل يمكنني الاطلاع على تفاصيل الخدمات المتاحة في المنطقة أ؟", time: "10:20", status: "read" },
  { id: "m4", sender: "other", text: "بالتأكيد. المنطقة أ تشمل: كهرباء 3 فاز، إنترنت فائق السرعة، تكييف مركزي، وخدمة تنظيف يومية. يمكنك أيضاً طلب شاشات LED إضافية.", time: "10:25", status: "read" },
  { id: "m5", sender: "me", text: "ممتاز. هل يمكنني التواصل مع المستثمر مباشرة لمناقشة التفاصيل؟", time: "10:28", status: "delivered" },
  { id: "m6", sender: "system", text: "⚠️ تنبيه أمني: لا يمكن مشاركة معلومات الاتصال المباشر (هاتف، بريد إلكتروني) قبل توقيع العقد الإلكتروني. هذا لحماية جميع الأطراف.", time: "10:28", status: "read", blocked: true, blockReason: "محاولة تجاوز المنصة" },
  { id: "m7", sender: "other", text: "تم تأكيد حجزك للوحدة A21. يرجى إتمام دفع العربون خلال 30 دقيقة.", time: "10:30", status: "read" },
];

const blockedPatterns = [
  "رقم هاتف", "رقم جوال", "واتساب", "whatsapp", "phone", "email",
  "بريد إلكتروني", "تلقرام", "telegram", "@", "05", "+966"
];

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

    // Check for blocked patterns (anti-circumvention)
    const isBlocked = blockedPatterns.some(p => newMessage.toLowerCase().includes(p.toLowerCase()));

    if (isBlocked) {
      const blockedMsg: Message = {
        id: `m-${Date.now()}`,
        sender: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        blocked: true,
        blockReason: "الرسالة تحتوي على معلومات اتصال محظورة",
      };
      const systemMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: "system",
        text: "⚠️ تم حظر هذه الرسالة تلقائياً — لا يُسمح بمشاركة معلومات الاتصال المباشر (هاتف، بريد، واتساب) قبل توقيع العقد. المخالفة قد تعرضك لغرامة 50,000 ريال.",
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        blocked: true,
        blockReason: "نظام الحماية التلقائي",
      };
      setMessages(prev => [...prev, blockedMsg, systemMsg]);
      toast.error("تم حظر الرسالة — معلومات اتصال محظورة");
    } else {
      const msg: Message = {
        id: `m-${Date.now()}`,
        sender: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };
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
      <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-80 border-l border-white/5`}>
        {/* Search */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المحادثات..."
              className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-3 py-2 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mx-4 mt-3 p-2.5 rounded-lg bg-[#C5A55A]/5 border border-[rgba(197,165,90,0.1)]">
          <div className="flex items-center gap-1.5">
            <Shield size={10} className="text-[#C5A55A]" />
            <span className="text-[9px] text-[#C5A55A]/70">جميع الرسائل مشفرة ومراقبة</span>
          </div>
          <p className="text-[8px] text-white/20 font-['Inter'] mt-0.5">All messages are encrypted & monitored</p>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveConv(conv.id); setShowMobileList(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeConv === conv.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  conv.role === "supervisor" ? "bg-[#C5A55A]/15 text-[#C5A55A]" :
                  conv.role === "support" ? "bg-blue-400/15 text-blue-400" :
                  "bg-white/5 text-white/30"
                }`}>
                  {conv.masked ? <Lock size={14} /> : conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0A0A12]" />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 text-right overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/70 truncate">{conv.nameAr}</span>
                  <span className="text-[9px] text-white/25 shrink-0">{conv.lastTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-white/35 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="shrink-0 w-4 h-4 rounded-full bg-[#C5A55A] flex items-center justify-center text-[8px] text-[#0A0A12] font-bold">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-[8px] text-white/15 mt-0.5">{conv.expoName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showMobileList ? "flex" : "hidden"} lg:flex flex-col flex-1`}>
        {/* Chat Header */}
        {activeConversation && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileList(true)}
                className="lg:hidden text-white/40 hover:text-white/70"
              >
                <ChevronDown size={18} className="rotate-90" />
              </button>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                activeConversation.role === "supervisor" ? "bg-[#C5A55A]/15 text-[#C5A55A]" :
                activeConversation.role === "support" ? "bg-blue-400/15 text-blue-400" :
                "bg-white/5 text-white/30"
              }`}>
                {activeConversation.masked ? <Lock size={14} /> : activeConversation.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{activeConversation.nameAr}</p>
                <p className="text-[9px] text-white/30">
                  {activeConversation.roleAr}
                  {activeConversation.masked && " — الهوية مخفية حتى توقيع العقد"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeConversation.masked && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-400/10 border border-red-400/20">
                  <Lock size={10} className="text-red-400/60" />
                  <span className="text-[9px] text-red-400/60">هوية مخفية</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-start" : msg.sender === "system" ? "justify-center" : "justify-end"}`}
            >
              {msg.sender === "system" ? (
                <div className={`max-w-md px-4 py-2 rounded-xl text-center ${
                  msg.blocked ? "bg-red-400/10 border border-red-400/20" : "bg-white/[0.03] border border-white/5"
                }`}>
                  <p className={`text-[10px] leading-relaxed ${msg.blocked ? "text-red-400/70" : "text-white/30"}`}>
                    {msg.text}
                  </p>
                </div>
              ) : (
                <div className={`max-w-[70%] ${msg.blocked ? "opacity-50" : ""}`}>
                  <div className={`px-4 py-2.5 rounded-2xl ${
                    msg.sender === "me"
                      ? msg.blocked
                        ? "bg-red-400/10 border border-red-400/20 rounded-br-md"
                        : "bg-[#C5A55A]/10 border border-[rgba(197,165,90,0.15)] rounded-br-md"
                      : "bg-white/[0.05] border border-white/5 rounded-bl-md"
                  }`}>
                    {msg.blocked && (
                      <div className="flex items-center gap-1 mb-1">
                        <XCircle size={10} className="text-red-400" />
                        <span className="text-[8px] text-red-400">محظورة — {msg.blockReason}</span>
                      </div>
                    )}
                    <p className={`text-xs leading-relaxed ${msg.blocked ? "line-through text-white/20" : "text-white/70"}`}>
                      {msg.text}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "" : "justify-end"}`}>
                    <span className="text-[9px] text-white/20">{msg.time}</span>
                    {msg.sender === "me" && !msg.blocked && (
                      msg.status === "read" ? <CheckCheck size={10} className="text-[#C5A55A]/60" /> :
                      msg.status === "delivered" ? <CheckCheck size={10} className="text-white/20" /> :
                      <Check size={10} className="text-white/20" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <button className="text-white/25 hover:text-white/50 transition-colors">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اكتب رسالتك... | Type your message..."
                className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[rgba(197,165,90,0.3)]"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-xl bg-[#C5A55A]/15 flex items-center justify-center text-[#C5A55A] hover:bg-[#C5A55A]/25 transition-colors disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={9} className="text-[#C5A55A]/30" />
            <span className="text-[8px] text-white/15">الرسائل مشفرة ومراقبة — مشاركة معلومات الاتصال محظورة قبل توقيع العقد</span>
          </div>
        </div>
      </div>
    </div>
  );
}
