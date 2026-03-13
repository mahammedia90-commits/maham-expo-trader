/**
 * Notifications — Smart Alert System
 * Theme-aware: uses CSS variables for Light/Dark mode
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Bell, BellOff, Check, CheckCheck, CreditCard,
  FileText, Calendar, Shield, Sparkles, Trash2,
  MessageSquare, Star, Zap, Info
} from "lucide-react";
import { toast } from "sonner";

type NotifType = "booking" | "payment" | "contract" | "security" | "system" | "ai" | "message" | "review";
type NotifPriority = "high" | "medium" | "low";

interface Notification {
  id: string;
  type: NotifType;
  priority: NotifPriority;
  titleAr: string;
  titleEn: string;
  descAr: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabelAr?: string;
}

const iconMap: Record<NotifType, any> = { booking: Calendar, payment: CreditCard, contract: FileText, security: Shield, system: Info, ai: Sparkles, message: MessageSquare, review: Star };

const typeColors: Record<NotifType, string> = {
  booking: "var(--status-blue)", payment: "var(--status-green)", contract: "#A855F7",
  security: "var(--status-red)", system: "var(--text-muted)", ai: "var(--gold-accent)",
  message: "#22D3EE", review: "var(--status-yellow)",
};

const initialNotifications: Notification[] = [
  { id: "n1", type: "security", priority: "high", titleAr: "تنبيه أمني — محاولة تجاوز المنصة", titleEn: "Security Alert", descAr: "تم رصد محاولة مشاركة معلومات اتصال في المحادثة. تذكر أن المخالفة تعرضك لغرامة 50,000 ريال.", time: "منذ 5 دقائق", read: false, actionUrl: "/messages", actionLabelAr: "عرض المحادثة" },
  { id: "n2", type: "payment", priority: "high", titleAr: "تذكير — موعد دفع القسط الثاني", titleEn: "Payment Reminder", descAr: "يرجى سداد القسط الثاني بقيمة 12,500 ريال قبل 20 أبريل 2025. التأخير قد يؤدي لإلغاء الحجز.", time: "منذ ساعة", read: false, actionUrl: "/payments", actionLabelAr: "الدفع الآن" },
  { id: "n3", type: "booking", priority: "medium", titleAr: "تأكيد حجز الوحدة A21", titleEn: "Booking Confirmed", descAr: "تم تأكيد حجزك للوحدة A21 في معرض الرياض الدولي للتقنية. العقد الإلكتروني جاهز للتوقيع.", time: "منذ 3 ساعات", read: false, actionUrl: "/contracts", actionLabelAr: "توقيع العقد" },
  { id: "n4", type: "ai", priority: "medium", titleAr: "توصية ذكية — فرصة استثمارية", titleEn: "AI Recommendation", descAr: "بناءً على نشاطك، ننصحك بحجز وحدة في معرض الأغذية القادم. الطلب مرتفع وتبقى 42 وحدة فقط.", time: "منذ 5 ساعات", read: true, actionUrl: "/expos", actionLabelAr: "عرض المعرض" },
  { id: "n5", type: "contract", priority: "low", titleAr: "تحديث شروط العقد", titleEn: "Contract Updated", descAr: "تم تحديث شروط وأحكام العقد الإلكتروني. يرجى مراجعة التغييرات والموافقة عليها.", time: "أمس", read: true, actionUrl: "/contracts", actionLabelAr: "مراجعة العقد" },
  { id: "n6", type: "review", priority: "low", titleAr: "مطلوب تقييم — معرض الأغذية 2024", titleEn: "Review Required", descAr: "يرجى تقييم تجربتك في معرض الأغذية والمشروبات 2024. تقييمك يساعدنا على التحسين.", time: "الأسبوع الماضي", read: true, actionUrl: "/reviews", actionLabelAr: "تقييم الآن" },
  { id: "n7", type: "message", priority: "medium", titleAr: "رسالة جديدة من المشرف", titleEn: "New Message", descAr: "المشرف أرسل لك رسالة بخصوص ترتيبات الوحدة والخدمات اللوجستية.", time: "منذ ساعتين", read: false, actionUrl: "/messages", actionLabelAr: "عرض الرسالة" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | NotifType>("all");
  const [showRead, setShowRead] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => {
    const matchType = filter === "all" || n.type === filter;
    const matchRead = showRead || !n.read;
    return matchType && matchRead;
  });

  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success("تم تعليم جميع الإشعارات كمقروءة"); };
  const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success("تم حذف الإشعار"); };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">الإشعارات</h2>
          <p className="text-[10px] sm:text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>Notifications — {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-gold transition-colors flex items-center gap-1">
            <CheckCheck size={12} /> تعليم الكل كمقروء
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { value: "all", label: "الكل", count: notifications.length },
          { value: "security", label: "أمان", count: notifications.filter(n => n.type === "security").length },
          { value: "payment", label: "مدفوعات", count: notifications.filter(n => n.type === "payment").length },
          { value: "booking", label: "حجوزات", count: notifications.filter(n => n.type === "booking").length },
          { value: "message", label: "رسائل", count: notifications.filter(n => n.type === "message").length },
          { value: "ai", label: "AI", count: notifications.filter(n => n.type === "ai").length },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
              filter === f.value ? "bg-gold-subtle border-gold t-gold" : "glass-card t-tertiary"
            }`}
            style={filter === f.value ? { border: "1px solid var(--gold-border)" } : undefined}>
            {f.label}
            {f.count > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ backgroundColor: "var(--glass-bg)" }}>{f.count}</span>}
          </button>
        ))}
      </div>

      <button onClick={() => setShowRead(!showRead)} className="flex items-center gap-1.5 text-[10px] t-muted transition-colors">
        {showRead ? <Bell size={12} /> : <BellOff size={12} />}
        {showRead ? "إخفاء المقروءة" : "عرض الكل"}
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
                  borderRight: notif.priority === "high" ? `2px solid color-mix(in srgb, var(--status-red) 50%, transparent)` : notif.priority === "medium" ? `2px solid var(--gold-border)` : undefined,
                  backgroundColor: !notif.read ? "var(--glass-bg-hover)" : undefined,
                }}>
                <div className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${!notif.read ? "t-primary" : "t-secondary"}`}>{notif.titleAr}</p>
                        <p className="text-[9px] t-muted font-['Inter']">{notif.titleEn}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] t-muted">{notif.time}</span>
                        {!notif.read && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />}
                      </div>
                    </div>
                    <p className="text-xs t-tertiary mt-1.5 leading-relaxed">{notif.descAr}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {notif.actionUrl && (
                        <Link href={notif.actionUrl}>
                          <span className="text-[10px] t-gold flex items-center gap-1 cursor-pointer"><Zap size={10} />{notif.actionLabelAr}</span>
                        </Link>
                      )}
                      {!notif.read && (
                        <button onClick={() => markAsRead(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                          <Check size={10} /> تعليم كمقروء
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                        <Trash2 size={10} /> حذف
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
          <p className="text-sm t-tertiary">لا توجد إشعارات</p>
          <p className="text-xs t-muted font-['Inter']">No notifications</p>
        </div>
      )}
    </div>
  );
}
