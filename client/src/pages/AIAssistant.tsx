/**
 * AIAssistant — Advanced AI-powered assistant for traders
 * Features:
 * - Real event data analysis & recommendations
 * - Trader profile-aware responses
 * - Booking/payment/contract status tracking
 * - Smart suggestions based on trader activity
 * - Multi-context understanding (events, bookings, payments, contracts, operations)
 * - AI-powered booth recommendations based on business type
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Bot, Send, Sparkles, MessageSquare, Lightbulb, HelpCircle,
  FileText, MapPin, TrendingUp, Shield, CreditCard, Building2,
  Calendar, Star, Users, BarChart3, Zap, Brain, Target,
  CheckCircle, AlertTriangle, Clock, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { events2026, eventStats, type ExpoEvent } from "@/data/events2026";

interface Message {
  id: number;
  role: "user" | "assistant";
  contentAr: string;
  contentEn: string;
  time: string;
  actions?: { label: string; path: string }[];
  analysis?: { label: string; value: string; color: string }[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState<"general" | "analysis" | "recommendation">("general");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { trader, canBook, bookings, payments, contracts, kycData } = useAuth();
  const [, navigate] = useLocation();

  // Initialize with personalized welcome
  useEffect(() => {
    const name = trader?.name || "التاجر";
    const kycStatus = trader?.kycStatus === "verified" ? "موثق" : "غير موثق";
    const bookingCount = bookings.length;
    const pendingPayments = bookings.filter(b => b.paymentStatus === "unpaid" || b.paymentStatus === "deposit_paid").length;

    setMessages([{
      id: 1,
      role: "assistant",
      contentAr: `مرحباً ${name}! أنا المساعد الذكي لمنصة مهام إكسبو، مدعوم بتقنيات الذكاء الاصطناعي المتقدمة.\n\n📊 ملخص حسابك:\n• حالة التوثيق: ${kycStatus}\n• الحجوزات: ${bookingCount} حجز\n• مدفوعات معلقة: ${pendingPayments}\n• العقود: ${contracts.length} عقد\n• الفعاليات المتاحة: ${eventStats.openEvents} فعالية\n\nكيف يمكنني مساعدتك اليوم؟`,
      contentEn: `Welcome ${name}! I'm the Maham Expo AI Assistant, powered by advanced AI technology.\n\n📊 Account Summary:\n• Verification: ${kycStatus === "موثق" ? "Verified" : "Not Verified"}\n• Bookings: ${bookingCount}\n• Pending Payments: ${pendingPayments}\n• Contracts: ${contracts.length}\n• Available Events: ${eventStats.openEvents}\n\nHow can I help you today?`,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    }]);
  }, [trader, bookings, contracts]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI Context-aware response engine
  const generateAIResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // ═══════════════════════════════════════
    // EVENTS & AVAILABILITY
    // ═══════════════════════════════════════
    if (q.includes("فعالي") || q.includes("معرض") || q.includes("event") || q.includes("expo") || q.includes("متاح")) {
      const openEvents = events2026.filter(e => e.status === "open" || e.status === "closing_soon");
      const closingSoon = events2026.filter(e => e.status === "closing_soon");
      const featured = events2026.filter(e => e.featured);

      let eventList = openEvents.slice(0, 5).map(e =>
        `• ${e.nameAr} — ${e.city} | ${e.availableUnits} وحدة متاحة | ${e.priceRange} ر.س`
      ).join("\n");

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `📊 تحليل الفعاليات المتاحة حالياً:\n\n🟢 فعاليات مفتوحة للحجز: ${openEvents.length}\n🟡 تغلق قريباً: ${closingSoon.length}\n⭐ فعاليات مميزة: ${featured.length}\n📍 إجمالي الوحدات المتاحة: ${eventStats.availableUnits.toLocaleString()}\n\nأبرز الفعاليات:\n${eventList}\n\n💡 توصية AI: ${closingSoon.length > 0 ? `هناك ${closingSoon.length} فعالية تغلق قريباً — أنصحك بالحجز الآن قبل نفاد الوحدات!` : "جميع الفعاليات متاحة حالياً، خذ وقتك في الاختيار."}`,
        contentEn: `📊 Available Events Analysis:\n\n🟢 Open for booking: ${openEvents.length}\n🟡 Closing soon: ${closingSoon.length}\n⭐ Featured: ${featured.length}\n📍 Total available units: ${eventStats.availableUnits.toLocaleString()}\n\nTop events listed above.\n\n💡 AI Recommendation: ${closingSoon.length > 0 ? `${closingSoon.length} events closing soon — book now!` : "All events currently available."}`,
        actions: [
          { label: "تصفح المعارض", path: "/expos" },
          { label: "عرض الخريطة", path: "/map" },
        ],
      };
    }

    // ═══════════════════════════════════════
    // BOOKING STATUS
    // ═══════════════════════════════════════
    if (q.includes("حجز") || q.includes("حجوز") || q.includes("booking") || q.includes("status")) {
      if (bookings.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          contentAr: "📋 لا توجد حجوزات حالياً في حسابك.\n\n💡 توصية AI: ابدأ بتصفح المعارض المتاحة واختيار الفعالية المناسبة لنشاطك التجاري. لدينا حالياً " + eventStats.openEvents + " فعالية مفتوحة للحجز.",
          contentEn: "📋 No bookings found in your account.\n\n💡 AI Recommendation: Start browsing available expos and choose the right event for your business. We currently have " + eventStats.openEvents + " open events.",
          actions: [{ label: "تصفح المعارض", path: "/expos" }],
        };
      }

      const pending = bookings.filter(b => b.paymentStatus === "unpaid");
      const confirmed = bookings.filter(b => b.status === "confirmed");
      const totalValue = bookings.reduce((a, b) => a + b.price, 0);

      let bookingList = bookings.slice(0, 4).map(b => {
        const statusEmoji = b.status === "confirmed" ? "✅" : b.status === "pending_payment" ? "⏳" : "❌";
        return `${statusEmoji} ${b.id} — ${b.unitAr} في ${b.expoNameAr}\n   الحالة: ${b.status === "confirmed" ? "مؤكد" : "بانتظار الدفع"} | المبلغ: ${b.price.toLocaleString()} ر.س`;
      }).join("\n\n");

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `📊 تحليل حجوزاتك:\n\n📋 إجمالي الحجوزات: ${bookings.length}\n✅ مؤكدة: ${confirmed.length}\n⏳ بانتظار الدفع: ${pending.length}\n💰 القيمة الإجمالية: ${totalValue.toLocaleString()} ر.س\n\n${bookingList}\n\n${pending.length > 0 ? `⚠️ تنبيه AI: لديك ${pending.length} حجز بانتظار الدفع. أكمل الدفع لإصدار العقد وتأكيد الحجز.` : "✅ جميع حجوزاتك مؤكدة ومكتملة الدفع."}`,
        contentEn: `📊 Bookings Analysis:\n\n📋 Total: ${bookings.length}\n✅ Confirmed: ${confirmed.length}\n⏳ Pending: ${pending.length}\n💰 Total Value: ${totalValue.toLocaleString()} SAR`,
        actions: [
          { label: "عرض الحجوزات", path: "/bookings" },
          ...(pending.length > 0 ? [{ label: "إكمال الدفع", path: "/payments" }] : []),
        ],
        analysis: [
          { label: "إجمالي الحجوزات", value: String(bookings.length), color: "var(--status-blue)" },
          { label: "مؤكدة", value: String(confirmed.length), color: "var(--status-green)" },
          { label: "معلقة", value: String(pending.length), color: "var(--status-yellow)" },
          { label: "القيمة", value: `${(totalValue / 1000).toFixed(0)}K`, color: "var(--gold-accent)" },
        ],
      };
    }

    // ═══════════════════════════════════════
    // PAYMENTS
    // ═══════════════════════════════════════
    if (q.includes("دفع") || q.includes("مدفوع") || q.includes("سداد") || q.includes("payment") || q.includes("pay")) {
      const totalPaid = payments.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
      const pendingBookings = bookings.filter(b => b.paymentStatus !== "fully_paid");
      const totalRemaining = pendingBookings.reduce((a, b) => a + b.remainingAmount, 0);

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `💳 تحليل المدفوعات:\n\n✅ إجمالي المدفوع: ${totalPaid.toLocaleString()} ر.س\n⏳ المبلغ المتبقي: ${totalRemaining.toLocaleString()} ر.س\n📋 عدد المعاملات: ${payments.length}\n\n${pendingBookings.length > 0 ? `⚠️ لديك ${pendingBookings.length} حجز يحتاج لإكمال الدفع:\n${pendingBookings.map(b => `• ${b.id}: متبقي ${b.remainingAmount.toLocaleString()} ر.س`).join("\n")}\n\n💡 تذكير: العقد يصدر فقط بعد اكتمال الدفع بالكامل.` : "✅ جميع المدفوعات مكتملة!"}`,
        contentEn: `💳 Payment Analysis:\n\n✅ Total Paid: ${totalPaid.toLocaleString()} SAR\n⏳ Remaining: ${totalRemaining.toLocaleString()} SAR\n📋 Transactions: ${payments.length}`,
        actions: [{ label: "المدفوعات", path: "/payments" }],
      };
    }

    // ═══════════════════════════════════════
    // CONTRACTS
    // ═══════════════════════════════════════
    if (q.includes("عقد") || q.includes("عقود") || q.includes("contract")) {
      if (contracts.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          contentAr: "📄 لا توجد عقود صادرة حالياً.\n\n💡 العقد يصدر تلقائياً بعد إكمال الدفع بالكامل. تأكد من:\n1. توثيق حسابك (KYC)\n2. حجز وحدة في أحد المعارض\n3. إكمال الدفع بالكامل\n\nبعد ذلك يصدر العقد تلقائياً ويُرسل لك عبر SMS + Email + WhatsApp.",
          contentEn: "📄 No contracts issued yet.\n\n💡 Contracts are auto-generated after full payment. Ensure:\n1. KYC verification\n2. Book a unit\n3. Complete full payment\n\nContract will be sent via SMS + Email + WhatsApp.",
          actions: [{ label: "العقود", path: "/contracts" }],
        };
      }

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `📄 العقود الصادرة: ${contracts.length}\n\n${contracts.map(c => `• ${c.id} — ${c.expoNameAr}\n  البوث: ${c.boothNumber} | القيمة: ${c.totalValue.toLocaleString()} ر.س\n  الحالة: ${c.status === "signed" ? "موقّع ✅" : "بانتظار التوقيع ⏳"}\n  تم الإرسال عبر: ${c.sentVia.length > 0 ? c.sentVia.join(", ") : "لم يُرسل بعد"}`).join("\n\n")}`,
        contentEn: `📄 Contracts Issued: ${contracts.length}`,
        actions: [{ label: "عرض العقود", path: "/contracts" }],
      };
    }

    // ═══════════════════════════════════════
    // KYC / VERIFICATION
    // ═══════════════════════════════════════
    if (q.includes("توثيق") || q.includes("kyc") || q.includes("تحقق") || q.includes("verif")) {
      const isVerified = trader?.kycStatus === "verified";
      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: isVerified
          ? `✅ حسابك موثق بالكامل!\n\n📋 البيانات المسجلة:\n• الاسم: ${kycData?.fullName || trader?.name || "—"}\n• الشركة: ${kycData?.companyName || trader?.companyName || "—"}\n• رقم السجل التجاري: ${kycData?.crNumber || "—"}\n• الرقم الضريبي: ${kycData?.vatNumber || "—"}\n\nيمكنك الآن حجز أي وحدة في أي معرض.`
          : `⚠️ حسابك غير موثق بعد!\n\nلتوثيق حسابك تحتاج:\n1. ✅ البيانات الشخصية\n2. ✅ بيانات الشركة\n3. ✅ الحساب البنكي\n4. ✅ رفع المستندات (الهوية، السجل التجاري، شهادة VAT، بروفايل الشركة)\n5. ✅ الإقرار القانوني\n\n💡 بدون التوثيق لا يمكنك حجز أي وحدة.`,
        contentEn: isVerified
          ? `✅ Your account is fully verified! You can now book any unit.`
          : `⚠️ Account not verified! Complete KYC to start booking.`,
        actions: isVerified ? [{ label: "تصفح المعارض", path: "/expos" }] : [{ label: "توثيق الحساب", path: "/kyc" }],
      };
    }

    // ═══════════════════════════════════════
    // RECOMMENDATIONS (AI-powered)
    // ═══════════════════════════════════════
    if (q.includes("نصيح") || q.includes("توصي") || q.includes("أفضل") || q.includes("recommend") || q.includes("best") || q.includes("suggest")) {
      const activity = trader?.activity || kycData?.businessType || "";
      let recommended: ExpoEvent[] = [];
      let reason = "";

      if (activity.includes("food") || activity.includes("أغذ") || activity.includes("مشروب")) {
        recommended = events2026.filter(e => e.category.includes("أغذية") || e.category.includes("رمضان") || e.category.includes("أعياد"));
        reason = "بناءً على نشاطك في قطاع الأغذية والمشروبات";
      } else if (activity.includes("tech") || activity.includes("تقنية")) {
        recommended = events2026.filter(e => e.category.includes("تقنية"));
        reason = "بناءً على نشاطك في قطاع التقنية والابتكار";
      } else if (activity.includes("retail") || activity.includes("تجارة")) {
        recommended = events2026.filter(e => e.category.includes("استهلاكية") || e.featured);
        reason = "بناءً على نشاطك في قطاع التجارة";
      } else {
        recommended = events2026.filter(e => e.featured).slice(0, 4);
        reason = "بناءً على أعلى الفعاليات تقييماً وأكثرها زواراً";
      }

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `🤖 توصيات الذكاء الاصطناعي — ${reason}:\n\n${recommended.slice(0, 4).map((e, i) => `${i + 1}. ${e.nameAr}\n   📍 ${e.venue} | 📅 ${e.dateStart}\n   👥 ${e.footfall} | ⭐ ${e.rating}\n   💰 ${e.priceRange} ر.س | 🏢 ${e.availableUnits} وحدة متاحة`).join("\n\n")}\n\n💡 نصيحة AI: اختر الفعالية الأقرب لتاريخ اليوم لضمان أفضل المواقع المتاحة.`,
        contentEn: `🤖 AI Recommendations — Based on your business profile:\n\n${recommended.slice(0, 4).map((e, i) => `${i + 1}. ${e.nameEn} — ${e.availableUnits} units available`).join("\n")}`,
        actions: [{ label: "تصفح المعارض", path: "/expos" }],
      };
    }

    // ═══════════════════════════════════════
    // FOOD & BEVERAGE ANALYSIS
    // ═══════════════════════════════════════
    if (q.includes("أغذ") || q.includes("مشروب") || q.includes("food") || q.includes("f&b") || q.includes("مطعم") || q.includes("كافي")) {
      const fbEvents = events2026.filter(e => e.category.includes("أغذية") || e.category.includes("رمضان") || e.nameAr.includes("طعام"));
      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `🍽️ تحليل AI لقطاع الأغذية والمشروبات:\n\n📊 فعاليات F&B المتاحة: ${fbEvents.length}\n\n${fbEvents.map(e => `• ${e.nameAr}\n  📍 ${e.venue} | ${e.availableUnits} وحدة متاحة\n  💰 ${e.priceRange} ر.س | 👥 ${e.footfall}`).join("\n\n")}\n\n💡 تحليل AI:\n• أفضل المواقع لـ F&B: المناطق القريبة من مداخل الزوار ومناطق الترفيه\n• متوسط إنفاق الزائر على الطعام: 45-85 ر.س\n• أوقات الذروة: 12-2 ظهراً و 7-10 مساءً\n• نصيحة: احجز بوث زاوية أو جزيرة عرض لأقصى رؤية`,
        contentEn: `🍽️ AI F&B Sector Analysis:\n\n${fbEvents.length} F&B events available with detailed analysis above.`,
        actions: [{ label: "تصفح فعاليات F&B", path: "/expos" }],
      };
    }

    // ═══════════════════════════════════════
    // OPERATIONS & PERMITS
    // ═══════════════════════════════════════
    if (q.includes("تصريح") || q.includes("عملي") || q.includes("permit") || q.includes("operation")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `🔧 دليل العمليات والتصاريح:\n\n📋 التصاريح المطلوبة:\n1. تصريح تشغيل — يصدر تلقائياً بعد توقيع العقد\n2. تصريح الدفاع المدني — يتطلب فحص السلامة\n3. تصريح صحي (للأغذية) — من هيئة الغذاء والدواء\n4. تصريح بلدي — من الأمانة المختصة\n\n⏱️ المدة المتوقعة: 3-5 أيام عمل\n\n💡 نصيحة AI: ابدأ بتجهيز المستندات مبكراً لتجنب التأخير. يمكنك رفع المستندات من قسم العمليات.`,
        contentEn: `🔧 Operations & Permits Guide:\n\nRequired permits listed above. Processing time: 3-5 business days.`,
        actions: [{ label: "العمليات", path: "/operations" }],
      };
    }

    // ═══════════════════════════════════════
    // ANALYTICS & INSIGHTS
    // ═══════════════════════════════════════
    if (q.includes("تحليل") || q.includes("إحصائ") || q.includes("analytic") || q.includes("insight") || q.includes("بيانات")) {
      const totalBookingValue = bookings.reduce((a, b) => a + b.price, 0);
      const avgBookingValue = bookings.length > 0 ? totalBookingValue / bookings.length : 0;

      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `📊 تحليلات AI المتقدمة:\n\n🏢 إحصائيات حسابك:\n• إجمالي قيمة الحجوزات: ${totalBookingValue.toLocaleString()} ر.س\n• متوسط قيمة الحجز: ${avgBookingValue.toLocaleString()} ر.س\n• عدد الفعاليات المشارك فيها: ${new Set(bookings.map(b => b.expoId)).size}\n\n📈 إحصائيات المنصة:\n• إجمالي الفعاليات 2026: ${eventStats.totalEvents}\n• الوحدات المتاحة: ${eventStats.availableUnits.toLocaleString()} من ${eventStats.totalUnits.toLocaleString()}\n• نسبة الإشغال العامة: ${Math.round(((eventStats.totalUnits - eventStats.availableUnits) / eventStats.totalUnits) * 100)}%\n\n💡 توصية AI: ${avgBookingValue > 30000 ? "أنت من التجار المميزين! أنصحك بالتواصل للحصول على عروض VIP حصرية." : "جرب الفعاليات المميزة لتحقيق أعلى عائد على الاستثمار."}`,
        contentEn: `📊 Advanced AI Analytics:\n\nYour account and platform statistics detailed above.`,
        actions: [{ label: "التحليلات", path: "/analytics" }],
        analysis: [
          { label: "قيمة الحجوزات", value: `${(totalBookingValue / 1000).toFixed(0)}K`, color: "var(--gold-accent)" },
          { label: "الفعاليات", value: String(eventStats.totalEvents), color: "var(--status-blue)" },
          { label: "الإشغال", value: `${Math.round(((eventStats.totalUnits - eventStats.availableUnits) / eventStats.totalUnits) * 100)}%`, color: "var(--status-green)" },
        ],
      };
    }

    // ═══════════════════════════════════════
    // HELP & SUPPORT
    // ═══════════════════════════════════════
    if (q.includes("مساعد") || q.includes("help") || q.includes("دعم") || q.includes("support")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        contentAr: `🤝 مركز المساعدة:\n\nيمكنني مساعدتك في:\n\n1. 🏢 تصفح المعارض والفعاليات — اسأل عن الفعاليات المتاحة\n2. 📋 حالة الحجوزات — اسأل عن حجوزاتك\n3. 💳 المدفوعات — استفسر عن المبالغ والمعاملات\n4. 📄 العقود — تتبع حالة عقودك\n5. 🔐 التوثيق (KYC) — مساعدة في إكمال التحقق\n6. 🤖 توصيات ذكية — أفضل الفعاليات لنشاطك\n7. 📊 تحليلات — إحصائيات حسابك والمنصة\n8. 🔧 العمليات — دليل التصاريح والخدمات\n\n💡 جرب أن تسأل: "ما أفضل فعالية لنشاطي؟" أو "كم المبلغ المتبقي؟"`,
        contentEn: `🤝 Help Center:\n\nI can help with: Events, Bookings, Payments, Contracts, KYC, Recommendations, Analytics, and Operations.`,
        actions: [{ label: "مركز المساعدة", path: "/help" }],
      };
    }

    // ═══════════════════════════════════════
    // DEFAULT — Smart fallback
    // ═══════════════════════════════════════
    return {
      id: Date.now() + 1, role: "assistant", time,
      contentAr: `شكراً لسؤالك! بناءً على تحليل AI:\n\n${!canBook ? "⚠️ أولاً: حسابك يحتاج توثيق قبل البدء بالحجز.\n\n" : ""}📌 معلومات قد تفيدك:\n• لدينا حالياً ${eventStats.openEvents} فعالية مفتوحة للحجز\n• ${eventStats.availableUnits.toLocaleString()} وحدة تجارية متاحة\n• ${bookings.filter(b => b.paymentStatus !== "fully_paid").length} حجز يحتاج إكمال الدفع\n\nيمكنك سؤالي عن:\n• الفعاليات والمعارض المتاحة\n• حالة حجوزاتك ومدفوعاتك\n• توصيات ذكية لنشاطك التجاري\n• العقود والتصاريح`,
      contentEn: `Thank you for your question! Based on AI analysis, here's what I can help with. Ask about events, bookings, payments, or get smart recommendations.`,
      actions: [
        { label: "تصفح المعارض", path: "/expos" },
        { label: "حجوزاتي", path: "/bookings" },
      ],
    };
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      contentAr: msg,
      contentEn: msg,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(msg);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const suggestions = [
    { textAr: "ما الفعاليات المتاحة حالياً؟", textEn: "What events are available?", icon: Building2 },
    { textAr: "أريد معرفة حالة حجوزاتي", textEn: "Check my booking status", icon: FileText },
    { textAr: "أعطني توصيات لنشاطي التجاري", textEn: "Recommend events for my business", icon: Target },
    { textAr: "تحليل مدفوعاتي وعقودي", textEn: "Analyze my payments & contracts", icon: BarChart3 },
    { textAr: "كيف أوثق حسابي؟", textEn: "How to verify my account?", icon: Shield },
    { textAr: "تحليلات AI متقدمة", textEn: "Advanced AI analytics", icon: Brain },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
          <Bot size={20} className="text-[var(--btn-gold-text)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold t-primary">المساعد الذكي</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI Smart Assistant — Powered by MAHAM AI</p>
        </div>
        <div className="mr-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse" />
          <span className="text-[10px] text-[var(--status-green)]/70">متصل | Online</span>
        </div>
      </div>

      {/* AI Mode Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "general" as const, label: "محادثة عامة", icon: MessageSquare },
          { id: "analysis" as const, label: "تحليلات", icon: BarChart3 },
          { id: "recommendation" as const, label: "توصيات", icon: Target },
        ].map(mode => (
          <button key={mode.id} onClick={() => setAiMode(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all whitespace-nowrap ${aiMode === mode.id ? "btn-gold" : "glass-card t-tertiary"}`}>
            <mode.icon size={12} />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                m.role === "user"
                  ? "bg-gold-subtle border border-[#C5A55A]/15"
                  : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              }`}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="t-gold" />
                    <span className="text-[10px] t-gold/70 font-['Inter']">MAHAM AI</span>
                  </div>
                )}
                <p className="text-sm t-primary whitespace-pre-line leading-relaxed">{m.contentAr}</p>

                {/* Analysis Cards */}
                {m.analysis && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {m.analysis.map((a, i) => (
                      <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-sm font-bold font-['Inter']" style={{ color: a.color }}>{a.value}</p>
                        <p className="text-[8px] t-muted">{a.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {m.actions && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {m.actions.map((a, i) => (
                      <button key={i} onClick={() => navigate(a.path)}
                        className="px-3 py-1.5 rounded-lg text-[10px] bg-gold-subtle t-gold border border-[#C5A55A]/20 hover:bg-[#C5A55A]/20 transition-colors flex items-center gap-1">
                        <ArrowLeft size={10} />
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}

                {m.role === "assistant" && (
                  <p className="text-[10px] t-muted font-['Inter'] mt-2 whitespace-pre-line">{m.contentEn}</p>
                )}
                <p className="text-[9px] t-muted font-['Inter'] mt-2 text-left">{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
            <div className="bg-[var(--glass-bg)] rounded-2xl px-4 py-3 border border-[var(--glass-border)]">
              <div className="flex items-center gap-1.5">
                <Brain size={12} className="t-gold animate-pulse" />
                <span className="text-xs t-tertiary">AI يحلل البيانات...</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.textAr)}
              className="glass-card rounded-xl p-3 text-right hover:bg-[var(--glass-bg)] hover:border-[var(--gold-border)] transition-all"
            >
              <s.icon size={14} className="t-gold mb-1.5" />
              <p className="text-[11px] t-secondary">{s.textAr}</p>
              <p className="text-[9px] t-muted font-['Inter']">{s.textEn}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اسأل AI عن الفعاليات، الحجوزات، التوصيات... | Ask AI anything..."
          className="flex-1 bg-transparent text-sm t-primary placeholder:t-muted outline-none"
          dir="rtl"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={16} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
