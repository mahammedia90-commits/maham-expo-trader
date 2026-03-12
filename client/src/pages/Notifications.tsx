/**
 * Notifications — Smart Alert System
 * Design: Obsidian Glass notification center
 * Features: Real-time alerts, booking updates, payment reminders, security warnings
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BellOff, Check, CheckCheck, AlertTriangle, CreditCard,
  FileText, Calendar, Shield, Sparkles, Clock, Trash2, Filter,
  ChevronDown, Settings, MessageSquare, MapPin, Star, Zap,
  XCircle, Info, CheckCircle2
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
  descEn: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabelAr?: string;
}

const iconMap: Record<NotifType, any> = {
  booking: Calendar,
  payment: CreditCard,
  contract: FileText,
  security: Shield,
  system: Info,
  ai: Sparkles,
  message: MessageSquare,
  review: Star,
};

const colorMap: Record<NotifType, string> = {
  booking: "text-blue-400",
  payment: "text-green-400",
  contract: "text-purple-400",
  security: "text-red-400",
  system: "text-white/50",
  ai: "text-[#C5A55A]",
  message: "text-cyan-400",
  review: "text-[#FBBF24]",
};

const bgMap: Record<NotifType, string> = {
  booking: "bg-blue-400/10",
  payment: "bg-green-400/10",
  contract: "bg-purple-400/10",
  security: "bg-red-400/10",
  system: "bg-white/5",
  ai: "bg-[#C5A55A]/10",
  message: "bg-cyan-400/10",
  review: "bg-[#FBBF24]/10",
};

const priorityBorder: Record<NotifPriority, string> = {
  high: "border-r-2 border-r-red-400/50",
  medium: "border-r-2 border-r-[#C5A55A]/30",
  low: "",
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "security",
    priority: "high",
    titleAr: "تنبيه أمني — محاولة تجاوز المنصة",
    titleEn: "Security Alert — Platform Bypass Attempt",
    descAr: "تم رصد محاولة مشاركة معلومات اتصال في المحادثة. تذكر أن المخالفة تعرضك لغرامة 50,000 ريال.",
    descEn: "Contact info sharing attempt detected. Violation may result in SAR 50,000 penalty.",
    time: "منذ 5 دقائق",
    read: false,
    actionUrl: "/messages",
    actionLabelAr: "عرض المحادثة",
  },
  {
    id: "n2",
    type: "payment",
    priority: "high",
    titleAr: "تذكير — موعد دفع القسط الثاني",
    titleEn: "Reminder — 2nd Installment Due",
    descAr: "يرجى سداد القسط الثاني بقيمة 12,500 ريال قبل 20 أبريل 2025. التأخير قد يؤدي لإلغاء الحجز.",
    descEn: "Please pay SAR 12,500 before April 20, 2025. Late payment may cancel booking.",
    time: "منذ ساعة",
    read: false,
    actionUrl: "/payments",
    actionLabelAr: "الدفع الآن",
  },
  {
    id: "n3",
    type: "booking",
    priority: "medium",
    titleAr: "تأكيد حجز الوحدة A21",
    titleEn: "Booking Confirmed — Unit A21",
    descAr: "تم تأكيد حجزك للوحدة A21 في معرض الرياض الدولي للتقنية. العقد الإلكتروني جاهز للتوقيع.",
    descEn: "Your booking for Unit A21 at Riyadh Tech Expo is confirmed. E-contract ready.",
    time: "منذ 3 ساعات",
    read: false,
    actionUrl: "/contracts",
    actionLabelAr: "توقيع العقد",
  },
  {
    id: "n4",
    type: "ai",
    priority: "medium",
    titleAr: "توصية ذكية — فرصة استثمارية",
    titleEn: "AI Recommendation — Investment Opportunity",
    descAr: "بناءً على نشاطك، ننصحك بحجز وحدة في معرض الأغذية القادم. الطلب مرتفع وتبقى 42 وحدة فقط.",
    descEn: "Based on your activity, we recommend booking at the upcoming F&B expo. Only 42 units left.",
    time: "منذ 5 ساعات",
    read: true,
    actionUrl: "/expos",
    actionLabelAr: "عرض المعرض",
  },
  {
    id: "n5",
    type: "contract",
    priority: "low",
    titleAr: "تحديث شروط العقد",
    titleEn: "Contract Terms Updated",
    descAr: "تم تحديث شروط وأحكام العقد الإلكتروني. يرجى مراجعة التغييرات والموافقة عليها.",
    descEn: "E-contract terms have been updated. Please review and approve changes.",
    time: "أمس",
    read: true,
    actionUrl: "/contracts",
    actionLabelAr: "مراجعة العقد",
  },
  {
    id: "n6",
    type: "review",
    priority: "low",
    titleAr: "مطلوب تقييم — معرض الأغذية 2024",
    titleEn: "Review Required — F&B Expo 2024",
    descAr: "يرجى تقييم تجربتك في معرض الأغذية والمشروبات 2024. تقييمك يساعدنا على التحسين.",
    descEn: "Please rate your experience at the F&B Expo 2024.",
    time: "الأسبوع الماضي",
    read: true,
    actionUrl: "/reviews",
    actionLabelAr: "تقييم الآن",
  },
  {
    id: "n7",
    type: "message",
    priority: "medium",
    titleAr: "رسالة جديدة من المشرف",
    titleEn: "New Message from Supervisor",
    descAr: "المشرف أرسل لك رسالة بخصوص ترتيبات الوحدة والخدمات اللوجستية.",
    descEn: "Supervisor sent you a message regarding unit arrangements and logistics.",
    time: "منذ ساعتين",
    read: false,
    actionUrl: "/messages",
    actionLabelAr: "عرض الرسالة",
  },
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

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("تم تعليم جميع الإشعارات كمقروءة");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("تم حذف الإشعار");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">الإشعارات</h2>
          <p className="text-xs text-[#C5A55A]/50 font-['Inter']">Notifications — {unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="glass-card px-3 py-1.5 rounded-lg text-[10px] text-[#C5A55A]/70 hover:text-[#C5A55A] transition-colors flex items-center gap-1"
            >
              <CheckCheck size={12} />
              تعليم الكل كمقروء
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { value: "all", label: "الكل", count: notifications.length },
          { value: "security", label: "أمان", count: notifications.filter(n => n.type === "security").length },
          { value: "payment", label: "مدفوعات", count: notifications.filter(n => n.type === "payment").length },
          { value: "booking", label: "حجوزات", count: notifications.filter(n => n.type === "booking").length },
          { value: "message", label: "رسائل", count: notifications.filter(n => n.type === "message").length },
          { value: "ai", label: "AI", count: notifications.filter(n => n.type === "ai").length },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
              filter === f.value
                ? "bg-[#C5A55A]/15 border border-[rgba(197,165,90,0.3)] text-[#E8D5A3]"
                : "glass-card text-white/40 hover:text-white/60"
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[9px]">{f.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Toggle Read */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowRead(!showRead)}
          className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/50 transition-colors"
        >
          {showRead ? <Bell size={12} /> : <BellOff size={12} />}
          {showRead ? "إخفاء المقروءة" : "عرض الكل"}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const Icon = iconMap[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-xl p-4 ${priorityBorder[notif.priority]} ${!notif.read ? "bg-white/[0.02]" : ""}`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${bgMap[notif.type]} flex items-center justify-center`}>
                    <Icon size={16} className={colorMap[notif.type]} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${!notif.read ? "text-white/80" : "text-white/50"}`}>
                          {notif.titleAr}
                        </p>
                        <p className="text-[9px] text-white/20 font-['Inter']">{notif.titleEn}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-white/20">{notif.time}</span>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-[#C5A55A]" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{notif.descAr}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {notif.actionUrl && (
                        <a href={notif.actionUrl} className="text-[10px] text-[#C5A55A] hover:text-[#E8D5A3] transition-colors flex items-center gap-1">
                          <Zap size={10} />
                          {notif.actionLabelAr}
                        </a>
                      )}
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1"
                        >
                          <Check size={10} />
                          تعليم كمقروء
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[10px] text-white/15 hover:text-red-400/50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={10} />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-sm text-white/40">لا توجد إشعارات</p>
          <p className="text-xs text-white/20 font-['Inter']">No notifications</p>
        </div>
      )}
    </div>
  );
}
