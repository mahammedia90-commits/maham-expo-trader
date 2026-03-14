/**
 * Notifications — Smart Alert System — Fully translated with t()
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Bell, BellOff, Check, CheckCheck, CreditCard, FileText, Calendar, Shield, Sparkles, Trash2, MessageSquare, Star, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type NotifType = "booking" | "payment" | "contract" | "security" | "system" | "ai" | "message" | "review";

interface Notification { id: string; type: NotifType; priority: "high" | "medium" | "low"; title: string; desc: string; time: string; read: boolean; actionUrl?: string; actionLabel?: string; }

const iconMap: Record<NotifType, any> = { booking: Calendar, payment: CreditCard, contract: FileText, security: Shield, system: Info, ai: Sparkles, message: MessageSquare, review: Star };
const typeColors: Record<NotifType, string> = { booking: "var(--status-blue)", payment: "var(--status-green)", contract: "#A855F7", security: "var(--status-red)", system: "var(--text-muted)", ai: "var(--gold-accent)", message: "#22D3EE", review: "var(--status-yellow)" };

export default function Notifications() {
  const { t, lang, isRTL } = useLanguage();

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", type: "security", priority: "high", title: t("notif.securityAlert"), desc: t("notif.securityAlertDesc"), time: t("notif.5minAgo"), read: false, actionUrl: "/messages", actionLabel: t("notif.viewChat") },
    { id: "n2", type: "payment", priority: "high", title: t("notif.paymentReminder"), desc: t("notif.paymentReminderDesc"), time: t("notif.1hourAgo"), read: false, actionUrl: "/payments", actionLabel: t("notif.payNow") },
    { id: "n3", type: "booking", priority: "medium", title: t("notif.bookingConfirmed"), desc: t("notif.bookingConfirmedDesc"), time: t("notif.3hoursAgo"), read: false, actionUrl: "/contracts", actionLabel: t("notif.signContract") },
    { id: "n4", type: "ai", priority: "medium", title: t("notif.aiRecommendation"), desc: t("notif.aiRecommendationDesc"), time: t("notif.5hoursAgo"), read: true, actionUrl: "/expos", actionLabel: t("notif.viewExpo") },
    { id: "n5", type: "contract", priority: "low", title: t("notif.contractUpdate"), desc: t("notif.contractUpdateDesc"), time: t("notif.yesterday"), read: true, actionUrl: "/contracts", actionLabel: t("notif.reviewContract") },
    { id: "n6", type: "review", priority: "low", title: t("notif.reviewRequired"), desc: t("notif.reviewRequiredDesc"), time: t("notif.lastWeek"), read: true, actionUrl: "/reviews", actionLabel: t("notif.reviewNow") },
    { id: "n7", type: "message", priority: "medium", title: t("notif.newMessage"), desc: t("notif.newMessageDesc"), time: t("notif.2hoursAgo"), read: false, actionUrl: "/messages", actionLabel: t("notif.viewMessage") },
  ]);

  const [filter, setFilter] = useState<"all" | NotifType>("all");
  const [showRead, setShowRead] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => {
    const matchType = filter === "all" || n.type === filter;
    const matchRead = showRead || !n.read;
    return matchType && matchRead;
  });

  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success(t("notif.allMarkedRead")); };
  const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success(t("notif.deleted")); };

  const filterTabs = [
    { value: "all", label: t("common.all"), count: notifications.length },
    { value: "security", label: t("notif.security"), count: notifications.filter(n => n.type === "security").length },
    { value: "payment", label: t("nav.payments"), count: notifications.filter(n => n.type === "payment").length },
    { value: "booking", label: t("nav.bookings"), count: notifications.filter(n => n.type === "booking").length },
    { value: "message", label: t("nav.messages"), count: notifications.filter(n => n.type === "message").length },
    { value: "ai", label: "AI", count: notifications.filter(n => n.type === "ai").length },
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>{t("notif.title")}</h2>
          <p className="text-[10px] sm:text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>Notifications — {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-gold transition-colors flex items-center gap-1">
            <CheckCheck size={12} /> {t("notif.markAllRead")}
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${filter === f.value ? "bg-gold-subtle border-gold t-gold" : "glass-card t-tertiary"}`}
            style={filter === f.value ? { border: "1px solid var(--gold-border)" } : undefined}>
            {f.label}
            {f.count > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ backgroundColor: "var(--glass-bg)" }}>{f.count}</span>}
          </button>
        ))}
      </div>

      <button onClick={() => setShowRead(!showRead)} className="flex items-center gap-1.5 text-[10px] t-muted transition-colors">
        {showRead ? <Bell size={12} /> : <BellOff size={12} />}
        {showRead ? t("notif.hideRead") : t("notif.showAll")}
      </button>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const Icon = iconMap[notif.type];
            const color = typeColors[notif.type];
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-3 sm:p-4"
                style={{
                  borderInlineStart: notif.priority === "high" ? `2px solid color-mix(in srgb, var(--status-red) 50%, transparent)` : notif.priority === "medium" ? `2px solid var(--gold-border)` : undefined,
                  backgroundColor: !notif.read ? "var(--glass-bg-hover)" : undefined,
                }}>
                <div className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!notif.read ? "t-primary" : "t-secondary"}`}>{notif.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] t-muted">{notif.time}</span>
                        {!notif.read && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />}
                      </div>
                    </div>
                    <p className="text-xs t-tertiary mt-1.5 leading-relaxed">{notif.desc}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {notif.actionUrl && (
                        <Link href={notif.actionUrl}>
                          <span className="text-[10px] t-gold flex items-center gap-1 cursor-pointer"><Zap size={10} />{notif.actionLabel}</span>
                        </Link>
                      )}
                      {!notif.read && (
                        <button onClick={() => markAsRead(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                          <Check size={10} /> {t("notif.markRead")}
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                        <Trash2 size={10} /> {t("common.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="mx-auto t-muted mb-4" />
          <p className="text-sm t-tertiary">{t("notif.noNotifications")}</p>
        </div>
      )}
    </div>
  );
}
