/**
 * Messages — Internal Messaging System — Fully translated with t()
 */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Search, Shield, Lock, Paperclip, Check, CheckCheck, ArrowRight, ArrowLeft, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Conversation { id: string; name: string; role: "investor" | "supervisor" | "support"; roleLabel: string; avatar: string; lastMessage: string; lastTime: string; unread: number; online: boolean; expoName: string; masked: boolean; }
interface Message { id: string; sender: "me" | "other" | "system"; text: string; time: string; status: "sent" | "delivered" | "read"; blocked?: boolean; }

export default function Messages() {
  const { t, lang, isRTL } = useLanguage();
  const [activeConv, setActiveConv] = useState<string>("conv-1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    { id: "conv-1", name: t("messages.supervisor") + " — " + t("messages.techExpo"), role: "supervisor", roleLabel: t("messages.expoSupervisor"), avatar: "M", lastMessage: t("messages.sampleMsg1"), lastTime: "10:30", unread: 2, online: true, expoName: t("messages.techExpoFull"), masked: false },
    { id: "conv-2", name: t("messages.investor") + " #4782", role: "investor", roleLabel: t("messages.investorHidden"), avatar: "?", lastMessage: t("messages.sampleMsg2"), lastTime: t("messages.yesterday"), unread: 0, online: false, expoName: t("messages.foodExpo"), masked: true },
    { id: "conv-3", name: t("messages.techSupport"), role: "support", roleLabel: t("messages.support"), avatar: "S", lastMessage: t("messages.sampleMsg3"), lastTime: t("messages.sunday"), unread: 0, online: true, expoName: t("common.general"), masked: false },
    { id: "conv-4", name: t("messages.investor") + " #9201", role: "investor", roleLabel: t("messages.investorHidden"), avatar: "?", lastMessage: t("messages.sampleMsg4"), lastTime: t("messages.thursday"), unread: 1, online: false, expoName: "Boulevard World", masked: true },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "system", text: t("messages.chatStarted"), time: "10:00", status: "read" },
    { id: "m2", sender: "other", text: t("messages.bookingConfirmed"), time: "10:15", status: "read" },
    { id: "m3", sender: "me", text: t("messages.servicesQuestion"), time: "10:20", status: "read" },
    { id: "m4", sender: "other", text: t("messages.servicesAnswer"), time: "10:25", status: "read" },
    { id: "m5", sender: "me", text: t("messages.contactInvestor"), time: "10:28", status: "delivered" },
    { id: "m6", sender: "system", text: t("messages.securityAlert"), time: "10:28", status: "read", blocked: true },
    { id: "m7", sender: "other", text: t("messages.payDeposit"), time: "10:30", status: "read" },
  ]);

  const blockedPatterns = ["رقم هاتف", "رقم جوال", "واتساب", "whatsapp", "phone", "email", "بريد إلكتروني", "تلقرام", "telegram", "@", "05", "+966"];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const activeConversation = conversations.find(c => c.id === activeConv);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const isBlocked = blockedPatterns.some(p => newMessage.toLowerCase().includes(p.toLowerCase()));
    if (isBlocked) {
      const blockedMsg: Message = { id: `m-${Date.now()}`, sender: "me", text: newMessage, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), status: "sent", blocked: true };
      const systemMsg: Message = { id: `m-${Date.now() + 1}`, sender: "system", text: t("messages.blockedAuto"), time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), status: "read", blocked: true };
      setMessages(prev => [...prev, blockedMsg, systemMsg]);
      toast.error(t("messages.blockedToast"));
    } else {
      const msg: Message = { id: `m-${Date.now()}`, sender: "me", text: newMessage, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), status: "sent" };
      setMessages(prev => [...prev, msg]);
    }
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(c => searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)", minHeight: "400px", maxHeight: "calc(100vh - 130px)" }}>
      <div className="flex flex-1 rounded-xl sm:rounded-2xl overflow-hidden glass-card" style={{ minHeight: 0 }}>
        {/* Conversations List */}
        <div className={`${showChat ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-72 xl:w-80 shrink-0`} style={{ borderInlineEnd: "1px solid var(--glass-border)" }}>
          <div className="p-3 sm:p-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="relative">
              <Search size={13} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 t-muted`} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("messages.searchPlaceholder")}
                className={`w-full rounded-lg ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"} py-2 text-xs t-primary`}
                style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }} />
            </div>
          </div>
          <div className="mx-3 mt-2 p-2 rounded-lg bg-gold-subtle" style={{ border: "1px solid var(--gold-border)" }}>
            <div className="flex items-center gap-1.5">
              <Shield size={9} className="t-gold shrink-0" />
              <span className="text-[8px] t-gold" style={{ opacity: 0.8 }}>{t("messages.encrypted")}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1" style={{ minHeight: 0 }}>
            {filteredConversations.map((conv) => (
              <button key={conv.id} onClick={() => { setActiveConv(conv.id); setShowChat(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
                style={{ backgroundColor: activeConv === conv.id ? "var(--glass-bg-hover)" : "transparent" }}>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: conv.role === "supervisor" ? "var(--gold-bg)" : conv.role === "support" ? "color-mix(in srgb, var(--status-blue) 15%, transparent)" : "var(--glass-bg)", color: conv.role === "supervisor" ? "var(--gold-accent)" : conv.role === "support" ? "var(--status-blue)" : "var(--text-muted)" }}>
                    {conv.masked ? <Lock size={12} /> : conv.avatar}
                  </div>
                  {conv.online && <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-green)", border: "2px solid var(--surface-dark)" }} />}
                </div>
                <div className="flex-1 overflow-hidden text-start">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium t-secondary truncate">{conv.name}</span>
                    <span className="text-[8px] t-muted shrink-0">{conv.lastTime}</span>
                  </div>
                  <p className="text-[10px] t-tertiary truncate">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[8px] t-muted truncate">{conv.expoName}</p>
                    {conv.unread > 0 && <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>{conv.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showChat ? "hidden lg:flex" : "flex"} flex-col flex-1`} style={{ minHeight: 0 }}>
          {activeConversation && (
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <div className="flex items-center gap-2.5">
                <button onClick={() => setShowChat(false)} className="lg:hidden p-1.5 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                  {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                </button>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: activeConversation.role === "supervisor" ? "var(--gold-bg)" : activeConversation.role === "support" ? "color-mix(in srgb, var(--status-blue) 15%, transparent)" : "var(--glass-bg)", color: activeConversation.role === "supervisor" ? "var(--gold-accent)" : activeConversation.role === "support" ? "var(--status-blue)" : "var(--text-muted)" }}>
                  {activeConversation.masked ? <Lock size={12} /> : activeConversation.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium t-primary truncate">{activeConversation.name}</p>
                  <p className="text-[8px] t-muted truncate">{activeConversation.roleLabel}</p>
                </div>
              </div>
              {activeConversation.masked && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--status-red) 10%, transparent)" }}>
                  <Lock size={9} style={{ color: "var(--status-red)", opacity: 0.6 }} />
                  <span className="text-[8px] hidden sm:inline" style={{ color: "var(--status-red)", opacity: 0.6 }}>{t("messages.hiddenIdentity")}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "me" ? (isRTL ? "justify-start" : "justify-end") : msg.sender === "system" ? "justify-center" : (isRTL ? "justify-end" : "justify-start")}`}>
                {msg.sender === "system" ? (
                  <div className="max-w-[90%] sm:max-w-md px-3 py-2 rounded-xl text-center"
                    style={{ backgroundColor: msg.blocked ? "color-mix(in srgb, var(--status-red) 10%, transparent)" : "var(--glass-bg)", border: msg.blocked ? "1px solid color-mix(in srgb, var(--status-red) 20%, transparent)" : "1px solid var(--glass-border)" }}>
                    <p className="text-[9px] sm:text-[10px] leading-relaxed" style={{ color: msg.blocked ? "var(--status-red)" : "var(--text-muted)", opacity: msg.blocked ? 0.8 : 0.6 }}>{msg.text}</p>
                  </div>
                ) : (
                  <div className={`max-w-[80%] sm:max-w-[70%] ${msg.blocked ? "opacity-50" : ""}`}>
                    <div className="px-3 py-2 rounded-2xl" style={{ backgroundColor: msg.sender === "me" ? (msg.blocked ? "color-mix(in srgb, var(--status-red) 10%, transparent)" : "var(--gold-bg)") : "var(--glass-bg)", border: msg.sender === "me" ? (msg.blocked ? "1px solid color-mix(in srgb, var(--status-red) 20%, transparent)" : "1px solid var(--gold-border)") : "1px solid var(--glass-border)" }}>
                      {msg.blocked && (
                        <div className="flex items-center gap-1 mb-1">
                          <XCircle size={9} style={{ color: "var(--status-red)" }} />
                          <span className="text-[7px]" style={{ color: "var(--status-red)" }}>{t("messages.blocked")}</span>
                        </div>
                      )}
                      <p className={`text-[11px] sm:text-xs leading-relaxed ${msg.blocked ? "line-through t-muted" : "t-secondary"}`}>{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 ${msg.sender === "me" ? "" : (isRTL ? "justify-start" : "justify-end")}`}>
                      <span className="text-[8px] t-muted">{msg.time}</span>
                      {msg.sender === "me" && !msg.blocked && (
                        msg.status === "read" ? <CheckCheck size={9} className="t-gold" style={{ opacity: 0.6 }} /> :
                        msg.status === "delivered" ? <CheckCheck size={9} className="t-muted" /> :
                        <Check size={9} className="t-muted" />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2.5 sm:p-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-2">
              <button className="t-muted shrink-0 p-1.5" onClick={() => toast.info(t("messages.attachSoon"))}>
                <Paperclip size={16} />
              </button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("messages.inputPlaceholder")}
                className="flex-1 rounded-xl px-3 py-2 text-xs t-primary"
                style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                dir={isRTL ? "rtl" : "ltr"} />
              <button onClick={handleSend} disabled={!newMessage.trim()}
                className="w-9 h-9 rounded-xl bg-gold-subtle flex items-center justify-center t-gold shrink-0 disabled:opacity-30">
                <Send size={14} className={isRTL ? "rotate-180" : ""} />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Shield size={8} className="t-gold" style={{ opacity: 0.3 }} />
              <span className="text-[7px] sm:text-[8px] t-muted">{t("messages.encryptedNote")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
